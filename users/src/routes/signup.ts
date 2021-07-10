import { validateRequest, User, BadRequestError } from '@mycoachorg/common';
import express, { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
	'/api/users/signup',
	[
		body('email').isEmail().withMessage('Email Must Be Valid'),
		body('password')
			.trim()
			.isLength({ min: 6, max: 20 })
			.withMessage('Password must be between 6 and 20 characters'),
		body('username')
			.trim()
			.isLength({ min: 5, max: 20 })
			.isAlphanumeric()
			.withMessage(
				'username must be between 5 and 20 characters and must contain only alphanumeric characters',
			),
	],
	validateRequest,
	async (req: Request, res: Response, next: NextFunction) => {
		const { username, email, password } = req.body;

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			// console.log(existingUser);
			return next(new BadRequestError('Email already exists'));
			// throw new BadRequestError('Email already exists');
			// return;
		}

		const user = new User({ username, email, password });
		await user.save();

		// console.log(user.toJSON());

		const token = jwt.sign(user.toJSON(), process.env.JWT_KEY!);
		req.session = {
			jwt: token,
		};

		return res.status(201).send({});
	},
);

export { router as signupRouter };
