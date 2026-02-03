import express from 'express';
import { authenticateToken } from '../middleware/authenticateToken';
import { isAdmin } from '../middleware/admin.middleware';
import {
  createCompany,
  findCompanies,
  getCompanyUsers,
  updateCompany,
} from '../controllers/company.controller';

const companiesRouter = express.Router();

companiesRouter.use(authenticateToken);
companiesRouter.use(isAdmin);

companiesRouter.post('/', createCompany);
companiesRouter.get('/', findCompanies);
companiesRouter.get('/users', getCompanyUsers);
companiesRouter.patch('/:companyId', updateCompany);

export default companiesRouter;
