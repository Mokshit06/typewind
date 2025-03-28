import { transformBabel } from './transform';

/**
 * Rspack loader for Typewind
 * This loader transforms Typewind expressions into Tailwind CSS classes
 */
export default function typewindRspackLoader(
  this: any,
  content: string,
  map?: any,
  meta?: any
) {
  const resourcePath = this.resourcePath;
  const ext = resourcePath.split('.').pop() || '';
  
  if (!['js', 'jsx', 'ts', 'tsx'].includes(ext)) {
    return content;
  }

  try {
    const result = transformBabel(ext, content);
    
    return result;
  } catch (error) {
    this.emitError(error instanceof Error ? error : new Error(String(error)));
    return content;
  }
}
