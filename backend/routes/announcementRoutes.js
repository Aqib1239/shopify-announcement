import express from 'express';
import { createAnnouncement, getAnnouncement, getLatestAnnouncement } from '../controllers/announcementController.js';


const router = express.Router();

router.post("/", createAnnouncement);
router.get("/", getAnnouncement);
router.get("/latest", getLatestAnnouncement);

export default router;
