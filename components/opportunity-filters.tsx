'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  DollarSign,
  Clock,
  Calendar as CalendarIcon,
  X,
  Filter,
} from 'lucide-react';
import { useState } from 'react';
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

interface OpportunityFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  opportunityType?: 'internship' | 'hackathon' | 'competition' | 'scholarship' | 'fellowship';
}

const popularSkills = [
  'JavaScript',
  'Python',
  'React',
  'Node.js',
  'Java',
  'TypeScript',
  'Go',
  'Rust',
  'Machine Learning',
  'Data Science',
  'AWS',
  'Docker',
];

const locations = [
  'Remote',
  'New York, NY',
  'San Francisco, CA',
  'Seattle, WA',
  'Austin, TX',
  'London, UK',
  'Berlin, DE',
  'Toronto, CA',
];

export function OpportunityFilters({
  filters,
  onFiltersChange,
  opportunityType,
}: OpportunityFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('');

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleSkill = (skill: string) => {
    const newSkills = filters.skills.includes(skill)
      ? filters.skills.filter((s) => s !== skill)
      : [...filters.skills, skill];
    updateFilter('skills', newSkills);
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      type: 'all',
      work_mode: 'all',
      location: 'all',
      sort: 'recent',
      skills: [],
      has_salary: false,
      is_featured: false,
    });
  };

  const hasActiveFilters =
    filters.type !== 'all' ||
    filters.work_mode !== 'all' ||
    filters.location !== 'all' ||
    filters.skills.length > 0 ||
    filters.has_salary ||
    filters.is_featured ||
    filters.deadline_after;

  return (
    <div className="space-y-4">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search opportunities..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={filters.sort}
            onValueChange={(value) => updateFilter('sort', value)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="deadline">Deadline Soon</SelectItem>
              <SelectItem value="salary">Highest Salary</SelectItem>
              <SelectItem value="company">Company A-Z</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={showFilters ? 'default' : 'outline'}
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'gradient-blue' : ''}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
                Active
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.type !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              {filters.type}
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter('type', 'all')} />
            </Badge>
          )}
          {filters.work_mode !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              {filters.work_mode}
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter('work_mode', 'all')} />
            </Badge>
          )}
          {filters.location !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              {filters.location}
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter('location', 'all')} />
            </Badge>
          )}
          {filters.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="gap-1">
              {skill}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleSkill(skill)} />
            </Badge>
          ))}
          {filters.has_salary && (
            <Badge variant="secondary" className="gap-1">
              Paid
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter('has_salary', false)} />
            </Badge>
          )}
          {filters.is_featured && (
            <Badge variant="secondary" className="gap-1">
              Featured
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter('is_featured', false)} />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
            Clear all
          </Button>
        </div>
      )}

      {/* Expanded Filters */}
      {showFilters && (
        <Card className="bg-muted/30 border-0">
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Type Filter */}
              {!opportunityType && (
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Opportunity Type
                  </Label>
                  <Select
                    value={filters.type}
                    onValueChange={(value) => updateFilter('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="internship">Internships</SelectItem>
                      <SelectItem value="hackathon">Hackathons</SelectItem>
                      <SelectItem value="competition">Competitions</SelectItem>
                      <SelectItem value="scholarship">Scholarships</SelectItem>
                      <SelectItem value="fellowship">Fellowships</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Work Mode */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Work Mode
                </Label>
                <Select
                  value={filters.work_mode}
                  onValueChange={(value) => updateFilter('work_mode', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All modes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modes</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </Label>
                <Select
                  value={filters.location}
                  onValueChange={(value) => updateFilter('location', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc.toLowerCase()}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Deadline */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Deadline After
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      {filters.deadline_after ? (
                        format(filters.deadline_after, 'PPP')
                      ) : (
                        <span className="text-muted-foreground">Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.deadline_after}
                      onSelect={(date) => updateFilter('deadline_after', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Skills */}
            <div className="mt-6 space-y-3">
              <Label>Required Skills</Label>
              <div className="flex flex-wrap gap-2">
                {popularSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant={filters.skills.includes(skill) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="mt-6 flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="has_salary"
                  checked={filters.has_salary}
                  onCheckedChange={(checked) => updateFilter('has_salary', checked)}
                />
                <Label htmlFor="has_salary" className="cursor-pointer">
                  Only show paid opportunities
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={filters.is_featured}
                  onCheckedChange={(checked) => updateFilter('is_featured', checked)}
                />
                <Label htmlFor="is_featured" className="cursor-pointer">
                  Featured only
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
