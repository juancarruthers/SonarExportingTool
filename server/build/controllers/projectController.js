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
class ProjectController {
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
    listProjectsMeasures(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let queryProject = yield database_1.default
                .then((r) => r
                .query('SELECT * FROM projects'))
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
            //let xml = parse('projects',queryProject);
            let file = JSON.stringify(queryProject);
            fs_1.default.writeFile('/tmp/sonar/projects_measures.json', file, function (err) {
                if (err)
                    console.log(err);
                res.download('/tmp/sonar/projects_measures.json');
            });
            /*fs.writeFile('/tmp/sonar/projects_measures.xml',xml, function (err) {
                if (err) console.log(err);
                res.download('/tmp/sonar/projects_measures.xml');
            });*/
        });
    }
}
exports.projectController = new ProjectController();
