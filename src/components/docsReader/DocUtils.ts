import { DocFile, SiteTree, DocMenuItem } from './types';

// Helper function to get route path from document path
export const getRoutePathFromDocPath = (docPath: string): string => {
  // If the path ends with _index.md, remove the filename and just use the directory
  if (docPath.endsWith('/_index.md') || docPath.endsWith('\\_index.md')) {
    const parts = docPath.split('/');
    parts.pop(); // Remove _index.md
    return parts.join('/');
  }
  
  // Otherwise, remove the .md extension
  return docPath.replace(/\.md$/, '');
};

// Helper function to get document path from route path
export const getDocPathFromRoutePath = (routePath: string): string => {
  // If the path doesn't have an extension, check if it's a directory (might need _index.md)
  if (!routePath.endsWith('.md')) {
    // Try with _index.md first
    return `${routePath}/_index.md`;
  }
  return routePath;
};

// Find document by route path
export const findDocByRoutePath = (routePath: string, docsList: DocFile[]): DocFile | undefined => {
  // Remove leading /docs/ if present
  const normalizedPath = routePath.replace(/^\/docs\//, '');
  
  if (!normalizedPath) {
    // If we're at /docs/, find the first document in the menu tree
    return docsList[0]; // Fallback to first doc
  }
  
  // Try to find exact match first
  let doc = docsList.find(doc => {
    const docRoutePath = getRoutePathFromDocPath(doc.path);
    return docRoutePath === normalizedPath;
  });
  
  // If not found, try with _index.md
  if (!doc) {
    doc = docsList.find(doc => doc.path === `${normalizedPath}/_index.md`);
  }
  
  // If still not found, try without _index.md
  if (!doc && normalizedPath.endsWith('/_index')) {
    const pathWithoutIndex = normalizedPath.replace('/_index', '');
    doc = docsList.find(doc => {
      const docRoutePath = getRoutePathFromDocPath(doc.path);
      return docRoutePath === pathWithoutIndex;
    });
  }
  
  return doc;
};

// Function to load document content
export const loadDocumentContent = async (
  doc: DocFile, 
  docRoot: string, 
  updateDocs: (updater: (prevDocs: DocFile[]) => DocFile[]) => void
): Promise<DocFile> => {
  // If content is already loaded, return the doc as is
  if (doc.content) {
    return doc;
  }
  
  try {
    const response = await fetch(`${docRoot}/${doc.path}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${doc.path}: ${response.status}`);
    }
    
    const content = await response.text();
    const contentWithoutMetadata = removeMetadata(content);
    
    // Create a new doc object with the content
    const updatedDoc = { ...doc, content: contentWithoutMetadata };
    
    // Update the doc in the docs array
    updateDocs(prevDocs => 
      prevDocs.map(d => d.path === doc.path ? updatedDoc : d)
    );
    
    return updatedDoc;
  } catch (err) {
    console.error(`Error loading document content for ${doc.path}:`, err);
    return doc; // Return the original doc without content
  }
};

// Function to parse YAML
export const parseYaml = (yamlText: string): SiteTree => {
  const lines = yamlText.split('\n');
  const result: Record<string, unknown> = {
    docRoot: '',
    documents: []
  };
  const documentArray: Array<Record<string, unknown>> = [];
  let currentObject: Record<string, unknown> | null = null;
  let isInArray = false;
  let currentSection = '';
  
  // For menu tree parsing
  const menuTree: DocMenuItem[] = [];
  let currentParent: DocMenuItem | null = null;
  let inChildrenSection = false;
  let lastChildItem: DocMenuItem | null = null;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) continue;

    // Handle menu-tree section
    if (trimmedLine === 'menu-tree:') {
      currentSection = 'menu-tree';
      continue;
    }

    if (currentSection === 'menu-tree') {
      // Handle top-level menu items
      if (line.startsWith('  - path:')) {
        const path = trimmedLine.substring(7).trim();
        currentParent = { path };
        menuTree.push(currentParent);
        inChildrenSection = false;
        continue;
      }
      
      // Handle menu-title for top-level items
      if (line.startsWith('    menu-title:')) {
        if (currentParent) {
          // Extract the menu title value after the colon, removing quotes if present
          const colonIndex = trimmedLine.indexOf(':');
          if (colonIndex !== -1) {
            let menuTitle = trimmedLine.substring(colonIndex + 1).trim();
            // Remove surrounding quotes if present
            menuTitle = menuTitle.replace(/^"(.*)"$/, '$1');
            currentParent["menu-title"] = menuTitle;
          }
        }
        continue;
      }
      
      // Handle children section
      if (line.startsWith('    children:')) {
        inChildrenSection = true;
        if (currentParent && !currentParent.children) {
          currentParent.children = [];
        }
        continue;
      }
      
      // Handle child items
      if (inChildrenSection && line.startsWith('      - path:')) {
        const path = trimmedLine.substring(7).trim();
        if (currentParent && currentParent.children) {
          lastChildItem = { path };
          currentParent.children.push(lastChildItem);
        }
        continue;
      }
      
      // Handle menu-title for child items
      if (inChildrenSection && line.startsWith('        menu-title:')) {
        if (lastChildItem) {
          // Extract the menu title value after the colon, removing quotes if present
          const colonIndex = trimmedLine.indexOf(':');
          if (colonIndex !== -1) {
            let menuTitle = trimmedLine.substring(colonIndex + 1).trim();
            // Remove surrounding quotes if present
            menuTitle = menuTitle.replace(/^"(.*)"$/, '$1');
            lastChildItem["menu-title"] = menuTitle;
          }
        }
        continue;
      }
      
      // Exit menu-tree section
      if (trimmedLine.startsWith('documents:')) {
        currentSection = 'documents';
        isInArray = false;
        continue;
      }
    }

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
          currentObject[key.trim()] = value.slice(1, -1).split(',').map(v => v.trim());
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
  
  if (menuTree.length > 0) {
    result['menu-tree'] = menuTree;
  }

  // Type assertion to ensure we have the required fields
  return {
    docRoot: result.docRoot as string,
    documents: result.documents as SiteTree['documents'],
    "menu-tree": result['menu-tree'] as DocMenuItem[] | undefined
  };
};

// Function to remove metadata from markdown content
export const removeMetadata = (content: string): string => {
  return content.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '');
};

// Function to find and expand parent menu items
export const findAndExpandParents = (
  items: DocMenuItem[], 
  targetPath: string, 
  expandParentPaths: Set<string>
): boolean => {
  for (const item of items) {
    if (item.path === targetPath) {
      return true;
    }
    
    if (item.children && item.children.length > 0) {
      if (findAndExpandParents(item.children, targetPath, expandParentPaths)) {
        expandParentPaths.add(item.path);
        return true;
      }
    }
  }
  return false;
};