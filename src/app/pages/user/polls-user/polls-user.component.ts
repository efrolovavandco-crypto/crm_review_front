import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Poll} from "../../../_interface/polls";
import {PollsService} from "../../../_services/polls.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {StartPollsUserComponent} from "../../../_component/start-polls-user/start-polls-user.component";
import { AuthenticationService } from 'src/app/_services/authentication-service';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-polls-user',
  templateUrl: './polls-user.component.html',
  styleUrls: ['./polls-user.component.css']
})
export class PollsUserComponent implements OnInit, OnDestroy{
  polls: Poll[] = [];
  userPollProgress: any[] = [];
  isLoading = false;
  currentUser: any = null;
  subscription = new Subscription;
  constructor(
    private pollsService: PollsService,
    private authService: AuthenticationService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.userValue;
    this.loadPolls();
    if (this.currentUser) {
      this.loadUserPollProgress();
    }
  }
  loadPolls() {
    this.isLoading = true;
    this.subscription.add(
      this.pollsService.getAll().subscribe({
        next: (polls) => {
          this.polls = polls;
          this.isLoading = false;
          console.log(polls)
      },
        error: (error) => {
          console.error('Ошибка загрузки опросов:', error);
          this.isLoading = false;
      }
    }));
  }
  loadUserPollProgress() {
    if (!this.currentUser) return;

    this.subscription.add(
      this.pollsService.getUserPollProgress(this.currentUser.id).subscribe({
        next: (progress) => {
          this.userPollProgress = progress;
          console.log('прогресс:',progress)
        },
        error: (error) => {
          console.error(error);
      }
    }));
  }
  isPollCompleted(pollId: number): boolean {
    if (!this.currentUser || !this.userPollProgress) return false;
    return this.userPollProgress.some(p => Number(p.poll_id) === Number(pollId));
  }
  getPollResult(pollId: number): any {
    if (!this.currentUser || !this.userPollProgress) return null;
    return this.userPollProgress.find(p => Number(p.poll_id) === Number(pollId));
  }

  startPoll(poll: Poll) {

    const modalRef = this.modalService.open(StartPollsUserComponent, {
      backdrop: 'static',
      centered: true,
      size: 'xl'
    });
    modalRef.componentInstance.poll = poll;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.loadUserPollProgress();
          console.log('Опрос завершен');
        }
      }
    );
  }
  //Рестарт опроса
  restartPoll(poll:Poll) {
    this.subscription.add(
      this.pollsService.resetPollResponses(poll.id).subscribe({
        next:()=>{
          this.loadUserPollProgress();
      },
        error:err => {
          console.error(err);
          console.log(poll, poll.id)
      }
    }))
  }

  //подсказка
  getBadgeText(pollId: number): string {
    const result = this.getPollResult(pollId);
    if (result) {
      return `Пройдено (${result.score}%)`;
    }
    return 'Не пройдено';
  }

  getBadgeClass(pollId: number): string {
    const result = this.getPollResult(pollId);
    if (result) {
      if (result.score >= 80) return 'bg-success';
      if (result.score >= 50) return 'bg-warning';
      return 'bg-danger';
    }
    return 'bg-secondary';
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
