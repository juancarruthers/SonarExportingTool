export class Project{

    private key: string;
    private name: string;
    private qualifier: string;
    private lastAnalysis: Date;

    constructor(p_key: string, p_name: string, p_qualifier: string, p_lastAnalysis: Date){
        this.key = p_key;
        this.name = p_name;
        this.qualifier = p_qualifier;
        this.lastAnalysis = p_lastAnalysis;
    }

    getKey(): string{
        return this.key;
    }

    getName(): string{
        return this.name;
    }

    getQualifier(): string{
        return this.qualifier
    }

    getLastAnalysis(): Date{
        return this.lastAnalysis;
    }

}
