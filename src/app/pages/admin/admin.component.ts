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
import {CreateModal} from "../../_component/create-modal/create-modal";
import {UploadModalComponent} from "../../_component/upload-modal/upload-modal.component";
import {DeleteModal} from "../../_component/delete-modal/delete-modal";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  users: User[] = [];
  isLoading = true;

  positions = [
    { value: 'loader', label: 'Грузчик' },
    { value: 'courier', label: 'Курьер' },
    { value: 'accountant', label: 'Бухгалтер' },
    { value: 'manager', label: 'Менеджер' }
  ];

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private modalService: NgbModal,
  ) {}


  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  openCreateModal() {
    const modalOptions={
      backdrop:'static' as const,
      centered:true,
    };
    const modalRef = this.modalService.open(CreateModal,modalOptions)
  }
  openUploadModal(){
    const modalOptions={
      backdrop:'static' as const,
      centered:true
    };
    const modalRef = this.modalService.open(UploadModalComponent,modalOptions)
  }
  openPolls(){
    this.router.navigate(['/polls'])
  }
}
