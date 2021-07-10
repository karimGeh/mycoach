import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Session } from '../../models/Session.model';
import { Coach } from '../../models/Coach.model';
import { User } from '../../models/User.model';

it('returns 401 if user not auth', async () => {
	await request(app)
		.post(`/api/session/jsdhklahsjgkhakshgkjdsh`)
		.send()
		.expect(401);
});

it('it return 400 if missing fields or invalid fields', async () => {
	const coach = (await (global as any).createCoach()).toJSON();
	// console.log(coach);

	await request(app)
		.post(`/api/session/${coach.id}`)
		.send({
			admin_token: (global as any).token,
		})
		.expect(400);
});

it('it return 400 ifnot valid link', async () => {
	const coach = (await (global as any).createCoach()).toJSON();
	const user = (await (global as any).createUser()).toJSON();
	// console.log(coach);

	await request(app)
		.post(`/api/session/${coach.id}`)
		.send({
			admin_token: (global as any).token,
			user: user.id,
			link: 'htadfas',
			time: new Date().toISOString(),
			// time: 'asfsadgdasgdsgas',
			transaction: new mongoose.Types.ObjectId().toHexString(),
		})
		.expect(400);
});

it('returns 404 if id of coach, user or transaction is not valid', async () => {
	const user = (await (global as any).createUser()).toJSON();
	const coach = (await (global as any).createCoach()).toJSON();
	const transaction = (
		await (global as any).createTransaction(user, coach)
	).toJSON();
	await request(app)
		.post(`/api/session/fasfagrawegsagdfasf`)
		.send({
			admin_token: (global as any).token,
			user: user.id,
			link: 'www.hello.com',
			time: new Date().toISOString(),
			// time: 'asfsadgdasgdsgas',
			transaction: transaction.id,
		})
		.expect(404);

	await request(app)
		.post(`/api/session/${coach.id}`)
		.send({
			admin_token: (global as any).token,
			user: 'dfasdasdgsag',
			link: 'test.com',
			time: new Date().toISOString(),
			// time: 'asfsadgdasgdsgas',
			transaction: transaction.id,
		})
		.expect(404);

	await request(app)
		.post(`/api/session/${coach.id}`)
		.send({
			admin_token: (global as any).token,
			user: user.id,
			link: 'test.com',
			time: new Date().toISOString(),
			// time: 'asfsadgdasgdsgas',
			transaction: 'fhdsakhsah',
		})
		.expect(404);
});

it('it return 404 if coach,transaction or user does not exist', async () => {
	const coach = (await (global as any).createCoach()).toJSON();
	const user = (await (global as any).createUser()).toJSON();
	const transaction = (
		await (global as any).createTransaction(user, coach)
	).toJSON();
	const validId = new mongoose.Types.ObjectId().toHexString();

	await request(app)
		.post(`/api/session/${validId}`)
		.send({
			admin_token: (global as any).token,
			user: user.id,
			link: 'www.hello.com',
			time: new Date().toISOString(),
			// time: 'asfsadgdasgdsgas',
			transaction: transaction.id,
		})
		.expect(404);

	await request(app)
		.post(`/api/session/${coach.id}`)
		.send({
			admin_token: (global as any).token,
			user: validId,
			link: 'test.com',
			time: new Date().toISOString(),
			// time: 'asfsadgdasgdsgas',
			transaction: transaction.id,
		})
		.expect(404);

	await request(app)
		.post(`/api/session/${coach.id}`)
		.send({
			admin_token: (global as any).token,
			user: user.id,
			link: 'test.com',
			time: new Date().toISOString(),
			// time: 'asfsadgdasgdsgas',
			transaction: validId,
		})
		.expect(404);
});

it('saves to the database whenever the given fields are all valid', async () => {
	const coach = (await (global as any).createCoach()).toJSON();
	const user = (await (global as any).createUser()).toJSON();
	const transaction = (
		await (global as any).createTransaction(user, coach)
	).toJSON();
	await request(app)
		.post(`/api/session/${coach.id}`)
		.send({
			admin_token: (global as any).token,
			user: user.id,
			link: 'test.com',
			time: new Date().toISOString(),
			transaction: transaction.id,
		})
		.expect(201);

	const session = await Session.findOne({ user: user.id });
	expect(session).toMatchObject({
		transaction: transaction.id,
		link: 'test.com',
	});
});

it('add the session in the coach sessionInQueue', async () => {
	const coach = (await (global as any).createCoach()).toJSON();
	const user = (await (global as any).createUser()).toJSON();
	const transaction = (
		await (global as any).createTransaction(user, coach)
	).toJSON();
	await request(app)
		.post(`/api/session/${coach.id}`)
		.send({
			admin_token: (global as any).token,
			user: user.id,
			link: 'test.com',
			time: new Date().toISOString(),
			transaction: transaction.id,
		})
		.expect(201);

	const updatedCoach = await Coach.findById(coach.id).populate(
		'sessionsInQueue',
	);
	expect(updatedCoach).not.toBeNull();
	expect(updatedCoach!.sessionsInQueue.length).toEqual(1);
	expect(updatedCoach!.sessionsInQueue[0]).toMatchObject({
		transaction: transaction.id,
		link: 'test.com',
	});
});
it('add the session in the user sessionInQueue', async () => {
	const coach = (await (global as any).createCoach()).toJSON();
	const user = (await (global as any).createUser()).toJSON();
	const transaction = (
		await (global as any).createTransaction(user, coach)
	).toJSON();

	await request(app)
		.post(`/api/session/${coach.id}`)
		.send({
			admin_token: (global as any).token,
			user: user.id,
			link: 'test.com',
			time: new Date().toISOString(),
			transaction: transaction.id,
		})
		.expect(201);

	const updatedUser = await User.findById(user.id).populate('sessionsInQueue');
	expect(updatedUser).not.toBeNull();
	expect(updatedUser!.sessionsInQueue.length).toEqual(1);
	expect(updatedUser!.sessionsInQueue[0]).toMatchObject({
		transaction: transaction.id,
		link: 'test.com',
	});
});
