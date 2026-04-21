import { describe, it, expect } from "vitest"
import { readSkillFile, skillHasFile, extractCodeBlocks, hasBalancedBraces } from "../../helpers"

const SKILL = "using-ui-bundle-salesforce-data"

describe(`${SKILL}: SKILL.md content`, () => {
  const content = readSkillFile(SKILL, "SKILL.md")

  it("description mentions Salesforce record operations", () => {
    expect(content).toMatch(/Salesforce record operation/)
  })

  it("has GraphQL code blocks with balanced braces", () => {
    const blocks = extractCodeBlocks(content, "graphql")
    expect(blocks.length).toBeGreaterThan(0)
    for (const block of blocks) {
      const result = hasBalancedBraces(block.content)
      expect(result.balanced, `block at line ${block.startLine}`).toBe(true)
    }
  })

  it("required assets exist", () => {
    expect(skillHasFile(SKILL, "scripts/graphql-search.sh")).toBe(true)
  })

  // TODO: Add more tests - validate TypeScript code blocks, check non-negotiable rules, etc.
})
