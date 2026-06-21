import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProject {
  title: string;
  description: string;
  techStack: string[];
  githubLink?: string;
  liveLink?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface IExperience {
  company: string;
  role: string;
  description: string;
  startDate?: Date;
  endDate?: Date;
  isCurrent: boolean;
}

export interface ICertification {
  name: string;
  issuingOrganization: string;
  issueDate?: Date;
  credentialUrl?: string;
}

export interface IAchievement {
  title: string;
  description: string;
  date?: Date;
}

export interface IUser extends Document {
  fullName: string;
  email: string;
  password?: string;
  profilePicture?: string;
  role: 'STUDENT' | 'PLACEMENT_OFFICER' | 'ADMIN';
  
  // Profile Header
  professionalHeadline?: string;
  placementStatus?: 'Looking for opportunities' | 'Placed' | 'Not looking';
  
  // Academic
  college?: string;
  branch?: string;
  year?: number;
  cgpa?: number;
  graduationYear?: number;
  tenthPercentage?: number;
  twelfthPercentage?: number;
  
  // Links
  linkedinUrl?: string;
  githubUrl?: string;
  internshalaUrl?: string;
  leetcodeUrl?: string;
  hackerrankUrl?: string;
  codechefUrl?: string;
  codeforcesUrl?: string;
  portfolioUrl?: string;
  
  // Skills & Resume
  skills?: string[];
  resumeUrl?: string;
  
  // Array Sections
  projects?: IProject[];
  workExperience?: IExperience[];
  certifications?: ICertification[];
  achievements?: IAchievement[];
  
  // Career Preferences
  careerPreferences?: {
    desiredRoles?: string[];
    preferredLocations?: string[];
    expectedPackage?: string;
  };
  careerInterests?: string[]; // Legacy, kept for backwards compatibility with onboarding
  
  // System
  isVerified: boolean;
  isOnboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  techStack: [{ type: String }],
  githubLink: String,
  liveLink: String,
  startDate: Date,
  endDate: Date,
});

const ExperienceSchema = new Schema<IExperience>({
  company: { type: String, required: true },
  role: { type: String, required: true },
  description: { type: String, required: true },
  startDate: Date,
  endDate: Date,
  isCurrent: { type: Boolean, default: false },
});

const CertificationSchema = new Schema<ICertification>({
  name: { type: String, required: true },
  issuingOrganization: { type: String, required: true },
  issueDate: Date,
  credentialUrl: String,
});

const AchievementSchema = new Schema<IAchievement>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: Date,
});

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
    
    // Header
    professionalHeadline: String,
    placementStatus: {
      type: String,
      enum: ['Looking for opportunities', 'Placed', 'Not looking'],
    },
    
    // Academic
    college: String,
    branch: String,
    year: Number,
    cgpa: Number,
    graduationYear: Number,
    tenthPercentage: Number,
    twelfthPercentage: Number,
    
    // Links
    linkedinUrl: String,
    githubUrl: String,
    internshalaUrl: String,
    leetcodeUrl: String,
    hackerrankUrl: String,
    codechefUrl: String,
    codeforcesUrl: String,
    portfolioUrl: String,
    
    // Skills & Resume
    skills: [String],
    resumeUrl: String,
    
    // Array Sections
    projects: [ProjectSchema],
    workExperience: [ExperienceSchema],
    certifications: [CertificationSchema],
    achievements: [AchievementSchema],
    
    // Preferences
    careerPreferences: {
      desiredRoles: [String],
      preferredLocations: [String],
      expectedPackage: String,
    },
    careerInterests: [String],
    
    // System
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
