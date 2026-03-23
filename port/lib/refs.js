// lib/refs.js
import { db } from "@/lib/firebase";
import { doc, collection } from "firebase/firestore";

export const refs = {
  homeCol: () => collection(db, "home"),
  homeVar: (id) => doc(db, "home", id),  // intro, nom, role
  cvDoc: () => doc(db, "home", "cv"),
};
