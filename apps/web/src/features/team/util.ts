import { profanity } from "@2toad/profanity";
import { TeamMemberUpdate } from "./types";
import { TeamResponse } from "./team-service";

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

export const createFakeTeamProfile = (
  val: TeamMemberUpdate
): NonNullable<TeamResponse["attributes"]["team_profiles"]["data"]>[0] => ({
  attributes: {
    team: undefined as never,
    is_pending: true,
    role: val.role,
    xp: 0,
    earnings: 0,
    rank: 0,
    profile: {
      data: {
        id: 0,
        attributes: {
          wallet_address: "",
          region: "NA",
          username: val.username,
          wager_mode: false,
          trust_mode: false,
          bio: "",
          avatar: null,
          team_profiles: undefined as never,
          createdAt: "",
        },
      },
    },
    invited_by: undefined as never,
  },
});
