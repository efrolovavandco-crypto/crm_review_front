import {Component, inject, Input, OnDestroy, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {UserService} from "../../_services/user-service";
import {User} from "../../_interface/user";
import {ModalDismissReasons, NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Subscription} from "rxjs";


@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.html',
  styleUrls: ['./delete-modal.css'],
})
export class DeleteModal implements OnDestroy{
  @Input() user!: User;
  subscription = new Subscription();
  constructor(
    private userService:UserService,
    public activeModal: NgbActiveModal,
  ) {}
  deleteUser(){
    this.subscription.add(
      this.userService.delete(this.user.id).subscribe({
        next:()=>{
          this.activeModal.close(true);
        },
        error:err => {
          console.error(err);
        }
    }))

  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
    console.log('отписка')
  }
}
