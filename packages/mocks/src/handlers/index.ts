import { http, HttpResponse } from 'msw'
import user from './mocks/user.json'
export const handlers = [
  // User endpoints
  http.get('https://api.github.com/users/tobias-secher', () => {
    return HttpResponse.json(user)
  }),
]