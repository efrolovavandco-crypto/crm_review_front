import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {TableComponent} from "./table/table.component";
import {UserService} from "../../_services/user-service";
import {AuthenticationService} from "../../_services/authentication-service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Role} from "../../_interface/role";
import {User} from "../../_interface/user";
import {Router} from "@angular/router";
import {ExportService} from "../../_services/export-service";
import {finalize} from "rxjs";
import {CreateModal} from "../../_component/CreateModal/create-modal";
import {UploadModalComponent} from "../../_component/UploadModal/upload-modal.component";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  users: User[] = [];
  isLoading = true;

  editForm!: FormGroup;
  addForm!: FormGroup;
  deleteForm!: FormGroup;
  downloadForm!: FormGroup;
  accessForm!: FormGroup;

  showEditModal = false;
  showAddModal = false;
  showAccessModal = false;
  showDeleteModal = false;
  showDownloadModal = false;

  editingUser: User | null = null;
  deletingUser: User | null = null;
  accessUser: User | null = null;

  positions = [
    { value: 'loader', label: 'Грузчик' },
    { value: 'courier', label: 'Курьер' },
    { value: 'accountant', label: 'Бухгалтер' },
    { value: 'manager', label: 'Менеджер' }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthenticationService,
    private router: Router,
    private exportService: ExportService,
    private cdr: ChangeDetectorRef
  ) {}


  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
  @ViewChild(CreateModal) modalCreate!: CreateModal;
  @ViewChild(UploadModalComponent) modalUpload!: UploadModalComponent;
  openCreateModal() {
    this.modalCreate.open();
  }
  openUploadModal(){
    this.modalUpload.open()
  }
  loadUsers() {
    this.isLoading = true;
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users = users.filter(user => user.role !== 'Admin');
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
      }
    });
  }
}
