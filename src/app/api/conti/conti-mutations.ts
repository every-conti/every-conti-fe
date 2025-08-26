import { useMutation, useQueryClient } from "@tanstack/react-query";
import { qk } from "./qk";
import {
  fetchContiUpdate,
  fetchContiDelete,
  fetchContiAddSongs,
  fetchContiCreate,
  fetchContiCopy,
} from "./conti";
import ContiWithSongDto from "src/dto/common/conti-with-song.dto";
import { UpdateContiDto } from "src/dto/conti/UpdateContiDto";
import { DeleteContiDto } from "src/dto/conti/DeleteContiDto";
import { CreateContiDto } from "src/dto/conti/CreateContiDto";
import { CopyContiDto } from "src/dto/conti/CopyContiDto";

type Conti = ContiWithSongDto;

// 공용: 무한스크롤 페이지들 안의 항목 패치/삭제/추가
const patchInInfinite =
  (qc: ReturnType<typeof useQueryClient>) =>
  (prefix: string[], updater: (c: any) => any | null) => {
    qc.setQueriesData({ queryKey: prefix }, (old: any) => {
      if (!old?.pages) return old;
      return {
        ...old,
        pages: old.pages.map((p: any) => ({
          ...p,
          items: p.items.map((c: any) => updater(c)).filter((x: any) => x !== null),
        })),
      };
    });
  };

export function useUpdateContiMutation() {
  const qc = useQueryClient();
  const patch = patchInInfinite(qc);

  return useMutation({
    mutationFn: async (vars: { id: string; dto: UpdateContiDto }) => {
      const data = await fetchContiUpdate(vars.id, vars.dto); // 서버가 최신 Conti 반환
      return data as unknown as Conti;
    },
    onMutate: async ({ id, dto }) => {
      await qc.cancelQueries({ queryKey: qk.conti(id) });
      const prev = qc.getQueryData(qk.conti(id));

      // 1) 디테일 낙관적 반영
      qc.setQueryData(qk.conti(id), (old: any) => ({ ...old, ...dto }));

      // 2) 모든 목록에 낙관적 반영
      const optimistic = (c: any) => (c.id === id ? { ...c, ...dto } : c);
      patch(["searchContis"], optimistic);
      patch(["myContis"], optimistic);

      return { prev };
    },
    onError: (_e, { id }, ctx) => {
      if (ctx?.prev) qc.setQueryData(qk.conti(id), ctx.prev);
    },
    onSuccess: (data) => {
      // 서버 응답으로 확정 반영
      qc.setQueryData(qk.conti(data.id), data);
      const confirm = (c: any) => (c.id === data.id ? { ...c, ...data } : c);
      patch(["searchContis"], confirm);
      patch(["myContis"], confirm);
    },
    onSettled: (_d, _e, { id }) => {
      // 최종 재검증(가벼우면 생략 가능)
      qc.invalidateQueries({ queryKey: qk.conti(id), exact: true });
      qc.invalidateQueries({ queryKey: ["searchContis"] });
      qc.invalidateQueries({ queryKey: ["myContis"] });
    },
  });
}

export function useDeleteContiMutation() {
  const qc = useQueryClient();
  const patch = patchInInfinite(qc);

  return useMutation({
    mutationFn: async (vars: { id: string; dto: DeleteContiDto }) => {
      await fetchContiDelete(vars.id, vars.dto);
      return vars.id;
    },
    onMutate: async ({ id }) => {
      await qc.cancelQueries({ queryKey: qk.conti(id) });
      const prev = qc.getQueryData(qk.conti(id));
      qc.removeQueries({ queryKey: qk.conti(id), exact: true });

      // 목록에서 제거
      const remover = (c: any) => (c.id === id ? null : c);
      patch(["searchContis"], remover);
      patch(["myContis"], remover);

      return { prev };
    },
    onSuccess: (id) => {
      qc.removeQueries({ queryKey: qk.conti(id), exact: true });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["searchContis"] });
      qc.invalidateQueries({ queryKey: ["myContis"] });
    },
  });
}

export function useAddSongToContiMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { contiId: string; songId: string }) => {
      const res = await fetchContiAddSongs(vars.contiId, vars.songId);
      return { contiId: vars.contiId, res };
    },
    onSuccess: (_data, { contiId }) => {
      // 디테일은 보통 곡 목록이 바뀌므로 invalidate로 새로 받아오기 권장
      qc.invalidateQueries({ queryKey: qk.conti(contiId), exact: true });
      // 리스트는 총 곡수/총시간 등만 변한다면 setQueriesData로 부분 패치 가능
      qc.invalidateQueries({ queryKey: ["searchContis"] });
      qc.invalidateQueries({ queryKey: ["myContis"] });
    },
  });
}

export function useCreateContiMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateContiDto) => fetchContiCreate(dto),
    onSuccess: (newConti) => {
      // 내 목록 최상단에 추가하고 싶다면 여기에 prepend 로직 작성 가능
      qc.invalidateQueries({ queryKey: ["myContis"] });
      qc.invalidateQueries({ queryKey: ["searchContis"] });
      // 상세 페이지로 이동한다면, 미리 디테일 캐시 세팅도 가능:
      qc.setQueryData(qk.conti(newConti.id), newConti);
    },
  });
}

export function useCopyContiMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CopyContiDto) => fetchContiCopy(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myContis"] });
      qc.invalidateQueries({ queryKey: ["searchContis"] });
    },
  });
}
