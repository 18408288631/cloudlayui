/**
 * 会员列表
 */
var pageCurr;
var form;

$(function() {

    layui.use('table', function(){
        var table = layui.table;
        form = layui.form;

        tableIns=table.render({
            elem: '#demos',
            id: 'demos',
            url:'/memberlist/data',
            height:400,
            method: 'post', //默认：get请求
            cellMinWidth: 80,
            toolbar: '#toolbarDemos' ,//开启头部工具栏，并为其绑定左侧模板
            defaultToolbar: ['filter', 'exports', 'print', { //自定义头部工具栏右侧图标。如无需自定义，去除该参数即可
                title: '提示'
                ,layEvent: 'LAYTABLE_TIPS'
                ,icon: 'layui-icon-tips'
            }],
            page: true,
            request: {
                pageName: 'pageNum', //页码的参数名称，默认：pageNum
                limitName: 'pageSize' //每页数据量的参数名，默认：pageSize
            },
            response:{
                statusName: 'code', //数据状态的字段名称，默认：code
                statusCode: 200, //成功的状态码，默认：0
                countName: 'totals', //数据总数的字段名称，默认：count
                dataName: 'list' //数据列表的字段名称，默认：data
            },
            cols: [[
                {field:'uuid', title:'ID',align:'center'}
                ,{field:'employeeName', title:'会员名称',align:'center'}
                ,{field:'identity', title:'身份证号码',align:'center'}
                ,{field:'employeeVipName', title:'会员等级',align:'center'}
                ,{field:'createTime', title:'入会时间',align:'center'}
                ,{fixed: 'right', title:'操作',align:'center', toolbar: '#barDemo'}
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
        table.on('toolbar(demos)', function(obj){
            var checkStatus = table.checkStatus(obj.config.id);
            switch(obj.event){
                case 'getCheckData':
                    var data = checkStatus.data;
                    addDate();
                    // layer.alert("新增");
                    break;

                //自定义头工具栏右侧图标 - 提示
                case 'LAYTABLE_TIPS':
                    layer.alert('这是工具栏右侧自定义的一个图标按钮');
                    break;
            };
        });
        //监听工具条
        table.on('tool(demos)', function(obj){
            var data = obj.data;
            if(obj.event === 'detail'){
                layer.msg('ID：'+ data.uuid + ' 的查看操作');
            } else if(obj.event === 'del'){
                /*layer.confirm('真的删除行么', function(index){
                    obj.del();
                    layer.close(index);
                });*/
                del(data);
            } else if(obj.event === 'edit'){
                updateDate(data);
            }
        });
        //提交监听事件
        form.on('submit(save)', function (data) {
            params = data.field;
            submit($,params);
            return false;
        })
        // 执行搜索，表格重载
        $('#vipQuery').on('click', function () {
            // 搜索条件
            var employeeName = $('#employeeName').val();
            var identity = $('#identity').val();
            table.reload('demos', {
                method: 'post'
                , where: {
                    'employeeName': employeeName,
                    'identity': identity,
                }
                , page: {
                    curr: pageCurr
                },
                url:'/memberlist/data'
            });
        });
    });
    $("#clearQuery").click(function () {
        cleanPersonVip();
    });
});

//清除
function cleanPersonVip() {
    $("#identity").val("");
    $("#employeeName").val("");
}
//新增
function addDate() {
    //在这里面输入任何合法的js语句
    layer.open({
        type: 1 //Page层类型
        ,area: ['500px', '300px']
        ,title: '新增'
        ,shade: 0.6 //遮罩透明度
        ,shadeClose: true
        ,maxmin: true //允许全屏最小化
        ,anim: 1 //0-6的动画形式，-1不开启
        ,content: $("#addmain")
    });
    clearDate();
}
//提交
function submit($,params){
    var ctx="/memberlist/add";
    $.post(ctx, params, function (res) {
        if (res.code==200) {
            layer.msg(res.message,{icon:1,width:300,height:200},function(index){
                layer.closeAll();
                load(params);
            });
        }else{
            layer.msg(res.message,{icon:0},function(){
                location.reload(); // 页面刷新
                return false
            })
        }
    }, 'json');
}
//修改数据
function updateDate(data){
    //在这里面输入任何合法的js语句
    layer.open({
        type: 1 //Page层类型
        ,area: ['500px', '300px']
        ,title: '修改'
        ,shade: 0.6 //遮罩透明度
        ,shadeClose: true
        ,maxmin: true //允许全屏最小化
        ,anim: 1 //0-6的动画形式，-1不开启
        ,content: $("#addmain")
    });
    //数据写入
    insertDate(data);
}
function del(data) {
    var ctx="/memberlist/del";
    $.post(ctx, data, function (res) {
        if (res.code==200) {
            layer.msg(res.message,{icon:1},function(index){
                layer.closeAll();
                load(data);
            });
        }else{
            layer.msg(res.message,{icon:0},function(){
                layer.closeAll();
                location.reload(); // 页面刷新
                return false
            })
        }
    }, 'json');
}
//关闭页面
function CloseWin(){
    parent.location.reload(); // 父页面刷新
    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    parent.layer.close(index); //再执行关闭
}
function insertDate(date) {
    $("#updateuuid").val(date.uuid);
    $("#updateemployeeName").val(date.employeeName);
    $("#updateidentity").val(date.identity);
}
function clearDate() {
    $("#updateuuid").val("");
    $("#updateemployeeName").val("");
    $("#updateidentity").val("");
}
function load(obj){
    //重新加载table
    tableIns.reload({
        where: obj.field
        , page: {
            curr: pageCurr //从当前页码开始
        }
    });
}