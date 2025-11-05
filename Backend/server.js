import express from 'express';
import cors from 'cors';
import database_connection from './DataBase/db.js';
import userRouter from './Routes/user.js';
import movieRouter from './Routes/movie.js';
import dotenv from "dotenv";

const app = express();
const port = process.env.PORT || 8004;
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




import path from 'path';
import dashboardRouter from './Routes/dashboard.js';
import otprouter from './Routes/otp.js';
import emailRouter from './Routes/email.js';
import blockRouter from './Routes/block.js';
import authrouter from './Routes/auth.js';
import collectorRouter from './Routes/collector.js';
import snackrouter from './Routes/snackRoutes.js';
import orderRouter from './Routes/snackOrderRoutes.js';
import { startAutoReminder,manualTriggerAutoReminder } from './middlewares/autoReminder.js';

// Serve the uploads folder inside movies
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads/movies')));
app.use("/uploads", express.static("uploads"));


//for snacks add
app.use('/snacks',snackrouter);
app.use('/orderfood',orderRouter);

// Mount main router
app.use('/api', userRouter);
app.use('/movie',movieRouter);
app.use('/dashboard',dashboardRouter);
app.use('/auth',authrouter)
//otp routes
app.use('/otp',otprouter)
app.use('/booking',emailRouter)
app.use('/seats',blockRouter)

//colletors
app.use('/collectors',collectorRouter)


app.use('/snacksorder', snackrouter);
startAutoReminder();
// Root test
app.get("/", (req, res) => res.send("Backend server running"));

// Connect DB
database_connection();


app.get("/test-reminder", async (req, res) => {
  try {
    await manualTriggerAutoReminder(); // call manually
    res.send("✅ Test reminder job executed successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Test reminder failed");
  }
});


// Start server
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});

