import React,{useState, useEffect} from 'react';
import NavBar from '../NavBar/NavBar';
import { Avatar } from '@mui/material';
import { CameraAlt as Camera } from '@mui/icons-material';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { auth } from '../../firebase';
import { getDatabase, onValue, ref } from 'firebase/database';

export default function Profile() {
  const [borrows, setBorrows] = useState([]);
  const [Books, setBooks] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [UserLoading, setUserLoading] = useState(true);
  const [user, setUser] = useState(null);

  //incorrect code why ?
  /*useEffect(() => {
    setLoading(true);
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // User is signed in, fetch user 
        setuser(user);
      } else {
        // User is signed out
        setuser(null);
      }
    });
    // Unsubscribe from the listener when the component is unmounted
    return unsubscribe;
  }, []);

  useEffect(() => {
    if(user){
      setUserLoading(false)
    }
  }, [user])
  
  

  useEffect(() => {
    if (user) {
      console.log("entered useeffect");
      const db = getDatabase();
      const borrowsRef = ref(db, `users/${user.uid}/borrows`);
      const booksRef = ref(db, `books`);
      
      const unsubscribeBorrows = onValue(borrowsRef, (snapshot) => {
        const data = snapshot.val();
        const borrows = [];
        for (const key in data) {
          borrows.push({ id: key, Book_id: data[key].Book_id });
        }
        console.log("setted borrows");
        setBorrows(borrows);
      });

      const unsubscribeBooks = onValue(booksRef, (snapshot) => {
        const data = snapshot.val();
        const books = [];
        for (const key in data) {
          books.push({ id: key, ...data[key] });
        }
        setBooks(books.filter(book => borrows.some(borrow => borrow.Book_id === book.id)));
        setLoading(false);
        console.log("setted books and loading to false");
      });

      return () => {
        unsubscribeBorrows();
        unsubscribeBooks();
      };
    }
  }, [UserLoading]);*/

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;

    const db = getDatabase();
    const borrowsRef = ref(db, `users/${user.uid}/borrows`);
    const booksRef = ref(db, `books`);

    setLoading(true);
    const unsubscribe = onValue(borrowsRef, snapshot => {
      const data = snapshot.val();
      const borrows = [];
      for (const key in data) {
        borrows.push({ id: key, Book_id: data[key].Book_id });
      }
      setBorrows(borrows);

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
  }, [user]);


  const handelCameraClick = () => {
    //here goes code to upload image
  }
  return (
    <div>
        <NavBar />
        <main className="mt-16 p-4 bg-[#f5f5f5] flex flex-col gap-5">
          {/*profile header*/}
          <div className='shadow-md'>
            <div className="w-full h-[300px] bg-gradient-to-r from-mypalette-1 to-mypalette-2 rounded-t-lg">
              <div className="relative">
                <div className="absolute -bottom-96 left-16">
                  <Avatar
                    sx={{
                      width: '200px',
                      height: '200px',
                      fontSize: '50px',
                      border: 'solid 7px white'
                    }}>M</Avatar>
                    <div onClick={handelCameraClick} className="absolute bottom-5 right-2 bg-slate-200 rounded-full p-3 cursor-pointer hover:bg-slate-300 transition-all delay-100 ease-in-out">
                      <Camera />
                    </div>
                </div>
              </div>
            </div>
            {/* name and status */}
            <div>
              <div className="flex flex-col gap-2 pt-20 bg-white py-4 px-14 rounded-b-lg">
                <div id="name">
                  <h1 className="text-3xl font-bold">
                    Mohamed Addar
                  </h1>
                  <h1 className="text-xl text-slate-400">
                    Ingenieurie des systems Informatiques
                  </h1>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className='shadow-md'>
              <div className="flex flex-col gap-2 pt-5 bg-white py-4 px-14 rounded-b-lg">
                <div id="name">
                  <h1 className="text-2xl font-bold">
                    Borrowed Books
                  </h1>
                  <ul>
                  <div className="">
                    <TransitionGroup className="book-listgrid grid-cols-1 gap-2 mt-4">
                      {!Loading ? Books ? Books.map((book) => (
                        //key={book.id} 
                        <CSSTransition timeout={500} classNames="book">
                          <li className=' flex list-none mx-auto book-item relative transition-transform delay-150 ease-linear shadow-md'>
                            <a href={`/books/${book.id}`} key={book.id} className="flex justify-between w-full items-center p-4 rounded-lg shadow-md">
                              <div className='flex'>
                                <img src={book.image} alt={book.title} className="w-16 h-16 rounded-md shadow-md mr-4" />
                                <div>
                                  <h2 className="text-lg font-medium">{book.title}</h2>
                                  <h3 className="text-gray-500">{book.author}</h3>
                                </div>
                              </div>
                              <div className="flex my-auto">
                                <div>
                                  {/*here i want to show the due date that is in borrows */}
                                </div>
                                <button className='px-4 py-2 bg-mypalette-4 rounded-lg text-white font-bold hover:bg-mypalette-5'>Return</button>
                              </div>
                            </a>
                          </li>
                        </CSSTransition>
                      )) : (
                        <div>No Borrowed Books</div>
                      ) : (<>Loading</>)}
                      </TransitionGroup>
                  </div>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
    </div>
  )
}
