import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import withAdminCheck from './withAdminCheck';
import { getDatabase, onValue, ref } from 'firebase/database';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box, Collapse, Avatar, Button, TextField } from '@mui/material';
import { CloseOutlined, EmailOutlined, Send } from '@mui/icons-material';
import Paper from '@mui/material/Paper';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';

//graphics
import DashboardCard04 from '../partials/dashboard/DashboardCard04';

function UserInfosside({userId, onClose, setMailSection, setUserMail}){
  const [User, setUser] = useState(null);
  const [Borrows, setBorrows] = useState([]);
  const [Books, setBooks] = useState([]);
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getDatabase();
    const userRef = ref(db, `users/${userId}`);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      setUser(data);
    });
  }, [userId]);

  useEffect(() => {
    if (!User) return;

    const db = getDatabase();
    const borrowsRef = ref(db, `users/${userId}/borrows`);
    const booksRef = ref(db, `books`);

    setLoading(true);
    const unsubscribe = onValue(borrowsRef, snapshot => {
      const data = snapshot.val();
      const borrows = [];
      for (const key in data) {
        borrows.push({ id: key, Book_id: data[key].Book_id });
      }
      onValue(booksRef, snapshot => {
        const data = snapshot.val();
        const books = [];
        for (const key in data) {
          books.push({ id: key, ...data[key] });
        }
        const borrowedBooks = books.filter(book => borrows.some(borrow => borrow.Book_id === book.id));
        setBooks(borrowedBooks);
        setLoading(false);
      });
    });

    return unsubscribe;
  }, [User]);

  useEffect(() => {
    if (!User) return;

    const db = getDatabase();
    const borrowsRef = ref(db, `users/${userId}/borrows`);
    const booksRef = ref(db, `books`);

    setLoading(true);
    const unsubscribe = onValue(borrowsRef, snapshot => {
      const data = snapshot.val();
      const bookArray = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setBorrows(bookArray);
      setLoading(false);
    });

    return unsubscribe;
  }, [User]);

  function OpenMail(){
    //here goes some code for mail
    setMailSection(true);
    setUserMail(User.email);
  }
  
  return(
    <div className='w-[450px] min-h-screen pt-16 border-l-2'>
      <div className="pt-5 px-5">
        <div className="flex justify-between my-5 b-2">
          <h1 className='text-2xl font-bold'>Quick reviews</h1>
          <Button onClick={onClose}>
            <CloseOutlined />
          </Button>
        </div>
        <div className="flex w-full mt-2 bg-slate-200 px-2 py-4 rounded-lg">
          {
              User ? User.imageUrl != "-" ? (
                  <Avatar
                  src={User.imageUrl}
                  sx={{ width: 50, height: 50}}
                  />
              ) : (
                <Avatar sx={{ width: 32, height: 32 }}>
                  {User.fullname.charAt(0).toUpperCase()}
                </Avatar>
              ) : <></>
          }
          <div className="flex flex-col pl-2">
            {
              User ? (
                <div>
                  <p className='text-xl font-bold'>{User.fullname}</p>
                  <p className='text-sm text-slate-600'>{User.email}</p>
                </div>
              ) : (
                <>Loading...</>
              )
            }
          </div>
        </div>
        <button className="flex gap-4 w-full mt-2 bg-slate-200 p-4 rounded-lg cursor-pointer hover:bg-slate-300" onClick={()=>OpenMail()}>
          <EmailOutlined />
          Send message
        </button>
        <h1 className='text-2xl font-bold mt-3 flex'><p className='my-auto'>Borrowed books</p>  &nbsp;<p className='bg-mypalette-2 px-2 rounded-lg text-white'>{Books.length}</p></h1>
        <ul className='w-full mt-2 flex flex-col gap-2'>
          {
            Books ? (Books.length > 0 ? (
                Books.map((book) => {
                  return(
                    <li className='border-slate-300 border-2 p-4 rounded-lg '>
                      <div className="flex">
                        <div className="h-28">
                          <img src={book.image} className='h-full'/>
                        </div>
                        <div className="my-auto pl-3">
                          <div className="flex flex-col">
                            <h1 className='font-bold text-xl'>{book.title.substring(0, Math.min(book.title.indexOf('\n') !== -1 ? book.title.indexOf('\n') : 25, 25))}...</h1>
                            <h1 className='text-md text-slate-600'>{book.author.substring(0, Math.min(book.author.indexOf('\n') !== -1 ? book.author.indexOf('\n') : 40, 40))}{book.author.indexOf('\n') !== -1 ? ("...") : ("")}</h1>
                            {Borrows ? Borrows.map((borrow) => {
                              if (borrow.Book_id === book.id) {
                                const today = new Date();
                                const retDate = new Date(borrow.return_date);
                                const diff = retDate - today;
                                const days = -1*Math.floor(diff / (1000 * 60 * 60 * 24)); 
                                const over = days;
                                return(
                                  <div>
                                    {<h1 className={`text-sm ${over > 0 ? 'text-red-500' : 'text-green-600' } font-bold`}>{over > 0 ? over : over*-1} {over>0 ? "days overdue" : "days left" }</h1>}
                                    <div className="flex w-full">
                                      <div className="flex-col w-1/2">
                                        <h1 className='text-sm text-slate-600'>Borrow Date</h1>
                                        <h1 className='text-sm font-bold'>{borrow.borrowdate.substring(0,10)}</h1>
                                      </div>
                                      <div className="flex-col w-1/2">
                                        <h1 className='text-sm text-slate-600'>Return Date</h1>
                                        <h1 className='text-sm font-bold'>{borrow.return_date.substring(0,10)}</h1>
                                      </div>
                                    </div>
                                  </div>
                                )
                              }
                              else{
                                return (
                                  <></>
                                )
                              }
                            }) : (<>no data available</>)}
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })
            ) : (
            <div className='w-full mt-2 bg-slate-200 p-4 rounded-lg'>
              No Borrows
            </div>
            )) : (<div className='w-full mt-2 bg-slate-200 p-4 rounded-lg'>
              Error loading Data...
            </div>)
          }
        </ul>
        <div className="flex w-full justify-between mt-3">
          <h1 className='text-2xl font-bold flex'><p className='my-auto'>Book circulation history</p></h1>
          <Link className="my-auto underline font-semibold text-mypalette-2" to="/">
            See All
          </Link>
        </div>
      </div> 
    </div>
  );
}
function Dashboard() {

  const datee = new Date();
  const year = datee.getFullYear();
  const month = ("0" + (datee.getMonth() + 1)).slice(-2);
  const day = ("0" + datee.getDate()).slice(-2);
  const formattedDate = `${year}-${month}-${day}`;
  const [sideUserInfos, setSideUserInfos] = useState(false);
  const [userselected, setuserselected] = useState(null);
  //mail stuff
  const [MailSection, setMailSection] = useState(false);
  const [UserMail, setUserMail] = useState("");
  const [content, setContent] = useState("");
  const [Subject, setSubject] = useState("");

  const handleEditorChange = (content, editor) => {
    setContent(content);
  };


  {/*Connection a la base de donnée  and store on getdata*/}
  const db = getDatabase();
  const [getdata,setdata]=useState([]);

  {/*its me    */}

  useEffect(() => {
    
    const referencedetable=ref(db,'users');//ref of the table wanted to get the data from
    onValue(referencedetable, (snapshot) => {
      const data = snapshot.val();
      const usersWithBorrows = Object.entries(data).filter(([userId, user]) => {
        const borrows = user.borrows;
        return borrows !== undefined && Object.values(borrows).length > 0;
      }).map(([userId, user]) => {
        const borrows = user.borrows;
        
        const userBorrows = Object.entries(borrows).map(([borrowId, borrow]) => {
          const returnDate = new Date(borrow.return_date);
          const today = new Date();
          if (returnDate < today) {
            return { ...borrow, userId, borrowId };
          } else {
            return null;
          }
        }).filter(borrow => borrow !== null);
        return userBorrows;
      }).flat();
      setdata(usersWithBorrows)
    });
    

  }, []);
  function UserFullName({ userId }) {
    const userDataRef = ref(db, `users/${userId}`);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
      onValue(userDataRef, (snapshot) => {
        const userData = snapshot.val();
        setUserData(userData);
      });
    }, []);

    if (userData) {
      return userData.fullname;
    } else {
      return <div>Loading user data...</div>;
    }
  }

  function BookTitle({ bookId }) {
    const db = getDatabase();
    const bookDataRef = ref(db, `books/${bookId}`);
    const [bookData, setBookData] = useState(null);

    useEffect(() => {
      onValue(bookDataRef, (snapshot) => {
        const bookData = snapshot.val();
        setBookData(bookData);
      });
    }, []);

    if (bookData) {
      return bookData.title;
    } else {
      return <div>Loading book data...</div>;
    }
  }

  const SendMail = async ({event, to, message, subject}) => {
    event.preventDefault();
    const htmlText = `
    <!DOCTYPE html>

<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<title></title>
<meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
<link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css"/><!--<![endif]-->
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
<table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #00b4d8;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 640px;" width="640">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<div class="spacer_block block-1" style="height:80px;line-height:80px;font-size:1px;"> </div>
<table border="0" cellpadding="0" cellspacing="0" class="text_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="padding-left:20px;padding-right:20px;">
<div style="font-family: sans-serif">
<div class="" style="font-size: 12px; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #03045e; line-height: 1.2;">
<p style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;"><span style="font-size:38px;"><strong>Librant</strong></span></p>
</div>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="text_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="padding-left:20px;padding-right:20px;">
<div style="font-family: sans-serif">
<div class="" style="font-size: 12px; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #ffffff; line-height: 1.2;">
<p style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;"><span style="font-size:38px;"><strong>Your modern library</strong></span></p>
</div>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="text_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="padding-left:20px;padding-right:20px;">
<div style="font-family: sans-serif">
<div class="" style="font-size: 12px; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #ffffff; line-height: 1.2;">
<p style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;"><span style="font-size:13px;"><strong>powered by iga casablanca</strong></span></p>
</div>
</div>
</td>
</tr>
</table>
<div class="spacer_block block-5" style="height:30px;line-height:30px;font-size:1px;"> </div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 640px;" width="640">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="0" cellspacing="0" class="html_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad">
<div align="center" id="message" style="font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;text-align:start;"><div class="our-class"> Message : <br>${message} </div></div>
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
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #00b4d8;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 640px;" width="640">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<div class="spacer_block block-1" style="height:50px;line-height:50px;font-size:1px;"> </div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #00b4d8;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 640px;" width="640">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="41.666666666666664%">
<div class="spacer_block block-1" style="height:15px;line-height:15px;font-size:1px;"> </div>
<table border="0" cellpadding="10" cellspacing="0" class="heading_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad">
<h1 style="margin: 0; color: #03045e; direction: ltr; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; font-size: 38px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">Librant</span></h1>
</td>
</tr>
</table>
<div class="spacer_block block-3" style="height:15px;line-height:15px;font-size:1px;"> </div>
</td>
<td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="25%">
<div class="spacer_block block-1" style="height:40px;line-height:40px;font-size:1px;"> </div>
<div class="spacer_block block-2" style="height:10px;line-height:10px;font-size:1px;"> </div>
<div class="spacer_block block-3" style="height:10px;line-height:10px;font-size:1px;"> </div>
<div class="spacer_block block-4" style="height:10px;line-height:10px;font-size:1px;"> </div>
</td>
<td class="column column-3" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
<div class="spacer_block block-1" style="height:40px;line-height:40px;font-size:1px;"> </div>
<div class="spacer_block block-2" style="height:10px;line-height:10px;font-size:1px;"> </div>
<div class="spacer_block block-3" style="height:10px;line-height:10px;font-size:1px;"> </div>
<table border="0" cellpadding="0" cellspacing="0" class="icons_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="vertical-align: middle; color: #000000; font-family: inherit; font-size: 14px; padding-left: 10px; padding-right: 10px; text-align: left;">
<table align="left" cellpadding="0" cellspacing="0" class="alignment" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
<tr>
<td style="vertical-align: middle; text-align: center; padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 5px;"><img align="center" class="icon" height="32" src="https://cdn-icons-png.flaticon.com/512/145/145802.png" style="display: block; height: auto; margin: 0 auto; border: 0;" width="32"/></td>
<td style="vertical-align: middle; text-align: center; padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 5px;"><img align="center" class="icon" height="32" src="https://cdn-icons-png.flaticon.com/512/174/174855.png" style="display: block; height: auto; margin: 0 auto; border: 0;" width="32"/></td>
</tr>
</table>
</td>
</tr>
</table>
<div class="spacer_block block-5" style="height:10px;line-height:10px;font-size:1px;"> </div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #00b4d8;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 640px;" width="640">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<div class="spacer_block block-1" style="height:50px;line-height:50px;font-size:1px;"> </div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 640px;" width="640">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="0" cellspacing="0" class="icons_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
<table cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="alignment" style="vertical-align: middle; text-align: center;"><!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
<!--[if !vml]><!-->
<table cellpadding="0" cellspacing="0" class="icons-inner" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;"><!--<![endif]-->
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
      setmessage("Message sent successfully");
    })
    .catch(error => {
      setmessage("Error sending the message - try again after 2 min or contact the developper");

    });
  }

  function OpenSideUserInfos({userId}){
    //here goes your code
    if(userId){
      setuserselected(userId);
      if(userselected){
        console.log(userselected)
        setSideUserInfos(!sideUserInfos);
      }
    }
  }


  const prevPageRef = useRef();
  const history = useHistory();
  const [message, setmessage] = useState(null)

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    prevPageRef.current = history.location.state || '/';
  }, [history.location.state]);

  if (prevPageRef.current !== 'http://localhost:5173/admin') {
    //history.push('/');
  }

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex">
          <main className='w-full pt-16 '>
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

              {/* Welcome banner */}
              <WelcomeBanner />

              {/* Cards 
                <div className="grid grid-cols-12 gap-6">
                <DashboardCard04 />
              </div>
              */}
              
              {/* Table */}
              <h1 className='text-3xl font-bold'>Overdue Borrows</h1>
              
              <TableContainer component={Paper} sx={{ height: 'calc(100% - 120px)', overflow: 'auto' }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="left">MEMBER</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="left">BOOK TITLE</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="left">OVERDUE</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="left">RETURN DATE</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    { getdata.length > 0 ? ( getdata.map((data) => (
                      <TableRow
                        key={data.borrowId}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                        onClick={()=>OpenSideUserInfos({userId: data.userId})}
                      >
                        <TableCell component="th" scope="row">
                          {data.borrowId}
                        </TableCell>
                        <TableCell align="left">
                          <UserFullName userId={data.userId}/>
                        </TableCell>
                        <TableCell align="left">
                          <BookTitle bookId={data.Book_id}/>
                        </TableCell>
                        <TableCell align="left" sx={{
                          color: 'red',
                          fontWeight: '700'
                        }}>
                          {
                            (() => {
                              const today = new Date();
                              const retDate = new Date(data.return_date);
                              const diff = retDate - today;
                              const days = -1*Math.floor(diff / (1000 * 60 * 60 * 24)); 
                              return days;
                            })()
                          } days ago
                        </TableCell>
                        <TableCell align="left">{data.return_date.substring(0,10)}</TableCell>
                      </TableRow>
                    ))) : (<TableRow>
                      <TableCell>
                        All Clear
                      </TableCell>
                    </TableRow>)}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </main>
          {
            //sideUserInfos && <UserInfosside userId={userselected}/>
            <Box>
              <Box
                sx={{
                  '& > :not(style)': {
                    display: 'flex',
                    width: sideUserInfos ? 450 : 0,
                    transition: 'all 200ms ease-in-out',
                    transitionProperty: 'width'
                  }
                }}
                
              >
                <div>
                  <Box sx={{ width: '50%' }}>
                    <Collapse orientation="horizontal" in={sideUserInfos}>

                    { getdata.length > 0 ? ( getdata.map((data) => (
                      <UserInfosside userId={userselected} onClose={() => setSideUserInfos(false)} setMailSection={setMailSection} setUserMail={setUserMail}/>
                    ))) : (<></>)
                    }
                    </Collapse>
                  </Box>
                </div>
              </Box>
            </Box>
          }
        </div>
      </div>
      {
        MailSection && (
          <div className='absolute inset-0 z-50 w-screen h-screen'>
            <div className="absolute w-full h-full" style={{ backdropFilter: 'blur(10px)' }}  onClick={()=>setMailSection(false)}></div>
            <div className="relative w-1/2 top-1/2 left-1/2 bg-slate-200 -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg">
              <TextField disabled placeholder='Destination' sx={{backgroundColor: 'white', marginBottom: '10px', color: 'black'}} onChange={(e)=>setUserMail(e.target.value)} value={UserMail} fullWidth />
              <TextField placeholder='Subject' sx={{backgroundColor: 'white', marginBottom: '10px', color: 'black'}} onChange={(e)=>setSubject(e.target.value)} value={Subject} fullWidth/>
              <Editor
                apiKey={import.meta.env.VITE_TINY_API_CODE}
                value={content}
                onEditorChange={handleEditorChange}
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                  ],
                  toolbar:
                    "undo redo | formatselect | bold italic backcolor | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | removeformat | help",
                }}
                placeholder="Enter your text here"
              />

              <Button fullWidth sx={{
                marginTop: '10px',
                backgroundColor: 'white'
              }}
              onClick={(e) => SendMail({event: e, to: UserMail, message: content, subject: Subject})}
              >Send</Button>
              {
                message != null ? (
                  <div className={`w-full flex justify-between mt-3 p-3 ${message != "Error sending the message - try again after 2 min or contact the developper" ? 'bg-green-400 border-green-800' : 'bg-red-400 border-red-800'} border-[1px] rounded-lg`}>
                    <p>{message}</p>
                    <button>
                      <CloseOutlined onClick={()=>setmessage(null)}/>
                    </button>
                  </div>
                ) : (<></>)
              }
            </div>
          </div>
        )
      }
    </div>
  );
}

export default withAdminCheck(Dashboard);