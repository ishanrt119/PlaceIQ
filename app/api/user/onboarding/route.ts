import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/config/database';
import { User } from '@/models/User';
import * as z from 'zod';

const onboardingSchema = z.object({
  cgpa: z.number().min(0).max(10, 'CGPA must be between 0 and 10'),
  graduationYear: z.number().min(2020).max(2030, 'Graduation year must be valid'),
  linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  skills: z.array(z.string()).min(1, 'Please select at least one skill'),
  careerInterests: z.array(z.string()).optional(),
  resumeUrl: z.string().url('Invalid Resume URL').optional().or(z.literal('')),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const data = onboardingSchema.parse(body);

    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        ...data,
        isOnboarded: true,
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Onboarding completed successfully', user: updatedUser },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
    }
    console.error('Onboarding error:', error);
    return NextResponse.json(
      { message: 'An error occurred during onboarding' },
      { status: 500 }
    );
  }
}
