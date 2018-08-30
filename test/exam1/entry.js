amdjs.config({
    baseUrl: '/test/exam1/',
    module: {
        jquery: {
            path: 'https://code.jquery.com/jquery-3.3.1.min.js',
            shim: 'jQuery'
        },
        test: {
            path: 'test.js'
        }
    }
});
amdjs(['jquery', 'test'], function($, test) {
    console.log('ok', $, test);
});
