'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { OpportunityCard } from '@/components/opportunity-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { supabase, type Opportunity, type Application, type SavedOpportunity } from '@/lib/supabase';
import {
  Briefcase,
  Bookmark,
  TrendingUp,
  Calendar,
  ArrowRight,
  Target,
  Send,
  CheckCircle2,
  AlertCircle,
  Trophy,
  Code2,
  GraduationCap,
  Rocket,
} from 'lucide-react';
import { formatDistanceToNow, isAfter } from 'date-fns';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [savedOpportunities, setSavedOpportunities] = useState<SavedOpportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [trendingOpportunities, setTrendingOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const { data: saved } = await supabase
        .from('saved_opportunities')
        .select('*, opportunity:opportunities(*)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(10);

      const { data: apps } = await supabase
        .from('applications')
        .select('*, opportunity:opportunities(*)')
        .eq('user_id', user!.id)
        .order('updated_at', { ascending: false })
        .limit(10);

      const { data: trending } = await supabase
        .from('opportunities')
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(6);

      setSavedOpportunities((saved as SavedOpportunity[]) || []);
      setApplications((apps as Application[]) || []);
      setTrendingOpportunities(trending || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    wishlist: 'bg-gray-500',
    applied: 'bg-blue-500',
    interview: 'bg-amber-500',
    assessment: 'bg-purple-500',
    offer: 'bg-emerald-500',
    rejected: 'bg-red-500',
  };

  const upcomingDeadlines = applications
    .filter((a) => a.opportunity?.deadline && isAfter(new Date(a.opportunity.deadline), new Date()))
    .sort((a, b) => new Date(a.opportunity!.deadline!).getTime() - new Date(b.opportunity!.deadline!).getTime())
    .slice(0, 5);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/20">
        <div className="container py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}!
            </h1>
            <p className="text-muted-foreground">
              Track your applications, discover new opportunities, and manage your career journey.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Bookmark className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{savedOpportunities.length}</p>
                    <p className="text-sm text-muted-foreground">Saved</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                    <Send className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{applications.filter((a) => a.status === 'applied').length}</p>
                    <p className="text-sm text-muted-foreground">Applied</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <Target className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {applications.filter((a) => ['interview', 'assessment'].includes(a.status)).length}
                    </p>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/30">
                    <Trophy className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {applications.filter((a) => a.status === 'offer').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Offers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Applications Overview */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Applications</CardTitle>
                    <CardDescription>Track your application progress</CardDescription>
                  </div>
                  <Link href="/applications">
                    <Button variant="outline" size="sm">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : applications.length === 0 ? (
                    <div className="text-center py-8">
                      <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">No applications yet</p>
                      <Link href="/internships">
                        <Button className="gradient-blue">Find Opportunities</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications.slice(0, 5).map((app) => (
                        <div
                          key={app.id}
                          className="flex items-center justify-between p-4 rounded-lg border bg-card"
                        >
                          <div className="flex items-center gap-4">
                            {app.opportunity?.company_logo_url ? (
                              <img
                                src={app.opportunity.company_logo_url}
                                alt={app.opportunity.company || ''}
                                className="h-10 w-10 rounded object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                                <Briefcase className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{app.opportunity?.title}</p>
                              <p className="text-sm text-muted-foreground">{app.opportunity?.company}</p>
                            </div>
                          </div>
                          <Badge className={`${statusColors[app.status]} text-white capitalize`}>
                            {app.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Trending Opportunities */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Trending Opportunities
                    </CardTitle>
                    <CardDescription>Featured opportunities hand-picked for you</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {trendingOpportunities.map((opp) => (
                        <Link key={opp.id} href={`/opportunities/${opp.id}`}>
                          <Card className="h-full hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                {opp.company_logo_url ? (
                                  <img src={opp.company_logo_url} alt={opp.company || ''} className="h-10 w-10 rounded object-cover" />
                                ) : (
                                  <div className="h-10 w-10 rounded bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                    {opp.type === 'internship' && <Briefcase className="h-5 w-5 text-white" />}
                                    {opp.type === 'hackathon' && <Code2 className="h-5 w-5 text-white" />}
                                    {opp.type === 'competition' && <Trophy className="h-5 w-5 text-white" />}
                                    {opp.type === 'scholarship' && <GraduationCap className="h-5 w-5 text-white" />}
                                    {opp.type === 'fellowship' && <Rocket className="h-5 w-5 text-white" />}
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium line-clamp-1">{opp.title}</p>
                                  <p className="text-sm text-muted-foreground">{opp.company}</p>
                                  <div className="flex gap-2 mt-2">
                                    <Badge variant="secondary" className="capitalize text-xs">{opp.type}</Badge>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Deadlines */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Deadlines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingDeadlines.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
                  ) : (
                    <div className="space-y-4">
                      {upcomingDeadlines.map((app) => (
                        <div key={app.id} className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{app.opportunity?.title}</p>
                            <p className="text-xs text-muted-foreground">
                              Due {formatDistanceToNow(new Date(app.opportunity!.deadline!), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Profile Completion */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${calculateProfileCompletion(profile)}%` }} />
                    </div>
                    <div className="space-y-2">
                      {!profile?.skills?.length && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4" />
                          Add your skills
                        </div>
                      )}
                      {!profile?.resume_url && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4" />
                          Upload your resume
                        </div>
                      )}
                      {!profile?.github_url && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4" />
                          Link your GitHub
                        </div>
                      )}
                    </div>
                    <Link href="/profile">
                      <Button variant="outline" className="w-full">
                        Complete Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/internships" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Briefcase className="mr-2 h-4 w-4" />
                      Find Internships
                    </Button>
                  </Link>
                  <Link href="/hackathons" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Code2 className="mr-2 h-4 w-4" />
                      Browse Hackathons
                    </Button>
                  </Link>
                  <Link href="/scholarships" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      Find Scholarships
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function calculateProfileCompletion(profile: any): number {
  if (!profile) return 0;
  const fields = ['full_name', 'skills', 'resume_url', 'github_url', 'linkedin_url', 'preferred_roles'];
  const completed = fields.filter((field) => {
    const value = profile[field];
    if (Array.isArray(value)) return value.length > 0;
    return !!value;
  }).length;
  return Math.round((completed / fields.length) * 100);
}
