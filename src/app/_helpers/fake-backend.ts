import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';
import { Role } from '../_interface/role';

const users = [
  { id: 1, username: 'admin', password: 'admin', fullname: 'Admin', phone: 'User', role: Role.Admin, age: 'User', gender: 'User', position: 'User' },
  { id: 2, username: 'user', password: 'user', fullname: 'ФИО Юзер', phone: '8999999', role: Role.User, age: '19', gender: 'male', position: 'loader' }
];
const pollResponses: any[] = [];
const userPollProgress: any[] = [];
const polls = [
  {
    id: 1,
    title: 'Пример опроса',
    questions: [
      { id: 1,
        text: 'Первый вопрос',
        answers: [
          { id: 1, text: 'Первый', is_correct: 1 },
          { id: 2, text: 'Второй', is_correct: 1 },
          {id: 3, text: 'Третий', is_correct: 0 }
        ]
      },
      {
        id: 2,
        text: 'Второй вопрос',
        answers: [
          {id: 1, text: 'Ответ1', is_correct: 1 },
          {id: 2, text: 'Ответ2', is_correct: 0 },
          {id: 3, text: 'Ответ3', is_correct: 0 }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Другой опрос',
    questions: [
      {
        id: 3,
        text: 'Какой ваш любимый цвет?',
        answers: [
          { id: 1,text: 'Красный', is_correct: 0 },
          { id: 2,text: 'Синий', is_correct: 1 },
          { id: 3,text: 'Зеленый', is_correct: 0 }
        ]
      }
    ]
  }
];

let currentUserId = users.length ? Math.max(...users.map(u => u.id)) : 0;
let currentPollId = polls.length ? Math.max(...polls.map(p => p.id)) : 0;

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    return handleRoute();

    function handleRoute() {
      switch (true) {
        case url.endsWith('/user/authenticate') && method === 'POST':
          return authenticate();
        case url.endsWith('/user') && method === 'GET':
          return getUsers();
        case url.match(/\/user\/\d+$/) && method === 'GET':
          return getUserById();
        case url.match(/\/user\/\d+$/) && method === 'DELETE':
          return deleteUser();
        case url.endsWith('/user') && method === 'POST':
          return createUser();
        case url.match(/\/user\/\d+$/) && method === 'PUT':
          return updateUser();
        case url.endsWith('/user/change-password') && method === 'POST':
          return changePassword();

        // Polls endpoints
        case url.endsWith('/polls') && method === 'GET':
          return getPolls();
        case url.endsWith('/polls') && method === 'POST':
          return createPoll();
        case url.match(/\/polls\/\d+$/) && method === 'DELETE':
          return deletePoll();
        case url.match(/\/polls\/\d+$/) && method === 'PUT':
          return updatePoll();
        case url.match(/\/polls\/\d+\/responses$/) && method === 'POST':
          return submitPollResponse();
        case url.match(/\/polls\/\d+$/) && method === 'GET':
          return getPollById();
        case url.endsWith('/user/progress') && method === 'GET':
          return getUserPollProgress();
        case url.match(/\/polls\/\d+\/user\/\d+\/progress$/) && method === 'GET':
          return getUserPollProgressForPoll();

        default:
          return next.handle(request);
      }
    }

    function changePassword() {
      const { userId, password } = body;

      const user = users.find(u => u.id === userId);
      if (!user) return error('User not found');

      user.password = password;

      return ok('ok');
    }

    function getUsers() {
      return ok(users.filter(u => u.role !== Role.Admin));
    }

    function createUser() {
      currentUserId++;
      const newUser = {
        id: currentUserId,
        username: `user${currentUserId}`,
        password: `pass${currentUserId}`,
        fullname: body.fullname || '',
        phone: body.phone || '',
        age: body.age || '',
        gender: body.gender || '',
        position: body.position || '',
        role: body.role || Role.User
      };
      users.push(newUser);
      return ok(newUser);
    }

    function updateUser() {
      const id = idFromUrl();
      const index = users.findIndex(u => u.id === id);
      if (index === -1) return error('не найден пользователь');
      users[index] = { ...users[index], ...body };
      return ok(users[index]);
    }

    function deleteUser() {
      const id = idFromUrl();
      const index = users.findIndex(u => u.id === id);
      if (index === -1) return error('не найден пользователь');
      users.splice(index, 1);
      return ok({});
    }

    function getUserById() {
      const user = users.find(x => x.id === idFromUrl());
      return ok(user);
    }

    function authenticate() {
      const { username, password } = body;
      const user = users.find(x => x.username === username && x.password === password);
      if (!user) return error('');
      return ok({
        id: user.id,
        fullname: user.fullname,
        username: user.username,
        phone: user.phone,
        age: user.age,
        gender: user.gender,
        position: user.position,
        role: user.role,
        token: `fake-jwt-token.${user.id}`
      });
    }

    // Polls functions
    function getPolls() {
      return ok(polls);
    }

    function getPollById() {
      const id = idFromUrl();
      const poll = polls.find(p => p.id === id);
      if (!poll) return error('Опрос не найден');
      return ok(poll);
    }

    function createPoll() {
      // Проверяем, есть ли необходимые данные
      if (!body.title || !body.questions || !body.questions.length) {
        return error('Необходимо указать название и вопросы опроса');
      }

      // Проверяем валидность вопросов
      for (const question of body.questions) {

        // Проверяем, что выбран хотя бы один правильный ответ
        const hasCorrectAnswer = question.answers.some((answer: any) => answer.isCorrect === true);
        if (!hasCorrectAnswer) {
          return error('В каждом вопросе должен быть выбран правильный ответ');
        }
      }

      currentPollId++;
      const newPoll = {
        id: currentPollId,
        title: body.title,
        questions: body.questions.map((question: any) => ({
          text: question.text,
          answers: question.answers.map((answer: any) => ({
            text: answer.text,
            isCorrect: answer.isCorrect
          }))
        }))
      };

      polls.push(newPoll);
      return ok(newPoll);
    }

    function deletePoll() {
      const id = idFromUrl();
      const index = polls.findIndex(p => p.id === id);
      if (index === -1) return error('не найден опрос');
      polls.splice(index, 1);
      return ok({ message: 'Опрос удален' });
    }

    function updatePoll() {
      const id = idFromUrl();
      const index = polls.findIndex(p => p.id === id);
      if (index === -1) return error('не найден опрос');

      polls[index] = {
        ...polls[index],
        title: body.title,
        questions: body.questions.map((question: any) => ({
          text: question.text,
          answers: question.answers.map((answer: any) => ({
            text: answer.text,
            is_correct: answer.is_correct ?? (answer.isCorrect ? 1 : 0)  // ⚡ сохраняем правильно
          }))
        }))
      };
      return ok(polls[index]);
    }


    function submitPollResponse() {
      // Получаем pollId из URL
      const urlParts = url.split('/');
      console.log('URL parts:', urlParts);

      // URL имеет вид: /polls/1/responses
      // Нам нужно извлечь 1 (pollId)
      let pollId: number | null = null;

      for (let i = 0; i < urlParts.length; i++) {
        if (urlParts[i] === 'polls' && i + 1 < urlParts.length) {
          pollId = parseInt(urlParts[i + 1]);
          break;
        }
      }

      console.log('Extracted pollId:', pollId);

      if (!pollId || isNaN(pollId)) {
        return error('Неверный URL опроса');
      }

      const response = body;
      const userId = getUserIdFromToken();

      if (!userId) {
        return error('Пользователь не авторизован');
      }

      if (!response.answers || !response.answers.length) {
        return error('Ответы не найдены');
      }

      // Находим опрос
      const poll = polls.find(p => p.id === pollId);
      if (!poll) {
        console.error('Опрос не найден. Ищем pollId:', pollId);
        console.error('Доступные опросы:', polls.map(p => ({ id: p.id, title: p.title })));
        return error('Опрос не найден');
      }

      console.log('Найден опрос:', poll.title);

      // Вычисляем результаты
      let correctAnswers = 0;
      let totalQuestions = poll.questions.length;

      response.answers.forEach((userAnswer: any) => {
        console.log('Обрабатываем ответ пользователя:', userAnswer);

        const question = poll.questions.find(q => q.id === userAnswer.questionId);
        if (question) {
          console.log('Найден вопрос:', question.text);

          // Ищем выбранный ответ по id
          const selectedAnswer = question.answers.find(a =>
            userAnswer.answerIds && userAnswer.answerIds.includes(a.id)
          );

          console.log('Выбранный ответ:', selectedAnswer?.text);

          if (selectedAnswer?.is_correct) {
            correctAnswers++;
            console.log('Правильный ответ!');
          }
        } else {
          console.log('Вопрос с id', userAnswer.questionId, 'не найден');
        }
      });

      const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

      console.log('Результаты:', {
        correctAnswers,
        totalQuestions,
        score,
        userId,
        pollId
      });

      // Сохраняем ответы
      pollResponses.push({
        id: pollResponses.length + 1,
        pollId,
        userId,
        answers: response.answers,
        submittedAt: new Date(),
        score,
        correctAnswers,
        totalQuestions
      });

      // Обновляем или создаем запись о прогрессе пользователя
      const existingProgressIndex = userPollProgress.findIndex(
        p => p.userId === userId && p.pollId === pollId
      );

      if (existingProgressIndex !== -1) {
        userPollProgress[existingProgressIndex] = {
          ...userPollProgress[existingProgressIndex],
          completed: true,
          completedAt: new Date(),
          score,
          correctAnswers,
          totalQuestions
        };
      } else {
        userPollProgress.push({
          id: userPollProgress.length + 1,
          userId,
          pollId,
          completed: true,
          completedAt: new Date(),
          score,
          correctAnswers,
          totalQuestions
        });
      }

      console.log('Всего сохраненных ответов:', pollResponses.length);
      console.log('Прогресс пользователя обновлен');

      return ok({
        message: 'Ответы сохранены',
        score,
        correctAnswers,
        totalQuestions
      });
    }
    function getUserIdFromToken() {
      const authHeader = headers.get('Authorization');
      if (!authHeader) return null;

      const tokenParts = authHeader.split('.');
      return tokenParts.length > 1 ? +tokenParts[1] : null;
    }

    function ok(body: any) {
      return of(new HttpResponse({ status: 200, body })).pipe(delay(200));
    }

    function error(message: string) {
      return throwError({ status: 400, error: { message } }).pipe(materialize(), delay(200), dematerialize());
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
    }
    function getUserPollProgress() {
      const userId = getUserIdFromToken();
      if (!userId) return error('Пользователь не авторизован');

      const userProgress = userPollProgress.filter(p => p.userId === userId);

      // Добавляем информацию об опросах
      const enrichedProgress = userProgress.map(progress => {
        const poll = polls.find(p => p.id === progress.pollId);
        return {
          ...progress,
          pollTitle: poll?.title,
          poll: poll // или можно вернуть только нужные поля
        };
      });

      return ok(enrichedProgress);
    }
    function getUserPollProgressForPoll() {
      const urlParts = url.split('/');
      const pollId = parseInt(urlParts[urlParts.length - 3]);
      const userId = parseInt(urlParts[urlParts.length - 2]);

      const progress = userPollProgress.find(
        p => p.userId === userId && p.pollId === pollId
      );

      if (!progress) {
        return ok({
          userId,
          pollId,
          completed: false,
          canTake: true // Может ли пользователь пройти опрос
        });
      }

      const poll = polls.find(p => p.id === pollId);

      return ok({
        ...progress,
        pollTitle: poll?.title
      });
    }
  }


}


export const fakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
