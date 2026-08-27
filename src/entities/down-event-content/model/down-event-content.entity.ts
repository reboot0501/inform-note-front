// src/entities/down-event-content/model/down-event-content.entity.ts
export interface DownContent {
  downEventId: string;
  contentHtml: string; // Froala 에디터 HTML 본문
  // [감사 메타]
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}
