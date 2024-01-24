import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementTabComponent } from './element-tab.component';

describe('ElementTabComponent', () => {
  let component: ElementTabComponent;
  let fixture: ComponentFixture<ElementTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ElementTabComponent]
    });
    fixture = TestBed.createComponent(ElementTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
