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
        const result = await db.query('SELECT * from Groups WHERE court_id = $1 AND status = $2 ORDER BY created_at DESC', [court_id, 'queued']);
        return result.rows;
    },

    async getActiveCourtsByID(court_id){
        const result = await db.query('SELECT * from Groups WHERE court_id = $1 AND status = $2 ORDER by created_at', [court_id, 'active']);
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
    },

    // backend/src/models/courtsModel.js
    async endGameOnCourt(id, winnerGroupId) {
  try {
    await db.query('BEGIN');

    // 1️⃣ Get the two active groups on this court
    const activeRes = await db.query(
      `SELECT id
       FROM groups
       WHERE court_id = $1 AND status = 'active'
       ORDER BY id ASC
       LIMIT 2;`,
      [id]
    );

    const activeGroups = activeRes.rows.map(r => r.id);
    if (activeGroups.length < 2) {
      await db.query('ROLLBACK');
      return { message: 'Need two active groups to end a game.' };
    }

    if (!activeGroups.includes(Number(winnerGroupId))) {
      await db.query('ROLLBACK');
      return { message: 'Winner must be one of the active groups.' };
    }

    // 2️⃣ Identify the losing group
    const loserGroupId = activeGroups.find(id => id !== Number(winnerGroupId));

    // 3️⃣ Re-queue the losing group
    await db.query(
      `UPDATE groups
       SET status = 'not queued', court_id = NULL
       WHERE id = $1;`,
      [loserGroupId]
    );

    // 4️⃣ Winner stays active — no change needed.
    //    Find the next queued group to promote
    const nextRes = await db.query(
      `SELECT id
       FROM groups
       WHERE status = 'queued'
       ORDER BY priority DESC, queued_at ASC, created_at ASC
       LIMIT 1;`
    );

    if (nextRes.rows.length > 0) {
      const nextId = nextRes.rows[0].id;

      // Promote next queued group to active on this court
      await db.query(
        `UPDATE groups
         SET status = 'active',
             court_id = $1,
             queued_at = NULL
         WHERE id = $2;`,
        [id, nextId]
      );
    }

    await db.query('COMMIT');

    return {
      message: 'Game ended successfully. Loser re-queued and next team promoted.',
      loserGroupId,
      promotedGroupId: nextRes.rows[0]?.id || null,
    };
  } catch (err) {
    await db.query('ROLLBACK');
    console.error('[endGameOnCourt] failed:', err);
    throw err;
  }
}



    


}