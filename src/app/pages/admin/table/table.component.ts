import {Component, OnInit, ViewChild} from '@angular/core'; // Добавьте OnInit
import { User } from "../../../_interface/user";
import { AuthenticationService } from "../../../_services/authentication-service";
import { UserService } from "../../../_services/user-service";
import {DeleteModal} from "../../../_component/DeleteModal/delete-modal";
import {EditModal} from "../../../_component/EditModal/edit-modal";
import {AccessModal} from "../../../_component/AccessModal/access-modal";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  isOpen=false;
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();
  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.userService.users$.subscribe(users => {
      this.users = users.filter(u => u.role !== 'Admin');
    });

    this.userService.getAll().subscribe(users => {
      this.userService['usersSubject'].next(users);
    });
  }

  trackById(index: number, user: User): number {
    return user.id;
  }

  loadUsers() {
    this.isLoading = true;
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users = users.filter(user => user.role !== 'Admin');
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Ошибка загрузки пользователей:', error);
        this.isLoading = false;
      }
    });
  }
  getGenderText(gender: string | undefined): string {
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

  logout() {
    this.authService.logout();
  }

  @ViewChild(DeleteModal) modalDelete!:DeleteModal;
  @ViewChild(EditModal) modalEdit!:EditModal;
  @ViewChild(AccessModal) modalAccess!:AccessModal;
  openDeleteModal(user:User){
    this.modalDelete.open(user)
  }
  openEditModal(user:User){
    this.modalEdit.open(user)
  }
  openAccessModal(user:User){
    this.modalAccess.open(user)
  }

}
