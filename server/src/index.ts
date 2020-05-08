import express, { Application, Request, Response, NextFunction } from 'express';
import { Server } from 'http';
import morgan from 'morgan';
import cors from 'cors';
import { CronJob } from 'cron';

import publicRoutes from './routes/publicRoutes';
import adminRoutes from './routes/adminRoutes';
import { RefreshAPIModule } from './refreshAPI/refreshAPIModule';

class APIServer {

    private app: Application;
    private cronJob? : CronJob;
    private port: number;
    private server?: Server;

    constructor(){
        this.port = 3000;
        this.app = express();
        this.config();
        this.routes();
        this.startRefreshModuleJob();
        this.errorHandlingConfig();
    }

    getPort(): number{
        return this.port;
    }

    start(): void {

        this.server = this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    
    }

    changeListeningPort(p_port: number): void{

        if (this.server){
            this.server.close();
        }
        
        this.app.set('port', process.env.PORT || p_port);      
        this.start();

    }

    private config(): void {

        this.app.set('port', process.env.PORT || this.port);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));

    }

    private routes(): void {

      this.app.use(publicRoutes);
      this.app.use(adminRoutes);

    }

    private startRefreshModuleJob(): void{
        this.cronJob = new CronJob ( '00 00 02 * * *', async () => {
            const refreshModule = new RefreshAPIModule(0, 14400);
            await refreshModule.main();
        });  
        this.cronJob.start();     
    }

    private errorHandlingConfig(): void{
        this.app
        .use(
            (err: Error, req: Request, res: Response, next: NextFunction) => {

                res.status(200).end();
                next();
            },
            (err: Error, req: Request, res: Response, next: NextFunction) => {

                res.status(400).send('Need Authentication token to make that request');
                next();
            },
            (err: Error, req: Request, res: Response, next: NextFunction) => {

                console.log(err.stack);
                res.status(500).send('Server does not know how to handle the situation');
                next();
            }
        );
    }

}

export const APIserver = new APIServer();

APIserver.start();