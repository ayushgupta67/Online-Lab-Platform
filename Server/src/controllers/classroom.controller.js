import Assignment from "../models/Assignment.js" ;
import Classroom from "../models/Classroom.js" ;
import SubmittedCode from "../models/Submitions.js" ;
import User from "../models/User.js" ;


export const createAssignment = async (req, res) => {
    try {
        console.log("Request body:", req.body); // Debugging log

        const { assignmentName, description, dueDate, classroomId, testCases = {} } = req.body;

        // Ensure required fields are provided
        if (!assignmentName || !dueDate || !classroomId || description === "") {
            return res.status(400).json({ message: "Invalid input data" });
        }

        // Ensure classroom exists
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }

        // Ensure due date is in the future
        if (new Date(dueDate) < new Date()) {
            return res.status(400).json({ message: "Due date must be in the future" });
        }

        // Create the assignment
        const assignment = await Assignment.create({
            assignmentName,
            dueDate,
            classroomId,
            description,
            testCases,
        });

        res.status(201).json({ assignment });

        // Add this assignment to the respective classroom
        await Classroom.findByIdAndUpdate(
            classroomId,
            { $push: { assignments: assignment._id } },
        );

    } catch (error) {
        console.error("Error creating assignment:", error);
        res.status(500).json({ message: error.message });
    }
};



export const createClassroom = async (req, res) => {
    try {
        const { classroomName, instructorId , description, classroomCode} = req.body;

        // Ensure required fields are provided
        if (!classroomName || !instructorId || !description, !classroomCode) {
            return res.status(400).json({ message: "Invalid input data" });
        }

        // trim classroomName and classroomCode
        const trimmedClassroomName = classroomName.trim();
        const trimmedClassroomCode = classroomCode.trim();
        // Ensure instructor exists
        const instructor = await User.findById(instructorId);
        if (!instructor) {
            return res.status(404).json({ message: "Instructor not found" });
        }

        // Ensure classroomCode is unique
        const isCodeSame = await Classroom.findOne({trimmedClassroomCode});
        if(isCodeSame){
            return res.status(400).json({message : " classroomCode is not unique choose something else"})
        }


        // Create the classroom
        const classroom = await Classroom.create({
            classroomName: trimmedClassroomName,
            description,
            instructorId,
            classroomCode:trimmedClassroomCode,
        });

        //console.log("Classroom created:", classroom);
        res.status(201).json({ classroom });

        // Add classroom to instructors createdClassrooms list
        await User.findByIdAndUpdate(
            instructorId,
            {$push : { createdClassrooms : classroom._id}}
        )

    } catch (error) {
        console.error("Error creating classroom:", error);
        res.status(500).json({ message: error.message });
    }
};


export const addStudents = async (req, res) => {
    try {
        //console.log("Adding students to classroom...");
        const { classCode, username } = req.body;

        // Ensure classCode and username are provided
        if (!classCode || !username) {
            return res.status(400).json({ message: "Invalid input data" });
        }

        // Ensure classroom exists
        const classroom = await Classroom.findOne({ classroomCode: classCode });
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }

        // Ensure user exists
        const student = await User.findOne({ username });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Add student to enrolledStudents and avoid duplicates
        await Classroom.findByIdAndUpdate(
            classroom._id,
            { $addToSet: { enrolledStudents: student._id } },
        );

        // Add classroom to student's enrolledClassrooms list
        await User.findByIdAndUpdate(
            student._id,
            { $addToSet: { enrolledClassrooms: classroom._id } },
        );

        res.status(201).json({ message: "Student added successfully", classroom });
    } catch (error) {
        console.error("Error adding students:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getAllClassrooms = async (req, res) => {
    try {
        const classrooms = await Classroom.find()
            .populate('instructorId', 'name email')
            .select('classroomName description classroomCode enrolledStudents');
        res.status(200).json(classrooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getClassroomAssignments = async (req, res) => {
    try {
        const { classroomId } = req.params;
        const classroom = await Classroom.findById(classroomId)
            .populate({
                path: 'assignments',
                select: 'assignmentName description dueDate status',
                options: { sort: { dueDate: 1 } }
            });

        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }

        // Group assignments by status
        const assignments = {
            active: [],
            missed: [],
            completed: []
        };

        const now = new Date();
        classroom.assignments.forEach(assignment => {
            const dueDate = new Date(assignment.dueDate);
            if (dueDate > now && assignment.status === 'published') {
                assignments.active.push(assignment);
            } else if (dueDate < now && assignment.status === 'published') {
                assignments.missed.push(assignment);
            } else if (assignment.status === 'closed') {
                assignments.completed.push(assignment);
            }
        });

        res.status(200).json(assignments);
    } catch (error) {
        console.error("Error fetching classroom assignments:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params; // Get assignmentId from query params

        if (!assignmentId) {
            return res.status(400).json({ message: "Assignment ID is required" });
        }

        const assignment = await Assignment.findById(assignmentId);

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        res.status(200).json(assignment);
    } catch (error) {
        console.error("Error fetching assignment:", error);
        res.status(500).json({ message: error.message });
    }
};

export const submitAssignment = async (req, res) => {
    try {
        const { userId, assignmentId, code ,score} = req.body;

        // Ensure required fields are provided
        if (!userId || !assignmentId) {
            return res.status(400).json({ message: "Invalid input data" });
        }

        // Ensure assignment exists
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        // // Ensure classroom exists
        // const classroom = await Classroom.findById(classroomId);
        // if (!classroom) {
        //     return res.status(404).json({ message: "Classroom not found" });
        // }

        // Save the submitted code (you need to implement this function in your model)
        const submission = await SubmittedCode.saveCode({ userId, assignmentId , code ,score});

        res.status(201).json({ message: "Code submitted successfully", submission });
    } catch (error) {
        console.error("Error submitting assignment:", error);
        res.status(500).json({ message: error.message });
    }
}
export const getSubmittedCode = async (req, res) => {
    const { userId, assignmentId } = req.params;
    try {
        // Ensure required fields are provided
        if (!userId || !assignmentId) {
            return res.status(400).json({ message: "Invalid input data" });
        }

        // Fetch the submitted code from the database
        const submission = await SubmittedCode.findOne({ userId, assignmentId });

        if (!submission) {
            return res.status(404).json({ message: "No submission found for this assignment" });
        }

        res.status(200).json(submission);
    } catch (error) {
        console.error("Error fetching submitted code:", error);
        res.status(500).json({ message: error.message });
    }
}


