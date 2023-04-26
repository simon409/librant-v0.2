import { getDatabase, ref, update } from "firebase/database";

export const updateBook = async (bookId, updates) => {
  try {
    const database = getDatabase();
    const bookRef = ref(database, `books/${bookId}`);
    await update(bookRef, updates);
    history.push("/showbooks");
  } catch (error) {
    console.error("Error updating book: ", error);
    //throw new Error("Could not update book");
  }
};
