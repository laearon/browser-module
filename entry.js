loadjs.config({
    baseUrl: '/',
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
loadjs(['test'], function($, a) {
    console.log('ok', $, a);
});
