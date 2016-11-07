
    (function(){
    var canvasWidth = 300;
    var canvasHeight = 300;
    var ctx;
    var canvasOffset = $("#back").offset();
    console.log(canvasOffset.top)
    console.log(canvasOffset.left)
    var game = {
        //游戏状态绘制中
        drawing: false,
        //初始坐标
        origin:{}
    }
    function Point(x, y) // constructor
    {
        this.X = x;
        this.Y = y;
    }
    function create() {
      var canvas = document.getElementById("back");
      if (canvas.getContext) {
        ctx = canvas.getContext("2d");
      }
    }
    create()
    function getAngle(angle){
        if(angle>Math.PI/2){
            return Math.PI/2-angle
        }else{
            return angle
        }
    }
    function vector(x, y){
        return {
            X:x,
            Y:y,
        }
    }
    function delta(a, b){
        return vector(a.X - b.X, a.Y - b.Y)
    }
    function angle(d){
        return Math.atan((1.0*d.Y)/d.X)
    }
    function angle_between(a, b){
        return Math.acos((a.X*b.X + a.Y*b.Y)/(len(a)*len(b)))
    }
    function unit(c){
        var l=len(c)
        return vector(c.X/len(c), c.Y/len(c))
    }
    function len(v){
        return Math.sqrt(v.X*v.X + v.Y*v.Y)
    }
    function scale(c, f){
        return vector(c.X*f, c.Y*f)
    }

    function add(a, b){
        return vector(a.X+b.X, a.Y+b.Y)
    }

    function rotate(v, a){
        return vector(  v.X*Math.cos(a) - v.Y*Math.sin(a),
                        v.X*Math.sin(a) + v.Y*Math.cos(a))
    }

    function average(l){
        var x=0
        var y=0
        for (var i=0; i<l.length; i++){x+=l[i].X; y+=l[i].Y}
        return vector(x/l.length, y/l.length)
    }
    function getPos(e){
        var curX;
        if(e.pageX){
            curX = e.pageX, curY = e.pageY;
        }else{
            curX =  e.changedTouches[0].pageX, curY =  e.changedTouches[0].pageY;
        }
        return new Point (
            curX-canvasOffset.left,
            curY-canvasOffset.top
        )
    }
    //绘制点集
    var line;

    function getCorner(line){
        var n=0
        var t=0
        var lastCorner=line[0]
        var corners= [line[0]]
        for (var i=1; i<line.length-2; i++){

            var pt=line[i+1]
            var d=delta(lastCorner, line[i-1])

            if (len(d)>20 && n>2){
                ac=delta(line[i-1], pt)
                if (Math.abs(angle_between(ac, d)) > Math.PI/4){
                    pt.index=i
                    corners.push(pt)
                    lastCorner=pt
                    n=0
                    t=0
                }
            }
            n++
        }
        return corners;
    }
    function calculate(corners){
        console.log(corners)
        if (len(delta(line[line.length-1], line[0]))<45){
            corners.push(line[0])

            ctx.fillStyle='rgba(0, 0, 255, 0.3)'

            if (corners.length==5){
                $(".info2").text('矩形')
                var p1=corners[0]
                var p2=corners[1]
                var p3=corners[2]
                var p4=corners[3]
                var p1p2=delta(p1, p2)
                var p2p3=delta(p2, p3)
                var p3p4=delta(p3, p4)
                var p4p1=delta(p4, p1)
                if ((Math.abs(angle_between(p1p2, p2p3)-Math.PI/2))<Math.PI/6
                && (Math.abs(angle_between(p2p3, p3p4)-Math.PI/2))<Math.PI/6
                && (Math.abs(angle_between(p3p4, p4p1)-Math.PI/2))<Math.PI/6
                && (Math.abs(angle_between(p4p1, p1p2)-Math.PI/2))<Math.PI/6){
                    ctx.fillStyle='red'
                    var p1p3=delta(p1, p3)
                    var p2p4=delta(p2, p4)

                    var diag=(len(p1p3)+len(p2p4))/4.0

                    var tocenter1=scale(unit(p1p3), -diag)
                    var tocenter2=scale(unit(p2p4), -diag)

                    var center=average([p1, p2, p3, p4])

                    var angle=angle_between(p1p3, p2p4)

                    corners=[add(center, tocenter1),
                            add(center, tocenter2),
                            add(center, scale(tocenter1, -1)),
                            add(center, scale(tocenter2, -1)),
                            add(center, tocenter1)]
                }
            }
            if (corners.length==4){
                //check for 三角形
                $(".info2").text('三角形')
                var p1=corners[0]
                var p2=corners[1]
                var p3=corners[2]
                var p1p2=delta(p1, p2)
                var p2p3=delta(p2, p3)
                var p3p1=delta(p3, p1)
                var angle1 = getAngle(Math.abs(angle_between(p1p2, p2p3)));
                var angle2 = getAngle(Math.abs(angle_between(p2p3, p3p1)));
                var angle3 = getAngle(Math.abs(angle_between(p3p1, p1p2)));
                if (angle1+angle2 +angle3 -Math.PI<Math.PI/6){
                    ctx.fillStyle='yellow'
                }
            }
            ctx.beginPath()
            ctx.moveTo(corners[0].X, corners[0].Y)
            for (var i=1; i<corners.length; i++){
                ctx.lineTo(corners[i].X, corners[i].Y)
            }
            ctx.fill()
        }else{
            corners.push(line[line.length-1])
        }
        if(corners.length==3){
            $(".info2").text('对勾')
            var p1=corners[0]
            var p2=corners[1]
            var p3=corners[2]
            if(p2.Y-p1.Y>20 && p2.Y-p3.Y>20){
                ctx.strokeStyle='green'
            }else if(p2.Y-p1.Y<-20 && p2.Y-p3.Y<-20){
                ctx.strokeStyle='orange'
                (".info2").text('尖对勾')
            }else{
                ctx.strokeStyle='rgba(0, 0, 255, 0.5)'
            }
        }else if(corners.length==2){
            var p1=corners[0]
            var p2=corners[1]
            var p3 = {
                X:p1.X+40,
                Y:p1.Y
            }
            var p4 = {
                X:p2.X,
                X:p2.X+40
            }
           // Math.abs(angle_between(p1p2, ))
           //console.log(p1p2)
           var p1p2=delta(p1,p2)
           var p1p3=delta(p1,p3)
           var p2p4=delta(p2,p4)
           if(Math.abs(angle_between(p1p2,p1p3))<Math.PI/6){
                ctx.strokeStyle='pink'
                 $(".info2").text('横')
           }else if(Math.abs(angle_between(p1p2,p2p4))<Math.PI/6){
                //竖
                 $(".info2").text('竖')
                ctx.strokeStyle='purple'
            }
        }else{
            ctx.strokeStyle='rgba(0, 0, 255, 0.5)'
        }
        //绘制点
        ctx.beginPath()
        ctx.moveTo(corners[0].X, corners[0].Y)
        for (var i=1; i<corners.length; i++){
            ctx.lineTo(corners[i].X, corners[i].Y)
        }
        ctx.stroke()


        ctx.fillStyle='rgba(255, 0, 0, 0.5)'
        //绘制几何图形
        for (var i=0; i<corners.length; i++){
            ctx.beginPath()
            ctx.arc(corners[i].X, corners[i].Y, 4, 0, 2*Math.PI, false)
            ctx.fill()
        }
        ctx.strokeStyle="rgba(0,0,0,0.2)"
    }
    function drawStart(e){
        ctx.clearRect(0,0,canvasWidth,canvasHeight);
        $(".info2").text('')
        var pos = getPos(e);
        var curX = pos.X, curY = pos.Y;
        ctx.lineWidth = '20px';
        ctx.strokeStyle = 'rgba(0,0,0,0.2)'
        game.origin.x = pos.x;
        game.origin.y = pos.y;
        ctx.beginPath();
        game.drawing = true;
        line = [pos]
    }
    function drawing(e){
        var pos = getPos(e);
        var curX = pos.X, curY = pos.Y;
        if(game.drawing){
            ctx.strokeStyle="rgba(0,0,0,0.2)"
            ctx.moveTo(game.origin.x,game.origin.y);
            ctx.lineTo(curX,curY);
            ctx.stroke();
            game.origin.x = curX;
            game.origin.y = curY;
            line.push(pos);
        }
    }

    function drawEnd(e){
        var pos = getPos(e);
        var curX = pos.X, curY = pos.Y;
        ctx.closePath();
        line.push(pos);
        calculate(getCorner(line));
        //ctx.clearRect(0,0,canvasWidth,canvasHeight);
        game.drawing = false;
    }
    $("#back").on('mousedown',function(e){
        drawStart(e)
    });
    $("#back").on('mousemove',function(e){
        drawing(e)
    });
    $("#back").on('mouseup',function(e){
        drawEnd(e);
    });
    $("#back").on("touchstart", function(e) {
        e.preventDefault();
        drawStart(e)
    });
    $("#back").on("touchmove", function(e) {
        e.preventDefault();
        drawing(e)
    });
    $("#back").on("touchend", function(e) {
        e.preventDefault();
        drawEnd(e);
    });
    })()