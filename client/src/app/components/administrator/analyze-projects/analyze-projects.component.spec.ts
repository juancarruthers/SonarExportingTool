import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyzeProjectsComponent } from './analyze-projects.component';

describe('AnalyzeProjectsComponent', () => {
  let component: AnalyzeProjectsComponent;
  let fixture: ComponentFixture<AnalyzeProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyzeProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyzeProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
