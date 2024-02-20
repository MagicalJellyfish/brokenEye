import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCharListComponent } from './user-char-list.component';

describe('UserCharListComponent', () => {
  let component: UserCharListComponent;
  let fixture: ComponentFixture<UserCharListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserCharListComponent]
    });
    fixture = TestBed.createComponent(UserCharListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
