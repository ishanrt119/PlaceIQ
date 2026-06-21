import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProgressBar } from "@/components/ui/progress-bar"
import { buttonVariants } from "@/components/ui/button"
import { Briefcase, Building2, ChevronRight, FileText, TrendingUp, Trophy } from "lucide-react"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import connectDB from "@/config/database"
import { User } from "@/models/User"
import { Company } from "@/models/Company"
import { InterviewExperience } from "@/models/InterviewExperience"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/login");
  }

  await connectDB();
  
  const user = await User.findById(session.user.id).lean();
  
  if (!user) {
    redirect("/login");
  }

  // Profile Completion Calculation
  const requiredFields = [
    { name: 'Profile Picture', value: user.profilePicture },
    { name: 'Professional Headline', value: user.professionalHeadline },
    { name: 'Placement Status', value: user.placementStatus },
    { name: 'College Details', value: user.college },
    { name: 'CGPA', value: user.cgpa },
    { name: 'Skills', value: user.skills && user.skills.length > 0 },
    { name: 'Resume', value: user.resumeUrl },
    { name: 'Projects', value: user.projects && user.projects.length > 0 },
  ];

  const completedFields = requiredFields.filter(f => !!f.value).length;
  const profileCompletion = Math.round((completedFields / requiredFields.length) * 100);
  
  const missingFields = requiredFields.filter(f => !f.value).map(f => f.name);
  const missingText = missingFields.length > 0 
    ? `Missing: ${missingFields.slice(0, 2).join(', ')}${missingFields.length > 2 ? '...' : ''}`
    : 'Profile 100% Complete! 🎉';

  // Real Database Metrics
  const experiencesCount = await InterviewExperience.countDocuments({ studentId: user._id });
  const clearedCount = await InterviewExperience.countDocuments({ studentId: user._id, status: 'SELECTED' });
  const companiesCount = await Company.countDocuments();

  const metrics = [
    { title: "Experiences Shared", value: experiencesCount.toString(), trend: "Help the community", icon: FileText },
    { title: "Interviews Cleared", value: clearedCount.toString(), trend: "Top 10%", icon: Trophy },
    { title: "Companies Hiring", value: companiesCount.toString(), trend: "New this week", icon: Briefcase },
  ];

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.fullName.split(' ')[0]}! 👋</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Here's what's happening with your placements today.
          </p>
        </div>
        
        {/* Profile Strength Widget */}
        <Card className="w-full md:w-[350px] bg-gradient-to-br from-primary/5 to-transparent border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary flex justify-between items-center">
              <span>Profile Strength</span>
              <span className="text-lg font-bold">{profileCompletion}%</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProgressBar value={profileCompletion} />
            <div className="text-xs text-muted-foreground flex justify-between items-center">
              <span>{missingText}</span>
              {profileCompletion < 100 && (
                <Link href="/dashboard/my-profile" className={buttonVariants({ variant: "link", size: "sm", className: "h-auto p-0" })}>
                  Complete now <ChevronRight className="h-3 w-3 ml-1" />
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                {metric.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommended Companies & Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle>Recommended Companies</CardTitle>
            <CardDescription>Based on your profile.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              {companiesCount === 0 ? (
                <div className="text-sm text-muted-foreground">No companies found.</div>
              ) : (
                (await Company.find().limit(3).lean()).map((company) => (
                  <div key={company._id.toString()} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary font-bold text-lg uppercase">
                      {company.logoUrl || company.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold">{company.name}</h4>
                      <p className="text-xs text-muted-foreground">{company.industry}</p>
                    </div>
                    <Link href="/dashboard/companies" className={buttonVariants({ variant: "outline", size: "sm" })}>
                      View
                    </Link>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle>Recent Experiences</CardTitle>
            <CardDescription>Learn from your peers.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              {experiencesCount === 0 ? (
                <div className="text-sm text-muted-foreground text-center">No experiences shared yet.</div>
              ) : (
                (await InterviewExperience.find().sort({ createdAt: -1 }).limit(3).populate('companyId').lean()).map((exp: any, i) => (
                  <div key={exp._id.toString()} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    {/* Timeline Dot */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-background bg-muted-foreground/10 group-[.is-active]:bg-primary/10 group-[.is-active]:text-primary text-muted-foreground shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    
                    {/* Content Card */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-card shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{exp.companyId?.name || "Company"}</span>
                      </div>
                      <h4 className="text-sm font-semibold truncate">{exp.roleApplied}</h4>
                      <p className="text-xs text-muted-foreground mt-1">Status: <span className="font-medium text-foreground">{exp.status}</span></p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
