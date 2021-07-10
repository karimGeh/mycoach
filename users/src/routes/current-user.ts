import { BadRequestError } from '@mycoachorg/common';
import express from 'express';

const router = express.Router();

router.get('/api/users/currentuser', async (req, res, next) => {
	res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
