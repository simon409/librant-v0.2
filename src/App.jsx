import './App.css';
import { Switch, Route, Redirect } from "react-router-dom";

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
import ShowCategory from './Components/Admin/pages/books/ShowCategory';
import AddBooks from './Components/Admin/pages/books/AddBooks';

//doc admin stuff
import ShowDocs from './Components/Admin/pages/ShowDocs';
import AddDocs from './Components/Admin/pages/docs/AddDocs';

//books user stuff
import Books from './Components/books/Books';
import ShowBook from './Components/books/showbook';
import ShowDocsUser from './Components/books/docs/ShowDocs';


function App() {
  return (
    <Switch>
      <Route exact path="/" component={Landing} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/moreinfos" component={MoreInfos} />
      <Route exact path="/forgotpassword" component={ForgotPass} />
      <Route exact path="/dashboard" component={Dashboard} />

      {/*books admin stuff */}
      <Route exact path="/showbooks" component={ShowBooks} />
      <Route exact path="/books/category" component={ShowCategory} />
      <Route exact path="/books/addbook" component={AddBooks} />

      {/*docs admin stuff */}
      <Route exact path="/showdocs" component={ShowDocs} />
      <Route exact path="/docs/category" component={ShowCategory} />
      <Route exact path="/docs/adddoc" component={AddDocs} />

      {/*books user stuff */}
      <Route exact path="/books" component={Books} />
      <Route exact path="/books/:id" component={ShowBook} />
      <Route exact path="/docs/:id" component={ShowDocsUser} />

      {/*404 page */}
      <Route exact path="/404" component={Error} />
      <Redirect from="*" to="/404" />
    </Switch>
  );
}

export default App;
