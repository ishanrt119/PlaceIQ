"use client";

import { useFormContext } from "react-hook-form";
import { ProfileFormValues } from "@/lib/validations/profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useState } from "react";

export default function SkillsSection() {
  const { watch, setValue } = useFormContext<ProfileFormValues>();
  const [newSkill, setNewSkill] = useState("");
  
  const skills = watch("skills") || [];

  const addSkill = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newSkill.trim()) return;
    
    // Check if skill already exists (case insensitive)
    if (!skills.some(s => s.toLowerCase() === newSkill.trim().toLowerCase())) {
      setValue("skills", [...skills, newSkill.trim()]);
    }
    setNewSkill("");
  };

  const removeSkill = (skillToRemove: string) => {
    setValue("skills", skills.filter(s => s !== skillToRemove));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
        <CardDescription>
          Add skills that highlight your technical and professional expertise.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="flex gap-2">
          <Input 
            value={newSkill} 
            onChange={(e) => setNewSkill(e.target.value)} 
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill(e);
              }
            }}
            placeholder="e.g. React.js, Machine Learning, UI/UX Design" 
          />
          <Button type="button" onClick={addSkill} variant="secondary">
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>

        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="px-3 py-1 text-sm font-normal">
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-2 hover:text-destructive focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No skills added yet.</p>
        )}

      </CardContent>
    </Card>
  );
}
