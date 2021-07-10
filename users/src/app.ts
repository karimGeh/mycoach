import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { currentUser, errorHandler, NotFoundError } from '@mycoachorg/common';

import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { currentUserRouter } from './routes/current-user';
import { signoutRouter } from './routes/signout';

const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(
	cookieSession({
		signed: false,
		// secure: process.env.NODE_ENV !== 'test',
	}),
);
app.use(currentUser);

//! routers
app.use(signinRouter);
app.use(signupRouter);
app.use(currentUserRouter);
app.use(signoutRouter);

app.all('*', async (req, res, next) => {
	return next(new NotFoundError());
});
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
// 	console.log(err);
// 	next(err);
// });
app.use(errorHandler);

export { app };
