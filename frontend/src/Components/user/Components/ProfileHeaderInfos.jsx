import React, { useState, useEffect } from 'react';
import { Avatar, Badge, Button } from '@mui/material';
import { CameraAlt as Camera } from '@mui/icons-material';
import { getDatabase, ref as dbRef, update, onValue } from 'firebase/database';
import { storage } from '../../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from '../../../firebase';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ProfileHeaderInfos() {

  //this check for the user and show his infos
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [t] = useTranslation();

  const handelCameraClick = () => {
    const user = auth.currentUser;
    //here goes code to upload image
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.addEventListener("change", async () => {
      const file = input.files[0];
      if (file) {
        setImage(file);
        const imageRef = ref(storage, 'users/' + user.uid);
        const metadata = { contentType: file.type };
        uploadBytes(imageRef, image, metadata).then((snapshot) => {
          console.log('Uploaded a blob or file!');
        });
        const imageLink = await getDownloadURL(imageRef);
        //remove old photo
        try {
          const db = getDatabase();
          const userDataRef = dbRef(db, `users/${user.uid}`);
          update(userDataRef, {
            imageUrl: imageLink
          })
        } catch (error) {
          console.log(error);
        }
      }
    });
    input.click();
  }
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, fetch user data
        const db = getDatabase();
        const userDataRef = dbRef(db, `users/${user.uid}`);
        onValue(userDataRef, (snapshot) => {
          const data = snapshot.val();
          setUser(data);
          console.log(data);
        });

      } else {
        // User is signed out
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);
  return (
    <div className='shadow-md'>
      <div className="w-full h-[300px] bg-gradient-to-r from-mypalette-1 to-mypalette-2 rounded-t-lg">
        <div className="relative">
          <div className="absolute -bottom-96 lg:left-16 left-20">
            {
              user ? (
                <>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <div onClick={handelCameraClick} className="bg-slate-200 rounded-full p-3 cursor-pointer hover:bg-slate-300 transition-all delay-100 ease-in-out border-8 border-white">
                        <Camera />
                      </div>
                    }
                  >
                    {
                      user.imageUrl != "-" ? (
                        <Avatar
                          src={user.imageUrl}
                          sx={{
                            width: '200px',
                            height: '200px',
                            fontSize: '50px',
                            border: 'solid 7px white'
                          }}
                        />
                      ) : (
                        <Avatar
                          sx={{
                            width: '200px',
                            height: '200px',
                            fontSize: '50px',
                            border: 'solid 7px white'
                          }}>{user.fullname.charAt(0).toUpperCase()}</Avatar>
                      )
                    }
                  </Badge>

                </>
              ) :
                (
                  <></>
                )
            }

          </div>
        </div>
      </div>
      {/* name and status */}
      <div>
        <div className="flex flex-col gap-2 pt-20 bg-white py-4 px-14 rounded-b-lg">
          {
            user ? (
              <div id="name">
                <h1 className="text-3xl font-bold text-center md:text-start">
                  {user.fullname}
                </h1>
                <h1 className="text-xl text-slate-400 text-center md:text-start">
                  {user.fieldStudy}
                </h1>
              </div>
            ) : (
              <>Loading ...</>
            )
          }
          <div className="my-5 w-fit">
            <div className="flex gap-3 overflow-x-auto">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  sx={{
                    fontWeight: '700'
                  }}>
                  <Link to="/profile">
                    {t('borrows')}
                  </Link>
                </Button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  sx={{
                    fontWeight: '700'
                  }}>
                  <Link to="/profile/history">
                    {t('history')}
                  </Link>
                </Button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  sx={{
                    fontWeight: '700'
                  }}>
                  <Link to="/profile/playlists">
                    PlayLists
                  </Link>
                </Button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  sx={{
                    fontWeight: '700',
                    width: 'fit'
                  }}>
                  <Link to="/profile/likedbooks">
                    {t('liked_book')}
                  </Link>
                </Button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  sx={{
                    fontWeight: '700'
                  }}>
                  <Link to="/profile/settings">
                    {t('settings')}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
