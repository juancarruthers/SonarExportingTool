//Authentication Packages
import jwt from "express-jwt";
import jwksRsa  from "jwks-rsa";


class TokenValidation {


    private authConfig!: {
                domain: string;
                audience: string;
            };
    private checkJwt!: jwt.RequestHandler;  

    constructor(){
        this.authenticationConfig();
    }

    getCheckJwt(): jwt.RequestHandler {
        return this.checkJwt;
    }

    private authenticationConfig(){
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
            algorithms: ["RS256"]
        });
    }
}

const tokenValidation = new TokenValidation();
export default tokenValidation;