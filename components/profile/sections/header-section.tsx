"use client";

import { useFormContext } from "react-hook-form";
import { ProfileFormValues } from "@/lib/validations/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Camera, FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function HeaderSection() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<ProfileFormValues>();
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);

  // Simulated upload functions
  const handlePhotoUpload = () => {
    setIsUploadingPhoto(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsUploadingPhoto(false);
      toast.success("Profile photo uploaded successfully!");
      // Here you would actually set the photo URL returned from your bucket
    }, 1500);
  };

  const handleResumeUpload = () => {
    setIsUploadingResume(true);
    setTimeout(() => {
      setValue("resumeUrl", "https://example.com/simulated-resume.pdf");
      setIsUploadingResume(false);
      toast.success("Resume uploaded successfully!");
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Your headline and placement status are the first things recruiters see.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Photo and Resume Upload row */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex flex-col items-center gap-3">
            <div className="h-24 w-24 rounded-full bg-muted border-2 border-dashed flex items-center justify-center overflow-hidden relative">
              <Camera className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
            <Button type="button" variant="outline" size="sm" onClick={handlePhotoUpload} disabled={isUploadingPhoto}>
              {isUploadingPhoto ? "Uploading..." : "Change Photo"}
            </Button>
          </div>
          
          <div className="flex-1 w-full space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" {...register("fullName")} placeholder="e.g. John Doe" />
              {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="professionalHeadline">Professional Headline</Label>
              <Input id="professionalHeadline" {...register("professionalHeadline")} placeholder="e.g. Full Stack Developer | Final Year CS Student" />
              <p className="text-xs text-muted-foreground">Appears below your name on your profile.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Placement Status</Label>
            <Select 
              value={watch("placementStatus") || ""} 
              onValueChange={(val) => setValue("placementStatus", val as "Looking for opportunities" | "Placed" | "Not looking")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Looking for opportunities">Looking for opportunities</SelectItem>
                <SelectItem value="Placed">Placed</SelectItem>
                <SelectItem value="Not looking">Not looking</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex flex-col justify-end pb-1">
            <div className="flex gap-4 items-center">
              <Button type="button" variant="secondary" className="flex-1 gap-2" onClick={handleResumeUpload} disabled={isUploadingResume}>
                <FileText className="h-4 w-4" />
                {isUploadingResume ? "Uploading..." : "Upload Resume (PDF)"}
              </Button>
              {watch("resumeUrl") && (
                <a 
                  href={watch("resumeUrl")!} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: "outline" })}
                >
                  Preview
                </a>
              )}
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
