import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatteryStatusPage } from './battery-status.page';

describe('BatteryStatusPage', () => {
  let component: BatteryStatusPage;
  let fixture: ComponentFixture<BatteryStatusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatteryStatusPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatteryStatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
