import { NotFoundError } from '@mycoachorg/common';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Coach } from '../models/Coach.model';

const router = express.Router();

router.get(
	'/api/coach/:id',
	async (req: Request, res: Response, next: NextFunction) => {
		if (!mongoose.isValidObjectId(req.params.id)) {
			return next(new NotFoundError());
		}

		try {
			const coach = await Coach.findById(req.params.id);

			if (!coach) return next(new NotFoundError());

			return res.send(coach);
		} catch (error) {
			console.error(error);

			return next(new NotFoundError());
		}
	},
);

export { router as readCoachRouter };
