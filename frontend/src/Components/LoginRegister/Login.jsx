import React, {useState} from "react";
import "./style.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import TextField from '@mui/material/TextField';
import LOGO from "../../assets/img/logo.png";
import googleLOGO from "../../assets/svg/google.svg";
import { Link } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import { auth, provider } from "../../firebase";
import { signInWithPopup, deleteUser } from "firebase/auth";
import { useHistory } from 'react-router-dom';
import { getDatabase, ref, set, onValue} from "firebase/database";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useTranslation } from "react-i18next";

export default function Login() {
    document.title = "Login to your Librant account"
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();
    const [Error, setError] = useState("");
    const [t] = useTranslation();

    const LoginWithGoogle = () =>{
        signInWithPopup(auth, provider).then( async (data) =>{
            const user = data.user;
            const domain = 'etud.iga.ac.ma'; // Replace with your desired domain
            const emailRegex = new RegExp(`^[a-zA-Z0-9_.+-]+@${domain}$`);
            //verify users email
            if (!emailRegex.test(user.email)) {
                setError(t('only_iga_email_allowed'));
                deleteUser(user.uid)
                return;
            }
            // Save user data to the Firebase Realtime Database
            const database = getDatabase();
            const userRef = ref(database, "users/" + user.uid);
            await set(userRef, {
                fullname: user.displayName,
                email: user.email,
                role: "simple",
                country: "-",
                city: "-",
                fieldStudy: "-",
                gender: "-",
                birthdate: "-",
                phone: "-",
                address: "-",
                address2: "-",
                interests: "-"
            });
            // Redirect the user to the home page after successful registration
            history.push('/');
        })
    }

    const handleSubmit = (e) => {
        try {
            signInWithEmailAndPassword(auth, email, password).then((userCredentials) => {
                const user = userCredentials.user;
                // Redirect the user to the home page after successful registration
                if (user) {
                    // User is signed in, fetch user data
                    const db = getDatabase();
                    const userDataRef = ref(db, `users/${user.uid}`);
                    onValue(userDataRef, (snapshot) => {
                      const data = snapshot.val();
                        if(data.role === "admin")
                        {
                            history.push('/dashboard');
                        }
                        else{
                            history.push('/');
                        }
                    });
            
                  }
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
                if(errorMessage === "Firebase: Error (auth/wrong-password)."){
                    setError(t('invalid_credentials'));
                }
                else{
                    setError(t('account_disabled'))
                }
                console.error(errorCode, errorMessage);
            });
        } catch (error) {
          console.log(error);
        }
      };

    return(
        <div className="body">
            
            <div className="relative md:w-1/2 lg:w-1/4 h-screen md:h-fit bg-white p-10 md:rounded-lg -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <form action="">
                    <div className="h-36 w-36 relative -translate-x-1/2 -translate-y-1/2 top-16 left-1/2">
                        <Link to="/">
                            <img src={LOGO} alt="" />
                        </Link>
                    </div>
                    <h1 className="text-bold text-3xl text-center mb-5 text-mypalette-2">{t('welcome_back')}</h1>
                    <div className="flex flex-col gap-2">
                        <TextField 
                        fullWidth 
                        type="email"
                        label={t('email_address')}
                        onChange={(event) => setEmail(event.target.value)}
                        value={email}
                        autoComplete="email"/>

                    </div>
                    <div className="mt-4 flex flex-col gap-2">
                        <TextField 
                        fullWidth 
                        type="password"
                        label={t('password')} 
                        onChange={(event) => setPassword(event.target.value)}
                        value={password}
                        autoComplete="password"/>
                    </div>
                    <div className="mt-5">
                        <span className=" text-right block"><a href="/forgotpassword" className="text-mypalette-2 font-bold">{t('forgot_password')}</a></span>
                    </div>
                    {
                        Error ? (
                            <Alert variant="outlined" severity="error" sx={{marginTop: '10px'}}>
                                <AlertTitle><strong>Error</strong></AlertTitle>
                                {Error} <strong>{Error === t('invalid_credentials') ? t('verify_your_infos'):""}</strong>
                            </Alert>
                        ) : (<></>)
                    }
                    <Button className="mt-6 p-4 text-white bg-mypalette-2" fullWidth onClick={()=>handleSubmit()} variant="filled">
                        {t('login')}
                    </Button>
                    <div className="mt-5">
                        <span className=" text-center block">{t('new_here')} <a href="/register" className="text-mypalette-2 font-bold">{t('register')}</a></span>
                    </div>
                    <hr className="mt-2 mb-2"/>
                    <div className="flex flex-col items-center gap-4">
                        <span className="text-bold text-mypalette-2">{t('or_continue_with_google')}</span>
                        <Button
                            size="lg"
                            variant="outlined"
                            onClick={LoginWithGoogle}
                            color="blue-gray"
                            className="flex items-center gap-3 p-4"
                        >
                            <img src={googleLOGO} alt="metamask" className="h-6 w-6" />
                            {t('continue_with_google')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}