import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePollsComponent } from './delete-polls.component';

describe('DeletePollsComponent', () => {
  let component: DeletePollsComponent;
  let fixture: ComponentFixture<DeletePollsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletePollsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletePollsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
