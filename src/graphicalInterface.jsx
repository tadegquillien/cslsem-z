// Graphical interface

// this script contains the functions that deal with the graphical interface
// for the machines

// note that the nodes are designated by letters. letters map the position of the node on the screen, 
// for example node A will always be the upper-left node. Depending on the experimental condition (1 or 2),
// a given letter may correspond to either a generative or preventative node. similarly, shapes and colors 
// are randomly assigned


import { add, mult, objectMap } from './convenienceFunctions';


// we define the coordinates of the items

export const graphicalDimensions = (r, AWired, BWired, CWired, DWired, GWired) => {

    const circleWidth = 2;

    // we add some height to the svg depending on whether the upppermost nodes are displayed
    const addedHeight = 3*r*(AWired+CWired - AWired*CWired) // i.e. if A or C are wired

    const addedWidth = r;
    // coordinates for each node
    const pointcoordinates = {
        a: [0.5*r+addedWidth, 1.5*r], // upper-left node
        b : [3.75*r+addedWidth, 1.5*r+addedHeight], // middle-left node
        g: [7*r+addedWidth, 1.5*r], // middle-center node
        c: [13.5*r+addedWidth, 1.5*r], // upper-right node
        d : [10.25*r+addedWidth, 1.5*r+addedHeight], // middle-right node
        e : [7*r+addedWidth, 4.5*r+addedHeight] // lower node
    }

    
    // compute the coordinates of a triangle
    const computeTriangle = (x,y)=>{
        // define the points for the triangle
        const theta = Math.PI / 6;
        const l = (2 * r) / (1 + Math.sin(theta));
        const qx = l * Math.cos(theta);
        const qy = l * Math.sin(theta);
        const sy = l;
        const y_prime = y - r + l;
        const up = [x, y_prime - sy];
        const left = [x - qx, y_prime + qy];
        const right = [x + qx, y_prime + qy];
        
        // convert the triangle points to a string that we can feed to the svg
        const str = `${up[0]},${up[1]} ${left[0]},${left[1]} ${right[0]},${right[1]}`;
        return([{'up': up, 'left': left, 'right': right}, str])

    }
    

    // compute the coordinates of a diamond
    // this returns an array with two elements
    // the first element is an object, which has the coordinates for the points defining
    // the diamond
    // the second element is a string representation of these points
    const computeDiamond = (x, y, diamondRadius) => {
        // compute the coordinates of the points defining the diamond
        const [top, bottom, left, right] = [[x, y - diamondRadius],
        [x, y + diamondRadius],
        [x - diamondRadius, y], [x + diamondRadius, y]];
        // convert the diamond points to a string that we can feed to the svg
        const strDiamond = `${top[0]},${top[1]} ${left[0]},${left[1]} ${bottom[0]},
    ${bottom[1]} ${right[0]},${right[1]}`;
        // return the coordinates, in both formats
        return ([
            {
                topx: top[0],
                topy: top[1],
                bottomx: bottom[0],
                bottomy: bottom[1],
                leftx: left[0],
                lefty: left[1],
                rightx: right[0],
                righty: right[1]
            }
            , strDiamond]);
    };


    const computePentagon = (x, y, pentagonRadius) => {
        const fullcircle = 2*Math.PI;
        // Define the angles for the five points of the pentagon
        const angles = [-fullcircle/4, 
        -fullcircle/4 + fullcircle/5,
        -fullcircle/4 + 2*fullcircle/5,
        -fullcircle/4 + 3*fullcircle/5,
        -fullcircle/4 + 4*fullcircle/5,
    ];
      
        // Compute the coordinates of the points defining the pentagon
        const pentagonPoints = angles.map(angle => [
            x + pentagonRadius * Math.cos(angle),
            y + pentagonRadius * Math.sin(angle)
        ]);
      
        // Convert the pentagon points to a string that we can feed to the svg
        const strPentagon = pentagonPoints.map(point => point.join(',')).join(' ');
        // Return the coordinates
        return [
            {
                point1x: pentagonPoints[0][0],
                point1y: pentagonPoints[0][1],
                point2x: pentagonPoints[1][0],
                point2y: pentagonPoints[1][1],
                point3x: pentagonPoints[2][0],
                point3y: pentagonPoints[2][1],
                point4x: pentagonPoints[3][0],
                point4y: pentagonPoints[3][1],
                point5x: pentagonPoints[4][0],
                point5y: pentagonPoints[4][1]
            },
            strPentagon
        ];
    };
    
    

    // compute the coordinates for the diamonds, triangles, and pentagons
    const diamondStr = objectMap(pointcoordinates, 
        i => computeDiamond(i[0], i[1], r)
    )

    const triangleStr = objectMap(pointcoordinates,
        i => computeTriangle(i[0], i[1])
    );

    const pentagonStr = objectMap(pointcoordinates,
        i => computePentagon(i[0], i[1], 1.2*r)
    )


    //// compute the height and width of the svg (as a function of where the elements are)

    const [ax, bx, cx, dx, gx, ex] = Object.values(pointcoordinates).map(arr => arr[0]);
    const [ay, by, cy, dy, gy, ey] = Object.values(pointcoordinates).map(arr => arr[1]);

    //const coordBucketX = Object.values(pointcoordinates).map(arr => arr[0]);
    const coordBucketX = [ax*AWired, bx*BWired, cx*CWired, dx*DWired, gx*GWired, ex]
    const coordBucketY = [ay*AWired, by*BWired, cy*CWired, dy*DWired, gy*GWired, ey];
    const svgWidth = Math.max(...coordBucketX) + 2 * r;
    const svgHeight = Math.max(...coordBucketY) + 2 * r;

    // return coordinates
    return ([
        pointcoordinates, diamondStr, triangleStr, pentagonStr, circleWidth,
        svgWidth, svgHeight
    ])
};

