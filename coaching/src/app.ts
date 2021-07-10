import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { currentUser, errorHandler, NotFoundError } from '@mycoachorg/common';
import { createCoachRouter } from './routes/create-coach';
import { readCoachRouter } from './routes/read-coach';

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
//!  _ routers
//! 	|__ Coach
app.use(createCoachRouter);
app.use(readCoachRouter);

app.all('*', async (req, res, next) => {
	return next(new NotFoundError());
});

// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
// 	console.log(err);
// 	next(err);
// });

app.use(errorHandler);

export { app };
