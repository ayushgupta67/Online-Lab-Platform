import mongoose  from "mongoose";

// Define the schema
const submittedCodeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Assignment'
  },
  code: {
    type: String,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  score: {
    type: Number,
    default: null
  },
});

// Static method to save submitted code
submittedCodeSchema.statics.saveCode = async function({ userId, assignmentId, code ,score}) {
  try {
    const submission = new this({
      userId,
      assignmentId,
      code,
      score
    });
    // before saving check if the user has already submitted the code for this assignment
    const existingSubmission = await this.findOne({ userId, assignmentId });
    
    if (existingSubmission) {
      // Update the existing submission
      existingSubmission.code = code;
      existingSubmission.score = score;
      return await existingSubmission.save();
    }
    // If no existing submission, save the new one
    return await submission.save();
  } catch (err) {
    console.error('Error in SubmittedCode.saveCode:', err);
    throw err;
  }
};


// Create and export the model
const SubmittedCode = mongoose.model('SubmittedCode', submittedCodeSchema);

export default SubmittedCode;
