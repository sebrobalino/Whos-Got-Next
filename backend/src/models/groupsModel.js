import db from "../config/db.js";

export const GroupsModel = {
  async createGroup(group_name, captain_id) {
    const result = await db.query(
        `INSERT INTO Groups (group_name, priority, court_id, captain_id)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [group_name, false, null, captain_id]
    );
    return result.rows[0];
  },

  async getAllGroups() {
    const result = await db.query(
      "SELECT * from Groups ORDER BY created_at DESC"
    );
    return result.rows;
  },

  async getGroupByID(id) {
    const result = await db.query("SELECT * from Groups WHERE id = $1 ", [id]);
    return result.rows[0];
  },

  async setGroupPriority(id, priority) {
    const result = await db.query(
      "UPDATE groups SET priority = $1 WHERE id = $2 RETURNING *",
      [priority, id]
    );
    return result.rows[0];
  },

  async setGroupCourt(id, court_id) {
    const result = await db.query(
      "UPDATE groups SET court_id = $1 WHERE id = $2 RETURNING *",
      [court_id, id]
    );
    return result.rows[0];
  },

  async leaveCourt(groupId, status = "not queued") {
    const client = await db.connect();
  try {
    await client.query("BEGIN");

    // 1) Update court_id + status
    const upd = await client.query(
      `
      UPDATE groups
         SET court_id = NULL,
             status   = $1
       WHERE id = $2
       RETURNING id
      `,
      [status, groupId]
    );
    if (upd.rowCount === 0) {
      await client.query("ROLLBACK");
      throw new Error(`Group ${groupId} not found`);
    }

    // 2) Now stamp queued_at based on the COLUMN value (no param comparison)
    //    If status is an ENUM, you can cast the literal on the right, e.g. 'queued'::group_status
    await client.query(
      `
      UPDATE groups
         SET queued_at = CASE WHEN status = 'queued' THEN NOW() ELSE NULL END
       WHERE id = $1
      `,
      [groupId]
    );

    await client.query("COMMIT");
    return { message: "Left queue" };
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
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
    },

    async getGroupMembers(groupId) {
        const result = await db.query(
            'SELECT * FROM usertest WHERE group_id = $1',
            [groupId]
        );
        return result.rows;
    },

    async leaveGroup(userId) {
        const result = await db.query(
            'UPDATE usertest SET group_id = NULL WHERE id = $1 RETURNING *',
            [userId]
        );
        return result.rows[0];
    }
};
