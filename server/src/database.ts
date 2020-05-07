import mysql, { Pool } from 'promise-mysql';

import keys from './keys';
import { APIserver } from './index';

const pool = mysql.createPool(keys.database);

pool.then((r: Pool) => r.getConnection().then((connection) => {
                                                                r.releaseConnection(connection);
                                                                console.log('DB is connected.');
                                                                
                                                            }));

export default pool;