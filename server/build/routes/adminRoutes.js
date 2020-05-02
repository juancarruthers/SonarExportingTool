"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projectController_1 = require("../controllers/projectController");
//Authentication Packages
const express_jwt_1 = __importDefault(require("express-jwt"));
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
class AdminRoutes {
    constructor() {
        this.router = express_1.Router();
        this.authenticationConfig();
        this.config();
    }
    authenticationConfig() {
        // Set up Auth0 configuration
        this.authConfig = {
            domain: "carruthers.auth0.com",
            audience: "https://admin.sonarexportingtool.com",
        };
        // Define middleware that validates incoming bearer tokens
        // using JWKS from YOUR_DOMAIN
        this.checkJwt = express_jwt_1.default({
            secret: jwks_rsa_1.default.expressJwtSecret({
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
    config() {
        // Define an endpoint that must be called with an access token
        this.router.put("/api/projects/edit", this.checkJwt, projectController_1.projectController.editProject);
    }
}
const adminRoutes = new AdminRoutes();
exports.default = adminRoutes.router;
