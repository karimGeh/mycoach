import { User } from '@mycoachorg/common';
import request from 'supertest';
import { app } from '../../app';

// jest.setTimeout(99999999);

it('returns a 400 with invalid email', async () => {
	return request(app)
		.post('/api/users/signup')
		.send({
			username: 'test1',
			email: 'karim',
			password: 'karim',
		})
		.expect(400);
});

it('returns a 400 with invalid password', async () => {
	await request(app)
		.post('/api/users/signup')
		.send({
			username: 'karim',
			email: 'karim@gmail.com',
			password: '',
		})
		.expect(400);

	await request(app)
		.post('/api/users/signup')
		.send({
			username: 'karim',
			email: 'karim@gmail.com',
			password: 'helo',
		})
		.expect(400);
});

it('returns a 400 with invalid username', async () => {
	await request(app)
		.post('/api/users/signup')
		.send({
			username: '',
			email: 'karim@gmail.com',
			password: 'dfsadfsa',
		})
		.expect(400);

	await request(app)
		.post('/api/users/signup')
		.send({
			username: 'test test',
			email: 'karim@gmail.com',
			password: 'dfasfdasf',
		})
		.expect(400);

	await request(app)
		.post('/api/users/signup')
		.send({
			email: 'karim@gmail.com',
			password: 'dfasfdasf',
		})
		.expect(400);
});

it('returns a 201 on passing all validator', async () => {
	await request(app)
		.post('/api/users/signup')
		.send({
			username: 'test10',
			email: 'test10@gmail.com',
			password: 'dfasfdasf',
		})
		.expect(201);
});

it('saves the new user to the database', async () => {
	await request(app)
		.post('/api/users/signup')
		.send({
			username: 'test11',
			email: 'test11@gmail.com',
			password: 'dfasfdasf',
		})
		.expect(201);

	const user = await User.findOne({ username: 'test11' });
	// console.log(user);

	expect(user).toMatchObject({ username: 'test11' });
});

it('disallows duplicate emails', async () => {
	await request(app)
		.post('/api/users/signup')
		.send({
			username: 'test12',
			email: 'test12@gmail.com',
			password: 'dfasfdasf',
		})
		.expect(201);

	const res = await request(app)
		.post('/api/users/signup')
		.send({
			username: 'test13',
			email: 'test12@gmail.com',
			password: 'dfasfdasf',
		})
		.expect(400);

	// console.log(res.body);
});

it('sets a cookie after successful signup', async () => {
	const res = await request(app)
		.post('/api/users/signup')
		.send({
			username: 'test13',
			email: 'test12@gmail.com',
			password: 'dfasfdasf',
		})
		.expect(201);

	expect(res.get('Set-Cookie')).toBeDefined();
});
