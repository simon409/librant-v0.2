
import { getDatabase, ref, push} from "firebase/database";

export const createDoc = async (doc) => {
  try {
    const database = getDatabase();
    const docRef = ref(database, "docs/");
    await push(docRef, doc);
    history.push("/showdocs");
    return docRef.id;
  } catch (error) {
    console.error("Error creating doc: ", error);
    //throw new Error("Could not create book");
  }
};
