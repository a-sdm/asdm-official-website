export interface BlogPost {
  title: string;
  path: string;
  content?: string; // Content is optional, will be loaded on demand
  description?: string;
  category?: string;
  author?: string;
  date?: string;
  readTime?: string;
  tags?: string[];
  icon?: string;
}

export interface BlogSiteTree {
  docRoot: string;
  documents: Array<{
    title: string;
    path: string;
    description?: string;
    category?: string;
    author?: string;
    date?: string;
    readTime?: string;
    tags?: string[];
    icon?: string;
  }>;
}