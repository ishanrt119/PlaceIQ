"use client";

import { useFormContext } from "react-hook-form";
import { ProfileFormValues } from "@/lib/validations/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Code2 } from "lucide-react";

export default function LinksSection() {
  const { register, formState: { errors } } = useFormContext<ProfileFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Profiles</CardTitle>
        <CardDescription>
          Link your professional and competitive programming profiles.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="space-y-2">
          <Label htmlFor="linkedinUrl" className="flex items-center gap-2">
            <LinkedinIcon className="h-4 w-4 text-blue-600" /> LinkedIn
          </Label>
          <Input id="linkedinUrl" {...register("linkedinUrl")} placeholder="https://linkedin.com/in/username" />
          {errors.linkedinUrl && <p className="text-sm text-destructive">{errors.linkedinUrl.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="githubUrl" className="flex items-center gap-2">
            <GithubIcon className="h-4 w-4" /> GitHub
          </Label>
          <Input id="githubUrl" {...register("githubUrl")} placeholder="https://github.com/username" />
          {errors.githubUrl && <p className="text-sm text-destructive">{errors.githubUrl.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="portfolioUrl" className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-green-600" /> Portfolio Website
          </Label>
          <Input id="portfolioUrl" {...register("portfolioUrl")} placeholder="https://yourwebsite.com" />
          {errors.portfolioUrl && <p className="text-sm text-destructive">{errors.portfolioUrl.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="internshalaUrl" className="flex items-center gap-2">
            <BriefcaseIcon className="h-4 w-4 text-blue-400" /> Internshala
          </Label>
          <Input id="internshalaUrl" {...register("internshalaUrl")} placeholder="https://internshala.com/student/profile" />
          {errors.internshalaUrl && <p className="text-sm text-destructive">{errors.internshalaUrl.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="leetcodeUrl" className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-orange-500" /> LeetCode
          </Label>
          <Input id="leetcodeUrl" {...register("leetcodeUrl")} placeholder="https://leetcode.com/username" />
          {errors.leetcodeUrl && <p className="text-sm text-destructive">{errors.leetcodeUrl.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="hackerrankUrl" className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-green-500" /> HackerRank
          </Label>
          <Input id="hackerrankUrl" {...register("hackerrankUrl")} placeholder="https://hackerrank.com/username" />
          {errors.hackerrankUrl && <p className="text-sm text-destructive">{errors.hackerrankUrl.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="codechefUrl" className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-amber-700" /> CodeChef
          </Label>
          <Input id="codechefUrl" {...register("codechefUrl")} placeholder="https://codechef.com/users/username" />
          {errors.codechefUrl && <p className="text-sm text-destructive">{errors.codechefUrl.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="codeforcesUrl" className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-red-500" /> Codeforces
          </Label>
          <Input id="codeforcesUrl" {...register("codeforcesUrl")} placeholder="https://codeforces.com/profile/username" />
          {errors.codeforcesUrl && <p className="text-sm text-destructive">{errors.codeforcesUrl.message}</p>}
        </div>

      </CardContent>
    </Card>
  );
}

function BriefcaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0-.2-3.8s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0C6.2 1.6 5 2 5 2a5.5 5.5 0 0 0-.2 3.8A5.5 5.5 0 0 0 3 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
