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
const url_1 = require("url");
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs_1 = require("fs");
const path_1 = require("path");
class APIDataRecolection {
    constructor() {
        //ORGANIZATION
        this.organization = 'juancarruthers-github'; //'unne-sonar-corpus';
        //HTTP HEADERS
        let key;
        const path = path_1.resolve(__dirname, '../../key.sonar');
        key = fs_1.readFileSync(path, 'utf8');
        //HEADERS WITH AUTHENTICATION INFO
        this.headers = {
            'content-type': 'application/json',
            'authorization': 'Basic ' + key
        };
    }
    APIGetRequest(p_url) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = new url_1.URL(p_url);
            let api_query = yield node_fetch_1.default(url, {
                method: 'GET',
                headers: this.headers
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
    numberPages(p_url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const api_query = yield this.APIGetRequest(p_url);
                const response_page = api_query["paging"];
                const numberElements = response_page["total"];
                const totalPages = Math.ceil(numberElements / 500);
                return totalPages;
            }
            catch (error) {
                console.log(error);
                return 0;
            }
        });
    }
    getMetrics() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = "https://sonarcloud.io/api/metrics/search?p=1&ps=500";
                const api_query = yield this.APIGetRequest(url);
                const metrics = api_query["metrics"];
                return metrics;
            }
            catch (error) {
                console.log(error);
                return [{ id: 0, key: 'error', type: '', name: '', description: '', domain: 'error' }];
            }
        });
    }
    getProjects(p_pageNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = 'https://sonarcloud.io/api/projects/search?organization=' + this.organization + '&p=' + p_pageNumber + '&ps=500';
                const api_query = yield this.APIGetRequest(url);
                const projects = api_query["components"];
                return projects;
            }
            catch (error) {
                console.log(error);
                return [{ name: 'error', key: '', qualifier: '', lastAnalysisDate: '' }];
            }
        });
    }
    getComponents(p_projectKey, p_pageNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = "https://sonarcloud.io/api/components/tree?component=" + p_projectKey + "&p=" + p_pageNumber + "&ps=500";
                const api_query = yield this.APIGetRequest(url);
                const components = api_query["components"];
                return components;
            }
            catch (error) {
                console.log(error);
                return [{ name: 'error', path: '', qualifier: '' }];
            }
        });
    }
    getProjectMeasures(p_projectKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //eliminada metricas quality_profiles, quality_gate_details, sonarjava_feedback
                const url = "https://sonarcloud.io/api/measures/component?component=" + p_projectKey + "&metricKeys=new_technical_debt, blocker_violations, bugs, classes, code_smells, cognitive_complexity, comment_lines, comment_lines_data, comment_lines_density, class_complexity, file_complexity, function_complexity, complexity_in_classes, complexity_in_functions, branch_coverage, new_branch_coverage, conditions_to_cover, new_conditions_to_cover, confirmed_issues, coverage, new_coverage, critical_violations, complexity, last_commit_date, development_cost, new_development_cost, directories, duplicated_blocks, new_duplicated_blocks, duplicated_files, duplicated_lines, duplicated_lines_density, new_duplicated_lines, new_duplicated_lines_density, duplications_data, effort_to_reach_maintainability_rating_a, executable_lines_data, false_positive_issues, file_complexity_distribution, files, function_complexity_distribution, functions, generated_lines, generated_ncloc, info_violations, violations, line_coverage, new_line_coverage, lines, ncloc, ncloc_language_distribution, lines_to_cover, new_lines_to_cover, sqale_rating, new_maintainability_rating, major_violations, minor_violations, ncloc_data, new_blocker_violations, new_bugs, new_code_smells, new_critical_violations, new_info_violations, new_violations, new_lines, new_major_violations, new_minor_violations, new_security_hotspots, new_vulnerabilities, open_issues, projects, public_api, public_documented_api_density, public_undocumented_api, alert_status, reliability_rating, new_reliability_rating, reliability_remediation_effort, new_reliability_remediation_effort, reopened_issues, security_hotspots, security_rating, new_security_rating, security_remediation_effort, new_security_remediation_effort, security_review_rating, skipped_tests, statements, sqale_index, sqale_debt_ratio, new_sqale_debt_ratio, uncovered_conditions, new_uncovered_conditions, uncovered_lines, new_uncovered_lines, test_execution_time, test_errors, test_failures, tests, test_success_density, vulnerabilities, wont_fix_issues&ps=500&p=1";
                const api_query = yield this.APIGetRequest(url);
                const measures = api_query["component"]["measures"];
                return measures;
            }
            catch (error) {
                console.log(error);
                return [{ metric: 'error', value: '' }];
            }
        });
    }
    getComponentMeasures(p_componentKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //eliminada metricas quality_profiles, quality_gate_details, sonarjava_feedback, ncloc_data, executable_lines_data, duplications_data  y todas las new (contienen periods)
                const url = "https://sonarcloud.io/api/measures/component?component=" + p_componentKey + "&metricKeys=blocker_violations, bugs, classes, code_smells, cognitive_complexity, comment_lines, comment_lines_data, comment_lines_density, class_complexity, file_complexity, function_complexity, complexity_in_classes, complexity_in_functions, branch_coverage, conditions_to_cover, confirmed_issues, coverage, critical_violations, complexity, last_commit_date, development_cost, directories, duplicated_blocks, duplicated_files, duplicated_lines, duplicated_lines_density, effort_to_reach_maintainability_rating_a, false_positive_issues, file_complexity_distribution, files, function_complexity_distribution, functions, generated_lines, generated_ncloc, info_violations, violations, line_coverage, lines, ncloc, ncloc_language_distribution, lines_to_cover, sqale_rating, major_violations, minor_violations, open_issues, projects, public_api, public_documented_api_density, public_undocumented_api, alert_status, reliability_rating, reliability_remediation_effort, reopened_issues, security_hotspots, security_rating, security_remediation_effort, security_review_rating, skipped_tests, statements, sqale_index, sqale_debt_ratio, uncovered_conditions, uncovered_lines, new_uncovered_lines, test_execution_time, test_errors, test_failures, tests, test_success_density, vulnerabilities, wont_fix_issues&ps=500&p=1";
                const api_query = yield this.APIGetRequest(url);
                let measures;
                if (!JSON.stringify(api_query).includes("not found")) {
                    measures = api_query["component"]["measures"];
                }
                else {
                    measures = [{ metric: 'not found', value: '' }];
                }
                return measures;
            }
            catch (error) {
                console.log(error);
                return [{ metric: 'error', value: '' }];
            }
        });
    }
}
exports.sonarAPI = new APIDataRecolection();
