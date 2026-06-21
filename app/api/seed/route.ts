import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import { Company } from '@/models/Company';
import { InterviewExperience } from '@/models/InterviewExperience';
import { User } from '@/models/User';

export async function GET() {
  try {
    await connectDB();

    // 1. Get a random user to attribute experiences to (or create a dummy one)
    let user = await User.findOne({ email: "dummy@seed.com" });
    if (!user) {
      user = await User.create({
        fullName: "Rahul Sharma (Dummy)",
        email: "dummy@seed.com",
        role: "STUDENT",
        isVerified: true,
        isOnboarded: true,
      });
    }

    // 2. Clear existing test data
    await Company.deleteMany({ name: { $in: ["Google", "Amazon", "Microsoft", "Stripe"] } });
    await InterviewExperience.deleteMany({ studentId: user._id });

    // 3. Create Companies
    const companies = await Company.insertMany([
      {
        name: "Google",
        industry: "Technology",
        description: "Google LLC is an American multinational technology company.",
        logoUrl: "G",
      },
      {
        name: "Amazon",
        industry: "E-Commerce",
        description: "Amazon.com, Inc. is an American multinational technology company.",
        logoUrl: "A",
      },
      {
        name: "Microsoft",
        industry: "Technology",
        description: "Microsoft Corporation is an American multinational technology corporation.",
        logoUrl: "M",
      },
      {
        name: "Stripe",
        industry: "Fintech",
        description: "Stripe is a technology company that builds economic infrastructure for the internet.",
        logoUrl: "S",
      }
    ]);

    // 4. Create Experiences
    await InterviewExperience.insertMany([
      {
        studentId: user._id,
        companyId: companies[0]._id, // Google
        roleApplied: "SWE Intern 2025",
        difficulty: "HARD",
        rounds: 4,
        status: "SELECTED",
        content: "The process consisted of 1 resume screening, 1 online assessment, and 2 technical phone interviews focusing heavily on dynamic programming and graphs. The first technical round was completely focused on DP on Trees. The second was System Design.",
      },
      {
        studentId: user._id,
        companyId: companies[1]._id, // Amazon
        roleApplied: "SDE-1",
        difficulty: "MEDIUM",
        rounds: 3,
        status: "WAITLISTED",
        content: "Started with the online assessment which had 2 coding questions. Followed by 2 technical rounds and 1 Bar Raiser round focusing on Leadership Principles. Make sure you know the 14 LPs by heart!",
      }
    ]);

    return NextResponse.json({ message: "Seeded successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
