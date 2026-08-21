import express from 'express';
import {register, login, logout, checkAuth} from '../controllers/auth.controller.js';
import {protectRoute} from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// if user is authenticated they can call the below get function and checkAuth will run after protectRoute 
// checks the if the user is authentic
router.get('/check', protectRoute, checkAuth);

export default router;