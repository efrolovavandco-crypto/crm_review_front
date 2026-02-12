import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollsStatisticsComponent } from './polls-statistics.component';

describe('PollsStatisticsComponent', () => {
  let component: PollsStatisticsComponent;
  let fixture: ComponentFixture<PollsStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PollsStatisticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollsStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
