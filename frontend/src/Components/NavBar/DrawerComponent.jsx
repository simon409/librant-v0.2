import React, { useState } from "react";
import {
  Divider,
  SwipeableDrawer ,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Collapse
} from "@mui/material";
import { useEffect } from "react";
import Avatar from '@mui/material/Avatar';
import 'regenerator-runtime/runtime';
import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import { useHistory } from 'react-router-dom';
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth, signOut } from "firebase/auth";
import MenuIcon from '@mui/icons-material/Menu';
import librant from "../../assets/img/logo.png";
//icons
import HomeIcon from '@mui/icons-material/Home';
import BookIcon from '@mui/icons-material/Book';
import CategoryIcon from '@mui/icons-material/Category';
import LanguageIcon from '@mui/icons-material/Language';
import SupportIcon from '@mui/icons-material/Support';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useTranslation } from "react-i18next";


function DrawerComponent(props) {
  const {setsearch} = props;
  const [openDrawer, setOpenDrawer] = useState(false);
  const [categoryOpen, setcategoryOpen] = useState(false);
  const [languageOpen, setlanguageOpen] = useState(false);
  const [categories, setcategories] = useState([]);
  //this check for the user and show his infos
  const [user, setUser] = useState(null);
  const [t] = useTranslation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // User is signed in, fetch user data
        const db = getDatabase();
        const userDataRef = ref(db, `users/${user.uid}`);
        onValue(userDataRef, (snapshot) => {
          const data = snapshot.val();
          setUser(data);
        });

      } else {
        // User is signed out
        setUser(null);
      }
    });

    // Unsubscribe from the listener when the component is unmounted
    return unsubscribe;
  }, []);

  useEffect(() => {
    const bookRef = ref(getDatabase(), 'books');
    const unsubscribe = onValue(bookRef, (snapshot) => {
      const data = snapshot.val();
      const bookArray = Object.keys(data).map((key) => ({
        id: key,
        ...data[key]
      }));
      const uniqueCategories = [...new Set(bookArray.flatMap(book => book.categories))];
      setcategories(uniqueCategories);
    });
    return unsubscribe;
  }, []);

  //sign the user out of the application
  const history = useHistory();

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Redirect the user to the login page after successful sign-out
        history.push('/login');
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  //random color
  const randomColor = () => {
    const colors = ['#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  const closeDraweAndSignOut = () => {
    setOpenDrawer(false);
    handleSignOut();
  }

  const redirect = ({page}) => {
    history.push(`/${page}`);
  }
  return (
    <div>
      <SwipeableDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        sx={{
          width: '80%'
        }}
      >
        <List sx={{
          width: '270px',
          padding: '0'
        }}>{user ? (
          <><div className="flex h-32">
            <ListItem onClick={() => setOpenDrawer(false)} >
              <ListItemText>
                <Link to="/"><Avatar sx={{ width: 50, height: 50, backgroundColor: randomColor() }}>{user.fullname.charAt(0).toUpperCase()}</Avatar> <p className="mt-3 my-auto font-bold">{user.fullname}</p></Link>
                <p>{user.email}</p>
              </ListItemText>
            </ListItem>
          </div>
          <div className="w-full p-1"></div>
          <Divider />
          <div className="w-full p-1"></div>
          </>):(<>
          <div className="flex h-32">
            <ListItem onClick={() => setOpenDrawer(false)} >
              <ListItemText>
                <div className="flex gap-3">
                  <img className="w-16 h-16" src={librant} alt="" /> 
                  <p className="text-2xl my-auto font-bold">Librant</p>
                </div>
              </ListItemText>
            </ListItem>
          </div>
          </>)}
         <ListItem onClick={() => setOpenDrawer(false)} >
            <ListItemText sx={{ display: 'flex', gap: '20px'}}>
              <HomeIcon sx={{marginInline: 'auto'}}/>
              {" "}
              <Link to="/" className="font-semibold">{t('home')}</Link>
            </ListItemText>
          </ListItem>
          <ListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText sx={{ display: 'flex', gap: '20px'}}>
              <BookIcon sx={{marginInline: 'auto'}}/>
              {" "}
              <Link to="/books" className="font-semibold">{t('books')}</Link>
            </ListItemText>
          </ListItem>
          <ListItem onClick={() => setcategoryOpen(!categoryOpen)}>
            <ListItemText sx={{ display: 'flex', gap: '20px' }}>
              <CategoryIcon sx={{ marginInline: 'auto' }} />
              <Link to="/" className="font-semibold">{t('category')}</Link>
            </ListItemText>
          </ListItem>
          <Collapse in={categoryOpen} timeout="auto" unmountOnExit>
            {/* Place your category list component here */}
            {/* Example: <CategoryList /> */}
            <div className="px-5 flex flex-col gap-3">
              {
                categories ? categories.length>0 ? (
                  categories.map(cat=>(
                    <button>
                      <li className="bg-slate-100 h-14 flex rounded-lg">
                        <p className="my-auto mx-auto text-center">{cat}</p>
                      </li>
                    </button>
                  ))
                ) : (<>No category yet</>) : (<>error</>)
              }
            </div>
          </Collapse>
          <ListItem onClick={() => setlanguageOpen(!languageOpen)}>
            <ListItemText sx={{ display: 'flex', gap: '20px'}}>
              <LanguageIcon sx={{marginInline: 'auto'}}/>
              {" "}
              <Link to="/" className="font-semibold">{t('lang')}</Link>
            </ListItemText>
          </ListItem>
          <Collapse in={languageOpen} timeout="auto" unmountOnExit>
            {/* Place your category list component here */}
            {/* Example: <CategoryList /> */}
            <div className="px-5 flex flex-col gap-3">
              <button>
                <li className="bg-slate-100 h-14 flex rounded-lg">
                  <p className="my-auto mx-auto text-center">Français</p>
                </li>
              </button>
                <li className="bg-slate-100 h-14 flex rounded-lg">
                  <p className="my-auto mx-auto text-center">English</p>
                </li>
            </div>
          </Collapse>
          <ListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText sx={{ display: 'flex', gap: '20px'}}>
              <SupportIcon sx={{marginInline: 'auto'}}/>
              {" "}
              <Link to="/" className="font-semibold">{t('support')}</Link>
            </ListItemText>
          </ListItem>
          <ListItem onClick={() => setsearch(true)}>
            <ListItemText sx={{ display: 'flex', gap: '20px'}}>
              <SearchIcon sx={{marginInline: 'auto'}}/>
              {" "}
              <Link to="/" className="font-semibold">{t('search')}</Link>
            </ListItemText>
          </ListItem>
          <div className="w-full p-1"></div>
            <Divider />
          <div className="w-full p-1"></div>
          <ListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText sx={{ display: 'flex', gap: '20px'}}>
              <SettingsIcon sx={{marginInline: 'auto'}}/>
              {" "}
              <Link to="/" className="font-semibold">{t('settings')}</Link>
            </ListItemText>
          </ListItem>
          {!user ? (<>
          
          <ListItem onClick={() => redirect({page: 'login'}) }>
            <ListItemText sx={{ display: 'flex', gap: '20px'}}>
              <LoginIcon sx={{marginInline: 'auto'}}/>
              {" "}
              <Link to="/" className="font-semibold">{t('login')}</Link>
            </ListItemText>
          </ListItem>
          <ListItem onClick={() => redirect({page: 'register'}) }>
            <ListItemText sx={{ display: 'flex', gap: '20px'}}>
              <PersonAddIcon sx={{marginInline: 'auto'}}/>
              {" "}
              <Link to="/" className="font-semibold">{t('register')}</Link>
            </ListItemText>
          </ListItem>

          </>) : (
            <ListItem onClick={() => closeDraweAndSignOut() }>
              <ListItemText sx={{ display: 'flex', gap: '20px'}}>
                <LogoutIcon sx={{marginInline: 'auto'}}/>
                {" "}
                <Link to="/" className="font-semibold">{t('logout')}</Link>
              </ListItemText>
          </ListItem>
          )}
        </List>
      </SwipeableDrawer>
      <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
        <MenuIcon />
      </IconButton>
    </div>
  );
}
export default DrawerComponent;