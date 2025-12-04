
import ky from "ky";
import {isServer} from '@repo/utils'

export const apiClient = ky.create({
    prefixUrl: isServer ?  process.env.API_URL : '/api',
})