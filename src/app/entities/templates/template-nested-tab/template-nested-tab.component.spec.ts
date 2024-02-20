import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateNestedTabComponent } from './template-nested-tab.component';

describe('TemplateNestedTabComponent', () => {
  let component: TemplateNestedTabComponent;
  let fixture: ComponentFixture<TemplateNestedTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TemplateNestedTabComponent]
    });
    fixture = TestBed.createComponent(TemplateNestedTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
