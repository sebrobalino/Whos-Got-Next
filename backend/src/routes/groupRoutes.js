import { Router } from 'express';
import { GroupController } from '../controllers/groupsController.js';


const router = Router();

router.post('/', GroupController.createGroup);
router.get('/', GroupController.getAllGroups);
router.get('/:id', GroupController.getGroupById);
router.post('/:groupId/courts/:courtId', GroupController.joinCourt);
router.post('/:groupId/users/:userId', GroupController.addUserToGroup);
router.post('/:groupId/leave-court', GroupController.leaveCourt);
router.post('/:id/endgame', GroupController.handleEndgame);
router.delete('/:id', GroupController.deleteGroup);
router.get('/:id/count', GroupController.getGroupCount);
router.post('/:id/start', GroupController.startGame); // not working yet
router.get('/:id/members', GroupController.getGroupMembers); // New route for getting group members
router.post('/:id/leave', GroupController.leaveGroup); // New route for leaving a group


export default router;