import { UserService } from "../services/userService.js";

export const UserController = {
    async getAllUsers(req, res){
        try{
            const users = await UserService.getAllUsers();
            res.status(200).json(users);
        }catch (error){
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getUserById(req, res, next){
        try{
        const userId = parseInt(req.params.id, 10)
        const user = await UserService.getUserById(userId);
        res.status(200).json(user);
        }catch (error){
            next(error);
        }
    },

     

    async createUser(req, res){
        try{
            const newUser = await UserService.createUser(req.body);
            res.status(200).json(newUser);
        }catch (error){
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async updateUser(req, res){
        try{
            const userId = parseInt(req.params.id, 10);
            const updatedUser = await UserService.updateUser(userId, req.body);
            res.status(200).json(updatedUser);
        }catch (error){
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async deleteUser(req, res){
        try{
            const userId = parseInt(req.params.id, 10);
            const user = await UserService.deleteUser(userId);
            res.status(200).json(user);
        }catch (error){
            res.status(500).json({ error: 'Internal Server Error' });
        }

    },

};