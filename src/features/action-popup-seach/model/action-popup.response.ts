//
import { type DownEventCard } from '@/entities/down-event-card'

export interface ActionPopupResponse extends DownEventCard {
  contentHtml?: string // Rich Text 에디터 HTML 본문 (Oracle CLOB)
}