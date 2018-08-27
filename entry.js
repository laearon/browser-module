loadjs.config({
    baseUrl: '/',
    module: {
        jquery: {
            path: 'https://code.jquery.com/jquery-3.3.1.min.js',
            shim: 'jQuery'
        }
    }
});
loadjs(['jquery'], function($) {
    console.log('ok', $);
});
