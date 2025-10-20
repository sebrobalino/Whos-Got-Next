
import { Router } from 'express';
import { UserController } from '../controllers/userController.js';


const router = Router();

router.post('/', UserController.createUser);

router.get('/:id', UserController.getUserById);

router.get('/', UserController.getAllUsers);

router.patch('/:id', UserController.updateUser);

router.delete('/:id', UserController.deleteUser);

export default router;
