// src/features/down-event-card-search/api/find-down-event-cards.api.ts
import { post, type OffsetElementList } from '@/shared/api'
import { type DownEventCard } from '@/entities/down-event-card'
import { type FindDownEventsFetch } from '../model/find-down-event-cards.fetch'

export const findDownEventsApi = async (
  request: FindDownEventsFetch
): Promise<OffsetElementList<DownEventCard>> => {
  return post<OffsetElementList<DownEventCard>, FindDownEventsFetch>(
    '/feature/maintenance/find-down-event-cards/fetch',
    request
  )
}