import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollsUserComponent } from './polls-user.component';

describe('PollsUserComponent', () => {
  let component: PollsUserComponent;
  let fixture: ComponentFixture<PollsUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PollsUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
