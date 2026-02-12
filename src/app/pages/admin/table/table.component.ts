import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core'; // Добавьте OnInit
import { User } from "../../../_interface/user";
import { AuthenticationService } from "../../../_services/authentication-service";
import { UserService } from "../../../_services/user-service";
import {DeleteModal} from "../../../_component/delete-modal/delete-modal";
import {EditModal} from "../../../_component/edit-modal/edit-modal";
import {AccessModal} from "../../../_component/access-modal/access-modal";
import {BehaviorSubject, Subscription} from "rxjs";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnDestroy {
  users: User[] = [];
  isLoading = false;
  subscription = new Subscription();
  constructor(
    private modalService: NgbModal,
    private userService: UserService,
  ) {}
  ngOnInit() {
    const subscription1$ = this.userService.users$.subscribe(users => {
      this.users = users.filter(u => u.role !== 'Admin');
    });
    const subscription2$= this.userService.getAll().subscribe();
    this.subscription.add(subscription1$);
    this.subscription.add(subscription2$);
  }
  getGenderText(gender: string | undefined) {
    if (!gender) return 'Не указан';
    return gender === 'male' ? 'Мужской' : 'Женский';
  }
  getPositionText(position: string | undefined): string {
    if (!position) return 'Не указана';

    const positionMap: Record<string, string> = {
      'loader': 'Грузчик',
      'courier': 'Курьер',
      'accountant': 'Бухгалтер',
      'manager': 'Менеджер',
      'user': 'Пользователь',
      'admin': 'Администратор'
    };

    return positionMap[position] || position;
  }
  openDeleteModal(user:User){
    const modalOptions={
      backdrop:'static' as const,
      centered:true
    };
    const modalRef = this.modalService.open(DeleteModal,modalOptions)
    modalRef.componentInstance.user=user;
  }
  openEditModal(user:User){
    const modalOptions={
      backdrop:'static' as const,
      centered:true
    };
    const modalRef = this.modalService.open(EditModal,modalOptions)
    modalRef.componentInstance.user=user;
  }
  openAccessModal(user: User) {
    const modalOptions={
      backdrop:'static' as const,
      centered:true
    };
    const modalRef = this.modalService.open(AccessModal, modalOptions)
    modalRef.componentInstance.user = user;
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
