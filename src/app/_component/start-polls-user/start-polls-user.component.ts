import {Component, Input, OnInit} from '@angular/core';
import {Answer, Poll, PollResponse, Question, UserAnswer} from "../../_interface/polls";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PollsService} from "../../_services/polls.service";
import { AuthenticationService } from 'src/app/_services/authentication-service';

@Component({
  selector: 'app-start-polls-user',
  templateUrl: './start-polls-user.component.html',
  styleUrls: ['./start-polls-user.component.css']
})
export class StartPollsUserComponent implements OnInit {

  @Input() poll!: Poll;
  @Input() userId!: number;
  userAnswer!: FormGroup;
  currentQuestionIndex = 0;
  hasCompletedPoll = false;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    public pollsService:PollsService,
    private authService: AuthenticationService
  ) {
    this.userAnswer = this.fb.group({
      questions: this.fb.array([])
    });
  }

  get questionsFormArray(): FormArray {
    return this.userAnswer.get('questions') as FormArray;
  }

  get currentQuestion(): FormGroup {
    return this.questionsFormArray.at(this.currentQuestionIndex) as FormGroup;
  }

  get currentAnswers(): FormArray {
    return this.currentQuestion.get('answers') as FormArray;
  }

  ngOnInit() {
    this.loadExistingQuestions();
    this.checkIfPollCompleted();
  }

  checkIfPollCompleted() {
    const currentUser = this.authService.userValue;
    if (currentUser) {
      this.pollsService.getUserPollProgressForPoll(currentUser.id, this.poll.id)
        .subscribe({
          next: (progress) => {
            this.hasCompletedPoll = progress.completed;
            if (progress.completed) {
              console.log(`Вы уже проходили этот опрос. Ваш результат: ${progress.score}%`);
            }
          },
          error: () => {
            this.hasCompletedPoll = false;
          }
        });
    }
  }
  finishPoll() {
    const currentUser = this.authService.userValue;
    if (!currentUser) {
      console.error('Пользователь не авторизован');
      return;
    }

    const response = this.buildPollResponse();
    response.userId = currentUser.id;

    this.pollsService.submitPollResponse(response).subscribe({
      next: (result: any) => {
        this.activeModal.close(true);
      },
      error: err => {
        console.error('Ошибка отправки опроса', err);
      }
    });
  }
  buildPollResponse(): PollResponse {
    const currentUser = this.authService.userValue;

    return {
      pollId: this.poll.id,
      userId: currentUser?.id || 0,
      answers: this.userAnswer.value.questions.map(
        (q: any, index: number): UserAnswer => {
          const selected = q.answers.findIndex(
            (a: any) => a.isCorrect
          );

          return {
            questionId: this.poll.questions[index].id!,
            answerIds: [
              this.poll.questions[index].answers[selected].id!
            ]
          };
        }
      ),
      submittedAt: new Date()
    };
  }
  loadExistingQuestions() {
    this.poll.questions.forEach(question => {
      this.questionsFormArray.push(this.createQuestionForm(question));
    });
  }

  createQuestionForm(question: Question): FormGroup {
    return this.fb.group({
      text: [question.text],
      answers: this.fb.array(
        question.answers.map(answer => this.createAnswerForm(answer))
      )
    });
  }

  createAnswerForm(answer: Answer): FormGroup {
    return this.fb.group({
      text: [answer.text],
      isCorrect: [false]
    });
  }


  selectAnswer(answerIndex: number) {
    this.currentAnswers.controls.forEach((ctrl, i) => {
      ctrl.get('isCorrect')?.setValue(i === answerIndex);
      console.log('ctrl', ctrl)
    });
  }

  isAnswerSelected(): boolean {
    return this.currentAnswers.controls.some(
      ctrl => ctrl.get('isCorrect')?.value
    );
  }

  nextQuestion() {
    if (!this.isAnswerSelected()) {
      return;
    }

    if (this.currentQuestionIndex < this.questionsFormArray.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.finishPoll();
    }
  }





}
