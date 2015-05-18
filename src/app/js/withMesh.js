/**
 * Created by sylvain on 15/05/2015.
 */
$(function () {
    var renderer = PIXI.autoDetectRenderer(800, 600, {antialias: true});
    $("#view").append(renderer.view);

    // create the root of the scene graph
    var stage = new PIXI.Container();

    stage.interactive = true;

    var even = new PIXI.Graphics();

    var odd = new PIXI.Graphics();

    var isEven = true;

    stage.addChild(even);
    stage.addChild(odd);

    var nbRow = 100;
    var nbCol = 100;
    var height = $("canvas").height();
    var width = $("canvas").width();
    var rectWidth = (width / nbCol);
    var rectHeight = (height / nbRow);

    console.log("width=" + width + " height=" + height);
    console.log("rectWidth=" + rectWidth + " rectHeight=" + rectHeight);


    var first = true;

    var drawStage = function () {

        var row;
        var graphics;
        if (isEven) {
          if(!first){
              odd.clear();
          }
            graphics = even;
            even.lineStyle(1, 0x0000FF, 1);
            row = -2;
            isEven = false;
        } else {
            even.clear();
            graphics = odd;
            odd.lineStyle(1, 0x8800AA, 1);

            row = -1;
            isEven = true;

        }
        first = false;


        var nextRow = function () {
            if (row > (nbRow-3)) {
                return false;
            }
            row += 2;
            return true;

        }


        while (nextRow()) {
            for (var i = 0; i < nbCol; i++) {
                graphics.drawRect(i * rectWidth, row * rectHeight, rectWidth, rectHeight);

            }
        }


    }



    var fpsDisplay = $("#fps");

   //fps
    var start = new Date();
    var now = null;
    var end = null;
    var nbFrames = 0;

    //stat on ration  JS / graphic card
    var jsTime = null; //time to drawStage
    var renderTime = null; //time to render stage
    var GCTime = null;  //time to drawStage
    var GCRequestAnimation = null; //time to request animation
    var loopCount=1;

    var animate = function () {
        //calculate fps
        now = new Date();
        if (now.getTime() != start.getTime()) {
            nbFrames++;
            if ((now.getTime() - start.getTime()) >= 1000) {
                fpsDisplay.html(nbFrames);
                nbFrames = 0;
                start = new Date();
            }
        }

        //stat on ration  JS / graphic card
        var jsTimeCalc = new Date();
        drawStage();
        var renderTimeCalc = new Date();
        renderer.render(stage);
        var GCTimeCalc = new Date();


        requestAnimationFrame(animate);
        var GCRequestAnimationeCalc = new Date();

        loopCount++;

        jsTime =  renderTimeCalc.getTime() - jsTimeCalc.getTime();

        renderTime =  GCTimeCalc.getTime() - renderTimeCalc.getTime();

        GCRequestAnimation =  GCRequestAnimationeCalc.getTime() - GCTimeCalc.getTime();

        if (end != null) {

            GCTime = now.getTime() - end.getTime();

        }

        end = new Date();

      //  console.log("jsTime="+jsTime+"\nrenderTime="+renderTime+"\nGCRequestAnimation="+GCRequestAnimation+"\nGCTime="+GCTime);
    }


    // run the render loop
    animate();
});
