import {Component, Input, OnDestroy} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {User} from "../../_interface/user";
import {Poll} from "../../_interface/polls";
import {PollsService} from "../../_services/polls.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-delete-polls',
  templateUrl: './delete-polls.component.html',
  styleUrls: ['./delete-polls.component.css']
})
export class DeletePollsComponent implements OnDestroy{
  @Input() poll!: Poll;
  subscription = new Subscription;
  constructor(
    public activeModal:NgbActiveModal,
    private pollService:PollsService
  ) {}
  deletePoll(){
    this.subscription.add(
      this.pollService.delete(this.poll.id).subscribe({
        next:()=>{
          this.activeModal.close(true);
        },
        error:err => {
          console.error(err);
      }
    }))
  }
  ngOnDestroy(){
    this.subscription.unsubscribe()
  }
}

