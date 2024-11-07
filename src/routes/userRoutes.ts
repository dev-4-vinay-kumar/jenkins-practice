import express, { Request, Response, Router } from 'express';
import { createUser } from '../api/userController';
const router: Router = express.Router();

router.post('', createUser);

export default router;