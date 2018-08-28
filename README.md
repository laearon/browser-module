# loadjs

这个是一个微型的模块加载器，代码就是最好的文档。  

具体示例可参考 test 文件夹下的测试用例，有高级用法如自定义 id 的模块，shim 模块，加入依赖其他模块的 shim 如 jquery 插件。  

基本用法  

```javascript
loadjs.config({
    baseUrl: '/',
    module: {
        jquery: {
            path: 'https://code.jquery.com/jquery-3.3.1.min.js',
            shim: 'jQuery'
        }
    }
});

loadjs('jquery', function($) {
    console.log($);
});
```

loadjs 也支持定义自己的模块

```javascript
loadjs(['deps'], function() {
    return {
        // things you want to expose
    };
});
```

