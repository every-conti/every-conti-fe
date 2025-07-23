import { apiRequestGet } from "./apiRequestGet";

export const fetchFamousPraiseTeams = async () => {
  //   const res = await apiRequestGet("/praise-teams/famous/last-conti", true);
  const res = await fetch(
    "http://localhost:8080/api/conti/praise-teams/famous/last-conti"
  );
  if (!res.ok) throw new Error("교회 콘티 불러오기 실패");
  return res.json();
};

// export const fetchNewWorships = async () => {
//   const res = await fetch("/api/new-worships");
//   if (!res.ok) throw new Error("새로운 찬양 불러오기 실패");
//   return res.json();
// };
