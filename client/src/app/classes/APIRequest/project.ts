import { Measure } from './measure';
import { Component } from './component';

export interface Project{

    idproject: number;
    key: string;
    name: string;
    qualifier: string;
    lastAnalysis: Date;
    projectLink: string;
    project_measure : Measure [];
    component : Component [];

}