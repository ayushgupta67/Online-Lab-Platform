import express from 'express';
import { getClassroomsForSidebar, getAssignmentForHomepage } from '../controllers/dashboard.controller.js';
import {protectRoute} from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/getClassrooms', protectRoute, getClassroomsForSidebar);
router.get('/getAssignments', protectRoute, getAssignmentForHomepage);

export default router;