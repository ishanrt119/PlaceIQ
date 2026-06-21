export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Visual Section - Hidden on mobile */}
      <div className="hidden lg:flex flex-col justify-center bg-gradient-to-b from-primary/10 to-primary/5 border-r p-12">
        <div className="max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            PlaceIQ Version 1.0
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Your Placement Journey, Supercharged.
          </h1>
          <p className="text-lg text-muted-foreground">
            Join thousands of students landing their dream jobs with data-driven insights and streamlined preparation.
          </p>
        </div>
      </div>

      {/* Auth Form Section */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-[400px]">
          {children}
        </div>
      </div>
    </div>
  );
}
