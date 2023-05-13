import React, { useState, useEffect } from 'react';
import NavBar from '../NavBar/NavBar';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { auth } from '../../firebase';
import { getDatabase, onValue, ref } from 'firebase/database';
import ProfileHeaderInfos from './Components/profileHeaderInfos';
import terminal from 'virtual:terminal';
import BookCard from '../books/Components/bookCard';
import "../books/style/style.css";

export default function Playlists() {
  const [Books, setBooks] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [playlists, setplaylists] = useState([]);
  const [selectedplaylist, setselectedplaylist] = useState('');
  const [booksidinPlaylist, setbooksidinPlaylist] = useState([])


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
    const playlistRef = ref(db, `users/${user.uid}/playlists`);

    setLoading(true);
    const unsubscribe = onValue(playlistRef, snapshot => {
      const data = snapshot.val();
      const bookArray = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setplaylists(bookArray);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const db = getDatabase();
    const playlistRef2 = ref(db, `users/${user.uid}/playlists/${selectedplaylist}/`);
    const booksRef = ref(db, `books`);

    setLoading(true);
    const unsubscribe = onValue(playlistRef2, snapshot => {
      const data = snapshot.val();
      const booksids = Object.keys(data);

      onValue(booksRef, snapshot => {
        const booksData = snapshot.val();
        const booksinplaylist = Object.keys(booksData).filter(key => booksids.includes(key)).map(key => ({
          id: key,
          ...booksData[key]
        }));
        setLoading(false);
        setBooks(booksinplaylist);
        console.log(booksinplaylist);
      });
    });

    return unsubscribe;
  }, [selectedplaylist]);




  return (
    <div>
      <NavBar />
      <main className="pt-20 p-4 bg-[#f5f5f5] flex min-h-screen flex-col gap-5">
        {/*profile header*/}
        <ProfileHeaderInfos />
        {/*borrowed books */}
        <div>
          <div className='shadow-md'>
            <div className="flex flex-col gap-2 pt-5 bg-white py-4 px-14 rounded-b-lg min-w-[300px]">
              <div id="name">
                <h1 className="text-2xl font-bold">
                  PlayLists
                </h1>
                <ul>
                  <div className="flex mt-5">
                    <div className="w-1/4 p-4">
                      <ul className='flex flex-col gap-3'>
                        {playlists ? playlists.length > 0 ? (
                          playlists.map(playlist => (
                            <button className='flex w-full' onClick={() => setselectedplaylist(playlist.id)}> {/*onClick={} */}
                              <li className='text-slate-900 p-2 w-full mx-auto bg-slate-100 rounded-lg hover:bg-slate-200'>
                                {playlist.id}
                              </li>
                            </button>
                          ))
                        ) : (<></>) : (<></>)}
                      </ul>
                    </div>
                    <div className=" w-3/4 h-fit">
                      <ul className='flex w-full'>
                        {
                          selectedplaylist === "" ? (
                            <div className='my-auto mx-auto '>
                              Select a playlist to display its books
                            </div>
                          ) : (
                            <TransitionGroup className="book-list grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 gap-4">
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
                              ))):(<></>) : (<></>)
                              }
                        </TransitionGroup>
                        )}
                      </ul>
                    </div>
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
