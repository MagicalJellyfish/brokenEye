import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateDialogTabSingleComponent } from './template-dialog-tab-single.component';

describe('TemplateDialogTabSingleComponent', () => {
  let component: TemplateDialogTabSingleComponent;
  let fixture: ComponentFixture<TemplateDialogTabSingleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TemplateDialogTabSingleComponent]
    });
    fixture = TestBed.createComponent(TemplateDialogTabSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
