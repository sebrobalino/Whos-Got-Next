import db from '../config/db.js';

export const CourtsModel= {
    async getAll(){
        const result = await db.query('SELECT * from Courts ORDER BY name ASC');
        return result.rows;
    },

    async getCourtByID(id){
        const result = await db.query('SELECT * from Courts WHERE id = $1', [id]);
        return result.rows[0];      

    },

    async canJoinCourt(court_id, groupSize){
        const result = await db.query(
            'SELECT COUNT(u.id) AS total_players From users u JOIN groups g ON u.group_id = g.id WHERE g.court_id = $1',
            [court_id]
        );

        const totalPlayers = parseInt(result.rows[0].total_players, 10);
        const courtresult = await db.query('SELECT capacity FROM Courts WHERE id = $1', [court_id]);
        const courtCapacity = courtresult.rows[0].capacity;

        return (totalPlayers + groupSize) <= courtCapacity;
    },

    async GetGroupsByCourtID(court_id){
        const result = await db.query('SELECT * from Groups WHERE court_id = $1', [court_id]);
        return result.rows;
    },

    async getQueuedCourtsByID(court_id){
        const result = await db.query('SELECT * from Groups WHERE court_id = $1 AND status = $2 ORDER by created_at', [court_id, 'queued']);
        return result.rows;
    },

    // async setCourtStatus(id, status){
    //     const result = await db.query(
    //         'UPDATE courts SET status = $1 WHERE id = $2 RETURNING *',
    //         [status, id]
    //     );
    //     return result.rows[0];
    // }

    async getPlayersWaiting(court_id){
        const result = await db.query(
            `SELECT u.id, u.name, u.group_id
             FROM usertest u
             JOIN groups g ON u.group_id = g.id
             WHERE g.court_id = $1 AND g.status = 'queued'`,
            [court_id]
        );
        return result.rows;
    }


    


}