'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart3, Briefcase, TrendingUp, Award, Building2, Layers, Code2, Calendar, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';

function StatCard({ title, value, description, icon: Icon, color }: {
  title: string;
  value: string | number;
  description: string;
  icon: typeof Briefcase;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalOpportunities: 0,
    internships: 0,
    hackathons: 0,
    competitions: 0,
    scholarships: 0,
    fellowships: 0,
    featured: 0,
    active: 0,
  });
  const [topCompanies, setTopCompanies] = useState<{ company: string; count: number }[]>([]);
  const [recentOpportunities, setRecentOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchTopCompanies();
    fetchRecentOpportunities();
  }, []);

  const fetchStats = async () => {
    const { data: opportunities } = await supabase.from('opportunities').select('type, is_featured, is_active');

    if (opportunities) {
      setStats({
        totalOpportunities: opportunities.length,
        internships: opportunities.filter((o) => o.type === 'internship').length,
        hackathons: opportunities.filter((o) => o.type === 'hackathon').length,
        competitions: opportunities.filter((o) => o.type === 'competition').length,
        scholarships: opportunities.filter((o) => o.type === 'scholarship').length,
        fellowships: opportunities.filter((o) => o.type === 'fellowship').length,
        featured: opportunities.filter((o) => o.is_featured).length,
        active: opportunities.filter((o) => o.is_active).length,
      });
    }
    setLoading(false);
  };

  const fetchTopCompanies = async () => {
    const { data } = await supabase
      .from('opportunities')
      .select('company')
      .not('company', 'is', null);

    if (data) {
      const counts: Record<string, number> = {};
      data.forEach((item) => {
        counts[item.company] = (counts[item.company] || 0) + 1;
      });
      const sorted = Object.entries(counts)
        .map(([company, count]) => ({ company, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
      setTopCompanies(sorted);
    }
  };

  const fetchRecentOpportunities = async () => {
    const { data } = await supabase
      .from('opportunities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    if (data) setRecentOpportunities(data);
  };

  const typeColors: Record<string, string> = {
    internship: 'bg-blue-500',
    hackathon: 'bg-emerald-500',
    competition: 'bg-orange-500',
    scholarship: 'bg-rose-500',
    fellowship: 'bg-violet-500',
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/20">
        <div className="container py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Platform analytics and overview</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Opportunities"
              value={stats.totalOpportunities}
              description="All listings"
              icon={Layers}
              color="bg-blue-500"
            />
            <StatCard
              title="Active Listings"
              value={stats.active}
              description="Currently available"
              icon={TrendingUp}
              color="bg-emerald-500"
            />
            <StatCard
              title="Featured"
              value={stats.featured}
              description="Highlighted opportunities"
              icon={Award}
              color="bg-amber-500"
            />
            <StatCard
              title="Companies"
              value={topCompanies.length}
              description="Partner organizations"
              icon={Building2}
              color="bg-violet-500"
            />
          </div>

          {/* Type Breakdown */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Opportunity Types</CardTitle>
                <CardDescription>Breakdown by category</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[
                      { name: 'Internships', count: stats.internships, color: 'bg-blue-500' },
                      { name: 'Hackathons', count: stats.hackathons, color: 'bg-emerald-500' },
                      { name: 'Competitions', count: stats.competitions, color: 'bg-orange-500' },
                      { name: 'Scholarships', count: stats.scholarships, color: 'bg-rose-500' },
                      { name: 'Fellowships', count: stats.fellowships, color: 'bg-violet-500' },
                    ].map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${item.color}`} />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${item.color}`}
                              style={{ width: `${(item.count / stats.totalOpportunities) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-12 text-right">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Companies */}
            <Card>
              <CardHeader>
                <CardTitle>Top Companies</CardTitle>
                <CardDescription>Most active organizations</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(10)].map((_, i) => (
                      <Skeleton key={i} className="h-6 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {topCompanies.slice(0, 8).map((item, idx) => (
                      <div key={item.company} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground w-4">{idx + 1}.</span>
                          <span>{item.company}</span>
                        </div>
                        <Badge variant="secondary">{item.count}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Opportunities</CardTitle>
              <CardDescription>Latest additions to the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {recentOpportunities.map((opp) => (
                    <div key={opp.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                      <div className="flex items-center gap-3">
                        {opp.company_logo_url ? (
                          <img src={opp.company_logo_url} alt={opp.company || ''} className="h-8 w-8 rounded object-cover" />
                        ) : (
                          <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-sm">{opp.title}</p>
                          <p className="text-xs text-muted-foreground">{opp.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${typeColors[opp.type]} text-white capitalize text-xs`}>
                          {opp.type}
                        </Badge>
                        {opp.is_featured && (
                          <Badge variant="outline" className="text-xs">Featured</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
