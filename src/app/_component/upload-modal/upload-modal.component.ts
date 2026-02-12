  import {Component, OnInit} from '@angular/core';
  import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
  import {ExportService} from "../../_services/export-service";
  import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
  import {Subscription} from "rxjs";

  @Component({
    selector: 'app-upload-modal',
    templateUrl: './upload-modal.component.html',
    styleUrls: ['./upload-modal.component.css']
  })
  export class UploadModalComponent {
    subscription=new Subscription;
    columns:Array<any>=[
      {name:'ID', value:'id', checked:false},
      {name:'ФИО', value:'fullname', checked:false},
      {name:'Телефон', value:'phone', checked:false},
      {name:'Возраст', value:'age', checked:false},
      {name:'Пол', value:'gender', checked:false},
      {name:'Должность', value:'position', checked:false},
    ]

    uploadFormGroup!: FormGroup;
    selectedFormat: 'PDF' | 'HTML' = 'PDF';

    constructor(
      private fb: FormBuilder,
      private exportService: ExportService,
      public activeModal: NgbActiveModal,
      ) {
      this.uploadFormGroup=fb.group({
        selectedColumns:new FormArray([]),
        selectedFormat:'PDF'
      })
    }

    submit() {
      const { selectedColumns, selectedFormat } = this.uploadFormGroup.value;

      this.subscription.add(
        this.exportService.exportUsers({
          columns: selectedColumns,
          format: selectedFormat,
        }).subscribe((blob: Blob) => {
        //инициализация скачивания
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `users.${selectedFormat.toLowerCase()}`;
          a.click();
        this.activeModal.close(true);
      }, error => {
        console.error(error);
      }));
    }


    onCheckboxChange(event: any) {
      const selectedColumns = (this.uploadFormGroup.controls['selectedColumns'] as FormArray);
      if (event.target.checked) {
        selectedColumns.push(new FormControl(event.target.value));

      } else {
        const index = selectedColumns.controls
          .findIndex(x => x.value === event.target.value);
        selectedColumns.removeAt(index);
      }
    }
    onFormatChange(format: 'PDF' | 'HTML') {
      this.selectedFormat = format;
      this.uploadFormGroup.patchValue({
        selectedFormat: format
      });
    }
  }
