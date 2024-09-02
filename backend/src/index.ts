import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// DataSource
import { myDataSource } from './app-data-source';

// Entities
import { User } from './entity/user.entity';
import { Home } from './entity/home.entity';
import { UserHomeRel } from './entity/user-home-rel.entity';

// Routers
import userRouter from './routers/userRouter';
import homeRouter from './routers/homeRouter';


// Configure Environment Variables
dotenv.config();


// Environment Variables
const {
	PORT,
	FRONT_URL,
} = process.env;


// Establish MySql Database Connection
myDataSource
	.initialize()
	.then(() => {
		console.log('MySQL Database Connected');
	})
	.catch((error) => {
		console.log('Error establishing MySQL database connection: ', error);
	});


// Express App
const app = express();


// Middlewares
app.use(cors({
	origin: FRONT_URL
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Routes
app.use('/user', userRouter);
app.use('/home', homeRouter);

app.get('/', async (req: Request, res: Response) => {
	return res.status(200).send("Backend");
});


// Start Express Server
export const server = app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});


export default app;