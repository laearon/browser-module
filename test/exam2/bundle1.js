loadjs('test1', undefined, function() {
    console.log('test1');
    return {
        test1: 1
    };
});

loadjs('test2', ['jquery'], function($) {
    console.log('test2');
    return {
        jquery: $
    };
});
