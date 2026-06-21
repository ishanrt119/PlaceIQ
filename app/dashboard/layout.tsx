import Link from 'next/link';
import { GraduationCap, LayoutDashboard, Briefcase, FileText, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-muted/40">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-background border-r flex flex-col">
        <div className="h-16 flex items-center px-6 border-b">
          <Link className="flex items-center gap-2 font-semibold" href="/">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="">PlaceIQ</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-4 flex flex-col gap-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md bg-muted text-primary font-medium">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground transition-colors">
            <Briefcase className="h-4 w-4" />
            Companies
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground transition-colors">
            <FileText className="h-4 w-4" />
            Experiences
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground transition-colors">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-background flex items-center px-6 md:hidden">
          {/* Mobile header / toggle could go here */}
          <span className="font-semibold">Dashboard</span>
        </header>
        <div className="flex-1 p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
