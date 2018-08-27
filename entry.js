loadjs.config({
    baseUrl: '/'
});
loadjs(['test.js'], function(test) {
    debugger;
    console.log('ok', test);
});
