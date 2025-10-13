import { ReminderModel } from "../models/reminderModel.js";
import CustomError from "../utils/CustomError.js";
import ERROR_MESSAGES from '../constants/errorMessages.js';

export const ReminderService = {
  async getAllReminders(listType) {
    let completed = null;

    if (listType === "completed") {
      completed = true;
    } else if (listType === "incomplete") {
      completed = false;
    }

    return ReminderModel.getAll(completed);
  },

  async getReminderById(reminderId) {
    const reminder = await ReminderModel.findById(reminderId);
    if (!reminder) throw new CustomError(ERROR_MESSAGES.NOT_FOUND, 404);
    return reminder;
  },

  async createReminder(newReminder) {
    const { reminder, notes, userId } = newReminder;

    const sanitizedReminder = {
      reminder: reminder?.trim(),
      notes: notes?.trim(),
      userId,
    };

    const createdReminder = await ReminderModel.create(sanitizedReminder);
    return createdReminder;
  },

  async updateReminder(reminderId, newValues) {
    const { reminder, notes, completed } = newValues;

    // Build SQL dynamically
    const fields = Object.keys(newValues);
    const setClauses = fields.map((key, index) => `${key} = $${index + 1}`);
    const values = Object.values(newValues);
    values.push(reminderId); // Add ID at the end for WHERE clause

    const query = `
      UPDATE reminders 
      SET ${setClauses.join(", ")}
      WHERE id = $${values.length}
      RETURNING *;
    `;

    const updatedReminder = await ReminderModel.update(query, values);
    if (!updatedReminder) throw new CustomError(ERROR_MESSAGES.NOT_FOUND, 404);
    return updatedReminder;
  },

  async deleteReminder(reminderId) {
    const authenticatedUserId = 3;

    const reminder = await ReminderModel.findById(reminderId);

    if (!reminder) {
      throw new CustomError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    if (reminder.user_id !== authenticatedUserId) {
      throw new CustomError(ERROR_MESSAGES.FORBIDDEN, 403);
    }

    const rowCount = await ReminderModel.delete(reminderId);

    if (rowCount === 0) {
      throw new CustomError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
    }

    return { message: 'Reminder deleted successfully' };
  }
};