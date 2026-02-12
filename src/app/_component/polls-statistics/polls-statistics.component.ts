import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Poll} from "../../_interface/polls";
import {PollsService} from "../../_services/polls.service";
import {User} from "../../_interface/user";
import {EditModal} from "../edit-modal/edit-modal";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-polls-statistics',
  templateUrl: './polls-statistics.component.html',
  styleUrls: ['./polls-statistics.component.css']
})
export class PollsStatisticsComponent implements OnInit, OnDestroy {
  @Input() poll!: Poll;
  @Input() user!: User;
  statistics: any[] = [];
  isLoading = true;
  subscription = new Subscription;
  constructor(
    public activeModal: NgbActiveModal,
    private pollsService: PollsService,
    public modalService:NgbModal
  ) {}

  ngOnInit() {
    if (this.poll) {
      this.loadingStatistic(this.poll);
    }
  }

  loadingStatistic(poll: Poll) {
    this.isLoading = true;
    this.subscription.add(
      this.pollsService.getStats(poll.id).subscribe({
        next: (data) => {
          this.statistics = data;
          this.isLoading = false;
      }
    }));
  }
  resetStatistic(stat: any) {
    this.subscription.add(
      this.pollsService.resetStat(this.poll.id, stat.userId).subscribe({
        next: () => {
          this.statistics = this.statistics.filter(s => s.userId !== stat.userId);
        },
        error: (err) => console.error(err)
    }));
  }
  openEditModal(user:User){
    const modalOptions={
      backdrop:'static' as const,
      centered:true
    };
    const modalRef = this.modalService.open(EditModal,modalOptions)
    modalRef.componentInstance.user=user;
  }
  ngOnDestroy(){
    this.subscription.unsubscribe()
  }
}

