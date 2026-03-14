export interface Blog {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO 8601 format
  cover_image: string;
  content: string; // Markdown content
}

export const blogsData: Blog[] = [
  {
    slug: 'understanding-mcp',
    title: 'Understanding Model Context Protocol (MCP): Bridging LLMs and the Real World',
    description: 'Large language models are increasingly embedded into developer tools, products, and workflows—but...',
    date: '2026-02-19T10:00:00Z',
    cover_image: 'https://picsum.photos/seed/blog1/1200/800',
    content: `
## Introduction

Large language models (LLMs) are powerful, but they exist in a bubble. They lack direct access to the real-world context of your files, applications, and workflows. Model Context Protocol (MCP) is an emerging standard designed to bridge this gap, providing a structured way for LLMs to interact with your local environment securely and efficiently.

## How it Works

MCP defines a schema for representing your project's context—files, symbols, and even runtime information. An MCP server runs alongside your development tools, gathering this context and exposing it through a secure API that LLMs can query.

### Core Components:
- **MCP Server:** A local server that indexes your project and serves context data.
- **Context Providers:** Plugins that extract specific types of information (e.g., file system, Git history, language symbols).
- **LLM Agent:** The AI assistant that consumes MCP data to provide more accurate and context-aware responses.

## Benefits

- **Improved Accuracy:** LLMs can answer questions and generate code based on the actual state of your project.
- **Enhanced Security:** Context is provided on-demand without exposing your entire file system to a remote service.
- **Deeper Integration:** Enables new classes of AI-powered developer tools that are deeply integrated into your workflow.

Stay tuned as MCP continues to evolve and unlock new possibilities for AI-assisted development.
    `,
  },
  {
    slug: 'git-worktrees',
    title: 'Git Worktrees: The Power Behind Cursor’s Parallel Agents',
    description: 'Cursor just shipped Parallel Agents, a way to run multiple agents on different tasks at the same...',
    date: '2025-11-07T10:00:00Z',
    cover_image: 'https://picsum.photos/seed/blog2/1200/800',
    content: `
## The Challenge of Parallel Work

When you need to work on multiple features or bugfixes simultaneously, managing different branches can become cumbersome. Stashing changes, switching branches, and resolving conflicts introduces friction.

## Enter Git Worktrees

\`git worktree\` is a powerful, underutilized Git command that allows you to check out multiple branches in different directories, all linked to the same repository. Each worktree has its own working copy of the files, but they share the underlying \`.git\` database.

### Example Usage:

\`\`\`bash
# Create a new worktree for a feature branch
git worktree add ../hotfix-feature hotfix

# Work in the new directory
cd ../hotfix-feature
# ... make changes, commit ...

# When done, remove the worktree
git worktree remove ../hotfix-feature
\`\`\`

This is the core technology that enables features like Cursor's Parallel Agents, allowing multiple AI agents to work on different parts of a codebase concurrently without interfering with each other. It's a game-changer for both human and AI developers.
    `,
  },
  {
    slug: 'gitflow-branching',
    title: 'Gitflow: Streamlined Branching and Release Management for Teams',
    description: 'Modern software teams rarely push code directly to the main branch. As projects grow, a clear...',
    date: '2025-08-25T10:00:00Z',
    cover_image: 'https://picsum.photos/seed/blog3/1200/800',
    content: `
## What is Gitflow?

Gitflow is a branching model for Git that prescribes a set of strict branch roles and defines how they should interact. It was designed to help teams manage complex projects with scheduled release cycles.

### The Core Branches:

- **\`main\` (or \`master\`):** This branch contains production-ready code. Its history is a series of tagged releases.
- **\`develop\`:** This is the main development branch where all completed features are integrated. It reflects the latest delivered development changes for the next release.

### Supporting Branches:

- **Feature Branches (\`feature/*\`):** Branched from \`develop\`. Used for developing new features. Merged back into \`develop\`.
- **Release Branches (\`release/*\`):** Branched from \`develop\`. Used for preparing a new production release. Allows for last-minute bug fixes. Merged into both \`main\` and \`develop\`.
- **Hotfix Branches (\`hotfix/*\`):** Branched from \`main\`. Used to quickly patch a critical bug in production. Merged into both \`main\` and \`develop\`.

While simpler models like GitHub Flow have become popular for projects with continuous deployment, Gitflow remains a robust and reliable strategy for projects with a more traditional release schedule.
    `,
  },
  {
    slug: 'api-rate-limiting',
    title: 'Prevent API Overload: A Comprehensive Guide to Rate Limiting with Bottleneck',
    description: 'In the realm of modern web development, APIs have become the lifeblood of our applications. They...',
    date: '2024-05-13T10:00:00Z',
    cover_image: 'https://picsum.photos/seed/blog4/1200/800',
    content: `
Content for API Rate Limiting blog post.
    `,
  },
  {
    slug: 'git-rebase-vs-merge',
    title: 'Git Rebase vs Git Merge: A Comprehensive Guide',
    description: 'Git, a distributed version control system, offers a variety of ways developers can integrate changes...',
    date: '2024-01-04T10:00:00Z',
    cover_image: 'https://picsum.photos/seed/blog5/1200/800',
    content: `
Content for Git Rebase vs Merge blog post.
    `,
  },
  {
    slug: 'localstack-mock-aws',
    title: 'LocalStack - Mock AWS in local development',
    description: 'Most of us are familiar with Amazon Web Services (AWS) and have probably used their cloud computing...',
    date: '2023-10-11T10:00:00Z',
    cover_image: 'https://picsum.photos/seed/blog6/1200/800',
    content: `
Content for LocalStack blog post.
    `,
  },
];

export const getBlogs = (limit?: number) => {
  const sortedBlogs = blogsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  if (limit) {
    return sortedBlogs.slice(0, limit);
  }
  return sortedBlogs;
};


export const getBlogBySlug = (slug: string): Blog | undefined => {
  return blogsData.find((blog) => blog.slug === slug);
};
