import { Request, Response } from 'express';
import pool from '../database';

class ComponentController {

    public async listComponentsMeasures (req:Request, res:Response){ 
        try {
            const { idproj } = req.params;
            const projArray = idproj.split(',');
            const { idmet } = req.params;
            let queryComponent : any;

            if ( projArray.length == 1 ){

                const projectsIds  = idproj.split(',');
                const metricsIds  = idmet.split(',');  

                queryComponent = await pool
                    .query('SELECT * FROM components AS c WHERE idproject IN ( ? ) ORDER BY c.idproject ASC',[projectsIds]);

                    let index: number = 0;

                for(let comp of queryComponent){
                    const queryMeasures = await pool
                        .query('SELECT m.domain, m.key, m.name, m.description, m.type, cm.value FROM component_measures AS cm JOIN metrics as m ON m.idmetric = cm.idmetric WHERE idcomponent = ? AND m.idmetric IN (?) ORDER BY m.domain, m.name ASC',[comp['idcomponent'],metricsIds]);

                    comp['component_measure'] = queryMeasures;
            
                    queryComponent[index] = comp;

                    index = index + 1;

                }

                
            }else{

                queryComponent = {"Error" : "You can request only for one project's components' measures at a time."};
            }
            res.set('Content-Type', 'application/json');
            res.json(queryComponent);
                
        } catch (error) {
            console.log(error);
        }
              
    }

    public async countComponentsMeasures (req:Request, res:Response): Promise<void>{ 
        try {
            const { idproj } = req.params;
            const { idmet } = req.params;

            const projectsIds  = idproj.split(',');
            const metricsIds  = idmet.split(',');  

            let queryComponent = await pool
                .query('SELECT count(idmeasure) AS count FROM component_measures AS cm JOIN components AS c ON c.idcomponent = cm.idcomponent WHERE c.idproject IN ( ? ) AND cm.idmetric IN ( ? ) ',[projectsIds, metricsIds]);
            
            res.set('Content-Type', 'application/json');
            res.json(queryComponent[0]['count']);
            
        } catch (error) {
            console.log(error);
        }     
    }

}

export const componentController = new ComponentController();