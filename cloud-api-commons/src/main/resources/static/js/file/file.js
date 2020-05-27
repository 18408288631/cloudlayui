/**
 * 文件管理
 */
var pageCurr;
var form;
$(function () {
    layui.use(['table','upload','laydate'], function () {
        var table = layui.table;
        var upload =layui.upload;
        form = layui.form;
        tableIns = table.render({
            elem: '#demos',
            id: 'demos',
            url: '/file/data',
            height: 400,
            method: 'post', //默认：get请求
            cellMinWidth: 80,
            toolbar: '#toolbarDemos',//开启头部工具栏，并为其绑定左侧模板
            defaultToolbar: ['filter', 'exports', 'print', { //自定义头部工具栏右侧图标。如无需自定义，去除该参数即可
                title: '提示'
                , layEvent: 'LAYTABLE_TIPS'
                , icon: 'layui-icon-tips'
            }],
            page: true,
            request: {
                pageName: 'pageNum', //页码的参数名称，默认：pageNum
                limitName: 'pageSize' //每页数据量的参数名，默认：pageSize
            },
            response: {
                statusName: 'code', //数据状态的字段名称，默认：code
                statusCode: 200, //成功的状态码，默认：0
                countName: 'totals', //数据总数的字段名称，默认：count
                dataName: 'list' //数据列表的字段名称，默认：data
            },
            cols: [[
                {field: 'zizeng', title: '序号', fixed:'left',type:'numbers',align: 'center'}
                , {field: 'filename', title: '文件名', align: 'center',templet:function (d) {
                    console.log(d);
                        return '<a href="/word/'+d.filename+'" target="_blank" style="color:#00F7DE;">'+d.filename+'</a>'
                    }}
                , {field: 'createtime', title: '创建时间', align: 'center'}
                , {fixed: 'right', title: '操作', align: 'center', toolbar: '#barDemo'}
            ]],
            done: function(res, curr, count){
                //如果是异步请求数据方式，res即为你接口返回的信息。
                //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                //console.log(res);
                //得到当前页码
                console.log(curr);
                //得到数据总量
                //console.log(count);
                pageCurr=curr;
            }
        });
        //监听头部
        table.on('toolbar(demos)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id);
            switch (obj.event) {
                case 'getCheckData':
                    var data = checkStatus.data;
                    addDate();
                    // layer.alert("新增");
                    break;
                case 'getDaoRuExcel':
                    var data = checkStatus.data;
                    ExcelInit();
                // layer.alert("新增");
                break;
                //自定义头工具栏右侧图标 - 提示
                case 'LAYTABLE_TIPS':
                    layer.alert('这是工具栏右侧自定义的一个图标按钮');
                    break;
            }
            ;
        });
        //监听工具条
        table.on('tool(demos)', function (obj) {
            var data = obj.data;
            if(obj.event ==='del'){
                del(data);
            }
        });
        // 执行搜索，表格重载
        $('#fileQuery').on('click', function () {
            // 搜索条件
            var filename = $('#filename').val();
            table.reload('demos', {
                method: 'post'
                , where: {
                    'filename': filename
                }
                , page: {
                    curr: pageCurr
                },
                url: '/file/data'
            });
        });
        //执行实例
        var uploadInst = upload.render({
            elem: '#test1' //绑定元素
            ,url: '/file/upload' //上传接口
            ,accept: 'file' //允许上传的文件类型
            ,done: function(res){
                //上传完毕回调
                if(res.code===200){
                    var filename=res.word;
                    var data={filename:filename};
                    $.post("/file/add", data, function (res) {
                        if (res.code == 200) {
                            layer.msg('文件上传成功', {icon: 1}, function (index) {
                                layer.closeAll();
                                load(data);
                            });
                        } else {
                            layer.msg(res.message, {icon: 0}, function () {
                                location.reload(); // 页面刷新
                                return false
                            })
                        }
                    }, 'json');
                }else{
                    layer.msg('文件上传失败', {icon: 5}, function () {
                        return false
                    });
                }
            }
            ,error: function(){
                //请求异常回调
            }
        });
        //执行实例
        var uploadInst2 = upload.render({
            elem: '#test2' //绑定元素
            ,url: '/file/excel' //上传接口
            ,accept: 'file' //允许上传的文件类型
            ,done: function(res){
                //上传完毕回调
                if(res.code===200){
                    layer.msg('导入成功', {icon: 5}, function () {
                        layer.closeAll();
                        return false
                    });
                }else{
                    layer.msg('导入失败', {icon: 5}, function () {
                        return false
                    });
                }
            }
            ,error: function(){
                //请求异常回调
            }
        });
    });
    $("#clearQuery").click(function () {
        cleanlogin();
    });
});
//清除
function cleanlogin() {
    $("#filename").val("");
}
//新增
function addDate() {
    //在这里面输入任何合法的js语句
    layer.open({
        type: 1 //Page层类型
        , area: ['500px', '300px']
        , title: '新增'
        , shade: 0.6 //遮罩透明度
        , shadeClose: true
        , maxmin: true //允许全屏最小化
        , anim: 1 //0-6的动画形式，-1不开启
        , content: $("#addmain")
    });
}
function ExcelInit() {
    //在这里面输入任何合法的js语句
    layer.open({
        type: 1 //Page层类型
        , area: ['500px', '300px']
        , title: '新增'
        , shade: 0.6 //遮罩透明度
        , shadeClose: true
        , maxmin: true //允许全屏最小化
        , anim: 1 //0-6的动画形式，-1不开启
        , content: $("#excel")
    });
}
//关闭页面
function load(obj){
    //重新加载table
    tableIns.reload({
        where: obj.field
        , page: {
            curr: pageCurr //从当前页码开始
        }
    });
}
function del(data) {
    var ctx = "/file/del";
    $.post(ctx, data, function (res) {
        if (res.code == 200) {
            layer.msg(res.message, {icon: 1}, function (index) {
                layer.closeAll();
                load(data);
            });
        } else {
            layer.msg(res.message, {icon: 0}, function () {
                location.reload(); // 页面刷新
                return false
            })
        }
    }, 'json');
}