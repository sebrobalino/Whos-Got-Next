import { GroupsModel } from "../models/groupsModel.js";
import db from "../config/db.js";

export const GroupService = {
  async addUserToGroup(userId, groupId) {
    return GroupsModel.addUserToGroup(userId, groupId);
  },

  async createGroup(group_name) {
    return GroupsModel.createGroup(group_name);
  },

  // async createGroup(group_name = "Solo"){
  //     return GroupsModel.createGroup(group_name);
  // }, // Default name "Solo" for single users

  async getAllGroups() {
    return GroupsModel.getAllGroups();
  },

  async getGroupById(groupId) {
    const group = await GroupsModel.getGroupByID(groupId);
    if (!group) {
      throw new Error("Group not found");
    }
    return group;
  },

  // db/groupsModel.js
  // db/groupsModel.js
  async joinCourt(groupId, courtId) {
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      // Lock the court row so concurrent joins serialize per court
      const courtLock = await client.query(
        `SELECT id FROM courts WHERE id = $1 FOR UPDATE`,
        [courtId]
      );
      if (courtLock.rowCount === 0) {
        throw new Error(`Court ${courtId} not found`);
      }

      // Lock the currently ACTIVE group rows for this court
      // (Lock rows first; count them in a separate CTE to avoid
      //  "FOR UPDATE is not allowed with aggregate functions")
      const { rows } = await client.query(
        `
      WITH params AS (
        SELECT $1::int AS court_id, $2::int AS group_id
      ),
      active_rows AS (
        SELECT g.id
        FROM groups g
        JOIN params p ON TRUE
        WHERE g.court_id = p.court_id
          AND g.status   = 'active'        -- literal, coerces to enum if needed
        FOR UPDATE
      ),
      active AS (
        SELECT COUNT(*)::int AS cnt FROM active_rows
      ),
      decide AS (
        SELECT CASE WHEN cnt >= 2 THEN 'queued' ELSE 'active' END AS new_status
        FROM active
      )
      UPDATE groups g
      SET court_id  = p.court_id,
          status    = d.new_status,         -- literal assigned; coerces to column type
          queued_at = CASE
                        WHEN d.new_status::text = 'queued' THEN NOW()
                        ELSE NULL
                      END
      FROM params p, decide d
      WHERE g.id = p.group_id
      RETURNING g.id, p.court_id, d.new_status AS status;
      `,
        [courtId, groupId]
      );

      if (rows.length === 0) {
        throw new Error(`Group ${groupId} not found`);
      }

      await client.query("COMMIT");
      const { status } = rows[0];
      return { message: `Group joined court as ${status}`, status };
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  },

  async leaveCourt(groupId) {
    return GroupsModel.leaveCourt(groupId);
  },

  async handleEndgame(courtId, winnerGroupId) {
    // This needs to be worked on and make sure works for multiple groups on one court on one team
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      // 1️⃣ Free the court for all groups currently on it
      await client.query(
        "UPDATE groups SET court_id = NULL WHERE court_id = $1",
        [courtId]
      );

      // 2️⃣ Clear priority from all groups (so only one winner has it)
      await client.query(
        "UPDATE groups SET priority = FALSE WHERE priority = TRUE"
      );

      // 3️⃣ Set priority for the winning group
      await GroupsModel.setGroupPriority(winnerGroupId, true);

      await client.query("COMMIT");

      return { message: "Game ended, court freed, winner priority set" };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },

  async deleteGroup(groupId) {
    return GroupsModel.deleteGroup(groupId);
  },

  async getGroupCount(groupId) {
    return GroupsModel.getGroupCount(groupId);
  },

  async startGame(courtId) {
    // Count active players
    const activePlayersResult = await db.query(
      `
        SELECT COUNT(u.id) AS total_players
        FROM users u
        JOIN groups g ON u.group_id = g.id
        WHERE g.court_id = $1 AND g.status = 'active'
    `,
      [courtId]
    );

    const totalActivePlayers = parseInt(
      activePlayersResult.rows[0].total_players,
      10
    );

    // Only start if court is empty
    if (totalActivePlayers > 0) return { message: "Court already in progress" };

    // Get queued groups ordered by join time
    const queuedGroupsResult = await db.query(
      `
        SELECT g.id, COUNT(u.id) AS group_size
        FROM groups g
        JOIN usertest u ON u.group_id = g.id
        WHERE g.court_id = $1 AND g.status = 'queued'
        GROUP BY g.id
        ORDER BY g.created_at
    `,
      [courtId]
    );

    const courtResult = await db.query(
      "SELECT capacity FROM courts WHERE id = $1",
      [courtId]
    );
    const courtCapacity = courtResult.rows[0].capacity;

    let playersAdded = 0;

    for (const group of queuedGroupsResult.rows) {
      const size = parseInt(group.group_size, 10);
      if (playersAdded + size <= courtCapacity) {
        // Activate group
        await db.query("UPDATE groups SET status = $1 WHERE id = $2", [
          "active",
          group.id,
        ]);
        playersAdded += size;
      } else {
        break; // cannot fit more players
      }
    }

    // Update court status if any players added
    if (playersAdded > 0) {
      await db.query("UPDATE courts SET status = $1 WHERE id = $2", [
        "in_progress",
        courtId,
      ]);
      return { message: `Game started with ${playersAdded} players` };
    }

    return { message: "Not enough players to start game" };
  },

  async getGroupMembers(groupId) {
        return GroupsModel.getGroupMembers(groupId);
    },

    async leaveGroup(userId) {
        return GroupsModel.leaveGroup(userId);
    }
};
