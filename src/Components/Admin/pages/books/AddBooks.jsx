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
  }));

  const AddBookSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    author: Yup.string().required("Author is required"),
    description: Yup.string().required("Description is required"),
  });

const AddBooks = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const classes = useStyles();
    const history = useHistory();
    const [categories, setCategories] = useState([]);
    const [image, setImage] = useState(null);
    const { isLoading, error, mutate } = useMutation(createBook);

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
          setImage(e.target.files[0]);
        }
    };

    const formik = useFormik({
        initialValues: {
        title: "",
        author: "",
        description: "",
        image: ""
        },
        validationSchema: AddBookSchema,
        onSubmit: async (values) => {
            // Upload image to Firebase Storage
        const imageRef = ref(storage, 'images/'+image.name);
        uploadBytes(imageRef, image).then((snapshot) => {
            console.log('Uploaded a blob or file!');
        });
        const imageUrl = await getDownloadURL(imageRef);
        const book = {
            title: values.title,
            author: values.author,
            description: values.description,
            image: imageUrl,
            categories,
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
                    <div className='flex flex-col mx-auto relative top-1/2 -translate-y-1/2'>
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
                            <h2 className={tw`text-3xl font-semibold mb-5`}>Add Book</h2>
                            {error && <ErrorMessage message={error.message} />}
                            {isLoading && <Loader />}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                <label htmlFor="titleInput" className="text-gray-700 font-medium mb-2 block">
                                    Title
                                </label>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    className="mb-4"
                                    id="title"
                                    name="title"
                                    label="Title"
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.title && Boolean(formik.errors.title)}
                                    helperText={formik.touched.title && formik.errors.title}
                                />
                                </div>
                                <div>
                                <label htmlFor="authorInput" className="text-gray-700 font-medium mb-2 block">
                                    Author
                                </label>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    className="mb-4"
                                    id="author"
                                    name="author"
                                    label="Author"
                                    value={formik.values.author}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.author && Boolean(formik.errors.author)}
                                    helperText={formik.touched.author && formik.errors.author}
                                />
                                </div>
                            </div>
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
                            <label htmlFor="categoryInput" className="text-gray-700 font-medium mb-2 block">
                                Category
                            </label>
                            <FormControl variant="outlined"
                                sx={{
                                    marginTop: '10px'
                                }}
                                fullWidth
                            >
                                <InputLabel id="categories-label">Category</InputLabel>
                                <Select
                                    labelId="categories-label"
                                    id="categories"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={categories}
                                    onChange={(e) => setCategories(e.target.value)}
                                    label="Category"
                                    multiple
                                >
                                    <MenuItem value="disabled" disabled>--------------------------- School Categories ---------------------------</MenuItem>
                                    <MenuItem value="Accounting and financial management">Accounting and financial management</MenuItem>
                                    <MenuItem value="Computer programming and software development">Computer programming and software development</MenuItem>
                                    <MenuItem value="Information systems and technology">Information systems and technology</MenuItem>
                                    <MenuItem value="Database management and design">Database management and design</MenuItem>
                                    <MenuItem value="Networking and security">Networking and security</MenuItem>
                                    <MenuItem value="Web development and design">Web development and design</MenuItem>
                                    <MenuItem value="Business and entrepreneurship">Business and entrepreneurship</MenuItem>
                                    <MenuItem value="Project management">Project management</MenuItem>
                                    <MenuItem value="Statistics and data analysis">Statistics and data analysis</MenuItem>
                                    <MenuItem value="Mathematics for computer science.">Mathematics for computer science.</MenuItem>
                                    <MenuItem value="disabled" disabled>--------------------------- Extra Categories ---------------------------</MenuItem>
                                    <MenuItem value="Fiction">Fiction</MenuItem>
                                    <MenuItem value="Non-fiction">Non-fiction</MenuItem>
                                    <MenuItem value="Romance">Romance</MenuItem>
                                    <MenuItem value="Mystery/Thriller">Mystery/Thriller</MenuItem>
                                    <MenuItem value="Science Fiction/Fantasy">Science Fiction/Fantasy</MenuItem>
                                    <MenuItem value="Biography/Autobiography">Biography/Autobiography</MenuItem>
                                    <MenuItem value="History">History</MenuItem>
                                    <MenuItem value="Horror">Horror</MenuItem>
                                    <MenuItem value="Self-help/Personal Development">Self-help/Personal Development</MenuItem>
                                    <MenuItem value="Business/Finance">Business/Finance</MenuItem>
                                    <MenuItem value="Travel">Travel</MenuItem>
                                    <MenuItem value="Poetry">Poetry</MenuItem>
                                    <MenuItem value="Humor">Humor</MenuItem>
                                    <MenuItem value="Religious/Spiritual">Religious/Spiritual</MenuItem>
                                    <MenuItem value="Art/Photography">Art/Photography</MenuItem>
                                    <MenuItem value="Cookbooks/Food">Cookbooks/Food</MenuItem>
                                    <MenuItem value="Sports/Fitness">Sports/Fitness</MenuItem>
                                    <MenuItem value="Science/Technology">Science/Technology</MenuItem>
                                    <MenuItem value="Education/Teaching">Education/Teaching</MenuItem>
                                </Select>
                            </FormControl>
                            <label htmlFor="imageInput" className="text-gray-700 font-medium mb-2 block mt-6">
                                Image
                            </label>
                            <div className="mb-4">
                                <input
                                type="file"
                                id="imageInput"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                />
                                <label
                                htmlFor="imageInput"
                                className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors duration-300 ease-in-out"
                                >
                                {image ? 'Change Image' : 'Upload Image'}
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

export default withAdminCheck(AddBooks);