export async function register() {
    if(process.env.NEXT_RUNTIME !== 'nodejs') return;

    const {server} = await import('@repo/mocks/server');
    server.listen({
        onUnhandledRequest: 'bypass'
    });
}