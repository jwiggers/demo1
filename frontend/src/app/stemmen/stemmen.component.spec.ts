import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StemmenComponent } from './stemmen.component';

describe('StemmenComponent', () => {
  let component: StemmenComponent;
  let fixture: ComponentFixture<StemmenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StemmenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StemmenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
