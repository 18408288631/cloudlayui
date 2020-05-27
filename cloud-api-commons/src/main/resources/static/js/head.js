/**
 * 菜单
 * */
//获取路径uri
var pathUri = window.location.href;
$(function () {
    layui.use('element', function () {
        var element = layui.element;
        // 左侧导航区域（可配合layui已有的垂直导航）
        $.get("/getMenu", function (data) {
            if (data != null) {
                // console.log(data)
                getMenus(data);
                element.render('nav');
            } else {
                layer.alert("权限不足，请联系管理员", function () {
                    //退出
                    window.location.href = "/logout";
                });
            }
        });
    });
});

var getMenus = function (data) {
    //回显选中
    var ul = $("<ul class='layui-nav layui-nav-tree' lay-filter='test'></ul>");
                        for (var i = 0; i < data.length; i++) {
                            var node = data[i];
                            // console.log(node)
                            var li = $("<li class='layui-nav-item' flag='" + node.id + "'></li>");
                            var a = $("<a class='' href='javascript:;'>" + node.menuname + "</a>");
                            li.append(a);
                            //获取子节点
                            var childArry = node.children;
                            // console.log(childArry);
                            if (childArry == null) {
                                console.log();
                            } else {
                                if (childArry.length > 0) {
                                    a.append("<span class='layui-nav-more'></span>");
                                    var dl = $("<dl class='layui-nav-child'></dl>");
                                    for (var y in childArry) {
                                        var dd = $("<dd><a href='" + childArry[y].url + "'>" + childArry[y].menuname + "</a></dd>");
                                        //判断选中状态
                                        if (pathUri.indexOf(childArry[y].url) > 0) {
                                            li.addClass("layui-nav-itemed");
                                            dd.addClass("layui-this")
                    }
                    dl.append(dd);
                }
                li.append(dl);
            }
        }
        ul.append(li);
    }
    $(".layui-side-scroll").append(ul);
}