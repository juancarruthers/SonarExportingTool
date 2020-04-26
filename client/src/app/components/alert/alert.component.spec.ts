import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertComponent } from './alert.component';

describe('AlertComponent Test', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create Alert Component', () => {
    expect(component).toBeTruthy();
  });

  it("should attribute 'show' to be false because the alert is closed", () => {
    component.closeAlert();
    expect(component.show).toBeFalse();
  });

  it("should attribute 'show' to be true because the alert is opened", () => {
    component.showAlert();
    expect(component.show).toBeTrue();
  });
});
