"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { ProfileFormValues } from "@/lib/validations/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function ProjectsSection() {
  const { register, control, watch, setValue, formState: { errors } } = useFormContext<ProfileFormValues>();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  const [techInput, setTechInput] = useState<{ [key: number]: string }>({});

  const handleAddTech = (index: number) => {
    const tech = techInput[index]?.trim();
    if (!tech) return;
    
    const currentTechs = watch(`projects.${index}.techStack`) || [];
    if (!currentTechs.includes(tech)) {
      setValue(`projects.${index}.techStack`, [...currentTechs, tech]);
    }
    
    setTechInput({ ...techInput, [index]: "" });
  };

  const handleRemoveTech = (projectIndex: number, techToRemove: string) => {
    const currentTechs = watch(`projects.${projectIndex}.techStack`) || [];
    setValue(
      `projects.${projectIndex}.techStack`,
      currentTechs.filter((t) => t !== techToRemove)
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Projects</CardTitle>
          <CardDescription>
            Showcase your best projects and open source contributions.
          </CardDescription>
        </div>
        <Button 
          type="button" 
          onClick={() => append({ title: "", description: "", techStack: [], githubLink: "", liveLink: "", startDate: undefined, endDate: undefined })}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Project
        </Button>
      </CardHeader>
      <CardContent className="space-y-8">
        
        {fields.length === 0 && (
          <p className="text-sm text-muted-foreground italic text-center py-4 border-2 border-dashed rounded-md">
            No projects added. Click &quot;Add Project&quot; to include one.
          </p>
        )}

        {fields.map((field, index) => (
          <div key={field.id} className="p-4 border rounded-lg relative space-y-4 bg-muted/20">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-4 right-4 h-8 w-8"
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-12">
              <div className="space-y-2 md:col-span-2">
                <Label>Project Title</Label>
                <Input {...register(`projects.${index}.title` as const)} placeholder="e.g. E-Commerce Platform" />
                {errors.projects?.[index]?.title && (
                  <p className="text-sm text-destructive">{errors.projects[index]?.title?.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Textarea 
                  {...register(`projects.${index}.description` as const)} 
                  placeholder="Describe your project, your role, and the impact..."
                  className="min-h-[100px]"
                />
                {errors.projects?.[index]?.description && (
                  <p className="text-sm text-destructive">{errors.projects[index]?.description?.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Tech Stack</Label>
                <div className="flex gap-2 mb-2">
                  <Input 
                    value={techInput[index] || ""}
                    onChange={(e) => setTechInput({ ...techInput, [index]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTech(index);
                      }
                    }}
                    placeholder="e.g. Next.js, MongoDB"
                  />
                  <Button type="button" onClick={() => handleAddTech(index)} variant="secondary">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(watch(`projects.${index}.techStack`) || []).map((tech) => (
                    <Badge key={tech} variant="outline" className="px-2 py-1">
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(index, tech)}
                        className="ml-2 hover:text-destructive focus:outline-none"
                      >
                        x
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>GitHub Link</Label>
                <Input {...register(`projects.${index}.githubLink` as const)} placeholder="https://github.com/..." />
                {errors.projects?.[index]?.githubLink && (
                  <p className="text-sm text-destructive">{errors.projects[index]?.githubLink?.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Live Link</Label>
                <Input {...register(`projects.${index}.liveLink` as const)} placeholder="https://..." />
                {errors.projects?.[index]?.liveLink && (
                  <p className="text-sm text-destructive">{errors.projects[index]?.liveLink?.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" {...register(`projects.${index}.startDate` as const)} />
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" {...register(`projects.${index}.endDate` as const)} />
              </div>

            </div>
          </div>
        ))}

      </CardContent>
    </Card>
  );
}
