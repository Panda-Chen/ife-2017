function $(idorclass) {
    return document.querySelector(idorclass);
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
        clearStyle(currentTree);
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
    clearStyle(root);
    treeList.push(root);
}
//为当前项目增加特殊的样式
function render(searchData) {
    var len = treeList.length;
    var i = 0;
    setCurrentStyle(treeList[0], searchData);
    if (searchData && treeList[i].dataset.value === searchData) {
        return;
    }
    var timer = setInterval(function() {
        i++;
        if (i < len) {
            treeList[i - 1].removeAttribute("style");
            setCurrentStyle(treeList[i], searchData);
            if (searchData && treeList[i].dataset.value === searchData) {
                clearInterval(timer);
            }
        } else {
            clearInterval(timer);
            treeList[len - 1].removeAttribute("style");
        }
    }, 500);
}

function setCurrentStyle(node, searchData) {
    if (searchData) {
        node.style.backgroundColor = "red";
    } else {
        node.style.backgroundColor = "#0000FE";
    }
}
//清楚当选项的样式
function clearStyle(node){
   node.removeAttribute("style");
}
window.onload = function() {
    var root = $("#root");
    $("#df").onclick = function() {
        treeList = [];
        treeDF(root);
        render();
    };
    $("#bf").onclick = function() {
        treeList = [];
        treeBF(root);
        render();
    };
    $("#DF-search").onclick = function() {
        var searchData = $('#input').value;
        if (isEmpty(searchData)) {
            alert('请输入需要查找的节点内容');
        } else {
            treeList = [];
            treeDF(root);
            render(searchData);
        }
    };
    $("#BF-search").onclick = function() {
        var searchData = $('#input').value;
        if (isEmpty(searchData)) {
            alert('请输入需要查找的节点内容');
        } else {
            treeList = [];
            treeBF(root);
            render(searchData);
        }
    }

};
