import express, { Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { currentUser, errorHandler, NotFoundError } from '@mycoachorg/common';
import { createSessionRouter } from './routers/create-session';
import { availableSessionRouter } from './routers/available-session';

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
app.use(createSessionRouter);
app.use(availableSessionRouter);

app.all('*', async (req, res, next) => {
	return next(new NotFoundError());
});

// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
// 	console.log(err);
// 	next(err);
// });

app.use(errorHandler);

export { app };
