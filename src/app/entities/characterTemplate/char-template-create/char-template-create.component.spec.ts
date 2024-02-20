import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharTemplateCreateComponent } from './char-template-create.component';

describe('CharTemplateCreateComponent', () => {
  let component: CharTemplateCreateComponent;
  let fixture: ComponentFixture<CharTemplateCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CharTemplateCreateComponent]
    });
    fixture = TestBed.createComponent(CharTemplateCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