// this function computes the coordinates of a line from the bottom of the first element
// to the top of the second element

export const makeLine = (first, second, r, pointcoordinates) => {
    const first_x = pointcoordinates[first][0];
    const first_y = pointcoordinates[first][1];
    const second_x = pointcoordinates[second][0];
    const second_y = pointcoordinates[second][1];
    // we represent the center of the first and second items with vectors f and s respectively
    // a vector going from f to s
    const fs = [first_x - second_x, first_y - second_y];
    const fs_length = Math.sqrt(
        fs[0] ** 2 + fs[1] ** 2
    );
    // the corresponding unit vector i
    const fs_norm = mult(1 / fs_length, fs);

    // compute the line starting point as f - r*i
    //const fs_start = add([first_x, first_y], mult(-r, fs_norm));
    const fs_start = add([first_x, first_y], mult(-0, fs_norm));
    // compute the line endingp point as s + r*i
    const fs_end = add([second_x, second_y], mult(r, fs_norm));
    return ([fs_start, fs_end])
}



// same function as above, but adapted for a square
export const makeLineSq = (first, second, r, pointcoordinates) => {
    const first_x = pointcoordinates[first][0];
    const first_y = pointcoordinates[first][1];
    const second_x = pointcoordinates[second][0];
    const second_y = pointcoordinates[second][1];
    // we represent the center of the first and second items with vectors f and s respectively
    // a vector going from f to s
    const fs = [first_x - second_x, first_y - second_y];
    const fs_length = Math.sqrt(
        fs[0] ** 2 + fs[1] ** 2
    );
    // the corresponding unit vector i
    const fs_norm = mult(1 / fs_length, fs);
    // the scaling factor k
    const k = Math.abs(fs_norm[0]) > Math.abs(fs_norm[1]) ?
        r / Math.abs(fs_norm[0]) :
        r / Math.abs(fs_norm[1]);
    // compute the line starting point as k*i
    //const fs_start = add([first_x, first_y], mult(-k, fs_norm));
    const fs_start = add([first_x, first_y], mult(-0, fs_norm));
    // compute the line ending point as s + r*i
    //const fs_end = add([second_x, second_y], mult(r, fs_norm));
    const fs_end = add([second_x, second_y], mult(k, fs_norm));
    return ([fs_start, fs_end])

}

// this function computes the coordinates for an arrow tip
// 'first' and 'second' are the coordinates of the centers of the nodes that the
// primary line runs through. We need these coordinates so that we can align
// the arrow tips with the primary line of the arrow
const arrowTip = (first_x, first_y, second_x, second_y, theta, arrowLength) => {

    // a function that performs vector rotation
    const rotate = (vector, theta) => {
        return ([
            Math.cos(theta) * vector[0] - Math.sin(theta) * vector[1],
            Math.sin(theta) * vector[0] + Math.cos(theta) * vector[1]
        ])
    };

    // we compute the vector that is used to create the primary line (i.e. the line connecting the nodes)
    const fs = [first_x - second_x, first_y - second_y];
    const fs_length = Math.sqrt(
        fs[0] ** 2 + fs[1] ** 2
    );
    // the corresponding unit vector i
    const fs_norm = mult(1 / fs_length, fs);

    // perform scalar multiplication on the vector
    const scaled_fs = mult(arrowLength, fs_norm);
    // rotate the scaled vector
    const rotatedTip = rotate(scaled_fs, theta);
    return (rotatedTip);
}

