if (top.sessionStorage){
    top.sessionStorage.messages = '[]';
} else {
    top.sessionStorage = {
        messages : '[]'
    }
}

require.config({
    baseUrl: 'ui/',
    paths: {
        'jquery': 'libs/jquery-1.8.2.min',
        'utils': 'libs/underscore-min'
    },
    shim: {
        'utils': {
            exports: '_'
        },
        'libs/jquery.initControls': ['jquery']
    }
});

require(['jquery', 'libs/jquery.initControls'], function($){
    $(function(){
        $('body').initControls();
    });
});