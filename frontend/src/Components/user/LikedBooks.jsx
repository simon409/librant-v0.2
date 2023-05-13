import React, { useState, useEffect } from 'react';
import NavBar from '../NavBar/NavBar';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { auth } from '../../firebase';
import { getDatabase, onValue, push, ref, update } from 'firebase/database';
import ProfileHeaderInfos from './Components/profileHeaderInfos';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import BookCard from '../books/Components/bookCard';


export default function LikedBooks() {
  const [Books, setBooks] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

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
    const borrowsRef = ref(db, `users/${user.uid}/favorites`);
    const booksRef = ref(db, `books`);

    setLoading(true);
    const unsubscribe = onValue(borrowsRef, snapshot => {
      const borrowsData = snapshot.val();
      const borrows = [];
      for (const key in borrowsData) {
        borrows.push({ id: key, ...borrowsData[key] });
      }

      onValue(booksRef, snapshot => {
        const booksData = snapshot.val();
        const borrowedBooks = [];
        for (const key in booksData) {
          const borrowedBook = borrows.find(borrow => borrow.id === key);
          if (borrowedBook) {
            borrowedBooks.push({ id: key, ...booksData[key], borrow: borrowedBook });
          }
        }
        setLoading(false);
        setBooks(borrowedBooks);
        console.log(borrowedBooks);

      });
    });


    return unsubscribe;
  }, [user]);

  {/*async function RequestReturn({ e, borrowId }) {
    // here goes some code
    e.preventDefault();
    const user = auth.currentUser;
    const db = getDatabase();
    if(!user) return;
    if (window.confirm('Are you sure you want to return the book?')) {
      // update requested.
      const today = new Date();
      const borrowRef = ref(db, `users/${user.uid}/borrows/${borrowId}`);
      update(borrowRef, {
        requested: true,
        requestDate: today.toISOString()
      })
    }
  }*/}

  return (
    <div>
      <NavBar />
      <main className="pt-20 p-4 bg-[#f5f5f5] flex min-h-screen flex-col gap-5">
        <ProfileHeaderInfos />
        {/*borrowed books */}
        <div>
          <div className='shadow-md'>
            <div className="flex flex-col gap-2 pt-5 bg-white py-4 px-14 rounded-b-lg">
              <div id="name">
                <h1 className="text-2xl font-bold">
                  Liked Books
                </h1>
                <ul>
                  <div className="">
                    <TransitionGroup className="book-list grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-1 gap-4">
                      {Books ? Books.length > 0 ? (Books.map((book) => (
                        <CSSTransition key={book.id} timeout={500} classNames="book">
                          <li className='list-none mx-auto book-item relative transition-transform delay-150 ease-linear w-full'>
                            {
                              <BookCard
                                id={book.id}
                                title={book.title}
                                author={book.author}
                                description={book.description}
                                image={book.image}
                                key={book.id}
                              />
                            }
                          </li>
                        </CSSTransition>
                      ))) : (<></>) : (<></>)
                      }
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
