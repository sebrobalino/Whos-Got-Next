import { UserService } from "../services/userService.js";

export const UserController = {
    async getAllUsers(req, res,next){
        try{
            const users = await UserService.getAllUsers();
            res.status(200).json(users);
        }catch (error){
            next(error);
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

     

    async createUser(req, res,next){
        try{
            const newUser = await UserService.createUser(req.body);
            res.status(200).json(newUser);
        }catch (error){
            next(error);
        }
    },

    async updateUser(req, res,next){
        try{
            const userId = parseInt(req.params.id, 10);
            const updatedUser = await UserService.updateUser(userId, req.body);
            res.status(200).json(updatedUser);
        }catch (error){
            next(error);
        }
    },

    async deleteUser(req, res,next){
        try{
            const userId = parseInt(req.params.id, 10);
            const user = await UserService.deleteUser(userId);
            res.status(200).json(user);
        }catch (error){
            next(error);
        }

    },

   async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await UserService.loginUser(email, password);
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      res.json(user);
    } catch (err) {
      next(err);
    }
}
        

};