todo:
    更换markdown引擎

    代码检查

    启动管理器

    文件夹组织


    自刷


   多层文件夹 文件

   自动发布

   uglify参数设置

   各种库的选项设置

   url配置

   代理更改字符串

   更改代理网站内容功能


   webpack提取模块功能

   支持vue.js

   es6测试js

   ts测试文件

   修改文件自刷

   自动化测试 模块分析

   node 配置工具

   模块管理功能 增加虚拟模块

   单元测试系统

   接口规范系统

   node构建工具脚手架 

基于监视文件变化 生成在内存中


文件类型
    html
    js
    css
    libjs
    libcs

    模块js 
    模块css
    模块图片
    


<script src="https://cdnjs.cloudflare.com/ajax/libs/es5-shim/4.5.7/es5-shim.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/es5-shim/4.5.7/es5-sham.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/json3/3.3.2/json3.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/es6-shim/0.34.2/es6-shim.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/es6-shim/0.34.2/es6-sham.min.js"></script>
<script src="https://wzrd.in/standalone/es7-shim@latest"></script>

Typescript Typescript只支持ES6模块标准
主文件类型   主文件模块标准 模块文件类型 模块文件标准   生成文件兼容性  打ES5-shim ES5-sham补丁 建议方式

typescript  ES6           typescript  ES6	        >=IE7         >=IE7                   OK  
typescript  ES6           js          ES6	        >=IE9         >=IE7                   OK

js          ES6           js          ES6           >=IE9         >=IE7
js          ES6           js          CommonJS      >=IE9         >=IE9
js          CommonJS      js          CommonJS      >=IE7         >=IE7                   OK
js          CommonJS      js          ES6           不支持         不支持

typescript  ES6           babel.js    ES6	        >=IE9         >=IE9

babel.js    ES6           babel.js    ES6           >=IE9         >=IE9
babel.js    ES6           babel.js    CommonJS      >=IE9         >=IE9
babel.js    CommonJS      babel.js    CommonJS      >=IE7         >=IE7                   OK
babel.js    CommonJS      babel.js    ES6           不支持         不支持