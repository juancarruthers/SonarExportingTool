import { Request, Response } from 'express';
import pool from '../database';
import { Pool } from 'promise-mysql';


class ComponentController {

    constructor(){
    }

   

    public async listComponentsMeasures (req:Request, res:Response){ 
        const { idproj } = req.params;
        const projArray = [idproj];
        const { idmet } = req.params;
        let queryComponent : any;

        if ( projArray.length == 1 ){

            const projectsIds  = idproj.split(',');
            const metricsIds  = idmet.split(',');  

            queryComponent = await pool
                .then((r: Pool) => r
                .query('SELECT * FROM components AS c WHERE idproject IN ( ? ) ORDER BY c.idproject ASC',[projectsIds])
                )
                .catch(err =>{
                    console.log(err)
                });
                let index: number = 0;

            for(let comp of queryComponent){
                let queryMeasures = await pool
                .then((r: Pool) => r
                .query('SELECT m.key, m.type, m.name, m.description, m.domain, cm.value FROM component_measures AS cm JOIN metrics as m ON m.idmetric = cm.idmetric WHERE idcomponent = ? AND m.idmetric IN (?) ORDER BY m.domain, m.name ASC',[comp['idcomponent'],metricsIds])
                )
                .catch(err =>{
                    console.log(err)
                });

                comp['component_measure'] = queryMeasures;
        
                queryComponent[index] = comp;

                index = index + 1;

            }

            
        }else{

            queryComponent = "You can request only for one project's components' measures at a time.";

        }
        
        res.json(queryComponent);
        
        
    }

    public async countComponentsMeasures (req:Request, res:Response){ 
        const { idproj } = req.params;
        const { idmet } = req.params;

        const projectsIds  = idproj.split(',');
        const metricsIds  = idmet.split(',');  

        let queryComponent = await pool
            .then((r: Pool) => r
            .query('SELECT count(idmeasure) AS count FROM component_measures AS cm JOIN components AS c ON c.idcomponent = cm.idcomponent WHERE c.idproject IN ( ? ) AND cm.idmetric IN ( ? ) ',[projectsIds, metricsIds])
            )
            .catch(err =>{
                console.log(err)
            });


        res.json(queryComponent);
        
    }

}

export const componentController = new ComponentController();