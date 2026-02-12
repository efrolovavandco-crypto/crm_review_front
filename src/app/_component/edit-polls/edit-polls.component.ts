import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Answer, Poll, Question} from "../../_interface/polls";
import {PollsService} from "../../_services/polls.service";
import {ToastrService} from "ngx-toastr";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-edit-polls',
  templateUrl: './edit-polls.component.html',
  styleUrls: ['./edit-polls.component.css']
})
export class EditPollsComponent implements OnInit, OnDestroy {
  @Input() poll!: Poll;
  EditPollsForm!: FormGroup;
  questions: Question[] = [];
  subscription= new Subscription;
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private pollService: PollsService,
    private toastrService:ToastrService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadExistingQuestions();
  }

  initForm() {
    this.EditPollsForm = this.fb.group({
      title: [this.poll?.title, Validators.required],
      questions: this.fb.array([], Validators.required)
    });
  }

  f(){
    return this.EditPollsForm.controls
  }
  loadExistingQuestions() {
    this.questionsFormArray.clear();

    if (!this.poll || !this.poll.questions) {
      return;
    }

    this.poll.questions.forEach(question => {
      const mappedAnswers = (question.answers || []).map((a: any) => ({
        id: a.id ?? undefined,
        text: a.text ?? '',
        isCorrect: !!a.isCorrect
      }));

      const mappedQuestion: Question = {
        id: question.id ?? undefined,
        text: question.text ?? '',
        answers: mappedAnswers
      };

      this.questionsFormArray.push(this.createQuestionForm(mappedQuestion));
    });
  }

  createQuestionForm(question?: Question): FormGroup {
    return this.fb.group({
      id: [question?.id ?? null],
      text: [question?.text || '', Validators.required],
      answers: this.fb.array(
        question?.answers?.map(answer => this.createAnswerForm(answer)) || []
      )
    });
  }
  createAnswerForm(answer?: Answer): FormGroup {
    return this.fb.group({
      id: [answer?.id ?? null],
      text: [answer?.text || '', Validators.required],
      isCorrect: [answer?.isCorrect || false]
    });
  }
  get questionsFormArray(): FormArray {
    return this.EditPollsForm.get('questions') as FormArray;
  }

  getQuestionFormGroup(index: number): FormGroup {
    return this.questionsFormArray.at(index) as FormGroup;
  }

  getAnswersFormArray(questionIndex: number): FormArray {
    return this.getQuestionFormGroup(questionIndex).get('answers') as FormArray;
  }
  getAnswerIsCorrectControl(questionIndex: number, answerIndex: number) {
    const answerFormArray = this.getAnswersFormArray(questionIndex);
    const currentValue = answerFormArray.at(answerIndex).get('isCorrect')?.value;
    if (currentValue===true){
    }
    answerFormArray.at(answerIndex).patchValue({isCorrect: !currentValue})
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

  removeQuestion(index: number) {
    this.questionsFormArray.removeAt(index);
  }

  addAnswer(questionIndex: number) {
    const answersFormArray = this.getAnswersFormArray(questionIndex);
    answersFormArray.push(this.createAnswerForm());
  }

  removeAnswer(questionIndex: number, answerIndex: number) {
    const answersFormArray = this.getAnswersFormArray(questionIndex);
    if (answersFormArray.length > 1) {
      answersFormArray.removeAt(answerIndex);
    }
  }
  hasCorrectAnswer(questionIndex:number){
    const answersFormArray = this.getAnswersFormArray(questionIndex);
    return answersFormArray.controls.some(control=>control.get('isCorrect')?.value === true)
  }
  savePoll() {
    this.EditPollsForm.markAllAsTouched();

    if (this.EditPollsForm.invalid) {
      this.EditPollsForm.markAllAsTouched();
      if (this.questionsFormArray.length===0){
        this.toastrService.error('Введите хотя бы один вопрос для сохранения опроса', 'Ошибка сохранения:');
      }
      else{
        this.toastrService.error('Проверьте все введенные поля', 'Ошибка сохранения:');
      }
      return;
    }

    const formValue = this.EditPollsForm.value;

    const updatedPoll = {
      ...this.poll,
      title: formValue.title,
      questions: formValue.questions.map((q: any) => ({
        id: q.id,
        text: q.text,
        answers: q.answers.map((a: any) => ({
          id: a.id,
          text: a.text,
          is_correct: a.isCorrect ? 1 : 0
        }))
      }))
    };


    this.subscription.add(
      this.pollService.update(this.poll.id, updatedPoll).subscribe({
        next: () => {
          this.activeModal.close('success');
          this.toastrService.success('Изменения успешно внесены!', 'Сообщение');
      },
        error: (error) => {
          console.error(error);
      }
    }));
  }

  getAnswerControl(questionIndex: number, answerIndex: number): FormControl {
    return this.getAnswersFormArray(questionIndex).at(answerIndex).get('isCorrect') as FormControl;
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
    console.log('Отписка')
  }
}
