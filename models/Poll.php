<?php
// backend/models/Poll.php
namespace app\models;

use yii\db\ActiveRecord;

class Poll extends ActiveRecord
{
    public static function tableName()
    {
        return 'poll';
    }

    public function rules()
    {
        return [
            [['title'], 'safe'],
            [['title'], 'string', 'max' => 255],
            [['created_at'], 'safe'],
        ];
    }


    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'title' => 'Название',
            'created_at' => 'Дата создания',
        ];
    }

    public function getQuestions()
    {
        return $this->hasMany(PollQuestion::class, ['poll_id' => 'id']);
    }

    // Метод для получения всех опросов с вопросами
    public static function getAllWithQuestions()
    {
        return self::find()
            ->with(['questions.answers'])
            ->orderBy(['id' => SORT_DESC])
            ->all();
    }
}