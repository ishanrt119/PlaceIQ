import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, ThumbsUp, ChevronUp, Share2, BookmarkPlus } from "lucide-react"
import connectDB from "@/config/database"
import { InterviewExperience } from "@/models/InterviewExperience"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function ExperiencesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  await connectDB();
  
  // Fetch experiences and populate the referenced models
  const experiences = await InterviewExperience.find()
    .sort({ createdAt: -1 })
    .populate('studentId', 'fullName profilePicture')
    .populate('companyId', 'name')
    .lean();

  return (
    <div className="space-y-8 max-w-4xl mx-auto w-full animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/50 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interview Experiences</h1>
          <p className="text-muted-foreground mt-1">Learn from the success and failures of your peers.</p>
        </div>
        <Button className="shadow-sm">Share Experience</Button>
      </div>

      <div className="space-y-6">
        {experiences.length === 0 ? (
          <div className="text-center p-12 border border-dashed rounded-xl text-muted-foreground">
            No interview experiences have been shared yet. Be the first!
          </div>
        ) : (
          experiences.map((exp: any) => (
            <Card key={exp._id.toString()} className="group hover:border-primary/40 transition-colors cursor-pointer overflow-hidden border border-border/60 shadow-sm hover:shadow-md">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  
                  {/* Voting Column (Hidden on mobile, converted to inline) */}
                  <div className="hidden sm:flex flex-col items-center p-6 bg-muted/20 border-r border-border/50 min-w-[80px]">
                    <button className="text-muted-foreground hover:text-primary transition-colors p-1">
                      <ChevronUp className="h-8 w-8" />
                    </button>
                    {/* Placeholder upvotes since model doesn't have it */}
                    <span className="font-bold text-lg">12</span>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 min-w-0">
                    
                    {/* Author & Meta */}
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                          {exp.studentId?.profilePicture ? (
                            <img src={exp.studentId.profilePicture} alt="Avatar" className="h-full w-full rounded-full object-cover" />
                          ) : (
                            exp.studentId?.fullName?.charAt(0) || "S"
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold truncate max-w-[150px] sm:max-w-xs">{exp.studentId?.fullName || "Anonymous Student"}</span>
                          <span className="text-xs text-muted-foreground">{new Date(exp.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20 whitespace-nowrap">
                        {exp.companyId?.name || "Company"} • {exp.roleApplied}
                      </Badge>
                    </div>

                    {/* Mobile Upvote (Inline) */}
                    <div className="sm:hidden flex items-center gap-2 mb-4 text-muted-foreground">
                      <ChevronUp className="h-5 w-5" />
                      <span className="font-bold text-sm text-foreground">12 upvotes</span>
                    </div>

                    {/* Title & Excerpt */}
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {exp.companyId?.name} {exp.roleApplied} Interview Experience ({exp.status})
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                      {exp.content}
                    </p>

                    {/* Tags (Using difficulty and status for now) */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <Badge variant="outline" className="text-xs font-normal text-muted-foreground border-border bg-background">
                        #{exp.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs font-normal text-muted-foreground border-border bg-background">
                        #{exp.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs font-normal text-muted-foreground border-border bg-background">
                        #Rounds: {exp.rounds}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                          <MessageSquare className="h-4 w-4" />
                          <span>0 Comments</span>
                        </button>
                        <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                          <Share2 className="h-4 w-4" />
                          <span>Share</span>
                        </button>
                      </div>
                      <button className="text-muted-foreground hover:text-primary transition-colors">
                        <BookmarkPlus className="h-5 w-5" />
                      </button>
                    </div>

                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

    </div>
  )
}
