
import { shapeAssignment, condition } from './randomized-parameters';
import { makeMachine } from './CausalRule';
import Image from './Image';
import { textStyle, buttonStyle } from './dimensions';

const NewNode = (props)=>{

    const colors = props.colors;
    const text = <p>Here is a new machine:</p>;

    const machineDetails = {
    'AWired': 0, 
    'BWired': 1,
    'CWired': 0,
    'AState': 0,
    'BState': 1,
    'CState': 0,
    'text': 'textB'
    };

    const m = makeMachine(machineDetails, colors, condition);


    const img = <Image 
    
    wiring={m.wiring}
    states={m.states}
    colors={m.colors}
    connections={m.connections}
    shapes={{'AShape': shapeAssignment[0], 'BShape': 'diamond', 'CShape': shapeAssignment[1], 'EShape': 'circle'}}
    texts = {['','','','']}
    r={20}
    metaVisibility={'visible'}
                        
                        />;

    const text2 = <p>In the next pages we will ask you some more questions similar to the ones you just answered.</p>

    const nextPageButton = <button style={buttonStyle} onClick={() => props.setCurrentPhase('test2')}>Next</button>;

    return(
        <div style={textStyle}>
        {text}
        {img}
        {text2}
        {nextPageButton}
        </div>

    )
}

export default NewNode