// running tsc --init is a very important command

import mongoose from 'mongoose';

import { app } from './app';

const start = async () => {
	//! checking that all env are there
	//TODO: write checks
	if (!process.env.JWT_KEY) {
		throw new Error('JWT_KEY must be defined');
	}
	if (!process.env.MONGO_URL) {
		throw new Error('MONGO_URI must be defined');
	}
	try {
		await mongoose.connect(process.env.MONGO_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		console.log('connected to MongoDb');
	} catch (err) {
		console.log('NOT CONNECTED TO MONGODB');
		console.error(err);
	}

	app.listen(3000, () => {
		console.log('Listening on port 3000');
	});
};

start();
