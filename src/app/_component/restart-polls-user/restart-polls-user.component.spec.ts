import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestartPollsUserComponent } from './restart-polls-user.component';

describe('RestartPollsUserComponent', () => {
  let component: RestartPollsUserComponent;
  let fixture: ComponentFixture<RestartPollsUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestartPollsUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestartPollsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
