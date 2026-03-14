'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating 'About Me' section suggestions.
 *
 * - suggestAboutMeContent - A function that leverages AI to suggest engaging 'About Me' section content.
 * - SuggestAboutMeInput - The input type for the suggestAboutMeContent function.
 * - SuggestAboutMeOutput - The return type for the suggestAboutMeContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GitHubRepoSchema = z.object({
  name: z.string().describe('The name of the GitHub repository.'),
  description: z.string().optional().describe('A brief description of the repository.'),
  url: z.string().url().describe('The URL to the GitHub repository.'),
});

const SuggestAboutMeInputSchema = z.object({
  githubProfileData: z.object({
    avatarUrl: z.string().url().describe('The URL to the user\u0027s GitHub avatar.'),
    name: z.string().describe('The user\u0027s name.'),
    bio: z.string().optional().describe('The user\u0027s GitHub bio.'),
    publicRepos: z.array(GitHubRepoSchema).describe('A list of the user\u0027s public GitHub repositories.'),
  }).describe('Fetched GitHub profile data for the user.'),
  additionalUserInput: z.string().optional().describe('Additional input or preferences from the user for the \u0027About Me\u0027 section.'),
});
export type SuggestAboutMeInput = z.infer<typeof SuggestAboutMeInputSchema>;

const SuggestAboutMeOutputSchema = z.object({
  suggestedAboutMe: z.string().describe('The AI-suggested content for the \u0027About Me\u0027 section.'),
});
export type SuggestAboutMeOutput = z.infer<typeof SuggestAboutMeOutputSchema>;

export async function suggestAboutMeContent(input: SuggestAboutMeInput): Promise<SuggestAboutMeOutput> {
  return aiAboutMeAssistantSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aboutMeAssistantPrompt',
  input: {schema: SuggestAboutMeInputSchema},
  output: {schema: SuggestAboutMeOutputSchema},
  prompt: `You are an AI assistant specialized in writing engaging and personalized 'About Me' sections for developers' online portfolios.

Your task is to generate compelling content for a user's 'About Me' section, drawing primarily from their GitHub profile data and any additional input they provide.

Focus on highlighting their skills, passion for development, and what makes them unique, based on the provided information.

GitHub Profile Data:
Name: {{{githubProfileData.name}}}
{{#if githubProfileData.bio}}
Bio: {{{githubProfileData.bio}}}
{{/if}}
Public Repositories (Name, Description, URL):
{{#if githubProfileData.publicRepos}}
{{#each githubProfileData.publicRepos}}
- Name: {{{name}}}
{{#if description}}  Description: {{{description}}}{{/if}}
  URL: {{{url}}}
{{/each}}
{{else}}
No public repositories provided.
{{/if}}

{{#if additionalUserInput}}
Additional User Input/Preferences:
{{{additionalUserInput}}}
{{/if}}

Based on the above information, generate a professional and engaging 'About Me' section. Ensure it flows well, is concise, and effectively introduces the developer. Format the output as a single string.`,
});

const aiAboutMeAssistantSuggestionFlow = ai.defineFlow(
  {
    name: 'aiAboutMeAssistantSuggestionFlow',
    inputSchema: SuggestAboutMeInputSchema,
    outputSchema: SuggestAboutMeOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
