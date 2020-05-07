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
class ProjectController {
    constructor() {
    }
    listProjects(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield database_1.default
                .then((r) => r
                .query('SELECT * FROM projects ORDER BY lastAnalysis DESC'))
                .catch(err => {
                console.log(err);
            });
            res.json(query);
        });
    }
    editProject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let projectUpdate of req.body) {
                yield database_1.default
                    .then((r) => r
                    .query('UPDATE projects SET projectLink = ?, version = ? WHERE idproject = ?', projectUpdate)
                    .catch(err => {
                    console.log(err);
                    res.json('Request could not be fullfilled');
                }));
            }
            res.json('Request completed successfully');
        });
    }
    listProjectsMeasures(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idproj } = req.params;
            const { idmet } = req.params;
            const projectsIds = idproj.split(',');
            const metricsIds = idmet.split(',');
            let queryProject = yield database_1.default
                .then((r) => r
                .query('SELECT p.idproject, p.key, p.name, p.qualifier, p.lastAnalysis FROM projects AS p WHERE idproject IN ( ? ) ORDER BY p.idproject ASC', [projectsIds]))
                .catch(err => {
                console.log(err);
            });
            let index = 0;
            for (let proj of queryProject) {
                let queryMeasures = yield database_1.default
                    .then((r) => r
                    .query('SELECT m.domain, m.key, m.name, m.description, m.type, pm.value FROM project_measures AS pm JOIN metrics as m ON pm.idmetric = m.idmetric WHERE idproject = ? AND m.idmetric IN (?) ORDER BY m.domain, m.name ASC', [proj['idproject'], metricsIds]))
                    .catch(err => {
                    console.log(err);
                });
                proj['project_measure'] = queryMeasures;
                queryProject[index] = proj;
                index = index + 1;
            }
            res.json(queryProject);
        });
    }
}
exports.projectController = new ProjectController();
