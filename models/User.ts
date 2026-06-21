import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  email: string;
  password?: string;
  profilePicture?: string;
  role: 'STUDENT' | 'PLACEMENT_OFFICER' | 'ADMIN';
  college?: string;
  branch?: string;
  year?: number;
  cgpa?: number;
  linkedinUrl?: string;
  githubUrl?: string;
  graduationYear?: number;
  skills?: string[];
  careerInterests?: string[];
  resumeUrl?: string;
  isVerified: boolean;
  isOnboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide a full name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      select: false,
    },
    profilePicture: {
      type: String,
    },
    role: {
      type: String,
      enum: ['STUDENT', 'PLACEMENT_OFFICER', 'ADMIN'],
      default: 'STUDENT',
    },
    college: {
      type: String,
    },
    branch: {
      type: String,
    },
    year: {
      type: Number,
    },
    cgpa: {
      type: Number,
    },
    linkedinUrl: {
      type: String,
    },
    githubUrl: {
      type: String,
    },
    graduationYear: {
      type: Number,
    },
    skills: {
      type: [String],
    },
    careerInterests: {
      type: [String],
    },
    resumeUrl: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
