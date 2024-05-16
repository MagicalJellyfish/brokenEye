import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharViewComponent } from './char-view.component';

describe('CharViewComponent', () => {
  let component: CharViewComponent;
  let fixture: ComponentFixture<CharViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CharViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CharViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
