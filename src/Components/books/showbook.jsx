import React, { useEffect, useState, useRef } from 'react';
import NavBar from "../NavBar/NavBar"
import { useParams } from 'react-router-dom';
import { getDatabase, ref, onValue, set } from "firebase/database";
import { CloseSharp } from '@mui/icons-material';
import BookCard from './Components/bookCard';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { LinearProgress, IconButton } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { auth } from '../../firebase';
import { useHistory } from 'react-router-dom';

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


function ShowBook() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [loading, setloading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const history = useHistory();

  //this check for the user and show his infos
  const [Books, setBooks] = useState([]);

  useEffect(() => {
    
    const fetchBooks = async () => {
      try {
        if (true) {
          // User is signed in, fetch user data
          const db = getDatabase();
          const bookRef = ref(db, `books`);
          onValue(bookRef, (snapshot) => {
            const data = snapshot.val();
            const bookArray = Object.keys(data).map(key => ({
              id: key,
              ...data[key]
            })).filter(book => book.id !== id).slice(0,5);
            setBooks(bookArray);
            setloading(false);
          });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchBooks();
  }, []);

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

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavBar />
      <div className='mt-16 p-4'>
        <div className="flex flex-col md:flex-row md:gap-8">
          <div className="rounded-lg shadow-lg overflow-hidden w-full md:w-1/3">
            <div className="relative">
              <img src={book.image} alt={book.title} className="w-full h-full object-cover max-h-96 max-w-full cursor-pointer" onClick={toggleOverlay} />
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
            </div>
          </div>
          <div className="flex flex-col justify-center w-full md:w-2/3">
            <h1 className="text-3xl font-bold text-gray-800">{book.title}</h1>
            <h2 className="text-2xl text-gray-500">{book.author}</h2>
            <p className="mt-4 text-lg leading-7 text-gray-700">{book.description}</p>
            <p className="mt-4 text-md leading-4 text-gray-700">
              Genre: {book.categories.map((category, index) => (
                <React.Fragment key={category}>
                  <a href={`/genres/${encodeURIComponent(category)}`} className='inline text-mypalette-2 hover:underline'>{category}</a>
                  {index !== book.categories.length - 1 && ', '}
                  {index === book.categories.length - 1 && '.'}
                </React.Fragment>
              ))}
            </p>
            <div className="flex gap-4 mt-6">
              <button className="px-6 py-2 bg-blue-500 text-white text-bold rounded-md shadow-md hover:bg-blue-600 transition duration-200">Borrow it</button>
              <button className="px-6 py-2 bg-gray-200 text-blue-600 text-bold rounded-md shadow-md hover:bg-gray-300 transition duration-200">Buy it</button>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">You might also like:</h3>
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
                <p className="text-center text-gray-500">No books found.</p>
              )}
            </ul>
          </div>
      </div>
    </>
  );
}

export default ShowBook;
