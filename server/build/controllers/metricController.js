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
class MetricController {
    constructor() {
    }
    //eliminada metricas quality_profiles, quality_gate_details, sonarjava_feedback
    listProjectMetrics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield database_1.default
                .then((r) => r
                .query('SELECT * FROM metrics AS m WHERE m.idmetric NOT IN (47, 294, 349) ORDER BY m.domain, m.key ASC'))
                .catch(err => {
                console.log(err);
            });
            res.set('Content-Type', 'application/json');
            res.json(query);
        });
    }
    //eliminada metricas quality_profiles, quality_gate_details, sonarjava_feedback, ncloc_data, executable_lines_data, duplications_data  y todas las new (contienen periods)
    listComponentMetrics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield database_1.default
                .then((r) => r
                .query('SELECT * FROM metrics AS m WHERE m.idmetric NOT IN (47, 294, 349, 238, 321, 53, 164, 165, 166, 167, 168, 169, 172, 173, 174, 175, 176, 177, 178, 289, 304, 307, 309, 311, 314, 318, 337, 338, 339, 340, 341, 342, 343, 348, 351) ORDER BY m.domain, m.key ASC'))
                .catch(err => {
                console.log(err);
            });
            res.set('Content-Type', 'application/json');
            res.json(query);
        });
    }
}
exports.metricController = new MetricController();
