"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class checkNumericArray {
    checkArray(p_array) {
        const res = p_array.every((element) => {
            let id = +element;
            return !isNaN(id);
        });
        return res;
    }
}
const numericArrayChecker = new checkNumericArray();
exports.default = numericArrayChecker;
