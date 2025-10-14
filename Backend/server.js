import express from 'express';
import cors from 'cors';
import database_connection from './DataBase/db.js';
import userRouter from './Routes/user.js';
import movieRouter from './Routes/movie.js';


const app = express();
const port = process.env.PORT || 8004;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import path from 'path';
import dashboardRouter from './Routes/dashboard.js';
import otprouter from './Routes/otp.js';
import emailRouter from './Routes/email.js';
import blockRouter from './Routes/block.js';

// Serve the uploads folder inside movies
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads/movies')));




// Mount main router
app.use('/api', userRouter);
app.use('/movie',movieRouter);
app.use('/dashboard',dashboardRouter);

//otp routes
app.use('/otp',otprouter)
app.use('/booking',emailRouter)
app.use('/seats',blockRouter)

// Root test
app.get("/", (req, res) => res.send("Backend server running"));

// Connect DB
database_connection();

// Start server
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});

