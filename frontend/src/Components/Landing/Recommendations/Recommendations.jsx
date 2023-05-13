import React, { useEffect, useState } from 'react';
import { auth } from '../../../firebase';
import { getDatabase, ref, onValue, get } from 'firebase/database';
import BookCard from '../../books/Components/bookCard';
import { useTranslation } from 'react-i18next';

export default function Recommendations() {
  const [categories, setcategories] = useState([]);
  const [user, setuser] = useState(null);
  const [RecommandedBooks, setRecommandedBooks] = useState([]);
  const [FavoritedBooks, setFavoritedBooks] = useState([]);
  const db = getDatabase();
  const [t] = useTranslation(); 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setuser(user);
      } else {
        setuser(null);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;
    const uid = user.uid;
    const FavBookRef = ref(db, `users/${uid}/favorites`);
    const unsubscribe = onValue(FavBookRef, (snapshot) => {
      const data = snapshot.val();
      const favBookIds = Object.keys(data);
      // Retrieve the actual book objects from the database
      const bookPromises = favBookIds.map(async (bookId) => {
        const bookRef = ref(db, `books/${bookId}`);
        const bookSnapshot = await get(bookRef);
        return {
          id: bookId,
          ...bookSnapshot.val(),
        };
      });
      Promise.all(bookPromises).then((bookObjects) => {
        // Extract an array of distinct categories from the favorite books
        const distinctCategories = Array.from(new Set(bookObjects.flatMap((book) => book.categories)));
        setFavoritedBooks(bookObjects);
        setcategories(distinctCategories);
      });
    });
    return unsubscribe;
  }, [user]);
  
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
  
          // Filter out favorited books
          const filteredBooks = bookArray.filter(
            (book) => !FavoritedBooks.some((favBook) => favBook.id === book.id)
          );
  
          // Select a random subset of categories from the list
          const numCategories = Math.floor(Math.random() * categories.length) + 1;
          const randomCategories = [];
          for (let i = 0; i < numCategories; i++) {
            const randomCategory =
              categories[Math.floor(Math.random() * categories.length)];
            if (!randomCategories.includes(randomCategory)) {
              randomCategories.push(randomCategory);
            }
          }
  
          // Filter books that have at least one matching category
          const filteredByCategory = filteredBooks.filter((book) => {
            for (let i = 0; i < randomCategories.length; i++) {
              if (book.categories.includes(randomCategories[i])) {
                return true;
              }
            }
            return false;
          }).slice(0, 4);
          setRecommandedBooks(filteredByCategory);
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchBooks();
  }, [categories, FavoritedBooks]);
  
  
  return (
    <div>
      {RecommandedBooks.length > 0 ? 
      <div className="px-12 py-12">
        <div className="text-4xl font-bold">{t('recommended_for_you')}</div>
        <ul className="mb-6">
          {
            RecommandedBooks.length > 0 ? (
              <div className='grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-4'>
                {
                  RecommandedBooks.map(book => (
                    <li className="list-none  mx-auto book-item relative transition-transform delay-150 ease-linear w-full">
                      <BookCard 
                      id={book.id}
                      title={book.title} 
                      author={book.author} 
                      description={book.description} 
                      image={book.image}
                      key={book.id}
                    />
                    </li>
                  ))
                }
              </div>
            ) : (<>Error getting data</>)
          }
        </ul>
      </div> : <></>}
    </div>
  );
}
