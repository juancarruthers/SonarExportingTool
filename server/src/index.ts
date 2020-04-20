import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { CronJob } from 'cron';

import projectsRoutes from './routes/projectsRoutes';
import { refreshModule } from './refreshAPIModule';

class Server {

    public app: Application;

    constructor(){
        this.app = express();
        this.config();
        this.routes();
        this.startRefreshModuleJob();
    }

    config(): void {

        this.app.set('port', process.env.PORT || 3000);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));

    }

    routes(): void {

        this.app.use(projectsRoutes);

    }

    start(): void {

        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    
    }

    startRefreshModuleJob(): void{
        let job = new CronJob ('00 20 17 * * *', async function() {
            await refreshModule.main();
          });
        job.start();
        
    }

}

const server = new Server();
server.start();