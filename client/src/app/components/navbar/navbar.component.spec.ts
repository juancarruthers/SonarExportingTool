import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../services/auth/auth.service';

describe('NavbarComponent Test', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async(() => {

    const authService = jasmine.createSpyObj('AuthService', ['']);

    TestBed.configureTestingModule({
      declarations: [ NavbarComponent ],
      providers: [
        { provide: AuthService, useValue: authService } 
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
