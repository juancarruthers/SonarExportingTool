import { Request, Response } from 'express';
import pool from '../database';
import { Pool } from 'promise-mysql';


class MetricController {

    constructor(){

    }

    //eliminada metricas quality_profiles, quality_gate_details, sonarjava_feedback
    public async listProjectMetrics (req:Request, res:Response): Promise<void>{

        const query = await pool
            .then((r: Pool) => r
            .query('SELECT * FROM metrics AS m WHERE m.idmetric NOT IN (47, 294, 349) ORDER BY m.domain, m.key ASC')
            )
            .catch(err =>{
                console.log(err)
            });    
        res.json(query);

    }   

    

}

export const metricController = new MetricController();