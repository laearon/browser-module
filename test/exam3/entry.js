loadjs.config({
    baseUrl: '/test/exam2/',
    module: {
        jquery: {
            path: 'https://code.jquery.com/jquery-3.3.1.min.js',
            shim: 'jQuery'
        },
        bootstrap: {
            path: 'https://getbootstrap.com/docs/4.1/dist/js/bootstrap.min.js',
            shim: 'jQuery',
            deps: ['jquery']
        }
    }
});

loadjs(['bootstrap'], function($) {
    console.log('ok', $);
});
