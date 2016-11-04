
    var stage = 'playing'
    var origin = {};
    var config = {};
    var canvasWidth = 640;
    var canvasHeight = 600;
    var status = -1;
    var list = [
        [0,1],[1,0],[1,0,1],[1,1,0],[0,1,0,1],[1,1,0,1]
    ];
    var game = {
        start:{},
        end:{}
    };
    var ctx;
    var score = 0;
    var curIns = [];
    var curIndex = 0;
    var canvasOffset = $("canvas").offset();
    function create() {
      var canvas = document.getElementById("front");
      if (canvas.getContext) {
        ctx = canvas.getContext("2d");
      }
    }
    create()
    function vector(x, y){
        return {
            X:x,
            Y:y,
        }
    }
    function delta(a, b){
        return vector(a.X - b.X, a.Y - b.Y)
    }
    function angle_between(a, b){
        return Math.acos((a.X*b.X + a.Y*b.Y)/(len(a)*len(b)))
    }
    function len(v){
        return Math.sqrt(v.X*v.X + v.Y*v.Y)
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
    var line;

    var Recognizer = new DollarRecognizer();
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
    function drawStart(e){
        var pos = getPos(e);
        var curX = pos.X, curY = pos.Y;
        ctx.lineWidth = '20px';
        ctx.strokeStyle = 'rgba(0,0,0,0.2)'
        origin.x = pos.x;
        origin.y = pos.y;
        ctx.beginPath();
        game.drawing = true;
        line = [pos]
    }
    function drawing(e){
        var pos = getPos(e);
        var curX = pos.X, curY = pos.Y;
        if(game.drawing){
            ctx.strokeStyle="rgba(0,0,0,0.2)"
            ctx.moveTo(origin.x,origin.y);
            ctx.lineTo(curX,curY);
            ctx.stroke();
            origin.x = curX;
            origin.y = curY;
            line.push(pos);
        }
    }
    function getNew(){
        var resObj = Recognizer.Unistrokes;
    }
    function drawEnd(e){
        var pos = getPos(e);
        var curX = pos.X, curY = pos.Y;
        ctx.closePath();
        line.push(pos);
        var result = Recognizer.Recognize(line,true)
        alert("这是个"+result.Name+"score:"+result.Score);
        //Recognizer.AddGesture('心',line)
        getNew();
        ctx.clearRect(0,0,canvasWidth,canvasHeight);
        game.drawing = false;
    }
    $("#front").on('mousedown',function(e){
        drawStart(e)
    });
    $("#front").on('mousemove',function(e){
        drawing(e)
    });
    $("#front").on('mouseup',function(e){
        drawEnd(e);
    });
    $("#front").on("touchstart", function(e) {
        e.preventDefault();
        drawStart(e)
    });
    $("#front").on("touchmove", function(e) {
        e.preventDefault();
        drawing(e)
    });
    $("#front").on("touchend", function(e) {
        e.preventDefault();
        drawEnd(e);
    });