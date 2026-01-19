<?php
use yii\helpers\Html;
?>

<h3>Список пользователей</h3>
<table border="1" cellpadding="5" cellspacing="0" width="100%">
    <thead>
    <tr>
        <?php if ($columns['id'] ?? false): ?><th>ID</th><?php endif; ?>
        <?php if ($columns['fullname'] ?? false): ?><th>ФИО</th><?php endif; ?>
        <?php if ($columns['phone'] ?? false): ?><th>Телефон</th><?php endif; ?>
        <?php if ($columns['age'] ?? false): ?><th>Возраст</th><?php endif; ?>
        <?php if ($columns['gender'] ?? false): ?><th>Пол</th><?php endif; ?>
        <?php if ($columns['position'] ?? false): ?><th>Должность</th><?php endif; ?>
    </tr>
    </thead>
    <tbody>
    <?php foreach ($users as $u): ?>
        <tr>
            <?php if ($columns['id'] ?? false): ?><td><?= $u->id ?></td><?php endif; ?>
            <?php if ($columns['fullname'] ?? false): ?><td><?= Html::encode($u->fullname) ?></td><?php endif; ?>
            <?php if ($columns['phone'] ?? false): ?><td><?= Html::encode($u->phone) ?></td><?php endif; ?>
            <?php if ($columns['age'] ?? false): ?><td><?= $u->age ?></td><?php endif; ?>
            <?php if ($columns['gender'] ?? false): ?><td><?= $u->gender ?></td><?php endif; ?>
            <?php if ($columns['position'] ?? false): ?><td><?= $u->position ?></td><?php endif; ?>
        </tr>
    <?php endforeach; ?>
    </tbody>
</table>
