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
