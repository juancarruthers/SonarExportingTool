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
class ComponentController {
    listComponentsMeasures(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idproj } = req.params;
                const projArray = idproj.split(',');
                const { idmet } = req.params;
                let queryComponent;
                if (projArray.length == 1) {
                    const projectsIds = idproj.split(',');
                    const metricsIds = idmet.split(',');
                    queryComponent = yield database_1.default
                        .query('SELECT * FROM components AS c WHERE idproject IN ( ? ) ORDER BY c.idproject ASC', [projectsIds]);
                    let index = 0;
                    for (let comp of queryComponent) {
                        const queryMeasures = yield database_1.default
                            .query('SELECT m.domain, m.key, m.name, m.description, m.type, cm.value FROM component_measures AS cm JOIN metrics as m ON m.idmetric = cm.idmetric WHERE idcomponent = ? AND m.idmetric IN (?) ORDER BY m.domain, m.name ASC', [comp['idcomponent'], metricsIds]);
                        comp['component_measure'] = queryMeasures;
                        queryComponent[index] = comp;
                        index = index + 1;
                    }
                }
                else {
                    queryComponent = "You can request only for one project's components' measures at a time.";
                }
                res.json(queryComponent);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    countComponentsMeasures(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idproj } = req.params;
                const { idmet } = req.params;
                const projectsIds = idproj.split(',');
                const metricsIds = idmet.split(',');
                let queryComponent = yield database_1.default
                    .query('SELECT count(idmeasure) AS count FROM component_measures AS cm JOIN components AS c ON c.idcomponent = cm.idcomponent WHERE c.idproject IN ( ? ) AND cm.idmetric IN ( ? ) ', [projectsIds, metricsIds]);
                res.json(queryComponent[0]['count']);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.componentController = new ComponentController();
