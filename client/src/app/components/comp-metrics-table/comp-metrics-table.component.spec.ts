import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompMetricsTableComponent } from './comp-metrics-table.component';

describe('CompMetricsTableComponent', () => {
  let component: CompMetricsTableComponent;
  let fixture: ComponentFixture<CompMetricsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompMetricsTableComponent ]
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
});
