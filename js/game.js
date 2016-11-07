
    (function(){
    var canvasWidth = 300;
    var canvasHeight = 300;
    var ctx;
    var canvasOffset = $("canvas").offset();
    var game = {
        //游戏状态绘制中
        drawing: false,
        //初始坐标
        origin:{}
    }

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

    function drawStart(e){
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
    //输出学习到的图形信息
    function getNew(){
        var resObj = Recognizer.Unistrokes;
        var points = resObj[16].Points;
        var str = ""
        for(var i=0;i<points.length;i++){
            console.log(points[i].X)
            str+= 'new Point('+ Math.floor(points[i].X)+','+Math.floor(points[i].Y)+'),';
        }
        console.log(str)

    }
    function drawEnd(e){
        var pos = getPos(e);
        var curX = pos.X, curY = pos.Y;
        ctx.closePath();
        line.push(pos);
        var result = Recognizer.Recognize(line,true)
        $(".info").text(result.Name);
        $(".score").text(result.Score)
        //alert("这是个"+result.Name+"score:"+result.Score);
        //手动增加一个可识别图形
        //Recognizer.AddGesture('心',line)
        //getNew();
        //fill();
        game.drawing = false;
        ctx.clearRect(0,0,canvasWidth,canvasHeight);
    }
    function fill(){
        ctx.fillStyle='rgba(255, 0, 0, 0.5)';
         //绘制几何图形
        ctx.beginPath()
        ctx.moveTo(line[0].X, line[0].Y)
        for (var i=1; i<line.length; i++){
            ctx.lineTo(line[i].X, line[i].Y)
        }
        ctx.lineTo(line[0].X, line[0].Y)
        ctx.fill()
        ctx.fillStyle='rgba(255, 255, 0, 0.5)'
        //绘制几何图形边
        for (var i=0; i<line.length; i++){
            ctx.beginPath()
            ctx.arc(line[i].X, line[i].Y, 4, 0, 2*Math.PI, false)
            ctx.fill()
        }
        ctx.strokeStyle="rgba(0,0,0,0.2)"

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
    })()