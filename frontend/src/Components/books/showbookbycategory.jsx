import React, {useState, useEffect} from "react";
import { emphasize, styled, useTheme } from '@mui/material/styles';
import { getDatabase, onValue, ref } from "firebase/database";
import { useParams, useHistory } from "react-router-dom/cjs/react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import NavBar from "../NavBar/NavBar";
import {
    TransitionGroup,
    CSSTransition
  } from "react-transition-group";
  import {
    LinearProgress,
    Pagination,
    FormControl,
    TextField,
    InputLabel,
    Select,
    MenuItem,
    Breadcrumbs,
    Chip,
  } from "@mui/material";
  import { Home, ExpandMore } from "@mui/icons-material";
  import BookCard from "./Components/bookCard";
import { useTranslation } from "react-i18next";

  const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
      theme.palette.mode === 'light'
        ? theme.palette.grey[100]
        : theme.palette.grey[800];
    return {
      backgroundColor,
      height: theme.spacing(3),
      color: theme.palette.text.primary,
      fontWeight: theme.typography.fontWeightRegular,
      '&:hover, &:focus': {
        backgroundColor: emphasize(backgroundColor, 0.06),
      },
      '&:active': {
        boxShadow: theme.shadows[1],
        backgroundColor: emphasize(backgroundColor, 0.12),
      },
    };
  });
  
  function handleClick(num) {
    switch(num){
      case 0:
        history.push("/");
        break;
      case 1:
        history.push("/books");
        break;
      case 2:
        break;
    }
  }

export default function ShowBookByCategory(){
    const {category} = useParams();
    const decodedCat = decodeURIComponent(category);
    const history = useHistory();
    const [t] = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.up('sm'));

    //declare useState book - searchword
    const [books, setBooks] = useState([]);
    const [searchbook, setsearchbook] = useState("");
    const [loading, setloading] = useState(true);
    const [page, setPage] = useState(1);
    const booksPerPage = 20;

    //use effect to retrieve data
    useEffect(() => {
        const fetchBooks = async () => {
          try {
            const db = getDatabase();
            const bookRef = ref(db, "books");
            onValue(bookRef, (snapshot) => {
                const data = snapshot.val();
                //const bookArray
                const bookArray = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }));
                //get only data with categories contains decodedCat
                //alldata.categories -> book <- decodedCat
                const filteredBooks = bookArray.filter(book => book.categories.includes(decodedCat));
                setBooks(filteredBooks);
                setloading(false);
                console.log(books)
            });
          } catch (error) {
            console.error(error);
          }
        };
        fetchBooks();
      }, [decodedCat]);

      const handleSearch = (event) => {
        setsearchbook(event.target.value);
        setPage(1);
      };
    
    const filteredBooksByCat = searchbook ? books.filter((book) => book.title.toLowerCase().includes(searchbook.toLowerCase())) : books;
    const indexOfLastBook = page * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = filteredBooksByCat.slice(indexOfFirstBook, indexOfLastBook);
    

    //return
    return(
        <div>
            <NavBar />
            <div className="mt-20 mx-5">
                  <div role="presentation" onClick={handleClick} className="absolute top-28 left-8 lg:left-14 z-20 -translate-y-1/2">
                    <Breadcrumbs aria-label="breadcrumb">
                      <StyledBreadcrumb
                        component="a"
                        href="/"
                        onClick={()=>handleClick(0)}
                        label={t('home')}
                        icon={<Home fontSize="small" />}
                      />
                      <StyledBreadcrumb component="a" href="/books" onClick={()=>handleClick(1)} label={t('book')} />
                      <StyledBreadcrumb
                        label={!isMobile ? decodedCat.substring(0, Math.min(decodedCat.indexOf('\n') !== -1 ? decodedCat.indexOf('\n') : 12, 12)) : decodedCat}
                        deleteIcon={<ExpandMore />}
                        onClick={()=>handleClick(2)}
                      />
                    </Breadcrumbs>
                  </div>
                {/*Image ads*/}
                <div className="bg-blue-500 w-full h-96 rounded-lg">
                  <img src="https://images.unsplash.com/photo-1522407183863-c0bf2256188c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" className='object-cover h-full w-full rounded-lg bg-no-repeat bg-bottom brightness-75 relative' alt="imagetest" />
                  <div id="search" className='absolute w-full top-[45%] lg:top-1/3 left-1/2 z-20 text-white -translate-y-1/2 -translate-x-1/2 text-4xl text-center'>
                      <h1 className="text-lg px-5 lg:text-2xl lg:px-0">{t('books_like')} <br /> <b><u>{decodedCat}</u></b></h1>
                      <div className="flex justify-center gap-2">
                      <FormControl sx={{background: '#fff', borderRadius: '5px', width: '300px', marginTop:'20px'}}>
                      <TextField
                        fullWidth 
                        type="text"
                        variant='outlined'
                        placeholder={t('type_to_search')}
                        onChange={e=>handleSearch(e)}
                      />
                      </FormControl>
                  </div>
                </div>
            </div>
            
            <h1 className="text-center text-lg lg:text-3xl mt-5">{t('here_are_books_related')} <br /> <b> {decodedCat} </b></h1>
            {/* book listing */}
            <ul className='mb-6'>
                {loading ? (
                <LinearProgress sx={{
                    color: '#1877B6',
                    backgroundColor: '#00b4d8'
                }}/> 
                ) : books.length > 0 ? (
                <>
                    <TransitionGroup className="book-list grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-1 gap-4">
                    {currentBooks.map((book) => (
                        <CSSTransition key={book.id} timeout={500} classNames="book">
                        <li className='list-none mx-auto book-item relative transition-transform delay-150 ease-linear w-full'>
                            <BookCard 
                            id={book.id}
                            title={book.title} 
                            author={book.author} 
                            description={book.description} 
                            image={book.image}
                            key={book.id}
                            />
                        </li>
                        </CSSTransition>
                    ))}
                    </TransitionGroup>
                    <div className="flex justify-center mt-16 mb-5">
                    <Pagination
                        count={Math.ceil(filteredBooksByCat.length / booksPerPage)}
                        page={page}
                        onChange={(event, value) => setPage(value)}
                    />
                    </div>
                </>
                ) : (
                <p className="text-center text-gray-500">{t('no_books_f')}</p>
                )}
            </ul>
            </div>
        </div>
    )
}