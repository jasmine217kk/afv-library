/**
 * Lightweight structural checks for Apex .cls files.
 * These do NOT compile Apex — they verify basic structural integrity
 * via string matching. Sufficient for catching template corruption.
 */

export function hasClassOrInterfaceDeclaration(content: string): boolean {
  return /\b(class|interface)\s+[\w{}\[\]]+/.test(content)
}

export function hasBalancedBraces(content: string): { balanced: boolean; open: number; close: number } {
  const open = (content.match(/{/g) || []).length
  const close = (content.match(/}/g) || []).length
  return { balanced: open === close, open, close }
}

export function containsAnnotation(content: string, annotation: string): boolean {
  return content.includes(annotation)
}

export function containsKeyword(content: string, keyword: string): boolean {
  return new RegExp(`\\b${keyword}\\b`).test(content)
}

export function hasApexDoc(content: string): boolean {
  return content.includes("@param") || content.includes("@return") || content.includes("@description")
}
