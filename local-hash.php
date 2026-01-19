<?php
// check-user.php
require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/vendor/yiisoft/yii2/Yii.php';

$config = [
    'id' => 'check-user',
    'basePath' => dirname(__DIR__),
    'components' => [
        'db' => [
            'class' => 'yii\db\Connection',
            'dsn' => 'mysql:host=localhost;dbname=mtg',
            'username' => 'mtg',
            'password' => 'cd*dkgEdge34',
            'charset' => 'utf8',
        ],
    ],
];

$app = new yii\console\Application($config);

try {
    echo "=== Проверка подключения к БД ===\n";

    // Подключаемся к БД
    $connection = Yii::$app->db;
    $connection->open();
    echo "✅ Подключение успешно\n\n";

    // Проверяем таблицы
    echo "=== Таблицы в базе mtg ===\n";
    $tables = $connection->createCommand('SHOW TABLES')->queryColumn();

    if (empty($tables)) {
        echo "❌ Таблицы не найдены. База пустая.\n";
        exit;
    } else {
        foreach ($tables as $table) {
            echo "- $table\n";
        }
    }

    echo "\n=== Проверка таблицы user ===\n";

    // Ищем таблицу user (может быть users, tbl_user и т.д.)
    $userTable = null;
    foreach ($tables as $table) {
        if (strtolower($table) === 'user' ||
            strtolower($table) === 'users' ||
            strpos(strtolower($table), 'user') !== false) {
            $userTable = $table;
            break;
        }
    }

    if ($userTable) {
        echo "✅ Найдена таблица: $userTable\n";

        // Проверяем структуру
        $columns = $connection->createCommand("DESCRIBE $userTable")->queryAll();
        echo "\nКолонки таблицы $userTable:\n";
        foreach ($columns as $col) {
            echo "- {$col['Field']} ({$col['Type']})\n";
        }

        // Проверяем записи
        $users = $connection->createCommand("SELECT * FROM $userTable LIMIT 10")->queryAll();
        echo "\nПервые записи (максимум 10):\n";
        if (empty($users)) {
            echo "❌ Таблица пустая!\n";
        } else {
            foreach ($users as $user) {
                $id = isset($user['id']) ? $user['id'] : 'N/A';
                $username = isset($user['username']) ? $user['username'] : 'N/A';
                $password = isset($user['password']) ? substr($user['password'], 0, 20) . "..." : 'N/A';
                echo "ID: $id, Username: $username, Password hash: $password\n";
            }
        }

        // Ищем пользователя admin
        echo "\n=== Поиск пользователя admin ===\n";
        $admin = $connection->createCommand("SELECT * FROM $userTable WHERE username = 'admin'")->queryOne();

        if ($admin) {
            echo "✅ Пользователь admin НАЙДЕН!\n";
            echo "ID: " . (isset($admin['id']) ? $admin['id'] : 'N/A') . "\n";
            echo "Username: " . (isset($admin['username']) ? $admin['username'] : 'N/A') . "\n";
            echo "Password hash: " . (isset($admin['password']) ? $admin['password'] : 'N/A') . "\n";

            // Проверяем пароль
            if (isset($admin['password'])) {
                echo "\n=== Проверка пароля ===\n";
                $password = 'admin';
                $valid = Yii::$app->security->validatePassword($password, $admin['password']);
                echo "Проверка пароля 'admin': " . ($valid ? '✅ СОВПАДАЕТ' : '❌ НЕ СОВПАДАЕТ') . "\n";

                if (!$valid) {
                    echo "Попробуйте пароль 'password123'\n";
                    $valid2 = Yii::$app->security->validatePassword('password123', $admin['password']);
                    echo "Проверка пароля 'password123': " . ($valid2 ? '✅ СОВПАДАЕТ' : '❌ НЕ СОВПАДАЕТ') . "\n";
                }
            }
        } else {
            echo "❌ Пользователь admin НЕ НАЙДЕН\n";

            // Смотрим какие пользователи есть
            $allUsernames = $connection->createCommand("SELECT username FROM $userTable")->queryColumn();
            echo "\nСуществующие пользователи:\n";
            if (empty($allUsernames)) {
                echo "Нет пользователей\n";
            } else {
                foreach ($allUsernames as $username) {
                    echo "- $username\n";
                }
            }
        }
    } else {
        echo "❌ Таблица user не найдена!\n";
        echo "Возможные названия таблиц: user, users, tbl_user, _user\n";
    }

} catch (Exception $e) {
    echo "❌ Ошибка: " . $e->getMessage() . "\n";
}