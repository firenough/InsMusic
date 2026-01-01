import { Env } from '../../types';

// Helper to verify JWT and return payload
async function verifyToken(request: Request): Promise<any | null> {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.split(' ')[1];
    const secret = 'temp_secret_key_change_me'; // MUST match login.ts

    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const [headerB64, bodyB64, signatureB64] = parts;
        const enc = new TextEncoder();
        const algorithm = { name: 'HMAC', hash: 'SHA-256' };
        const key = await crypto.subtle.importKey(
            'raw',
            enc.encode(secret),
            algorithm,
            false,
            ['verify']
        );

        const signature = Uint8Array.from(atob(signatureB64.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
        const isValid = await crypto.subtle.verify(
            algorithm,
            key,
            signature,
            enc.encode(`${headerB64}.${bodyB64}`)
        );

        if (!isValid) return null;

        const payload = JSON.parse(atob(bodyB64.replace(/-/g, '+').replace(/_/g, '/')));
        if (payload.exp < Date.now() / 1000) return null;

        return payload;
    } catch (e) {
        return null;
    }
}

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
    const user = await verifyToken(request);
    if (!user) {
        return new Response('Unauthorized', { status: 401 });
    }

    const historyKey = `history:${user.sub}`;

    if (request.method === 'GET') {
        const history = await env.HISTORY_KV.get(historyKey);
        return new Response(history || '[]', {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    if (request.method === 'POST') {
        try {
            const item = await request.json();
            let history: any[] = JSON.parse((await env.HISTORY_KV.get(historyKey)) || '[]');

            // Add new item to beginning, limit to 100 items
            history.unshift({ ...item, playedAt: Date.now() });
            if (history.length > 100) history = history.slice(0, 100);

            await env.HISTORY_KV.put(historyKey, JSON.stringify(history));
            return new Response(JSON.stringify(history), {
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (e) {
            return new Response('Error saving history', { status: 500 });
        }
    }

    if (request.method === 'DELETE') {
        await env.HISTORY_KV.delete(historyKey);
        return new Response('History cleared', { status: 200 });
    }

    return new Response('Method not allowed', { status: 405 });
};
