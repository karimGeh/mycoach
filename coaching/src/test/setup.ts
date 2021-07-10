import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import request from 'supertest';
import { app } from '../app';
import { Coach } from '../models/Coach.model';

let mongo: any;
beforeAll(async () => {
	process.env.JWT_KEY = 'karimkarimkarimkarim';
	process.env.JWT_KEY_ADMIN = 'jwtkeyadmin';
	process.env.ADMIN_ID = 'adminid';
	process.env.GOOGLE_API_KEY = 'AIzaSyDPRpU23K91XTr-ogT3ixFkuXDNUI-11wA';
	process.env.GOOGLE_CALENDAR =
		'201siimv1mci911v5odk7g12j0@group.calendar.google.com';
	// process.env.GOOGLE_API_KEY = 'AIzaSyBmJKaurSyAkqaSi6qvaENpJu11jD_bPp4';

	mongo = new MongoMemoryServer();
	await mongo.start();
	const mongoUri = mongo.getUri();

	await mongoose.connect(mongoUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
});

beforeEach(async () => {
	// await mongo.start();
	const collections = await mongoose.connection.db.collections();

	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	await mongoose.connection.close();
	await mongo.stop();
});

const CALENDAR_ID = 'k8sassdp3uac6ev93bguqf3m4c@group.calendar.google.com';

(global as any).token = jwt.sign({ id: 'adminid' }, 'jwtkeyadmin');
(global as any).createCoach = async () => {
	await request(app)
		.post('/api/coach/createcoach')
		.send({
			admin_token: (global as any).token,
			email: 'test@test.com',
			username: 'karim gehad',
			calendar: CALENDAR_ID,
		})
		.expect(201);

	const coach = await Coach.findOne({});
	return coach;
};
