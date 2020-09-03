import { AlertComponent } from '../../alert/alert.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportModalComponent } from './export-modal.component';
import { ProjectsService } from '../../../../services/projects/projects.service';

describe('ExportModalComponent Test', () => {
  let component: ExportModalComponent;
  let fixture: ComponentFixture<ExportModalComponent>;

  beforeEach(async(() => {

    const projectsService = jasmine.createSpyObj('ProjectsService', ['']);

    TestBed.configureTestingModule({
      declarations: [ ExportModalComponent, AlertComponent ],
      providers: [
        { provide: ProjectsService, useValue: projectsService } 
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.projectsExported = [1,2,3];
    component.projMetricsExported = [];
    component.compMetricsExported = [0];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should export option be empty', () => {
    expect(component.exportOption).toBeUndefined();
  })

  it('should change selections in radio button group', () => {
    component.selectRadio('csv');
    expect(component.exportOption).toBe('csv');
    component.selectRadio('xml');
    expect(component.exportOption).toBe('xml');
  });

  it("should be true the validation of selected project's metrics", () => {
    component.projMetricsExported = [4,5,6];
    component.compMetricsExported = [0];
    expect(component.validProjMetricsSelected(false)).toBeTrue();
  });

  it("should be false the validation of selected project's metrics", () => {
    component.projMetricsExported = [];
    component.compMetricsExported = [0];
    expect(component.validProjMetricsSelected(false)).toBeFalse();
  });

  it("should be true the validation of selected component's metrics", () => {
    component.projMetricsExported = [4,5,6];
    component.compMetricsExported = [7,8,9];
    expect(component.validCompMetricsSelected(false)).toBeTrue();
  });

  it("should be false the validation of selected project's metrics", () => {
    component.projMetricsExported = [4,5,6];
    component.compMetricsExported = [0];
    expect(component.validCompMetricsSelected(false)).toBeFalse();
  });


});
