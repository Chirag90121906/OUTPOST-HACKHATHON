type Profile = {
  educationLevel?: string | null;
  course?: string | null;
  cgpa?: number | null;
  percentage?: number | null;
  state?: string | null;
  familyIncome?: number | null;
  graduationYear?: number | null;
};
type Scholarship = {
  educationLevels?: string | null;
  eligibleCourses?: string | null;
  eligibleStates?: string | null;
  minCgpa?: number | null;
  minPercentage?: number | null;
  maxFamilyIncome?: number | null;
  deadline?: Date | string | null;
};

export type MatchResult = {
  score: number;
  status: "Eligible" | "Potentially Eligible" | "Not Eligible" | "Insufficient Information";
  reasons: string[];
  missing: string[];
  failed: string[];
};

function split(v?: string | null) {
  return (v || "").split(",").map((s) => s.trim()).filter(Boolean);
}
function includesAny(hay: string[], needle?: string | null) {
  if (!needle) return false;
  const n = needle.toLowerCase();
  return hay.some((h) => h.toLowerCase() === n || n.includes(h.toLowerCase()) || h.toLowerCase().includes(n));
}

export function matchScholarship(profile: Profile, scholarship: Scholarship): MatchResult {
  const reasons: string[] = [];
  const missing: string[] = [];
  const failed: string[] = [];
  let checks = 0;
  let passed = 0;

  const levels = split(scholarship.educationLevels);
  if (levels.length) {
    checks++;
    if (!profile.educationLevel) missing.push("Education level");
    else if (includesAny(levels, profile.educationLevel) || levels.some((l) => l.toLowerCase() === "all")) { passed++; reasons.push(`Education level matches (${profile.educationLevel}).`); }
    else failed.push(`Education level does not match required levels: ${levels.join(", ")}.`);
  }
  const courses = split(scholarship.eligibleCourses);
  if (courses.length) {
    checks++;
    if (!profile.course) missing.push("Course/field of study");
    else if (includesAny(courses, profile.course)) { passed++; reasons.push(`Course aligns with eligible fields.`); }
    else failed.push(`Course may not match eligible fields: ${courses.join(", ")}.`);
  }
  if (scholarship.minCgpa != null) {
    checks++;
    if (profile.cgpa == null) missing.push("CGPA");
    else if (profile.cgpa >= scholarship.minCgpa) { passed++; reasons.push(`CGPA ${profile.cgpa} meets minimum ${scholarship.minCgpa}.`); }
    else failed.push(`CGPA ${profile.cgpa} is below minimum ${scholarship.minCgpa}.`);
  }
  if (scholarship.minPercentage != null) {
    checks++;
    if (profile.percentage == null && profile.cgpa == null) missing.push("Percentage/academic score");
    else {
      const pct = profile.percentage ?? (profile.cgpa ? profile.cgpa * 10 : null);
      if (pct != null && pct >= scholarship.minPercentage) { passed++; reasons.push(`Academic score meets minimum ${scholarship.minPercentage}%.`); }
      else failed.push(`Academic score is below minimum ${scholarship.minPercentage}%.`);
    }
  }
  const states = split(scholarship.eligibleStates);
  if (states.length && !states.some((s) => s.toLowerCase() === "all india" || s.toLowerCase() === "all")) {
    checks++;
    if (!profile.state) missing.push("State/location");
    else if (includesAny(states, profile.state)) { passed++; reasons.push(`Location eligibility may be satisfied (${profile.state}).`); }
    else failed.push(`State/location may not match eligible states: ${states.join(", ")}.`);
  }
  if (scholarship.maxFamilyIncome != null) {
    checks++;
    if (profile.familyIncome == null) missing.push("Family income (for income-based eligibility)");
    else if (profile.familyIncome <= scholarship.maxFamilyIncome) { passed++; reasons.push(`Family income is within the listed limit.`); }
    else failed.push(`Family income exceeds the listed eligibility limit.`);
  }

  if (checks === 0) return { score: 50, status: "Insufficient Information", reasons: ["Scholarship criteria are broad or not fully structured for automatic matching."], missing, failed };
  if (failed.length > 0) {
    const score = Math.max(0, Math.round((passed / checks) * 45));
    return { score, status: "Not Eligible", reasons, missing, failed };
  }
  if (missing.length > 0) {
    const score = Math.round(45 + (passed / Math.max(checks, 1)) * 35);
    return { score, status: "Potentially Eligible", reasons, missing, failed };
  }
  const score = Math.round(75 + (passed / checks) * 25);
  return { score, status: "Eligible", reasons, missing, failed };
}
