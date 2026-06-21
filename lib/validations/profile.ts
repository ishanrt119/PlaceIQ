import * as z from 'zod';

export const dateSchema = z.string().transform((str) => new Date(str)).or(z.date());

export const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').optional(),
  professionalHeadline: z.string().optional(),
  placementStatus: z.enum(['Looking for opportunities', 'Placed', 'Not looking']).optional(),
  
  college: z.string().optional(),
  branch: z.string().optional(),
  year: z.number().optional(),
  cgpa: z.number().min(0).max(10).optional(),
  graduationYear: z.number().optional(),
  tenthPercentage: z.number().min(0).max(100).optional(),
  twelfthPercentage: z.number().min(0).max(100).optional(),
  
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  internshalaUrl: z.string().url().optional().or(z.literal('')),
  leetcodeUrl: z.string().url().optional().or(z.literal('')),
  hackerrankUrl: z.string().url().optional().or(z.literal('')),
  codechefUrl: z.string().url().optional().or(z.literal('')),
  codeforcesUrl: z.string().url().optional().or(z.literal('')),
  portfolioUrl: z.string().url().optional().or(z.literal('')),
  
  skills: z.array(z.string()).optional(),
  resumeUrl: z.string().url().optional().or(z.literal('')),
  
  projects: z.array(z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    techStack: z.array(z.string()),
    githubLink: z.string().url().optional().or(z.literal('')),
    liveLink: z.string().url().optional().or(z.literal('')),
    startDate: dateSchema.optional(),
    endDate: dateSchema.optional(),
  })).optional(),
  
  workExperience: z.array(z.object({
    company: z.string().min(1, 'Company is required'),
    role: z.string().min(1, 'Role is required'),
    description: z.string().min(1, 'Description is required'),
    startDate: dateSchema.optional(),
    endDate: dateSchema.optional(),
    isCurrent: z.boolean().default(false),
  })).optional(),
  
  certifications: z.array(z.object({
    name: z.string().min(1, 'Name is required'),
    issuingOrganization: z.string().min(1, 'Issuing Organization is required'),
    issueDate: dateSchema.optional(),
    credentialUrl: z.string().url().optional().or(z.literal('')),
  })).optional(),
  
  achievements: z.array(z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    date: dateSchema.optional(),
  })).optional(),
  
  careerPreferences: z.object({
    desiredRoles: z.array(z.string()).optional(),
    preferredLocations: z.array(z.string()).optional(),
    expectedPackage: z.string().optional(),
  }).optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
