
import { getDatabase, ref, push} from "firebase/database";

export const createBook = async (book) => {
  try {
    const database = getDatabase();
    const bookRef = ref(database, "books/");
    await push(bookRef, book);
    history.push("/showbooks");
    return bookRef.id;
  } catch (error) {
    console.error("Error creating book: ", error);
    //throw new Error("Could not create book");
  }
};
