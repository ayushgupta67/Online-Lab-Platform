import mongoose from 'mongoose';

const ClassroomSchema = new mongoose.Schema({
  classroomName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  assignments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    default: []
  }],
  classroomCode: {
    type: String,
    unique: true,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for getting number of students
ClassroomSchema.virtual('studentCount').get(function() {
  return this.enrolledStudents.length;
});

// Virtual for getting number of assignments
ClassroomSchema.virtual('assignmentCount').get(function() {
  return this.assignments.length;
});

// Virtual for getting assignments with stats
ClassroomSchema.virtual('assignmentsWithStats').get(async function() {
  await this.populate('assignments');
  return this.assignments;
});

// Add indexes for better query performance
//ClassroomSchema.index({ code: 1 });
ClassroomSchema.index({ instructor: 1 });

const Classroom = mongoose.model('Classroom', ClassroomSchema);
export default Classroom;
