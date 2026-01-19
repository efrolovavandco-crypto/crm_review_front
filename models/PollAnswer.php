<?php
// backend/models/PollAnswer.php
namespace app\models;

use yii\db\ActiveRecord;

class PollAnswer extends ActiveRecord
{
    public static function tableName()
    {
        return 'poll_answer';
    }

    public function getQuestion()
    {
        return $this->hasOne(PollQuestion::class, ['id' => 'question_id']);
    }

}