<?php
// backend/models/PollQuestion.php
namespace app\models;

use yii\db\ActiveRecord;

class PollQuestion extends ActiveRecord
{
    public static function tableName()
    {
        return 'poll_question';
    }

    public function getPoll()
    {
        return $this->hasOne(Poll::class, ['id' => 'poll_id']);
    }

    public function getAnswers()
    {
        return $this->hasMany(PollAnswer::class, ['question_id' => 'id']);
    }
}