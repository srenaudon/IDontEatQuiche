/**
 * Created by sylvain on 15/05/2015.
 */
$(function () {
    var renderer = PIXI.autoDetectRenderer(800, 600, {antialias: true});
    $("#view").append(renderer.view);

    // create the root of the scene graph
    var stage = new PIXI.Container();

    stage.interactive = true;

    var even =  new PIXI.SpriteBatch();
    var odd =  new PIXI.SpriteBatch();
    var evenTexture = PIXI.Texture.fromImage('res/even.png');
    var oddTexture = PIXI.Texture.fromImage('res/odd.png');
    var texture = null;
    var container = null;



    var isEven = true;

   stage.addChild(even);
   stage.addChild(odd);
    var nbRow = 100;
    var nbCol = 100;
    var rectHeight = 14;
    var rectWidth =19;


    var loopCount=1;
    var first = true;

    var drawStage = function () {

        var row;
        if (isEven) {
            if(!first ){
                stage.removeChildren(0,5000);
            }
            texture = evenTexture;
            row = -2;
            isEven = false;
        } else {
            stage.removeChildren(0,5000);
            texture = oddTexture;
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

        var nbObject = 0;

        while (nextRow()) {
            for (var i = 0; i < nbCol; i++) {

               var square =  new PIXI.Sprite(texture);
                square.x = i * rectWidth;
                square.y =  row * rectHeight;
                stage.addChild(square);
                nbObject++;
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
