import express from 'express';
import { authenticateToken } from '../middlewares/authenticateToken';
import * as customerController from '../controllers/customer.controller';

const customersRouter = express.Router();

customersRouter.use(authenticateToken);

customersRouter
.route('/')
.post(customerController.createCustomer) 
.get(customerController.getCustomersList) 

customersRouter
.route('/:customerId')
.patch(customerController.updateCustomer)
.delete(customerController.deleteCustomer)
.get(customerController.getCustomer)

// customersRouter
// .route('/upload')
// .post()) //고객 데이터 대용량 업로드 

export default customersRouter;