import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom/cjs/react-router-dom";
import ReactGA from 'react-ga';
import { reportWebVitals } from './reportWebVitals';
import { QueryClient, QueryClientProvider } from "react-query";
import algoliasearch from "algoliasearch";
import { getDatabase, ref, onValue } from "firebase/database";

const client = algoliasearch("Q952IEQ11T", "053e198550c71739825b3387cfe7352c");
//create new index 
const algoliaIndex = client.initIndex('book_recommandation');
const db = getDatabase();
const bookRef = ref(db, "books");
onValue(bookRef, (snapshot) => {
  const data = snapshot.val();
  const transformedBooks = Object.keys(data).map((bookId) => {
    const book = data[bookId];
    return {
      objectID: bookId,
      title: book.title,
      author: book.author,
      description: book.description,
      image: book.image,
      category: book.category
      // Add any other relevant attributes here
    };
  });
  // `transformedBooks` is now an array of objects that can be indexed by Algolia
  algoliaIndex.saveObjects(transformedBooks, (err, content) => {
    if (err) {
      console.error(err);
      return;
    }
  
    console.log(content);
  });
  
});

ReactGA.initialize("G-SD3H0519Q9");

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);

const SendAnalytics = ()=> {
  ReactGA.send({
    hitType: "pageview",
    page: window.location.pathname,
  });
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(SendAnalytics);