//
import { post } from '@/shared/api'
import { type FindActionPopupFetch } from '../model/find-action-popup.fetch'
import { type ActionPopupResponse } from '../model/action-popup.response'

export const findActionPopupApi = async (
  request: FindActionPopupFetch
): Promise<ActionPopupResponse> => {
  return post<ActionPopupResponse, FindActionPopupFetch>(
    '/feature/maintenance/find-action-popup/fetch',
    request
  )
}