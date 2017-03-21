function node(data) {
    this.data = data;
    this.parent = null;
    this.children = [];
}

function tree(data) {
    var node = new node(data);
    this._root = node;
}
tree.prototype.traverseDF = function(callback) {
    (function recurse(currentNode) {
        //遍历节点的孩子
        for (var i = 0, length = currentNode.children.length; i < length; i++) {
            recurse(currentNode.children[i]);
        }
        //回调函数
        callback(currentNode);
    })(this._root);
};
tree.prototype.traverseBF = function(callback) {
    var rootarr = [this._root];
    currentTree = rootarr.shift();
    while (currentTree) {
        for (var i = 0, len = currentTree.children.length; i < len; i++) {
            rootarr.push(currentTree.children[i]);
        }
        treeList.push(currentTree);
        currentTree = rootarr.shift();
    }
};
tree.prototype.contains = function(callback, traversal) {
    traversal.call(this, callback);
};
tree.prototype.add = function(data, toData, traversal) {
    var child = new Node(data),
        parent = null,
        callback = function(node) {
            if (node.data === toData) {
                parent = node;
            }
        };
    this.contains(callback, traversal);
    if (parent) {
        parent.children.push(child);
        child.parent = parent;
    } else {
        throw new Error('节点插入失败');
    }
};
tree.prototype.remove = function(data, fromData, traversal) {
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
        }
    } else {
        throw new Error('父节点不存在');
    }
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

//下面是树的两种遍历算法
var treeList = [];
//广度优先遍历
//遍历原理：在遍历父节点的时候，把该节点的所有孩子节点存在一个数组里面，然后利用数组的先入先出的特性，继续遍历孩子。这样就实现了数的广度遍历
function treeBF(root) {
    var rootarr = [root];
    currentTree = rootarr.shift();
    while (currentTree) {
        for (var i = 0, len = currentTree.children.length; i < len; i++) {
            rootarr.push(currentTree.children[i]);
        }
        treeList.push(currentTree);
        currentTree = rootarr.shift();
    }
}
//深度优先遍历
//遍历原理：先遍历父节点的孩子节点
function treeDF(root) {
    for (var i = 0, len = root.children.length; i < len; i++) {
        treeDF(root.children[i]);
    }
    treeList.push(root);
}

function render() {
    var len = treeList.length;
    var i = 0;
    treeList[0].style.backgroundColor = "#0000FE";
    var timer = setInterval(function() {
        i++;
        if (i < len) {
            treeList[i - 1].style.backgroundColor = "#fff";
            treeList[i].style.backgroundColor = "#0000FE";
        } else {
            clearInterval(timer);
            treeList[len - 1].style.backgroundColor = "#fff";
        }
    }, 500);
}

window.onload = function() {
    var root = document.querySelector("#root");
    document.querySelector("#df").onclick = function() {
        treeList = [];
        treeDF(root);
        render();
    };
    document.querySelector("#bf").onclick = function() {
        treeList = [];
        treeBF(root);
        render();
    };

};
