/**
 * Lightweight XML well-formedness check.
 * Verifies the string looks like valid XML by checking:
 * - Has an opening tag
 * - All opened tags are closed (or self-closing)
 * - No obvious structural errors
 *
 * For a full XML parse, use DOMParser or a library.
 * This is sufficient for catching common template corruption.
 */
export function isWellFormedXml(xml: string): { valid: boolean; error?: string } {
  const trimmed = xml.trim()

  if (!trimmed.startsWith("<")) {
    return { valid: false, error: "Does not start with <" }
  }

  const stripped = trimmed.replace(/<!--[\s\S]*?-->/g, "")

  const tagStack: string[] = []
  const tagRegex = /<\/?([a-zA-Z_][\w:.-]*)[^>]*?\/?>/g
  let match: RegExpExecArray | null

  while ((match = tagRegex.exec(stripped)) !== null) {
    const fullMatch = match[0]
    const tagName = match[1]

    if (fullMatch.startsWith("<?") || fullMatch.startsWith("<!")) {
      continue
    }

    if (fullMatch.endsWith("/>")) {
      continue
    }

    if (fullMatch.startsWith("</")) {
      if (tagStack.length === 0) {
        return { valid: false, error: `Closing tag </${tagName}> without matching open tag` }
      }
      const expected = tagStack.pop()
      if (expected !== tagName) {
        return { valid: false, error: `Expected closing tag </${expected}>, found </${tagName}>` }
      }
    } else {
      tagStack.push(tagName)
    }
  }

  if (tagStack.length > 0) {
    return { valid: false, error: `Unclosed tags: ${tagStack.join(", ")}` }
  }

  return { valid: true }
}
