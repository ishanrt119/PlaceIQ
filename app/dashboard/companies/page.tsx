import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Search, Star, TrendingUp, Users, Briefcase } from "lucide-react"
import { Input } from "@/components/ui/input"
import connectDB from "@/config/database"
import { Company } from "@/models/Company"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function CompaniesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  await connectDB();
  const companies = await Company.find().sort({ createdAt: -1 }).lean();

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Companies Intelligence</h1>
          <p className="text-muted-foreground mt-1">Research hiring trends, salaries, and interview patterns.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search companies or roles..." className="pl-9 bg-background shadow-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left Sidebar Filters */}
        <div className="space-y-6 hidden md:block">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Filter Opportunities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {['Software Engineering', 'Data Science', 'Product Management', 'Design'].map((filter) => (
                <label key={filter} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                  <input type="checkbox" className="rounded border-muted-foreground/30 text-primary focus:ring-primary accent-primary" />
                  {filter}
                </label>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="col-span-1 md:col-span-3 space-y-4">
          {companies.length === 0 ? (
            <div className="text-center p-12 border border-dashed rounded-xl text-muted-foreground">
              No companies available in the database yet.
            </div>
          ) : (
            companies.map((company) => (
              <Card key={company._id.toString()} className="group hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                    
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10 group-hover:scale-105 transition-transform shrink-0">
                      <span className="text-2xl font-bold text-primary uppercase">{company.logoUrl || company.name.charAt(0)}</span>
                    </div>
                    
                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg truncate">{company.name}</h3>
                        {/* Placeholder Badges since Job model doesn't exist yet */}
                        <Badge variant="default" className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-200">
                          Hiring Now
                        </Badge>
                      </div>
                      <div className="text-muted-foreground text-sm flex items-center gap-4 flex-wrap">
                        <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {company.industry}</span>
                        {/* Placeholder text for missing features */}
                        <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> Software Engineer</span>
                        <span className="flex items-center gap-1 text-emerald-600 font-medium"><TrendingUp className="h-3 w-3" /> 10-15 LPA</span>
                      </div>
                      {company.description && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-1">{company.description}</p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-3 w-full sm:w-auto mt-4 sm:mt-0 shrink-0">
                      <div className="flex items-center gap-1 text-sm bg-primary/5 px-3 py-1 rounded-full text-primary font-medium border border-primary/10">
                        <Star className="h-3 w-3 fill-primary" /> 90% Match
                      </div>
                      <Button variant="outline" className="w-full sm:w-auto group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        View Profile
                      </Button>
                    </div>

                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
