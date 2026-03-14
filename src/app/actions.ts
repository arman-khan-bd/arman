'use server';

import { suggestAboutMeContent, SuggestAboutMeInput } from '@/ai/flows/ai-about-me-assistant-suggestion';

export async function generateAboutMeSuggestion(input: SuggestAboutMeInput) {
  try {
    const result = await suggestAboutMeContent(input);
    return { success: true, suggestion: result.suggestedAboutMe };
  } catch (error) {
    console.error('AI suggestion error:', error);
    return { success: false, error: 'Failed to generate suggestion due to a server error.' };
  }
}
