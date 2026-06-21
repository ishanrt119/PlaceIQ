import { SignupForm } from '@/components/auth/signup-form';

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
        <p className="text-muted-foreground">Enter your details to start your placement journey</p>
      </div>
      <SignupForm />
    </div>
  );
}
