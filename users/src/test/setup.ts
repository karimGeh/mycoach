import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import request from 'supertest';
import { app } from '../app';

declare global {
	namespace NodeJS {
		interface Global {
			signup(): Promise<string[]>;
		}
	}
}

let mongo: any;
beforeAll(async () => {
	process.env.JWT_KEY = 'karimkarimkarimkarim';
	jest.setTimeout(6000);

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

// async function signup(user: any) {
// 	const res = await request(app)
// 		.post('/api/users/signup')
// 		.send(user)
// 		.expect(201);
// 	const cookie = res.get('Set-Cookie');
// 	return cookie;
// }

// const _global = (window /* browser */ || global) /* node */ as any;

// _global.signup = signup;

(global as any).signup = async (user: any) => {
	const res = await request(app)
		.post('/api/users/signup')
		.send(user)
		.expect(201);
	const cookie = res.get('Set-Cookie');
	return cookie;
};
