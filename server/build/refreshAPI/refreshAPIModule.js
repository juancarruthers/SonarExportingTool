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
Object.defineProperty(exports, "__esModule", { value: true });
const APIDataRecolection_1 = require("./APIDataRecolection");
const DBOperations_1 = require("./DBOperations");
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
            this.projectsKeys = yield DBOperations_1.database.getProjectKeys(keysString);
            yield this.updateComponents();
            console.timeLog('DBTime', "Projects' Components Inserted!");
            yield this.updateProjectMeasures();
            console.timeLog('DBTime', "Projects' Measures Inserted!");
            yield this.updateComponentMeasures();
            console.timeLog('DBTime', "Components' Measures Inserted!");
            //UPDATE of ALREADY LOADED PROJECTS    
            keysString = this.listKeyProjects(this.refreshProjects);
            this.projectsKeys = yield DBOperations_1.database.getProjectKeys(keysString);
            yield this.updateComponents();
            console.timeLog('DBTime', "Projects' Components Updated!");
            yield this.updateProjectMeasures();
            console.timeLog('DBTime', "Projects' Measures Updated!");
            yield this.updateComponentMeasures();
            console.timeLog('DBTime', "Components' Measures Updated!");
            yield DBOperations_1.database.updateDateLastAnalysis();
            console.timeLog('DBTime', "Finish Refreshing");
            console.timeEnd('DBTime');
            return 1;
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
                const dateLastAnalysis = yield DBOperations_1.database.getDateLastAnalysis();
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
                            if (yield DBOperations_1.database.checkProjectExists(proj.key)) {
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
                    yield DBOperations_1.database.insertProjects(this.newProjects);
                }
                for (let proj of this.refreshProjects) {
                    yield DBOperations_1.database.updateProjLastAnalysis(proj[0], proj[3]);
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
                            if (!(yield DBOperations_1.database.checkComponentExists(proj["idproject"], component.path))) {
                                let respComp = [proj["idproject"], component.name, component.qualifier, component.path, component.language];
                                compToInsert.push(respComp);
                            }
                        }
                        if (compToInsert.length >= this.insertBlock) {
                            yield DBOperations_1.database.insertComponents(compToInsert);
                            compToInsert = [];
                        }
                    }
                }
                if (compToInsert.length > 0) {
                    yield DBOperations_1.database.insertComponents(compToInsert);
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
                        let idMetric = yield DBOperations_1.database.getMetricId(measure.metric);
                        idMeasure = yield DBOperations_1.database.getProjectIdMeasure(proj["idproject"], idMetric);
                        if (idMeasure == 0) {
                            let respMeas = [proj["idproject"], idMetric, measure.value];
                            projMeaToInsert.push(respMeas);
                        }
                        else {
                            yield DBOperations_1.database.updateProjMeasure(idMeasure, measure.value);
                        }
                    }
                    if (projMeaToInsert.length >= this.insertBlock) {
                        yield DBOperations_1.database.insertProjectMeasures(projMeaToInsert);
                        projMeaToInsert = [];
                    }
                }
                if (projMeaToInsert.length > 0) {
                    yield DBOperations_1.database.insertProjectMeasures(projMeaToInsert);
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
                    let componentsPaths = yield DBOperations_1.database.getComponentPathsOfProyects(proj['idproject']);
                    for (let comp of componentsPaths) {
                        let compMeasures = yield APIDataRecolection_1.sonarAPI.getComponentMeasures(proj['key'] + ':' + comp['path']);
                        if (compMeasures[0].metric != 'not found') {
                            let idMeasure;
                            for (let measure of compMeasures) {
                                let idMetric = yield DBOperations_1.database.getMetricId(measure.metric);
                                idMeasure = yield DBOperations_1.database.getComponentIdMeasure(comp['idcomponent'], idMetric);
                                if (idMeasure == 0) {
                                    let respMeas = [comp['idcomponent'], idMetric, measure.value];
                                    compMeaToInsert.push(respMeas);
                                }
                                else {
                                    yield DBOperations_1.database.updateCompMeasure(idMeasure, measure.value);
                                }
                            }
                        }
                        else {
                            console.log("Component Deleted");
                            yield DBOperations_1.database.deleteComponentAndMeasures(comp['idcomponent']);
                            this.updateComponentMeasures(); //FIJARSE <<<<<<<<<<<<<<<---------------------------
                        }
                        if (compMeaToInsert.length >= this.insertBlock) {
                            yield DBOperations_1.database.insertComponentMeasures(compMeaToInsert);
                            console.timeLog('DBTime', compMeaToInsert.length + " components' measures inserted of " + proj['idproject']);
                            compMeaToInsert = [];
                        }
                    }
                }
                if (compMeaToInsert.length > 0) {
                    yield DBOperations_1.database.insertComponentMeasures(compMeaToInsert);
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
