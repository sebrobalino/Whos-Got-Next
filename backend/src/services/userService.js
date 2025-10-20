import { UserModel } from "../models/userModles.js";
import CustomError from "../utils/CustomError.js";
import ERROR_MESSAGES from '../constants/errorMessages.js';


export const UserService = {
    async getAllUsers(){
        // Logic to get all users from the database
        return UserModel.getAll();
    },

    async getUserById(userId){
        // Logic to get a user by ID from the database
        const user = await UserModel.findByID(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },

    async createUser(newUser){
        // Logic to create a new user in the database
        const { name,email,password} = newUser;
        const sanitizedUser = {
            name: name?.trim(),
            email: email?.trim().toLowerCase(),
            password: password?.trim()
        };
        const createdUser = await UserModel.create(sanitizedUser);
        return createdUser;
    },

    async updateUser(userId, newValues){
        // Logic to update a user in the database
         const { name, email, password } = newValues;

        // Build SQL dynamically
        const fields = Object.keys(newValues);
        const setClauses = fields.map((key, index) => `${key} = $${index + 1}`);
        const values = Object.values(newValues);
        values.push(userId); // Add ID at the end for WHERE clause

        const query = `
        UPDATE usertest
        SET ${setClauses.join(", ")}
        WHERE id = $${values.length}
        RETURNING *;
        `;

         const updatedUser = await UserModel.update(query, values);
        if (!updatedUser) throw new CustomError(ERROR_MESSAGES.NOT_FOUND, 404);
        return updatedUser;

    },

    async deleteUser(userId){
    // Logic to delete a user from the database
    

    const user = await UserModel.findByID(userId);

    if (!user) {
      throw new CustomError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

   

    const rowCount = await UserModel.delete(userId);

    if (rowCount === 0) {
      throw new CustomError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
    }

    return { message: 'User deleted successfully' };

    },

    async loginUser(email, password) {
    const user = await UserModel.findByEmail(email);
    if (!user) return null;

    // ⚠️ If you’re storing hashed passwords, verify them with bcrypt here
    if (user.password !== password) return null;

    return user; // or generate a JWT if you want sessions
  },



};