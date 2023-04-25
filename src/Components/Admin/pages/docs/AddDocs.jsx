import React, { useState } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import { makeStyles } from '@mui/styles';
import { FaArrowLeft } from 'react-icons/fa';
import * as Yup from "yup";
import {tw} from "twind";
//controls
import {
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Typography,
    TextField
} from '@mui/material';
import {BiBookAdd} from "react-icons/bi"
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import { useMutation } from 'react-query';
import { createDoc } from '../../api/docs/createDoc';
import ErrorMessage from '../components/ErrorMessage';
import { colors } from '../theme/colors';
import Loader from '../components/Loader';
import { storage } from '../../../../firebase';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import withAdminCheck from '../withAdminCheck'


const useStyles = makeStyles((theme) => ({
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "2rem",
      marginTop: "4rem",
      padding: "4rem",
      borderRadius: "2rem",
      backgroundColor: colors.white,
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
    },
    button: {
      backgroundColor: colors.green,
      color: colors.white,
      fontWeight: "bold",
      "&:hover": {
        backgroundColor: colors.darkGreen,
      },
    },
    formControl: {
      minWidth: "120px",
    },
    selectEmpty: {
      marginTop: "10px",
    },
  }));

  const AddBookSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
  });

const AddDocs = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const classes = useStyles();
    const history = useHistory();
    const [category, setCategory] = useState("");
    const [Progress, setProgress] = useState(0);
    const [Doc, setDoc] = useState(null);
    const { isLoading, error, mutate } = useMutation(createDoc);

    const handleDocChange = (e) => {
        if (e.target.files[0]) {
          setDoc(e.target.files[0]);
        }
    };

    const formik = useFormik({
        initialValues: {
        name: "",
        description: "",
        category: "",
        doc: ""
        },
        validationSchema: AddBookSchema,
        onSubmit: async (values) => {
            // Upload image to Firebase Storage
        const docRef = ref(storage, 'docs/'+Doc.name+Date.now());
        
        const uploadTask = uploadBytesResumable(docRef, Doc);
        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
        (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100, 2);
        setProgress(progress);
        switch (snapshot.state) {
            case 'paused':
            console.log('Upload is paused');
            break;
            case 'running':
            console.log('Upload is running');
            break;
        }
        },
        (error) => {
        // Handle unsuccessful uploads
        console.error(error);
        },
        async () => {
        // Handle successful uploads on complete
        console.log('File uploaded successfully');
        
        // Get download URL of uploaded file
        await getDownloadURL(docRef).then((docURL) => {
            const doc = {
            name: values.name,
            description: values.description,
            category: category,
            doc: docURL
            };
            // Save book data to Firestore
            mutate(doc, {
                onSuccess: () => history.push("/showdocs"),
            });
        });
        }
    );
        },
    });
    return (
        <div className="flex h-screen overflow-hidden">

        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Content area */}
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

            {/*  Site header */}
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <main className='h-full'>
                <div className="w-full h-full flex">
                    <div className='flex flex-col mx-auto relative w-1/2 top-1/2 -translate-y-1/2'>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<FaArrowLeft />}
                            onClick={() => history.goBack()}
                            className={tw`my-4`}
                        >
                            Back
                        </Button>

                        <form onSubmit={formik.handleSubmit} className="w-full max-w-2xl my-auto">
                            <h2 className={tw`text-3xl font-semibold mb-5`}>Add Documents</h2>
                            {error && <ErrorMessage message={error.message} />}
                            {isLoading && <Loader />}
                            <label htmlFor="titleInput" className="text-gray-700 font-medium mb-2 block">
                                Name
                            </label>
                            <TextField
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                className="mb-4"
                                id="name"
                                name="name"
                                label="Name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                            <label htmlFor="descriptionInput" className="text-gray-700 font-medium mb-2 block mt-6">
                                Description
                            </label>
                            <TextField
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                className="mb-4"
                                id="description"
                                name="description"
                                label="Description"
                                multiline
                                rows={4}
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.description && Boolean(formik.errors.description)
                                }
                                helperText={formik.touched.description && formik.errors.description}
                            />
                            <FormControl variant="outlined" className="w-full">
                                <InputLabel id="category-label">Category</InputLabel>
                                <Select
                                    labelId="category-label"
                                    id="category"
                                    variant="outlined"
                                    fullWidth
                                    value={category}
                                    onChange={e=>setCategory(e.target.value)}
                                    label="Category"
                                    className={classes.selectEmpty}
                                >
                                    <MenuItem value="fiction">Exams</MenuItem>
                                    <MenuItem value="non-fiction">Lesson</MenuItem>
                                </Select>
                            </FormControl>
                            <label htmlFor="imageInput" className="text-gray-700 font-medium mb-2 block mt-6">
                                Document
                            </label>
                            <div className="mb-4 flex">
                                <input
                                type="file"
                                id="docInput"
                                accept="application/pdf"
                                onChange={handleDocChange}
                                className="hidden"
                                />
                                <label
                                htmlFor="docInput"
                                className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors duration-300 ease-in-out"
                                >
                                {Doc ? 'Change Document' : 'Upload Document'}
                                </label>
                                <div className="text-lg my-auto pl-4 ">{Doc != null ? (Progress+'% Completed') : 'Select Document'}</div>
                            </div>

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                startIcon={<BiBookAdd/>}
                                className="w-full py-3 text-lg font-medium bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800 transition duration-150 ease-in-out"
                                >
                                Add Document
                            </Button>
                        </form>
                    </div>
                </div>
            </main>

        </div>
        </div>
    )
}

export default withAdminCheck(AddDocs);