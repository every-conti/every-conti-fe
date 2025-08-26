import { apiRequestWithRefresh } from "src/app/api/apiRequestWithRefresh";
import ApiOptions from "src/app/api/ApiOptions";

export const fetchFamousPraiseTeamsContis = async () => {
  const apiOptions: ApiOptions = {
    useCache: true,
  };

  return apiRequestWithRefresh("/conti/praise-teams/famous/last-conti", apiOptions);
};

export const fetchLastSongs = async () => {
  const apiOptions: ApiOptions = {
    useCache: true,
  };
  return apiRequestWithRefresh("/song/lasts", apiOptions);
};
