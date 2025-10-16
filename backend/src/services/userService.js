import { UserModel } from "../models/userModles.js";

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
        const { username,email,password} = newUser;
        const sanitizedUser = {
            name: username?.trim(),
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

    },

    async deleteUser(userId){
        // Logic to delete a user from the database
        return UserModel.delete(userId);
    }   



};