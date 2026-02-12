import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {Answer, Question} from "../../_interface/polls";
import {PollsService} from "../../_services/polls.service";
import {usernameValidator} from "../../auth/auth.component";
import {ToastrService} from "ngx-toastr";



@Component({
  selector: 'app-create-polls',
  templateUrl: './create-polls.component.html',
  styleUrls: ['./create-polls.component.css']
})
export class CreatePollsComponent implements OnInit{
  CreatePollsForm!:FormGroup
  questions: Question[] = [];
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private pollService:PollsService,
    private toastrService:ToastrService
  ) {
  }

  ngOnInit() {
    this.initForm();
  }

  initForm(){
    this.CreatePollsForm = this.fb.group({
      title:['', [Validators.required]],
      questions:this.fb.array([], Validators.required)
    })
  }
  get f(){
    return this.CreatePollsForm.controls
  }

  get questionsFormArray(): FormArray {
    return this.CreatePollsForm.get('questions') as FormArray;
  }
  getAnswersFormArray(questionIndex: number): FormArray {
    return this.getQuestionFormGroup(questionIndex).get('answers') as FormArray;
  }
  getQuestionFormGroup(index: number): FormGroup {
    return this.questionsFormArray.at(index) as FormGroup;
  }

  createQuestionForm(question?: Question): FormGroup {
    return this.fb.group({
      text: [question?.text || '', Validators.required],
      answers: this.fb.array(question?.answers?.map(answer => this.createAnswerForm(answer)) || [])
    });
  }

  addAnswer(questionIndex:number){
    const answersFormArray = this.getAnswersFormArray(questionIndex);
    answersFormArray.push(this.createAnswerForm())
  }
  createAnswerForm(answer?: Answer): FormGroup {
    return this.fb.group({
      text: [answer?.text || '', Validators.required],
      isCorrect: [answer?.isCorrect || false]
    });
  }
  addQuestion() {
    const newQuestion: Question = {
      text: '',
      answers: [{
        text: '',
        isCorrect: true
      }]
    };

    this.questionsFormArray.push(this.createQuestionForm(newQuestion));
  }
  removeQuestion(i:number){
    this.questionsFormArray.removeAt(i)
  }
  deleteAnswer(questionIndex: number, answerIndex: number){
    const answersFormArray = this.getAnswersFormArray(questionIndex);
    answersFormArray.removeAt(answerIndex);
  }
  hasCorrectAnswer(questionIndex:number){
    const answersFormArray = this.getAnswersFormArray(questionIndex);
    return answersFormArray.controls.some(control=>control.get('isCorrect')?.value === true)
  }
  toggleCorrectAnswer(questionIndex:number,answerIndex:number){
    const answerFormArray = this.getAnswersFormArray(questionIndex);
    const currentValue = answerFormArray.at(answerIndex).get('isCorrect')?.value;
    if (currentValue===true){

    }
    answerFormArray.at(answerIndex).patchValue({isCorrect: !currentValue})
  }

  savePoll(){
    if (this.CreatePollsForm.invalid) {
      this.CreatePollsForm.markAllAsTouched();
      if (this.questionsFormArray.length===0){
        this.toastrService.error('Введите хотя бы один вопрос для сохранения опроса', 'Ошибка сохранения:');
      }
      else{
        this.toastrService.error('Проверьте все введенные поля', 'Ошибка сохранения:');
      }
      return;
    }
    if (this.CreatePollsForm.valid){
      const poll = this.CreatePollsForm.value;
      console.log(poll)
      this.pollService.create(poll).subscribe({
        next:()=>{
          this.activeModal.close()
          this.toastrService.success('Новый опрос успешно добавлен!', 'Сообщение');
        },
        error:(err)=>{
          console.error(err)
        }
      })
    }
  }
}
