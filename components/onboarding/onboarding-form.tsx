'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Check, ChevronsUpDown, UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SKILLS_LIST = [
  "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", "Java", "C++", "SQL", "MongoDB", "AWS", "Docker"
];

const INTERESTS_LIST = [
  "Frontend Development", "Backend Development", "Full Stack Development", "Data Science", "Machine Learning", "DevOps", "Product Management"
];

const onboardingSchema = z.object({
  cgpa: z.number().min(0).max(10, 'CGPA must be between 0 and 10'),
  graduationYear: z.number().min(2020).max(2030, 'Invalid year'),
  linkedinUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  skills: z.array(z.string()).min(1, 'Please select at least one skill'),
  careerInterests: z.array(z.string()).optional(),
  resumeUrl: z.string().optional(),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

export function OnboardingForm() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [skillsOpen, setSkillsOpen] = React.useState(false);
  const [interestsOpen, setInterestsOpen] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      skills: [],
      careerInterests: [],
    }
  });

  const selectedSkills = watch('skills');
  const selectedInterests = watch('careerInterests');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate file upload delay
      setTimeout(() => {
        setIsUploading(false);
        setValue('resumeUrl', `https://fake-s3-bucket.com/${file.name}`);
      }, 1500);
    }
  };

  const onSubmit = async (data: OnboardingFormData) => {
    setError(null);
    try {
      const res = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const responseData = await res.json();
        setError(responseData.message || 'Something went wrong');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      
      {/* Academic Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Academic Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="cgpa">CGPA (Out of 10)</Label>
            <Input
              id="cgpa"
              type="number"
              step="0.01"
              placeholder="e.g. 8.5"
              {...register('cgpa', { valueAsNumber: true })}
              disabled={isSubmitting}
            />
            {errors.cgpa && <p className="text-sm text-destructive">{errors.cgpa.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="graduationYear">Expected Graduation Year</Label>
            <Controller
              name="graduationYear"
              control={control}
              render={({ field }) => (
                <Select onValueChange={(val) => { if (val) field.onChange(parseInt(val, 10)) }} value={field.value?.toString() || ""} disabled={isSubmitting}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {[2024, 2025, 2026, 2027, 2028].map((y) => (
                      <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.graduationYear && <p className="text-sm text-destructive">{errors.graduationYear.message}</p>}
          </div>
        </div>
      </div>

      {/* Professional Links */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Professional Links <span className="text-sm text-muted-foreground font-normal">(Optional)</span></h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
            <Input
              id="linkedinUrl"
              type="url"
              placeholder="https://linkedin.com/in/username"
              {...register('linkedinUrl')}
              disabled={isSubmitting}
            />
            {errors.linkedinUrl && <p className="text-sm text-destructive">{errors.linkedinUrl.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub Profile</Label>
            <Input
              id="githubUrl"
              type="url"
              placeholder="https://github.com/username"
              {...register('githubUrl')}
              disabled={isSubmitting}
            />
            {errors.githubUrl && <p className="text-sm text-destructive">{errors.githubUrl.message}</p>}
          </div>
        </div>
      </div>

      {/* Skills & Interests */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Skills & Interests</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 flex flex-col">
            <Label>Technical Skills</Label>
            <Controller
              name="skills"
              control={control}
              render={({ field }) => (
                <Popover open={skillsOpen} onOpenChange={setSkillsOpen}>
                  <PopoverTrigger render={
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={skillsOpen}
                      className="justify-between"
                      disabled={isSubmitting}
                    />
                  }>
                    {field.value && field.value.length > 0
                      ? `${field.value.length} selected`
                      : "Select skills..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Search skills..." />
                      <CommandEmpty>No skill found.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {SKILLS_LIST.map((skill) => (
                            <CommandItem
                              key={skill}
                              onSelect={() => {
                                const current = new Set(field.value || []);
                                if (current.has(skill)) {
                                  current.delete(skill);
                                } else {
                                  current.add(skill);
                                }
                                setValue("skills", Array.from(current), { shouldValidate: true });
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value?.includes(skill) ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {skill}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            />
            {selectedSkills && selectedSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedSkills.map(skill => (
                  <span key={skill} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-md">
                    {skill}
                  </span>
                ))}
              </div>
            )}
            {errors.skills && <p className="text-sm text-destructive">{errors.skills.message}</p>}
          </div>

          <div className="space-y-2 flex flex-col">
            <Label>Career Interests</Label>
            <Controller
              name="careerInterests"
              control={control}
              render={({ field }) => (
                <Popover open={interestsOpen} onOpenChange={setInterestsOpen}>
                  <PopoverTrigger render={
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={interestsOpen}
                      className="justify-between"
                      disabled={isSubmitting}
                    />
                  }>
                    {field.value && field.value.length > 0
                      ? `${field.value.length} selected`
                      : "Select interests..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Search interests..." />
                      <CommandEmpty>No interest found.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {INTERESTS_LIST.map((interest) => (
                            <CommandItem
                              key={interest}
                              onSelect={() => {
                                const current = new Set(field.value || []);
                                if (current.has(interest)) {
                                  current.delete(interest);
                                } else {
                                  current.add(interest);
                                }
                                setValue("careerInterests", Array.from(current), { shouldValidate: true });
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value?.includes(interest) ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {interest}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            />
            {selectedInterests && selectedInterests.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedInterests.map(interest => (
                  <span key={interest} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-md">
                    {interest}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resume Upload */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Resume <span className="text-sm text-muted-foreground font-normal">(Required)</span></h3>
        <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center bg-muted/10 hover:bg-muted/20 transition-colors">
          <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
          <Label htmlFor="resumeUpload" className="cursor-pointer">
            <span className="text-primary font-medium hover:underline">Click to upload</span> or drag and drop
            <Input 
              id="resumeUpload" 
              type="file" 
              className="hidden" 
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              disabled={isUploading || isSubmitting}
            />
          </Label>
          <p className="text-xs text-muted-foreground mt-2">PDF, DOC, DOCX up to 5MB</p>
          
          {isUploading && (
            <div className="mt-4 flex items-center text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
            </div>
          )}
          
          {watch('resumeUrl') && !isUploading && (
            <div className="mt-4 text-sm text-green-600 font-medium flex items-center">
              <Check className="mr-2 h-4 w-4" /> Resume uploaded successfully
            </div>
          )}
        </div>
        {/* We make resumeUrl technically optional in Zod for simplicity of testing, but show it visually as required or validate it if needed. For now it's optional in schema. */}
      </div>

      {error && <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">{error}</div>}

      <div className="flex justify-end pt-4">
        <Button size="lg" type="submit" disabled={isSubmitting || isUploading}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Complete Profile
        </Button>
      </div>

    </form>
  );
}
