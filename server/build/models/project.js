"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Project {
    constructor(p_key, p_name, p_qualifier, p_lastAnalysis) {
        this.key = p_key;
        this.name = p_name;
        this.qualifier = p_qualifier;
        this.lastAnalysis = p_lastAnalysis;
    }
    getKey() {
        return this.key;
    }
    getName() {
        return this.name;
    }
    getQualifier() {
        return this.qualifier;
    }
    getLastAnalysis() {
        return this.lastAnalysis;
    }
}
exports.Project = Project;
