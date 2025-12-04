import { http, HttpResponse } from 'msw'
import user from './mocks/user.json'
const BASE_URL = '*'

export const handlers = [
  // User endpoints
  http.get(`${BASE_URL}/users/tobias-secher`, () => {
    return HttpResponse.json(user)
  }),
]