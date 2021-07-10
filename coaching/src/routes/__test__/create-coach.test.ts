import request from 'supertest';
import { app } from '../../app';
import { Coach } from '../../models/Coach.model';

const CALENDAR_ID = 'k8sassdp3uac6ev93bguqf3m4c@group.calendar.google.com';
// jest.setTimeout(6);

it('returns 401 when not admin', async () => {
	await request(app)
		.post('/api/coach/createcoach')
		.send({
			email: 'test@test.com',
			username: 'karim gehad',
			calendar: 'daskhfdajsaskfjsa',
		})
		.expect(401);
});

it('returns 400 with invalid email || invalid username || no calendar link', async () => {
	await request(app)
		.post('/api/coach/createcoach')
		.send({
			admin_token: (global as any).token,
		})
		.expect(400);
	await request(app)
		.post('/api/coach/createcoach')
		.send({
			admin_token: (global as any).token,
			email: 'testtest.com',
			username: 'karim gehad',
			calendar: 'daskhfdajsaskfjsa',
		})
		.expect(400);
	await request(app)
		.post('/api/coach/createcoach')
		.send({
			admin_token: (global as any).token,
			email: 'test@test.com',
			username: 'karim gehad',
			calendar: '',
		})
		.expect(400);
});

it('returns 404 if calendar link is not valid', async () => {
	await request(app)
		.post('/api/coach/createcoach')
		.send({
			admin_token: (global as any).token,
			email: 'test@test.com',
			username: 'karim gehad',
			calendar: 'safkhsalkhjlsaj',
		})
		.expect(404);
});

it(
	'returns 201 if calendar link is valid',
	async () => {
		console.log(CALENDAR_ID);

		await request(app)
			.post('/api/coach/createcoach')
			.send({
				admin_token: (global as any).token,
				email: 'test@test.com',
				username: 'karim gehad',
				calendar: CALENDAR_ID,
			})
			.expect(201);
	},
	10 * 1000,
);

it('saves the coach to the database', async () => {
	let coaches = await Coach.find({});

	await request(app)
		.post('/api/coach/createcoach')
		.send({
			admin_token: (global as any).token,
			email: 'test@test.com',
			username: 'karim gehad',
			calendar: CALENDAR_ID,
		})
		.expect(201);

	coaches = await Coach.find({});
	expect(coaches.length).toEqual(1);
});
