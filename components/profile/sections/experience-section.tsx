"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { ProfileFormValues } from "@/lib/validations/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function ExperienceSection() {
  const { register, control, watch, setValue, formState: { errors } } = useFormContext<ProfileFormValues>();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "workExperience",
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Work Experience</CardTitle>
          <CardDescription>
            Add your internships and full-time experiences.
          </CardDescription>
        </div>
        <Button 
          type="button" 
          onClick={() => append({ company: "", role: "", description: "", isCurrent: false, startDate: undefined, endDate: undefined })}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Experience
        </Button>
      </CardHeader>
      <CardContent className="space-y-8">
        
        {fields.length === 0 && (
          <p className="text-sm text-muted-foreground italic text-center py-4 border-2 border-dashed rounded-md">
            No work experience added.
          </p>
        )}

        {fields.map((field, index) => {
          const isCurrent = watch(`workExperience.${index}.isCurrent`);

          return (
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
                  <Label>Company Name</Label>
                  <Input {...register(`workExperience.${index}.company` as const)} placeholder="e.g. Google" />
                  {errors.workExperience?.[index]?.company && (
                    <p className="text-sm text-destructive">{errors.workExperience[index]?.company?.message}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Role / Title</Label>
                  <Input {...register(`workExperience.${index}.role` as const)} placeholder="e.g. Software Engineering Intern" />
                  {errors.workExperience?.[index]?.role && (
                    <p className="text-sm text-destructive">{errors.workExperience[index]?.role?.message}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Description</Label>
                  <Textarea 
                    {...register(`workExperience.${index}.description` as const)} 
                    placeholder="Describe your responsibilities and achievements..."
                    className="min-h-[100px]"
                  />
                  {errors.workExperience?.[index]?.description && (
                    <p className="text-sm text-destructive">{errors.workExperience[index]?.description?.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" {...register(`workExperience.${index}.startDate` as const)} />
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input 
                    type="date" 
                    {...register(`workExperience.${index}.endDate` as const)} 
                    disabled={isCurrent}
                  />
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox 
                      id={`current-${index}`} 
                      checked={isCurrent}
                      onCheckedChange={(checked) => {
                        setValue(`workExperience.${index}.isCurrent`, checked as boolean);
                        if (checked) {
                          setValue(`workExperience.${index}.endDate`, undefined);
                        }
                      }}
                    />
                    <label
                      htmlFor={`current-${index}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I currently work here
                    </label>
                  </div>
                </div>

              </div>
            </div>
          );
        })}

      </CardContent>
    </Card>
  );
}
