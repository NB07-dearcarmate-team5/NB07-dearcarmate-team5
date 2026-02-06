import { Router } from 'express';
import { authenticateToken } from '../middlewares/authenticateToken';
import { validateRequest, CreateCarBody, UpdateCarBody, CarIdParams, CarListQuery } from '../structs/car.struct';
import { CarController } from '../controllers/car.controller';
import { CarService } from '../services/car.service';
import { CarRepositoryImpl } from '../repositories/car.repository';

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

export default router;

