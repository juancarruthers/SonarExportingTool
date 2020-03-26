"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Metric {
    constructor(p_idmetric, p_key, p_type, p_name, p_description, p_domain) {
        this.idmetric = p_idmetric;
        this.key = p_key;
        this.type = p_type;
        this.name = p_name;
        this.description = p_description;
        this.domain = p_domain;
    }
}
exports.Metric = Metric;
