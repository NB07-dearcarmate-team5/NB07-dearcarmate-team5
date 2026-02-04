import express from 'express';
import { withAsync } from '../utils/withAsync';
import { authenticateToken } from '../middlewares/authenticateToken';
import * as customerController from '../controllers/customer.controller';

const customersRouter = express.Router();

customersRouter.use(authenticateToken);

customersRouter
.route('/')
.post(withAsync(customerController.createCustomer)) 
.get(withAsync(customerController.getCustomersList)) 

customersRouter
.route('/:customerId')
.patch(withAsync(customerController.updateCustomer)) 
.delete(withAsync(customerController.deleteCustomer)) 
.get(withAsync(customerController.getCustomer)) 

// customersRouter
// .route('/upload')
// .post(withAsync()) //고객 데이터 대용량 업로드 

export default customersRouter;