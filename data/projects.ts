export interface ProjectDetail {
  name: string;
  screenshots: string[];
  techStack: string[];
  daysToBuild: number;
  features: {
    current: string[];
    future: string[];
  };
  longDescription: string;
}

export const projectsData: Record<string, ProjectDetail> = {
  // Example data - users can add their project names here as keys
  'default': {
    name: 'Project Name',
    screenshots: [
      'https://picsum.photos/seed/project1/1200/800',
      'https://picsum.photos/seed/project2/1200/800',
      'https://picsum.photos/seed/project3/1200/800',
    ],
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    daysToBuild: 14,
    features: {
      current: [
        'Responsive Design',
        'Dark Mode Support',
        'GitHub API Integration',
        'Dynamic Theming',
      ],
      future: [
        'User Authentication',
        'Database Integration',
        'Real-time Notifications',
      ],
    },
    longDescription: 'This is a comprehensive project built with modern web technologies. It focuses on performance, accessibility, and user experience.',
  }
};

export const getProjectDetails = (name: string): ProjectDetail => {
  return projectsData[name] || {
    ...projectsData['default'],
    name: name,
  };
};
