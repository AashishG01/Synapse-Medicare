import express from 'express';
import { registerUser, registerHospital, registerDoctor, login } from '../controllers/auth.controller.js'; // <-- Note the .js

const router = express.Router();

router.post('/register/user', registerUser);
router.post('/register/hospital', registerHospital);
router.post('/register/doctor', registerDoctor);
router.post('/login', login);

export default router;