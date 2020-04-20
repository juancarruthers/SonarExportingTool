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
const database_1 = __importDefault(require("./database"));
const url_1 = require("url");
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs_1 = require("fs");
const path_1 = require("path");
const project_1 = require("./models/project");
const project_measure_1 = require("./models/project_measure");
const component_measure_1 = require("./models/component_measure");
const component_1 = require("./models/component");
class RefreshAPIModule {
    constructor() {
        this.refreshProjects = [];
        this.newProjects = [];
        this.organization = 'unne-sonar-corpus';
        this.projectsKeys = '';
    }
    main() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.searchLastAnalysis();
            yield this.updateProjects();
            //Insertion of NEW PROJECTS    
            this.projectsKeys = this.listKeyProjects(this.newProjects);
            yield this.updateComponents(this.projectsKeys);
            yield this.updateProjectMeasures(this.projectsKeys);
            yield this.updateComponentMeasures(this.projectsKeys);
            //UPDATE of ALREADY LOADED PROJECTS    
            this.projectsKeys = this.listKeyProjects(this.refreshProjects);
            yield this.updateComponents(this.projectsKeys);
            yield this.updateProjectMeasures(this.projectsKeys);
            yield this.updateComponentMeasures(this.projectsKeys);
            yield this.updateDateLastAnalysis();
            return 1;
        });
    }
    getProjectIdMeasure(p_idproject, p_idmetric) {
        return __awaiter(this, void 0, void 0, function* () {
            let queryIdmeasure = yield database_1.default
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
            let queryIdmeasure = yield database_1.default
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
    getDateLastAnalysis() {
        return __awaiter(this, void 0, void 0, function* () {
            let queryDateLastAnalysis = yield database_1.default
                .then((r) => r
                .query('SELECT date FROM lastUpdate'))
                .catch(err => {
                console.log(err);
            });
            return queryDateLastAnalysis[0]['date'];
        });
    }
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
    updateDateLastAnalysis() {
        return __awaiter(this, void 0, void 0, function* () {
            let date = new Date(Date.now());
            yield database_1.default
                .then((r) => r
                .query('UPDATE lastUpdate SET date = ? WHERE id = 1', date))
                .catch(err => {
                console.log(err);
            });
            console.log("Date Last Analysis Updated!");
        });
    }
    checkProjectExists(p_projectKey) {
        return __awaiter(this, void 0, void 0, function* () {
            let querykeyProj = yield database_1.default
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
            let queryNameComp = yield database_1.default
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
        let keyList = "";
        for (let project of p_projects) {
            keyList = keyList + project.getKey() + ',';
        }
        keyList = keyList.replace(/\,$/, '');
        return keyList;
    }
    APIGetRequest(p_url, p_headers) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = new url_1.URL(p_url);
            let api_query = yield node_fetch_1.default(url, {
                method: 'GET',
                headers: p_headers
            })
                .then(response => {
                return response.json();
            })
                .catch(err => {
                console.log(err);
            });
            return api_query;
        });
    }
    searchLastAnalysis() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var key;
                var path = path_1.resolve(__dirname, '../key.sonar');
                key = fs_1.readFileSync(path, 'utf8');
                //Headers con el token de autorizacion
                let url = 'https://sonarcloud.io/api/projects/search?organization=' + this.organization + '&ps=500';
                let head = {
                    'content-type': 'application/json',
                    'authorization': 'Basic ' + key
                };
                let api_query = yield this.APIGetRequest(url, head);
                let response = api_query["components"];
                let dateLastAnalysis = yield this.getDateLastAnalysis();
                for (let proj of response) {
                    let timestamp = proj["lastAnalysisDate"].split('T');
                    let date = timestamp[0].split('-');
                    let timestampAnalysis = new Date(date[0], date[1] - 1, date[2]);
                    if (timestampAnalysis > dateLastAnalysis) {
                        let respProj = new project_1.Project(proj["key"], proj["name"], proj["qualifier"], timestampAnalysis);
                        if (yield this.checkProjectExists(respProj.getKey())) {
                            this.refreshProjects.push(respProj);
                        }
                        else {
                            this.newProjects.push(respProj);
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
                for (let proj of this.newProjects) {
                    yield database_1.default
                        .then((r) => r.query('INSERT INTO projects set ?', [proj])
                        .catch(err => {
                        console.log(err);
                    }));
                }
                for (let proj of this.refreshProjects) {
                    yield database_1.default
                        .then((r) => r.query('UPDATE projects AS p SET p.lastAnalysis = ? WHERE p.key = ?', [proj.getLastAnalysis(), proj.getKey()])
                        .catch(err => {
                        console.log(err);
                    }));
                }
                console.log('Projects Updated!');
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updateComponents(p_projectsKeyList) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let projectsKeys = yield database_1.default
                    .then((r) => r.query('SELECT p.idproject, p.key FROM projects AS p WHERE p.key IN (?)', p_projectsKeyList)
                    .catch(err => {
                    console.log(err);
                }));
                for (let proj of projectsKeys) {
                    let url = "https://sonarcloud.io/api/components/tree?component=" + proj['key'] + "&p=1&ps=500";
                    let api_query = yield this.APIGetRequest(url, '');
                    let response_page = api_query["paging"];
                    let totalPages = response_page["total"] / 500;
                    let cont = 0;
                    let response_components;
                    while (cont < totalPages) {
                        url = "https://sonarcloud.io/api/components/tree?component=" + proj['key'] + "&p=" + (cont + 1) + "&ps=500";
                        api_query = yield this.APIGetRequest(url, '');
                        response_components = api_query["components"];
                        for (let comp of response_components) {
                            if (!(yield this.checkComponentExists(proj["idproject"], comp["path"]))) {
                                let respComp = new component_1.Component(proj["idproject"], comp["name"], comp["qualifier"], comp["path"], comp["language"]);
                                database_1.default
                                    .then((r) => r.query('INSERT INTO components set ?', [respComp])
                                    .catch(err => {
                                    console.log(err);
                                }));
                            }
                        }
                        cont = cont + 1;
                    }
                }
                console.log("Projects' Components Updated!");
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updateProjectMeasures(p_projectsKeyList) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let projectsKeys = yield database_1.default
                    .then((r) => r.query('SELECT p.idproject, p.key FROM projects AS p WHERE p.key IN (?)', p_projectsKeyList)
                    .catch(err => {
                    console.log(err);
                }));
                for (let proj of projectsKeys) {
                    //eliminada metricas quality_profiles, quality_gate_details, sonarjava_feedback
                    let url = "https://sonarcloud.io/api/measures/component?component=" + proj['key'] + "&metricKeys=new_technical_debt, blocker_violations, bugs, classes, code_smells, cognitive_complexity, comment_lines, comment_lines_data, comment_lines_density, class_complexity, file_complexity, function_complexity, complexity_in_classes, complexity_in_functions, branch_coverage, new_branch_coverage, conditions_to_cover, new_conditions_to_cover, confirmed_issues, coverage, new_coverage, critical_violations, complexity, last_commit_date, development_cost, new_development_cost, directories, duplicated_blocks, new_duplicated_blocks, duplicated_files, duplicated_lines, duplicated_lines_density, new_duplicated_lines, new_duplicated_lines_density, duplications_data, effort_to_reach_maintainability_rating_a, executable_lines_data, false_positive_issues, file_complexity_distribution, files, function_complexity_distribution, functions, generated_lines, generated_ncloc, info_violations, violations, line_coverage, new_line_coverage, lines, ncloc, ncloc_language_distribution, lines_to_cover, new_lines_to_cover, sqale_rating, new_maintainability_rating, major_violations, minor_violations, ncloc_data, new_blocker_violations, new_bugs, new_code_smells, new_critical_violations, new_info_violations, new_violations, new_lines, new_major_violations, new_minor_violations, new_security_hotspots, new_vulnerabilities, open_issues, projects, public_api, public_documented_api_density, public_undocumented_api, alert_status, reliability_rating, new_reliability_rating, reliability_remediation_effort, new_reliability_remediation_effort, reopened_issues, security_hotspots, security_rating, new_security_rating, security_remediation_effort, new_security_remediation_effort, security_review_rating, skipped_tests, statements, sqale_index, sqale_debt_ratio, new_sqale_debt_ratio, uncovered_conditions, new_uncovered_conditions, uncovered_lines, new_uncovered_lines, test_execution_time, test_errors, test_failures, tests, test_success_density, vulnerabilities, wont_fix_issues&ps=500&p=1";
                    let api_query_measures = yield this.APIGetRequest(url, '');
                    let response = api_query_measures["component"]["measures"];
                    let idMeasure;
                    for (let mea of response) {
                        let idMetric = yield database_1.default
                            .then((r) => r.query('SELECT m.idmetric FROM metrics AS m WHERE m.key = ?', mea["metric"])
                            .catch(err => {
                            console.log(err);
                        }));
                        idMeasure = yield this.getProjectIdMeasure(proj["idproject"], idMetric['0']['idmetric']);
                        if (idMeasure == 0) {
                            let respMeas = new project_measure_1.Project_measure(proj["idproject"], idMetric['0']['idmetric'], mea["value"]);
                            yield database_1.default
                                .then((r) => r.query('INSERT INTO project_measures set ?', [respMeas])
                                .catch(err => {
                                console.log(err);
                            }));
                        }
                        else {
                            yield database_1.default
                                .then((r) => r.query('UPDATE project_measures SET value = ? WHERE idmeasure = ?', [mea["value"], idMeasure])
                                .catch(err => {
                                console.log(err);
                            }));
                        }
                    }
                }
                console.log("Projects' Measures Updated!");
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updateComponentMeasures(p_projectsKeyList) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let projectsKeys = yield database_1.default
                    .then((r) => r.query('SELECT p.idproject, p.key FROM projects AS p WHERE p.key IN (?)', p_projectsKeyList)
                    .catch(err => {
                    console.log(err);
                }));
                for (let proj of projectsKeys) {
                    let componentsPaths = yield database_1.default
                        .then((r) => r.query('SELECT c.idcomponent, c.path FROM components AS c WHERE c.idproject = ?', proj['idproject'])
                        .catch(err => {
                        console.log(err);
                    }));
                    for (let comp of componentsPaths) {
                        //eliminada metricas quality_profiles, quality_gate_details, sonarjava_feedback, ncloc_data, executable_lines_data, duplications_data  y todas las new (contienen periods)
                        let url = "https://sonarcloud.io/api/measures/component?component=" + proj['key'] + ':' + comp['path'] + "&metricKeys=blocker_violations, bugs, classes, code_smells, cognitive_complexity, comment_lines, comment_lines_data, comment_lines_density, class_complexity, file_complexity, function_complexity, complexity_in_classes, complexity_in_functions, branch_coverage, conditions_to_cover, confirmed_issues, coverage, critical_violations, complexity, last_commit_date, development_cost, directories, duplicated_blocks, duplicated_files, duplicated_lines, duplicated_lines_density, effort_to_reach_maintainability_rating_a, false_positive_issues, file_complexity_distribution, files, function_complexity_distribution, functions, generated_lines, generated_ncloc, info_violations, violations, line_coverage, lines, ncloc, ncloc_language_distribution, lines_to_cover, sqale_rating, major_violations, minor_violations, open_issues, projects, public_api, public_documented_api_density, public_undocumented_api, alert_status, reliability_rating, reliability_remediation_effort, reopened_issues, security_hotspots, security_rating, security_remediation_effort, security_review_rating, skipped_tests, statements, sqale_index, sqale_debt_ratio, uncovered_conditions, uncovered_lines, new_uncovered_lines, test_execution_time, test_errors, test_failures, tests, test_success_density, vulnerabilities, wont_fix_issues&ps=500&p=1";
                        let api_query = yield this.APIGetRequest(url, '');
                        if (!JSON.stringify(api_query).includes("not found")) {
                            let respMeasures = api_query["component"]["measures"];
                            let idMeasure;
                            for (let mea of respMeasures) {
                                let idMetric = yield database_1.default
                                    .then((r) => r.query('SELECT m.idmetric FROM metrics AS m WHERE m.key = ?', mea["metric"])
                                    .catch(err => {
                                    console.log(err);
                                }));
                                idMeasure = yield this.getComponentIdMeasure(comp['idcomponent'], idMetric['0']['idmetric']);
                                if (idMeasure == 0) {
                                    let respMeas = new component_measure_1.Component_measure(comp['idcomponent'], idMetric['0']['idmetric'], mea["value"]);
                                    yield database_1.default
                                        .then((r) => r.query('INSERT INTO component_measures set ?', [respMeas])
                                        .catch(err => {
                                        console.log(err);
                                    }));
                                }
                                else {
                                    yield database_1.default
                                        .then((r) => r.query('UPDATE component_measures SET value = ? WHERE idmeasure = ?', [mea["value"], idMeasure])
                                        .catch(err => {
                                        console.log(err);
                                    }));
                                }
                            }
                        }
                        else {
                            console.log("Component Deleted");
                            yield this.deleteComponentAndMeasures(comp['idcomponent']);
                            this.updateComponentMeasures(this.projectsKeys);
                        }
                    }
                }
                console.log("Components' Measures Updated!");
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.refreshModule = new RefreshAPIModule();
exports.refreshModule.main();
