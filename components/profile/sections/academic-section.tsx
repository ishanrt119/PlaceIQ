"use client";

import { useFormContext } from "react-hook-form";
import { ProfileFormValues } from "@/lib/validations/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AcademicSection() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<ProfileFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Academic Information</CardTitle>
        <CardDescription>
          Your educational background and academic performance.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* We can't easily reuse the Combobox here without copying the component, so we'll just use a normal Input for college for now, or you can import a shared Combobox later. For simplicity, we'll use a normal select if it's in the list, or just input. Let's stick to an input to allow any college, or a standard Select. Let's use standard Input for simplicity in this massive form. */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="college">College / University</Label>
          <Input id="college" {...register("college")} placeholder="e.g. National Institute of Technology" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="branch">Branch / Major</Label>
          <Input id="branch" {...register("branch")} placeholder="e.g. Computer Science and Engineering" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Current Year</Label>
          <Select 
            value={watch("year")?.toString() || ""} 
            onValueChange={(val) => setValue("year", parseInt(val, 10))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((y) => (
                <SelectItem key={y} value={y.toString()}>{y} Year</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="graduationYear">Graduation Year</Label>
          <Input 
            id="graduationYear" 
            type="number" 
            {...register("graduationYear", { valueAsNumber: true })} 
            placeholder="e.g. 2024" 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cgpa">Current CGPA (Out of 10)</Label>
          <Input 
            id="cgpa" 
            type="number" 
            step="0.01" 
            {...register("cgpa", { valueAsNumber: true })} 
            placeholder="e.g. 8.5" 
          />
          {errors.cgpa && <p className="text-sm text-destructive">{errors.cgpa.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="twelfthPercentage">12th / Diploma Percentage</Label>
          <Input 
            id="twelfthPercentage" 
            type="number" 
            step="0.01" 
            {...register("twelfthPercentage", { valueAsNumber: true })} 
            placeholder="e.g. 92.5" 
          />
          {errors.twelfthPercentage && <p className="text-sm text-destructive">{errors.twelfthPercentage.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tenthPercentage">10th Percentage</Label>
          <Input 
            id="tenthPercentage" 
            type="number" 
            step="0.01" 
            {...register("tenthPercentage", { valueAsNumber: true })} 
            placeholder="e.g. 95.0" 
          />
          {errors.tenthPercentage && <p className="text-sm text-destructive">{errors.tenthPercentage.message}</p>}
        </div>

      </CardContent>
    </Card>
  );
}
