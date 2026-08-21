import User from "../models/Classroom.js" ;
import Assignment from "../models/Assignment.js" ;
import Classroom from "../models/Classroom.js";


export const getClassroomsForSidebar = async (req, res) => {
    try {
        const user = req.user;
        const role = user.role;
        let classroomIds = []; 

        // Determine the classroom ID list based on user role
        if (role === "student") {
            classroomIds = user.enrolledClassrooms;
        } else if (role === "instructor") {
            classroomIds = user.createdClassrooms;
        } else {
            return res.status(400).json({ message: "User role not defined" });
        }

        // Fetch classrooms with only the necessary fields like _id, name
        const classrooms = await Classroom.find({ _id: { $in: classroomIds } }).select("classroomName _id");

        res.status(200).json({ classrooms });
    } catch (error) {
        console.error('Error fetching classrooms for sidebar:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const getAssignmentForHomepage = async (req, res) => {
    try {
        const user = req.user;
        const role = user.role;

        // Get classroom list based on role
        let classroomList = [];
        if (role === 'student') {
            classroomList = user.enrolledClassrooms;
        } else if (role === 'instructor') {
            classroomList = user.createdClassrooms;
        }

        let assignments = {
            active: [],
            missed: [],
            completed: []
        };

        // Get the current date
        const currentDate = new Date(); 

        for (const classroomId of classroomList) {
            const classroom = await Classroom.findById(classroomId).populate('assignments');
            // Skip if classroom not found
            if (!classroom) continue; 

            classroom.assignments.forEach(assignment => {
            const dueDate = new Date(assignment.dueDate);
            if (dueDate > currentDate && assignment.status === 'published') {
                assignments.active.push({
                assignmentName: assignment.assignmentName,
                assignmentId: assignment._id,
                dueDate: assignment.dueDate,
                ...(role === 'instructor' && { totalSubmissions: assignment.submissions.length })
                });
            } else if (dueDate < currentDate && assignment.status === 'published') {
                assignments.missed.push({
                assignmentName: assignment.assignmentName,
                assignmentId: assignment._id,
                dueDate: assignment.dueDate,
                ...(role === 'instructor' && { totalSubmissions: assignment.submissions.length })
                });
            } else if (assignment.status === 'closed') {
                assignments.completed.push({
                assignmentName: assignment.assignmentName,
                assignmentId: assignment._id,
                dueDate: assignment.dueDate,
                ...(role === 'instructor' && { totalSubmissions: assignment.submissions.length })
                });
            }
            });
        }

        // Send filtered assignments to the client
        res.status(200).json(assignments);

    } catch (error) {
        console.error('Error fetching assignments for homepage:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
