import { apiRequestGet } from "./apiRequestGet";

export const fetchFamousPraiseTeams = async () => {
  return apiRequestGet("/conti/praise-teams/famous/last-conti", true);
};

export const fetchLastSongs = async () => {
  return apiRequestGet("/song/lasts", true);
};
