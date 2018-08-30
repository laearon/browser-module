amdjs.config({
    baseUrl: '/test/exam4/'
});

amdjs(['test1'], function(t1) {
    console.log('ok', t1);
});

