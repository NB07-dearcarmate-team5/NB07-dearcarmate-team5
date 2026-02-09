import express from 'express';
import { authenticateToken } from '../middlewares/authenticateToken';
import { isAdmin } from '../middlewares/admin.middleware';
import {
  createCompany,
  findCompanies,
  getCompanyUsers,
  updateCompany,
  deleteCompany,
} from '../controllers/company.controller';

const companiesRouter = express.Router();

companiesRouter.use(authenticateToken);
companiesRouter.use(isAdmin);

companiesRouter.post('/', createCompany);
companiesRouter.get('/', findCompanies);
companiesRouter.get('/users', getCompanyUsers);
companiesRouter.patch('/:companyId', updateCompany);
companiesRouter.delete('/:companyId', deleteCompany);

export default companiesRouter;
