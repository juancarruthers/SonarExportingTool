import { Request, Response } from 'express';
import pool from '../database';
import { Pool } from 'promise-mysql';


import fetch from 'cross-fetch';
import { Metric } from '../models/metric';

class IndexController {


    //Carga de las metricas obtenidas de la API de SONAR
    public async metricLoad (req:Request, res:Response){

        let url = "https://sonarcloud.io/api/metrics/search?p=1&ps=105";
        await fetch(url).then(response => {
            return response.json()
          })
          .then(data => {
            

            let resp = data["metrics"];
            for(let met of resp){
                let respMetric = new Metric(met["id"], met["key"], met["type"], met["name"], met["description"], met["domain"]);
                pool.then((r: Pool) => r.query('INSERT INTO metrics set ?', [respMetric]));
            }
            
            
            res.json(data["metrics"]);

          })
          .catch(err => {
            console.log(err);
          });
          

            
    }



   /* public async list (req:Request, res:Response){

        const games = await (await pool).query('SELECT * FROM games');
        res.json(games);

    }

    public async getOne (req:Request, res:Response){

        const { id } = req.params;
        const game = await pool.then((r: Pool) => r.query('SELECT * FROM games WHERE idgame = ?', [id]));
        if (game.length > 0){
            res.json(game);
        }else{
            res.status(404).json({message: 'There is not a game with id: ' + [id]})
        }
        
        

    }

    public async create(req: Request, res:Response): Promise<void> {
        console.log(req.body);

        //Es una consulta asincrona por lo tanto es necesario aclararlo en la firma del metodo 'async'
        await pool.then((r: Pool) => r.query('INSERT INTO games set ?', [req.body]));
        res.json({message: 'Game Saved'});
    }

    public async delete(req:Request, res:Response){
        console.log(req.body);
        const { id } = req.params;
        //Es una consulta asincrona por lo tanto es necesario aclararlo en la firma del metodo 'async'
        await pool.then((r: Pool) => r.query('DELETE FROM games WHERE idgame = ?', [id]));
        res.json({message: 'Game Deleted'});
    }

    public async update(req:Request, res:Response){
        console.log(req.body);
        const { id } = req.params;
        //Es una consulta asincrona por lo tanto es necesario aclararlo en la firma del metodo 'async'
        await pool.then((r: Pool) => r.query('UPDATE games set ? WHERE idgame = ?', [req.body, id]));
        res.json({message: 'Game Updated'});
    }*/
}

export const indexController = new IndexController();