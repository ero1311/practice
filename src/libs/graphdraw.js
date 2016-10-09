shapes = [];
connections = [];
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
        this.set="placeholder";
    }
})();
//add node

function addNode(){
    var Nnode=new node(document.getElementById('name').value,
                       document.querySelector('input[name="type"]:checked').value,
                       document.getElementsByClassName('jscolor')[0].value,
                       document.getElementById('img').value,
                       document.getElementById('connects').value.split(',')
    );
    r.setStart();
    switch(Nnode.type){
        case "ellipse":
            Nnode.type=r.ellipse(190,100,120,80);
            Nnode.name=r.text(190,100,Nnode.name);
           // Nnode.image=r.image(Nnode.image,190,100,60,40);
            break;
        case "circle":
            Nnode.type=r.circle(190,100,60);
            Nnode.name=r.text(190,100,Nnode.name);
            //Nnode.image=r.image(Nnode.image,190,100,60,40);
            break;
        default:
            Nnode.type=r.rect(190, 100, 120, 80, 10);
            Nnode.name=r.text(220,120,Nnode.name);
           // Nnode.image=r.image(Nnode.image,220,120,60,40);
            break;
    }
    Nnode.set=r.setFinish();
    Nnode.type.attr({fill: Nnode.image, stroke: Nnode.color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
    Nnode.set.draggable();
    shapes.push(Nnode);
    drawConns();
}
function drawConns(){
    for (var i = 0, ii = shapes.length; i < ii; i++) {
        for(var j=0; j<shapes[i].connects.length; j++) {
            if(shapes[i].connects[j]!="")
                connections.push(r.connection(shapes[i].type,shapes[parseInt(shapes[i].connects[j])].type,"000"));
        }
    }
}
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('add').addEventListener('click', addNode);
});
//implementation of draggability
Raphael.st.draggable = function() {
    var me = this,
        lx = 0,
        ly = 0,
        ox = 0,
        oy = 0,
        moveFnc = function(dx, dy) {
            lx = dx + ox;
            ly = dy + oy;
            me.transform('t' + lx + ',' + ly);
            for (var i = connections.length; i--;) {
                r.connection(connections[i]);
            }
        },
        startFnc = function() {},
        endFnc = function() {
            ox = lx;
            oy = ly;
        };

    this.drag(moveFnc, startFnc, endFnc);
};
//connection of two nodes
Raphael.fn.connection = function (obj1, obj2, line, bg) {
    if (obj1.line && obj1.from && obj1.to) {
        line = obj1;
        obj1 = line.from;
        obj2 = line.to;
    }
    var bb1 = obj1.getBBox(),
        bb2 = obj2.getBBox(),
        p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
            {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
            {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
            {x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
            {x: bb2.x + bb2.width / 2, y: bb2.y - 1},
            {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
            {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
            {x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
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
    var x1 = p[res[0]].x,
        y1 = p[res[0]].y,
        x4 = p[res[1]].x,
        y4 = p[res[1]].y;
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
        r = Raphael("holder","100%","100%");
};
