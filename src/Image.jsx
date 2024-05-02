// This component handles the graphical representation of a machine

import {
    graphicalDimensions,
    makeLine, makeLineSq, makeArrow,
    getIntersectionDiamond,
    getIntersectionTriangle,
} from './graphicalInterface';


const Image = ({

    colors, wiring, texts, states, shapes, connections, r,
    metaVisibility = 'yes'

}) => {

    // compute the relevant dimensions, using the graphicalDimensions function we imported
    const [pointcoordinates, diamondStr, triangleStr, pentagonStr, circleWidth,
        svgWidth, svgHeight] = graphicalDimensions(r, wiring.a, wiring.b, wiring.c, wiring.d, wiring.g);
    

    // the angle and length of the arrows
    const theta = .5;
    const arrowLength = .7 * r;

    // generate line coordinates for each wire
    const lines = connections.map((i) => {
        let endShape = shapes[i[1]]
        let output = endShape === 'square' ? [i, makeLineSq(i[0], i[1], r, pointcoordinates)] :
        [i, makeLine(i[0], i[1], r, pointcoordinates)]
        return (output)
    })

    // create a svg for each line
    const linesImg = lines.map((i) => {

        // retrieve the identity of the origin and end nodes
        let endNode = i[0][1]
        let coor = i[1] 

        let endShape = shapes[endNode];

        let diamondString = diamondStr[endNode]
        let triangleString = triangleStr[endNode]
        
        // retrieve coordinates for the main line
        const start = coor[0];
        let endNodeCenter = coor[1];
        const end = endShape === 'diamond' ? getIntersectionDiamond(start[0], start[1], endNodeCenter[0], endNodeCenter[1], diamondString[0]) :
        endShape === 'triangle' ? getIntersectionTriangle(start[0], start[1], endNodeCenter[0], endNodeCenter[1], triangleString[0]) :
        coor[1];
        // coordinates for the arrow tips
        const [rightTipX, rightTipY, leftTipX, leftTipY] = makeArrow(start, end, theta, arrowLength);

        // compute visibility
        const visibility = metaVisibility === 'hidden' ? 'hidden' : 'visible';

        return (
            <> <line x1={start[0]} y1={start[1]} x2={end[0]} y2={end[1]} visibility={visibility}
                stroke="black" strokeWidth="2" />
                <line x1={end[0]} y1={end[1]} x2={rightTipX} y2={rightTipY} visibility={visibility}
                    stroke="black" strokeWidth="2" />
                <line x1={end[0]} y1={end[1]} x2={leftTipX} y2={leftTipY} visibility={visibility}
                    stroke="black" strokeWidth="2" /> </>
        )

    })


    // text coordinate adjustment
    const textAdjustment = {'triangle': 6, 'square': 0, 'circle': 0, 'diamond': 0, 'pentagon': 0};

    // // generate the svg content for each node (including the corresponding wire and arrow tips)

    // generate the shape of the nodes
    const nodesArray = ['a', 'b', 'c', 'd', 'g', 'e'].map((i)=>{
        let color = colors[i];
        let wired = wiring[i];
        let shape = shapes[i];
        let strDiamond = diamondStr[i];
        let strTriangle = triangleStr[i];
        let strPentagon = pentagonStr[i];
        let [x,y] = pointcoordinates[i];


        let visible = metaVisibility === 'hidden' ? 'hidden' :
        (wired ? "visible" : "hidden");
       
        const output =  shape === "diamond" ?
        <polygon points={strDiamond[1]} fill={color} visibility={visible}
            stroke="black" strokeWidth={circleWidth} /> :
        shape === 'circle' ?
            <circle cx={x} cy={y} r={r} fill={color} visibility={visible}
                stroke="black" strokeWidth={circleWidth} /> :
            shape === 'square' ?
                <rect x={x - r} y={y - r} width={2 * r} height={2 * r} fill={color} visibility={visible}
                    stroke="black" strokeWidth={circleWidth} /> :
                shape === 'triangle' ?
                    <polygon points={strTriangle[1]} fill={color} visibility={visible}
                        stroke="black" strokeWidth={circleWidth} /> : 
                        shape === 'pentagon' ?
                        <polygon points={strPentagon[1]} fill={color} visibility={visible}
                        stroke="black" strokeWidth={circleWidth} /> : NaN;
                        

        return([i,output])

    })

    // transform the nodes array into a dictionary
    const nodes = {};
    nodesArray.forEach(([key, value]) => {
        nodes[key] = value;
    });


    // generate svg for each node
    const nodeImgs = ['a', 'b', 'c', 'd', 'g', 'e'].map((i)=>{
        let x = pointcoordinates[i][0];
        let y = pointcoordinates[i][1];
        let wired = wiring[i];
        let visible = metaVisibility === 'hidden' ? 'hidden' :
        (wired ? "visible" : "hidden");
        return(
            <>
            {nodes[i]}
            <text x={x} y={y + textAdjustment[shapes[i]] + .45 * r} fontSize={1.3 * r}
            textAnchor='middle' visibility={visible}
            fill={texts[i] === '?' ? 'black' :
                (states[i] ? "white" : "black")}
        >{texts[i]}</text>
            </>
        )
        
    })
    

    let svgWidth2 = svgWidth;

    // collect all the svg contents into an svg
    const img = <svg height={svgHeight} width={svgWidth2}
        xmlns="http://www.w3.org/2000/svg">
       {linesImg}
        {nodeImgs}       

    </svg>;

    // return the svg
    return (img)

}

export default Image;