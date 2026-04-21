import fs from "fs"
import path from "path"
import yaml from "js-yaml"

const SKILLS_DIR = path.join(__dirname, "..", "..", "skills")

export interface ParsedSkill {
  dirName: string
  dirPath: string
  content: string
  rawFrontmatter: string | null
  frontmatter: Record<string, unknown> | null
  body: string
}

export function getSkillsDir(): string {
  return SKILLS_DIR
}

export function listSkillDirs(): string[] {
  return fs.readdirSync(SKILLS_DIR).filter((entry) => {
    const fullPath = path.join(SKILLS_DIR, entry)
    return fs.statSync(fullPath).isDirectory() && !entry.startsWith(".")
  })
}

export function parseSkill(dirName: string): ParsedSkill {
  const dirPath = path.join(SKILLS_DIR, dirName)
  const skillMdPath = path.join(dirPath, "SKILL.md")

  if (!fs.existsSync(skillMdPath)) {
    return { dirName, dirPath, content: "", rawFrontmatter: null, frontmatter: null, body: "" }
  }

  const content = fs.readFileSync(skillMdPath, "utf8")
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)

  if (!match) {
    return { dirName, dirPath, content, rawFrontmatter: null, frontmatter: null, body: content }
  }

  const rawFrontmatter = match[1]
  let frontmatter: Record<string, unknown> | null = null

  try {
    const parsed = yaml.load(rawFrontmatter)
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      frontmatter = parsed as Record<string, unknown>
    }
  } catch {
    frontmatter = null
  }

  const body = content.slice(match[0].length)

  return { dirName, dirPath, content, rawFrontmatter, frontmatter, body }
}

export function skillHasFile(dirName: string, relativePath: string): boolean {
  return fs.existsSync(path.join(SKILLS_DIR, dirName, relativePath))
}

export function readSkillFile(dirName: string, relativePath: string): string {
  return fs.readFileSync(path.join(SKILLS_DIR, dirName, relativePath), "utf8")
}
