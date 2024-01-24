import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateDialogTabMultipleComponent } from './template-dialog-tab-multiple.component';

describe('TemplateDialogTabMultipleComponent', () => {
  let component: TemplateDialogTabMultipleComponent;
  let fixture: ComponentFixture<TemplateDialogTabMultipleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TemplateDialogTabMultipleComponent]
    });
    fixture = TestBed.createComponent(TemplateDialogTabMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
