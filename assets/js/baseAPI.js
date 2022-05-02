//每次调用$.gte()或$.post()或$.ajax()的时候,会先调用ajaxPrefilter这个函数
//在这个函数中,可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    options.url = 'http://www.liulongbin.top:3007' + options.url
    console.log(options.url);
})