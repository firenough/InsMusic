import { Env, User } from '../../types';

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
    const adminPassword = request.headers.get('x-admin-password');

    if (adminPassword !== env.ADMIN_PASSWORD) {
        return new Response('Unauthorized', { status: 401 });
    }

    if (request.method === 'GET') {
        // List all users
        try {
            const list = await env.USERS_KV.list({ prefix: 'user:email:' });
            const users: User[] = [];

            // Fetch details for each user (max 1000 by default for list, doing parallel gets)
            // Note: In production with many users, pagination would be needed.
            // KV list returns keys.
            for (const key of list.keys) {
                const userStr = await env.USERS_KV.get(key.name);
                if (userStr) {
                    const u = JSON.parse(userStr);
                    // Don't modify the original object in KV, just mask sensitive data for response
                    users.push({ ...u, passwordHash: '***', salt: '***' });
                }
            }

            return new Response(JSON.stringify(users), {
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (e) {
            return new Response('Error listing users', { status: 500 });
        }
    }

    if (request.method === 'DELETE') {
        // Delete user by Email (since our keys are user:email:<email>)
        const url = new URL(request.url);
        const email = url.searchParams.get('email');

        if (!email) {
            return new Response('Email required', { status: 400 });
        }

        try {
            // 1. Get user to find ID (to delete history if we want)
            const userKey = `user:email:${email}`;
            const userStr = await env.USERS_KV.get(userKey);

            if (!userStr) {
                return new Response('User not found', { status: 404 });
            }

            const user = JSON.parse(userStr) as User;

            // 2. Delete User
            await env.USERS_KV.delete(userKey);

            // 3. Delete History (optional cleanup)
            await env.HISTORY_KV.delete(`history:${user.id}`);

            return new Response('User deleted', { status: 200 });
        } catch (e) {
            return new Response('Error deleting user', { status: 500 });
        }
    }

    return new Response('Method not allowed', { status: 405 });
};
