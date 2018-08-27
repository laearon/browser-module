loadjs.config({
    baseUrl: '/',
    module: {
        jquery: {
            path: 'https://code.jquery.com/jquery-3.3.1.min.js',
            shim: 'jQuery'
        },
        test: {
            path: 'test.js',
            rename: true
        }
    }
});
loadjs(['jquery', 'test'], function($, a) {
    console.log('ok', $, a);
});
