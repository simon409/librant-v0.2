import './App.css';
import { BrowserRouter as Router ,Switch, Route, Redirect } from "react-router-dom";

//getting pages
import Landing from './Components/Landing/Landing';
import Error from './Components/Error/404';
import Login from './Components/LoginRegister/Login';
import Register from './Components/LoginRegister/Register';
import ForgotPass from './Components/ForgotPass/ForgotPass';
import Dashboard from './Components/Admin/pages/Dashboard';
import MoreInfos from './Components/LoginRegister/MoreInfos/MoreInfos';


//book admin stuff
import ShowBooks from './Components/Admin/pages/ShowBooks';
import AddBooks from './Components/Admin/pages/books/AddBooks';

//doc admin stuff
import ShowDocs from './Components/Admin/pages/ShowDocs';
import AddDocs from './Components/Admin/pages/docs/AddDocs';

//request admin
import Request from './Components/Admin/pages/Request';

//events admin
import Events from './Components/Admin/pages/Events';

//books user stuff
import Books from './Components/books/Books';
import ShowBook from './Components/books/showbook';
import ShowDocsUser from './Components/books/docs/ShowDocs';
import ModifyBook from './Components/Admin/pages/books/ModifyBook';
import ShowBookByCategory from './Components/books/showbookbycategory';

//user stuff
import Profile from './Components/user/Profile';
import History from './Components/user/History';
import Playlists from './Components/user/Playlists';
import LikedBooks from './Components/user/LikedBooks';
import Settings from './Components/user/Settings';
import cookies from './cookies/Cookies';
import i18n from './i18n';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';


function App() {
  var date = new Date();
  var newDate = new Date(date.setMonth(date.getMonth() + 2));
  const history = useHistory();

  if (cookies.get("lang") === "fr") {
    i18n.changeLanguage("fr");
  } else {
    i18n.changeLanguage("en");
  }

  if(cookies.get("lang")=== undefined){
    cookies.set("lang", "fr", { path: "/", expires: newDate });
  }

  if(cookies.get("reloaded") === undefined){
    history.go(0);
    cookies.set("reloaded", "yes", {path: "/"});
  }
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/moreinfos" component={MoreInfos} />
        <Route exact path="/forgotpassword" component={ForgotPass} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/profile/history" component={History} />
        <Route exact path="/profile/playlists" component={Playlists} />
        <Route exact path="/profile/likedbooks" component={LikedBooks} />
        <Route exact path="/profile/settings" component={Settings} />

        {/*books admin stuff */}
        <Route exact path="/showbooks" component={ShowBooks} />
        <Route exact path="/books/modify/:id" component={ModifyBook} />
        <Route exact path="/books/addbook" component={AddBooks} />

        {/*docs admin stuff */}
        <Route exact path="/showdocs" component={ShowDocs} />
        <Route exact path="/docs/adddoc" component={AddDocs} />

        {/*request admin page */}
        <Route exact path="/requests" component={Request} />

        {/*events admin */}
        <Route exact path="/events" component={Events} />


        {/*books user stuff */}
        <Route exact path="/books" component={Books} />
        <Route exact path="/books/:id" component={ShowBook} />
        <Route exact path="/docs/:id" component={ShowDocsUser} />
        <Route exact path="/genres/:category" component={ShowBookByCategory} />

        {/*404 page */}
        <Route exact path="/404" component={Error} />
        <Redirect from="*" to="/404" />
        
      </Switch>
    </Router>
  );
}

export default App;
