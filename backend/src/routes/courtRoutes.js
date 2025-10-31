import { Router } from 'express';
import { CourtController } from '../controllers/courtController.js';

const router = Router();    

router.get('/', CourtController.getAllCourts); // need 
router.get('/:id', CourtController.getCourtByID); // need 
router.post('/:id/can-join', CourtController.canJoinCourt); 
router.get('/:id/groups', CourtController.GetGroupsByCourtID); // need 
router.get('/:id/queued-groups', CourtController.getQueuedCourtsByID); // need
router.get('/:id/active-groups', CourtController.getActiveCourtsByID); // need
router.post('/:id/start', CourtController.startGame); 
router.get('/:id/players-waiting', CourtController.getPlayersWaiting); // need 


export default router;