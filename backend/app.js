import express from 'express';
import cors from 'cors';
import announcementRoutes from './routes/announcementRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend is Running 🚀",
  });
});

app.use('/api/announcement', announcementRoutes);

export default app;
