# loadjs

这个是一个微型的模块加载器，代码就是最好的文档。

用法

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

loadjs 默认用你写代码引入模块时的名字作为模块 ID，通过 urlFix 生成 path，用生成的 path 作为模块唯一索引，从模块字典中查找相应的模块。

具体示例可参考 entry.js
