// src/entities/file/model/atatched-file.entity.ts
import type { FileRefType, FileStatus } from './vo'

export interface AttachedFile {
	fileId: string
	refType: FileRefType
	refId: string
	originFileName: string
	storedFileName: string
	filePath: string
	fileSize: number
	contentType: string
	status: FileStatus
	createdBy: string
	createdAt: string
	updatedBy: string
	updatedAt: string
}
