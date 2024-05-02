

// this script contains functions that determine the state and colors of a machine


// the causal rule

// the abstract causal rule is always the same: denoting the generator nodes as Gi and the preventative nodes as Pi, we have
// E := 0 v Sum(G1Wired*G1, ..., GnWired*Gn)Product(1-P1Wired*P1, ..., 1-PnWired*Pn)
// where XiWired means that X is a direct parent of E (is wired into E), and Xi denotes the state of X
// in words: E is 1 if it is connected to at least one active G node, and is NOT connected to a P node that is on. E is 0 otherwise. 

// we make a tiny exception to that rule for preventative nodes. If a preventative node only has preventative parents, and they are all OFF,
// then the state of the node will be df(P), i.e. a pre-specified default value.


import { filterNaN, sum } from "./convenienceFunctions";

// this function computes the state of a node given the state of its parent variables,
// and the experimental condition
export const causalRule = (condition, states, target, connections) => {

    // list of generative and preventative nodes
    let genNodes = condition === 1 ? ['a', 'b', 'g'] : ['c', 'd', 'g'];
    let prevNodes = condition === 1 ? ['c', 'd'] : ['a', 'b'];

    // select the parents of the target
    // (note that this automatically select only the parents that are wired)
    let parents = connections.map((i) => {
        // if the target is marked as the child in a relationship, return the corresponding parent
        let output = i[1] === target ? i[0] : NaN;
        return (output)
    })

    // remove the NaN
    parents = filterNaN(parents);

    // retrieve generative parents
    let genParents = parents.filter(item => genNodes.includes(item));
    let prevParents = parents.filter(item => prevNodes.includes(item));

    // so far we have a list of letters telling us the identity of the generative and preventative
    // parents. next we need to know their states
    let genParentsStates = genParents.map((i) => {
        return (states[i])
    });

    let prevParentsStates = prevParents.map((i) => {
        return (states[i])
    });

    // the outcome happens iff there is at least one generative node and no preventative node 
    // among the parents (although we also allow for a variable to be `self-generated' if it has only preventative inactive parents)
    let outcome = 
    parents.length === 0 ? states[target] : // if the target variable has no parent, return its pre-specified state
    genParents.length === 0 ?
     states[target]*(sum(prevParentsStates)===0) : // if no generative parent, return pre-specified value unless there are preventers
    (sum(genParentsStates) > 0) & sum(prevParentsStates) === 0; // otherwise, compute its value as a function of its parents
    return (outcome);

}



// this function maps states of the nodes to colors
export const giveColors = (states, colors) => {

    let output = ['a', 'b', 'c', 'd', 'g', 'e'].map((i) => {
        return ([i, states[i] ? colors[i].on : colors[i].off])
    });

    return (output)

}




// this function takes as input the features of a given machine, does some processing
// on these features (computes colors, and the value of nodes with parents), and returns the features
// plus the newly computed information
export const makeMachine = (content, colors, condition) => {

    // extract states and wiring
    let states = {
        'a': content.AState,
        'b': content.BState,
        'c': content.CState,
        'd': content.DState,
        'g': content.GState,
        'e': 0
    }

    let wiring = {
        'a': content.AWired,
        'b': content.BWired,
        'c': content.CWired,
        'd': content.DWired,
        'g': content.GWired,
        'e': content.EWired
    };

    // compute the target node for node G
    let targetG = condition === 1 ? 'd' : 'b';

    // compute connections
    let connections = filterNaN([
        content.AWired ? ['a', 'b'] : NaN,
        content.BWired & content.EWired ? ['b', 'e'] : NaN,
        content.CWired ? ['c', 'd'] : NaN,
        content.DWired & content.EWired ? ['d', 'e'] : NaN,
        content.GWired ? ['g', targetG] : NaN
    ]);

    // compute the value of downstream nodes
    states.b = causalRule(condition, states, 'b', connections);
    states.d = causalRule(condition, states, 'd', connections);
    states.e = causalRule(condition, states, 'e', connections);


    // compute colors
    let processedColorsArray = giveColors(states, colors);
    let processedColors = {};
    // convert the colors array into an object
    processedColorsArray.forEach(([key, value]) => {
        processedColors[key] = value;
    });


    return (
        {

            'wiring': wiring,

            'states': states,

            'colors': processedColors,

            'text': content.text,

            'connections': connections
        }
    )
}