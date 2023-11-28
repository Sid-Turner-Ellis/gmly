import { profanity } from "@2toad/profanity";

export const validateTeamName = (teamName: string) => {
  const teamNameLength = teamName.length;

  const isTooLong = teamNameLength > 32;
  const isTooShort = teamNameLength < 3;
  const doesContainProfanity = profanity.exists(teamName);

  if (teamNameLength === 0) {
    return "Team name is required";
  }

  if (isTooLong) {
    return "Team name is too long";
  }

  if (isTooShort) {
    return "Team name is too short";
  }

  if (doesContainProfanity) {
    return "Team name contains profanity";
  }
};
