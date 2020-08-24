class checkNumericArray{

    checkArray(p_array: string[]): boolean{
        const res = p_array.every((element) =>
                                        {
                                            let id = + element;
                                            return !isNaN(id);
                                        }
                                );
        return res;
    }
}
const numericArrayChecker = new checkNumericArray ();
export default numericArrayChecker;