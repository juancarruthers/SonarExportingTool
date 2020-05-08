"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projectController_1 = require("../controllers/projectController");
const refreshAPIModule_1 = require("../refreshAPI/refreshAPIModule");
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
        this.router.post("/api/projects/update", this.checkJwt, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const refreshModule = new refreshAPIModule_1.RefreshAPIModule(req.body[0], req.body[1]);
            yield refreshModule.main();
            res.json('Finish Update');
        }));
    }
}
const adminRoutes = new AdminRoutes();
exports.default = adminRoutes.router;
