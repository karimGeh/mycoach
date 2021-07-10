import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { googleCalendarWrapper } from '../../services/google-calendar-wrapper';
// import { Calendar } from '../../services/testFiles/calendar';

it('returns 404 if coach id is not valid', async () => {
	await request(app).get('/api/session/fsakjhks').send().expect(404);
});

it('returns 404 if coach does not exist', async () => {
	await request(app)
		.get(`/api/session/${new mongoose.Types.ObjectId().toHexString()}`)
		.send()
		.expect(404);
});

it('returns 200 with list of available sessions when coach in database', async () => {
	const coach = await (global as any).createCoach();
	const user = (await (global as any).createUser()).toJSON();
	const transaction = (
		await (global as any).createTransaction(user, coach)
	).toJSON();

	let time: Date;
	const available = await googleCalendarWrapper.listAvailableSessions(coach);
	if (available.events?.length) {
		time = new Date(available.events[0]!);
	} else {
		time = new Date();
		time.setDate(time.getDate() + 1);
	}

	await request(app)
		.post(`/api/session/${coach._id}`)
		.send({
			admin_token: (global as any).token,
			user: user.id,
			link: 'test.com',
			time: time.toISOString(),
			transaction: transaction.id,
		})
		.expect(201);

	const availableSessions = await request(app)
		.get(`/api/session/${coach.id}`)
		.send()
		.expect(200);

	console.log(available.events);

	if (available.events?.length) {
		expect(availableSessions.body.events.length).toEqual(
			available.events?.length - 1,
		);
	} else {
		expect(availableSessions.body.events.length).toEqual(0);
	}
	// console.log(availableSessions.body);
});
