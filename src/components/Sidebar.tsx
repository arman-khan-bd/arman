import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Briefcase, Users, UserPlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { GithubUser } from '@/types';

type SocialLink = {
  icon: React.ElementType;
  label: string;
  url: string;
};

type SidebarProps = {
  user: GithubUser;
  socialLinks: SocialLink[];
  skills: string[];
};

export function Sidebar({ user, socialLinks, skills }: SidebarProps) {
  return (
    <Card className="h-full border-primary/20 shadow-lg bg-card/50">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <Image
            src={user.avatar_url}
            alt={user.name || user.login}
            width={128}
            height={128}
            className="rounded-full border-4 border-primary/50 shadow-md"
            data-ai-hint="profile picture"
          />
          <h1 className="mt-4 text-3xl font-bold text-primary font-headline">{user.name || user.login}</h1>
          <p className="text-muted-foreground">@{user.login}</p>
          <p className="mt-2 text-center text-sm">{user.bio}</p>

          <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
            {user.location && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {user.location}
              </div>
            )}
            {user.company && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                {user.company}
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-bold">{user.followers}</span> <span className="text-muted-foreground">followers</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold">{user.following}</span> <span className="text-muted-foreground">following</span>
              </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="space-y-6">
            <div>
              <h2 className="mb-3 text-lg font-semibold text-primary font-headline">Socials</h2>
              <div className="flex flex-col space-y-2">
                {socialLinks.map((link) => (
                  <Button asChild key={link.label} variant="ghost" className="justify-start h-8 -mx-2">
                    <Link href={link.url} target="_blank" rel="noopener noreferrer">
                      <link.icon className="mr-2 h-4 w-4" />
                      {link.label}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-lg font-semibold text-primary font-headline">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-sm">{skill}</Badge>
                ))}
              </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
