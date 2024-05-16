import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharTemplateViewComponent } from './char-template-view.component';

describe('CharTemplateViewComponent', () => {
  let component: CharTemplateViewComponent;
  let fixture: ComponentFixture<CharTemplateViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CharTemplateViewComponent],
    });
    fixture = TestBed.createComponent(CharTemplateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
