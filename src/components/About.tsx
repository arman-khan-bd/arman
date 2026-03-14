"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AiAboutMeDialog } from './AiAboutMeDialog';
import { Edit, Save, Sparkles, X } from 'lucide-react';
import type { SuggestAboutMeInput } from '@/ai/flows/ai-about-me-assistant-suggestion';

type AboutProps = {
  initialAboutMe: string;
  githubProfileData: SuggestAboutMeInput['githubProfileData'];
};

export function About({ initialAboutMe, githubProfileData }: AboutProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [aboutMe, setAboutMe] = useState(initialAboutMe);
  const [editedAboutMe, setEditedAboutMe] = useState(initialAboutMe);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);

  const handleSave = () => {
    setAboutMe(editedAboutMe);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedAboutMe(aboutMe);
    setIsEditing(false);
  };
  
  const handleSuggestion = (suggestion: string) => {
    setEditedAboutMe(suggestion);
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  return (
    <Card className="shadow-lg bg-card/50">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="font-headline text-2xl text-primary">About Me</CardTitle>
          <CardDescription>A little bit about my journey.</CardDescription>
        </div>
        <div className="flex flex-shrink-0 gap-2">
          {!isEditing && (
            <Button variant="outline" size="icon" onClick={() => { setIsEditing(true); setEditedAboutMe(aboutMe); }}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          )}
          <Button variant="outline" size="icon" onClick={() => setIsAiDialogOpen(true)}>
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="sr-only">Generate with AI</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={editedAboutMe}
              onChange={(e) => setEditedAboutMe(e.target.value)}
              rows={8}
              className="text-base leading-relaxed"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" /> Save
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-base leading-relaxed whitespace-pre-wrap">{aboutMe}</p>
        )}
      </CardContent>
      <AiAboutMeDialog
        isOpen={isAiDialogOpen}
        setIsOpen={setIsAiDialogOpen}
        githubProfileData={githubProfileData}
        onSuggestion={handleSuggestion}
      />
    </Card>
  );
}
