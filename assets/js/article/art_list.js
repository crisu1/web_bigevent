$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;

    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss
    }

    function padZero(z) {
        return z > 9 ? z : '0' + z
    }
    //定义一个查询的参数对象,将来请求数据的时候
    // 需要将请求对象提交到服务器
    var q = {
        pagenum: 1, //页码值,默认请求第一页的数据
        pagesize: 2, //每页显示几条数据,默认每页显示2条
        cate_id: '', //文章分类的Id
        state: '' //文章的发布状态
    }
    initTable()
    initCate()

    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                //使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                    //调用渲染分页
                renderPage(res.total)
            }
        })
    }

    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                console.log(res);
                //调用模板引擎渲染分类
                var htmlStr = template('tpl-cate', res)
                    // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    //筛选表单绑定submit事件
    $('#form-search').on('submit', function() {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        initTable()
    })

    //定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //分页容器的Id
            count: total, //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认选的的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip', ],
            limits: [1, 2, 3, 4, 5],
            //分页发生切换的时候，触发jump回调
            jump: function(obj, first) {
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                    // initTable()
                if (!first) {
                    initTable()
                }
            }
        })

    }

    //绑定删除事件
    $('tbody').on('click', '.btn-delete', function() {
        var len = $('.btn.delete').length
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                    layer.close(index);
                }
            })

        })
    })
})