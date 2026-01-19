<?php

namespace app\controllers\api;

use yii\rest\Controller;
use Yii;
use app\models\User;

class AuthController extends Controller
{
    public function actionLogin()
    {
        $request = Yii::$app->request->post();
        $username = $request['username'] ?? '';
        $password = $request['password'] ?? '';

        $user = User::findOne(['username' => $username]);

        if ($user && $password === 'pass' . $user->id) {
            $token = Yii::$app->getSecurity()->generateRandomString();
            $user->access_token = $token;
            $user->role = 'User';
            $user->save(false);

            return ['token' => $token];
        }

        Yii::$app->response->statusCode = 401;
        return ['message' => 'Неверные логин/пароль'];
    }

}
