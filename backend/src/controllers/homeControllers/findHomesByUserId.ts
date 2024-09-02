import { NextFunction, Request, Response } from "express";

// DataSource
import { myDataSource } from "../../app-data-source";

// Entities
import { Home } from "../../entity/home.entity";
import { UserHomeRel } from "../../entity/user-home-rel.entity";


const findHomesByUserId = async (req: Request, res: Response, next: NextFunction) => {
    // Returns all homes related to a userId
    const { userId } = req.params;

    const { page, limit } = req.query;

    const pageNumber = parseInt(page as string, 10) || 1;
    const limitSize = parseInt(limit as string, 10) || 50;

    const skip = (pageNumber - 1) * limitSize;


    try {
        const [homesRelatedToUserId, total] = await myDataSource.getRepository(Home)
            .createQueryBuilder('home')
            .innerJoin(UserHomeRel, 'userHomeRel', 'home.home_id = userHomeRel.home_id')
            .where(`userHomeRel.user_id = ${ userId }`)
            .skip(skip)
            .take(limitSize)
            .getManyAndCount();
        
        return res.status(200).json({
            homesRelatedToUserId: homesRelatedToUserId,
            total,
            page,
            totalPages: Math.ceil(total / limitSize),
        });
    } catch (error) {
        console.log(`Could not fetch homes related to ${ userId }: `, error);
        return next(error);
    }
};


export default findHomesByUserId;