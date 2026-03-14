"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';
import { generateAboutMeSuggestion } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
import type { SuggestAboutMeInput } from '@/ai/flows/ai-about-me-assistant-suggestion';

type AiAboutMeDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  githubProfileData: SuggestAboutMeInput['githubProfileData'];
  onSuggestion: (suggestion: string) => void;
};

export function AiAboutMeDialog({ isOpen, setIsOpen, githubProfileData, onSuggestion }: AiAboutMeDialogProps) {
  const [additionalInput, setAdditionalInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    setSuggestion('');
    const result = await generateAboutMeSuggestion({
      githubProfileData,
      additionalUserInput: additionalInput,
    });
    setIsLoading(false);
    if (result.success && result.suggestion) {
      setSuggestion(result.suggestion);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "An unknown error occurred.",
      });
    }
  };

  const handleApply = () => {
    onSuggestion(suggestion);
    setIsOpen(false);
    // Reset state for next time
    setTimeout(() => {
        setSuggestion('');
        setAdditionalInput('');
    }, 300);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline">
            <Sparkles className="text-accent" /> AI About Me Assistant
          </DialogTitle>
          <DialogDescription>
            Get an AI-powered suggestion for your 'About Me' section based on your GitHub profile and any extra details you provide.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Add any extra details, interests, or skills you'd like to highlight..."
            value={additionalInput}
            onChange={(e) => setAdditionalInput(e.target.value)}
            rows={4}
          />
          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate Suggestion
          </Button>

          {suggestion && (
            <div className="space-y-2">
              <h4 className="font-medium">Suggestion:</h4>
              <div className="rounded-md border bg-muted/50 p-4 text-sm whitespace-pre-wrap max-h-60 overflow-y-auto">
                {suggestion}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          {suggestion && (
            <Button onClick={handleApply}>Apply Suggestion</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
