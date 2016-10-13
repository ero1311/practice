shapes = [];
connections = [];
var selected=null, x_pos = 0, y_pos = 0,x_elem = 0, y_elem = 0,selectedId;

//node object
var node = (function() {
    var nextId = 1;

    return function node(name, type, color, image, connects) {
        this.name=name;
        this.image=image;
        this.type = type;
        this.color=color;
        this.connects=connects;
        this.id = nextId++;
        this.box='placeholder';

    }
})();

//box object
function Box(x,y,width,height){
    this.x=x;
    this.y=y;
    this.width=width;
    this.height=height;
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('add').addEventListener('click', addNode);
});

function addNode(){
    var Nnode=new node(document.getElementById('name').value,
        document.querySelector('input[name="type"]:checked').value,
        document.getElementsByClassName('jscolor')[0].value,
        document.getElementById('img').value,
        document.getElementById('connects').value.split(',')
    );
    var Ndiv=document.createElement('div'),
        Ntext=document.createElement('p'),
        Nimage=document.createElement('img');
    Ndiv.className=Nnode.type;
    Ndiv.id='div'+Nnode.id;
    Ntext.textContent=Nnode.name;
    Nimage.src=Nnode.image;
    Ndiv.appendChild(Ntext);
    Ndiv.appendChild(Nimage);
    Ndiv.onmousedown=function () {
        selectedId=parseInt(this.id.slice(3))-1;
        _drag_init(this);
        return false;
    };
    document.getElementById('holder').appendChild(Ndiv);
    Nnode.box=new Box(Ndiv.offsetLeft,Ndiv.offsetTop,Ndiv.offsetWidth,Ndiv.offsetHeight);
    shapes.push(Nnode);
    drawConns();
}
//making nodes draggable
function _move_elem(e) {
    x_pos = window.event.clientX;
    y_pos = window.event.clientY;
    if (selected !== null) {
        selected.style.left = (x_pos - x_elem) + 'px';
        selected.style.top = (y_pos - y_elem) + 'px';
        shapes[selectedId].box.x=(x_pos - x_elem);
        shapes[selectedId].box.y=(y_pos - y_elem);
    }
    for (var i = connections.length; i--;) {
        r.connection(connections[i]);
    }
}

function _drag_init(elem) {
    selected = elem;
    x_elem = x_pos - selected.offsetLeft;
    y_elem = y_pos - selected.offsetTop;
}

function _destroy() {
    selected = null;
    selectedId=null;
}

function drawConns(){
    for (var i = 0, ii = shapes.length; i < ii; i++) {
        for(var j=0; j<shapes[i].connects.length; j++) {
            if(shapes[i].connects[j]!="") {
                connections.push(r.connection(shapes[i].box, shapes[parseInt(shapes[i].connects[j])].box, "000"));
            }
        }
    }
}


Raphael.fn.connection = function (obj1, obj2, line, bg) {
    if (obj1.line && obj1.from && obj1.to) {
        line = obj1;
        obj1 = line.from;
        obj2 = line.to;
    }
    var p = [{x: obj1.x + obj1.width / 2, y: obj1.y - 1},
            {x: obj1.x + obj1.width / 2, y: obj1.y + obj1.height + 1},
            {x: obj1.x - 1, y: obj1.y + obj1.height / 2},
            {x: obj1.x + obj1.width + 1, y: obj1.y + obj1.height / 2},
            {x: obj2.x + obj2.width / 2, y: obj2.y - 1},
            {x: obj2.x + obj2.width / 2, y: obj2.y + obj2.height + 1},
            {x: obj2.x - 1, y: obj2.y + obj2.height / 2},
            {x: obj2.x + obj2.width + 1, y: obj2.y + obj2.height / 2}],
        d = {}, dis = [];
    for (var i = 0; i < 4; i++) {
        for (var j = 4; j < 8; j++) {
            var dx = Math.abs(p[i].x - p[j].x),
                dy = Math.abs(p[i].y - p[j].y);
            if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                dis.push(dx + dy);
                d[dis[dis.length - 1]] = [i, j];
            }
        }
    }
    if (dis.length == 0) {
        var res = [0, 4];
    } else {
        res = d[Math.min.apply(Math, dis)];
    }
    var x1 = p[res[0]].x-12,
        y1 = p[res[0]].y-12,
        x4 = p[res[1]].x-10,
        y4 = p[res[1]].y-10;
    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
    dy = Math.max(Math.abs(y1 - y4) / 2, 10);
    var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
        y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
        x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
        y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
    var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");
    if (line && line.line) {
        line.bg && line.bg.attr({path: path});
        line.line.attr({path: path});
    } else {
        var color = typeof line == "string" ? line : "#000";
        return {
            bg: bg && bg.split && this.path(path).attr({stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3}),
            line: this.path(path).attr({stroke: color, fill: "none"}),
            from: obj1,
            to: obj2
        };
    }
};

window.onload = function () {
    r = Raphael("holder", "100%", "100%");
    document.onmousemove = _move_elem;
    document.onmouseup = _destroy;
};
