import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'fishfinder.c30y4aksm364.us-east-2.rds.amazonaws.com',
  user: 'allancopenhaver_user',
  password: 'allancopenhaver',
  database: 'allan_copenhaver'
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database!');
    connection.release(); // Always release back to the pool
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error);
  }
})();