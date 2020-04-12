import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsTableComponent } from './metrics-table.component';

describe('MetricsTableComponent', () => {
  let component: MetricsTableComponent;
  let fixture: ComponentFixture<MetricsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricsTableComponent ]
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
});
