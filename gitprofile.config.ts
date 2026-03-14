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
    linkedin: 'ariful-alam',
    twitter: 'arifszn',
    facebook: '',
    instagram: '',
    dribbble: '',
    behance: '',
    medium: '',
    dev: '',
    website: 'https://arifszn.com',
    phone: '',
    email: 'arifulalamszn@gmail.com',
  },
  resume: {
    fileUrl: '', // Empty fileUrl will hide the resume button
  },
  skills: [
    'PHP',
    'Laravel',
    'JavaScript',
    'React.js',
    'Node.js',
    'MySQL',
    'Git',
    'Docker',
    'PHPUnit',
    'CSS',
    'Ant Design',
    'Tailwind',
  ],
  experiences: [
    {
      company: 'Company Name',
      position: 'Position',
      from: 'September 2021',
      to: 'Present',
      companyLink: 'https://example.com',
    },
    {
      company: 'Company Name',
      position: 'Position',
      from: 'July 2019',
      to: 'August 2021',
      companyLink: 'https://example.com',
    },
  ],
  educations: [
    {
      institution: 'Institution Name',
      degree: 'Degree',
      from: '2015',
      to: '2019',
    },
    {
      institution: 'Institution Name',
      degree: 'Degree',
      from: '2012',
      to: '2014',
    },
  ],
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
    disableSwitch: false,
    // Should use the user's system theme as the default theme
    respectPrefersColorScheme: false,
    // Hide the theme switcher
    hideThemeSwitch: false,
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
