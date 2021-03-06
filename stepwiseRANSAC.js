

/** 
 *@author Danny Behnecke
 *@version 1.0
 *
 *@description Here are the stepwise RANSAC Functions
 */


/**
 * @description runs RANSAC for lines stepwise
 * */
function stepwiseLineRANSAC() {
    stepPixels = getCanvasContent();
    if (stepPixels.length) {
        switch (stepCount) {
            case 0:
                clearLayer(actLayerContext);
                clearLayer(epsLayerContext);
                stepPixels = getCanvasContent();
                highlightText(0);
                break;

            case 1:
                highlightText(1);
                var a = Math.floor((Math.random() * stepPixels.length) + 1);
                var b = Math.floor((Math.random() * stepPixels.length) + 1);
                step_randPoints = {p: new Point(stepPixels[a].point.x, stepPixels[a].point.y), q: new Point(stepPixels[b].point.x, stepPixels[b].point.y)};

                drawPoint(step_randPoints.p, 'red', actLayerContext);
                drawPoint(step_randPoints.q, 'red', actLayerContext);
                break;
            case 2:
                highlightText(2);
                stepL = new Line(step_randPoints.p, step_randPoints.q);
                stepM = calcSlope(stepL);
                stepB = calcIntercept(stepL, stepM);
                stepL.m = stepM;
                stepL.b = stepB;
                calcLinePoints(stepL, stepM, stepB);
                drawLine(stepL, 'green', actLayerContext);
                break;




            case 3://display inlier in pseudo-code
                highlightText(3);
                drawLineEpsilon(stepL, 'blue', epsLayerContext, epsCanvas);
                INLIER = 0;
                var pixHandle;
                for (var j = 0; j < stepPixels.length; j++) {
                    pixHandle = stepPixels[j];

                    var d = distancePointToLine(pixHandle.point, stepL);
//                alert(d);
                    //alert(epsilon);
                    if (d <= epsilon) {
                        drawPoint(pixHandle.point, 'yellow', epsLayerContext);

                        INLIER++;
                    }
                }

                break;
            case 4:
                highlightText(4);
                // alert(INLIER);
                // alert(BEST_INLIER);
                if (INLIER > BEST_INLIER) {
                    BEST_INLIER = INLIER;
                    BEST_LINE = stepL;

                }
                clearLayer(resultLayerContext);

                if (BEST_LINE !== 0) {
                    drawLine(BEST_LINE, 'red', resultLayerContext);
                    updateWatchdog(BEST_INLIER, INLIER);
                }
                break;
        }
        stepCount = (stepCount + 1) % 5;
        stepLoop++;
    }
    else {
        if (LANG === 'DE') {
            alert("Bitte zuerst Suchgrundlage zeichnen!");
        }
        if (LANG === 'EN') {
            alert("Please draw data set to search on first!");
        }
    }

}
/**
 *@description runs CircleRANSAC stepwise
 * */
