import {CourtsModel} from '../models/courtsModel.js';
import db from '../config/db.js';

export const CourtsService = {
    async getAllCourts(){
        return CourtsModel.getAll();
    },

    async getCourtById(courtId){
        const court = await CourtsModel.getCourtByID(courtId);
        if (!court) {
            throw new Error('Court not found');
        }
        return court;
    },

    async canJoinCourt(court_id, groupSize){
        return CourtsModel.canJoinCourt(court_id, groupSize);
    }, // Does not really work and is not needed because logic is in groupService.js

    async GetGroupsByCourtID(court_id){
        return CourtsModel.GetGroupsByCourtID(court_id);
    },

    async getQueuedCourtsByID(court_id){
        return CourtsModel.getQueuedCourtsByID(court_id);
    },

    async startGame(courtId) {
    // 1. Get all active players on this court ordered by join time
    const playersResult = await db.query(`
        SELECT u.id, u.name, u.group_id, u.created_at
        FROM usertest u
        JOIN groups g ON u.group_id = g.id
        WHERE g.court_id = $1 AND g.status = 'active'
        ORDER BY u.created_at ASC
    `, [courtId]);

    const players = playersResult.rows;

    // 2. Only start if we have enough players (e.g., 10)
    if (players.length < 10) {
        return { message: "Not enough players to start a game yet." };
    }

    // 3. Split into first 5 and next 5
    const teamA = players.slice(0, 5);
    const teamB = players.slice(5, 10);

    // 4. Create two new groups for this game
    const groupA = await db.query(
        `INSERT INTO groups (group_name, status, court_id, team)
         VALUES ('Team A', 'playing', $1, 'A')
         RETURNING id`,
        [courtId]
    );
    const groupB = await db.query(
        `INSERT INTO groups (group_name, status, court_id, team)
         VALUES ('Team B', 'playing', $1, 'B')
         RETURNING id`,
        [courtId]
    );

    const groupAId = groupA.rows[0].id;
    const groupBId = groupB.rows[0].id;

    // 5. Assign users to their new game groups
    for (const player of teamA) {
        await db.query(
            'UPDATE usertest SET group_id = $1 WHERE id = $2',
            [groupAId, player.id]
        );
    }

    for (const player of teamB) {
        await db.query(
            'UPDATE usertest SET group_id = $1 WHERE id = $2',
            [groupBId, player.id]
        );
    }

    // 6. Mark any other waiting groups as queued or inactive
    await db.query(
        `UPDATE groups
         SET status = 'completed'
         WHERE court_id = $1 AND status = 'active'`,
        [courtId]
    );

    return {
        message: "Game started!",
        courtId,
        teams: {
            teamA: groupAId,
            teamB: groupBId
        }
    };
    },

    async getPlayersWaiting(court_id){
        return CourtsModel.getPlayersWaiting(court_id);
    }
    




    

    
};  