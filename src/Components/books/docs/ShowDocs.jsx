import React, { useEffect, useState, useRef } from 'react';
import NavBar from '../../NavBar/NavBar';
import { useParams } from 'react-router-dom';
import { getDatabase, ref, onValue, set } from "firebase/database";
import { CloseSharp } from '@mui/icons-material';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { LinearProgress, IconButton } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { auth } from '../../../firebase';
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


function ShowDocsUser() {
  const { id } = useParams();
  const [doc, setdoc] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [loading, setloading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const history = useHistory();

  //this check for the user and show his infos
  const [docs, setdocs] = useState([]);

  useEffect(() => {
    
    const fetchDocs = async () => {
      try {
        if (true) {
          // User is signed in, fetch user data
          const db = getDatabase();
          const docRef = ref(db, `docs`);
          onValue(docRef, (snapshot) => {
            const data = snapshot.val();
            const docArray = Object.keys(data).map(key => ({
              id: key,
              ...data[key]
            })).filter(doc => doc.id !== id).slice(0,5);
            setdocs(docArray);
            setloading(false);
          });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchDocs();
  }, []);

  useEffect(() => {
    const fetchDoc = async () => {
        // User is signed in, fetch user data
        const db = getDatabase();
        const userDataRef = ref(db, `docs/${id}`);
        onValue(userDataRef, (snapshot) => {
          const data = snapshot.val();
          setdoc(data);
        });
    };

    // Fetch doc on mount or when id changes
    fetchDoc();

    // Unsubscribe from the listener when the component is unmounted
    return fetchDoc;
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

  function PdfViewer({ url }) {
    console.log(url);
    return (
      <div style={{ width: '100%', height: '100vh' }}>
        <object data={url} type="application/pdf" width="100%" height="100%">
          <p>Sorry, your browser does not support PDFs. Please download the PDF to view it: <a href={url}>Download PDF</a>.</p>
        </object>
      </div>
    );
  }

  if (!doc) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavBar />
      <div className='mt-16 p-4'>
        <div className="flex flex-col md:flex-row md:gap-8">
          <div className="flex flex-col justify-center w-full md:w-2/3">
            <h1 className="text-3xl font-bold text-gray-800">{doc.name}</h1>
            <p className="mt-4 text-lg leading-7 text-gray-700">{doc.description}</p>
          </div>
        </div>
        <div className="mt-6">
            {/* doc listing */}
            {PdfViewer({url: doc.doc})}
          </div>
      </div>
    </>
  );
}

export default ShowDocsUser;
