import express from 'express';
import { authenticateToken } from '../middlewares/authenticateToken';
import { getDashboard } from '../controllers/dashboard.controller';

const dashboardRouter = express.Router();

dashboardRouter.use(authenticateToken);

dashboardRouter.get('/',getDashboard);

export default dashboardRouter;