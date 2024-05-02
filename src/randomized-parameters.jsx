// The goal of this file is to randomize the elements that need to be randomized once and 
// presented in the same order all throughout the experiment

// We need this because if we randomize an element within a component, the element will be re-randomized
// every time the component re-renders. By creating the element here and then exporting it to the relevant
// component, we avoid this issue.

// we import the shuffle function which will allow us to randomize arrays
import { shuffle, rep } from './convenienceFunctions';



// the condition: 1 means that A and B (the nodes on the left) are the generative node and C and D (right) are the preventative nodes, 
// 2 means the reverse 
export const condition = shuffle([1,2])[0];

//
// define the different machines that can be shown to participants
//

// default content. we define specific machines in terms of modifications to this default template
export const defaultContent = {
    'AWired': 0,
    'BWired': 0,
    'CWired': 0,
    'DWired': 0,
    'GWired': 0,
    'EWired': 1,
    'AState': 0,
    'BState': 0,
    'CState': 0,
    'DState': 0,
    'GState': 1,
    'text': 'someText'
}

export const defaultFullyWired = {
    ...defaultContent,
    AWired: 1, BWired: 1, CWired: 1, DWired: 1, GWired: 1,
    BState: 1, DState: 1
}

// single-node machine

export const trialType1 = {
    ...defaultContent,
    EWired: 0,
    AWired: 1, BWired: 1, AState: 1, GWired: condition === 2 ? 1 : 0
}

export const trialType2 = {
    ...defaultContent,
    EWired: 0,
    AWired: 1, BWired: 1, AState: 0, BState: 1, GWired: condition === 2 ? 1 : 0
}

export const trialType3 = {
    ...defaultContent,
    EWired: 0,
    CWired: 1, DWired: 1, CState: 1, GWired: condition === 1 ? 1 : 0
}

export const trialType4 = {
    ...defaultContent,
    EWired: 0,
    CWired: 1, DWired: 1, CState: 0, DState: 1, GWired: condition === 1 ? 1: 0
}

export const trialType5 = {
    ...defaultFullyWired, 
}


export const trialType6 = {
    ...defaultFullyWired,
    AState: 1, 
}

export const trialType7 = {
    ...defaultFullyWired,
    CState: 1,
}

export const trialType8 = {
    ...defaultFullyWired,
    AState: 1, CState: 1, GWired: 1
}




let predictionItems1 = shuffle(rep([
    trialType1, trialType2, trialType3, trialType4
], 4).flat());

let predictionItems2 = condition === 1 ? shuffle([rep(trialType5, 3), rep(trialType6, 10),
rep(trialType7, 2), rep(trialType8, 5)].flat()) :
    condition === 2 ? shuffle([rep(trialType5, 3), rep(trialType7, 10),
    rep(trialType6, 2), rep(trialType8, 5)].flat()) : NaN;

export const predictionItems = [predictionItems1, predictionItems2].flat()

// the hidden nodes that participants have to guess (in addition to E) in the prediction trials with the full machine
// we randomly choose either node B or node D
export const hiddenNodes = Array.from(Array(predictionItems.length).keys()).map((i)=>{
    return(shuffle(['b', 'd'])[0])
})



// put the test items together and export them

export const testItems = shuffle([trialType8, trialType8, trialType8, trialType8]);
export const test2Items = shuffle([trialType1])




// assign shape to A and C
export const shapeAssignment = shuffle(['triangle', 'square']);

// randomize whether the producer or the preventer is introduced first (in the training phase)
export const display_order = shuffle([0, 1])[0] ? [0, 1] : [1, 0];

// randomize the order of presentation of machines within a given trial (in the training phase)
// machines 0 and 1 (single-node and two-node machines) are always presented first and second,
// and we randomize the order of presentations of the three-node machines
export const display_order_within = shuffle(
    [0, 1, 2, 3]
);


let letterOrderingMain = shuffle([['X', 'Y'], ['Y', 'X']])[0];
let letterOrderingExploratory = shuffle([['V', 'Z'], ['Z', 'V']])[0];
const letterOrdering = letterOrderingMain.concat(letterOrderingExploratory);

export const focalLetters = testItems.map((i) => {
    return (letterOrdering)
}).flat();

// the machines we show as a Reminder during the test phase
export const testMachines = [trialType7];

// declare the colors
//

// the colors we will assign to on and off nodes
const offColor = 'white';
const onColors = shuffle(['purple', 'olive']);
const onColorE = 'orange';

// the color of the G node should match that of A and B in condition 1, 
// and that of C and D in condition 2
const generativeColor = condition === 1 ? onColors[0] : onColors[1];

// the first color set (for the first set of machines)
const colors = {
    'a': { 'on': onColors[0], 'off': offColor },
    'b': { 'on': onColors[0], 'off': offColor },
    'c': { 'on': onColors[1], 'off': offColor },
    'd': { 'on': onColors[1], 'off': offColor },
    'g': { 'on': generativeColor, 'off': offColor },
    'e': { 'on': onColorE, 'off': offColor }

};

// the second color set (this is a relic of an older implementation)
const colors2 = colors;

// put the two color sets together, and randomize them
export const colorSets = shuffle([colors, colors2]);

// the order of the response options
export const questionOrder = shuffle([0, 1, 2]);