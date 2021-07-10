import { BadRequestError, NotFoundError } from '@mycoachorg/common';
import express, { NextFunction, Request, Response } from 'express';
import { Coach } from '../models/Coach.model';
import { filterSession } from '../services/filterSession';
import { googleCalendarWrapper } from '../services/google-calendar-wrapper';

const router = express.Router();

router.get(
	'/api/session/:coachId',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const coach = await Coach.findById(req.params.coachId).populate(
				'sessionsInQueue',
			);
			if (!coach) return next(new NotFoundError());

			let { events, errors } =
				await googleCalendarWrapper.listAvailableSessions(coach);

			let sessionsInQueue = coach.sessionsInQueue.map(
				(session) => session.time,
			);

			if (errors) {
				next(new BadRequestError('coach out of service'));
			}

			// console.log(events);
			// console.log(coach);
			events = filterSession(events, sessionsInQueue);
			res.send({ events: events });
		} catch (error) {
			return next(new NotFoundError());
		}
	},
);

export { router as availableSessionRouter };
