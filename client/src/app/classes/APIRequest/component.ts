import { Measure } from './measure';

export interface Component {
    idcomponent: number;
    idproject:number;
    name : string;
    qualifier : string;
    path : string;
    language : string;
    component_measure : Measure [];
}
