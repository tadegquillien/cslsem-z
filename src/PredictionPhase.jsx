
import { useState } from 'react';
import { textStyle, buttonStyle } from './dimensions';
import { predictionItems, shapeAssignment, hiddenNodes } from './randomized-parameters';
import Data from './Data';
import Image from './Image';
import { makeMachine } from './CausalRule';
import { shuffle } from './convenienceFunctions';
import './trainingPhase.css';


const PredictionPhase = (props) => {


    const colors = props.colors;

    // a scaling factor that controls the size of the image 
    // technically 'r' refers to the radius of a node, and all other dimensions
    // are multiples of this
    const r = 30;


    // import the trial data
    const trialData = predictionItems[props.trainingNumber]
    // make the machine
    const m = makeMachine(trialData, colors, props.condition)

    // we want to determine whether the B or the D node is hidden
    // if only one of them is wired, then it's the one that's hidden
    // otherwise, we import the information from an array that is the same size
    // as the predictionItems array
    const upperHiddenNode = (m.wiring.b & !m.wiring.d) ? 'b' :
        (!m.wiring.b & m.wiring.d) ? 'd' : hiddenNodes[props.trainingNumber];


    let initialBknown = upperHiddenNode === 'b' ? 0 : 1;
    let initialDknown = upperHiddenNode === 'd' ? 0 : 1;

    // is the state of E shown to the participant?
    const [Eknown, setEknown] = useState(0);
    const [Bknown, setBknown] = useState(initialBknown);
    const [Dknown, setDknown] = useState(initialDknown);

    // a text string showing the participant's prediction
    const [pred, setPred] = useState(<p style={{ visibility: "hidden" }}>hello</p>);

    // are the prediction buttons clickable or disabled?
    const [predButtonStateUp, setPredButtonStateUp] = useState(1);
    const [predButtonStateLow, setPredButtonStateLow] = useState(1);
    // which prediction button has been clicked on?
    const [chosenButtonUp, setChosenButtonUp] = useState(0);
    const [chosenButtonLow, setChosenButtonLow] = useState(0);



    // manages what happens when we click on the next-page button
    const handleClick = () => {
        // increment the training number so as to go to the next page
        props.incrementTraining(props.trainingNumber)
    }

    // manages what happens when we click on a prediction button


    const handlePredUp = (response) => {
        // Reveal the state of the hidden node
        setBknown(1);
        setDknown(1);
        // compute whether the participant's prediction was correct
        let correct = (m.states[upperHiddenNode] === 1 & response == "On") | (m.states[upperHiddenNode] === 0 & response == "Off");
        // adjust the text accordingly
        setPred(<p>You predicted <b>{response}</b>. {correct ? <span style={{color: 'green'}}>You are correct!</span> :
            <span style={{color: 'red'}}>The correct answer was
                actually <b>{m.states[upperHiddenNode] == 1 ? "On" : "Off"}</b> </span>}</p>);
        // disable the prediction buttons
        setPredButtonStateUp(0);
        // identify which button was clicked (so we hide the other)
        setChosenButtonUp(response);
        // increment the counters
        props.setCounterCorrect((a) => a + correct);
        props.setCounterTotal((a) => a + 1);
        // record the data
        Data.training.push({
            'trialNumber': props.trainingNumber,
            'states': m.states,
            'wiring': m.wiring,
            'colors': m.colors,
            'targetNode': upperHiddenNode,
            'prediction': response,
            'correct': correct,
            'condition': props.condition,
        });
    }

    const handlePredLow = (response) => {
        // Reveal the state of E
        setEknown(1);
        // compute whether the participant's prediction was correct
        let correct = (m.states.e === 1 & response == "On") | (m.states.e === 0 & response == "Off");
        // adjust the text accordingly
        setPred(<p>You predicted <b>{response}</b>. {correct ? <span style={{color:'green'}}>You are correct!</span> :
            <span style={{color:'red'}}>The correct answer was
                actually <b>{m.states.e == 1 ? "On" : "Off"}</b> </span>}</p>);
        // disable the prediction buttons
        setPredButtonStateLow(0);
        // identify which button was clicked (so we hide the other)
        setChosenButtonLow(response);
        // increment the counters
        props.setCounterCorrect((a) => a + correct);
        props.setCounterTotal((a) => a + 1);
        // record the data
        Data.training.push({
            'trialNumber': props.trainingNumber,
            'states': m.states,
            'wiring': m.wiring,
            'colors': m.colors,
            'targetNode': 'e',
            'prediction': response,
            'correct': correct,
            'condition': props.condition,
        });
        console.log(Data)
    }

    // a pair of buttons that allow participants to make their predictions
    const predictionButtonOnUpper = <button style={{
        ...buttonStyle,
        width: '50px',
        height: '50px',
        backgroundColor: colors[upperHiddenNode].on,
        cursor: predButtonStateUp ? 'pointer' : 'default',
        visibility: chosenButtonUp == 0 ? 'visible' :
            (chosenButtonUp == 'On' ? 'visible' : 'hidden')
    }}
        disabled={1 - predButtonStateUp}
        onClick={() => handlePredUp("On")}>On</button>;

    const predictionButtonOffUpper = <button style={{
        ...buttonStyle,
        // width: '6vw',
        // height: '4.5vw',
        width: '50px',
        height: '50px',
        backgroundColor: colors[upperHiddenNode].off,
        cursor: predButtonStateUp ? 'pointer' : 'default',
        visibility: chosenButtonUp == 0 ? 'visible' :
            (chosenButtonUp == 'Off' ? 'visible' : 'hidden')

    }} disabled={1 - predButtonStateUp}
        onClick={() => handlePredUp("Off")} > Off</ button>;

    const predictionButtonOnLower = <button style={{
        ...buttonStyle,
        width: '50px',
        height: '50px',
        backgroundColor: colors.e.on,
        cursor: predButtonStateLow ? 'pointer' : 'default',
        visibility: !m.wiring.e ? 'hidden' :
        chosenButtonLow === 0 ? 'visible' :
            (chosenButtonLow == 'On' ? 'visible' : 'hidden')
    }}
        disabled={1 - predButtonStateLow}
        onClick={() => handlePredLow("On")}>On</button>;

    const predictionButtonOffLower = <button style={{
        ...buttonStyle,
        width: '50px',
        height: '50px',
        backgroundColor: colors.e.off,
        cursor: predButtonStateLow ? 'pointer' : 'default',
        visibility:  !m.wiring.e ? 'hidden' :
        chosenButtonLow === 0 ? 'visible' :
            (chosenButtonLow == 'Off' ? 'visible' : 'hidden')
    }}
        disabled={1 - predButtonStateLow}
        onClick={() => handlePredLow("Off")}>Off</button>;

    // a text informing participants of their progress
    const text = <p>This is page {props.trainingNumber + 1}/{predictionItems.length}. You have
        answered {props.counterCorrect}/{props.counterTotal} questions
        correctly.
    </p>;

    const questionText = <p>Do you think the nodes marked with a '?' are on or off? </p>
    const textUpper = <p><b>{upperHiddenNode === 'b' ? shapeAssignment[0] : shapeAssignment[1]}</b>: &nbsp; </p>;
    const textLower = <p style={{visibility: m.wiring.e ? 'visible' : 'hidden'}}><b>circle: &nbsp;</b></p>

    // the next-page button (appears once the participant made their prediction)
    const nextPageButton = <button style={{
        ...buttonStyle,
        visibility: m.wiring.e ? 
        (Eknown & Bknown & Dknown ? 'visible' : 'hidden') :
        ((Dknown & Bknown ) ? 'visible' : 'hidden')
    }} onClick={() => handleClick()}>Next</button>;

    
    // Give colors to the nodes according to their logical state

    const dynColorB = Bknown === 1 ?
        (m.states.b ? colors.b.on : colors.b.off) : "lightgrey";

    const dynColorD = Dknown === 1?
        (m.states.d ? colors.d.on : colors.d.off) : 'lightgrey';

    const dynColorE = Eknown === 1 ?
        (m.states.e ? colors.e.on : colors.e.off) : "lightgrey";


    // displays a '?' inside the hidden nodes when their state is unknown
    const Btext = Bknown ? "" : "?";
    const Dtext = Dknown ? "" : "?";
    const Etext = Eknown ? "" : "?";

    // compute the shape of generative nodes
    const generativeShape = props.condition === 1 ? shapeAssignment[0] : shapeAssignment[1]


    // graphical display of the machine
    const img = <Image
        wiring={m.wiring}
        states={m.states}
        connections={m.connections}
        colors={{ ...m.colors, 'b': dynColorB, 'd': dynColorD,'e': dynColorE }}
        shapes={{
            'a': shapeAssignment[0], 'b': shapeAssignment[0], 'c': shapeAssignment[1],
            'd': shapeAssignment[1], 'g': generativeShape,
            'e': 'circle'
        }}
        texts={{
            'a': '',
            'b': Btext,
            'c': '',
            'd': Dtext,
            'e': Etext,
            'g': ''
        }}
        r={r}

    />;

    // collect the things to be displayed
    const toBeReturned =

        <div style={textStyle}
        >
            {text}
            {questionText}
            <div className='a'>
                <div className='b' >{textUpper}</div>
                <div className='b' >
                    {predictionButtonOnUpper}
                </div>
                <div className='b' style={{ color: 'white' }}>  "" </div>
                <div className='b'>
                    {predictionButtonOffUpper}
                </div>
                <div className='b' style={{ color: 'white' }}>  "" </div>

                <div className='b' >{textLower}</div>
                <div className='b' >
                    {predictionButtonOnLower}
                </div>
                <div className='b' style={{ color: 'white' }}>  "" </div>
                <div className='b'>
                    {predictionButtonOffLower}
                </div>
            </div>


            {pred}
            {nextPageButton}
            {img}

        </div>

    return (
        <div>        {toBeReturned}
        </div>
    )
}

export default PredictionPhase;