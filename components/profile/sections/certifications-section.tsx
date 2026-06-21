"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { ProfileFormValues } from "@/lib/validations/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export default function CertificationsSection() {
  const { register, control, formState: { errors } } = useFormContext<ProfileFormValues>();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "certifications",
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Certifications</CardTitle>
          <CardDescription>
            Add relevant certifications or courses you&apos;ve completed.
          </CardDescription>
        </div>
        <Button 
          type="button" 
          onClick={() => append({ name: "", issuingOrganization: "", issueDate: undefined, credentialUrl: "" })}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Certification
        </Button>
      </CardHeader>
      <CardContent className="space-y-8">
        
        {fields.length === 0 && (
          <p className="text-sm text-muted-foreground italic text-center py-4 border-2 border-dashed rounded-md">
            No certifications added.
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
                <Label>Certification Name</Label>
                <Input {...register(`certifications.${index}.name` as const)} placeholder="e.g. AWS Certified Solutions Architect" />
                {errors.certifications?.[index]?.name && (
                  <p className="text-sm text-destructive">{errors.certifications[index]?.name?.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Issuing Organization</Label>
                <Input {...register(`certifications.${index}.issuingOrganization` as const)} placeholder="e.g. Amazon Web Services" />
                {errors.certifications?.[index]?.issuingOrganization && (
                  <p className="text-sm text-destructive">{errors.certifications[index]?.issuingOrganization?.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Issue Date</Label>
                <Input type="date" {...register(`certifications.${index}.issueDate` as const)} />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Credential URL</Label>
                <Input {...register(`certifications.${index}.credentialUrl` as const)} placeholder="https://..." />
                {errors.certifications?.[index]?.credentialUrl && (
                  <p className="text-sm text-destructive">{errors.certifications[index]?.credentialUrl?.message}</p>
                )}
              </div>

            </div>
          </div>
        ))}

      </CardContent>
    </Card>
  );
}
