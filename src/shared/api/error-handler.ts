// src/shared/api/error-handler.ts
import { getDefaultStore } from 'jotai';
import { ErrorAtom } from '../model/error.atom';

/**
 * handleApiError
 *
 * ─ 활용 시점 ──────────────────────────────────────────────────────────────────
 * API 호출 후 에러가 발생했을 때 공통 처리가 필요한 모든 곳에서 사용한다.
 *
 * 1) Mutation(쓰기) 훅의 onError 콜백
 *    - POST / PATCH / DELETE 요청 실패 시 호출
 *
 * 2) Query(읽기) 훅의 onError 콜백 (TanStack Query v4: meta.onError)
 *    - GET 요청 실패 시 공통 처리
 *
 * 3) Axios 응답 인터셉터 (auth-interceptor.ts)
 *    - 모든 HTTP 응답 에러를 일괄 처리할 때
 *
 * ─ 현재 처리 내용 ─────────────────────────────────────────────────────────────
 * - 401 Unauthorized → 로그인 페이지(/login)로 강제 이동
 * - 나머지 에러    → 전역 에러 팝업용 atom(errorAtom)에 메시지 설정 후 throw
 *
 * ─ 사용 예시 ──────────────────────────────────────────────────────────────────
 *
 * [예시 1] Mutation 훅의 onError 콜백에서 사용
 * ─────────────────────────────────────────────
 * // src/features/project-register/model/use-register-project.mutation.ts
 * import { handleApiError } from "@/shared/api";
 *
 * export const useRegisterProject = () => {
 *     const queryClient = useQueryClient();
 *     return useMutation({
 *         mutationFn: (data: RegisterProjectRequest) => registerProject(data),
 *         onSuccess: () => {
 *             queryClient.invalidateQueries({ queryKey: ["projects"] });
 *         },
 *         onError: (error) => handleApiError(error),  // ← 여기서 호출
 *     });
 * };
 */
export function HandleApiError(error: unknown) {
    console.error("API Error 상세:", error);

    const status = (error as any)?.response?.status;

    // 1. 401 Unauthorized: 인증 만료 또는 미인증 → 팝업 표시 후 확인 시 로그인 페이지로 이동
    const store = getDefaultStore();

    if (status === 401) {
        store.set(ErrorAtom, {
            message: "인증이 만료되었거나 권한이 없습니다.\n다시 로그인해주세요.",
            onConfirm: () => {
                window.location.href = "/login";
            }
        });
        return;
    }

    // 2. 백엔드 에러 메시지 추출
    // response.data.message (표준), response.data.error, 또는 일반 Error 객체의 message 참조
    const responseData = (error as any)?.response?.data;
    const message = responseData?.message || responseData?.error || (error as Error)?.message || "알 수 없는 서버 오류가 발생했습니다.";
    const errorCode = responseData?.errorCode;
    const errorType = responseData?.errorType;

    // 3. 전역 에러 상태(Atom)에 메시지 설정 → Alert 팝업 표시 유도
    // 컴포넌트 외부에서 atom 값을 변경하기 위해 getDefaultStore() 사용
    store.set(ErrorAtom, { errorCode, errorType, message });

    // 나머지 에러는 호출부(onError, catch 블록)에서 처리하도록 재전파
    throw error;
}