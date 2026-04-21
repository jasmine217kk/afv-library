export interface CodeBlock {
  language: string
  content: string
  startLine: number
}

/**
 * Extracts fenced code blocks from markdown content.
 * Optionally filters by language tag.
 */
export function extractCodeBlocks(markdown: string, language?: string): CodeBlock[] {
  const blocks: CodeBlock[] = []
  const lines = markdown.split("\n")
  let inBlock = false
  let currentLang = ""
  let currentContent: string[] = []
  let blockStart = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (!inBlock && line.match(/^```(\w*)/)) {
      inBlock = true
      currentLang = line.match(/^```(\w*)/)![1] || ""
      currentContent = []
      blockStart = i + 1
    } else if (inBlock && line.trim() === "```") {
      inBlock = false
      if (!language || currentLang.toLowerCase() === language.toLowerCase()) {
        blocks.push({
          language: currentLang,
          content: currentContent.join("\n"),
          startLine: blockStart,
        })
      }
    } else if (inBlock) {
      currentContent.push(line)
    }
  }

  return blocks
}
