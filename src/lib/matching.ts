import { FounderProfile, FounderRole } from "./data";

export type MatchResult = {
  founder: FounderProfile;
  score: number;
  percentage: number;
  reasons: string[];
};

export type MatchInput = {
  name: string;
  skills: string[];
  interests: string[];
  role?: FounderRole;
  lookingForRole: FounderRole;
  bio: string;
};

const normalize = (items: string[]) =>
  items.map((item) => item.trim().toLowerCase()).filter(Boolean);

const overlapCount = (left: string[], right: string[]) => {
  const rightSet = new Set(normalize(right));
  return normalize(left).filter((item) => rightSet.has(item)).length;
};

const roleCompatibility = (
  seekerRole: FounderRole | undefined,
  lookingForRole: FounderRole,
  candidateRole: FounderRole,
) => {
  let points = 0;

  if (candidateRole === lookingForRole) {
    points += 35;
  }

  if (seekerRole && seekerRole !== candidateRole) {
    points += 15;
  }

  return points;
};

export function inferRoleFromSkills(skills: string[]): FounderRole {
  const normalized = normalize(skills);

  const technicalHits = normalized.filter((skill) =>
    ["react", "typescript", "python", "node.js", "apis", "devops", "machine learning", "system architecture"].includes(skill),
  ).length;
  const businessHits = normalized.filter((skill) =>
    ["sales", "partnerships", "growth marketing", "customer discovery", "financial modeling", "pricing", "seo"].includes(skill),
  ).length;
  const designHits = normalized.filter((skill) =>
    ["brand design", "figma", "user research", "mobile design", "prototyping", "design systems", "ux writing"].includes(skill),
  ).length;

  if (technicalHits >= businessHits && technicalHits >= designHits) {
    return "technical";
  }

  if (businessHits >= designHits) {
    return "business";
  }

  return "design";
}

export function getSortedMatches(
  profile: MatchInput,
  founders: FounderProfile[],
): MatchResult[] {
  const seekerRole = profile.role ?? inferRoleFromSkills(profile.skills);

  return founders
    .map((founder) => {
      const sharedSkills = overlapCount(profile.skills, founder.skills);
      const sharedInterests = overlapCount(profile.interests, founder.interests);
      const skillScore = Math.min(sharedSkills * 18, 36);
      const interestScore = Math.min(sharedInterests * 14, 28);
      const complementScore = roleCompatibility(
        seekerRole,
        profile.lookingForRole,
        founder.role,
      );
      const bioScore = profile.bio.trim().length > 40 ? 6 : 0;
      const score = Math.min(skillScore + interestScore + complementScore + bioScore, 100);

      const reasons = [
        sharedSkills > 0 ? `${sharedSkills} shared skill${sharedSkills > 1 ? "s" : ""}` : null,
        sharedInterests > 0
          ? `${sharedInterests} aligned interest${sharedInterests > 1 ? "s" : ""}`
          : null,
        founder.role === profile.lookingForRole
          ? `matches your target ${profile.lookingForRole} role`
          : null,
        founder.role !== seekerRole ? "brings complementary coverage" : null,
      ].filter((reason): reason is string => Boolean(reason));

      return {
        founder,
        score,
        percentage: Math.round(score),
        reasons,
      };
    })
    .sort((left, right) => right.score - left.score);
}
