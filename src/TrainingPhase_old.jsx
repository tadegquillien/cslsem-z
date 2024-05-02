import { useState } from 'react';
import { textStyle, buttonStyle } from './dimensions';
import { trainingItems } from './randomized-parameters';
import Data from './Data';
import Image from './Image';
import { causalRule, giveColors } from './CausalRule';
import './trainingPhase.css';


const TrainingPhase = (props) => {

    
    const colors = props.colors;

    // a scaling factor that controls the size of the image 
    // technically 'r' refers to the radius of a node, and all other dimensions
    // are multiples of this
    const r = 30;

    // is the state of E shown to the participant?
    const [Eknown, setEknown] = useState(0);

    // a text string showing the participant's prediction
    const [pred, setPred] = useState(<p style={{ visibility: "hidden" }}>hello</p>);

    // are the prediction buttons clickable or disabled?
    const [predButtonState, setPredButtonState] = useState(1);
    // which prediction button has been clicked on?
    const [chosenButton, setChosenButton] = useState(0);

    // manages what happens when we click on the next-page button
    const handleClick = () => {
        // increment the training number so as to go to the next page
        props.incrementTraining(props.trainingNumber)
    }

    // manages what happens when we click on a prediction button
    const handlePred = (response) => {
        // Reveal the state of E
        setEknown(1);
        // compute whether the participant's prediction was correct
        let correct = (EState == 1 & response == "On") | (EState == 0 & response == "Off");
        // adjust the text accordingly
        setPred(<p>You predicted <b>{response}</b>. {correct ? "You are correct!" :
            <span>The correct answer was
                actually <b>{EState == 1 ? "On" : "Off"}</b> </span>}</p>);
        // disable the prediction buttons
        setPredButtonState(0);
        // identify which button was clicked (so we hide the other)
        setChosenButton(response);
        // increment the counters
        props.setCounterCorrect((a) => a + correct);
        props.setCounterTotal((a) => a + 1);
        // record the data
        Data.training.push({
            'trialNumber': props.trainingNumber,
            'AState': AState,
            'BState': BState,
            'CState': CState,
            'AWired': AWired,
            'BWired': BWired,
            'CWired': CWired,
            'EState': EState,
            'prediction': response,
            'correct': correct,
            'condition': props.condition,
            'Acolor': Acolor
        });
    }

    // a pair of buttons that allow participants to make their predictions
    const predictionButtonOn = <button style={{
        ...buttonStyle,
        width: '50px',
        height: '50px',
        backgroundColor: colors.Eon,
        cursor: predButtonState ? 'pointer' : 'default',
        visibility: chosenButton == 0 ? 'visible' :
            (chosenButton == 'On' ? 'visible' : 'hidden')
    }}
        disabled={1 - predButtonState}
        onClick={() => handlePred("On")}>On</button>;

    const predictionButtonOff = <button style={{
        ...buttonStyle,
        // width: '6vw',
        // height: '4.5vw',
        width: '50px',
        height: '50px',
        backgroundColor: colors.Eoff,
        cursor: predButtonState ? 'pointer' : 'default',
        visibility: chosenButton == 0 ? 'visible' :
            (chosenButton == 'Off' ? 'visible' : 'hidden')

    }} disabled={1 - predButtonState}
        onClick={() => handlePred("Off")} > Off</ button>;

    // a text informing participants of their progress
    const text = <p>This is question number {props.trainingNumber}/{trainingItems.length}. You have
        answered {props.counterCorrect}/{props.counterTotal} questions
        correctly.
    </p>;

    const questionText = <p>Do you think the node marked with a '?' is on or off? </p>

    // the next-page button (appears once the participant made their prediction)
    const nextPageButton = <button style={{
        ...buttonStyle,
        visibility: Eknown ? 'visible' : 'hidden'
    }} onClick={() => handleClick()}>Next</button>;

    // import the trial data
    const trialData = props.trainingNumber == 0 ? trainingItems[0] : trainingItems[props.trainingNumber-1];

    // The states of the exogenous components
    const AState = trialData.AState;
    const BState = trialData.BState;
    const CState = trialData.CState;

    // // whether the components are connected to the machine
    const AWired = trialData.AWired;
    const BWired = trialData.BWired;
    const CWired = trialData.CWired;


    // compute the state of node E
    const EStateNumeric = causalRule(props.condition, AState, BState, CState,
        AWired, BWired, CWired);
    const EState = (EStateNumeric > 0);


    // Give colors to the nodes according to their logical state
    const [Acolor, Bcolor, Ccolor] = giveColors(AState, BState, CState, EState, colors);
    const Ecolor = Eknown == 1 ?
        (EState ? colors.Eon : colors.Eoff) : "lightgrey";


    // displays a '?' inside the E node when its state is unknown
    const Etext = Eknown ? "" : "?";

    // graphical display of the machine
    const img = <Image
        AWired={AWired} BWired={BWired} CWired={CWired} Etext={Etext}
        Acolor={Acolor} Bcolor={Bcolor} Ccolor={Ccolor} Ecolor={Ecolor}
        r={r} AState={AState} BState={BState} CState={CState} EState={EState} mode={props.mode} use={'normal'} />;
    

    // This component controls what happens with trial 0, where we give participants an explicit 
    // description of the possible states of the causal system
    const Introduction = (props)=>{

        // the size of the nodes in the introductory trial
        const r_intro = 20;
        // import colors
        const colors=props.colors;

        // compute the default value of E
        const Edefault = causalRule(props.condition,
            1, 1, 1,
            0, 0, 0);

        // compute colors for the single-node machine
        const [Acolor, Bcolor, Ccolor, Ecolor] = giveColors(1,1,1,Edefault,colors);

        // compute the value of E when A=1
        const E_Aone = causalRule(props.condition,
            1, 1, 1,
            1, 0, 0);
        // compute colors for when A=1
        const [Acolor_Aone, Bcolor_Aone, Ccolor_Aone, Ecolor_Aone] = giveColors(1,1,1, E_Aone, colors);

        // compute the value of E when A=2
        const E_Atwo = causalRule(props.condition,
            2, 1, 1,
            1, 0, 0);
        // compute colors for when A=2
        const [Acolor_Atwo, Bcolor_Atwo, Ccolor_Atwo, Ecolor_Atwo] = giveColors(2,1,1, E_Atwo, colors);

        // compute the value of E when A=3
        const E_Athree = causalRule(props.condition,
            3, 1, 1,
            1, 0, 0);
        // compute colors for when A=3
        const [Acolor_Athree, Bcolor_Athree, Ccolor_Athree, Ecolor_Athree] = giveColors(3,1,1, E_Athree, colors);


        // text and picture presenting the single-node machine
        const textOne = <div>
            <p>This set of machines works in the following way.</p>
            <p>When the lower node is alone, or when it is connected to the upper node and the upper node is {Acolor_Aone}, 
            then the lower node is always <b>{Edefault == 0 ? 'OFF' : <span style={{color:'orange'}}>ON</span>}</b>:</p>

            <div className='trainingInstructionsContainer'>

            <div className='trainingInstructionsContained'><Image AWired={0} BWired={0} CWired={0} Etext={''}
        Acolor={Acolor} Bcolor={Bcolor} Ccolor={Ccolor} Ecolor={Ecolor} 
        r={r_intro} AState={1} BState={1} CState={1} EState={Edefault} mode={props.mode} use={'normal'} 
        /></div>
            
       <div className='trainingInstructionsContained'> <Image AWired={1} BWired={0} CWired={0} Etext={''}
        Acolor={Acolor_Aone} Bcolor={Bcolor_Aone} Ccolor={Ccolor_Aone} Ecolor={Ecolor_Aone} 
        r={r_intro} AState={1} BState={1} CState={1} EState={E_Aone} mode={props.mode} use={'normal'} 
        /></div>
            </div>
            
        </div>

        
        // text and picture presenting the situation with A=2
        const textTwo = <div>
            <p>When the upper node is {Acolor_Atwo} or {Acolor_Athree} and is connected to the lower node, the lower node is always <b>{E_Atwo == 0 ? 'OFF' : <span style={{color:'orange'}}>ON</span>}</b>:</p>
            <div className='trainingInstructionsContainer'>
                <div className='trainingInstructionsContained'><Image AWired={1} BWired={0} CWired={0} Etext={''}
        Acolor={Acolor_Atwo} Bcolor={Bcolor_Atwo} Ccolor={Ccolor_Atwo} Ecolor={Ecolor_Atwo} 
        r={r_intro} AState={2} BState={1} CState={1} EState={E_Atwo} mode={props.mode} use={'normal'} 
        /></div>
        <div className='trainingInstructionsContained'><Image AWired={1} BWired={0} CWired={0} Etext={''}
        Acolor={Acolor_Athree} Bcolor={Bcolor_Athree} Ccolor={Ccolor_Athree} Ecolor={Ecolor_Athree} 
        r={r_intro} AState={3} BState={1} CState={1} EState={E_Athree} mode={props.mode} use={'normal'} 
        /></div>
        </div>
            
        
        </div>


    // the text displayed at the bottom of the page, introducing the learning phase
    const outroText = <div><p>Please take a moment to understand the information above. <br></br>
    In the next pages, we will help you learn this information better by asking you to play a simple prediction task.</p>
    <p>Please try to be as accurate as you can!</p></div>


    // manages what happens when we click on the next-page button
    const handleClick = () => {
        // increment the training number so as to go to the next page
        props.incrementTraining(props.trainingNumber)
    }

    // the next-page button
    const nextPageButton = <button style={{
        ...buttonStyle,
    }} onClick={() => handleClick()}>Start the prediction task</button>;

    return(
        <div style={{...textStyle, alignItems: 'none'}}>
            <br></br>
            {textOne}
            {textTwo}
            {outroText}
            {nextPageButton}
            <br></br>
        </div>
    )
    }

        // controls which jsx content is passed to return.
        // in trial 0, return the Introduction trial,
        // otherwise return a normal learning trial
        const toBeReturned = props.trainingNumber == 0 ?
         <Introduction incrementTraining={props.incrementTraining} 
        trainingNumber={props.trainingNumber}
        colors={colors} mode={props.mode}
        condition={props.condition}
        /> : 
        <div style={textStyle}
        >
            {text}
            {questionText}
            <div className='a'>
                <div className='b' >
                    {predictionButtonOn}
                </div>
                <div className='b' style={{ color: 'white' }}>  "" </div>
                <div className='b'>
                    {predictionButtonOff}
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

export default TrainingPhase;