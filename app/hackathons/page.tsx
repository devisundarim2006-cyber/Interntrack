'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { OpportunityCard } from '@/components/opportunity-card';
import { OpportunityFilters } from '@/components/opportunity-filters';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Code2, Search, RefreshCw, Trophy, Users, Clock, MapPin } from 'lucide-react';
import { supabase, type Opportunity } from '@/lib/supabase';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Filters {
  search: string;
  type: string;
  work_mode: string;
  location: string;
  sort: string;
  skills: string[];
  has_salary: boolean;
  is_featured: boolean;
  deadline_after?: Date;
}

const initialFilters: Filters = {
  search: '',
  type: 'hackathon',
  work_mode: 'all',
  location: 'all',
  sort: 'recent',
  skills: [],
  has_salary: false,
  is_featured: false,
};

export default function HackathonsPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 12;

  const fetchOpportunities = useCallback(async (reset = false) => {
    setLoading(true);
    try {
      let query = supabase
        .from('opportunities')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .eq('type', 'hackathon');

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,company.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      if (filters.work_mode !== 'all') {
        query = query.eq('work_mode', filters.work_mode);
      }
      if (filters.location !== 'all') {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters.skills.length > 0) {
        query = query.contains('skills_required', filters.skills);
      }
      if (filters.is_featured) {
        query = query.eq('is_featured', true);
      }
      if (filters.deadline_after) {
        query = query.gte('deadline', filters.deadline_after.toISOString());
      }

      switch (filters.sort) {
        case 'deadline':
          query = query.order('deadline', { ascending: true, nullsFirst: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const currentPage = reset ? 0 : page;
      query = query.range(currentPage * pageSize, (currentPage + 1) * pageSize - 1);

      const { data, error, count } = await query;
      if (error) throw error;

      const newOpportunities = data || [];
      if (reset) {
        setOpportunities(newOpportunities);
        setPage(1);
      } else {
        setOpportunities((prev) => [...prev, ...newOpportunities]);
        setPage(currentPage + 1);
      }
      setHasMore((reset ? newOpportunities.length : opportunities.length + newOpportunities.length) < (count || 0));
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load hackathons');
    } finally {
      setLoading(false);
    }
  }, [filters, page, opportunities.length]);

  useEffect(() => {
    setPage(0);
    fetchOpportunities(true);
  }, [filters]);

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters({ ...newFilters, type: 'hackathon' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-emerald-50 via-background to-teal-50 dark:from-emerald-950/20 dark:via-background dark:to-teal-950/20 py-12">
          <div className="container">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Hackathons</h1>
                <p className="text-muted-foreground">Find hackathons to build, learn, and compete</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950/30">
                <Trophy className="h-3 w-3 mr-1" /> Win prizes
              </Badge>
              <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950/30">
                <Users className="h-3 w-3 mr-1" /> Team building
              </Badge>
              <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950/30">
                <Clock className="h-3 w-3 mr-1" /> Time-limited challenges
              </Badge>
            </div>
          </div>
        </section>

        <section className="py-6 border-b bg-muted/20">
          <div className="container">
            <OpportunityFilters filters={filters} onFiltersChange={handleFiltersChange} opportunityType="hackathon" />
          </div>
        </section>

        <section className="py-8">
          <div className="container">
            {loading && opportunities.length === 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i}><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
                ))}
              </div>
            ) : opportunities.length === 0 ? (
              <Card className="p-12 text-center">
                <CardContent>
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hackathons found</h3>
                  <Button variant="outline" onClick={() => setFilters(initialFilters)}>Clear Filters</Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-6">Showing {opportunities.length} hackathons</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {opportunities.map((opp) => (
                    <OpportunityCard key={opp.id} opportunity={opp} />
                  ))}
                </div>
                {hasMore && (
                  <div className="flex justify-center mt-8">
                    <Button variant="outline" size="lg" onClick={() => fetchOpportunities()} disabled={loading}>
                      {loading ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Loading...</> : 'Load More'}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
