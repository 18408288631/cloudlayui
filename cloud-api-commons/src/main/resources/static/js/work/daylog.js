/**
 * 用户信息
 */
var pageCurr;
var form;
var images='';
$(function () {
    layui.use(['table','upload','laydate'], function () {
        var table = layui.table;
        var upload =layui.upload;
        var laydate = layui.laydate;
        form = layui.form;
        //--------------------datetime--------start------------------------
        var end=new Date();
        var start=new Date();
        var year=start.getFullYear();
        var month=start.getMonth();
        if(month==1){
            start.setFullYear(year-1)
            start.setMonth(12);
        }else{
            start.setMonth(month-1);
        }
        //--------------------datetime----------end----------------------
        tableIns = table.render({
            elem: '#demos',
            id: 'demos',
            url: '/daylog/data',
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
                , {field: 'daylog', title: '日志内容', align: 'center'}
                , {field: 'images', title: '图片', align: 'center',templet:'<div><img src="/{{d.images}}"></div>',style:'height:10px;width:10px;line-height:10px!important;'}
                , {field: 'createTime', title: '创建时间', align: 'center'}
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
                layer.msg('ID：' + data.daylog + ' 的查看操作');
                speckText(data.daylog);
            }else if(obj.event ==='selectPricture'){
                selectPricture(data);
            }else if(obj.event ==='del'){
                del(data);
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
            var daylog = $('#daylog').val();
            var createtime=$("#createtime").val();
            var endtime=$("#endtime").val();
            table.reload('demos', {
                method: 'post'
                , where: {
                    'daylog': daylog,
                    'createTime':createtime,
                    'endTime':endtime
                }
                , page: {
                    curr: pageCurr
                },
                url: '/daylog/data'
            });
        });
        //执行实例
        var uploadInst = upload.render({
            elem: '#test1' //绑定元素
            ,url: '/daylog/upload' //上传接口
            ,done: function(res){
                //上传完毕回调
                if(res.code===200){
                    images=res.images;
                    console.log(images);
                    layer.msg('图片上传成功', {icon: 1}, function () {
                        return false
                    });
                }else{
                    images='';
                    console.log(images);
                    layer.msg('图片上传失败', {icon: 5}, function () {
                        return false
                    });
                }
            }
            ,error: function(){
                //请求异常回调
            }
        });
        //--------------------datetime--------start------------------------
        //开始时间
        var start = laydate.render({
            elem: '#createtime',
            format: 'yyyy-MM-dd',
            value:start
        });
        //结束时间
        var end = laydate.render({
            elem: '#endtime',
            format: 'yyyy-MM-dd', //可任意组合
            value:end
        });
        //--------------------datetime--------end------------------------
    });
    $("#clearQuery").click(function () {
        cleanlogin();
    });
});

//清除
function cleanlogin() {
    $("#daylog").val("");
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
}
//提交
function submit($, params) {
    if(images.trim().length>0){
        var ctx = "/daylog/add";
        params={daylog:params.daylog,images:images};
        $.post(ctx, params, function (res) {
            if (res.code == 200) {
                layer.msg(res.message, {icon: 1}, function (index) {
                    layer.closeAll();
                    images='',
                        load(params);
                });
            } else {
                layer.msg(res.message, {icon: 0}, function () {
                    location.reload(); // 页面刷新
                    return false
                })
            }
        }, 'json');
    }else{
        layer.msg('未上传图片，或者图片上传失败，请重新上传', {icon: 5}, function () {
            return false
        });
    }
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
function clearDate() {
    $("#updatedaylog").val("");
}
function del(data) {
    alert(data.uuid);
    var ctx = "/daylog/del";
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
/*语音播报*/
function speckText(str){
    //var request=  new URLRequest();
    var url = "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=" + encodeURI(str);
    var n = new Audio(url);
    n.src = url;
    n.play();
}
function selectPricture(obj) {
        var img = new Image();
        img.src = obj.images;
        var imgHtml = "<img src='/" + obj.images + "' />";
        //捕获页
        layer.open({
            type: 1,
            shade: false,
            title: false, //不显示标题
            //area:['600px','500px'],
            area: [600+'px', 480+'px'],
            content: imgHtml, //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
            cancel: function () {
                //layer.msg('捕获就是从页面已经存在的元素上，包裹layer的结构', { time: 5000, icon: 6 });
            }
        });
}