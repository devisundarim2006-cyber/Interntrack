'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { OpportunityCard } from '@/components/opportunity-card';
import { OpportunityFilters } from '@/components/opportunity-filters';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, Search, RefreshCw } from 'lucide-react';
import { supabase, type Opportunity } from '@/lib/supabase';
import { toast } from 'sonner';

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
  type: 'internship',
  work_mode: 'all',
  location: 'all',
  sort: 'recent',
  skills: [],
  has_salary: false,
  is_featured: false,
};

export default function InternshipsPage() {
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
        .eq('type', 'internship');

      // Apply filters
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

      if (filters.has_salary) {
        query = query.not('salary', 'is', null);
      }

      if (filters.is_featured) {
        query = query.eq('is_featured', true);
      }

      if (filters.deadline_after) {
        query = query.gte('deadline', filters.deadline_after.toISOString());
      }

      // Sorting
      switch (filters.sort) {
        case 'deadline':
          query = query.order('deadline', { ascending: true, nullsFirst: false });
          break;
        case 'salary':
          // Can't sort by salary easily, so just sort by created_at
          query = query.order('created_at', { ascending: false });
          break;
        case 'company':
          query = query.order('company', { ascending: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      // Pagination
      const currentPage = reset ? 0 : page;
      query = query.range(currentPage * pageSize, (currentPage + 1) * pageSize - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      const newOpportunities = data || [];
      const total = count || 0;

      if (reset) {
        setOpportunities(newOpportunities);
        setPage(1);
      } else {
        setOpportunities((prev) => [...prev, ...newOpportunities]);
        setPage(currentPage + 1);
      }

      setHasMore((reset ? newOpportunities.length : opportunities.length + newOpportunities.length) < total);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      toast.error('Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  }, [filters, page, opportunities.length]);

  useEffect(() => {
    setPage(0);
    fetchOpportunities(true);
  }, [filters]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchOpportunities();
    }
  };

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters({ ...newFilters, type: 'internship' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-50 via-background to-cyan-50 dark:from-blue-950/20 dark:via-background dark:to-cyan-950/20 py-12">
          <div className="container">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Internships</h1>
                <p className="text-muted-foreground">
                  Find your dream internship at top companies worldwide
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 border-b bg-muted/20">
          <div className="container">
            <OpportunityFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              opportunityType="internship"
            />
          </div>
        </section>

        {/* Results */}
        <section className="py-8">
          <div className="container">
            {loading && opportunities.length === 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <Skeleton className="h-12 w-12 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3 mb-4" />
                      <div className="flex gap-2 mb-4">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : opportunities.length === 0 ? (
              <Card className="p-12 text-center">
                <CardContent>
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No internships found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search terms
                  </p>
                  <Button variant="outline" onClick={() => setFilters(initialFilters)}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-muted-foreground">
                    Showing {opportunities.length} internships
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {opportunities.map((opp) => (
                    <OpportunityCard
                      key={opp.id}
                      opportunity={opp}
                      onSavedChange={() => toast.success('Updated saved list')}
                    />
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center mt-8">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleLoadMore}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        'Load More'
                      )}
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
