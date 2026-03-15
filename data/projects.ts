export interface ProjectDetail {
  id: string;
  name: string;
  screenshots: string[];
  techStack: string[];
  longDescription: string;
  description: string;
  repoUrl?: string;
  liveUrl?: string;
}

// This data is no longer used and is kept for type reference.
// Project data is now fetched from Firestore.
export const projectsData: Record<string, ProjectDetail> = {};

export const getProjectDetails = (name: string): ProjectDetail | null => {
  // This function is obsolete. Data is fetched in the component.
  return null;
};
