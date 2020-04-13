import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportProgressBarComponent } from './export-progress-bar.component';

describe('ExportProgressBarComponent', () => {
  let component: ExportProgressBarComponent;
  let fixture: ComponentFixture<ExportProgressBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportProgressBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
