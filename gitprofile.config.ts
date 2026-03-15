export const gitprofileConfig = {
  github: {
    username: 'arifszn', // Your GitHub username
    sortBy: 'stars', // stars | updated
    limit: 8, // How many projects to display
    exclude: {
      forks: false, // Forked projects will not be displayed if set to true
      projects: [] as string[], // These projects will not be displayed. example: ['my-project1', 'my-project2']
    },
  },
  social: {
    linkedin: '',
    twitter: '',
    facebook: '',
    instagram: '',
    dribbble: '',
    behance: '',
    medium: '',
    dev: '',
    website: 'https://armankhan.me',
    phone: '+11234567890',
    email: 'contact@armanalikhan.com',
  },
  resume: {
    fileUrl: '', // Empty fileUrl will hide the resume button
  },
  skills: [
    'JavaScript',
    'TypeScript',
    'React.js',
    'Next.js',
    'Node.js',
    'Express.js',
    'MongoDB',
    'PostgreSQL',
    'Docker',
    'Git',
    'Tailwind CSS',
    'GraphQL',
  ],
  experiences: [
    {
      company: 'Tech Solutions Inc.',
      position: 'Full Stack Developer',
      from: '2021',
      to: 'Present',
      companyLink: '#',
    },
    {
      company: 'Web Innovations',
      position: 'Jr. Frontend Developer',
      from: '2019',
      to: '2021',
      companyLink: '#',
    },
  ],
  educations: [
    {
      institution: 'University of Coding',
      degree: 'B.Sc in Computer Science',
      from: '2015',
      to: '2019',
    },
  ],
  cloudinary: {
    cloudName: 'dcckbmhft',
    uploadPreset: 'personal',
  },
  googleAnalytics: {
    id: '', // GA3812918895
  },
  // Hotjar tracking id (Optional)
  hotjar: {
    id: '',
    snippetVersion: 6,
  },
  themeConfig: {
    defaultTheme: 'lofi',
    // Hides the switch finger icon that appears on the bottom right corner
    disableSwitch: true,
    // Should use the user's system theme as the default theme
    respectPrefersColorScheme: true,
    // Hide the theme switcher
    hideThemeSwitch: true,
    // Custom themes
    themes: [
      'light',
      'dark',
      'cupcake',
      'bumblebee',
      'emerald',
      'corporate',
      'synthwave',
      'retro',
      'cyberpunk',
      'valentine',
      'halloween',
      'garden',
      'forest',
      'aqua',
      'lofi',
      'pastel',
      'fantasy',
      'wireframe',
      'black',
      'luxury',
      'dracula',
      'cmyk',
      'autumn',
      'business',
      'acid',
      'lemonade',
      'night',
      'coffee',
      'winter',
      'procyon',
    ],
  },
};
