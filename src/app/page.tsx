import { Sidebar } from '@/components/Sidebar';
import { MainContent } from '@/components/MainContent';
import { GITHUB_USERNAME, socialLinks, skills, workExperience, articles, education, ABOUT_ME_TEXT } from '@/lib/portfolio-data';
import type { GithubUser, GithubRepo } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

async function getGithubUser(username: string): Promise<GithubUser | null> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: process.env.GITHUB_TOKEN ? `token ${process.env.GITHUB_TOKEN}`: '',
      },
      next: {
        revalidate: 3600, // Revalidate once per hour
      },
    });
    if (!response.ok) {
       console.error(`Failed to fetch GitHub user: ${response.statusText}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch GitHub user:', error);
    return null;
  }
}

async function getGithubRepos(username: string): Promise<GithubRepo[]> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: process.env.GITHUB_TOKEN ? `token ${process.env.GITHUB_TOKEN}`: '',
      },
      next: {
        revalidate: 3600,
      },
    });
    if (!response.ok) {
       console.error(`Failed to fetch GitHub repos: ${response.statusText}`);
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch GitHub repos:', error);
    return [];
  }
}

export default async function Home() {
  const user = await getGithubUser(GITHUB_USERNAME);
  const repos = await getGithubRepos(GITHUB_USERNAME);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground p-4">
        <Alert variant="destructive" className="max-w-lg">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error Fetching GitHub Data</AlertTitle>
          <AlertDescription>
            Could not fetch the GitHub user. Please check the username in <code>src/lib/portfolio-data.ts</code> and ensure you have a stable internet connection. If you are rate-limited by the GitHub API, you may need to add a GITHUB_TOKEN to your environment variables.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const githubProfileData = {
    avatarUrl: user.avatar_url,
    name: user.name || user.login,
    bio: user.bio,
    publicRepos: repos.map(repo => ({
      name: repo.name,
      description: repo.description ?? undefined,
      url: repo.html_url,
    }))
  };

  return (
    <main className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="w-full md:w-1/3 lg:w-1/4">
          <Sidebar user={user} socialLinks={socialLinks} skills={skills} />
        </aside>
        <div className="w-full md:w-2/3 lg:w-3/4">
          <MainContent
            repos={repos}
            workExperience={workExperience}
            articles={articles}
            education={education}
            githubProfileData={githubProfileData}
            initialAboutMe={ABOUT_ME_TEXT}
          />
        </div>
      </div>
    </main>
  );
}
