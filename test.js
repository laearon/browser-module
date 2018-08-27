loadjs('test', 'http://localhost:3000/test2.js', function(test2) {
    console.log(1, test2);
    return {
        script: 'test.js'
    };
});
