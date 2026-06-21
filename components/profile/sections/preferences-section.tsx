"use client";

import { useFormContext } from "react-hook-form";
import { ProfileFormValues } from "@/lib/validations/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useState } from "react";

export default function PreferencesSection() {
  const { watch, setValue } = useFormContext<ProfileFormValues>();
  const { register } = useFormContext<ProfileFormValues>();

  const [newRole, setNewRole] = useState("");
  const [newLocation, setNewLocation] = useState("");
  
  const desiredRoles = watch("careerPreferences.desiredRoles") || [];
  const preferredLocations = watch("careerPreferences.preferredLocations") || [];

  const addRole = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newRole.trim()) return;
    if (!desiredRoles.includes(newRole.trim())) {
      setValue("careerPreferences.desiredRoles", [...desiredRoles, newRole.trim()]);
    }
    setNewRole("");
  };

  const removeRole = (role: string) => {
    setValue("careerPreferences.desiredRoles", desiredRoles.filter(r => r !== role));
  };

  const addLocation = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newLocation.trim()) return;
    if (!preferredLocations.includes(newLocation.trim())) {
      setValue("careerPreferences.preferredLocations", [...preferredLocations, newLocation.trim()]);
    }
    setNewLocation("");
  };

  const removeLocation = (location: string) => {
    setValue("careerPreferences.preferredLocations", preferredLocations.filter(l => l !== location));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Career Preferences</CardTitle>
        <CardDescription>
          Help placement officers match you with the right opportunities.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="space-y-4">
          <Label>Desired Roles</Label>
          <div className="flex gap-2">
            <Input 
              value={newRole} 
              onChange={(e) => setNewRole(e.target.value)} 
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addRole(e);
                }
              }}
              placeholder="e.g. Software Engineer, Data Scientist" 
            />
            <Button type="button" onClick={addRole} variant="secondary">
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>

          {desiredRoles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {desiredRoles.map((role) => (
                <Badge key={role} variant="secondary" className="px-3 py-1 font-normal">
                  {role}
                  <button type="button" onClick={() => removeRole(role)} className="ml-2 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Label>Preferred Locations</Label>
          <div className="flex gap-2">
            <Input 
              value={newLocation} 
              onChange={(e) => setNewLocation(e.target.value)} 
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addLocation(e);
                }
              }}
              placeholder="e.g. Bangalore, Remote, London" 
            />
            <Button type="button" onClick={addLocation} variant="secondary">
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>

          {preferredLocations.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {preferredLocations.map((location) => (
                <Badge key={location} variant="secondary" className="px-3 py-1 font-normal">
                  {location}
                  <button type="button" onClick={() => removeLocation(location)} className="ml-2 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="expectedPackage">Expected Package (CTC)</Label>
          <Input id="expectedPackage" {...register("careerPreferences.expectedPackage")} placeholder="e.g. 15 LPA or $100k" />
        </div>

      </CardContent>
    </Card>
  );
}
