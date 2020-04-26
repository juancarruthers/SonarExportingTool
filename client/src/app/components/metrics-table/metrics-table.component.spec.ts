//Components
import { MetricsTableComponent } from './metrics-table.component';
import { TwoOptionModalComponent } from '../two-option-modal/two-option-modal.component';
import { ExportModalComponent } from '../export-modal/export-modal.component';

//Classes
import { Metric } from '../../classes/APIRequest/metric';

//Testing
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

//Services
import { ProjectsService } from '../../services/projects/projects.service';

describe('MetricsTableComponent Test', () => {
  let component: MetricsTableComponent;
  let fixture: ComponentFixture<MetricsTableComponent>;
  let testMetrics: Metric[];

  let getProjectMetricsSpy: any;
  let getExportedProjectsSpy: any;

  beforeEach(async(() => {
    testMetrics = [{idmetric: 1, key: 'Metric-1', type: 'Testing', name: 'Metric 1', description: "Metric used in Testing", domain: 'Testing'}];
    testMetrics.push({idmetric: 2, key: 'Metric-2', type: 'Testing', name: 'Metric 2', description: "Metric used in Testing", domain: 'Testing'});

    
    const projectsService = jasmine.createSpyObj('ProjectsService', ['getProjectMetrics', 'getExportedProjects']);
    
    getProjectMetricsSpy = projectsService.getProjectMetrics.and.returnValue( of(testMetrics) );
    getExportedProjectsSpy = projectsService.getExportedProjects.and.returnValue([1,2,3]);

    TestBed.configureTestingModule({
      declarations: [ MetricsTableComponent, TwoOptionModalComponent, ExportModalComponent ],
      providers: [ 
        
        { provide: ProjectsService, useValue: projectsService } 
      ]
    })
    .compileComponents();
    
    
    
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have projectsExported set', () => {
    expect(component.projectsExported).not.toBeUndefined();
  });

  it('should check a metric to export', () => {
    component.checkElement(true,1);
    expect(component.metricsExported.length).toBeGreaterThan(0);
  });

  it('should check all the metrics', () => {
    component.checkAll();
    expect(component.metricsExported.length).toBe(testMetrics.length);
  });

  it('should uncheck a metric', () => {
    component.checkAll();
    component.checkElement(false, 1);
    expect(component.metricsExported).not.toContain(1);
  });

});
