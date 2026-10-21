// src/shared/lib/image-viewer-popup.ts
import { IMAGE_NOT_FOUND_DATA_URI } from './image-fallback';

/**
 * 이미지 정밀 확대 검사용 윈도우 팝업 오픈 헬퍼
 */
export function openImageViewerWindow(src: string, title = '현상 및 조치 상세 이미지 확대 보기') {
  const width = Math.min(window.screen.width * 0.8, 1200);
  const height = Math.min(window.screen.height * 0.8, 900);
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;

  const imageWindow = window.open(
    '',
    '_blank',
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
  );

  if (imageWindow) {
    imageWindow.document.write(`
      <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta charset="UTF-8" />
          <title>${title}</title>
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 20px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background-color: #0f172a;
              color: #f8fafc;
              font-family: system-ui, -apple-system, sans-serif;
            }
            .title {
              margin-bottom: 12px;
              font-size: 14px;
              font-weight: 600;
              color: #94a3b8;
            }
            img {
              max-width: 95vw;
              max-height: 85vh;
              object-fit: contain;
              border-radius: 8px;
              box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.7);
              border: 1px solid #334155;
              background-color: #020617;
            }
          </style>
        </head>
        <body>
          <div class="title">${title}</div>
          <img 
            src="${src}" 
            alt="${title}" 
            onerror="this.onerror=null; this.src='${IMAGE_NOT_FOUND_DATA_URI}'; this.style.maxWidth='420px';"
          />
        </body>
      </html>
    `);
    imageWindow.document.close();
  }
}
