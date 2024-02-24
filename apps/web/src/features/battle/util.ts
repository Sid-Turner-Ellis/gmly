import { TeamResponse } from "../team/team-service";
import { CreateBattleParams } from "./battle-service";
import { CreateBattleInputs } from "./components/create-battle-modal";

export const getAvailableTimes = () => {
  const times = [];
  let currentDate = new Date();
  let minutes = Math.ceil(currentDate.getMinutes() / 15) * 15;

  if (minutes === currentDate.getMinutes()) {
    minutes += 15;
  }

  if (minutes === 60) {
    currentDate.setHours(currentDate.getHours() + 1);
    minutes = 0;
  }

  currentDate.setMinutes(minutes, 0, 0);

  const endTime = new Date(currentDate);
  endTime.setHours(23, 45, 0);

  while (currentDate <= endTime) {
    times.push(currentDate.toISOString());

    currentDate = new Date(currentDate.getTime() + 15 * 60000);
  }

  return times;
};

export const getTeamSizeNumberFromTeamOption = (
  teamSize: CreateBattleInputs["teamSize"]
): number => (teamSize ? parseInt(teamSize[0]) : 0);

export const getSeriesNumberFromSeriesOption = (
  series: CreateBattleParams["series"]
) => parseInt(series.slice(2));

export const getCentsFromStringValue = (value: string) =>
  parseFloat(value) * 100;

export const getRelativeStartTime = (date: string) => {
  const start = new Date(date);
  const now = new Date();

  const diff = start.getTime() - now.getTime();

  if (diff <= 0) return "Started";

  const diffInMinutes = Math.floor(diff / 60000);
  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""}`;
  } else {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""}`;
  }
};
