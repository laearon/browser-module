loadjs('http://localhost:3000/test2', function(test2) {
    debugger;
    console.log(1, test2);
    return {
        script: 'test.js'
    };
});
