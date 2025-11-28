import {isMswEnabled} from '@repo/utils'

export async function register() {
    if(process.env.NEXT_RUNTIME !== 'nodejs' || !isMswEnabled) return;

    const {server} = await import('@repo/mocks/server');
    server.listen({
        onUnhandledRequest: 'bypass'
    });
}