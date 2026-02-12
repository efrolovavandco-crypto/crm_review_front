import { Component } from '@angular/core';
import {PollsService} from "../../_services/polls.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-restart-polls-user',
  templateUrl: './restart-polls-user.component.html',
  styleUrls: ['./restart-polls-user.component.css']
})
export class RestartPollsUserComponent {
  constructor(
    public pollService: PollsService,
    public activeModal:NgbActiveModal
  ){}
  AccessReset(){
    // this.pollService.reset()
  }
}
