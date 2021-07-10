import {
	NotFoundError,
	validateRequest,
	BadRequestError,
} from '@mycoachorg/common';
import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { isAdmin } from '../middlewares/isAdmin';
import { Coach } from '../models/Coach.model';
import { Session } from '../models/Session.model';
import { Transaction } from '../models/Transaction.model';
import { User } from '../models/User.model';
import { googleCalendarWrapper } from '../services/google-calendar-wrapper';
const router = express.Router();

router.post(
	'/api/session/:coachId',
	isAdmin,
	[
		body('user').notEmpty().withMessage('a valid userId is required'),
		body('transaction').notEmpty().withMessage('transaction id is required'),
	],
	validateRequest,
	async (req: Request, res: Response, next: NextFunction) => {
		const { user, transaction, time } = req.body;

		if (!mongoose.isValidObjectId(req.params.coachId))
			return next(new NotFoundError());

		if (!mongoose.isValidObjectId(user)) return next(new NotFoundError());

		if (!mongoose.isValidObjectId(transaction))
			return next(new NotFoundError());

		try {
			const coach = await Coach.findById(req.params.coachId);
			if (!coach) return next(new NotFoundError());
			const userDoc = await User.findById(user);
			if (!userDoc) return next(new NotFoundError());
			const transactionDoc = await Transaction.findById(transaction);
			if (!transactionDoc) return next(new NotFoundError());

			const session = Session.build({
				user,
				coach: req.params.coachId,
				transaction,
				time,
			});

			userDoc.sessionsInQueue.push(session);
			coach.sessionsInQueue.push(session);
			await coach.save();
			await userDoc.save();

			try {
				const respo = await googleCalendarWrapper.createSessionInCalendar(
					session,
					coach,
					userDoc,
				);
				session.link = respo.data.hangoutLink || 'null';
			} catch (error) {
				next(new BadRequestError('coach out of service'));
			}

			await session.save();
			return res.status(201).send(session);
		} catch (error) {
			console.log(error);
			return next(new NotFoundError());
		}
	},
);

export { router as createSessionRouter };
