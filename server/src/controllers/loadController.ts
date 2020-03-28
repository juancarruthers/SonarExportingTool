import { Request, Response } from 'express';
import pool from '../database';
import { Pool } from 'promise-mysql';


import fetch from 'cross-fetch';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import { Metric } from '../models/metric';
import { Project } from '../models/project';

class LoadController {


  //Carga de las metricas obtenidas de la API de SONAR
  public async metrics(req:Request, res:Response){

    let url = "https://sonarcloud.io/api/metrics/search?p=1&ps=105";
    let api_query = await fetch(url).then(response => {
        return response.json()
    });
    let resp = api_query["metrics"];
    for(let met of resp){
      let respMetric = new Metric(met["id"], met["key"], met["type"], met["name"], met["description"], met["domain"]);
      pool.then((r: Pool) => r.query('INSERT INTO metrics set ?', [respMetric])
      .catch(err => {
        console.log(err);
      }));
    }
    
    
    res.json(api_query["metrics"]);

        

          
  }

  public async projects(req:Request, res:Response){
    try {
      var key: string;
      
      var path = resolve(__dirname,'./key.sonar');       

      key = readFileSync(path, 'utf8');

      let url = 'https://sonarcloud.io/api/projects/search?organization=unne-sonar-corpus&ps=500';
      let head = {
        'content-type' : 'application/json',
        'authorization': 'Basic ' + key  
      };

      let api_query = await fetch(url, {
        method: 'GET',
        headers : head
      })
      .then(response => {
        return response.json()
      })

      let resp = api_query["components"];
      for(let proj of resp){
        let timestamp = proj["lastAnalysisDate"].split('T');;
        let date = timestamp[0].split('-');
        let time = timestamp[1].split('+');
        let hours = time[0].split(':');
        let ms = time[1];
        let timestampAnalysis = new Date(date[0], date[1] -1, date[2], hours[0], hours[1], hours[2], ms);
        let respProj = new Project(proj["key"], proj["name"], proj["qualifier"], timestampAnalysis);
        pool.then((r: Pool) => r.query('INSERT INTO projects set ?', [respProj])
        .catch(err => {
          console.log(err);
        }));
      }

      res.json(api_query);

    } catch (error) {
      console.log(error);
    }     
          
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

export const loadController = new LoadController();