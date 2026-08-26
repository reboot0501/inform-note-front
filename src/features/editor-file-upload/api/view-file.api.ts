// src/features/editor-file-upload/api/view-file.api.ts
export const getFileViewUrl = (fileId: string): string => {
  return `/feature/file-handler/view/${fileId}`
}