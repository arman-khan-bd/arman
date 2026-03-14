import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, GitFork, ExternalLink } from 'lucide-react';
import type { GithubRepo } from '@/types';

export function Projects({ repos }: { repos: GithubRepo[] }) {
  const sortedRepos = repos
    .filter(repo => repo.description) // only show repos with description
    .sort((a, b) => b.stargazers_count - a.stargazers_count);

  return (
    <Card className="shadow-lg bg-card/50">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Projects</CardTitle>
        <CardDescription>My most starred public repositories on GitHub.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sortedRepos.map((repo) => (
            <Card key={repo.id} className="flex flex-col justify-between transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg">
                  <Link href={repo.html_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-accent">
                    {repo.name} <ExternalLink className="h-4 w-4 shrink-0" />
                  </Link>
                </CardTitle>
                <CardDescription className="text-sm">{repo.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex-wrap gap-2 text-sm">
                {repo.language && <Badge variant="secondary">{repo.language}</Badge>}
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Star className="h-4 w-4" />
                  {repo.stargazers_count}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <GitFork className="h-4 w-4" />
                  {repo.forks_count}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
