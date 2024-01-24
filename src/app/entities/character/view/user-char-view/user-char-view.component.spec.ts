import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCharViewComponent } from './user-char-view.component';

describe('UserCharViewComponent', () => {
  let component: UserCharViewComponent;
  let fixture: ComponentFixture<UserCharViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserCharViewComponent]
    });
    fixture = TestBed.createComponent(UserCharViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
