// src/shared/lib/image-fallback.ts
import type React from 'react';

/**
 * 서버 재요청을 차단하고 깨진 이미지 대신 표시할 인라인 SVG Data URI
 * (네트워크 요청이 발생하지 않고 브라우저 자체에서 즉시 렌더링됨)
 */
export const IMAGE_NOT_FOUND_DATA_URI =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200" fill="none">
  <rect width="320" height="200" rx="8" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5" stroke-dasharray="4 4"/>
  <rect x="128" y="65" width="64" height="50" rx="6" stroke="#94A3B8" stroke-width="2" fill="#F1F5F9"/>
  <circle cx="145" cy="80" r="4" fill="#94A3B8"/>
  <path d="M134 105L148 91L162 105L174 93L186 105" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="178" cy="73" r="10" fill="#EF4444"/>
  <path d="M174 69L182 77M182 69L174 77" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
  <text x="160" y="140" text-anchor="middle" fill="#475569" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600">이미지를 불러올 수 없습니다</text>
  <text x="160" y="158" text-anchor="middle" fill="#94A3B8" font-family="system-ui, -apple-system, sans-serif" font-size="10">(파일 누락 또는 404)</text>
</svg>
`);

/**
 * 단일 이미지 요소에 Fallback을 적용하는 헬퍼 함수
 */
export function applyImageFallback(img: HTMLImageElement) {
  // 1. 이미 Fallback이 적용된 경우 무한 루프 방지
  if (img.dataset.fallbackApplied === 'true') {
    return;
  }
  img.dataset.fallbackApplied = 'true';

  // 2. 추가 재요청 차단
  img.onerror = null;

  // 3. 인라인 SVG 대체 이미지 설정
  img.src = IMAGE_NOT_FOUND_DATA_URI;
  img.alt = '이미지를 불러올 수 없습니다 (파일 없음)';

  // 4. 스타일 최적화 (깨진 UI 방지)
  img.style.objectFit = 'contain';
  img.style.cursor = 'default';
  img.classList.add('image-fallback-error');
}

/**
 * dangerouslySetInnerHTML 컨테이너 등 부모 엘리먼트에 붙여
 * 내부 하위 img 태그들의 로딩 실패(404 등)를 일괄 처리하는 이벤트 핸들러
 */
export function handleImageErrorCapture(e: React.SyntheticEvent<HTMLElement, Event>) {
  const target = e.target as HTMLElement;
  if (target && target.tagName.toLowerCase() === 'img') {
    applyImageFallback(target as HTMLImageElement);
  }
}
