import { NextFunction, Request, Response } from "express";

// DataSource
import { myDataSource } from "../../app-data-source";

// Entities
import { User } from "../../entity/user.entity";
import { UserHomeRel } from "../../entity/user-home-rel.entity";


const findUsersByHomeId = async (req: Request, res: Response, next: NextFunction) => {
    // Returns all the users related to a homeId
    const { homeId } = req.params;

    try {
        const usersRelatedToHomeId = await myDataSource.getRepository(User)
            .createQueryBuilder('user')
            .innerJoin(UserHomeRel, 'userHomeRel', 'user.user_id = userHomeRel.user_id')
            .where(`userHomeRel.home_id = ${ homeId }`)
            .getMany();
        
        return res.status(200).json({
            usersRelatedToHomeId: usersRelatedToHomeId,
        });
    } catch (error) {
        console.log(`Could not fetch users related to ${ homeId }: `, error);
        return next(error);
    }
};


export default findUsersByHomeId;