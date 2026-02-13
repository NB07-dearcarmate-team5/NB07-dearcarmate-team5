import express from 'express';
import { authenticateToken } from '../middlewares/authenticateToken';
import * as customerController from '../controllers/customer.controller';
import { csvUpload } from '../middlewares/fileUpload.middleware';
import { BulkUploadController } from '../controllers/bulkUpload.controller';
import { BulkUploadService } from '../services/bulkUpload.service';
import { BulkUploadRepository } from '../repositories/bulkUpload.repository';

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

// 대용량 업로드
const bulkRepo = new BulkUploadRepository();
const bulkService = new BulkUploadService(bulkRepo);
const bulkController = new BulkUploadController(bulkService);

customersRouter.post('/upload', csvUpload, bulkController.uploadCustomers);

export default customersRouter;