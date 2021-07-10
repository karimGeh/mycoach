import jwt from 'jsonwebtoken';
// running tsc --init is a very important command

import mongoose from 'mongoose';

import { app } from './app';
import { Coach, Sports } from './models/Coach.model';
import { User } from './models/User.model';
import { Transaction } from './models/Transaction.model';
import { Session } from './models/Session.model';
import { googleCalendarWrapper } from './services/google-calendar-wrapper';

process.env.JWT_KEY = 'karimkarimkarimkarim';
process.env.JWT_KEY_ADMIN = 'jwtkeyadmin';
process.env.ADMIN_ID = 'adminid';
process.env.GOOGLE_API_KEY = 'AIzaSyDPRpU23K91XTr-ogT3ixFkuXDNUI-11wA';
process.env.GOOGLE_CLIENT_ID =
	'711675348523-1bf4b1jcvl2j4d7t9n5a07euq4hbgcgh.apps.googleusercontent.com';
process.env.GOOGLE_CLIENT_SECRET = 'NRPym0oBM9D37bSOOfbOyhJg';
process.env.GOOGLE_REDIRECT_URL = 'http://127.0.0.1:3000/oauthplayground';
process.env.GOOGLE_CALENDAR =
	'k8sassdp3uac6ev93bguqf3m4c@group.calendar.google.com';
// '201siimv1mci911v5odk7g12j0@group.calendar.google.com';
process.env.MONGO_URL = 'mongodb://localhost:27017/sessions';
process.env.GOOGLE_REFRESH_TOKEN =
	'1//04YYdDJ2uc_k_CgYIARAAGAQSNwF-L9Ir-cEXHxwIzw4_30KjJKsC2UThBGLK-Ti5jUvU7YEeJCpUC2-dyiZl9KFymuwxdeRqtFQ';
process.env.GOOGLE_ACCESS_TOKEN =
	'ya29.a0ARrdaM8bUAURCfVxyjf6CUO8D1cmG7rUNXRHW_sJDFEb11POXC_ezEaw7IasmW6kH6UMscmUO7kUpmb_4WmxxGEyo40KyrugLh6o9uXrr0hDQIP_idNIAGZ4TgWeLr_lI5IKEyPPDxs-qE71nF1gk_kHDRBV';
const start = async () => {
	//! checking that all env are there
	//TODO: write checks

	try {
		await googleCalendarWrapper.authenticate({
			client_id: process.env.GOOGLE_CLIENT_ID as string,
			client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
			redirect_url: process.env.GOOGLE_REDIRECT_URL as string,
			refresh_token: process.env.GOOGLE_REFRESH_TOKEN as string,
			access_token: process.env.GOOGLE_ACCESS_TOKEN as string,
		});

		console.log('authenticated to google');
	} catch (err) {
		console.log('!!! NOT AUTHENTICATED to google');
		console.error(err);
	}

	try {
		await mongoose.connect(process.env.MONGO_URL as string, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});

		console.log('Connected to MongoDb');
	} catch (err) {
		console.log('NOT CONNECTED TO MONGODB');
		console.error(err);
	}

	app.listen(3000, async () => {
		console.log('Listening on port 3000');

		// const coach = (await (global as any).createCoach()).toJSON();
		// const user = (await (global as any).createUser()).toJSON();
		// const transaction = (
		// 	await (global as any).createTransaction(user, coach)
		// ).toJSON();

		// console.log('USER  : ', user);
		// console.log('COACH : ', coach);
		// console.log('Transaction : ', transaction);
		// console.log();
	});
};

(global as any).token = jwt.sign({ id: 'adminid' }, 'jwtkeyadmin');
(global as any).createCoach = async () => {
	const coach = Coach.build({
		email: 'gehadsaddeldin.karim@ensam-casa.ma',
		username: 'karim gehad',
		calendar: 'c_u2o6uid9ohfdem1om303kl10a8@group.calendar.google.com',
		sports: [Sports.yoga],
	});
	await coach.save();

	return coach;
};
(global as any).createUser = async () => {
	const user = User.build({
		email: 'abdojihad930@gmail.com',
		username: 'abdulrahman gehad',
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

if (!process.env.GOOGLE_API_KEY) {
	throw new Error('GOOGLE_API_KEY must be defined');
} else if (!process.env.GOOGLE_CLIENT_ID) {
	throw new Error('GOOGLE_CLIENT_ID must be defined');
} else if (!process.env.GOOGLE_CLIENT_SECRET) {
	throw new Error('GOOGLE_CLIENT_SECRET must be defined');
} else if (!process.env.GOOGLE_REDIRECT_URL) {
	throw new Error('GOOGLE_REDIRECT_URL must be defined');
} else if (!process.env.GOOGLE_REFRESH_TOKEN) {
	throw new Error('GOOGLE_REFRESH_TOKEN must be defined');
} else if (!process.env.GOOGLE_ACCESS_TOKEN) {
	throw new Error('GOOGLE_ACCESS_TOKEN must be defined');
} else if (!process.env.JWT_KEY) {
	throw new Error('JWT_KEY must be defined');
} else if (!process.env.JWT_KEY_ADMIN) {
	throw new Error('JWT_KEY_ADMIN must be defined');
} else if (!process.env.ADMIN_ID) {
	throw new Error('ADMIN_ID must be defined');
} else if (!process.env.MONGO_URL) {
	throw new Error('MONGO_URL must be defined');
} else {
	start();
}
