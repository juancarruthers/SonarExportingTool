import express, { Application, Request, Response, NextFunction } from 'express';
import { Server } from 'http';
import morgan from 'morgan';
import cors from 'cors';
import { CronJob } from 'cron';

import routes from './routes/Routes';
import { RefreshAPIModule } from './refreshAPI/refreshAPIModule';
import { DBOperations } from './refreshAPI/DBOperations';

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

      this.app.use(routes);

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
                switch (err.name) {
                    case 'UnauthorizedError':
                        res.status(401).json({'Error' : 'Need Authentication token to make that request'});
                        break;
                }              
                next();
            }
        );
    }

    async checkDatabaseConsistency(): Promise<void>{
        let database = new DBOperations();
        await database.deleteProjectsNotFullyLoad();
    }

}

export const APIserver = new APIServer();

APIserver.checkDatabaseConsistency();
APIserver.start();