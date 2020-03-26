export class Metric{

    private idmetric: number;
    private key: string;
    private type: string;
    private name: string;
    private description: string;
    private domain: string;

    constructor(p_idmetric: number, p_key: string, p_type: string, p_name: string, p_description: string, p_domain: string){
        this.idmetric = p_idmetric;
        this.key = p_key;
        this.type = p_type;
        this.name = p_name;
        this.description = p_description;
        this.domain = p_domain;
    }

    

}
