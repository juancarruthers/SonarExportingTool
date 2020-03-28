export class Component{

    private idproject: number;
    private name: string;
    private qualifier: string;
    private path: string;
    private language: string;

    constructor(p_idproject: number, p_name: string, p_qualifier: string, p_path: string, p_language: string){
        this.idproject = p_idproject;
        this.name = p_name;
        this.qualifier = p_qualifier;
        this.path = p_path;
        this.language = p_language;
    }

}