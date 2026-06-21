'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Loader2, Check, ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const COLLEGES = [
  { value: "iit_bombay", label: "IIT Bombay" },
  { value: "iit_delhi", label: "IIT Delhi" },
  { value: "bits_pilani", label: "BITS Pilani" },
  { value: "nit_trichy", label: "NIT Trichy" },
  { value: "vit_vellore", label: "VIT Vellore" },
  // Add more colleges as needed
];

const BRANCHES = [
  "Computer Science", "Information Technology", "Electronics and Communication", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering"
];

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  college: z.string().min(1, 'College name is required'),
  branch: z.string().min(1, 'Branch is required'),
  year: z.number().min(1, 'Current year is required').max(5),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [collegeOpen, setCollegeOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      year: 1,
    }
  });

  const onSubmit = async (data: SignupFormData) => {
    setError(null);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        setError(responseData.message || 'Something went wrong');
        return;
      }

      // Automatically sign in the user after successful signup
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      router.push('/onboarding');
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn('google', { callbackUrl: '/onboarding' });
    } catch (error) {
      setIsGoogleLoading(false);
      setError('Google signup failed. Please try again.');
    }
  };

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            {...register('fullName')}
            disabled={isSubmitting || isGoogleLoading}
          />
          {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            {...register('email')}
            disabled={isSubmitting || isGoogleLoading}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              disabled={isSubmitting || isGoogleLoading}
            />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              disabled={isSubmitting || isGoogleLoading}
            />
            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        <div className="space-y-2 flex flex-col">
          <Label>College Name</Label>
          <Controller
            name="college"
            control={control}
            render={({ field }) => (
              <Popover open={collegeOpen} onOpenChange={setCollegeOpen}>
                <PopoverTrigger render={
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={collegeOpen}
                    className="justify-between w-full font-normal"
                    disabled={isSubmitting || isGoogleLoading}
                  />
                }>
                  {field.value
                    ? COLLEGES.find((c) => c.value === field.value)?.label
                    : "Select college..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search college..." />
                    <CommandEmpty>No college found.</CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        {COLLEGES.map((college) => (
                          <CommandItem
                            key={college.value}
                            value={college.value}
                            onSelect={(currentValue) => {
                              setValue("college", currentValue === field.value ? "" : currentValue, { shouldValidate: true })
                              setCollegeOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === college.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {college.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.college && <p className="text-sm text-destructive">{errors.college.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 flex flex-col">
            <Label>Branch</Label>
            <Controller
              name="branch"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value || ""} disabled={isSubmitting || isGoogleLoading}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRANCHES.map((b) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.branch && <p className="text-sm text-destructive">{errors.branch.message}</p>}
          </div>

          <div className="space-y-2 flex flex-col">
            <Label>Current Year</Label>
            <Controller
              name="year"
              control={control}
              render={({ field }) => (
                <Select onValueChange={(val) => { if (val) field.onChange(parseInt(val, 10)) }} value={field.value?.toString() || ""} disabled={isSubmitting || isGoogleLoading}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((y) => (
                      <SelectItem key={y} value={y.toString()}>{y} Year</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.year && <p className="text-sm text-destructive">{errors.year.message}</p>}
          </div>
        </div>

        {error && <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">{error}</div>}

        <Button type="submit" className="w-full mt-4" disabled={isSubmitting || isGoogleLoading}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Account
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <Button
        variant="outline"
        type="button"
        disabled={isSubmitting || isGoogleLoading}
        onClick={handleGoogleSignup}
      >
        {isGoogleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
        )}
        Google
      </Button>

      <div className="text-center text-sm">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
