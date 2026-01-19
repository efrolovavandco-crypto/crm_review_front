<?php

namespace app\controllers\api;

use Yii;
use yii\rest\Controller;
use yii\web\BadRequestHttpException;
use yii\web\Response;
use yii\web\NotFoundHttpException;
use app\models\User;
use function PHPUnit\Framework\throwException;

class UserController extends Controller
{
    public $enableCsrfValidation = false;

    //Убрала настройку корс (после переноса на сервер)

    public function beforeAction($action)
    {
        Yii::$app->response->format = Response::FORMAT_JSON;

        $this->enableCsrfValidation = false;

        return parent::beforeAction($action);
    }

    /**
     * Авторизация
     * POST api/user/authenticate
     * @return User
     * @throws BadRequestHttpException
     */

    public function actionAuthenticate(){
        Yii::$app->response->format = Response::FORMAT_JSON;
        $body = Yii::$app->request->bodyParams;
        $username = $body['username'];
        $password = $body['password'];

        $user = User::findOne(['username' => $username]);
        if (!$user || !Yii::$app->security->validatePassword($password, $user->password)) {
            throw new BadRequestHttpException('Wrong username or password');
        }
        return $user;
    }

    /**
     * Вывод пользователей
     * GET api/user/
     */
    public function actionIndex() {
        Yii::$app->response->format = Response::FORMAT_JSON;

        $users = User::find()->orderBy('id DESC')->all();
        return $users;
    }

    /**
     * Cоздание пользователей
     * POST api/user/create
     */
    public function actionCreate() {
        Yii::$app->response->format = Response::FORMAT_JSON;
        $data = Yii::$app->request->bodyParams;

        $user = new User();
        $user->load($data, '');

        if (empty($user->role)) {
            $user->role = 'User';
        }

        $user->username = 'user-temp';
        $user->password = Yii::$app->security->generatePasswordHash('pass-temp');

        if (!$user->save()) {
            Yii::$app->response->statusCode = 422;
            return ['errors' => $user->errors];
        }

        $user->username = 'user' . $user->id;
        $plainPassword = 'pass' . $user->id;
        $user->password = Yii::$app->security->generatePasswordHash($plainPassword);

        $user->save(false);

        $userArray = $user->toArray();
        $userArray['password'] = $plainPassword;
        return $userArray;
        //Двойное присваивание для вывода пароля незахэшированного
    }

    /**
     * Удаление пользователей
     * DELETE api/user/id
     * @param $id
     * @return void
     * @throws \Throwable
     * @throws \yii\db\StaleObjectException
     *
     */
    public function actionDelete($id) {
        Yii::$app->response->format = Response::FORMAT_JSON;
        $user = User::findOne($id);
        $user->delete();
    }

    public function actionUpdate($id) {
        Yii::$app->response->format = Response::FORMAT_JSON;
        $data = Yii::$app->request->bodyParams;
        $user = User::findOne($id);
        if (empty($user)) {
            throw new BadRequestHttpException('User not found');
        }
        $user->load($data, '');
        $user->save();
        return $user;
    }

    public function actionView($id) {}
    /**
     * Смена пароля пользователя (админ)
     * POST api/user/change-password
     */
    public function actionChangePassword()
    {
        Yii::$app->response->format = Response::FORMAT_JSON;

        $body = Yii::$app->request->bodyParams;

        if (!isset($body['userId'], $body['password'])) {
            throw new BadRequestHttpException('userId и password обязательны');
        }

        $user = User::findOne((int)$body['userId']);

        if (!$user) {
            throw new NotFoundHttpException('пользователь не найден');
        }

        $user->setPassword($body['password']);

        if (!$user->save(false)) {
            throw new BadRequestHttpException('Не удалось сохранить пароль');
        }

        return ['message' => 'Пароль изменён'];
    }



    public function actionProfile() {  }
    public function actionLogout() {  }
}