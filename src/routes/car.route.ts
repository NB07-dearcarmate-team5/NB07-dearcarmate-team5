import { Router } from 'express';
import { authenticateToken } from '../middlewares/authenticateToken';
import { validateRequest, CreateCarBody, UpdateCarBody, CarIdParams, CarListQuery } from '../structs/car.struct';
import { CarController } from '../controllers/car.controller';
import { CarService } from '../services/car.service';
import { CarRepositoryImpl } from '../repositories/car.repository';
import { csvUpload } from '../middlewares/fileUpload.middleware';
import { BulkUploadController } from '../controllers/bulkUpload.controller';
import { BulkUploadService } from '../services/bulkUpload.service';
import { BulkUploadRepository } from '../repositories/bulkUpload.repository';

const router = Router();

const repo = new CarRepositoryImpl();
const service = new CarService(repo);
const controller = new CarController(service);

router.get('/models', authenticateToken, controller.getCarModels);

router.post('/', authenticateToken, validateRequest('body', CreateCarBody), controller.createCar);
router.get('/', authenticateToken, validateRequest('query', CarListQuery), controller.getCars);
router.get('/:carId', authenticateToken, validateRequest('params', CarIdParams), controller.getCarById);
router.patch('/:carId', authenticateToken, validateRequest('params', CarIdParams), validateRequest('body', UpdateCarBody), controller.updateCar);
router.delete('/:carId', authenticateToken, validateRequest('params', CarIdParams), controller.deleteCar);

// 대용량 업로드
const bulkRepo = new BulkUploadRepository();
const bulkService = new BulkUploadService(bulkRepo);
const bulkController = new BulkUploadController(bulkService);

router.post('/upload', authenticateToken, csvUpload, bulkController.uploadVehicles);

export default router;

