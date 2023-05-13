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

function ShowDocs() {
  const db = getDatabase();
  {/*its me    */ }

  const [getdoc, setdoc] = useState([]);
  useEffect(() => {
    const docref = ref(db, "docs");
    onValue(docref, (snapshot) => {
      const data = snapshot.val();
      const docarray = [];
      for (let id in data) {
        docarray.push({ id, ...data[id] });
      }
      setdoc(docarray);
    });
  }, []);

  const handleDeletedoc = async ({ id, imageUrl }) => {
    const db = getDatabase();
    const docRef = ref(db, `docs/${id}`);//ref of the line with the id in the table book
    await remove(docRef);
    const storage = getStorage();
    const pictureRef = storageRef(storage, imageUrl);
    await deleteObject(pictureRef);
  };

  {/*its me    */ }
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative pt-16 flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            {/* Welcome banner */}
            <WelcomeBanner />
            <Link to="/docs/adddoc" className='my-5 bg-mypalette-1 rounded-lg p-2 text-white font-bold'>Add Documents</Link>
            <div className="w-5 h-5"></div>

            {/* second table*/}
            <TableContainer component={Paper} sx={{ height: 'calc(100% - 120px)', overflow: 'auto' }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }} align="left">NAME</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="left">DESCRIPTION</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="left">CATEGORY</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="left">ACTIONS</TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {getdoc.map((docc) => (
                    <TableRow key={docc.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell align='left'>
                        <p className='my-auto'>{docc.name}</p>
                      </TableCell>
                      <TableCell align="left">{`${docc.description.substring(0, Math.min(docc.description.indexOf('\n') !== -1 ? docc.description.indexOf('\n') : 90, 90))}...`}</TableCell>
                      <TableCell align="left">{docc.category}</TableCell>
                      <TableCell align="left">
                        <button class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg" onClick={() => {
                          if (window.confirm('Are you sure you want to delete this book?')) {
                            handleDeletedoc({
                              id: docc.id,
                              imageUrl: docc.image
                            })
                          }
                        }}>
                          Delete
                        </button>
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

export default withAdminCheck(ShowDocs);