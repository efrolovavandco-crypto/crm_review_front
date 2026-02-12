import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePollsComponent } from './create-polls.component';

describe('CreatePollsComponent', () => {
  let component: CreatePollsComponent;
  let fixture: ComponentFixture<CreatePollsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePollsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePollsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
