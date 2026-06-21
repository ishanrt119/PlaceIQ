import { Metadata } from "next";
import ProfileForm from "@/components/profile/profile-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDB from "@/config/database";
import { User } from "@/models/User";

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

  // Serialize all MongoDB data types (Dates, ObjectIds) to plain JSON strings
  const serializedUser = JSON.parse(JSON.stringify(user));

  return (
    <div className="flex-1 space-y-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
      </div>
      <ProfileForm initialData={serializedUser} />
    </div>
  );
}
