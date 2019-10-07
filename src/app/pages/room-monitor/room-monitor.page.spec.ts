import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomMonitorPage } from './room-monitor.page';

describe('RoomMonitorPage', () => {
  let component: RoomMonitorPage;
  let fixture: ComponentFixture<RoomMonitorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomMonitorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomMonitorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
