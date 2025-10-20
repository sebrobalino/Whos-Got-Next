import db from '../config/db.js';

export const UserModel = {
    async getAll(){
        const result = await db.query('SELECT * from usertest ORDER BY id DESC');
        return result.rows;
    }, 
    async findByID(id){
        const result = await db.query('SELECT * from usertest WHERE id = $1', [id]);
        return result.rows[0];      

    },

    async create({name,email,password}){
        const result = await db.query(
            'INSERT INTO usertest(name,email,password) VALUES($1,$2,$3) RETURNING*',
            [name,email,password]
        );
        return result.rows[0];

    },
    async update(query, values) {
    const result = await db.query(
      query,
      values
    );
    return result.rows[0];
    },

    async delete(userId){
        const result = await db.query('DELETE FROM usertest WHERE id = $1', [userId]);
        return result.rowCount;
    },

     async findByEmail(email) {
        const result = await db.query('SELECT * FROM usertest WHERE email = $1', [email]);
        return result.rows[0];
  },

};
