import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ExportService} from "../../_services/export-service";

@Component({
  selector: 'app-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.css']
})
export class UploadModalComponent implements OnInit{
  isOpen = false;
  uploadFormGroup!: FormGroup;
  format: 'PDF' | 'HTML' = 'PDF';

  constructor(private fb: FormBuilder, private exportService: ExportService) {}
  ngOnInit(): void {
    this.uploadFormGroup = this.fb.group({
      id: [false],
      fullname: [false],
      phone: [false],
      age: [false],
      gender: [false],
      position: [false]
    });
  }
  open() {
    this.isOpen = true;
    this.uploadFormGroup.reset({
      id: false,
      fullname: false,
      phone: false,
      age: false,
      gender: false,
      position: false
    });
    this.format = 'PDF';
  }

  close() {
    this.isOpen = false;
  }
  setFormat(format: 'PDF' | 'HTML') {
    this.format = format;
  }
  submit() {
    const selectedColumns = Object.keys(this.uploadFormGroup.value).filter(
      key => this.uploadFormGroup.value[key]
    );

    if (!selectedColumns.length) return;

    if (this.format === 'PDF') {
      this.exportService.exportUsersToPdf(selectedColumns).subscribe({
        next: blob => {
          console.log(blob);
          this.exportService.downloadFile(blob, 'users.pdf');
        },
        error: err => console.error(err),
      });
    } else {
      this.exportService.exportUsersToHtml(selectedColumns).subscribe({
        next: blob => {
          console.log(blob);
          this.exportService.downloadFile(blob, 'users.html');
        },
        error: err => console.error(err)
      });
    }


    this.close();
  }


}
