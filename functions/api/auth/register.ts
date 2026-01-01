import { Env, User } from '../../types';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
    try {
        const { email, password } = await request.json() as any;

        if (!email || !password) {
            return new Response('Email and password required', { status: 400 });
        }

        // Check if user exists
        const existingUser = await env.USERS_KV.get(`user:email:${email}`);
        if (existingUser) {
            return new Response('User already exists', { status: 409 });
        }

        const salt = crypto.randomUUID();
        const encoder = new TextEncoder();
        const data = encoder.encode(password + salt);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        const userId = crypto.randomUUID();
        const newUser: User = {
            id: userId,
            email,
            passwordHash,
            salt,
            createdAt: Date.now()
        };

        // Store user by email (for lookup) and ID (if needed, but mainly email for login)
        // We store the full user object keyed by email for easy login lookup
        await env.USERS_KV.put(`user:email:${email}`, JSON.stringify(newUser));

        return new Response(JSON.stringify({ id: userId, email }), {
            headers: { 'Content-Type': 'application/json' },
            status: 201
        });

    } catch (e) {
        return new Response('Error registering user', { status: 500 });
    }
};
