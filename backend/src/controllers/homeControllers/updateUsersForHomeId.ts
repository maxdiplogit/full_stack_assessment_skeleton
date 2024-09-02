import { NextFunction, Request, Response } from "express";

// DataSource
import { myDataSource } from "../../app-data-source";

// Entities
import { Home } from "../../entity/home.entity";
import { UserHomeRel } from "../../entity/user-home-rel.entity";


// Updates the database, mutating if the user likes a particular home or not
const updateUsersForHomeId = async (req: Request, res: Response, next: NextFunction) => {
    // homeId shall be a number and not a string
    const { homeId } = req.params;

    // newUserIds shall be numbers and not strings
    const { selectedUserId, newUserIds } = req.body;

    try {
        const userHomeRelRepository = myDataSource.getRepository(UserHomeRel);

        if (newUserIds.length === 0) {
            await userHomeRelRepository.createQueryBuilder()
                .delete()
                .from(UserHomeRel)
                .where('home_id = :homeId', { homeId })
                .execute();
    
            console.log('All users unlinked from the home');
            return res.status(204).json({
                "message": `No user interested in home: ${ homeId } now`,
                homesForUserId: [],
            });
        }
    
        // Remove users who are no longer interested in home
        await userHomeRelRepository
            .createQueryBuilder()
            .delete()
            .from(UserHomeRel)
            .where(`home_id = ${ homeId }`)
            .andWhere(`user_id NOT IN (:...newUserIds)`, { newUserIds })
            .execute();
        
        // Find existing user relations for this home
        const existingUserRelations = await userHomeRelRepository.find({ where: { home_id: Number(homeId) } });
        const existingUserIds = existingUserRelations.map(rel => rel.user_id);
    
        // Add new users who are not already related to the homeId
        const usersToAdd = newUserIds.filter((userId: number) => !existingUserIds.includes(userId));
        const newUserRelations = usersToAdd.map((userId: number) => {
            const newUserHomeRel = new UserHomeRel();
            newUserHomeRel.home_id = Number(homeId);
            newUserHomeRel.user_id = Number(userId);
            return newUserHomeRel
        });

        console.log("\n\nnewUserRelations: ", newUserRelations);
    
        if (newUserRelations.length > 0) {
            await userHomeRelRepository.save(newUserRelations);
        }
    
        return res.status(200).json({
            "message": "Database updated successfully!",
        });
    } catch (error) {
        console.log(`Could not update the user-home relations table: `, error);
        return next(error);
    }
};


export default updateUsersForHomeId;