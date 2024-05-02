// This component displays the instructions
// Technically it is several components (one for each page), nested within one big component
// (there migth be more elegant ways to handle this).

// import external components and methods
import { textStyle, buttonStyle } from './dimensions';
import { useState, useEffect } from 'react';
import { makeMachine } from './CausalRule';
import './Instructions.css';
import Image from './Image';
import { condition, defaultContent, shapeAssignment } from './randomized-parameters';


// the main component
const Instructions = (props) => {

    //keeps track of the current page
    const [trialNumber, setTrialNumber] = useState(0);

    //update the page number
    const incrementTrial = () => {
        setTrialNumber((a) => a + 1);
    }

    // import colors
    const colors = props.colors;

    //the props we will pass on to each page
    const tutorialProps = {
        setCurrentPhase: props.setCurrentPhase,
        incrementTrial: incrementTrial,
        colors: colors
    };



    //the list of pages (add more as you see fit)
    const instructionTrials = [
        <TaskTutorialOne {...tutorialProps} />,
        <TaskTutorialTwo {...tutorialProps} />,
        <TaskTutorialThree {...tutorialProps} />
        // etc
    ]
    //display the current page
    return (
        instructionTrials[trialNumber]
    )

}

const TaskTutorialOne = (props) => {

    // make sure the participant starts at the top of the page
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const handleClick = () => {
        props.incrementTrial()
    };

    // the characteristics of the machines

    const trialContent = [
        defaultContent,
        defaultContent,
        { ...defaultContent, EState: 1 }
    ];


    const defaultShapes = {
        'a': 'diamond', 'b': 'diamond', 'c': 'diamond',
        'd': 'diamond', 'g': 'diamond', 'e': 'diamond'
    }

    const ms = trialContent.map((i) => {
        return (makeMachine(i, props.colors, condition))
    });


    const r = 30;
    const text = <span>
        <p style={{ color: "red" }}>(Please do not refresh the page during the study -- you would be unable to complete the experiment)</p>
        <br></br>
        <p>Thank you for taking part in this study. </p>
        <p>In this experiment, you will investigate simple machines.</p>
        <p>These machines are composed of basic units, called nodes:</p>
    </span>;

    const img1 = <Image
        colors={ms[0].colors}
        wiring={ms[0].wiring}
        states={ms[0].states}
        connections={ms[0].connections}
        shapes={defaultShapes}
        texts={['', '', '', '', '']}
        r={r}

    />



    const text2 = <span>
        <p>A node can be in different states: for example this node can be either <span style={{ color: 'orange' }}><b>ON</b></span> or <b>OFF</b>.</p>
    </span>;

    const img2 = <Image

        colors={{ ...ms[1].colors, e: 'orange' }}
        wiring={ms[1].wiring}
        states={ms[1].states}
        connections={ms[1].connections}

        shapes={defaultShapes}
        texts={['', '', '', '', '']}
        r={r}
    />

    const img3 = <Image

        colors={ms[2].colors}
        wiring={ms[2].wiring}
        states={ms[2].states}
        connections={ms[2].connections}

        shapes={defaultShapes}
        texts={['', '', '', '', '']}
        r={r}


    />

    const nextPageButton = <button style={buttonStyle} onClick={() => handleClick()}>Next</button>

    return (
        <div style={textStyle}>
            <br></br>
            {text}
            {img1}
            {text2}
            <div className="instContainer" style={{}}>
                {img2}
                {img3}
            </div>
            <br></br>
            {nextPageButton}
            <br></br>
        </div >
    )

}


