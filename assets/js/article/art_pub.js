$(function() {
    var layer = layui.layer
    var form = layui.form
    initCate()
        //初始化富文本编辑器
    initEditor()

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化失败')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //为选择封面的按钮绑定事件
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })

    $('#coverFile').on('change', function(e) {
        var file = e.target.files[0]
        if (file.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(file)

        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    var art_state = '已发布'

    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })

    $('#form-pub').on('submit', function(e) {
        e.preventDefault()
            //基于form表单,快速创建一个ForData对象
        var fd = new FormData($(this)[0])
            //将文章发布状态存到fd中
        fd.append('state', art_state)
            //将裁减后的图像输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //将文件对象存入fd
                fd.append('cover_img', blob)
                    //发起ajax请求
                publishArticle(fd)
            })
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //如果向服务器提交时FormData格式的数据
            //必须添加以下俩个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发表文章失败')
                }
                layer.msg('发表文章成功')
                    // 发布文章成功后跳转
                location.href = '../article/art_list.html'
            }
        })
    }

})