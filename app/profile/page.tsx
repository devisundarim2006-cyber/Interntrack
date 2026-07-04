'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import {
  User,
  Mail,
  Github,
  Linkedin,
  Globe,
  Upload,
  Plus,
  X,
  Save,
  Loader2,
  Briefcase,
  MapPin,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';

const popularSkills = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'Go', 'Rust',
  'Machine Learning', 'Data Science', 'AWS', 'Docker', 'Kubernetes', 'GraphQL',
  'Next.js', 'Vue.js', 'Angular', 'Swift', 'Kotlin', 'SQL', 'MongoDB', 'PostgreSQL',
];

const roles = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'DevOps Engineer', 'Data Scientist', 'Machine Learning Engineer', 'Product Manager',
  'UI/UX Designer', 'Mobile Developer', 'Cloud Engineer', 'Security Engineer',
];

const locations = [
  'Remote', 'New York, NY', 'San Francisco, CA', 'Seattle, WA', 'Austin, TX',
  'London, UK', 'Berlin, DE', 'Toronto, CA', 'Singapore', 'Sydney, AU',
];

export default function ProfilePage() {
  const { user, profile, loading: authLoading, updateProfile } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    github_url: '',
    linkedin_url: '',
    portfolio_url: '',
    skills: [] as string[],
    preferred_roles: [] as string[],
    preferred_locations: [] as string[],
    experience_level: 'entry',
  });
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        github_url: profile.github_url || '',
        linkedin_url: profile.linkedin_url || '',
        portfolio_url: profile.portfolio_url || '',
        skills: profile.skills || [],
        preferred_roles: profile.preferred_roles || [],
        preferred_locations: profile.preferred_locations || [],
        experience_level: profile.experience_level || 'entry',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateProfile(formData);
    setSaving(false);

    if (error) {
      toast.error('Failed to save profile');
    } else {
      toast.success('Profile updated successfully');
    }
  };

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
    setNewSkill('');
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) });
  };

  const toggleRole = (role: string) => {
    const newRoles = formData.preferred_roles.includes(role)
      ? formData.preferred_roles.filter((r) => r !== role)
      : [...formData.preferred_roles, role];
    setFormData({ ...formData, preferred_roles: newRoles });
  };

  const toggleLocation = (location: string) => {
    const newLocations = formData.preferred_locations.includes(location)
      ? formData.preferred_locations.filter((l) => l !== location)
      : [...formData.preferred_locations, location];
    setFormData({ ...formData, preferred_locations: newLocations });
  };

  if (authLoading || !user || !profile) {
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
        <div className="container py-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your profile and preferences</p>
          </div>

          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>Your public profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={profile.email} disabled className="bg-muted" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub URL</Label>
                    <div className="relative">
                      <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="github"
                        value={formData.github_url}
                        onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                        placeholder="https://github.com/username"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="linkedin"
                        value={formData.linkedin_url}
                        onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                        placeholder="https://linkedin.com/in/username"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio URL</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="portfolio"
                        value={formData.portfolio_url}
                        onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                        placeholder="https://yourwebsite.com"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Skills
                </CardTitle>
                <CardDescription>Add skills to get better recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="gap-1">
                      {skill}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill(newSkill);
                      }
                    }}
                  />
                  <Button variant="outline" onClick={() => addSkill(newSkill)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Popular skills</Label>
                  <div className="flex flex-wrap gap-2">
                    {popularSkills.filter((s) => !formData.skills.includes(s)).slice(0, 12).map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => addSkill(skill)}
                      >
                        + {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Preferences
                </CardTitle>
                <CardDescription>Your preferred roles and locations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Preferred Roles</Label>
                    <div className="flex flex-wrap gap-2">
                      {roles.map((role) => (
                        <Badge
                          key={role}
                          variant={formData.preferred_roles.includes(role) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => toggleRole(role)}
                        >
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">Preferred Locations</Label>
                    <div className="flex flex-wrap gap-2">
                      {locations.map((loc) => (
                        <Badge
                          key={loc}
                          variant={formData.preferred_locations.includes(loc) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => toggleLocation(loc)}
                        >
                          {loc}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience Level</Label>
                    <select
                      id="experience"
                      value={formData.experience_level}
                      onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                      className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="entry">Entry Level</option>
                      <option value="mid">Mid Level</option>
                      <option value="senior">Senior Level</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resume */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Resume
                </CardTitle>
                <CardDescription>Upload your resume for AI-powered recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                {profile.resume_url ? (
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Resume uploaded</p>
                        <p className="text-sm text-muted-foreground">Last updated</p>
                      </div>
                    </div>
                    <Button variant="outline">Replace</Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">Upload your resume (PDF, DOCX)</p>
                    <Button variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Choose File
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button className="gradient-blue" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
