import {
  Github,
  Twitter,
  Linkedin,
  Mail,
} from 'lucide-react';

export const GITHUB_USERNAME = 'gaearon';

export const ABOUT_ME_TEXT = `I'm a software developer who loves building useful things. I co-created Redux and Create React App, and now I work on the React team at Meta. I'm passionate about making software development more accessible and enjoyable for everyone. My focus is on creating great user experiences and developer tools.`;

export const socialLinks = [
  {
    icon: Github,
    label: 'GitHub',
    url: `https://github.com/${GITHUB_USERNAME}`,
  },
  {
    icon: Twitter,
    label: 'Twitter',
    url: 'https://twitter.com/dan_abramov',
  },
];

export const skills = [
  'JavaScript',
  'React',
  'Redux',
  'Node.js',
  'Jest',
  'Webpack',
  'Babel',
  'GraphQL',
  'TypeScript',
  'CSS-in-JS',
];

export const workExperience = [
  {
    company: 'Meta',
    role: 'Software Engineer',
    duration: '2016 - Present',
    description: 'Working on the React Core team, improving the library and its ecosystem. Co-created Redux and Create React App.',
  },
  {
    company: 'Freelance',
    role: 'Frontend Developer',
    duration: '2014 - 2016',
    description: 'Built and maintained web applications for various clients, focusing on React and its ecosystem.',
  },
];

export const articles = [
  {
    title: 'On let vs const',
    description: 'A deep dive into block-scoped variable declarations in JavaScript.',
    url: 'https://overreacted.io/on-let-vs-const/',
  },
  {
    title: 'The WET Codebase',
    description: "Exploring the downsides of 'Don't Repeat Yourself' as a strict dogma.",
    url: 'https://overreacted.io/the-wet-codebase/',
  },
  {
    title: 'Goodbye, Clean Code',
    description: 'My thoughts on the Clean Code philosophy and its pitfalls.',
    url: 'https://overreacted.io/goodbye-clean-code/',
  },
];

export const education = [
    {
        school: 'State University of Information and Communication Technologies',
        degree: 'Computer Software Engineering',
        duration: '2009 - 2013'
    }
];
