import { Router } from 'express';
import { validateData } from '../middlewares/validationMiddleware.js';
import { ReminderController } from '../controllers/reminderController.js';
import { createReminderSchema, updateReminderSchema } from '../schemas/reminderSchema.js'

const router = Router();

router.get('/', ReminderController.getAllReminders)
router.get('/:id', ReminderController.getReminderById)
router.post('/', validateData(createReminderSchema), ReminderController.createReminder)
router.patch('/:id', validateData(updateReminderSchema), ReminderController.updateReminder)
router.delete('/:id', ReminderController.deleteReminder)

export default router;