import React,{useState, useEffect} from 'react';
import NavBar from '../NavBar/NavBar';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { auth } from '../../firebase';
import { getDatabase, onValue, push, ref, update } from 'firebase/database';
import ProfileHeaderInfos from './Components/profileHeaderInfos';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const [Books, setBooks] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const [t] = useTranslation();

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
      const borrowsData = snapshot.val();
      const borrows = [];
      for (const key in borrowsData) {
        borrows.push({ id: key, ...borrowsData[key] });
      }
    
      onValue(booksRef, snapshot => {
        const booksData = snapshot.val();
        const borrowedBooks = [];
        for (const key in booksData) {
          const borrowedBook = borrows.find(borrow => borrow.Book_id === key);
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

  async function RequestReturn({ e, borrowId }) {
    // here goes some code
    e.preventDefault();
    const user = auth.currentUser;
    const db = getDatabase();
    if(!user) return;
    if (window.confirm(t('confirmReturn'))) {
      // update requested.
      const today = new Date();
      const borrowRef = ref(db, `users/${user.uid}/borrows/${borrowId}`);
      update(borrowRef, {
        requested: true,
        requestDate: today.toISOString()
      })
    }
  }

  return (
    <div>
        <NavBar />
        <main className="pt-20 p-4 bg-[#f5f5f5] flex min-h-screen flex-col gap-5">
          {/*profile header*/}
          <ProfileHeaderInfos />
          {/*borrowed books */}
          <div>
            <div className='shadow-md'>
              <div className="flex flex-col gap-2 pt-5 bg-white py-4 px-14 rounded-b-lg">
                <div id="name">
                  <h1 className="text-2xl font-bold">
                    {t('borrowed_books')}
                  </h1>
                  <ul>
                  <div className="">
                      <TransitionGroup className="book-listgrid grid-cols-1 mt-4">
                        {!Loading ? Books.length > 0 ? Books.map((book) => (
                          <CSSTransition timeout={500} classNames="book" key={book.id}>
                            <li className='mb-3 flex list-none mx-auto book-item relative transition-transform delay-150 ease-linear'>
                              <div className="flex flex-col lg:flex-row w-full items-center p-4 rounded-lg border-mypalette-4 border-2">
                                <div className='flex w-full mb-4'>
                                  <img src={book.image} alt={book.title} className="w-24 h-24 rounded-md shadow-md mr-4" />
                                  <div className='flex flex-col'>
                                    <h2 className="text-lg font-medium mb-2">{!matches ? `${book.title.substring(0, Math.min(book.title.indexOf('\n') !== -1 ? book.title.indexOf('\n') : 20, 20))}...` : book.title }</h2>
                                    <h3 className="text-gray-500">{book.author}</h3>
                                  </div>
                                </div>
                                <div className="flex w-full justify-between lg:justify-end">
                                  <div className='my-auto mr-4'>
                                    {/*here i want to show the due date that is in borrows */}
                                    {(() => {
                                      if (book.borrow.requested) {
                                        return <p className='text-green-600 font-bold'>{t('returnRequested')}</p>
                                      }
                                      const today = new Date();
                                      const retDate = new Date(book.borrow.return_date);
                                      const diff = retDate - today;
                                      const days = -1 * Math.floor(diff / (1000 * 60 * 60 * 24));
                                      if (days > 0) {
                                        return <p className='text-red-500 font-bold'>{t('shouldHaveReturned')} {days} {t('daysAgo')}</p>;
                                      }
                                      else {
                                        return <p className='text-green-600 font-bold'>{t('returnIn')} {-days} {t('days')}</p>
                                      }
                                    })()}
                                  </div>
                                  {
                                    book.borrow.requested ? (<></>) : (<button onClick={(e) => RequestReturn({ e: e, borrowId: book.borrow.id })} className='px-4 py-2 bg-mypalette-4 rounded-lg text-white font-bold hover:bg-mypalette-5'>{t('return')}</button>)
                                  }
                                </div>
                              </div>
                            </li>
                          </CSSTransition>
                        )) : (
                          <div>{t('noBorrowedBooks')}</div>
                        ) : (<></>)}
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
