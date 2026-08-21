import express from 'express';
import { createClassroom, createAssignment, addStudents, getAllClassrooms, getClassroomAssignments, getAssignment,submitAssignment,getSubmittedCode } from '../controllers/classroom.controller.js';
import {protectRoute} from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getAllClassrooms);
router.post('/createClassroom', protectRoute, createClassroom);
router.post('/createAssignment', protectRoute, createAssignment);
router.post('/addStudents', protectRoute, addStudents);
router.get('/:classroomId/assignments', protectRoute, getClassroomAssignments);
router.get('/getassignment/:assignmentId', protectRoute, getAssignment);
router.post('/submitAssignment', protectRoute, submitAssignment);
// for getSubmition take assignmentID and userId as input param
router.get('/getSubmittedcode/:assignmentId/:userId', protectRoute, getSubmittedCode); // Assuming you want to fetch submissions for an assignment
export default router;