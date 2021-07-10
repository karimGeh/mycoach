import request from 'supertest';
import { app } from '../../app';

it('sets cookie to empy object', async () => {
	const res = await request(app).post('/api/users/signout').send().expect(200);

	expect(res.get('Set-Cookie')[0]).toEqual(
		'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly',
	);
});

it('sets cookie to empy object', async () => {
	const cookie = await (global as any).signup({
		username: 'hello',
		email: 'test@test.com',
		password: 'testtest',
	});

	const res = await request(app)
		.post('/api/users/signout')
		.set('Cookie', cookie)
		.send()
		.expect(200);

	expect(res.get('Set-Cookie')[0]).toEqual(
		'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly',
	);
});
