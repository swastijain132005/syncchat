import express from 'express'
import { signup,login } from '../controllers/user.controller.js'
import { authmiddleware, checkAuth } from '../middleware/auth.js'

const userRouter = express.Router();


userRouter.use(authmiddleware);
userRouter.get('/checkAuth',checkAuth);

userRouter.post('/signup',signup);
userRouter.post('/login',login);

export default userRouter;