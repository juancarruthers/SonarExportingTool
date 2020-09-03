//Components
import { CompMetricsTableComponent } from './comp-metrics-table.component';
import { ExportModalComponent } from '../export-modal/export-modal.component';

//Classes
import { Metric } from '../../../../classes/APIRequest/metric';

//Testing
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

//Services
import { ProjectsService } from '../../../../services/projects/projects.service';

describe('CompMetricsTableComponent Test', () => {
  let component: CompMetricsTableComponent;
  let fixture: ComponentFixture<CompMetricsTableComponent>;
  let testMetrics: Metric[];

  let getComponentMetricsSpy: any;
  let getExportedProjectsSpy: any;
  let getExportedProjectsMetricsSpy: any;

  beforeEach(async(() => {
    testMetrics = [{idmetric: 1, key: 'Metric-1', type: 'Testing', name: 'Metric 1', description: "Metric used in Testing", domain: 'Testing'}];
    testMetrics.push({idmetric: 2, key: 'Metric-2', type: 'Testing', name: 'Metric 2', description: "Metric used in Testing", domain: 'Testing'});

    
    const projectsService = jasmine.createSpyObj('ProjectsService', ['getComponentMetrics', 'getExportedProjects', 'getExportedProjectsMetrics']);
    
    getComponentMetricsSpy = projectsService.getComponentMetrics.and.returnValue( of(testMetrics) );
    getExportedProjectsSpy = projectsService.getExportedProjects.and.returnValue([1,2,3]);
    getExportedProjectsMetricsSpy = projectsService.getExportedProjectsMetrics.and.returnValue([4,5,6]);

    TestBed.configureTestingModule({
      declarations: [ CompMetricsTableComponent, ExportModalComponent ],
      providers: [ 
        
        { provide: ProjectsService, useValue: projectsService } 
      ]
    })
    .compileComponents();
    
    
    
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompMetricsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have projectsExported set', () => {
    expect(component.projectsExported).not.toBeUndefined();
  });

  it('should have projMetricsExported set', () => {
    expect(component.projMetricsExported).not.toBeUndefined();
  });

  it('should check a metric to export', () => {
    component.checkElement(true,1);
    expect(component.compMetricsExported.length).toBeGreaterThan(0);
  });

  it('should check all the metrics', () => {
    component.checkAll(true);
    expect(component.compMetricsExported.length).toBe(testMetrics.length);
  });

  it('should uncheck a metric', () => {
    component.checkAll(true);
    component.checkElement(false, 1);
    expect(component.compMetricsExported).not.toContain(1);
  });

});