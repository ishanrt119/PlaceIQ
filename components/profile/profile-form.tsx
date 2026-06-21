"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileFormValues } from "@/lib/validations/profile";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import HeaderSection from "./sections/header-section";
import AcademicSection from "./sections/academic-section";
import SkillsSection from "./sections/skills-section";
import ProjectsSection from "./sections/projects-section";
import ExperienceSection from "./sections/experience-section";
import CertificationsSection from "./sections/certifications-section";
import AchievementsSection from "./sections/achievements-section";
import LinksSection from "./sections/links-section";
import PreferencesSection from "./sections/preferences-section";

interface ProfileFormProps {
  initialData: Record<string, unknown> | unknown;
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // Format dates to YYYY-MM-DD for form inputs
  const formatDateForInput = (dateString: string | undefined | null) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch {
      return "";
    }
  };

  const typedInitialData = initialData as Record<string, unknown>;
  const formattedInitialData = {
    ...typedInitialData,
    projects: (typedInitialData.projects as Record<string, unknown>[])?.map((p) => ({
      ...p,
      startDate: formatDateForInput(p.startDate as string),
      endDate: formatDateForInput(p.endDate as string),
    })) || [],
    workExperience: (typedInitialData.workExperience as Record<string, unknown>[])?.map((w) => ({
      ...w,
      startDate: formatDateForInput(w.startDate as string),
      endDate: formatDateForInput(w.endDate as string),
    })) || [],
    certifications: (typedInitialData.certifications as Record<string, unknown>[])?.map((c) => ({
      ...c,
      issueDate: formatDateForInput(c.issueDate as string),
    })) || [],
    achievements: (typedInitialData.achievements as Record<string, unknown>[])?.map((a) => ({
      ...a,
      date: formatDateForInput(a.date as string),
    })) || [],
    careerPreferences: typedInitialData.careerPreferences || {
      desiredRoles: [],
      preferredLocations: [],
      expectedPackage: "",
    },
    skills: typedInitialData.skills || [],
  };

  const methods = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: formattedInitialData,
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      toast.success("Profile updated successfully!");
      router.refresh();
    } catch (error: unknown) {
      toast.error((error as Error).message || "An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8 relative pb-24">
        
        {/* Sticky Save Button Container */}
        <div className="sticky top-0 z-40 -mx-6 px-6 py-4 bg-background/80 backdrop-blur-sm border-b flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Keep your profile updated to increase placement chances.</p>
          </div>
          <Button type="submit" disabled={isSaving} className="gap-2">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="grid gap-8">
          <HeaderSection />
          <AcademicSection />
          <ExperienceSection />
          <ProjectsSection />
          <SkillsSection />
          <CertificationsSection />
          <AchievementsSection />
          <LinksSection />
          <PreferencesSection />
        </div>

      </form>
    </FormProvider>
  );
}
