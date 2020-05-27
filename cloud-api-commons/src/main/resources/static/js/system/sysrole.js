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
            url: '/sysrole/data',
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
                {field: 'uuid', title: 'ID', align: 'center'}
                , {field: 'roleName', title: '角色名称', align: 'center'}
                , {field: 'permiss', title: '菜单权限', align: 'center'}
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
            var roleName = $('#roleName').val();
            table.reload('demos', {
                method: 'post'
                , where: {
                    'roleName': roleName
                }
                , page: {
                    curr: pageCurr
                },
                url: '/sysrole/data'
            });
        });
    });
    $("#clearQuery").click(function () {
        cleanlogin();
    });
});
//清除
function cleanlogin() {
    $("#roleName").val("");
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
function clearDate() {
    $("#updateuuid").val("");
    $("#updateroleName").val("");
}
//提交
function submit($, params) {
    var ctx = "/sysrole/add";
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
    //数据写入
    $("#updateuuid").val(data.uuid);
    $("#updateroleName").val(data.roleName);
}

function del(data) {
    var ctx = "/sysrole/del";
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
function qx(data) {
    //页面层-自定义
    //页面层
    layer.open({
        type: 1,
        title:'菜单权限分配',
        //skin: 'layui-layer-rim', //加上边框
        area: ['400px', '600px'], //宽高
        content: '<ul id="treeDemo" class="ztree" style="margin-top: 10px; width: 200px; height: 150px;"> </ul>',
        cancel: function(){
            load(data);
        }
    });
    initTree(data);

}
function initTree(data) {
    var uuid=data.data.uuid;
    var params={
        uuid:uuid
    };
    createTree("/sysrole/getmenu", params,"#treeDemo",uuid);//创建  permission/menuData 后台加载数据路由
}
function createTree(url,params, treeId,uuid) {
    var uuid=uuid;
    var zTree; //用于保存创建的树节点
    var setting = { //设置
        check: {
            enable: true,
            chkboxType: {
                "Y": "ps",
                "N": "ps"
            }
        },
        view: {
            showLine: true, //显示辅助线
            dblClickExpand: true
        },
        data: {
            key:{
                name:"menuname"
            },
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "parentid",
                rootPId: 0
            }
        },
        callback: {
            onCheck: function (data) {
                refreshLayers(uuid);
            }
        },
    };
    $.ajax({ //请求数据,创建树
        type: 'GET',
        url: url,
        data: params,
        dataType: "json", //返回的结果为json
        success: function (data) {
            zTree = $.fn.zTree.init($(treeId), setting, data); //创建树
        },
        error: function (data) {
            alert("创建树失败!");
        }
    });
}

function refreshLayers(uuid) {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    var changedNodes = zTree.getCheckedNodes();
    console.log(changedNodes.length);
    var s='';
    for(var i=0;i<changedNodes.length;i++){
            if(changedNodes.length==1){
                s+=changedNodes[i].id;
                break ;
            }else{
                if(i==changedNodes.length-1 & changedNodes[i].parentid!=0){
                    s+=changedNodes[i].id;
                }else{
                    if(changedNodes[i].parentid!=0){
                        s+=changedNodes[i].id+',';
                    }
                }
            }
    }
    $.ajax({ //请求数据,创建树
        type: 'POST',
        url: '/sysrole/permissrole',
        data: {"permiss":s.trim(),"uuid":uuid},
        dataType: "json", //返回的结果为json
        success: function (data) {
            //layui.alert("授权成功");
        },
        error: function (data) {
            //layui.alert("授权失败");
        }
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