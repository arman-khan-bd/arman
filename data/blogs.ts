export interface Blog {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO 8601 format
  cover_image: string;
  content: string; // Markdown content
  categories: string[];
  tags: string[];
}

// This data is no longer used and is kept for type reference.
// Blog data is now fetched from Firestore.
export const blogsData: Blog[] = [];

export const getBlogs = (limit?: number) => {
  return [];
};

export const getBlogBySlug = (slug: string): Blog | undefined => {
  return undefined;
};

export const getCategories = (): string[] => {
  return [];
};

export const getTags = (): string[] => {
  return [];
};