function stepwiseCircleRANSAC() {

    stepPixels = getCanvasContent();

    if (stepPixels.length) {
        switch (stepCount) {
            case 0:
                clearLayer(actLayerContext);
                clearLayer(epsLayerContext);
                stepPixels = getCanvasContent();
                highlightText(0);
                break;

            case 1:
                highlightText(1);
                var p, q, z;
                do {
                    a = Math.floor((Math.random() * stepPixels.length - 1) + 1);
                    b = Math.floor((Math.random() * stepPixels.length - 1) + 1);
                    c = Math.floor((Math.random() * stepPixels.length - 1) + 1);

                    p = new Point(stepPixels[a].point.x, stepPixels[a].point.y);
                    q = new Point(stepPixels[b].point.x, stepPixels[b].point.y);
                    z = new Point(stepPixels[c].point.x, stepPixels[c].point.y);
                }
                while ((a === b) && (a === c) && (b === c) || ((calculate2DDeterminate(p, q) === 0) || (calculate2DDeterminate(p, z) === 0) || (calculate2DDeterminate(q, z) === 0)))


                step_randPoints = {pA: new Point(stepPixels[a].point.x, stepPixels[a].point.y), pB: new Point(stepPixels[b].point.x, stepPixels[b].point.y), pC: new Point(stepPixels[c].point.x, stepPixels[c].point.y)};


                drawPoint(step_randPoints.pA, 'red', actLayerContext);
                drawPoint(step_randPoints.pB, 'red', actLayerContext);
                drawPoint(step_randPoints.pC, 'red', actLayerContext);
                break;
            case 2:
                highlightText(2);

                /*   connectPoints(step_randPoints.pA, step_randPoints.pB, 'yellow', actLayerContext);
                 connectPoints(step_randPoints.pA, step_randPoints.pC, 'yellow', actLayerContext);
                 connectPoints(step_randPoints.pB, step_randPoints.pC, 'yellow', actLayerContext);*/


                step_dXY = distancePointToPoint(step_randPoints.pA, step_randPoints.pB);
                step_dXZ = distancePointToPoint(step_randPoints.pA, step_randPoints.pC);
                step_dYZ = distancePointToPoint(step_randPoints.pB, step_randPoints.pC);



                var xy = new Circle(step_randPoints.pA.x, step_randPoints.pA.y, step_dXY * 0.6);
                var yx = new Circle(step_randPoints.pB.x, step_randPoints.pB.y, step_dXY * 0.6);

                step_XY = getCircleIntersectionLine(xy, yx);
                step_XY.m = calcSlope(step_XY);
                step_XY.b = calcIntercept(step_XY, step_XY.m);
                calcLinePoints(step_XY, step_XY.m, step_XY.b);

                var xz = new Circle(step_randPoints.pA.x, step_randPoints.pA.y, step_dXZ * 0.6);
                var zx = new Circle(step_randPoints.pC.x, step_randPoints.pC.y, step_dXZ * 0.6);

                step_XZ = getCircleIntersectionLine(xz, zx);
                step_XZ.m = calcSlope(step_XZ);
                step_XZ.b = calcIntercept(step_XZ, step_XZ.m);
                calcLinePoints(step_XZ, step_XZ.m, step_XZ.b);

                /*step_YZ = getCircleIntersectionLine(step_y, step_z);
                 
                 
                 step_YZ.m = calcSlope(step_YZ);
                 step_YZ.b = calcIntercept(step_YZ, step_YZ.m);
                 calcLinePoints(step_YZ, step_YZ.m, step_YZ.b);*/

                step_cross = getLineIntersection(step_XY, step_XZ);

                /* drawLine(step_XY, 'yellow', actLayerContext);
                 drawLine(step_XZ, 'yellow', actLayerContext);
                 //  drawLine(step_YZ, 'yellow', actLayerContext);
                 drawPoint(step_cross, 'blue', actLayerContext);*/

                drawPoint(step_cross, 'blue', actLayerContext);
                var temp_dist = distancePointToPoint(step_cross, step_randPoints.pA);
                step_currCircle = new Circle(step_cross.x, step_cross.y, temp_dist);
                drawCircle(step_currCircle, 'blue', actLayerContext);
                drawPoint(step_randPoints.pA, 'red', actLayerContext);
                drawPoint(step_randPoints.pB, 'red', actLayerContext);
                drawPoint(step_randPoints.pC, 'red', actLayerContext);
                break;




            case 3://display inlier in pseudo-code
                highlightText(3);
                //clearLayer(actLayerContext);

                clearLayer(epsLayerContext);


                drawCircleEpsilon(step_currCircle, 'green', epsLayerContext);

                INLIER = 0;
                for (var i = 0; i < stepPixels.length; i++) {
                    var pixHandle = stepPixels[i];
                    var d = distancePointToPoint(pixHandle.point, step_cross);
//                        

                    if ((d <= parseFloat(step_currCircle.r) + parseFloat(epsilon / 2) + 2) && (d >= step_currCircle.r - parseFloat(epsilon / 2) - 2)) {
                        INLIER++;
                        drawPoint(pixHandle.point, 'yellow', epsLayerContext);
                    }
                }
                updateWatchdog(BEST_INLIER, INLIER);


                break;
            case 4:
                highlightText(4);


                if (INLIER > BEST_INLIER) {
                    BEST_INLIER = INLIER;
                    BEST_CIRCLE = step_currCircle;
                    updateWatchdog(BEST_INLIER, INLIER);

                }



                if (BEST_CIRCLE !== 0) {

                    clearLayer(resultLayerContext);
                    drawCircle(BEST_CIRCLE, 'red', resultLayerContext);
                }

                break;

        }
        stepCount = (stepCount + 1) % 5;
        stepLoop++;
    }
    else {
        if (LANG === 'DE') {
            alert("Bitte zuerst Suchgrundlage zeichnen!");
        }
        if (LANG === 'EN') {
            alert("Please draw data set to search on first!");
        }
    }

}
