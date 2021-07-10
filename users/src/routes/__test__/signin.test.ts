import request from 'supertest';
import { app } from '../../app';

it('returns a 400 when email or password is not set', async () => {
	await request(app)
		.post('/api/users/signin')
		.send({
			email: '',
			password: 'testtest',
		})
		.expect(400);
	await request(app)
		.post('/api/users/signin')
		.send({
			email: 'test@test.com',
			password: '',
		})
		.expect(400);
	await request(app)
		.post('/api/users/signin')
		.send({
			email: 'test@test',
		})
		.expect(400);
});

it('returns a 400 when email not found', async () => {
	await request(app)
		.post('/api/users/signin')
		.send({
			email: 'test@test.com',
			password: 'testtest',
		})
		.expect(400);
});

it('returns a 400 when passwords does not matches', async () => {
	await (global as any).signup({
		username: 'hello',
		email: 'test@test.com',
		password: 'testtest',
	});

	await request(app)
		.post('/api/users/signin')
		.send({
			email: 'test@test.com',
			password: 'testtes',
		})
		.expect(400);
});

it('respond with a token when send valid credential', async () => {
	await (global as any).signup({
		username: 'hello',
		email: 'test@test.com',
		password: 'testtest',
	});

	const res = await request(app)
		.post('/api/users/signin')
		.send({
			email: 'test@test.com',
			password: 'testtest',
		})
		.expect(200);

	// console.log(res.get('Set-Cookie'));

	expect(res.get('Set-Cookie')).toBeDefined();
});
