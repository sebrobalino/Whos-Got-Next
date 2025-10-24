import { Router } from 'express';
import { CourtController } from '../controllers/courtController.js';

const router = Router();    

router.get('/', CourtController.getAllCourts);
router.get('/:id', CourtController.getCourtByID);
router.post('/:id/can-join', CourtController.canJoinCourt);
router.get('/:id/groups', CourtController.GetGroupsByCourtID);
router.get('/:id/queued-groups', CourtController.getQueuedCourtsByID);
router.post('/:id/start', CourtController.startGame);
router.get('/:id/players-waiting', CourtController.getPlayersWaiting);


export default router;