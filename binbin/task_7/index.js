
function addEvent(elment, type, handler) {
    if (!elment) return;
    if (elment.addEventListener) {
        elment.addEventListener(type, handler, false);
    } else if (elment.attachEvent) {
        elment.attachEvent('on' + type, function() {
            handler.apply(elment);
        });
    }else {
    	elment['on'+type]=handler;
    }
}

//LRD
var nodeList = [];

function postOrder(root) {
    if (root !== null) {
        if (root.firstElementChild) {
            postOrder(root.firstElementChild);
        }
        if (root.lastElementChild) {
            postOrder(root.lastElementChild);
        }
        nodeList.push(root);
    }
}

//LDR

function inOrder(root) {
    if (root !== null) {
        if (root.firstElementChild) {
            inOrder(root.firstElementChild);
        }
        nodeList.push(root);
        if (root.lastElementChild) {
            inOrder(root.lastElementChild);
        }
    }
}
//DLR

function preOrder(root) {
    if (root !== null) {
        nodeList.push(root);
        if (root.firstElementChild) {
            preOrder(root.firstElementChild);
        }
        if (root.lastElementChild) {
            preOrder(root.lastElementChild);
        }
    }
}

function render() {
    var len = nodeList.length;
    var i = 0;
    nodeList[0].style.backgroundColor = "#0000FE";
    var timer = setInterval(function() {
        i++;
        if (i < len) {
            nodeList[i - 1].style.backgroundColor = "#fff";
            nodeList[i].style.backgroundColor = "#0000FE";
        } else {
            clearInterval(timer);
            nodeList[len - 1].style.backgroundColor = "#fff";
        }
    }, 500);
}


window.onload = function() {
    var root = document.querySelector("#root");
    var btn_qian = document.querySelector("#qian");
    var btn_zhong = document.querySelector("#zhong");
    var btn_hou = document.querySelector("#hou");

    addEvent(btn_qian, 'click', function() {
        nodeList = [];
        preOrder(root);
        render();
    });

    addEvent(btn_zhong, 'click', function() {
        nodeList = [];
        inOrder(root);
        render();
    });
    addEvent(btn_hou, 'click', function() {
        nodeList = [];
        postOrder(root);
        render();
    });

};
