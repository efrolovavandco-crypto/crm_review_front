import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {PollsService} from "../../../_services/polls.service";
import {User} from "../../../_interface/user";
import {Poll} from "../../../_interface/polls";
import {UploadModalComponent} from "../../../_component/upload-modal/upload-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {EditPollsComponent} from "../../../_component/edit-polls/edit-polls.component";
import {PollsStatisticsComponent} from "../../../_component/polls-statistics/polls-statistics.component";
import {DeletePollsComponent} from "../../../_component/delete-polls/delete-polls.component";
import {CreatePollsComponent} from "../../../_component/create-polls/create-polls.component";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.css']
})
export class PollsComponent implements OnInit, OnDestroy{
  polls: Poll[] = [];
  loading: boolean = true;
  subscription = new Subscription;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private pollsService:PollsService
  ) {
  }
  logout(){
    this.router.navigate(['/admin'])
  }

  ngOnInit() {
    this.subscription.add(
      this.pollsService.polls$.subscribe(polls => {
      this.polls = polls;
    }));
    this.pollsService.getAll();
    this.loading=false;
  }

  openEditPolls(poll?: Poll) {
    const modalRef = this.modalService.open(EditPollsComponent, {
      backdrop: 'static',
      size: 'xl'
    });
    if (poll) {
      modalRef.componentInstance.poll = poll;
    }
  }
  openStatisticsPolls(poll:Poll){
    const modalOptions={
      backdrop:'static' as const,
      size:'xl'
    };
    const modalRef = this.modalService.open(PollsStatisticsComponent,modalOptions);
    modalRef.componentInstance.poll = poll;
  }
  openDeletePolls(poll:Poll){
    const modalOptions={
      backdrop:'static' as const,
    };
    const modalRef = this.modalService.open(DeletePollsComponent,modalOptions)
    modalRef.componentInstance.poll = poll;
  }


  protected readonly length = length;

  addPolls(){
    const modalOptions={
      backdrop:'static' as const,
      size:'xl'
    };
    const modalRef = this.modalService.open(CreatePollsComponent, modalOptions)
  }
  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
