import mysql, { QueryFunction, Pool, Connection } from 'mysql';
import keys from './keys';
import {promisify} from 'util';


export interface PromisifiedConnection extends Omit<Connection, 'query'> {
    query: QueryFunction | Function;
}

interface PromisifiedPool extends Omit<Pool, 'query'> {
    query: QueryFunction | Function;
}

const pool : PromisifiedPool = mysql.createPool(keys.database);

pool.getConnection((err, connection) => {
    if (err) {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Database connection was closed.')
      }
      if (err.code === 'ER_CON_COUNT_ERROR') {
        console.error('Database has too many connections.')
      }
      if (err.code === 'ECONNREFUSED') {
        console.error('Database connection was refused.')
      }
    }
  
    if (connection){ 
        connection.release();
        console.log('DB is connected.');
    }
  
    return
});
  
// Promisify for Node.js async/await.
pool.query = promisify(pool.query);

export default pool;