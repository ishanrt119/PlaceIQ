import { Metadata } from "next";
import ProfileForm from "@/components/profile/profile-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDB from "@/config/database";
import { User } from "@/models/User";
import { InterviewExperience } from "@/models/InterviewExperience";
import ProfileHero from "@/components/profile/profile-hero";

export const metadata: Metadata = {
  title: "My Profile | PlaceIQ",
  description: "Manage your professional profile",
};

export default async function MyProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  await connectDB();
  
  // We fetch a lean user object to avoid serialization issues from mongoose to client component
  const user = await User.findById(session.user.id).lean();

  if (!user) {
    redirect("/login");
  }

  // Get count of experiences shared by user
  const experiencesCount = await InterviewExperience.countDocuments({ studentId: user._id });

  // Serialize all MongoDB data types (Dates, ObjectIds) to plain JSON strings
  const serializedUser = JSON.parse(JSON.stringify(user));

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full pb-20 animate-in slide-in-from-bottom-4 duration-500">
      
      <ProfileHero user={serializedUser} experiencesCount={experiencesCount} />

      <div className="px-2" id="profile-form">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Edit Profile Data</h2>
          <p className="text-muted-foreground">Keep your information up to date to increase visibility.</p>
        </div>
        <ProfileForm initialData={serializedUser} />
      </div>
    </div>
  );
}
