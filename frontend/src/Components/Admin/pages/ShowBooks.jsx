import React, { useState, useEffect } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import { Link } from 'react-router-dom';
import withAdminCheck from './withAdminCheck';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import { getDatabase, onValue, ref, remove } from 'firebase/database';
import { getStorage, ref as storageRef, deleteObject } from 'firebase/storage';

function ShowBooks() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const db = getDatabase();
        const bookRef = ref(db, "books");
        onValue(bookRef, (snapshot) => {
          const data = snapshot.val();
          const bookArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setBooks(bookArray);
          setLoading(false);
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchBooks();
  }, []);

  function createData(book) {
    return {
      id: book.id,
      title: book.title,
      author: book.author,
      description: book.description,
      image: book.image, // assuming imageUrl is a property of the book object
    };
  }

  const handleDeleteBook = async ({id, imageUrl}) => {
    const db = getDatabase();
    const bookRef = ref(db, `books/${id}`);
    await remove(bookRef);
    const storage = getStorage();
    const pictureRef = storageRef(storage, imageUrl);
    await deleteObject(pictureRef);
  };
  
  const rows = books.map((book) => createData(book));

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            {/* Welcome banner */}
            <WelcomeBanner />
            <Link className='my-5 bg-mypalette-1 rounded-lg p-2 text-white font-bold' to="/books/addbook">Add Book</Link>
            <div className="w-5 h-5"></div>
            <TableContainer component={Paper} sx={{ height: 'calc(100% - 120px)', overflow: 'auto' }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Image and Title</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="left">Author</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="left">Description</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="left">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row" sx={{display: 'flex', gap: '10px'}}>
                        <img src={row.image} alt={row.title} className=' w-14 h-14 object-cover' />
                        <p className='my-auto'>{row.title}</p>
                      </TableCell>
                      <TableCell align="left">{row.author}</TableCell>
                      <TableCell align="left">{`${row.description.substring(0, Math.min(row.description.indexOf('\n') !== -1 ? row.description.indexOf('\n') : 90, 90))}...`}</TableCell>
                      <TableCell align="left">
                        <div className="flex gap-3">
                          <Link to={`/books/modify/${row.id}`} className='p-2 bg-mypalette-1 rounded-lg text-white font-bold'>Modify</Link>
                          <Button 
                          sx={{
                            padding: '8px',
                            backgroundColor: 'red',
                            borderRadius: '8px',
                            color: '#fff',
                            fontWeight: 'bold',
                            "&:hover": {
                              backgroundColor: '#DB4C3F',
                              color: 'white',
                            },
                          }}
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this book?')) {
                              handleDeleteBook({
                                id: row.id,
                                imageUrl: row.image
                              })
                            }
                          }}
                          >Delete</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </main>

      </div>
    </div>
  );
}

export default withAdminCheck(ShowBooks);