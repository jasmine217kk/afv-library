import { describe, it, expect } from "vitest"
import { readSkillFile, skillHasFile, extractCodeBlocks, hasBalancedBraces } from "../../helpers"

const SKILL = "generating-apex"

describe(`${SKILL}: Apex template assets`, () => {
  it("service.cls template exists", () => {
    expect(skillHasFile(SKILL, "assets/service.cls")).toBe(true)
  })

  it("batch.cls template has balanced braces", () => {
    const content = readSkillFile(SKILL, "assets/batch.cls")
    const result = hasBalancedBraces(content)
    expect(result.balanced, `open=${result.open} close=${result.close}`).toBe(true)
  })

  it("batch.cls implements Database.Batchable", () => {
    const content = readSkillFile(SKILL, "assets/batch.cls")
    expect(content).toContain("Database.Batchable")
  })

  // TODO: Add more tests - validate remaining templates, check code blocks in SKILL.md, etc.
})
