import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesViewComponent } from './templates-view.component';

describe('TemplatesViewComponent', () => {
  let component: TemplatesViewComponent;
  let fixture: ComponentFixture<TemplatesViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TemplatesViewComponent],
    });
    fixture = TestBed.createComponent(TemplatesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
