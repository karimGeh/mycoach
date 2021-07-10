import request from 'supertest';
import { app } from '../../app';

it('returns 404 if a coach not found', async () => {
	await request(app)
		.get('/api/coach/dlhaslgdhsahghkshdgalkh')
		.send()
		.expect(404);
}, 10000);

it('returns 200 and the user if the id is valid and in the database', async () => {
	const coach = await (global as any).createCoach();

	const coachResponse = await request(app)
		.get(`/api/coach/${coach.id}`)
		.send()
		.expect(200);

	expect(coachResponse.body.id).toEqual(coach.id.toString());
}, 10000);
