import React, { useEffect, useState, useRef } from 'react';
import NavBar from "../NavBar/NavBar";
import { emphasize, styled, createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { useParams,useHistory } from 'react-router-dom';
import { getDatabase, ref, onValue, set, update, push, get } from "firebase/database";
import { CloseSharp } from '@mui/icons-material';
import BookCard from './Components/bookCard';
import { LinearProgress, IconButton, Breadcrumbs, Chip } from '@mui/material';
import { Favorite, FavoriteBorder, Home } from '@mui/icons-material';
import { auth } from '../../firebase';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === 'light'
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

function handleClick(num) {
  switch(num){
    case 0:
      history.push("/");
      break;
    case 1:
      history.push("/books");
      break;
    case 2:
      break;
  }
}

function ImageOverlay({ imageUrl, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-75" onClick={onClose} />
      <div className="absolute bottom-0 left-0 w-full p-4">
        <div className="relative">
          <button
            className="absolute top-0 right-0 m-4 p-2 text-white bg-gray-900 rounded-full shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            onClick={onClose}
          >
            <CloseSharp />
          </button>
          <img src={imageUrl} alt="" className="h-[800px] max-w-full" />
        </div>
      </div>
    </div>
  );
}

function BorrowOverlay({idBook, onClose}){
   //this check for the user and show his infos
   const [Book, setBook] = useState(null);
   const [Confirm, setConfirm] = useState(false);
   const [Borrowed, setBorrowed] = useState(false)
   const [DateEmprint, setDateEmprint] = useState(new Date());
   const [Error, setError] = useState(null);
   const history = useHistory();
   const user = auth.currentUser;
   const [t] = useTranslation();
   useEffect(() => {
     const fetchBook = async () => {
         // User is signed in, fetch user data
         const db = getDatabase();
         const userDataRef = ref(db, `books/${idBook}`);
         onValue(userDataRef, (snapshot) => {
           const data = snapshot.val();
           setBook(data);
           console.log(data)
         });
     };
     // Fetch book on mount or when id changes
     fetchBook();
 
     // Unsubscribe from the listener when the component is unmounted
     return fetchBook;
   }, [idBook]);

   const HandelBorrow = async () => {
    try {
      const bookRef = ref(getDatabase(), `books/${idBook}`);
      const bookSnap = await get(bookRef);
      const Book = bookSnap.val();

      if(!user){
        history.push('/login');
      }
  
      // Check if user already has this book in borrows
      const userBorrowsRef = ref(getDatabase(), `users/${user.uid}/borrows`);
      const borrowsSnap = await get(userBorrowsRef);
      const borrowsData = borrowsSnap.val();
      const existingBorrow = Object.values(borrowsData || {}).find(
        (borrow) => borrow.Book_id === idBook
      );
      
      if(Object.keys(borrowsData || {}).length >= 2){
        setError(t('you_reached'));
        return;
      }
      if (existingBorrow) {
        setError(t('you_already_have_b'));
        return;
      }
  
      // Add borrows to user tables
      const returnDate = new Date(DateEmprint);
      returnDate.setDate(returnDate.getDate() + 14); // assuming a 14-day borrowing period
      const newBorrowRef = push(userBorrowsRef);
      await update(newBorrowRef, {
        Book_id: idBook,
        borrowdate: DateEmprint,
        return_date: returnDate,
      });
  
      // Updating book quantity
      await update(bookRef, { Quantity: Book.Quantity - 1 });
      setBorrowed(true);
    } catch (error) {
      console.log(error);
    }
  };

  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0" style={{ backdropFilter: 'blur(10px)' }} onClick={onClose} />
      <div className="absolute w-full p-4 container">
        <div className="relative min-h-fit left-1/2 -translate-x-1/2 max-w-md bg-white rounded-lg p-4 border-mypalette-2 border-2 transition-all delay-150">
          <div className="text-xl text-mypalette-2">
            {t('book_title')}: <p className='font-bold inline w-fit'>{Book ? Book.title : "Loading"}</p>
          </div>
          <div className='relative flex flex-col gap-5 top-1/2 w-full'>
            <h1>{t('select_date_to_borrow')}</h1>
            <input 
              type="date" 
              required
              className='outline-none w-full py-4 px-4 rounded-md border-2'  
              autoComplete="off"
              value={
                DateEmprint.getFullYear().toString() +
                "-" +
                (DateEmprint.getMonth() + 1).toString().padStart(2, 0) +
                "-" +
                DateEmprint.getDate().toString().padStart(2, 0)
              }
              onChange={(e) => {
                setDateEmprint(new Date(e.target.value));
              }}
              //add min function
            />
          </div>
          <div className="relative mt-5">
            <button onClick={() => setConfirm(true)} className="px-6 py-2 bg-blue-500 text-white text-bold rounded-md shadow-md hover:bg-blue-600 transition duration-200">{t('borrow_it')}</button>
          </div>
          {
            Error==null ? (
              !Borrowed ? (Confirm ? (<div className=' bg-slate-300 mt-5 p-4 rounded-lg'>
                {t('do_you_conf')}
                <div className="relative mt-5 flex gap-5">
                  <button onClick={HandelBorrow} className="px-6 py-2 bg-blue-500 text-white text-bold rounded-md shadow-md hover:bg-blue-600 transition duration-200">{t('yes')}</button>
                  <button onClick={onClose} className="px-6 py-2 bg-red-500 text-white text-bold rounded-md shadow-md hover:bg-red-600 transition duration-200">{t('no')}</button>
                </div>
              </div>) : (<></>)) : (
                <div className=' bg-green-200 mt-5 p-4 rounded-lg'>
                  <h1 className="text-green-600">
                    {t('you_have_b')}
                  </h1>
                </div>
              )
            ) : (
              <div className=' bg-red-200 mt-5 p-4 rounded-lg'>
                <h1 className="text-red-600">
                  {Error}
                </h1>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}


function ShowBook() {
  const { id } = useParams();
  const [showOverlay, setShowOverlay] = useState(false);
  const [showBorrowOverlay, setShowBorrowOverlay] = useState(false);
  const [loading, setloading] = useState(false);
  const [readmore, setreadmore] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false);
  const history = useHistory();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const [t] = useTranslation();

  //this check for the user and show his infos
  const [book, setBook] = useState(null);
  const [Books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBook = async () => {
        // User is signed in, fetch user data
        const db = getDatabase();
        const userDataRef = ref(db, `books/${id}`);
        onValue(userDataRef, (snapshot) => {
          const data = snapshot.val();
          setBook(data);
        });
    };
    // Fetch book on mount or when id changes
    fetchBook();

    // Unsubscribe from the listener when the component is unmounted
    return fetchBook;
  }, [id]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        if (book) {
          // User is signed in, fetch user data
          const db = getDatabase();
          const bookRef = ref(db, "books");
          onValue(bookRef, (snapshot) => {
            const data = snapshot.val();
            const bookArray = Object.keys(data).map(key => ({
              id: key,
              ...data[key],
            })).filter(otherBook => 
              otherBook.id !== id && otherBook.categories.some(category => book.categories.includes(category))
            ).slice(0,5);
            setBooks(bookArray);
          });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchBooks();
  }, [book, id]);
  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user)=>{
      if(user){
        const dbRef = ref(getDatabase(), 'users/'+user.uid+'/favorites/' + id);
        onValue(dbRef, (snapshot) => {
          setIsFavorited(snapshot.exists());
        });
      }
    });
    return unsubscribe;
  }, [id]);

  const handleFavoriteClick = () => {
    const user = auth.currentUser;
    if(user){
      const dbRef = ref(getDatabase(), 'users/'+user.uid+'/favorites/' + id);
      if (isFavorited) {
        set(dbRef, null);
      } else {
        set(dbRef, true);
      }
      setIsFavorited(!isFavorited);
    } else{
      history.push('/login');
    }
  };

  const toggleOverlay = () => {
    /*if (event.target.closest('.MuiIconButton-root') !== null) {
      return;
    }*/
    setShowOverlay(!showOverlay);
  };

  const toggleBorrowOverlay = () => {
    if(book.Quantity>0)
    {
      setShowBorrowOverlay(!showBorrowOverlay);
    }
  }

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavBar />
      <div className=' mt-14 p-4'>
      <div role="presentation" onClick={handleClick} className="z-20 my-3">
        <Breadcrumbs aria-label="breadcrumb">
          <StyledBreadcrumb
            component="a"
            href="/"
            onClick={()=>handleClick(0)}
            label={t('home')}
            icon={<Home fontSize="small" />}
          />
          <StyledBreadcrumb component="a" href="/books" onClick={()=>handleClick(1)} label={t('book')} />
          <StyledBreadcrumb
            label={matches ? book.title : `${book.title.substring(0, Math.min(book.title.indexOf('\n') !== -1 ? book.title.indexOf('\n') : 15, 15))}...`}
            onClick={()=>handleClick(2)}
          />
        </Breadcrumbs>
      </div>
        <div className="flex flex-col md:flex-row md:gap-8">
          <div className="rounded-lg shadow-lg overflow-hidden w-full md:w-1/3">
            <div className="relative max-h-96">
              <img src={book.image} alt={book.title} className="w-full h-full object-cover max-w-full cursor-pointer" onClick={toggleOverlay} />
              <div className="absolute top-2 right-2 z-10">
                <div className="bg-white rounded-full p-2">
                  <IconButton 
                    color={isFavorited ? "primary" : "default"} 
                    aria-label="add to favorites"
                    onClick={handleFavoriteClick}
                    sx={{
                      backgroundColor: 'white',
                      ":hover" : {
                        backgroundColor: '#F7F7F7'
                      }
                    }}
                  >
                    {isFavorited ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>
                </div>
              </div>
              {showOverlay && 
                <ImageOverlay imageUrl={book.image} onClose={() => setShowOverlay(false)}/>
              }
              {
                showBorrowOverlay &&
                <BorrowOverlay idBook={id} onClose={() => setShowBorrowOverlay(false)}/>
              }
            </div>
          </div>
          <div className="flex flex-col justify-center w-full md:w-2/3">
            <h1 className="text-3xl font-bold text-gray-800 mt-5 lg:mt-0">{book.title}</h1>
            <h2 className="text-2xl text-gray-500">{book.author}</h2>
            <p className="mt-4 text-lg leading-7 text-gray-700">
              {!matches ? (readmore ? book.description : `${book.description.substring(0, Math.min(book.description.indexOf('\n') !== -1 ? book.description.indexOf('\n') : 250, 250))}...`) : book.description}
            </p>
            {!matches && (
              <p>
                <button onClick={() => setreadmore(!readmore)} className="text-mypalette-2 mt-2 underline">
                  {readmore ? "Read Less" : "Read More"}
                </button>
              </p>
            )}
            <p className="mt-4 text-md leading-4 text-gray-700">
              Genre: {book.categories.map((category, index) => (
                <React.Fragment key={category}>
                  <a href={`/genres/${encodeURIComponent(category)}`} className='inline text-mypalette-2 hover:underline'>{category}</a>
                  {index !== book.categories.length - 1 && ', '}
                  {index === book.categories.length - 1 && '.'}
                </React.Fragment>
              ))}
            </p>
            <p className={book.Quantity ? "mt-4 text-lg leading-7 w-fit py-1 px-2 rounded-lg text-white bg-green-500" : 
            "mt-4 text-lg leading-7 w-fit py-1 px-2 rounded-lg text-white bg-red-500"}>{book.Quantity > 0 ? t('available') : t('not_available')}</p>
            <div className="flex gap-4 mt-6">
              <button disabled={book.Quantity == 0} onClick={() => setShowBorrowOverlay(true)} className={book.Quantity > 0 ? "px-6 py-2 bg-blue-500 text-white text-bold rounded-md shadow-md hover:bg-blue-600 transition duration-200" : "px-6 py-2 bg-slate-500 text-white text-bold rounded-md shadow-md"}>{t('borrow_it')}</button>
              <button className="px-6 py-2 bg-gray-100 text-blue-600 text-bold rounded-md shadow-md hover:bg-gray-200 transition duration-200">{t('buy_it')}</button>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">{t('you_might_like')}</h3>
            {/* book listing */}
            <ul className='mb-4'>
              {loading ? (
                <LinearProgress sx={{
                  color: '#1877B6',
                  backgroundColor: '#00b4d8'
                }}/> 
              ) : Books.length > 0 ? (
                <div className='grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-1 gap-4'>
                  {Books.map((booksugg) => {
                    return booksugg.id === id ? (
                      <React.Fragment key={booksugg.id} />
                    ) : (
                      <li className='list-none mx-auto book-item relative transition-transform delay-150 ease-linear' key={booksugg.id}>
                        <BookCard 
                          id={booksugg.id}
                          title={booksugg.title} 
                          author={booksugg.author} 
                          description={booksugg.description} 
                          image={booksugg.image}
                        />
                      </li>
                    );
                  })}
                </div>
                ) : (
                <p className="text-center text-gray-500">{t('no_book_f')}</p>
              )}
            </ul>
          </div>
      </div>
    </>
  );
}

export default ShowBook;
