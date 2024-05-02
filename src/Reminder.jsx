// this component is used during the Test phase, and displays the
// different types of machines the participant saw during the Training phase

import {
    shapeAssignment, testMachines, condition, trialType10
} from "./randomized-parameters";
import { giveColors, causalRule, makeMachine } from "./CausalRule";
import Image from "./Image";
import './TestPhase.css';

const Reminder = (props) => {

    // import node colors
    const colors = props.colors;
    // the size of a node
    let r_reminder = 15;

    const machines = testMachines;

    const ms = machines.map((a)=>{
        return(
            makeMachine(a, colors, props.condition)
        )
    })

    // create an svg for each machine
    const images = [0].map((i) => {
        return (
            <Image
                wiring={ms[i].wiring}
                states={ms[i].states}
                colors={ms[i].colors}
                connections={ms[i].connections}
                shapes={{'AShape': shapeAssignment[0], 'BShape': 'circle', 'CShape': shapeAssignment[1], 
            'EShape': 'circle'}}
            r={r_reminder}
            texts={['','','', '']}

                />
        )
    });

    const machineDetails = {'AWired': 1, 
    'BWired': 0,
    'CWired': 1,
    'AState': 1,
    'BState': 0,
    'CState': 0,
    'text': 'textAnC'
    };

    const m = makeMachine(machineDetails, colors, condition);


    const causalVerbs = condition == 1 ? ['CAUSES', 'ALLOWS'] :
    condition == 2 ? ['ALLOWS', 'CAUSES'] : NaN;

    const ExplanationA = <p>The fact that the {shapeAssignment[0]} is <b><span style={{color: m.colors.Acolor}}>{m.colors.Acolor}</span></b> <b>{causalVerbs[0]}</b> the 
    circle to be <b><span style={{color: m.colors.Ecolor}}>ON</span></b>.</p>;

    const ExplanationC = <p>The fact that the {shapeAssignment[1]} is <b><span style={{color: m.colors.Ccolor}}>{m.colors.Ccolor}</span></b> <b>{causalVerbs[1]}</b> the 
    circle to be <b><span style={{color: m.colors.Ecolor}}>ON</span></b>.</p>;

    const machineDetails2 = {'AWired': 0,
    'BWired': 1,
    'CWired': 0,
    'AState': 0,
    'BState': 1,
    'CState': 0};

    const m2 = makeMachine(machineDetails2, colors, condition)
    


    // create an svg for each machine
    const images2 = [0].map((i) => {
        return (
            <Image


            wiring={m2.wiring}
                states={m2.states}
                colors={m2.colors}
                connections={m2.connections}
                shapes={{'AShape': shapeAssignment[0], 'BShape': 'diamond', 'CShape': shapeAssignment[1], 
            'EShape': 'circle'}}
            r={r_reminder}
            texts={['','','', '']}


                />
        )
    });


    // the part to add to the output in the generalization trials
    const newMachineJSX = props.currentPhase === 'test' ? '' :
    props.currentPhase === 'test2' ? <span>
        <div className="reminderText">
            <p>Here is another observation you made before:</p>
        </div>
        <div className="reminderNodes">

            <span className='reminderContained2'> {images2[0]} </span>
        </div>
    </span> : NaN;

    // return a div
    return (<div className="reminderContainer">

        <div className="reminderText">
            <p>As a reminder, here is one observation you made before, and an explanation 
                of why the circle is <b><span style={{color: m.Ecolor}}>ON</span></b>.</p>

        </div>
        <div className="reminderNodes">

            <span className='reminderContained2'> {images[0]} </span>
        </div>
        {ExplanationA}
        {ExplanationC}
        {newMachineJSX}



    </div>);
};

export default Reminder;