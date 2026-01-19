<?php

require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/vendor/yiisoft/yii2/Yii.php';

$security = new \yii\base\Security();
$hash = $security->generatePasswordHash('admin');

echo $hash . PHP_EOL;
