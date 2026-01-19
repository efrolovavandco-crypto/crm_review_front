<?php
return [
    'POST user/authenticate' => 'api/user/authenticate',
    'OPTIONS user/authenticate' => 'api/user/authenticate',
    [
        'class' => 'yii\rest\UrlRule',
        'controller' => ['user' => 'api/user'],
        'pluralize' => false, //ошибка выходит
        'patterns' => [
            'GET' => 'index',
            'GET {id}' => 'view',
            'POST' => 'create',
            'PUT {id}' => 'update',
            'DELETE {id}' => 'delete',
            'OPTIONS' => 'options',
            'OPTIONS {id}' => 'options',
        ],
        'extraPatterns' => [
            'POST authenticate' => 'authenticate',
            'GET profile' => 'profile',
            'POST logout' => 'logout',
            'POST change-password' => 'change-password',
        ],
        'tokens' => [
            '{id}' => '<id:\\d+>',//ожидает токен
        ]
    ],

    [
        'class' => 'yii\rest\UrlRule',
        'controller' => ['poll' => 'api/poll'],
        'pluralize' => false,
        'patterns' => [
            'GET' => 'index',
            'GET {id}' => 'view',
            'POST' => 'create',
            'PUT {id}' => 'update',
            'DELETE {id}' => 'delete',
            'OPTIONS' => 'options',
            'OPTIONS {id}' => 'options',
        ],
        'extraPatterns' => [
            'GET user-polls' => 'user-polls',
            'POST {id}/vote' => 'vote',
        ],
        'tokens' => [
            '{id}' => '<id:\\d+>',
        ]
    ],
];