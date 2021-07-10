import { NotFoundError, validateRequest } from '@mycoachorg/common';
import express, { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import { isAdmin } from '../middlewares/isAdmin';
import { Coach, Sports } from '../models/Coach.model';
import { calendarObject } from '../services/calendar';

const router = express.Router();

router.post(
	'/api/coach/createcoach',
	isAdmin,
	[
		body('username')
			.trim()
			.isLength({ min: 5 })
			.withMessage(
				'username must be between 5 and 20 characters and must contain only alphanumeric characters',
			),
		body('email').isEmail(),
		body('calendar').notEmpty(),
	],
	validateRequest,
	async (req: Request, res: Response, next: NextFunction) => {
		const { calendar, email, username } = req.body;
		let isCalendarValid = await calendarObject.isValid(calendar);

		if (!isCalendarValid) {
			return next(new NotFoundError());
		}

		const coach = Coach.build({
			calendar,
			email,
			username,
			sports: Sports.yoga,
		});
		await coach.save();

		res.status(201).send(coach);
	},
);

export { router as createCoachRouter };
