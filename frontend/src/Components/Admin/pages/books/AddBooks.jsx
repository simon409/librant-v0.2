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
    TextField,
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
import { getDatabase, onValue, ref as dbRef } from 'firebase/database';
import axios from 'axios';


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
        quantity: "",
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
            quantity: values.quantity,
            image: imageUrl,
            categories,
        };
        mutate(book, {
            onSuccess: (bookID) => SendMail({book:book, subject: 'New book added', bookId: bookID}),
        });
        },
    });

    const SendMail = async ({book, subject, bookId}) => {
        console.log(bookId);
        const db = getDatabase();
        const usersRef = dbRef(db, 'users');
        onValue(usersRef, (snapshot) => {
            const users = snapshot.val();
            const emailAddresses = Object.values(users).map(user=>user.email);
            const to = emailAddresses.join(',');
            
            const htmlText = `
        <!DOCTYPE html>

        <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
        
        <head>
            <title></title>
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
            <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css" /><!--<![endif]-->
            <style>
                * {
                    box-sizing: border-box;
                }
        
                body {
                    margin: 0;
                    padding: 0;
                }
        
                a[x-apple-data-detectors] {
                    color: inherit !important;
                    text-decoration: inherit !important;
                }
        
                #MessageViewBody a {
                    color: inherit;
                    text-decoration: none;
                }
        
                p {
                    line-height: inherit
                }
        
                .desktop_hide,
                .desktop_hide table {
                    mso-hide: all;
                    display: none;
                    max-height: 0px;
                    overflow: hidden;
                }
        
                .image_block img+div {
                    display: none;
                }
        
                @media (max-width:660px) {
                    .desktop_hide table.icons-inner {
                        display: inline-block !important;
                    }
        
                    .icons-inner {
                        text-align: center;
                    }
        
                    .icons-inner td {
                        margin: 0 auto;
                    }
        
                    .row-content {
                        width: 100% !important;
                    }
        
                    .mobile_hide {
                        display: none;
                    }
        
                    .stack .column {
                        width: 100%;
                        display: block;
                    }
        
                    .mobile_hide {
                        min-height: 0;
                        max-height: 0;
                        max-width: 0;
                        overflow: hidden;
                        font-size: 0px;
                    }
        
                    .desktop_hide,
                    .desktop_hide table {
                        display: table !important;
                        max-height: none !important;
                    }
                }
            </style>
        </head>
        
        <body style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
            <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF;" width="100%">
                <tbody>
                    <tr>
                        <td>
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1"
                                role="presentation"
                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #00b4d8;" width="100%">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                class="row-content stack" role="presentation"
                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 640px;"
                                                width="640">
                                                <tbody>
                                                    <tr>
                                                        <td class="column column-1"
                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                            width="100%">
                                                            <div class="spacer_block block-1"
                                                                style="height:80px;line-height:80px;font-size:1px;"> </div>
                                                            <table border="0" cellpadding="0" cellspacing="0"
                                                                class="text_block block-2" role="presentation"
                                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                                                width="100%">
                                                                <tr>
                                                                    <td class="pad"
                                                                        style="padding-left:20px;padding-right:20px;">
                                                                        <div style="font-family: sans-serif">
                                                                            <div class=""
                                                                                style="font-size: 12px; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #03045e; line-height: 1.2;">
                                                                                <p
                                                                                    style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;">
                                                                                    <span
                                                                                        style="font-size:38px;"><strong>Librant</strong></span>
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            <table border="0" cellpadding="0" cellspacing="0"
                                                                class="text_block block-3" role="presentation"
                                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                                                width="100%">
                                                                <tr>
                                                                    <td class="pad"
                                                                        style="padding-left:20px;padding-right:20px;">
                                                                        <div style="font-family: sans-serif">
                                                                            <div class=""
                                                                                style="font-size: 12px; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #ffffff; line-height: 1.2;">
                                                                                <p
                                                                                    style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;">
                                                                                    <span style="font-size:38px;"><strong>Your
                                                                                            modern library</strong></span></p>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            <table border="0" cellpadding="0" cellspacing="0"
                                                                class="text_block block-4" role="presentation"
                                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                                                width="100%">
                                                                <tr>
                                                                    <td class="pad"
                                                                        style="padding-left:20px;padding-right:20px;">
                                                                        <div style="font-family: sans-serif">
                                                                            <div class=""
                                                                                style="font-size: 12px; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #ffffff; line-height: 1.2;">
                                                                                <p
                                                                                    style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;">
                                                                                    <span style="font-size:13px;"><strong>powered
                                                                                            by iga casablanca</strong></span>
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            <div class="spacer_block block-5"
                                                                style="height:30px;line-height:30px;font-size:1px;"> </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2"
                                role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                class="row-content stack" role="presentation"
                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 640px;"
                                                width="640">
                                                <tbody>
                                                    <tr>
                                                        <td class="column column-1"
                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                            width="100%">
                                                            <h1 style="font-family: Lato, Tahoma, Verdana, Segoe, sans-serif;">Here is our new book</h1>
                                                            <table border="0" cellpadding="0" cellspacing="0"
                                                                class="html_block block-1" role="presentation"
                                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                width="100%">
                                                                <tr>
                                                                    <td class="pad" style="padding-bottom: 20px;">
                                                                        <div align="center" style="font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; text-align: start;">
                                                                          <div class="our-class">
                                                                            <div className="book_container">
                                                                                <div class="book_image">
                                                                                    <img src="${book.image}" alt="${book.title}" width="200" height="300" style="display: block; margin: 0 auto;">
                                                                                </div>
                                                                                <div class="book_details" style="text-align-center">
                                                                                    <h3 style="margin-top: 10px;">${book.title}</h3>
                                                                                    <p style="font-size: 16px; color: #999999; font-style: italic; margin-bottom: 10px;">Authors: ${book.author}</p>
                                                                                    <p style="font-size: 16px; line-height: 1.4;">Description: ${book.description}</p>
                                                                                    <a href="http://localhost:5173/books/${bookId}" style="font-size: 16px; color: #00b4d8; text-decoration: none; display: inline-block; margin-top: 10px; padding: 8px 16px; background-color: #00b4d8; color: #ffffff; border-radius: 4px;">Read More</a>
                                                                                </div>
                                                                            </div>
                                                                          </div>
                                                                        </div>
                                                                      </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3"
                                role="presentation"
                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #00b4d8;" width="100%">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                class="row-content stack" role="presentation"
                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 640px;"
                                                width="640">
                                                <tbody>
                                                    <tr>
                                                        <td class="column column-1"
                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                            width="100%">
                                                            <div class="spacer_block block-1"
                                                                style="height:50px;line-height:50px;font-size:1px;"> </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4"
                                role="presentation"
                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #00b4d8;" width="100%">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                class="row-content stack" role="presentation"
                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 640px;"
                                                width="640">
                                                <tbody>
                                                    <tr>
                                                        <td class="column column-1"
                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                            width="41.666666666666664%">
                                                            <div class="spacer_block block-1"
                                                                style="height:15px;line-height:15px;font-size:1px;"> </div>
                                                            <table border="0" cellpadding="10" cellspacing="0"
                                                                class="heading_block block-2" role="presentation"
                                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                width="100%">
                                                                <tr>
                                                                    <td class="pad">
                                                                        <h1
                                                                            style="margin: 0; color: #03045e; direction: ltr; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; font-size: 38px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0;">
                                                                            <span class="tinyMce-placeholder">Librant</span>
                                                                        </h1>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            <div class="spacer_block block-3"
                                                                style="height:15px;line-height:15px;font-size:1px;"> </div>
                                                        </td>
                                                        <td class="column column-2"
                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                            width="25%">
                                                            <div class="spacer_block block-1"
                                                                style="height:40px;line-height:40px;font-size:1px;"> </div>
                                                            <div class="spacer_block block-2"
                                                                style="height:10px;line-height:10px;font-size:1px;"> </div>
                                                            <div class="spacer_block block-3"
                                                                style="height:10px;line-height:10px;font-size:1px;"> </div>
                                                            <div class="spacer_block block-4"
                                                                style="height:10px;line-height:10px;font-size:1px;"> </div>
                                                        </td>
                                                        <td class="column column-3"
                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                            width="33.333333333333336%">
                                                            <div class="spacer_block block-1"
                                                                style="height:40px;line-height:40px;font-size:1px;"> </div>
                                                            <div class="spacer_block block-2"
                                                                style="height:10px;line-height:10px;font-size:1px;"> </div>
                                                            <div class="spacer_block block-3"
                                                                style="height:10px;line-height:10px;font-size:1px;"> </div>
                                                            <table border="0" cellpadding="0" cellspacing="0"
                                                                class="icons_block block-4" role="presentation"
                                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                width="100%">
                                                                <tr>
                                                                    <td class="pad"
                                                                        style="vertical-align: middle; color: #000000; font-family: inherit; font-size: 14px; padding-left: 10px; padding-right: 10px; text-align: left;">
                                                                        <table align="left" cellpadding="0" cellspacing="0"
                                                                            class="alignment" role="presentation"
                                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                            <tr>
                                                                                <td
                                                                                    style="vertical-align: middle; text-align: center; padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 5px;">
                                                                                    <img align="center" class="icon" height="32"
                                                                                        src="https://cdn-icons-png.flaticon.com/512/145/145802.png"
                                                                                        style="display: block; height: auto; margin: 0 auto; border: 0;"
                                                                                        width="32" /></td>
                                                                                <td
                                                                                    style="vertical-align: middle; text-align: center; padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 5px;">
                                                                                    <img align="center" class="icon" height="32"
                                                                                        src="https://cdn-icons-png.flaticon.com/512/174/174855.png"
                                                                                        style="display: block; height: auto; margin: 0 auto; border: 0;"
                                                                                        width="32" /></td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            <div class="spacer_block block-5"
                                                                style="height:10px;line-height:10px;font-size:1px;"> </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5"
                                role="presentation"
                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #00b4d8;" width="100%">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                class="row-content stack" role="presentation"
                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 640px;"
                                                width="640">
                                                <tbody>
                                                    <tr>
                                                        <td class="column column-1"
                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                            width="100%">
                                                            <div class="spacer_block block-1"
                                                                style="height:50px;line-height:50px;font-size:1px;"> </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-6"
                                role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                class="row-content stack" role="presentation"
                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 640px;"
                                                width="640">
                                                <tbody>
                                                    <tr>
                                                        <td class="column column-1"
                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                            width="100%">
                                                            <table border="0" cellpadding="0" cellspacing="0"
                                                                class="icons_block block-1" role="presentation"
                                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                width="100%">
                                                                <tr>
                                                                    <td class="pad"
                                                                        style="vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
                                                                        <table cellpadding="0" cellspacing="0"
                                                                            role="presentation"
                                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                            width="100%">
                                                                            <tr>
                                                                                <td class="alignment"
                                                                                    style="vertical-align: middle; text-align: center;">
                                                                                    <!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                                                                                    <!--[if !vml]><!-->
                                                                                    <table cellpadding="0" cellspacing="0"
                                                                                        class="icons-inner" role="presentation"
                                                                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;">
                                                                                        <!--<![endif]-->
                                                                                        <tr>
                                                                                        </tr>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table><!-- End -->
        </body>
        
        </html>
        `;
        axios.post('http://localhost:3000/send-email', {
          to,
          subject,
          htmlText,
        })
        .then(response => {
          console.log(response);
          history.push("/books");
        })
        .catch(error => {
          console.log(error)
        });
        })
      }
    return (
        <div className="flex h-screen overflow-hidden">

        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Content area */}
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

            {/*  Site header */}
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <main className='h-full mt-20 mb-20'>
                <div className="w-full h-full flex">
                    <div className='flex flex-col mx-10 lg:mx-auto md:mx-auto relative top-1/2 -translate-y-1/2'>
                        <form onSubmit={formik.handleSubmit} className="w-full max-w-2xl my-auto">
                            <h2 className={tw`text-3xl font-semibold mb-5`}>Add Book</h2>
                            {error && <ErrorMessage message={error.message} />}
                            {isLoading && <Loader />}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
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
                            <TextField
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                type='number'
                                className="mb-4"
                                id="quantity"
                                name="quantity"
                                label="Quantity"
                                value={formik.values.quantity}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.quantity && Boolean(formik.errors.quantity)
                                }
                                helperText={formik.touched.quantity && formik.errors.quantity}
                            />
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