/**
 * 用户信息
 */
var pageCurr;
var form;

$(function () {
    layui.use('table', function () {
        var table = layui.table;
        form = layui.form;

        tableIns = table.render({
            elem: '#demos',
            id: 'demos',
            url: '/sysmenu/data',
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
                {field: 'uuid', title: 'UUID', align: 'center'}
                , {field: 'id', title: 'ID', align: 'center'}
                , {field: 'menuname', title: '菜单名称', align: 'center'}
                , {field: 'url', title: '访问路径', align: 'center'}
                , {field: 'fathername', title: '父菜单名称', align: 'center'}
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
            if (obj.event === 'detail') {
                qx(obj);
            } else if (obj.event === 'del') {
                del(data);
            } else if (obj.event === 'edit') {
                updateDate(data);
            }
        });
        //提交监听事件
        form.on('submit(save)', function (data) {
            params = data.field;
            submit($, params);
            return false;
        })
        // 执行搜索，表格重载
        $('#vipQuery').on('click', function () {
            // 搜索条件
            var menuname = $('#menuname').val();
            table.reload('demos', {
                method: 'post'
                , where: {
                    'menuname': menuname
                }
                , page: {
                    curr: pageCurr
                },
                url: '/sysmenu/data'
            });
        });
    });
    $("#clearQuery").click(function () {
        cleanlogin();
    });
});
//清除
function cleanlogin() {
    $("#menuname").val("");
}
//新增
function addDate() {
    clearDate();
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
    insertdata();
}
function insertdata(){
    clearDate();
    $("option[name='menuuuid']").remove();
    var ctx = "/sysmenu/querymenu";
    var str = '<option name="menuuuid" value="">根节点</option>';
    $.post(ctx, function (data) {
        for (var i = 0; i < data.length; i++) {
            str += '<option name="menuuuid" value="' + data[i].id + '">' + data[i].menuname + '</option>';
        }
        console.log(str);
        $("#updateparentid").append(str);
        form.render('select'); //刷新select选择框渲染
    }, 'json');
}
//提交
function submit($, params) {
    var ctx = "/sysmenu/add";
    $.post(ctx, params, function (res) {
        if (res.code == 200) {
            layer.msg(res.message, {icon: 1}, function (index) {
                layer.closeAll();
                load(params);
            });
        } else {
            layer.msg(res.message, {icon: 0}, function () {
                location.reload(); // 页面刷新
                return false
            })
        }
    }, 'json');
}

//修改数据
function updateDate(data) {
    //在这里面输入任何合法的js语句
    layer.open({
        type: 1 //Page层类型
        , area: ['500px', '300px']
        , title: '修改'
        , shade: 0.6 //遮罩透明度
        , shadeClose: true
        , maxmin: true //允许全屏最小化
        , anim: 1 //0-6的动画形式，-1不开启
        , content: $("#addmain")
    });
    $("option[name='menuuuid']").remove();
    //数据写入
    updateDateInsert(data);
}
function  updateDateInsert(datas){
    $("#updateuuid").val(datas.uuid);
    $("#updateurl").val(datas.url);
    $("#updatemenuname").val(datas.menuname);
    console.log(datas.uuid);
    console.log(datas.url);
    var ctx = "/sysmenu/querymenu";
    var str = '<option name="menuuuid" value="" selected>根节点</option>';
    $.post(ctx, function (data) {
        for (var i = 0; i < data.length; i++) {
            if (datas.parentid === data[i].id) {
                str += '<option name="menuuuid" value="' + data[i].id + '" selected>' + data[i].menuname + '</option>';
            }else {
                str += '<option name="menuuuid" value="' + data[i].id + '">' + data[i].menuname + '</option>';
            }
        }
        $("#updateparentid").append(str);
        form.render('select'); //刷新select选择框渲染
    }, 'json');
}
function del(data) {
    var mm={
        'uuid':data.uuid,
        'children':[]
    };
    var ctx = "/sysmenu/del";
    $.post(ctx, mm, function (res) {
        if (res.code == 200) {
            layer.msg(res.message, {icon: 1}, function (index) {
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
function clearDate() {
    $("#updateuuid").val("");
    $("#updatemenuname").val("");
    $("#updateurl").val("");
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