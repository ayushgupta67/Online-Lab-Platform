import mongoose from 'mongoose';

const AssignmentSchema = new mongoose.Schema({
  assignmentName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  classroomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom',
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  points: {
    type: Number,
    default: 100
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'closed'],
    default: 'published'
  },
  submissions: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    code: {
      type: String,
      required: true
    },
    language: {
      type: String,
      required: true
    },
    grade: {
      type: Number,
      default: null
    },
    feedback: {
      type: String,
      default: ''
    },
    default : []
  }],
  testCases: [{
    input: String,
    expectedOutput: String,
    points: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for getting submission stats
AssignmentSchema.virtual('submissionStats').get(function() {
  return {
    submissionCount: this.submissions.length,
    averageGrade: this.submissions.reduce((acc, sub) => acc + (sub.grade || 0), 0) / 
                  (this.submissions.filter(sub => sub.grade != null).length || 1)
  };
});

const Assignment = mongoose.model('Assignment', AssignmentSchema);
export default Assignment;
