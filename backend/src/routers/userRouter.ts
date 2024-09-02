import express from 'express';

// Controllers
import findAllUsers from '../controllers/userControllers/findAllUsers';
import findUsersByHomeId from '../controllers/userControllers/findUsersByHomeId';


// Router
const userRouter = express.Router();


userRouter.route('/find-all')
    .get(findAllUsers);

userRouter.route('/find-by-home/:homeId')
    .get(findUsersByHomeId);


export default userRouter;