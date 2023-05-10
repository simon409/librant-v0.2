import React, { useState, useEffect } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import { makeStyles } from '@mui/styles';
import { updateBook } from "../../api/books/updateBook";
import * as Yup from "yup";
import { tw } from "twind";
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
import { BiBookAdd } from "react-icons/bi"
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import { useMutation } from 'react-query';
import ErrorMessage from '../components/ErrorMessage';
import { colors } from '../theme/colors';
import Loader from '../components/Loader';
import withAdminCheck from '../withAdminCheck';
import { useParams } from "react-router-dom";
import { getDatabase, ref as dbRef, onValue } from "firebase/database";


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

const ModifyBookSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    author: Yup.string().required("Author is required"),
    description: Yup.string().required("Description is required"),
});

const ModifyBooks = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const classes = useStyles();
    const history = useHistory();
    const [book, setBook] = useState(null);
    const [Categories, setCategories] = useState([]);
    const { isLoading, error, mutate } = useMutation(updateBook);
    const { id } = useParams();

    const formik = useFormik({
        initialValues: {
            title: "",
            author: "",
            description: "",
            Quantity: ''
        },

        validationSchema: ModifyBookSchema,
        onSubmit: async (values) => {
            const updates = {
                title: values.title,
                author: values.author,
                description: values.description,
                categories: Categories,
                Quantity: values.Quantity,
            };
            mutate({bookId: id, updates: updates}, {
                onSuccess: () => history.push('/books'),
            });
        },
    });

    useEffect(() => {
        // User is signed in, fetch user data
        const db = getDatabase();
        const userDataRef = dbRef(db, `books/${id}`);
        onValue(userDataRef, (snapshot) => {
            const data = snapshot.val();
            setBook(data);
            if (Array.isArray(data.categories)) {
                const bookCategories = data.categories.map((category) => category);
                setCategories(bookCategories);
            }
        });
    }, [id]);

    useEffect(() => {
        // Set form values when book data is available
        if (book) {
            formik.setValues({
                title: book.title,
                author: book.author,
                description: book.description,
                Quantity: book.Quantity
            });
        }
    }, [book]);

    if (!book) {
        return <div>Loading...</div>;
    }

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
                            <form onSubmit={formik.handleSubmit} className="w-full max-w-2xl my-auto">
                                <h2 className={tw`text-3xl font-semibold mb-5`}>Modify Book</h2>
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
                                <label htmlFor="categoriesInput" className="text-gray-700 font-medium mb-2 block mt-6">
                                    Categories
                                </label>
                                <FormControl fullWidth variant="outlined" sx={{ marginBottom: '20px' }}>

                                    <InputLabel id="Categories-label" sx={{ paddingTop: '15px' }}>Categories</InputLabel>
                                    <Select
                                        labelId="categories-label"
                                        id="categories"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        value={Categories}
                                        onChange={(e) => setCategories(e.target.value)}
                                        label="Category"
                                        className={classes.selectEmpty}
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
                                <label htmlFor="imageInput" className="text-gray-700 font-medium block">
                                    Image
                                </label>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    type='number'
                                    className="mb-4"
                                    id="Quantity"
                                    name="Quantity"
                                    label="Quantity"
                                    value={formik.values.Quantity}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.Quantity && Boolean(formik.errors.Quantity)
                                    }
                                    helperText={formik.touched.Quantity && formik.errors.Quantity}
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    startIcon={<BiBookAdd />}
                                    className="w-full py-3 text-lg font-medium bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800 transition duration-150 ease-in-out"
                                >
                                    Modify Book
                                </Button>
                            </form>
                        </div>
                    </div>
                </main>

            </div>
        </div>
    )
}

export default withAdminCheck(ModifyBooks);