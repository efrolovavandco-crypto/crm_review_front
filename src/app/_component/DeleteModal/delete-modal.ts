import { Component } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {UserService} from "../../_services/user-service";
import {User} from "../../_interface/user";

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.html',
  styleUrls: ['./delete-modal.css'],
})
export class DeleteModal {
  isOpen= false;
  deleteModal!:FormGroup;
  userId!:number;
  constructor(
    private userService:UserService,
    private fb:FormBuilder
  ) {
    this.deleteModal =this.fb.group({
      userId: ['']
    })
  }
  open(user:User){
    this.isOpen = true;
    this.userId=user.id
    this.deleteModal.patchValue(
      {
        userId:user.id
      }
    )
  }
  close(){
    this.isOpen = false;
  }
  submit(){
    this.userService.delete(this.userId).subscribe({
      next:()=>{
        this.isOpen = false;
      },
      error:err => {
        console.error(err);
      }
    })
  }
}
