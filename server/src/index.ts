import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { CronJob } from 'cron';

import publicRoutes from './routes/publicRoutes';
import adminRoutes from './routes/adminRoutes';
import { refreshModule } from './refreshAPI/refreshAPIModule';

class Server {

    public app: Application;
    public cronJob? : CronJob;
    public port: number;

    constructor(){
        this.port = 3000;
        this.app = express();
        this.config();
        this.routes();
        this.startRefreshModuleJob();
        this.errorHandlingConfig();
    }

    config(): void {

        this.app.set('port', process.env.PORT || this.port);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));

    }

    routes(): void {

      this.app.use(publicRoutes);
      this.app.use(adminRoutes);

    }

    start(): void {

        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    
    }

    startRefreshModuleJob(): void{
        this.cronJob = new CronJob ( '00 00 02 * * *', () => refreshModule.main());  
        this.cronJob.start();     
    }

    errorHandlingConfig(){
        this.app
        .use((err: Error, req: Request, res: Response, next: NextFunction) => {
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

export const server = new Server();

server.start();