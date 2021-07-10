import request from 'supertest';
import { app } from '../../app';

it('returns null when user is not authenticated', async () => {
	const res = await request(app)
		.get('/api/users/currentuser')
		.send({})
		.expect(200);

	expect(res.body.currentUser).toEqual(null);
});

it('returns the user when the user is authenticated', async () => {
	const cookie = await (global as any).signup({
		username: 'hello',
		email: 'test@test.com',
		password: 'testtest',
	});

	// console.log(cookie);

	const res = await request(app)
		.get('/api/users/currentuser')
		.set('Cookie', cookie)
		.send()
		.expect(200);

	expect(res.body.currentUser).toMatchObject({
		username: 'hello',
		email: 'test@test.com',
	});
});
