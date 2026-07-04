'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import { supabase, type Application, type Opportunity } from '@/lib/supabase';
import {
  Briefcase,
  Send,
  Target,
  Trophy,
  XCircle,
  Calendar,
  ExternalLink,
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

type ApplicationStatus = 'wishlist' | 'applied' | 'interview' | 'assessment' | 'offer' | 'rejected';

const statusConfig: Record<ApplicationStatus, { color: string; bg: string; icon: typeof Clock }> = {
  wishlist: { color: 'text-gray-700 dark:text-gray-300', bg: 'bg-gray-100 dark:bg-gray-800', icon: Clock },
  applied: { color: 'text-blue-700 dark:text-blue-300', bg: 'bg-blue-100 dark:bg-blue-900', icon: Send },
  interview: { color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-100 dark:bg-amber-900', icon: Target },
  assessment: { color: 'text-purple-700 dark:text-purple-300', bg: 'bg-purple-100 dark:bg-purple-900', icon: ClipboardList },
  offer: { color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-100 dark:bg-emerald-900', icon: Trophy },
  rejected: { color: 'text-red-700 dark:text-red-300', bg: 'bg-red-100 dark:bg-red-900', icon: XCircle },
};

export default function ApplicationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ApplicationStatus | 'all'>('all');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('applications')
        .select('*, opportunity:opportunities(*)')
        .eq('user_id', user!.id)
        .order('updated_at', { ascending: false });

      setApplications((data as Application[]) || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId: string, newStatus: ApplicationStatus) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
          timeline: [
            ...(applications.find((a) => a.id === applicationId)?.timeline || []),
            { status: newStatus, date: new Date().toISOString() },
          ],
        })
        .eq('id', applicationId);

      if (error) throw error;
      toast.success('Status updated');
      fetchApplications();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (activeTab === 'all') return true;
    return app.status === activeTab;
  });

  const statusCounts = {
    all: applications.length,
    wishlist: applications.filter((a) => a.status === 'wishlist').length,
    applied: applications.filter((a) => a.status === 'applied').length,
    interview: applications.filter((a) => a.status === 'interview').length,
    assessment: applications.filter((a) => a.status === 'assessment').length,
    offer: applications.filter((a) => a.status === 'offer').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

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
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Application Tracker</h1>
            <p className="text-muted-foreground">
              Track and manage all your applications in one place
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
            {(['wishlist', 'applied', 'interview', 'assessment', 'offer', 'rejected'] as ApplicationStatus[]).map((status) => {
              const config = statusConfig[status];
              const count = statusCounts[status];
              return (
                <Card
                  key={status}
                  className={`cursor-pointer transition-all ${activeTab === status ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setActiveTab(status)}
                >
                  <CardContent className="p-4 text-center">
                    <config.icon className={`h-6 w-6 mx-auto mb-2 ${config.color}`} />
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs text-muted-foreground capitalize">{status}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ApplicationStatus | 'all')}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist ({statusCounts.wishlist})</TabsTrigger>
              <TabsTrigger value="applied">Applied ({statusCounts.applied})</TabsTrigger>
              <TabsTrigger value="interview">Interview ({statusCounts.interview})</TabsTrigger>
              <TabsTrigger value="assessment">Assessment ({statusCounts.assessment})</TabsTrigger>
              <TabsTrigger value="offer">Offers ({statusCounts.offer})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({statusCounts.rejected})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <Skeleton className="h-20 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredApplications.length === 0 ? (
                <Card className="p-12 text-center">
                  <CardContent>
                    <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start tracking your job applications
                    </p>
                    <Link href="/internships">
                      <Button className="gradient-blue">Find Opportunities</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredApplications.map((app) => {
                    const config = statusConfig[app.status as ApplicationStatus];
                    const opportunity = app.opportunity as Opportunity;

                    return (
                      <Card key={app.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                              {opportunity?.company_logo_url ? (
                                <img
                                  src={opportunity.company_logo_url}
                                  alt={opportunity.company || ''}
                                  className="h-12 w-12 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                                  <Briefcase className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                              <div>
                                <h3 className="font-semibold">{opportunity?.title}</h3>
                                <p className="text-sm text-muted-foreground">{opportunity?.company}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {opportunity?.location && (
                                    <Badge variant="outline">{opportunity.location}</Badge>
                                  )}
                                  {opportunity?.work_mode && (
                                    <Badge variant="secondary" className="capitalize">
                                      {opportunity.work_mode}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                              {opportunity?.deadline && (
                                <div className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  Due {formatDistanceToNow(new Date(opportunity.deadline), { addSuffix: true })}
                                </div>
                              )}

                              <Select
                                value={app.status}
                                onValueChange={(v) => updateStatus(app.id, v as ApplicationStatus)}
                              >
                                <SelectTrigger className="w-[140px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="wishlist">Wishlist</SelectItem>
                                  <SelectItem value="applied">Applied</SelectItem>
                                  <SelectItem value="interview">Interview</SelectItem>
                                  <SelectItem value="assessment">Assessment</SelectItem>
                                  <SelectItem value="offer">Offer</SelectItem>
                                  <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                              </Select>

                              <a href={opportunity?.application_url} target="_blank" rel="noopener noreferrer">
                                <Button size="sm" variant="outline">
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </a>
                            </div>
                          </div>

                          {/* Timeline */}
                          {app.timeline && app.timeline.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                              <p className="text-sm text-muted-foreground mb-2">Timeline</p>
                              <div className="flex flex-wrap gap-2">
                                {app.timeline.map((event, idx) => (
                                  <Badge key={idx} variant="outline" className="capitalize">
                                    {event.status} - {format(new Date(event.date), 'MMM d')}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
