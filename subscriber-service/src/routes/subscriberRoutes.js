import express from 'express';
import { authenticateUser } from '../middlewares/authenticateUser';
import { createSubscriber, deleteSubscriber, downloadSubscribersCsv, getSubscriberById, getSubscribers, uploadCsvSubscribers } from '../controllers/subscriberController';
import { upload } from "../middlewares/upload.js";
const router = express.Router();

router.get('/subscribers', authenticateUser , getSubscribers );
router.post('/subscribers', authenticateUser, createSubscriber);
router.get('/subscribers/:id', authenticateUser, getSubscriberById);
router.delete('/subscribers/:id', authenticateUser, deleteSubscriber);
router.post("/subscribers/upload-csv",authenticateUser, upload.single("file"), uploadCsvSubscribers);
router.get("/subscribers/download-csv", authenticateUser, downloadSubscribersCsv);
export default router;