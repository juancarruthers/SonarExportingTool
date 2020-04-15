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
        
        res.set('Content-Type', 'application/json');
        res.json(query);

    } 
    
    //eliminada metricas quality_profiles, quality_gate_details, sonarjava_feedback, ncloc_data, executable_lines_data, duplications_data  y todas las new (contienen periods)
    public async listComponentMetrics (req:Request, res:Response): Promise<void>{

        const query = await pool
            .then((r: Pool) => r
            .query('SELECT * FROM metrics AS m WHERE m.idmetric NOT IN (47, 294, 349, 238, 321, 53, 164, 165, 166, 167, 168, 169, 172, 173, 174, 175, 176, 177, 178, 289, 304, 307, 309, 311, 314, 318, 337, 338, 339, 340, 341, 342, 343, 348, 351) ORDER BY m.domain, m.key ASC')
            )
            .catch(err =>{
                console.log(err)
            }); 
            
        res.set('Content-Type', 'application/json');
        res.json(query);

    }
    

}

export const metricController = new MetricController();