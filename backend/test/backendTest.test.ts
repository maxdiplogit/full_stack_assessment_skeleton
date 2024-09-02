import request from 'supertest';
import app, { server } from '../src/index';
import { myDataSource } from '../src/app-data-source';

describe('User API', () => {
    beforeAll(async () => {
        try {
            await myDataSource.initialize();
            console.log('MySQL Database Connected for Testing');
        } catch (error) {
            console.error('Error establishing MySQL database connection for testing: ', error);
            process.exit(1);
        }
    });

    it('should return all users', async () => {
        const response = await request(app).get('/user/find-all').expect(200);
        expect(response.body).toBeInstanceOf(Object);
    });

    it('should return all users related to a home', async () => {
        const homeId = 1;
        const response = await request(app).get(`/user/find-by-home/${ homeId }`).expect(200);
        expect(response.body).toBeInstanceOf(Object);
    });

    it('should return all homes related to a user', async () => {
        const response = await request(app).get('/home/find-by-user/1').expect(200);
        expect(response.body).toBeInstanceOf(Object);
    });

    it('should update users for a home', async () => {
        const homeId = 1;
        const newUserIds = [9, 10];
        const response = await request(app)
            .put(`/home/update-users/1`)
            .send({ selectedUserId: 1, newUserIds: newUserIds })
            .expect(200);
        expect(response.body).toBeInstanceOf(Object);
    });

    afterAll(async () => {
        try {
            await myDataSource.destroy();
            server.close(() => {
                console.log('test server closed');
            })
            console.log('MySQL Database Connection Closed');
        } catch (error) {
            console.error('Error closing MySQL database connection: ', error);
            process.exit(1);
        }
    });
});