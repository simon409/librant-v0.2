import React, { useEffect, useState } from 'react';
import { auth } from '../../../firebase';
import BookCard from '../../books/Components/bookCard';

export default function Recommendations() {
  const [categories, setcategories] = useState([]);
  const [FavoriteBooks, setFavoriteBooks] = useState([]);
  const [RecommandedBooks, setRecommandedBooks] = useState([]);

  useEffect(() => {
    //get the current user
    const user = auth.currentUser;
    //get his favorite books

    //get the categories of his favorite books

    //distinct this category

    //get books based on this categories

  }, [])
  
  
  return (
    <div className='px-12 py-12'>
      <div className="text-4xl font-bold">Recommanded for you</div>
      {
        RecommandedBooks ? RecommandedBooks.map(book => (
          hi
        )) : (<></>)
      }
    </div>
  );
}
