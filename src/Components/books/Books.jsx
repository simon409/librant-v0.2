import React, { useState, useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import {
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import BookCard from "./Components/bookCard";
import DocCard from "./Components/docCard";
import {
  getDatabase,
  ref,
  onValue
} from "firebase/database";
import {
  auth
} from "../../firebase";
import {
  TransitionGroup,
  CSSTransition
} from "react-transition-group";
import {
  LinearProgress,
  Pagination
} from "@mui/material";
import "./style/style.css";
import { createCanvas } from "canvas";

export default function Books() {
  const [searchbook, setsearchbook] = useState("");
  const [loading, setloading] = useState(true);
  const [Type, setType] = useState("books");
  const [Books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const booksPerPage = 20;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const db = getDatabase();
        const bookRef = ref(db, Type);
        onValue(bookRef, (snapshot) => {
          const data = snapshot.val();
          const bookArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setBooks(bookArray);
          setloading(false);
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchBooks();
  }, [Type]);

  function textToImage(title) {
    const canvas = createCanvas(400, 200);
    const ctx = canvas.getContext("2d");

    // Fill the canvas with white
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set the font and color for the title text
    ctx.font = "bold 36px Arial";
    ctx.fillStyle = "black";

    // Calculate the position of the text based on its size and the canvas size
    const titleWidth = ctx.measureText(title).width;
    const x = (canvas.width - titleWidth) / 2;
    const y = canvas.height / 2;

    // Draw the title text onto the canvas
    ctx.fillText(title, x, y);

    // Convert the canvas to a data URL and return it as a React component
    const dataURL = canvas.toDataURL();
    return dataURL;
  }

  const handleSearch = (event) => {
    setsearchbook(event.target.value);
    setPage(1);
  };

  const filteredBooks = searchbook ? Type==="books" ? Books.filter((book) => book.title.toLowerCase().includes(searchbook.toLowerCase())) : Books.filter((book) => book.name.toLowerCase().includes(searchbook.toLowerCase())) : Books;

  const indexOfLastBook = page * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  return (
  <div>
    <NavBar />
      <div className="mt-20 mx-5">
        {/*Image ads*/}
        <div className="bg-blue-500 w-full h-96 rounded-lg">
          <img src="https://images.unsplash.com/photo-1596123068611-c89d922a0f0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1438&q=80" className='object-cover h-full w-full rounded-lg bg-no-repeat bg-bottom brightness-75 relative' alt="imagetest" />
          <div id="search" className='absolute w-full top-1/3 left-1/2 z-20 text-white -translate-y-1/2 -translate-x-1/2 text-4xl text-center'>
            <h1>Find Your <b><u>{Type === "books" ? ('Book') : ('Document')}</u></b></h1>
            <div className="flex justify-center gap-2">
              <FormControl sx={{background: '#fff', borderRadius: '5px', width: '300px', marginTop:'20px'}}>
              <TextField
              fullWidth 
              type="text"
              variant='outlined'
              placeholder='Type to search for the book'
              onChange={e=>handleSearch(e)}
              />
            </FormControl>
            <FormControl  sx={{background: '#fff', borderRadius: '5px', width: '150px', marginTop:'20px'}}>
              <Select
                  labelId="category-label"
                  id="category"
                  variant="standard"
                  fullWidth
                  sx={{
                    height: '100%'
                  }}
                  onChange={e => setType(e.target.value)}
                  value={Type}
                  margin="normal"
                  label="Category"
              >
                  <MenuItem value="books">Books</MenuItem>
                  <MenuItem value="docs">Documents</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
      {
        Type === "Book" ? (
          <h1 className='text-center text-4xl mt-5 mb-5'>{searchbook != "" ? "Here some similar book relative to you search" : "Here are our books"}</h1>
        ) : (
          <h1 className='text-center text-4xl mt-5 mb-5'>{searchbook != "" ? "Here some similar documents relative to you search" : "Here are our documents"}</h1>
        )
      }
      {/* book listing */}
      <ul className='mb-6'>
        {loading ? (
          <LinearProgress sx={{
            color: '#1877B6',
            backgroundColor: '#00b4d8'
          }}/> 
        ) : filteredBooks.length > 0 ? (
          <>
            <TransitionGroup className="book-list grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-1 gap-4">
              {currentBooks.map((book) => (
                <CSSTransition key={book.id} timeout={500} classNames="book">
                  <li className='list-none mx-auto book-item relative transition-transform delay-150 ease-linear w-full'>
                    {
                      Type === "books" ? (
                        <BookCard 
                          id={book.id}
                          title={book.title} 
                          author={book.author} 
                          description={book.description} 
                          image={book.image}
                          key={book.id}
                        />
                  
                      ) : (
                        <DocCard 
                          id={book.id}
                          name={book.name}
                          description={book.description}
                          image={textToImage(book.name)}
                          key={book.id}
                        />
                      )
                    }
                  </li>
                </CSSTransition>
              ))}
            </TransitionGroup>
            <div className="flex justify-center mt-16 mb-5">
              <Pagination
                count={Math.ceil(filteredBooks.length / booksPerPage)}
                page={page}
                onChange={(event, value) => setPage(value)}
              />
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">No books found.</p>
        )}
      </ul>
    </div>
  </div>
);
}
