"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminRoutes_1 = __importDefault(require("./adminRoutes"));
const projectController_1 = require("../controllers/projectController");
const metricController_1 = require("../controllers/metricController");
const componentController_1 = require("../controllers/componentController");
const refreshAPIController_1 = require("../controllers/refreshAPIController");
class PublicRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        // Define an endpoint that must be called with an access token
        // private routes
        this.router.put("/api/projects/edit", adminRoutes_1.default.getCheckJwt(), projectController_1.projectController.editProject);
        this.router.post("/api/projects/update", adminRoutes_1.default.getCheckJwt(), refreshAPIController_1.refreshAPIController.refreshProjects);
        this.router.get("/api/projects/update/list", adminRoutes_1.default.getCheckJwt(), refreshAPIController_1.refreshAPIController.getProjectsToUpdate);
        //public routes
        this.router.get('/api/projects', projectController_1.projectController.listProjects);
        this.router.get('/api/projects/metrics', metricController_1.metricController.listProjectMetrics);
        this.router.get('/api/projects/components/metrics', metricController_1.metricController.listComponentMetrics);
        this.router.get('/api/projects/measures/:idproj/:idmet', projectController_1.projectController.listProjectsMeasures);
        this.router.get('/api/projects/components/measures/:idproj/:idmet', componentController_1.componentController.listComponentsMeasures);
        this.router.get('/api/projects/components/measures/count/:idproj/:idmet', componentController_1.componentController.countComponentsMeasures);
        this.router.get("*", (req, res) => { res.status(404).json({ "Error": "Element not found in " + req.url }); });
    }
}
const publicRoutes = new PublicRoutes();
exports.default = publicRoutes.router;
