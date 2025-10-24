// routes/userRoutes.ts (or .js)
import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { validateData } from '../middlewares/validationMiddleware.js';
import { createUserSchema, updateUserSchema } from '../schemas/userSchema.js';


const router = Router();

// Order: list before param routes; put /login before /:id so it doesn't get treated as an id
router.get('/', UserController.getAllUsers);
router.post('/', validateData(createUserSchema), UserController.createUser);

router.post('/login', UserController.loginUser);

router.get('/:id', UserController.getUserById);
router.patch('/:id', validateData(updateUserSchema), UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

export default router;
