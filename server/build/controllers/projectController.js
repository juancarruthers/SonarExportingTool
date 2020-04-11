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
const database_1 = __importDefault(require("../database"));
const fs_1 = __importDefault(require("fs"));
const js2xmlparser_1 = require("js2xmlparser");
const jszip_1 = __importDefault(require("jszip"));
class ProjectController {
    constructor() {
        this.dir = '/tmp/sonar';
        this.zip = new jszip_1.default();
    }
    listProjects(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield database_1.default
                .then((r) => r
                .query('SELECT * FROM projects'))
                .catch(err => {
                console.log(err);
            });
            res.json(query);
        });
    }
    listProjectsMeasures(p_paramsReceived) {
        return __awaiter(this, void 0, void 0, function* () {
            let queryProject = yield database_1.default
                .then((r) => r
                .query('SELECT p.idproject, p.key, p.name, p.qualifier, p.lastAnalysis FROM projects AS p WHERE idproject IN ( ? )', [p_paramsReceived]))
                .catch(err => {
                console.log(err);
            });
            let index = 0;
            for (let proj of queryProject) {
                let queryMeasures = yield database_1.default
                    .then((r) => r
                    .query('SELECT m.key, m.type, m.name, m.description, m.domain, pm.value FROM project_measures AS pm JOIN metrics as m ON pm.idmetric = m.idmetric WHERE idproject = ? ORDER BY m.domain ASC', proj['idproject']))
                    .catch(err => {
                    console.log(err);
                });
                proj['measures'] = queryMeasures;
                queryProject[index] = proj;
                index = index + 1;
            }
            return queryProject;
        });
    }
    downloadProjectMeasures(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { type } = req.params;
            const projectsIds = id.split(',');
            let projectMeasures = yield exports.projectController.listProjectsMeasures(projectsIds);
            if (!fs_1.default.existsSync(exports.projectController.dir)) {
                fs_1.default.mkdirSync(exports.projectController.dir);
            }
            switch (type) {
                case 'json':
                    exports.projectController.generateJsonFile(projectMeasures);
                    break;
                case 'xml':
                    exports.projectController.generateXmlFile(projectMeasures);
                    break;
                case 'csv':
                    break;
            }
            exports.projectController.zipFile(res);
        });
    }
    generateJsonFile(p_projectMeasures) {
        for (let proj of p_projectMeasures) {
            let file = JSON.stringify(proj);
            let name = proj['name'].replace(/\s+/g, '') + ".json";
            exports.projectController.zip.file(name, file);
        }
    }
    generateXmlFile(p_projectMeasures) {
        for (let proj of p_projectMeasures) {
            let file = js2xmlparser_1.parse('project', proj);
            let name = proj['name'].replace(/\s+/g, '') + ".xml";
            exports.projectController.zip.file(name, file);
        }
    }
    zipFile(res) {
        return __awaiter(this, void 0, void 0, function* () {
            exports.projectController.zip
                .generateAsync({ type: "nodebuffer" })
                .then(function (content) {
                fs_1.default.writeFile(exports.projectController.dir + '/projects_measures.zip', content, function (err) {
                    if (err)
                        console.log(err);
                    res.download(exports.projectController.dir + '/projects_measures.zip');
                });
            });
            exports.projectController.zip = new jszip_1.default();
        });
    }
}
exports.projectController = new ProjectController();
