import express from 'express'
import { signup,login,checkAuth,updateProfile } from '../controllers/user.controller.js'
import { authmiddleware } from '../middleware/auth.js'

const userRouter = express.Router();


userRouter.get('/checkAuth',authmiddleware,checkAuth);
userRouter.put("/updateProfile", (req, res) => {
    console.log("UPDATE PROFILE ROUTE HIT");
    res.json({ success: true });
});
userRouter.post('/signup',signup);
userRouter.post('/login',login);

export default userRouter;