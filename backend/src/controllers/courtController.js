import {CourtsService} from '../services/courtsService.js';

export const CourtController = {
    async getAllCourts(req, res, next){
        try{
            const courts = await CourtsService.getAllCourts();
            res.status(200).json(courts);
        }catch (error){
            next(error);
        }
    },

    async GetGroupsByCourtID(req, res, next){
        try{
            const courtId = parseInt(req.params.id, 10);    
            const groups = await CourtsService.GetGroupsByCourtID(courtId);
            res.status(200).json(groups);
        }catch (error){
            next(error);
        }
    },


    async getCourtByID(req, res, next){
        try{
        const courtId = parseInt(req.params.id, 10);
        const court = await CourtsService.getCourtById(courtId);
        res.status(200).json(court);
        }catch (error){
            next(error);
        }
    },

    async canJoinCourt(req, res, next){
        try{
            const courtId = parseInt(req.params.id, 10);
            const groupSize = parseInt(req.body.groupSize, 10);
            const canJoin = await CourtsService.canJoinCourt(courtId, groupSize);
            res.status(200).json({ canJoin });
        }catch (error){
            next(error);
        }
    },

    async getQueuedCourtsByID(req, res, next){
        try{
            const courtId = parseInt(req.params.id, 10);
            const queuedGroups = await CourtsService.getQueuedCourtsByID(courtId);
            res.status(200).json(queuedGroups);
        }catch (error){
            next(error);
        }

    },

    async getActiveCourtsByID(req, res, next){
        try{
            const courtId = parseInt(req.params.id, 10);
            const queuedGroups = await CourtsService.getActiveCourtsByID(courtId);
            res.status(200).json(queuedGroups);
        }catch (error){
            next(error);
        }

    },

    async startGame(req, res, next) {
        try {
            const courtId = parseInt(req.params.id, 10);
            const result = await CourtsService.startGame(courtId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
    
    
    async getPlayersWaiting(req, res, next){
        try{
            const courtId = parseInt(req.params.id, 10);
            const players = await CourtsService.getPlayersWaiting(courtId);
            res.status(200).json(players);
        }catch (error){
            next(error);
        }
    },

    // backend/src/controllers/courtController.js
    // controllers/courtController.js
 async endGameOnCourt(req, res, next) {
  try {
    const courtId = Number(req.params.id);
    const winnerGroupId = Number(req.params.winnerGroupId);

    // one-time helpful debug
    console.log('[CTRL endGame] params:', req.params);

    if (!Number.isFinite(courtId) || !Number.isFinite(winnerGroupId)) {
      return res.status(400).json({ message: 'Invalid ids' });
    }

    const result = await CourtsService.endGameOnCourt(courtId, winnerGroupId);
    if (result?.error) {
      return res.status(result.statusCode || 400).json({ message: result.error });
    }
    return res.json(result);
  } catch (err) {
    next(err);
  }
}



}