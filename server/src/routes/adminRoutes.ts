import { Router } from 'express';
import { projectController } from '../controllers/projectController';
import { refreshModule } from '../refreshAPI/refreshAPIModule';

//Authentication Packages
import jwt from "express-jwt";
import jwksRsa  from "jwks-rsa";
import { APIserver } from '..';


class AdminRoutes {

    router: Router;
    authConfig!: {
        domain: string;
        audience: string;
    };
    checkJwt!: jwt.RequestHandler;

    constructor(){
        this.router = Router();
        this.authenticationConfig();
        this.config();
    }

    authenticationConfig(){
         // Set up Auth0 configuration
        this.authConfig = {
            domain: "carruthers.auth0.com",
            audience: "https://admin.sonarexportingtool.com",
            
        };
  
        // Define middleware that validates incoming bearer tokens
        // using JWKS from YOUR_DOMAIN
        this.checkJwt = jwt({
            secret: jwksRsa.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: `https://${this.authConfig.domain}/.well-known/jwks.json`
            }),
        
            audience: this.authConfig.audience,
            issuer: `https://${this.authConfig.domain}/`,
            algorithm: ["RS256"]
        });
    }

    config(): void {
        // Define an endpoint that must be called with an access token
        this.router.put("/api/projects/edit", this.checkJwt, projectController.editProject);
        this.router.post("/api/projects/update", this.checkJwt, async (req, res) => {

            refreshModule.listeningPort = req.body[0];
            refreshModule.limitTime = req.body[1];
            await refreshModule.main();
            res.json('Finish Update');
        });

    }

}

const adminRoutes = new AdminRoutes();
export default adminRoutes.router;