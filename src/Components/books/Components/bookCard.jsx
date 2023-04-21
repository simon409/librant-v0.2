import React, {useState, useEffect} from 'react';
import { 
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    Typography,
    IconButton,
    Button,
    FormControl,
    TextField,
    InputLabel
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import { Favorite, FavoriteBorder, PlaylistAdd, PlaylistAddCheck } from '@mui/icons-material';

import { getDatabase, ref, onValue, set, get } from 'firebase/database';
import { auth } from '../../../firebase';


function AddPlayList({idbook, onClose, playlisted, playlistedname}) {
  const [playlists, setPlaylists] = useState([]);
  const [newP, setnewP] = useState(false);
  const [playlistname, setplaylistname] = useState('');

  console.log(playlistedname);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const playlistsRef = ref(getDatabase(), `users/${user.uid}/playlists`);
      onValue(playlistsRef, (snapshot) => {
        const playlistsData = snapshot.val();
        if (playlistsData) {
          const playlistsList = Object.entries(playlistsData).map(([id, data]) => ({
            id,
            ...data,
          }));
          setPlaylists(playlistsList);
          //console.log(playlistsList);
          
        } else {
          setPlaylists([]);
        }
      });
    } else {
      history.push('/login');
    }
  }, []);

  const addToPlayList = ({playlistID}) => {
      const user = auth.currentUser;
      if (user) {
        const playlistsRef = ref(getDatabase(), `users/${user.uid}/playlists/${playlistID}/${idbook}`);
        if(playlistedname.includes(playlistID)){
          set(playlistsRef, null);
        }
        else{
          set(playlistsRef, true).then(() => {
            onClose();
          });
        }
      } else {
        history.push('/login');
      }
  }
  const [showMessage, setShowMessage] = useState(false);

  const createPlayList = () => {
    if (playlistname === '') {
      setShowMessage(true);
      return;
    }

    const user = auth.currentUser;
    if (user) {
      const playlistsRef = ref(getDatabase(), `users/${user.uid}/playlists/${playlistname}/${idbook}`);
      set(playlistsRef, true).then(() => {
        onClose();
      });;
      setShowMessage(false);
    } else {
      history.push('/login');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-white opacity-50 filter blur-lg" onClick={onClose}/>
      <div className="">
        <div className="relative">
          <div className=" w-fit h-fit bg-white border-mypalette-2 border-2 rounded-lg p-4">
            <h1 className='text-xl text-mypalette-2 mb-2'>Add to playlist</h1>
            <div className="w-full h-[1px] bg-mypalette-2 mb-2"></div>
            <ul>
              {
                playlists.length > 0 ? (
                  playlists.map((playlist) => {
                    return(
                      <li className='mb-2' key={playlist.id}>
                        <Button sx={
                          {
                            justifyContent: 'flex-start',
                            paddingLeft: '2px',
                            color: '#0077b6',
                            textTransform: 'lowercase',
                          }
                        }
                        onClick={() => addToPlayList({ playlistID: playlist.id })}
                        variant="filled" 
                        fullWidth
                        >
                          {playlisted && playlistedname.includes(playlist.id)?
                            <PlaylistAddCheck style={{marginRight: '5px'}} />
                            :
                            <PlaylistAdd style={{marginRight: '5px'}} />
                          }
                          {playlist.id}
                        </Button>
                      </li>
                    )
                  })
                ) :(
                  <>
                    <h1 className='mb-2'>No PlayList Yet - Create one below</h1>
                  </>
                )
              }
            </ul>
            <div className="w-full h-[1px] bg-mypalette-2 mb-2"></div>
            {
              newP ? (
              <FormControl sx={{marginBottom: '10px', marginTop: '10px'}} fullWidth>
                <TextField
                  id="playlist"
                  name="playlist"
                  value={playlistname}
                  onChange={(e)=>setplaylistname(e.target.value)}
                  label="Playlist Name"
                  fullWidth
                />
                 <Button 
                 sx={{marginTop: '10px'}}
                  onClick={createPlayList}
                  variant="filled" fullWidth>
                  Create playlist
                </Button>
                {showMessage && (
                  <div className="modal">
                    <div className="modal-content">
                      <h2>Please enter a playlist name</h2>
                      <button onClick={() => setShowMessage(false)}>OK</button>
                    </div>
                  </div>
                )}
              </FormControl>
              ) : (
                <Button 
                  onClick={() =>setnewP(true)}
                  variant="filled" fullWidth>
                  Create new playlist
                </Button>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}

const BookCard = ({ id, title, author, description, image }) => {
  const history = useHistory();
  
  const handleClick = (event) => {
    // Check if the click target is the IconButton or one of its children
    if (event.target.closest('.MuiIconButton-root') !== null) {
      return;
    }
    history.push(`/books/${id}`);
  };

  const [isFavorited, setIsFavorited] = useState(false);
  const [showplaylist, setshowplaylist] = useState(false);
  const [isPlayListed, setIsPlayListed] = useState(false);
  const [playlistsnames, setplaylistsnames] = useState([]);

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


  useEffect(() => {
    async function getplaylistnames() {
      const user = auth.currentUser;
      if (user) {
        const playlistsRef = ref(getDatabase(), `users/${user.uid}/playlists`);
        const snapshot = await get(playlistsRef);
        const playlistsData = snapshot.val();
        const playlistNames = [];
        if (playlistsData !== null) {
          for (const playlistId in playlistsData) {
            const playlist = playlistsData[playlistId];
            if (playlist.hasOwnProperty(id)) {
              playlistNames.push(playlistId);
            }
          }
        }
        return playlistNames;
      }
    }
    async function setplaylistsnamesAsync() {
      const playlistNames = await getplaylistnames();
      setplaylistsnames(playlistNames);
    }

    setplaylistsnamesAsync();
  }, [id]);


  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const playlistsRef = ref(getDatabase(), `users/${user.uid}/playlists`);
      onValue(playlistsRef, (snapshot) => {
        const playlistsData = snapshot.val();
        if (playlistsData) {
          const playlistsList = Object.entries(playlistsData).map(([id, data]) => ({
            id,
            ...data,
          }));
          const isBookInPlaylist = playlistsList.some((playlist) => playlist.hasOwnProperty(id));
          setIsPlayListed(isBookInPlaylist);
        }
      });
    }
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

  const handlePlayListClick = (e) => {
    e.preventDefault();
    setshowplaylist(true);
  }

  return (
    <>
      <div className="test">
        {showplaylist ? <AddPlayList idbook={id} onClose={() => setshowplaylist(false)} playlisted={isPlayListed} playlistedname={playlistsnames}/> : null}
      </div>
      <Card className="max-w-md mx-auto mt-8 cursor-pointer" onClick={handleClick}>
        
        <div className="relative">
          <CardMedia className="h-48 md:h-48 lg:h-48" image={image} title={title} />
          <div className="absolute top-2 right-2 z-10 flex gap-2">
          <IconButton 
              color={isPlayListed ? "primary" : "default"} 
              onClick={handlePlayListClick}
              aria-label="add to favorites"
              sx={{
                backgroundColor: 'white',
                ":hover" : {
                  backgroundColor: '#F7F7F7'
                }
              }}
            >
              {isPlayListed ? <PlaylistAddCheck /> : <PlaylistAdd />}
            </IconButton>
            <IconButton 
              color={isFavorited ? "primary" : "default"} 
              onClick={handleFavoriteClick}
              aria-label="add to favorites"
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
        <CardContent>
          <Typography variant="h5" color="textprimary" component="p" className=" text-mypalette-2 mb-4 text-xl">
            {title}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" component="p" className="text-teal-500 mb-4">
            {author}
          </Typography>
          <Typography variant="body2" component="p" className="text-gray-700">
            {`${description.substring(0, description.indexOf('\n') !== -1 ? description.indexOf('\n') : 90)}...`}
          </Typography>
        </CardContent>
      </Card>
    </>
    
  );
};

export default BookCard;