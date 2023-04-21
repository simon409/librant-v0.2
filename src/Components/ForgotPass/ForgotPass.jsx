import React, {useState} from "react";
//import "./style.css";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import TextField from '@mui/material/TextField';
import LOGO from "../../assets/img/logo.png";
import { Link } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import { auth, provider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import { useHistory } from 'react-router-dom';
import { getDatabase, ref, set} from "firebase/database";

export default function Login() {
    document.title = "Recover your Librant account's password"
    const history = useHistory();

    const [email, setEmail] = useState('')
    const auth = getAuth();

    const triggerResetEmail = async () => {
        await sendPasswordResetEmail(auth, email);
        history.push("/");
    }

    return(
        <div className="body">
            
            <div className="relative md:w-1/2 lg:w-1/4 h-screen md:h-fit bg-white p-10 md:rounded-lg -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <form action="">
                    <div className="h-36 w-36 relative -translate-x-1/2 -translate-y-1/2 top-16 left-1/2">
                        <Link to="/">
                            <img src={LOGO} alt="" />
                        </Link>
                    </div>
                    <h1 className="text-bold text-3xl text-center mb-5 text-mypalette-2">Welcome!</h1>
                    <h1 className="text-semibold text-l text-center mb-5 text-mypalette-3">Write your Librant mail so we can send you the password recovery mail</h1>
                    <div className="flex flex-col gap-2">
                        <TextField 
                        fullWidth 
                        type="email"
                        label="Email Address" 
                        onChange={(event) => setEmail(event.target.value)}
                        value={email}
                        autoComplete="email"/>

                    </div>
                    <Button className="mt-6 p-4 text-white bg-mypalette-2" fullWidth onClick={()=>triggerResetEmail()} variant="filled">
                        Recover
                    </Button>
                </form>
            </div>
        </div>
    )
}