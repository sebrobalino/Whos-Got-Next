import { ReminderService } from '../services/reminderService.js';

export const ReminderController = {
  async getAllReminders(req, res, next) {
    try {
      const { listType } = req.query;
      const reminders = await ReminderService.getAllReminders(listType);
      res.status(200).json(reminders);
    } catch (error) {
      next(error); // Pass error to errorHandlerMiddleware 
    }
  },

  async getReminderById(req, res, next) {
    try {
      const reminderId = parseInt(req.params.id, 10);
      const reminder = await ReminderService.getReminderById(reminderId);
      res.status(200).json(reminder);
    } catch (error) {
      next(error); // Pass error to errorHandlerMiddleware
    }
  },

  async createReminder(req, res, next) {
    try {
      const newReminder = await ReminderService.createReminder(req.body);
      res.status(200).json(newReminder);
    } catch (error) {
      next(error); // Pass error to errorHandlerMiddleware
    }
  },

  async updateReminder(req, res, next) {
    try {
      const reminderId = parseInt(req.params.id, 10);

      const updatedReminder = await ReminderService.updateReminder(reminderId, req.body);
      res.status(200).json(updatedReminder);
    } catch (error) {
      next(error); // Pass error to errorHandlerMiddleware
    }
  },

  async deleteReminder(req, res, next) {
    try {
      const reminderId = parseInt(req.params.id, 10);
      const reminder = await ReminderService.deleteReminder(reminderId);
      res.status(200).json(reminder);
    } catch (error) {
      next(error); // Pass error to errorHandlerMiddleware
    }
  },
};
