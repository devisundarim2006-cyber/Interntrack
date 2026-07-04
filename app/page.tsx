'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase,
  Code2,
  Trophy,
  GraduationCap,
  Rocket,
  Search,
  Sparkles,
  TrendingUp,
  Users,
  Globe,
  ArrowRight,
  CheckCircle2,
  Star,
} from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useState, useEffect } from 'react';
import { supabase, type Opportunity } from '@/lib/supabase';

const features = [
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Find opportunities that match your skills, interests, and goals with powerful filters.',
  },
  {
    icon: Sparkles,
    title: 'AI Recommendations',
    description: 'Get personalized suggestions based on your resume and profile analysis.',
  },
  {
    icon: TrendingUp,
    title: 'Track Progress',
    description: 'Monitor all your applications in one place with status tracking and reminders.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Access opportunities from 30+ trusted sources worldwide.',
  },
];

const opportunityTypes = [
  {
    icon: Briefcase,
    name: 'Internships',
    description: 'Real-world experience at top companies',
    href: '/internships',
    color: 'from-blue-500 to-cyan-500',
    count: '2,500+',
  },
  {
    icon: Code2,
    name: 'Hackathons',
    description: 'Build innovative solutions in competitive events',
    href: '/hackathons',
    color: 'from-emerald-500 to-teal-500',
    count: '500+',
  },
  {
    icon: Trophy,
    name: 'Competitions',
    description: 'Test your skills in coding contests',
    href: '/competitions',
    color: 'from-orange-500 to-amber-500',
    count: '300+',
  },
  {
    icon: GraduationCap,
    name: 'Scholarships',
    description: 'Financial support for your education',
    href: '/scholarships',
    color: 'from-rose-500 to-pink-500',
    count: '1,000+',
  },
  {
    icon: Rocket,
    name: 'Fellowships',
    description: 'Prestigious programs for career growth',
    href: '/fellowships',
    color: 'from-violet-500 to-purple-500',
    count: '200+',
  },
];

export default function Home() {
  const [featuredOpportunities, setFeaturedOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data } = await supabase
        .from('opportunities')
        .select('*')
        .eq('is_featured', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (data) setFeaturedOpportunities(data);
      setLoading(false);
    };
    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-background to-cyan-50 dark:from-blue-950/20 dark:via-background dark:to-cyan-950/20" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNiOTM3ZTIiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

          <div className="container relative py-24 md:py-32">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4 px-4 py-1">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered Opportunity Platform
              </Badge>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                Your Gateway to{' '}
                <span className="text-gradient">Career Opportunities</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Discover internships, hackathons, coding competitions, scholarships, and fellowships from 30+ trusted sources. Personalized recommendations powered by AI.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/internships">
                  <Button size="lg" className="gradient-blue h-12 px-8 text-base">
                    Explore Opportunities
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                    Create Free Account
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t">
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-gradient">4,500+</div>
                  <div className="text-sm text-muted-foreground mt-1">Active Opportunities</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-gradient">30+</div>
                  <div className="text-sm text-muted-foreground mt-1">Data Sources</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-gradient">50K+</div>
                  <div className="text-sm text-muted-foreground mt-1">Users Worldwide</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-gradient">95%</div>
                  <div className="text-sm text-muted-foreground mt-1">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Opportunity Types */}
        <section className="py-20 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Find Your Perfect Opportunity
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Whether you&apos;re looking for hands-on experience, competitive challenges, or financial support, we&apos;ve got you covered.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {opportunityTypes.map((type) => (
                <Link key={type.name} href={type.href}>
                  <Card className="group h-full hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r ${type.color} mb-4`}>
                        <type.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                        {type.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {type.description}
                      </p>
                      <Badge variant="secondary">{type.count}</Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-24 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose InternHub?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our platform combines powerful technology with a user-centric approach to help you succeed.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => (
                <Card key={feature.title} className="bg-background/60 backdrop-blur">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-full gradient-blue flex items-center justify-center mb-4">
                      <feature.icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Opportunities */}
        <section className="py-20 md:py-24">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  Featured Opportunities
                </h2>
                <p className="text-muted-foreground">
                  Hand-picked opportunities from top companies and organizations.
                </p>
              </div>
              <Link href="/internships">
                <Button variant="outline" className="hidden sm:flex">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-muted rounded w-3/4 mb-4" />
                      <div className="h-3 bg-muted rounded w-1/2 mb-2" />
                      <div className="h-3 bg-muted rounded w-full mb-4" />
                      <div className="flex gap-2">
                        <div className="h-6 bg-muted rounded w-16" />
                        <div className="h-6 bg-muted rounded w-16" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : featuredOpportunities.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredOpportunities.map((opp) => (
                  <Card key={opp.id} className="flex flex-col hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {opp.company_logo_url ? (
                            <img src={opp.company_logo_url} alt={opp.company || ''} className="h-10 w-10 rounded object-cover" />
                          ) : (
                            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                              <Briefcase className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold line-clamp-1">{opp.title}</h3>
                            <p className="text-sm text-muted-foreground">{opp.company}</p>
                          </div>
                        </div>
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {opp.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-auto">
                        {opp.work_mode && (
                          <Badge variant="outline" className="capitalize">{opp.work_mode}</Badge>
                        )}
                        {opp.location && (
                          <Badge variant="secondary">{opp.location}</Badge>
                        )}
                        <Badge className="capitalize bg-blue-500">{opp.type}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <CardContent>
                  <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No Featured Opportunities Yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Check back soon for hand-picked opportunities from top companies.
                  </p>
                </CardContent>
              </Card>
            )}

            <Link href="/internships" className="sm:hidden block mt-6">
              <Button variant="outline" className="w-full">
                View All Opportunities
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 gradient-blue" />
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737711867-e3b9733f0ab8?w=1200&h=600&fit=crop')] opacity-10 bg-cover bg-center" />

              <div className="relative py-16 px-8 md:py-24 md:px-16 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Launch Your Career?
                </h2>
                <p className="text-blue-100 max-w-xl mx-auto mb-8">
                  Join thousands of students and professionals who have found their dream opportunities through InternHub.
                </p>
                <Link href="/auth/signup">
                  <Button size="lg" variant="secondary" className="h-12 px-8 text-base">
                    Get Started for Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 md:py-24 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Success Stories
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Hear from users who found their dream opportunities through InternHub.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: 'Sarah Chen',
                  role: 'Software Engineering Intern at Google',
                  quote: 'InternHub helped me discover opportunities I never knew existed. The AI recommendations were spot-on and I landed my dream internship!',
                  image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1c6?w=100&h=100&fit=crop',
                },
                {
                  name: 'David Kim',
                  role: 'Hackathon Winner, MLH Fellow',
                  quote: 'The hackathon finder connected me to amazing events. Won my first hackathon within a month of joining!',
                  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
                },
                {
                  name: 'Priya Patel',
                  role: 'Scholarship Recipient',
                  quote: 'Found a full-ride scholarship through InternHub. The reminder feature ensured I never missed a deadline.',
                  image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
                },
              ].map((testimonial) => (
                <Card key={testimonial.name}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <img src={testimonial.image} alt={testimonial.name} className="h-12 w-12 rounded-full object-cover" />
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">&ldquo;{testimonial.quote}&rdquo;</p>
                    <div className="flex mt-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
