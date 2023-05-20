import { getDatabase, ref, push} from "firebase/database";

export const createBook = async (book) => {
  try {
    const database = getDatabase();
    const bookRef = ref(database, "books/");
    const newBookRef = await push(bookRef, book);
    const bookID = newBookRef.key;
    return bookID;
  } catch (error) {
    console.error("Error creating book: ", error);
    //throw new Error("Could not create book");
  }
};
