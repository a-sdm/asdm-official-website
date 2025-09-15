export interface DocFile {
  name: string;
  path: string;
  content?: string; // Content is optional now, will be loaded on demand
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  lastUpdated?: string;
  created?: string;
  updated?: string;
  author?: string;
  weight?: number;
}

export interface DocMenuItem {
  path: string;
  "menu-title"?: string;
  children?: DocMenuItem[];
}

export interface SiteTree {
  docRoot: string;
  documents: Array<{
    title: string;
    path: string;
    description?: string;
    category?: string;
    tags?: string[];
    lastUpdated?: string;
    created?: string;
    updated?: string;
    author?: string;
    weight?: number;
  }>;
  "menu-tree"?: DocMenuItem[];
}