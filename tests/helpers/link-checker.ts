import fs from "fs"
import path from "path"

export interface BrokenLink {
  link: string
  text: string
  reason: string
}

/**
 * Extracts relative markdown links from content.
 * Ignores URLs (http/https), anchors-only (#heading), and mailto links.
 */
export function extractRelativeLinks(content: string): Array<{ text: string; link: string }> {
  const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g
  const links: Array<{ text: string; link: string }> = []
  let match: RegExpExecArray | null

  while ((match = linkRegex.exec(content)) !== null) {
    const link = match[2]
    if (link.startsWith("http://") || link.startsWith("https://") || link.startsWith("#") || link.startsWith("mailto:")) {
      continue
    }
    const filePath = link.split("#")[0]
    if (filePath) {
      links.push({ text: match[1], link: filePath })
    }
  }

  return links
}

/**
 * Checks all relative markdown links in a SKILL.md resolve to existing files.
 */
export function findBrokenLinks(skillDir: string, content: string): BrokenLink[] {
  const links = extractRelativeLinks(content)
  const broken: BrokenLink[] = []

  for (const { text, link } of links) {
    const resolved = path.resolve(skillDir, link)

    if (!resolved.startsWith(path.resolve(skillDir))) {
      broken.push({ link, text, reason: `Escapes skill directory via ../` })
      continue
    }

    if (!fs.existsSync(resolved)) {
      broken.push({ link, text, reason: `File not found: ${link}` })
    }
  }

  return broken
}
