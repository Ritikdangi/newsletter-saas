import multer from "multer";

const storage = multer.memoryStorage(); // store in RAM
export const upload = multer({ storage });
