import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartPollsUserComponent } from './start-polls-user.component';

describe('StartPollsUserComponent', () => {
  let component: StartPollsUserComponent;
  let fixture: ComponentFixture<StartPollsUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartPollsUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartPollsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
