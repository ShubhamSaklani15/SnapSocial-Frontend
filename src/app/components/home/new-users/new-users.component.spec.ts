import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUsersComponent } from './new-users.component';

describe('NewUsersComponent', () => {
  let component: NewUsersComponent;
  let fixture: ComponentFixture<NewUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewUsersComponent]
    });
    fixture = TestBed.createComponent(NewUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
