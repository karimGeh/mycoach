import { Coach, Sports } from '../models/Coach.model';
import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import request from 'supertest';
import { app } from '../app';
import { User } from '../models/User.model';
import { Transaction } from '../models/Transaction.model';
import { Session } from '../models/Session.model';

let mongo: any;
beforeAll(async () => {
	process.env.JWT_KEY = 'karimkarimkarimkarim';
	process.env.JWT_KEY_ADMIN = 'jwtkeyadmin';
	process.env.ADMIN_ID = 'adminid';
	process.env.GOOGLE_API_KEY = 'AIzaSyDPRpU23K91XTr-ogT3ixFkuXDNUI-11wA';
	process.env.CLIENT_ID =
		'711675348523-lncv2k938d7dv9ohp21bhak2p77lshs2.apps.googleusercontent.com';
	process.env.CLIENT_SECRET = 'iV6m5_82hhfZPNgrG25tD49v';
	process.env.REDIRECT_URL = 'https://localhost:3000/oauthplayground';
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

const CALENDAR_ID = '201siimv1mci911v5odk7g12j0@group.calendar.google.com';

(global as any).token = jwt.sign({ id: 'adminid' }, 'jwtkeyadmin');
(global as any).createCoach = async () => {
	const coach = Coach.build({
		email: 'test@test.com',
		username: 'karim gehad',
		calendar: CALENDAR_ID,
		sports: Sports.yoga,
	});
	await coach.save();

	return coach;
};
(global as any).createUser = async () => {
	const user = User.build({
		email: 'test@test.com',
		username: 'karim gehad',
	});
	await user.save();

	return user;
};

(global as any).createTransaction = async (user: any, coach: any) => {
	const transaction = Transaction.build({
		coach: coach.id,
		user: user.id,
		amount: 200,
	});
	await transaction.save();

	return transaction;
};

(global as any).createSession = async (
	user: any,
	coach: any,
	transaction: any,
) => {
	const session = Session.build({
		user,
		coach,
		transaction,
		link: 'www.test.com',
		time: new Date(),
	});
	await session.save();

	return session;
};
