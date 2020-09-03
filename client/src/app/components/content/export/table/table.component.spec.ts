import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableComponent } from './table.component';
import { ProjectsService } from '../../../../services/projects/projects.service';
import { of } from 'rxjs';
import { Project } from '../../../../classes/APIRequest/project';

describe('TableComponent Test', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let testProjects: Project[];
  let getProjectsSpy: any


  beforeEach(async(() => {
    testProjects = [{idproject: 1, key:'Project-1' , name: 'Project 1', qualifier: 'TEST', lastAnalysis: new Date(), projectLink: '', version: '', component : [], project_measure : []}];
    testProjects.push({idproject: 2, key:'Project-2' , name: 'Project 2', qualifier: 'TEST', lastAnalysis: new Date(), projectLink: '', version: '', component : [], project_measure : []})
    
    const projectsService = jasmine.createSpyObj('ProjectsService', ['getProjects']);
    
    getProjectsSpy = projectsService.getProjects.and.returnValue( of(testProjects) );

    TestBed.configureTestingModule({
      declarations: [ TableComponent ],
      providers: [ 
        
        { provide: ProjectsService, useValue: projectsService } 
      ]
    })
    .compileComponents();
    
    
    
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should have all the projects loaded", () =>{
    expect(component.projects).not.toBeUndefined();
  });

  it("should projectsExported have a project checked", () => {
    component.checkElement(true,1);
    expect(component.projectsExported.length).toBe(1);
  })

  it("should projectsExported have all projects checked", () => {
    component.checkAll(true);
    expect(component.projectsExported.length).toBeGreaterThan(1);
  })

  it("should projectsExported have a project unchecked", () => {
    component.checkAll(true);
    let projectsSelected = component.projectsExported;
    component.checkElement(false,2);
    expect(component.projectsExported.length).toBeLessThan(projectsSelected.length);
  })

  it("should projectsExported have all projects unchecked", () => {
    component.checkAll(true);
    component.checkAll(false);
    expect(component.projectsExported.length).toBe(0);
  })

})
