import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.body) throw new Error('Unauthorized 401');

		if (!req.body.admin_token) throw new Error('Unauthorized 401');

		const payload = jwt.verify(
			req.body.admin_token,
			process.env.JWT_KEY_ADMIN!,
		) as any;

		if (!payload.id) throw new Error('Unauthorized 401');
		if (payload.id != process.env.ADMIN_ID) throw new Error('Unauthorized 401');
	} catch (err) {
		return res.status(401).send({});
	}

	next();
};
