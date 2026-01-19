<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;
use yii\web\IdentityInterface;

class User extends ActiveRecord implements IdentityInterface
{
    public static function tableName()
    {
        return 'crm';
    }
    public function rules()
    {
        return [
            [['username','fullname', 'phone', 'age', 'gender', 'position', 'role','password'], 'safe'],
            ['position', 'required','message'=>'Обязательное поле']
        ];
    }


    // реализация IdentityInterface для аутентификации
    public static function findIdentity($id)
    {
        return static::findOne($id);
    }

    public static function findIdentityByAccessToken($token, $type = null)
    {
        return static::findOne(['access_token' => $token]);
    }

    public function getId()
    {
        return $this->id;
    }
    public function setPassword(string $password): void
    {
        $this->password = Yii::$app->security->generatePasswordHash($password);
    }

    public function getAuthKey() {}
    public function validateAuthKey($authKey) {}
}
