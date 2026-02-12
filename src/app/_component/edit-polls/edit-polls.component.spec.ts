import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPollsComponent } from './edit-polls.component';

describe('EditPollsComponent', () => {
  let component: EditPollsComponent;
  let fixture: ComponentFixture<EditPollsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPollsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPollsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
