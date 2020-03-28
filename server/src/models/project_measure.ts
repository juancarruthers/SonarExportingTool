export class Project_measure{

    private idproject: number;
    private idmetric: number;
    private value: string;

    constructor(p_idproject: number, p_idmetric: number, p_value: string){
        this.idproject = p_idproject;
        this.idmetric = p_idmetric;
        this.value = p_value;
    }

}