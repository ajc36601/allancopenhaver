import mysql from 'mysql2/promise';

declare global {
  // Prevent TypeScript errors when extending the global object
  var mysqlPool: mysql.Pool | undefined;
}

const pool = global.mysqlPool ?? mysql.createPool({
  host: 'fishfinder.c30y4aksm364.us-east-2.rds.amazonaws.com',
  user: 'allancopenhaver_user',
  password: 'allancopenhaver',
  database: 'allan_copenhaver',
});

if (!global.mysqlPool) {
  global.mysqlPool = pool;

  // Optional: log connection test only once
  (async () => {
    try {
      const connection = await pool.getConnection();
      console.log('✅ Connected to MySQL database!');
      connection.release();
    } catch (error) {
      console.error('❌ Failed to connect to the database:', error);
    }
  })();
}

export { pool };
