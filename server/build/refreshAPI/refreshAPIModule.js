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
const APIDataRecolection_1 = require("./APIDataRecolection");
const database_1 = __importDefault(require("../database"));
//MODULE TO REFRESH THE DATA FROM DATABASE DEPENDING SONAR UPDATES
class RefreshAPIModule {
    constructor() {
        this.refreshProjects = [];
        this.newProjects = [];
        this.insertBlock = 500;
    }
    main() {
        return __awaiter(this, void 0, void 0, function* () {
            console.time('DBTime');
            yield this.searchLastAnalysis();
            yield this.updateProjects();
            console.timeLog('DBTime', 'Projects Updated!');
            //Insertion of NEW PROJECTS    
            let keysString = this.listKeyProjects(this.newProjects);
            this.projectsKeys = yield this.getProjectKeys(keysString);
            yield this.updateComponents();
            console.timeLog('DBTime', "Projects' Components Inserted!");
            yield this.updateProjectMeasures();
            console.timeLog('DBTime', "Projects' Measures Inserted!");
            yield this.updateComponentMeasures();
            console.timeLog('DBTime', "Components' Measures Inserted!");
            //UPDATE of ALREADY LOADED PROJECTS    
            keysString = this.listKeyProjects(this.refreshProjects);
            this.projectsKeys = yield this.getProjectKeys(keysString);
            yield this.updateComponents();
            console.timeLog('DBTime', "Projects' Components Updated!");
            yield this.updateProjectMeasures();
            console.timeLog('DBTime', "Projects' Measures Updated!");
            yield this.updateComponentMeasures();
            console.timeLog('DBTime', "Components' Measures Updated!");
            yield this.updateDateLastAnalysis();
            console.timeLog('DBTime', "Finish Refreshing");
            console.timeEnd('DBTime');
            return 1;
        });
    }
    //GETTERS
    getProjectIdMeasure(p_idproject, p_idmetric) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryIdmeasure = yield database_1.default
                .then((r) => r
                .query('SELECT pm.idmeasure AS id FROM project_measures AS pm WHERE pm.idproject = ? AND pm.idmetric = ?', [p_idproject, p_idmetric]))
                .catch(err => {
                console.log(err);
            });
            let value;
            if (queryIdmeasure.length == 0) {
                value = 0;
            }
            else {
                value = queryIdmeasure[0]['id'];
            }
            return value;
        });
    }
    getComponentIdMeasure(p_idcomponent, p_idmetric) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryIdmeasure = yield database_1.default
                .then((r) => r
                .query('SELECT cm.idmeasure AS id FROM component_measures AS cm WHERE cm.idcomponent = ? AND cm.idmetric = ?', [p_idcomponent, p_idmetric]))
                .catch(err => {
                console.log(err);
            });
            let value;
            if (queryIdmeasure.length == 0) {
                value = 0;
            }
            else {
                value = queryIdmeasure[0]['id'];
            }
            return value;
        });
    }
    getMetricId(p_metricKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const idMetric = yield database_1.default
                .then((r) => r.query('SELECT m.idmetric FROM metrics AS m WHERE m.key = ?', p_metricKey)
                .catch(err => {
                console.log(err);
            }));
            return idMetric[0]['idmetric'];
        });
    }
    getDateLastAnalysis() {
        return __awaiter(this, void 0, void 0, function* () {
            const queryDateLastAnalysis = yield database_1.default
                .then((r) => r
                .query('SELECT date FROM lastUpdate'))
                .catch(err => {
                console.log(err);
            });
            return queryDateLastAnalysis[0]['date'];
        });
    }
    getProjectKeys(p_projectsKeyList) {
        return __awaiter(this, void 0, void 0, function* () {
            const projectsKeys = yield database_1.default
                .then((r) => r.query('SELECT `idproject`, `key` FROM projects WHERE `key` IN (?)', [p_projectsKeyList])
                .catch(err => {
                console.log(err);
            }));
            //Return tuple with values idproject and key
            return projectsKeys;
        });
    }
    getComponentPathsOfProyects(p_project) {
        return __awaiter(this, void 0, void 0, function* () {
            const componentsPath = yield database_1.default
                .then((r) => r.query('SELECT c.idcomponent, c.path FROM components AS c WHERE c.idproject = ?', p_project)
                .catch(err => {
                console.log(err);
            }));
            //Return tuple with values idcomponent and path
            return componentsPath;
        });
    }
    //INSERT
    insertProjects(p_projects) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default
                .then((r) => r.query('INSERT INTO `projects` (`key`,`name`,`qualifier`,`lastAnalysis`) VALUES  ?', [p_projects])
                .catch(err => {
                console.log(err);
            }));
        });
    }
    insertComponents(p_components) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default
                .then((r) => r.query('INSERT INTO `components` (`idproject`,`name`,`qualifier`,`path`,`language`) VALUES ?', [p_components])
                .catch(err => {
                console.log(err);
            }));
        });
    }
    insertProjectMeasures(p_measures) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default
                .then((r) => r.query('INSERT INTO `project_measures` (`idproject`, `idmetric`, `value`) VALUES ?', [p_measures])
                .catch(err => {
                console.log(err);
            }));
        });
    }
    insertComponentMeasures(p_measures) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default
                .then((r) => r.query('INSERT INTO `component_measures` (`idcomponent`, `idmetric`,`value`) VALUES ?', [p_measures])
                .catch(err => {
                console.log(err);
            }));
        });
    }
    //DELETE
    deleteComponentAndMeasures(p_idcomponent) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default
                .then((r) => r
                .query('DELETE FROM component_measures WHERE idcomponent = ?', p_idcomponent))
                .catch(err => {
                console.log(err);
            });
            yield database_1.default
                .then((r) => r
                .query('DELETE FROM components WHERE idcomponent = ?', p_idcomponent))
                .catch(err => {
                console.log(err);
            });
        });
    }
    //UPDATE
    updateDateLastAnalysis() {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            yield database_1.default
                .then((r) => r
                .query('UPDATE lastUpdate SET date = ? WHERE id = 1', date))
                .catch(err => {
                console.log(err);
            });
            console.log("Date Last Analysis Updated!");
        });
    }
    //CHECK EXISTANCE
    checkProjectExists(p_projectKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const querykeyProj = yield database_1.default
                .then((r) => r
                .query('SELECT p.key FROM projects AS p WHERE p.key = ?', p_projectKey))
                .catch(err => {
                console.log(err);
            });
            let value = true;
            if (querykeyProj.length == 0) {
                value = false;
            }
            return value;
        });
    }
    checkComponentExists(p_idproject, p_componentPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryNameComp = yield database_1.default
                .then((r) => r
                .query('SELECT c.name FROM components AS c WHERE c.idproject = ? AND c.path = ?', [p_idproject, p_componentPath]))
                .catch(err => {
                console.log(err);
            });
            let value = true;
            if (queryNameComp.length == 0) {
                value = false;
            }
            return value;
        });
    }
    listKeyProjects(p_projects) {
        let keyArray = [];
        for (let project of p_projects) {
            keyArray.push(project[0]);
        }
        return keyArray;
    }
    searchLastAnalysis() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = 'https://sonarcloud.io/api/projects/search?organization=' + APIDataRecolection_1.sonarAPI.organization + '&p=1&ps=1';
                const pages = yield APIDataRecolection_1.sonarAPI.numberPages(url);
                const dateLastAnalysis = yield this.getDateLastAnalysis();
                for (let i = 1; i <= pages; i++) {
                    let projects = yield APIDataRecolection_1.sonarAPI.getProjects(i);
                    for (let proj of projects) {
                        const timestamp = proj.lastAnalysisDate.split('T');
                        let date = timestamp[0].split('-');
                        const time = timestamp[1].split('+');
                        let hours = time[0].split(':');
                        hours[0] = hours[0] - 2;
                        if (hours[0] < 0) {
                            hours[0] = hours[0] + 24;
                            date[2] = date[2] - 1;
                        }
                        let timestampAnalysis = new Date();
                        timestampAnalysis.setUTCFullYear(date[0]);
                        timestampAnalysis.setUTCMonth(date[1] - 1);
                        timestampAnalysis.setUTCDate(date[2]);
                        timestampAnalysis.setUTCHours(hours[0]);
                        timestampAnalysis.setUTCMinutes(hours[1]);
                        timestampAnalysis.setUTCSeconds(hours[2]);
                        if (timestampAnalysis > dateLastAnalysis) {
                            let respProj = [proj.key, proj.name, proj.qualifier, timestampAnalysis];
                            if (yield this.checkProjectExists(proj.key)) {
                                this.refreshProjects.push(respProj);
                            }
                            else {
                                this.newProjects.push(respProj);
                            }
                        }
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updateProjects() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.newProjects.length > 0) {
                    yield this.insertProjects(this.newProjects);
                }
                for (let proj of this.refreshProjects) {
                    yield database_1.default
                        .then((r) => r.query('UPDATE projects AS p SET p.lastAnalysis = ? WHERE p.key = ?', [proj[3], proj[0]])
                        .catch(err => {
                        console.log(err);
                    }));
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updateComponents() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let compToInsert = [];
                for (let proj of this.projectsKeys) {
                    let url = 'https://sonarcloud.io/api/components/tree?component=' + proj['key'] + '&p=1&ps=1';
                    let pages = yield APIDataRecolection_1.sonarAPI.numberPages(url);
                    let components;
                    for (let i = 1; i <= pages; i++) {
                        components = yield APIDataRecolection_1.sonarAPI.getComponents(proj['key'], i);
                        for (let component of components) {
                            if (!(yield this.checkComponentExists(proj["idproject"], component.path))) {
                                let respComp = [proj["idproject"], component.name, component.qualifier, component.path, component.language];
                                compToInsert.push(respComp);
                            }
                        }
                        if (compToInsert.length >= this.insertBlock) {
                            yield this.insertComponents(compToInsert);
                            compToInsert = [];
                        }
                    }
                }
                if (compToInsert.length > 0) {
                    yield this.insertComponents(compToInsert);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updateProjectMeasures() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let projMeaToInsert = [];
                for (let proj of this.projectsKeys) {
                    let projMeasures = yield APIDataRecolection_1.sonarAPI.getProjectMeasures(proj['key']);
                    let idMeasure;
                    for (let measure of projMeasures) {
                        let idMetric = yield this.getMetricId(measure.metric);
                        idMeasure = yield this.getProjectIdMeasure(proj["idproject"], idMetric);
                        if (idMeasure == 0) {
                            let respMeas = [proj["idproject"], idMetric, measure.value];
                            projMeaToInsert.push(respMeas);
                        }
                        else {
                            yield database_1.default
                                .then((r) => r.query('UPDATE project_measures SET value = ? WHERE idmeasure = ?', [measure.value, idMeasure])
                                .catch(err => {
                                console.log(err);
                            }));
                        }
                    }
                    if (projMeaToInsert.length >= this.insertBlock) {
                        yield this.insertProjectMeasures(projMeaToInsert);
                        projMeaToInsert = [];
                    }
                }
                if (projMeaToInsert.length > 0) {
                    yield this.insertProjectMeasures(projMeaToInsert);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updateComponentMeasures() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let compMeaToInsert = [];
                for (let proj of this.projectsKeys) {
                    let componentsPaths = yield this.getComponentPathsOfProyects(proj['idproject']);
                    for (let comp of componentsPaths) {
                        let compMeasures = yield APIDataRecolection_1.sonarAPI.getComponentMeasures(proj['key'] + ':' + comp['path']);
                        if (compMeasures[0].metric != 'not found') {
                            let idMeasure;
                            for (let measure of compMeasures) {
                                let idMetric = yield this.getMetricId(measure.metric);
                                idMeasure = yield this.getComponentIdMeasure(comp['idcomponent'], idMetric);
                                if (idMeasure == 0) {
                                    let respMeas = [comp['idcomponent'], idMetric, measure.value];
                                    compMeaToInsert.push(respMeas);
                                }
                                else {
                                    yield database_1.default
                                        .then((r) => r.query('UPDATE component_measures SET value = ? WHERE idmeasure = ?', [measure.value, idMeasure])
                                        .catch(err => {
                                        console.log(err);
                                    }));
                                }
                            }
                        }
                        else {
                            console.log("Component Deleted");
                            yield this.deleteComponentAndMeasures(comp['idcomponent']);
                            this.updateComponentMeasures(); //FIJARSE <<<<<<<<<<<<<<<---------------------------
                        }
                        if (compMeaToInsert.length >= this.insertBlock) {
                            yield this.insertComponentMeasures(compMeaToInsert);
                            console.timeLog('DBTime', compMeaToInsert.length + " components' measures inserted of " + proj['idproject']);
                            compMeaToInsert = [];
                        }
                    }
                }
                if (compMeaToInsert.length > 0) {
                    yield this.insertComponentMeasures(compMeaToInsert);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.refreshModule = new RefreshAPIModule();
exports.refreshModule.main();