// this function computes the coordinates of an arrow
// it takes as input the vector for the corresponding between-nodes line 
// (from which the new arrow tips vectors will be computed)
// as well the angle of rotation and the arrow length
export const makeArrow = (lineStart, lineEnd, theta, arrowLength) => {
    const rightTipVector = arrowTip(lineStart[0], lineStart[1], lineEnd[0], lineEnd[1], theta, arrowLength);
    const rightTipX = lineEnd[0] + rightTipVector[0];
    const rightTipY = lineEnd[1] + rightTipVector[1];

    const leftTipVector = arrowTip(lineStart[0], lineStart[1], lineEnd[0], lineEnd[1], -theta, arrowLength);
    const leftTipX = lineEnd[0] + leftTipVector[0];
    const leftTipY = lineEnd[1] + leftTipVector[1];

    return ([rightTipX, rightTipY, leftTipX, leftTipY]);

};

// this function computes the intersection between two lines
// (the first line goes from a to b, and the second line goes from c to d)
// we will use this to find where a line coming onto a diamond node should stop
const computeIntersection = (ax, ay, bx, by, cx, cy, dx, dy) => {

    // compute the slopes for each linear equation

    // we first compute the denominator, which we replace by .001 if it is 0
    // (to avoid divide-by-zero errors)
    const denom1 = (ax - bx) === 0 ? .001 : (ax - bx);
    const denom2 = (cx - dx) === 0 ? .001 : (cx - dx);
    // compute the slopes
    const m = (ay - by) / denom1; // slope for the a to b line
    const s = (cy - dy) / denom2; // slope for the c to d line
    // solve for x and y
    const x = (m * ax - s * cx + cy - ay) / (m - s);
    const y = cy + s * (x - cx);
    // return the coordinates of the intersection
    return ([x, y]);
}

// this function computes an intersection between a line and a diamond
// (diamond coordinates must be organized as an object)
// a is the center of the origin node, e is the center of the destination node
// basically this is a wrapper around the previous function, but that first picks
// which is the relevant line in the diamond node
export const getIntersectionDiamond = (ax, ay, ex, ey, diamondCoordinates) => {

    // we first must decide which line of the diamond will intersect with the between-nodes line
    const chosenLine = (ex < ax) ?
        ((ey < ay) ? "bottomright" : "topright") :
        ((ey < ay) ? "bottomleft" : "topleft");

    // extract the corresponding coordinates
    const diamondLine = (chosenLine === "topleft") ?
        [diamondCoordinates.topx, diamondCoordinates.topy,
        diamondCoordinates.leftx, diamondCoordinates.lefty] :
        (chosenLine === "topright") ?
            [diamondCoordinates.topx, diamondCoordinates.topy,
            diamondCoordinates.rightx, diamondCoordinates.righty] :
            (chosenLine === "bottomleft") ?
                [diamondCoordinates.bottomx, diamondCoordinates.bottomy,
                diamondCoordinates.leftx, diamondCoordinates.lefty] :
                (chosenLine === "bottomright") ?
                    [diamondCoordinates.bottomx, diamondCoordinates.bottomy,
                    diamondCoordinates.rightx, diamondCoordinates.righty] : NaN;

    return (computeIntersection(ax, ay, ex, ey, ...diamondLine));
}



export const getIntersectionTriangle = (ax, ay, ex, ey, triangleCoordinates) => {

    // a function computing the angle
    const getAngle = (ax, ay, ex, ey) => {
        const dx = ex - ax;
        const dy = ey - ay;
        let theta = Math.atan2(dy, dx) * (180 / Math.PI);
        theta = ((theta % 360) + 360) % 360; // Adjust angle to be between 0 and 360
        if (theta > 330) {
            theta -= 360; // Adjust angle to be between -30 and 330
        }
        return theta;
    }

    // Compute the angle between the line segment extending from the center of e towards the right
    // and the line joining points a and e
    const angle = getAngle(ax, ay, ex, ey);
    // Determine which side of the triangle the line intersects with
    let chosenSide;
    if (angle >= -30 && angle < 90) {
        chosenSide = 'left';
    } else if (angle >= 90 && angle < 210) {
        chosenSide = 'right';
    } else if (angle >= 210 && angle < 330) {
        chosenSide = 'bottom';
    } else {
        return NaN; // Invalid position
    }
    

    // Extract the coordinates of the corresponding side
    let triangleSide;
    switch (chosenSide) {
        case "bottom":
            triangleSide = [triangleCoordinates.right[0], triangleCoordinates.right[1],
                            triangleCoordinates.left[0], triangleCoordinates.left[1]];
            break;
        case "right":
            triangleSide = [triangleCoordinates.up[0], triangleCoordinates.up[1],
                            triangleCoordinates.right[0], triangleCoordinates.right[1]];
            break;
        case "left":
            triangleSide = [triangleCoordinates.up[0], triangleCoordinates.up[1],
                            triangleCoordinates.left[0], triangleCoordinates.left[1]];
            break;
        default:
            return NaN; // Invalid side
    }
    
    return computeIntersection(ax, ay, ex, ey, ...triangleSide);
}
