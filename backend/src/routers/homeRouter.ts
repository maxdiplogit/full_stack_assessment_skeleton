import express from 'express';

// Controllers
import findHomesByUserId from '../controllers/homeControllers/findHomesByUserId';
import updateUsersForHomeId from '../controllers/homeControllers/updateUsersForHomeId';


// Router
const homeRouter = express.Router();


homeRouter.route('/find-by-user/:userId')
    .get(findHomesByUserId);

homeRouter.route('/update-users/:homeId')
    .put(updateUsersForHomeId);


export default homeRouter;