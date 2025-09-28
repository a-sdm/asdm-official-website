import { BlogPost, BlogSiteTree } from './types';

// Helper function to get route path from blog path
export const getRoutePathFromBlogPath = (blogPath: string): string => {
  // Remove the .md extension
  return blogPath.replace(/\.md$/, '');
};

// Helper function to get blog path from route path
export const getBlogPathFromRoutePath = (routePath: string): string => {
  // Add .md extension if not present
  if (!routePath.endsWith('.md')) {
    return `${routePath}.md`;
  }
  return routePath;
};

// Find blog post by route path
export const findBlogByRoutePath = (routePath: string, blogsList: BlogPost[]): BlogPost | undefined => {
  // Remove leading /blog/ if present
  const normalizedPath = routePath.replace(/^\/blog\//, '');
  
  if (!normalizedPath) {
    // If we're at /blog/, return undefined (show blog list)
    return undefined;
  }
  
  // Try to find exact match
  return blogsList.find(blog => {
    const blogRoutePath = getRoutePathFromBlogPath(blog.path);
    return blogRoutePath === normalizedPath;
  });
};

// Function to load blog post content
export const loadBlogContent = async (
  blog: BlogPost, 
  docRoot: string, 
  updateBlogs: (updater: (prevBlogs: BlogPost[]) => BlogPost[]) => void
): Promise<BlogPost> => {
  // If content is already loaded, return the blog as is
  if (blog.content) {
    return blog;
  }
  
  try {
    const response = await fetch(`${docRoot}/${blog.path}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${blog.path}: ${response.status}`);
    }
    
    const content = await response.text();
    const contentWithoutMetadata = removeMetadata(content);
    
    // Create a new blog object with the content
    const updatedBlog = { ...blog, content: contentWithoutMetadata };
    
    // Update the blog in the blogs array
    updateBlogs(prevBlogs => 
      prevBlogs.map(b => b.path === blog.path ? updatedBlog : b)
    );
    
    return updatedBlog;
  } catch (err) {
    console.error(`Error loading blog content for ${blog.path}:`, err);
    return blog; // Return the original blog without content
  }
};

// Function to parse YAML for blog site tree
export const parseYaml = (yamlText: string): BlogSiteTree => {
  const lines = yamlText.split('\n');
  const result: Record<string, unknown> = {
    docRoot: '',
    documents: []
  };
  const documentArray: Array<Record<string, unknown>> = [];
  let currentObject: Record<string, unknown> | null = null;
  let isInArray = false;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) continue;

    if (trimmedLine.startsWith('- ')) {
      if (currentObject) {
        documentArray.push(currentObject);
      }
      currentObject = {};
      isInArray = true;
      const [key, ...valueParts] = trimmedLine.substring(2).split(':');
      if (valueParts.length > 0) {
        currentObject[key.trim()] = valueParts.join(':').trim().replace(/^"(.*)"$/, '$1');
      }
    } else if (trimmedLine.includes(':')) {
      const [key, ...valueParts] = trimmedLine.split(':');
      const value = valueParts.join(':').trim().replace(/^"(.*)"$/, '$1');
      if (isInArray && currentObject) {
        if (value.startsWith('[') && value.endsWith(']')) {
          currentObject[key.trim()] = value.slice(1, -1).split(',').map(v => v.trim().replace(/^"(.*)"$/, '$1'));
        } else {
          currentObject[key.trim()] = value;
        }
      } else {
        result[key.trim()] = value;
      }
    }
  }

  if (currentObject) {
    documentArray.push(currentObject);
  }
  
  if (isInArray) {
    result.documents = documentArray;
  }

  // Type assertion to ensure we have the required fields
  return {
    docRoot: result.docRoot as string,
    documents: result.documents as BlogSiteTree['documents']
  };
};

// Function to remove metadata from markdown content
export const removeMetadata = (content: string): string => {
  return content.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '');
};

// Function to format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Function to get category color
export const getCategoryColor = (category: string): string => {
  const colors = {
    'Framework': 'bg-yellow-300/10 text-yellow-300 border-yellow-300/20',
    'Best Practices': 'bg-blue-300/10 text-blue-300 border-blue-300/20',
    'Productivity': 'bg-green-300/10 text-green-300 border-green-300/20',
    'Collaboration': 'bg-purple-300/10 text-purple-300 border-purple-300/20',
    'Implementation': 'bg-orange-300/10 text-orange-300 border-orange-300/20'
  };
  return colors[category as keyof typeof colors] || 'bg-gray-300/10 text-gray-300 border-gray-300/20';
};