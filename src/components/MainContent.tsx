import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Projects } from './Projects';
import { Experience } from './Experience';
import { Articles } from './Articles';
import { Education } from './Education';
import { About } from './About';
import type { GithubRepo } from '@/types';
import type { SuggestAboutMeInput } from '@/ai/flows/ai-about-me-assistant-suggestion';

type MainContentProps = {
  repos: GithubRepo[];
  workExperience: any[];
  articles: any[];
  education: any[];
  githubProfileData: SuggestAboutMeInput['githubProfileData'];
  initialAboutMe: string;
};

export function MainContent({ repos, workExperience, articles, education, githubProfileData, initialAboutMe }: MainContentProps) {
  return (
    <Tabs defaultValue="about" className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 bg-card/50">
        <TabsTrigger value="about">About Me</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="experience">Experience</TabsTrigger>
        <TabsTrigger value="articles">Articles</TabsTrigger>
        <TabsTrigger value="education">Education</TabsTrigger>
      </TabsList>
      <TabsContent value="about" className="mt-4">
        <About initialAboutMe={initialAboutMe} githubProfileData={githubProfileData} />
      </TabsContent>
      <TabsContent value="projects" className="mt-4">
        <Projects repos={repos} />
      </TabsContent>
      <TabsContent value="experience" className="mt-4">
        <Experience workExperience={workExperience} />
      </TabsContent>
      <TabsContent value="articles" className="mt-4">
        <Articles articles={articles} />
      </TabsContent>
      <TabsContent value="education" className="mt-4">
        <Education education={education} />
      </TabsContent>
    </Tabs>
  );
}
