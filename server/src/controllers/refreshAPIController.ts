import { Request, Response } from 'express';
import { RefreshAPIModule } from '../refreshAPI/refreshAPIModule';

class RefreshAPIController {

    async refreshProjects(req:Request, res:Response): Promise <void>{
        const refreshModule = new RefreshAPIModule(req.body[0], req.body[1]);
        await refreshModule.main();
        res.set('Content-Type', 'application/json');
        res.json('Finish Update');
    }


    async getProjectsToUpdate(req:Request, res:Response): Promise <void>{
        const refreshModule = new RefreshAPIModule(0, 0);
        await refreshModule.searchLastAnalysis();
        res.set('Content-Type', 'application/json');
        res.json([refreshModule.getNewProjects(), refreshModule.getRefreshProjects()]);
    }
}

export const refreshAPIController = new RefreshAPIController();