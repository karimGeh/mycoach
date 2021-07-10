import {
	BadRequestError,
	Password,
	User,
	validateRequest,
} from '@mycoachorg/common';
import express, { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
	'/api/users/signin',
	[
		body('email').isEmail().withMessage('email is required'),
		body('password').not().isEmpty().withMessage('password is required'),
	],
	validateRequest,
	async (req: Request, res: Response, next: NextFunction) => {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		// console.log(user);

		if (!user) {
			return next(new BadRequestError('Invalid Credentials'));
		}

		if (!(await Password.authenticate(user.password, password))) {
			return next(new BadRequestError('Invalid Credentials'));
		}

		const token = jwt.sign(user.toJSON(), process.env.JWT_KEY!);
		req.session = {
			jwt: token,
		};
		return res.send({});
	},
);

export { router as signinRouter };
