import React,{useState, useEffect} from 'react';
import NavBar from '../NavBar/NavBar';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { auth } from '../../firebase';
import { getDatabase, onValue, ref } from 'firebase/database';
import ProfileHeaderInfos from './Components/profileHeaderInfos';

export default function History() {
    const [history, setHistory] = useState([]);
    const [HistoryBooks, setHistoryBooks] = useState([]);
    const [Loading, setLoading] = useState(false)
    const user = auth.currentUser;
    useEffect(() => {
        if (!user) return;

        const db = getDatabase();
        const historyRef = ref(db, `users/${user.uid}/histories`);
        const booksRef = ref(db, `books`);

        setLoading(true);
        const unsubscribe = onValue(historyRef, snapshot => {
        const data = snapshot.val();
        const history = [];
        for (const key in data) {
            history.push({ id: key, Book_id: data[key].Book_id });
        }
        setHistory(history);

        onValue(booksRef, snapshot => {
            const data = snapshot.val();
            const books = [];
            for (const key in data) {
            books.push({ id: key, ...data[key] });
            }
            const historyBooks = books.filter(book => history.some(history => history.Book_id === book.id));
            setHistoryBooks(historyBooks);
            setLoading(false);
        });
        });

        return unsubscribe;
    }, [user]);

  return (
    <div>
        <NavBar />
        <main className="pt-20 p-4 bg-[#f5f5f5] flex min-h-screen flex-col gap-5">
          {/*profile header*/}
          <ProfileHeaderInfos />
          {/*history */}
          <div>
            <div className='shadow-md'>
              <div className="flex flex-col gap-2 pt-5 bg-white py-4 px-14 rounded-b-lg">
                <div id="name">
                  <h1 className="text-2xl font-bold">
                    History
                  </h1>
                  <ul>
                  <div className="">
                    <TransitionGroup className="book-listgrid grid-cols-1 gap-2 mt-4">
                      {!Loading ? HistoryBooks.length > 0 ? HistoryBooks.map((book) => (
                        //key={book.id} 
                        <CSSTransition timeout={500} classNames="book">
                          <li className='mb-3 flex list-none mx-auto book-item relative transition-transform delay-150 ease-linear'>
                            {/*<a href={`/books/${book.id}`} key={book.id} className="flex justify-between w-full items-center p-4 rounded-lg border-mypalette-4 border-2">
                              <div className='flex'>
                                <img src={book.image} alt={book.title} className="w-16 h-16 rounded-md shadow-md mr-4" />
                                <div>
                                  <h2 className="text-lg font-medium">{book.title}</h2>
                                  <h3 className="text-gray-500">{book.author}</h3>
                                </div>
                              </div>
                              <div className="flex my-auto">
                                <div>*/
                                  {/*here i want to show the due date that is in borrows */}
                                /*</div>
                              </div>
                            </a>*/}
                          </li>
                        </CSSTransition>
                      )) : (
                        <div>No history yet</div>
                      ) : (<>Loading...</>)}
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
