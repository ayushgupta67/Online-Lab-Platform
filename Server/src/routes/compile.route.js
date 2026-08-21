import express from 'express';
import { compileCode } from '../controllers/compile.controller.js';

const router = express.Router();

router.post('/', compileCode);


export default router;