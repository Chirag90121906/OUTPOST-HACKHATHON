import { describe, expect, it } from "vitest";
import { scholarshipMatchesState } from "./location";

describe("scholarshipMatchesState", () => {
  it("matches an exact state name without case sensitivity", () => {
    expect(scholarshipMatchesState("Gujarat, Maharashtra", "maharashtra")).toBe(true);
  });

  it("does not match a state name that is only a substring", () => {
    expect(scholarshipMatchesState("Goa", "Gujarat")).toBe(false);
  });

  it("includes unrestricted and nationwide opportunities", () => {
    expect(scholarshipMatchesState(null, "Gujarat")).toBe(true);
    expect(scholarshipMatchesState("All India", "Gujarat")).toBe(true);
    expect(scholarshipMatchesState("Pan-India", "Gujarat")).toBe(true);
  });

  it("does not filter when no state is selected", () => {
    expect(scholarshipMatchesState("Goa", "")).toBe(true);
  });
});
