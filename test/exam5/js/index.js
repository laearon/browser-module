amdjs.config({
    baseUrl: '/test/exam5/',
    module: {
        jquery: {
            // The path property is requested if you want to use shim feature.
            path: 'js/lib/jquery',
            shim: 'jQuery'
        }
    }
});

amdjs('jquery', function($) {
    console.log($);
});
