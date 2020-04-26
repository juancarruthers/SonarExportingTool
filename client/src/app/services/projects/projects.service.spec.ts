import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProjectsService } from './projects.service';


describe('ProjectsService Test', () => {

  let service: ProjectsService;
  let http : HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
    });

    service = TestBed.inject(ProjectsService);
    http = TestBed.inject(HttpTestingController);
    
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get to the right API', () => {
    expect(service.API_URI).toContain('/api/projects');
  })

  /*
  -->>Mutators Testing
  */

  it('should change the values in projectsExported', () => {
    service.setExportedProjects([1,2,3]);   
    expect(service.projectsExported).toEqual([1,2,3]);
  })

  it('should change the values in projMetricsExported', () => {
    service.setExportedProjectsMetrics([1,2,3]);   
    expect(service.projMetricsExported).toEqual([1,2,3]);
  })

  /*
  -->>Accessors Testing
  */

  it('should get a number greater than 0 from projectsExported', () => {
    service.setExportedProjects([1,2,3]);
    expect(service.getExportedProjects().length).toBe(3);
  })

  it('should get a 0 from projectsExported, because it is empty', () => {
    expect(service.getExportedProjects().length).toBe(0);
  })

  it('should get a number greater than 0 from projMetricsExported', () => {
    service.setExportedProjectsMetrics([1,2,3]);
    expect(service.getExportedProjectsMetrics().length).toBe(3);
  })

  it('should get a 0 from projMetricsExported, because it is empty', () => {
    expect(service.getExportedProjectsMetrics().length).toBe(0);
  })

});
