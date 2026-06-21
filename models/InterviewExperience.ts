import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IInterviewExperience extends Document {
  studentId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  roleApplied: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  rounds: number;
  status: 'SELECTED' | 'REJECTED' | 'WAITLISTED' | 'IN_PROGRESS';
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewExperienceSchema: Schema = new Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required'],
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
    },
    roleApplied: {
      type: String,
      required: [true, 'Role applied for is required'],
    },
    difficulty: {
      type: String,
      enum: ['EASY', 'MEDIUM', 'HARD'],
      required: [true, 'Difficulty level is required'],
    },
    rounds: {
      type: Number,
      required: [true, 'Number of rounds is required'],
      min: 1,
    },
    status: {
      type: String,
      enum: ['SELECTED', 'REJECTED', 'WAITLISTED', 'IN_PROGRESS'],
      required: [true, 'Interview status is required'],
    },
    content: {
      type: String,
      required: [true, 'Experience content is required'],
    },
  },
  {
    timestamps: true,
  }
);

export const InterviewExperience: Model<IInterviewExperience> = mongoose.models.InterviewExperience || mongoose.model<IInterviewExperience>('InterviewExperience', InterviewExperienceSchema);
