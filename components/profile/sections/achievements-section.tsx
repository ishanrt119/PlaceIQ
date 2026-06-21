"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { ProfileFormValues } from "@/lib/validations/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export default function AchievementsSection() {
  const { register, control, formState: { errors } } = useFormContext<ProfileFormValues>();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "achievements",
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Achievements & Awards</CardTitle>
          <CardDescription>
            Highlight hackathons, competitions, or scholarships you&apos;ve won.
          </CardDescription>
        </div>
        <Button 
          type="button" 
          onClick={() => append({ title: "", description: "", date: undefined })}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Achievement
        </Button>
      </CardHeader>
      <CardContent className="space-y-8">
        
        {fields.length === 0 && (
          <p className="text-sm text-muted-foreground italic text-center py-4 border-2 border-dashed rounded-md">
            No achievements added.
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
                <Label>Title</Label>
                <Input {...register(`achievements.${index}.title` as const)} placeholder="e.g. 1st Place - Smart India Hackathon" />
                {errors.achievements?.[index]?.title && (
                  <p className="text-sm text-destructive">{errors.achievements[index]?.title?.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Textarea 
                  {...register(`achievements.${index}.description` as const)} 
                  placeholder="Provide context and detail your achievement..."
                />
                {errors.achievements?.[index]?.description && (
                  <p className="text-sm text-destructive">{errors.achievements[index]?.description?.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" {...register(`achievements.${index}.date` as const)} />
              </div>

            </div>
          </div>
        ))}

      </CardContent>
    </Card>
  );
}
