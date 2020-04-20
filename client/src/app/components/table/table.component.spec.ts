import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableComponent } from './table.component';
import { ProjectsService } from 'src/app/services/projects.service';

fdescribe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let projectsServiceStub: Partial<ProjectsService>;

  beforeEach(async(() => {

    projectsServiceStub = {
      projMetricsExported: [1,2,3,4],
      projectsExported: [1,2,3,4],
      API_URI: 'http://localhost:3000/api/projects'
    }

    TestBed.configureTestingModule({
      declarations: [ TableComponent ],
      providers: [ 
        
        { provide: ProjectsService, useValue: projectsServiceStub } 
      ]
    })  
    
    component = new TableComponent(projectsServiceStub)
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    //component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should have all the projects loaded", () =>{
    expect(component.projects).not.toBeUndefined();
  });
})
