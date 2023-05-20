import React, {useState, useEffect} from 'react';
import withAdminCheck from './withAdminCheck';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import { getDatabase, onValue, ref, set, update, get, push } from 'firebase/database';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { CloseOutlined } from '@mui/icons-material';

const Request = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [Requests, setRequests] = useState([]);
    const [alertmessage, setalertmessage] = useState("")
    const db = getDatabase();

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
            
            if (borrow.requested==true) {
              return { ...borrow, userId, borrowId };
            } else {
              return null;
            }
          }).filter(borrow => borrow !== null);
          return userBorrows;
        }).flat();
        setRequests(usersWithBorrows);
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

    function Alert({message, onClose}){
      return(
        <div className={`py-3 px-4 bg-green-300 rounded-lg border-green-950 border-2 transform ${message !== "" ? 'translate-x-0' : 'translate-x-96'} transition-all delay-200 ease-in-out`}>
          <div className="flex gap-3">
            <button onClick={onClose}>
              <CloseOutlined sx={{fontSize: '20px'}}/>
            </button>
            <p>
              {message}
            </p>
          </div>
        </div>
      )
    }

    async function HandelReturn({event, userId, Bookid, BorrowId}){
      event.preventDefault();
      const HistoryRef = ref(db,`users/${userId}/history`);
      const BorrowRef = ref(db,`users/${userId}/borrows/${BorrowId}`);
      const BookRef = ref(db,`books/${Bookid}`);
      const bookSnap = await get(BookRef);
      const Book = bookSnap.val();
      const returnDate= new Date();
      console.log(returnDate);
      console.log(Bookid);
      try{
        await push(HistoryRef, {
          Returned_at: returnDate.toISOString(),
          BookId: Bookid
        }).then(
          await set(BorrowRef, null).then(
            await update(BookRef, {
              Quantity: Book.Quantity+1
            }).then(
              setalertmessage("Request validated with success")
            )
          )
        );
      }
      catch(error){
        console.log(error);
      }
    }
    

    return (
      <div className="flex h-screen overflow-hidden">
  
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} Requests={Requests.length}/>
  
        {/* Content area */}
        <div className="relative pt-16 flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
  
          {/*  Site header */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
  
          <main>
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
  
              {/* Welcome banner */}
              <WelcomeBanner />

              <h1 className='text-3xl font-bold'>Return Requests</h1>

              <TableContainer component={Paper} sx={{ height: 'calc(100% - 120px)', overflow: 'auto' }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="left">MEMBER</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="left">BOOK TITLE</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="left">OVERDUE</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="left">RETURN DATE</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="left">ACTION</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    { Requests.length > 0 ? ( Requests.map((data) => (
                      <TableRow
                        key={data.borrowId}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
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
                            color: (() => {
                              const today = new Date();
                              const retDate = new Date(data.return_date);
                              const diff = retDate - today;
                              const days = -1 * Math.floor(diff / (1000 * 60 * 60 * 24)); 
                              return days;
                            })() > 0 ? 'red' : 'green',
                            fontWeight: '700'
                          }}
                          >
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
                        <TableCell>
                          <button onClick={(event)=> HandelReturn({event: event, userId: data.userId, Bookid: data.Book_id, BorrowId: data.borrowId})} className='py-2 px-3 bg-blue-500 rounded-lg text-white font-bold hover:bg-blue-700'>Validate</button>
                        </TableCell>
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
            <div className="absolute bottom-0 right-0 m-8">
              <Alert message={alertmessage} onClose={() => setalertmessage("")}/>
            </div>
          </main>
        </div>
      </div>
    );
}

export default withAdminCheck(Request);