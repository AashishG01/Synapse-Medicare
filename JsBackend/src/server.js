import express from 'express';
import cors from 'cors';
import 'dotenv/config'; // Handles .env variables
import connectDB from './config/db.js'; // <-- Note the .js
import authRoutes from './routes/auth.routes.js'; // <-- Note the .js
import doctorRoutes from './routes/doctor.routes.js'
// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes); 

// Simple base route
app.get('/', (req, res) => res.send('API is running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));