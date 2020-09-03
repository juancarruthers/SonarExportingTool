import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjTableEditionComponent } from './proj-table-edition.component';

describe('ProjTableEditionComponent', () => {
  let component: ProjTableEditionComponent;
  let fixture: ComponentFixture<ProjTableEditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjTableEditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjTableEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