const TaskTutorialTwo = (props) => {

    // make sure the participant starts at the top of the page
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const handleClick = () => {
        //props.setCurrentPhase("training")
        props.incrementTrial()
    };

    const r = 20;

    // import colors
    const colors = props.colors;


    const trialContent = condition === 1 ? [
        { ...defaultContent },
        { ...defaultContent, BWired: 1, BState: 0 },
        { ...defaultContent, BWired: 1, BState: 1 },
        { ...defaultContent, BWired: 1, BState: 1, DWired: 1, DState: 0 },
        { ...defaultContent, BWired: 1, BState: 1, DWired: 1, DState: 1 }
    ] :
        condition === 2 ? [
            { ...defaultContent },
            { ...defaultContent, DWired: 1, DState: 0 },
            { ...defaultContent, DWired: 1, DState: 1 },
            { ...defaultContent, DWired: 1, DState: 1, BWired: 1, BState: 0 },
            { ...defaultContent, DWired: 1, DState: 1, BWired: 1, BState: 1 }
        ] : NaN;


    // machine illustrating generation
    const mgs = trialContent.slice(0, 3).map((i) => {
        return (makeMachine(i, colors, condition))
    })
        ;
    // machine illustrating prevention
    const mps = trialContent.slice(3, 5).map((i) => {
        return (makeMachine(i, colors, condition))
    })




    // default shapes and colors
    const defaultShapes = {
        'a': shapeAssignment[0], 'b': shapeAssignment[0],
        'c': shapeAssignment[1], 'd': shapeAssignment[1],
        'g': 'diamond', 'e': 'circle'
    };

    let shapeGenerative = condition === 1 ? shapeAssignment[0] :
        condition === 2 ? shapeAssignment[1] :
            NaN;

    let shapePreventative = condition === 1 ? shapeAssignment[1] :
        condition === 2 ? shapeAssignment[0] :
            NaN;

    let colorGenerative = condition === 1 ? mgs[2].colors.b :
        condition === 2 ? mgs[2].colors.d :
            NaN;

    let colorPreventative = condition === 1 ? mps[1].colors.d :
        condition === 2 ? mps[1].colors.b :
            NaN;

    // text explaining how machines work
    const text1 = <span>
        <p>Nodes can be wired together to form a larger machine.
            The state of the node at the origin of the arrow can influence the state of the node at the end of the arrow.</p>
    </span>;

    const textGen = <p> When a <b>{shapeGenerative}</b> node is <b><span style={{ color: colorGenerative }}>ON</span></b> it
        can make another node turn <b><span style={{ color: 'orange' }}>ON</span></b>:</p>


    // images of the machines

    // generative node, unwired
    const imgGenUnwired = <Image
        states={mgs[0].states}
        wiring={mgs[0].wiring}
        connections={mgs[0].connections}

        texts={['', '', '', '']}
        r={r}
        colors={mgs[0].colors}


        shapes={defaultShapes}


    />;

    // generative node, wired, inactive
    const imgGenWiredOff = <Image

        colors={mgs[1].colors}
        states={mgs[1].states}
        wiring={mgs[1].wiring}
        connections={mgs[1].connections}

        texts={['', '', '', '']}
        r={r}

        shapes={defaultShapes}


    />;

    // generative node, wired
    const imgGenWired = <Image

        colors={mgs[2].colors}
        states={mgs[2].states}
        wiring={mgs[2].wiring}
        connections={mgs[2].connections}

        texts={['', '', '', '']}
        r={r}

        shapes={defaultShapes}

    />;



    // preventative node, wired, inactive
    const imgPrevWiredOff = <Image

        colors={mps[0].colors}

        states={mps[0].states}
        wiring={mps[0].wiring}
        connections={mps[0].connections}

        texts={['', '', '', '']}
        r={r}

        shapes={defaultShapes}

    />;

    // preventative node, wired
    const imgPrevWired = <Image

        colors={mps[1].colors}
        states={mps[1].states}
        wiring={mps[1].wiring}
        connections={mps[1].connections}

        texts={['', '', '', '']}
        r={r}

        shapes={defaultShapes}


    />;


    const textPrev = <p>But if a <b>{shapePreventative}</b> node is <b><span style={{ color: colorPreventative }}>ON</span></b> it can make another node turn <b>OFF</b>:</p>


    const [generativeResponse, setGenerativeResponse] = useState('');
    const [preventativeResponse, setPreventativeResponse] = useState('');
    const [correctResponses, setCorrectResponses] = useState('');
    const [buttonVisibility, setButtonVisibility] = useState('hidden');
    const [checkVisibility, setCheckVisibility] = useState('visible');

    const handleQuestionGen = (e) => {
        setGenerativeResponse(e.target.value)

    };

    const handleQuestionPrev = (e) => {
        setPreventativeResponse(e.target.value)

    };

    const handleCheck = (e) => {
        if (generativeResponse === 'on' & preventativeResponse === 'off') {
            setCorrectResponses(<p style={{ color: 'green' }}>Correct!</p>)
            setButtonVisibility('visible')
            setCheckVisibility('hidden')

        } else { setCorrectResponses(<p style={{ color: 'red' }}>Incorrect, please try again.</p>) }
    }


    const questionText = <p>Please answer the following questions to make sure you understand:</p>

    const questionGenerative = <p>If a <b>{shapeGenerative}</b> is <b><span style={{ color: colorGenerative }}>ON</span></b> and
        is connected to another node:</p>

    const questionPreventative = <p>If a <b>{shapePreventative}</b> is <b><span style={{ color: colorPreventative }}>ON</span></b> and
        is connected to another node:</p>


    const inputElements = [
        <>
            <input type="radio" id="genOn" name="question" value="on" className="radio" />
            <label for="genOn">it can make it turn on</label><br /><br />
        </>,
        <>
            <input type="radio" id="genOff" name="question" value="off" className="radio" />
            <label for="genOff">it can make it turn off</label><br /><br />
        </>,
        <>
            <input type="radio" id="genNd" name="question" value="nd" className="radio" />
            <label for="genNd">it will have no effect</label><br /><br />
        </>,
        <>
            <input type="radio" id="prevOn" name="question" value="on" className="radio" />
            <label for="prevOn">it can make it turn on</label><br /><br />
        </>,
        <>
            <input type="radio" id="prevOff" name="question" value="off" className="radio" />
            <label for="prevOff">it can make it turn off</label><br /><br />
        </>,
        <>
            <input type="radio" id="prevNd" name="question" value="nd" className="radio" />
            <label for="prevNd">it will have no effect</label><br /><br />
        </>

    ]



    // the html multiple-choice response form
    const inputFormGen = <form onChange={(e) => handleQuestionGen(e)}>
        {inputElements[[0]]}
        {inputElements[[1]]}
        {inputElements[[2]]}
    </form >;

    const inputFormPrev = <form onChange={(e) => handleQuestionPrev(e)}>
        {inputElements[[3]]}
        {inputElements[[4]]}
        {inputElements[[5]]}
    </form >

    // const text3 = <p>In the next page we will show you a machine with three nodes. We will show you how the value of the circle node changes as a function of the value of the nodes it is connected to. </p>

    // the 'check your answers' button
    const checkButton = <button style={{ ...buttonStyle, visibility: checkVisibility }} onClick={() => handleCheck()}>Check your answers</button>;

    // next page button
    const nextPageButton = <button style={{ ...buttonStyle, visibility: buttonVisibility }} onClick={() => handleClick()}>Next</button>

    return (
        <div style={textStyle}>
            <br></br>
            {text1}
            {textGen}
            <div className='instructionsContainer'>
                {imgGenUnwired}
                {imgGenWiredOff}
                {imgGenWired}
            </div>

            {textPrev}
            <div className='instructionsContainer'>
                {imgPrevWiredOff}
                {imgPrevWired}
            </div>

            {questionText}
            {questionGenerative}
            {inputFormGen}
            {questionPreventative}
            {inputFormPrev}
            {checkButton}
            {correctResponses}
            {nextPageButton}
            <br></br>
        </div >
    )

}


const TaskTutorialThree = (props)=>{

    const handleClick = ()=>{
        props.setCurrentPhase('prediction')
    }
    // next page button
    const nextPageButton = <button style={{ ...buttonStyle }} onClick={() => handleClick()}>Next</button>

    return(
        <div style={textStyle}>
            <p>In the next pages, we will help you learn better how the nodes work.</p>
            <p>You will see a few different machines. Some of the nodes will be shown in grey, 
                and you will have to predict whether they are <b>ON</b> or <b>OFF</b>. </p>
            <p>Some of the nodes at the top are more or less likely to turn ON than others. 
                So, it is normal if some states of the machine appear more often than others! </p>
            {nextPageButton}
        </div>
    )
}


export default Instructions;