import { GroupService } from "../services/groupService.js";


export const GroupController = {
    async createGroup(req, res, next){
        try{
            const {group_name, captain_id} = req.body;
            const newGroup = await GroupService.createGroup (group_name, captain_id);
            res.status(201).json(newGroup);
        }catch (error){
            next (error);
        }
    },

    async getGroupCount(req, res, next){
        try{
            const groupId = parseInt (req.params.id, 10);
            const count = await GroupService.getGroupCount (groupId);
            res.status (200).json ({count});
        }catch (error){
            next (error);
        }
    },



    async getAllGroups(req, res, next){
        try{
            const groups = await GroupService.getAllGroups();
            res.status(200).json(groups);
        }   
        catch (error){
            next (error);
        }
    },  
    async getGroupById (req, res, next){
        try{
            const groupId = parseInt (req.params.id, 10);
            const group = await GroupService.getGroupById (groupId);
            res.status(200).json (group);
        }catch (error){
            next (error);
        }       
    },  
    async joinCourt (req, res, next){       
        try{    
            const {courtId, groupId} = req.params;
            const updatedGroup = await GroupService.joinCourt (groupId, courtId);
            res.status (200).json (updatedGroup);

        }catch (error){
            next (error);
        }
    },  


    async leaveCourt (req, res, next){       
        try{    
            const {groupId} = req.params;
            const updatedGroup = await GroupService.leaveCourt (groupId);
            res.status (200).json (updatedGroup);
        }catch (error){
            next (error);
        }
    },

    async handleEndgame (req, res, next){
        try{
            const groupId = parseInt (req.params.id, 10);
            const {winnerGroupId} = req.params;
            const result = await GroupService.handleEndgame (groupId, winnerGroupId);
            res.status (200).json (result);
        }catch (error){
            next (error);
        }
    },
    async deleteGroup (req, res, next){
        try{
            const groupId = parseInt (req.params.id, 10);
            const result = await GroupService.deleteGroup (groupId);    
            res.status (200).json (result);
        }catch (error){
            next (error);
        }
    },

    async addUserToGroup(req, res, next) {
        try {
            const { userId, groupId } = req.params;
            const updatedUser = await GroupService.addUserToGroup(userId, groupId);
            res.status(200).json(updatedUser);
        } catch (error) {
            next(error);
        }
    },

    async startGame(req, res, next) {
        try {
            const { courtId } = req.params;
            const result = await GroupService.startGame(courtId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }   

    },

    async getGroupMembers(req, res, next) {
        try {
            const groupId = parseInt(req.params.id, 10);
            const members = await GroupService.getGroupMembers(groupId);
            res.status(200).json(members);

        } catch (error) {
            next(error);
        }
    },

    async leaveGroup(req, res, next) {
        try {
            const userId = parseInt(req.params.id, 10);
            const result = await GroupService.leaveGroup(userId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },


};