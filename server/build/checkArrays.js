"use strict";
class checkArrays {
    checkArray(p_array) {
        var res = p_array.every((element) => {
            let id = +element;
            return !isNaN(id);
        });
        console.log(res);
        return res;
    }
}
const arrayChecker = new checkArrays();
arrayChecker.checkArray(['4', '1', '2']);
//export default arrayChecker;
