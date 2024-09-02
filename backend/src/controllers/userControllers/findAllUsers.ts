import { NextFunction, Request, Response } from "express";

// DataSource
import { myDataSource } from "../../app-data-source";

// Entities
import { User } from "../../entity/user.entity";


const findAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    // Returns all the users
    try {
        const users = await myDataSource.getRepository(User).find();

        return res.status(200).json({
            allUsers: users,
        });
    } catch (error) {
        console.log('Could not fetch all users: ', error);
        return next(error);
    }
};


export default findAllUsers;