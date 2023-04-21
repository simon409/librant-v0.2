
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBTvbnsdVq0IX8ub9eQ0cV5szQ0-hTNpjk",
    authDomain: "librant-iga1.firebaseapp.com",
    projectId: "librant-iga1",
    storageBucket: "librant-iga1.appspot.com",
    messagingSenderId: "386850003601",
    appId: "1:386850003601:web:acc09f959b3004981e3d30",
    measurementId: "G-SD3H0519Q9"
  };
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const storage = getStorage(app);
  const provider = new GoogleAuthProvider();
  //Initializing auth to access to the service
  export {auth, provider, storage};