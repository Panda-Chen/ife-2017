function Node(data) {
    this.data = data;
    this.parent = null;
    this.children = [];
    this.id = 0;
}

function Tree(data) {
    var node = new Node(data);
    this._root = node;
    this.index = 0;
}
//这种算法只能满足最深节点为最左边的树的情况。当最深的节点位于中间或者右边时，失效。
Tree.prototype.traverseDF = function(callback) {
    (function recurse(currentNode) {
        //遍历节点的孩子
        for (var i = 0, length = currentNode.children.length; i < length; i++) {
            recurse(currentNode.children[i]);
        }
        //回调函数
        callback(currentNode);
    })(this._root);
};
Tree.prototype.traverseBF = function(callback) {
    var rootarr = [this._root];
    currentTree = rootarr.shift();
    while (currentTree) {
        for (var i = 0, len = currentTree.children.length; i < len; i++) {
            rootarr.push(currentTree.children[i]);
        }
        callback(currentTree);
        currentTree = rootarr.shift();
    }
};
Tree.prototype.contains = function(callback, traversal) {
    traversal.call(this, callback);
};
Tree.prototype.add = function(data, toData, traversal) {
    var child = new Node(data),
        parent = null,
        callback = function(node) {
            if (node.data === toData) {
                parent = node;
            }
        };
    this.contains(callback, traversal);
    if (parent) {
        this.index++;
        child.id = this.index;
        parent.children.push(child);
        child.parent = parent;
        this.createDom();
    } else {
        throw new Error('节点插入失败');
    }
};
Tree.prototype.remove = function(data, fromData, traversal) {
    var tree = this,
        parent = null,
        childToRemove = null,
        index;
    var callback = function(node) {
        if (node.data === fromData) {
            parent = node;
        }
    };
    this.contains(callback, traversal);
    if (parent) {
        index = findIndex(parent.children, data);
        if (index === undefined) {
            throw new Error('节点删除失败');
        } else {
            childToRemove = parent.children.splice(index, 1);
            this.createDom();
        }
    } else {
        throw new Error('父节点不存在');
    }
};

Tree.prototype.createDom = function() {
    //只能用bf进行遍历加载，df会出错，原因未知
    var container = document.querySelector("#container");
    this.traverseBF.call(this, function(node) {
        if (!node.parent) {
            container.innerHTML = '<div id="box' + node.id + '" data-value="' + node.data + '">' + node.data + '</div>';
        } else {
            container = document.querySelector('#box' + node.parent.id);
            container.innerHTML += '<div id="box' + node.id + '"  data-value="' + node.data + '">' + node.data + '</div>';
        }
    });
};

function findIndex(arr, data) {
    var index;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].data === data) {
            index = i;
        }
    }
    return index;
}

function recoverLayer(type) {
    if (type) {
        if ($('.current')) {
            $('.current').setAttribute('class', '');
        }
    } else {
        if ($('.selected')) {
            $('.selected').setAttribute('class', '');
        }
        if ($('.current')) {
            $('.current').setAttribute('class', '');
        }
    }
}

function $(idorclass) {
    return document.querySelector(idorclass);
}

function render(treeList, searchword) {
    var i = 0,
        len = treeList.length;
    $("#box" + treeList[0]).setAttribute('class', 'current');
    var timer = setInterval(function() {
        i++;
        if (i < len) {
            $("#box" + treeList[i - 1]).setAttribute('class', '');
            $("#box" + treeList[i]).setAttribute('class', 'current');
            if ($("#box" + treeList[i]).dataset.value === searchword) {
                clearInterval(timer);
            }
        } else {
            clearInterval(timer);
            $("#box" + treeList[len - 1]).setAttribute('class', '');
        }
    }, 500);
}

function isEmpty(value) {
    if (value === null || value === "" || value === "undefined" || value === undefined || value === "null") {
        return true;
    } else {
        value = value.replace(/\s/g, "");
        if (value === "") {
            return true;
        }
        return false;
    }
}

//1、遍历完成，渲染之后树节点的点击事件失效
//2、在新开始一个时间前，应该让树的界面回到原始状态
//3、节点唯一性，在生成节点的时候，需要对节点的id处理一下
window.onload = function() {
    //先new一棵树
    //像树中添加节点
    //渲染生成界面
    var tree = new Tree('0');
    tree.add('1', '0', tree.traverseBF);
    tree.add('1_1', '1', tree.traverseBF);
    tree.add('1_2', '1', tree.traverseBF);
    tree.add('1_2_1', '1_2', tree.traverseBF);
    tree.add('1_2_1_1', '1_2_1', tree.traverseBF);
    tree.add('1_3', '1', tree.traverseBF);
    tree.add('2', '0', tree.traverseBF);
     tree.add('2_2', '2', tree.traverseBF);
    tree.add('2_1', '2', tree.traverseBF);
    tree.add('3', '0', tree.traverseBF);
    //绑定点击事件
    $('#container').onclick = function(e) {
        recoverLayer();
        if (e.target.id !== 'container') {
            $('#' + e.target.id).setAttribute('class', 'selected');
        }
    };
    $('#bf').onclick = function() {
        recoverLayer();
        var treeList = [];
        tree.traverseBF(function(node) {
            treeList.push(node.id);
        });
        render(treeList);
    };
    $('#df').onclick = function() {
        recoverLayer();

        var treeList = [];
        tree.traverseDF(function(node) {
            treeList.push(node.id);
        });
        render(treeList);
    };
    $('#del').onclick = function() {
        recoverLayer('del');

        if ($('.selected')) {
            var selecteddata = $('.selected');
            var data = selecteddata.dataset.value;
            var fromData = selecteddata.parentNode.dataset.value;
            tree.remove(data, fromData, tree.traverseDF);
        } else {
            alert('请选中需要删除的节点');
        }
    };
    $('#add').onclick = function() {
        recoverLayer('add');

        var addData = $('#input').value;
        if (isEmpty(addData)) {
            alert('请输入需要添加的节点值');
        } else {
            if ($('.selected')) {
                var parentData = $('.selected').dataset.value;
                tree.add(addData, parentData, tree.traverseDF);
            } else {
                alert('请选择需要添加到的父元素');
            }
        }
    };
    $('#DF-search').onclick = function() {
        recoverLayer();

        var searchData = $('#input').value;
        if (isEmpty(searchData)) {
            alert('请输入需要查找的关键字');
        } else {
            var treeList = [];
            tree.traverseDF(function(node) {
                treeList.push(node.id);
            });
            render(treeList, searchData);
        }
    };
    $('#BF-search').onclick = function() {
        recoverLayer();

        var searchData = $('#input').value;
        if (isEmpty(searchData)) {
            alert('请输入需要查找的关键字');
        } else {
            var treeList = [];
            tree.traverseBF(function(node) {
                treeList.push(node.id);
            });
            render(treeList, searchData);
        }
    };

};
