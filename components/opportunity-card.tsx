'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  DollarSign,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  MoreVertical,
  Calendar,
  Users,
  Trophy,
  Share2,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { supabase, type Opportunity } from '@/lib/supabase';
import { toast } from 'sonner';
import { formatDistanceToNow, format } from 'date-fns';

interface OpportunityCardProps {
  opportunity: Opportunity;
  variant?: 'default' | 'compact';
  onSavedChange?: () => void;
}

const typeColors: Record<string, string> = {
  internship: 'bg-blue-500',
  hackathon: 'bg-emerald-500',
  competition: 'bg-orange-500',
  scholarship: 'bg-rose-500',
  fellowship: 'bg-violet-500',
};

const statusColors: Record<string, string> = {
  remote: 'from-blue-500 to-cyan-500',
  hybrid: 'from-amber-500 to-orange-500',
  onsite: 'from-emerald-500 to-teal-500',
};

export function OpportunityCard({ opportunity, variant = 'default', onSavedChange }: OpportunityCardProps) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user) {
      toast.error('Please sign in to save opportunities');
      return;
    }

    setSaving(true);
    const { error } = await supabase.from('saved_opportunities').insert({
      user_id: user.id,
      opportunity_id: opportunity.id,
    });

    setSaving(false);

    if (error) {
      if (error.code === '23505') {
        toast.info('Already saved');
      } else {
        toast.error('Failed to save');
      }
    } else {
      setSaved(true);
      toast.success('Saved to your list');
      onSavedChange?.();
    }
  };

  const handleUnsave = async () => {
    if (!user) return;

    setSaving(true);
    const { error } = await supabase
      .from('saved_opportunities')
      .delete()
      .eq('user_id', user.id)
      .eq('opportunity_id', opportunity.id);

    setSaving(false);

    if (error) {
      toast.error('Failed to remove');
    } else {
      setSaved(false);
      toast.success('Removed from saved');
      onSavedChange?.();
    }
  };

  const formatDeadline = () => {
    if (!opportunity.deadline) return null;
    const date = new Date(opportunity.deadline);
    const isUrgent = date.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;
    return {
      text: formatDistanceToNow(date, { addSuffix: true }),
      full: format(date, 'MMM d, yyyy'),
      isUrgent,
    };
  };

  const deadline = formatDeadline();

  if (variant === 'compact') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className="flex-shrink-0">
                {opportunity.company_logo_url ? (
                  <img
                    src={opportunity.company_logo_url}
                    alt={opportunity.company || ''}
                    className="h-10 w-10 rounded object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold truncate">{opportunity.title}</h3>
                <p className="text-sm text-muted-foreground truncate">{opportunity.company}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${typeColors[opportunity.type]} text-white capitalize`}>
                {opportunity.type}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={saved ? handleUnsave : handleSave}
                disabled={saving}
              >
                {saved ? (
                  <BookmarkCheck className="h-4 w-4 text-primary" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group flex flex-col hover:shadow-lg transition-all duration-300 hover:border-primary/30">
      <CardContent className="p-6 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {opportunity.company_logo_url ? (
                <img
                  src={opportunity.company_logo_url}
                  alt={opportunity.company || ''}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
                {opportunity.title}
              </h3>
              <p className="text-muted-foreground">{opportunity.company}</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={saved ? handleUnsave : handleSave} disabled={saving}>
                {saved ? (
                  <>
                    <BookmarkCheck className="mr-2 h-4 w-4" />
                    Unsave
                  </>
                ) : (
                  <>
                    <Bookmark className="mr-2 h-4 w-4" />
                    Save
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {opportunity.description}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
          {opportunity.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{opportunity.location}</span>
            </div>
          )}
          {opportunity.work_mode && (
            <Badge variant="outline" className="capitalize">
              {opportunity.work_mode}
            </Badge>
          )}
          {opportunity.duration && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{opportunity.duration}</span>
            </div>
          )}
          {opportunity.salary && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span>{opportunity.salary}</span>
            </div>
          )}
        </div>

        {/* Hackathon/Competition specific */}
        {opportunity.type === 'hackathon' && (
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
            {opportunity.prize_pool && (
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <Trophy className="h-4 w-4" />
                <span>{opportunity.prize_pool}</span>
              </div>
            )}
            {opportunity.team_size && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Team: {opportunity.team_size}</span>
              </div>
            )}
          </div>
        )}

        {/* Deadline */}
        {deadline && (
          <div className={`flex items-center gap-1 text-sm mb-4 ${deadline.isUrgent ? 'text-red-500' : 'text-muted-foreground'}`}>
            <Calendar className="h-4 w-4" />
            <span>Deadline: {deadline.text}</span>
          </div>
        )}

        {/* Skills/Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {opportunity.skills_required?.slice(0, 4).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {opportunity.skills_required?.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{opportunity.skills_required.length - 4} more
            </Badge>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t">
          <Badge className={`${typeColors[opportunity.type]} text-white capitalize`}>
            {opportunity.type}
          </Badge>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={saved ? handleUnsave : handleSave}
              disabled={saving}
            >
              {saved ? (
                <BookmarkCheck className="h-4 w-4 text-primary" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
            <a href={opportunity.application_url} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="gradient-blue">
                Apply
                <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
