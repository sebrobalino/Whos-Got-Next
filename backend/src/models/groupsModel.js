import db from '../config/db.js';


export const GroupsModel = {

    async createGroup(group_name){
        const result = await db.query (
            'INSERT INTO Groups (group_name,priority,court_id) VALUES ($1, $2, $3) RETURNING *',
            [group_name, false, null]
        );
        return result.rows[0];
    },

    async getAllGroups(){
        const result = await db.query('SELECT * from Groups ORDER BY created_at DESC');
        return result.rows;
    },

    async getGroupByID(id){
        const result = await db.query('SELECT * from Groups WHERE id = $1 ', [id]);
        return result.rows[0];
    },

    async setGroupPriority(id,priority){
        const result = await db.query(
            'UPDATE groups SET priority = $1 WHERE id = $2 RETURNING *',
            [priority, id]
        );
        return result.rows[0];
    },

    async setGroupCourt(id,court_id){
        const result = await db.query(
            'UPDATE groups SET court_id = $1 WHERE id = $2 RETURNING *',
            [court_id, id]
        );
        return result.rows[0];
    },

    async leaveCourt(id, status = "queued"){
        const result = await db.query(
            'UPDATE groups SET court_id = NULL, status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        return result.rows[0];
    },

    async deleteGroup(id){
        const result = await db.query(
            'DELETE FROM Groups WHERE id = $1 RETURNING *',
            [id]
        );
        return result.rows[0];
    },

    async addUserToGroup(userId, groupId) {
        const result = await db.query(
            'UPDATE usertest SET group_id = $1 WHERE id = $2 RETURNING *',
            [groupId, userId]
        );
        return result.rows[0];
    },

    async getGroupCount(groupId) {
        const result = await db.query(
            'SELECT COUNT(*) AS user_count FROM usertest WHERE group_id = $1',
            [groupId]
        );
        return parseInt(result.rows[0].user_count, 10);
    }

}