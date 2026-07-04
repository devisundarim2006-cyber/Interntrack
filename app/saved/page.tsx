'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { OpportunityCard } from '@/components/opportunity-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { supabase, type SavedOpportunity, type Application } from '@/lib/supabase';
import { Bookmark, Briefcase, Code2, Trophy, GraduationCap, Rocket, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function SavedPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [savedOpportunities, setSavedOpportunities] = useState<SavedOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchSavedOpportunities();
    }
  }, [user]);

  const fetchSavedOpportunities = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('saved_opportunities')
        .select('*, opportunity:opportunities(*)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      setSavedOpportunities((data as SavedOpportunity[]) || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load saved opportunities');
    } finally {
      setLoading(false);
    }
  };

  const filteredOpportunities = savedOpportunities.filter((saved) => {
    if (activeTab === 'all') return true;
    return saved.opportunity?.type === activeTab;
  });

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
            <h1 className="text-3xl font-bold mb-2">Saved Opportunities</h1>
            <p className="text-muted-foreground">
              Bookmark opportunities to view later and track your interests
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">
                All ({savedOpportunities.length})
              </TabsTrigger>
              <TabsTrigger value="internship">
                <Briefcase className="h-4 w-4 mr-1" />
                Internships
              </TabsTrigger>
              <TabsTrigger value="hackathon">
                <Code2 className="h-4 w-4 mr-1" />
                Hackathons
              </TabsTrigger>
              <TabsTrigger value="competition">
                <Trophy className="h-4 w-4 mr-1" />
                Competitions
              </TabsTrigger>
              <TabsTrigger value="scholarship">
                <GraduationCap className="h-4 w-4 mr-1" />
                Scholarships
              </TabsTrigger>
              <TabsTrigger value="fellowship">
                <Rocket className="h-4 w-4 mr-1" />
                Fellowships
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {loading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <Skeleton className="h-48 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredOpportunities.length === 0 ? (
                <Card className="p-12 text-center">
                  <CardContent>
                    <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No saved opportunities</h3>
                    <p className="text-muted-foreground mb-4">
                      Start exploring and bookmark opportunities you&apos;re interested in
                    </p>
                    <Link href="/internships">
                      <Button className="gradient-blue">Explore Opportunities</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOpportunities.map((saved) => (
                    <OpportunityCard
                      key={saved.id}
                      opportunity={saved.opportunity!}
                      onSavedChange={fetchSavedOpportunities}
                    />
                  ))}
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
