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
import { createBook } from '../../api/books/createBook';
import ErrorMessage from '../components/ErrorMessage';
import { colors } from '../theme/colors';
import { generateId } from '../../utils/generatedID';
import Loader from '../components/Loader';
import { storage } from '../../../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
    title: Yup.string().required("Title is required"),
    author: Yup.string().required("Author is required"),
    description: Yup.string().required("Description is required"),
  });

const AddDocs = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const classes = useStyles();
    const history = useHistory();
    const [category, setCategory] = useState("");
    const [Doc, setDoc] = useState(null);
    const { isLoading, error, mutate } = useMutation(createBook);

    const handleDocChange = (e) => {
        if (e.target.files[0]) {
          setDoc(e.target.files[0]);
        }
    };

    const formik = useFormik({
        initialValues: {
        name: "",
        description: "",
        doc: ""
        },
        validationSchema: AddBookSchema,
        onSubmit: async (values) => {
            // Upload image to Firebase Storage
        const docRef = ref(storage, 'docs/'+Doc.name);
        uploadBytes(docRef, Doc).then((snapshot) => {
            console.log('Uploaded a blob or file!');
        });
        const docURL = await getDownloadURL(docRef);
        const book = {
            id: generateId(),
            name: values.title,
            description: values.description,
            doc: docURL,
            category,
        };
        mutate(book, {
            onSuccess: () => history.push("/books"),
        });
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
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.title && Boolean(formik.errors.title)}
                                helperText={formik.touched.title && formik.errors.title}
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
                                    margin="normal"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    label="Category"
                                    className={classes.selectEmpty}
                                >
                                    <MenuItem value="">
                                    <em>None</em>
                                    </MenuItem>
                                    <MenuItem value="fiction">Fiction</MenuItem>
                                    <MenuItem value="non-fiction">Non-Fiction</MenuItem>
                                    <MenuItem value="memoir">Memoir</MenuItem>
                                </Select>
                            </FormControl>
                            <label htmlFor="imageInput" className="text-gray-700 font-medium mb-2 block mt-6">
                                Document
                            </label>
                            <div className="mb-4">
                                <input
                                type="file"
                                id="docInput"
                                accept="pdf/*"
                                onChange={handleDocChange}
                                className="hidden"
                                />
                                <label
                                htmlFor="docInput"
                                className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors duration-300 ease-in-out"
                                >
                                {Doc ? 'Change Document' : 'Upload Document'}
                                </label>
                            </div>

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                startIcon={<BiBookAdd/>}
                                className="w-full py-3 text-lg font-medium bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800 transition duration-150 ease-in-out"
                                >
                                Add Book
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