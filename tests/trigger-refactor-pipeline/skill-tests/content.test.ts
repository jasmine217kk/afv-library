import { describe, it, expect } from "vitest"
import { readSkillFile, skillHasFile, extractCodeBlocks, hasBalancedBraces } from "../../helpers"

const SKILL = "trigger-refactor-pipeline"

describe(`${SKILL}: SKILL.md content`, () => {
  const content = readSkillFile(SKILL, "SKILL.md")

  it("declares Python 3.9+ compatibility", () => {
    expect(content).toMatch(/compatibility:.*Python 3\.9/)
  })

  it("has Apex code blocks with balanced braces", () => {
    const blocks = extractCodeBlocks(content, "apex")
    expect(blocks.length).toBeGreaterThan(0)
    for (const block of blocks) {
      const result = hasBalancedBraces(block.content)
      expect(result.balanced, `block at line ${block.startLine}`).toBe(true)
    }
  })

  it("required assets exist", () => {
    expect(skillHasFile(SKILL, "scripts/analyze_trigger.py")).toBe(true)
    expect(skillHasFile(SKILL, "assets/test_template.apex")).toBe(true)
    expect(skillHasFile(SKILL, "references/handler_patterns.md")).toBe(true)
  })

  // TODO: Add more tests - validate test_template.apex structure, check bash code blocks, etc.
})
