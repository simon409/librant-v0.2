import React, {useState} from "react";
import "./style.css";
import TextField from '@mui/material/TextField';
import { createUserWithEmailAndPassword } from "firebase/auth";
import LOGO from "../../assets/img/logo.png";
import { Link } from "react-router-dom";
import googleLOGO from "../../assets/svg/google.svg"
import { Button } from "@material-tailwind/react";
import { auth } from "../../firebase";
import { getDatabase, ref, set} from "firebase/database";
import { useHistory } from 'react-router-dom';
import { Alert, AlertTitle } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Register() {
    document.title = "Create your Librant account"
    const [fullname, setfullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConf, setPasswordConf] = useState("");
    const history = useHistory();
    const [Error, setError] = useState("");
    const [t] = useTranslation();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const domain = 'etud.iga.ac.ma'; // Replace with your desired domain
        const emailRegex = new RegExp(`^[a-zA-Z0-9_.+-]+@${domain}$`);

        if (!emailRegex.test(email)) {
            setError(t('only_iga_email_allowed'));
            return;
        }
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save user data to the Firebase Realtime Database
            const database = getDatabase();
            const userRef = ref(database, "users/" + user.uid);
            await set(userRef, {
            fullname: fullname,
            email: email,
            role: "simple",
            imageUrl: "-",
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
            history.push("/moreinfos");

        } catch (error) {
          console.error(error);
        }
      };
    return(
        <div className="body">
            
            <div className="relative md:w-1/2 lg:w-1/4 h-screen md:h-fit bg-white p-10 md:rounded-lg md:-translate-x-1/2 md:-translate-y-1/2 md:top-1/2 md:left-1/2">
                <form onSubmit={handleSubmit}>
                    <div className="h-36 w-36 relative -translate-x-1/2 -translate-y-1/2 top-16 left-1/2">
                        <Link to="/">
                            <img src={LOGO} alt="" />
                        </Link>
                    </div>
                    <h1 className="text-bold text-3xl text-center mb-5 text-mypalette-2">{t('welcome')}</h1>
                    <div className="flex flex-col gap-2">
                        <TextField 
                        fullWidth 
                        type="text"
                        label={t('full_name')}
                        onChange={(event) => setfullname(event.target.value)}
                        value={fullname}
                        autoComplete="name"/>
                    </div>
                    <div className="mt-4 flex flex-col gap-2">
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
                    <div className="mt-4 flex flex-col gap-2">
                    <TextField 
                        fullWidth 
                        type="password"
                        label={t('confirm_password')} 
                        onChange={(event) => setPasswordConf(event.target.value)}
                        value={passwordConf}
                        autoComplete="password"/>
                    </div>
                    {
                        Error ? (
                            <Alert variant="outlined" severity="error" sx={{marginTop: '10px'}}>
                                <AlertTitle><strong>Error</strong></AlertTitle>
                                {Error} <strong>{Error === " — Identifients invalide" ? "Verify your infos!":""}</strong>
                            </Alert>
                        ) : (<></>)
                    }
                    <Button className="mt-6 p-4 text-white bg-mypalette-2" fullWidth type="submit">{t('register')}</Button>
                    <div className="mt-5">
                        <span className=" text-center block">{t('already_registered')} <a href="/login" className="text-mypalette-2 font-bold">{t('login')}</a></span>
                    </div>
                </form>
            </div>
        </div>
    )
}