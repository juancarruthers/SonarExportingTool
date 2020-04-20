"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Component {
    constructor(p_idproject, p_name, p_qualifier, p_path, p_language) {
        this.idproject = p_idproject;
        this.name = p_name;
        this.qualifier = p_qualifier;
        this.path = p_path;
        this.language = p_language;
    }
    getIdproject() {
        return this.idproject;
    }
    getName() {
        return this.name;
    }
    getQualifier() {
        return this.qualifier;
    }
    getPath() {
        return this.path;
    }
    getLanguage() {
        return this.language;
    }
}
exports.Component = Component;
