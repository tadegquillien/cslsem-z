// this script controls what happens during the test phase

import { useState, useEffect } from 'react';
import { textStyle, buttonStyle } from './dimensions';
import {
    testItems, test2Items, questionOrder, shapeAssignment, focalLetters
} from './randomized-parameters';
import { makeMachine } from './CausalRule';
import Image from './Image';
import Data from './Data';
import Reminder from './Reminder';
import './TestPhase.css';

const TestPhase = (props) => {

    // ensure that each new trial starts at the top
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // import the node colors
    const colors = props.colors;

    // initialize the variable storing the participant's response
    const [response, setResponse] = useState(0);
    const [counterfactualResponse, setCounterfactualResponse] = useState(0);

    // the size of a node
    const r = 20;

    // manages what happens when a participant clicks on the next-page button
    const handleClick = () => {

        // stores relevant data to the Data object
        Data.responses.push(
            {
                trialNumber: questionNumber - 1,
                focalLetter: focalNode,
                states: m.states,
                wiring: m.wiring,
                colors: m.colors,
                condition: props.condition,
                response: response,
                counterfactualResponse: counterfactualResponse
                
            })
        console.log(Data);
        // increment the trial number so as to go to the next trial
        props.incrementTest(props.testNumber)
    }

    // the header
    const questionNumber = props.currentPhase === 'test' ? props.testNumber + 1 :
    props.currentPhase === 'test2' ? props.testNumber + testItems.length + 1 : NaN;
    const text = <p>This is question {questionNumber} / {testItems.length}.
    </p>;

    // import the trial data
    const trialData = props.currentPhase === 'test' ? testItems[props.testNumber] :
        props.currentPhase === 'test2' ? test2Items[props.testNumber] : NaN;

     // make the machine
     const m = makeMachine(trialData, colors, props.condition)

      // select the letter that the question is about
    const focalLetter = focalLetters[props.testNumber];
    const focalNode = focalLetter === 'X' ? 'a' : 
    focalLetter === 'Y' ? 'c' : 
    focalLetter === 'V' ? 'b' :
    focalLetter === 'Z' ? 'd' : NaN

    const focalColor = m.colors[focalNode] === 'white' ? 'black' : m.colors[focalNode] ;
    const focalState = m.states[focalNode] === 1 ? 'ON' : 'OFF';

    // select which letter is displayed
     let texts = {
        a: focalNode === 'a' ? 'X' : '',
        b: focalNode === 'b' ? 'V' : '',
        c: focalNode === 'c' ? 'Y' : '',
        d: focalNode === 'd' ? 'Z' : '',
        g: '',
        e: 'E'
    } ;
     
     
    //  props.testNumber < 2 ? {a: 'X', b: '', c: 'Y', d: '', g: '', e:'E'} :
    //  props.testNumber > 1 ? {a: '', b: 'V', c: '', d: 'Z', g: '', e:'E'} : NaN;

     // compute the shape of generative nodes
     const generativeShape = props.condition === 1 ? shapeAssignment[0] : shapeAssignment[1]

    // graphical display of the machine
    const img = <Image
        wiring={m.wiring} 
        states={m.states}
        connections={m.connections}
        colors={m.colors}
        shapes={{'a': shapeAssignment[0], 'b': shapeAssignment[0], 'c': shapeAssignment[1], 'd': shapeAssignment[1], 'g': generativeShape,
    'e': 'circle'}}
    texts={texts}
    r={r}
        />;

        

    // fill in variables in the question texts
    // (e.g. if E is on this should say so in the question)
    const Etext = m.states.e ? "ON" : "OFF";
    const EtextColor = m.states.e ? m.colors.e : 'black';
    const notEtext = m.states.e ? "OFF" : "ON";
    const notEtextColor = m.states.e ? "black" : m.colors.e;

    
   
   


    // this function updates the counterfactual response variable when the participant selects an option
    const handleCounterfactual = (e) => {
        setCounterfactualResponse(e.target.value);
    }

    const counterfactualState = m.states[focalNode] === 1 ? 'OFF' : 'ON';
    const counterfactualColor = counterfactualState === 'ON' ? colors[focalNode].on : 'black';
    // the text for the counterfactual question
    const counterfactualText = <p>If {focalLetter} was <span style={{color: counterfactualColor}}><b>{counterfactualState}</b></span>, what
     would be the state of E?</p>;

    // the multiple-choice response form for the counterfactual question
    const counterfactualForm = <form onChange={(e) => handleCounterfactual(e)}>
        <input type="radio" id="counterfactualOn" name="counterfactual" value="on" className="radio" />
            <label for="on"><b><span style={{color: m.colors.e}}>ON</span></b></label><br /><br />
            <input type="radio" id="counterfactualOff" name="counterfactual" value="off" className="radio" />
            <label for="off"><b>OFF</b></label><br /><br />
    </form >;
    

    // the question text
    const questionText = <p>Below are several possible explanations of why E is {Etext}. Please select
        the one that you think best describes what is happening.</p>

    // text for the different response options
    const options = [
        <span>The fact that {focalLetter} is <b><span style={{ color: focalColor }}>{focalState}</span></b>  <b>causes</b> E to
            be <b><span style={{ color: EtextColor }}>{Etext}</span></b></span>,
        <span>The fact that {focalLetter} is <b><span style={{ color: focalColor }}>{focalState}</span></b>  <b>allows</b> E to
            be <b><span style={{ color: EtextColor }}>{Etext}</span></b></span>,
        <span>The fact that {focalLetter} is <b><span style={{ color: focalColor }}>{focalState}</span></b>  <b>prevents</b> E
            from being <b><span style={{ color: notEtextColor }}>{notEtext}</span></b></span>
    ]


    // this function updates the response variable when the participant selects an option
    const handleQuestion = (e) => {
        setResponse(e.target.value);
    }


    // an array containing the html elements that make up the response form
    // we store them in an array so that we can display them in an arbitrary order
    // (to allow between-participants randomization)
    const inputElements = [
        <>
            <input type="radio" id="cause" name="question" value="cause" className="radio" />
            <label for="cause">{options[0]}</label><br /><br />
        </>,
        <>
            <input type="radio" id="allow" name="question" value="allow" className="radio" />
            <label for="allow">{options[1]}</label><br /><br />
        </>,
        <>
            <input type="radio" id="prevent" name="question" value="prevent" className="radio" />
            <label for="prevent">{options[2]}</label><br /><br />
        </>

    ]


    // the html multiple-choice response form
    const inputForm = <form onChange={(e) => handleQuestion(e)}>
        {inputElements[questionOrder[0]]}
        {inputElements[questionOrder[1]]}
        {inputElements[questionOrder[2]]}
    </form >;



    // the button leading to the next page;
    const nextPageButton = <button style={{...buttonStyle, visibility: (response===0 | counterfactualResponse === 0) ? 'hidden': 'visible' }}
    onClick={() => handleClick()}>Next</button>;

    return (
        <div style={textStyle}>
            {text}
            {/* <div
            > */}
                {/* a div with pictures of the previous machines */}
                {/* <Reminder condition={props.condition} colors={colors} mode={props.mode}
                currentPhase={props.currentPhase} /> */}
            {/* </div> */}

            <p>Consider the machine below:</p>
            {img}
            {counterfactualText}
            {counterfactualForm}
            {questionText}
            {inputForm}
            <br></br>
            {nextPageButton}

            <br></br>
        </div>

    )
}

export default TestPhase;