
import { useState, useEffect } from 'react';
import { textStyle, buttonStyle } from './dimensions';
import { condition, shapeAssignment, display_order_within } from './randomized-parameters';
import Image from './Image';
import { causalRule,  makeMachine } from './CausalRule';
import './trainingPhase.css';


const TrainingPhase = (props) =>{
    
    //the props we will pass on to each page
    const trainingProps = {
        setCurrentPhase: props.setCurrentPhase,
        incrementTraining: props.incrementTraining,
        trainingNumber: props.trainingNumber,
        colors: props.colors
    };

    const trainingTrials = [
        <TrainingOne {...trainingProps} />,
        <TrainingTwo {...trainingProps} />
    ];

    //display the current page
    return (
        trainingTrials[props.trainingNumber]
    )
}

// This component introduces the causal rules to the participant, by way of examples
const TrainingOne = (props)=>{

        // ensure that each new trial starts at the top
        useEffect(() => {
            window.scrollTo(0, 0)
        }, [])

        // the size of the nodes 
        const r_intro = 20;
        // import colors
        const colors=props.colors;
        

        // the state of E for each machine

        const E_nAC = causalRule(condition,
            1, 0, 1,
            0, 0, 1) ? 'ON' : 'OFF';

        const E_AnC = causalRule(condition,
            1, 0,0,
            1, 0, 1
            ) ? 'ON' : 'OFF';

        const E_AC = causalRule(condition,
            1, 0, 1,
            1, 0, 1
            ) ? 'ON' : 'OFF';

        const E_nAnC = causalRule(condition,
            0, 1, 0,
            1, 0, 1
            ) ? 'ON' : 'OFF'
            

        // tbe explanatory texts that will be displayed with each machine:

        const textnAC = <p>When the {shapeAssignment[0]} is <b><span style={{color:colors.Aoff}}>{colors.Aoff}</span></b> and 
        the {shapeAssignment[1]} is <b><span style={{color:colors.Con}}>{colors.Con}</span></b>, the circle 
        is <span style={{color: E_nAC == 'ON' ? colors.Eon : 'black' }}><b>{E_nAC}</b></span>:</p>;

        const textAC = <p>When the {shapeAssignment[0]} is <b><span style={{color:colors.Aon}}>{colors.Aon}</span></b> and 
        the {shapeAssignment[1]} is <b><span style={{color:colors.Con}}>{colors.Con}</span></b>, the 
        circle is <span style={{color: E_AC == 'ON' ? colors.Eon : 'black' }}><b>{E_AC}</b></span>:</p>;

        const textAnC = <p>When the {shapeAssignment[0]} is <b><span style={{color:colors.Aon}}>{colors.Aon}</span></b> and 
        the {shapeAssignment[1]} is <b><span style={{color:colors.Coff}}>{colors.Coff}</span></b>, the 
        circle is <span style={{color: E_AnC == 'ON' ? colors.Eon : 'black' }}><b>{E_AnC}</b></span>:</p>;

        const textnAnC = <p>When the {shapeAssignment[0]} is <b><span style={{color:colors.Aoff}}>{colors.Aoff}</span></b> and 
        the {shapeAssignment[1]} is <b><span style={{color:colors.Coff}}>{colors.Coff}</span></b>, the 
        circle is <span style={{color: E_nAnC == 'ON' ? colors.Eon : 'black' }}><b>{E_nAnC}</b></span>:</p>;

      

        // the content of the training trials
        // this array contains N arrays, one for each screen of this phase
        // each array contains M objects, each object containing the features of a given machine
        const trialContent = [
            
                {'AWired': 1, 
            'BWired': 0,
            'CWired': 1,
            'DWired': 0,
            'AState': 0,
            'BState': 0,
            'CState': 1,
            'DState': 0,
            'text': textnAC
        },
                {'AWired': 1, 
            'BWired': 0,
            'CWired': 1,
            'DWired': 0,
            'AState': 1,
            'BState': 0,
            'CState': 1,
            'DState': 0,
            'text': textAC
        },
        {'AWired': 1, 
        'BWired': 0,
        'CWired': 1,
        'DWired': 0,
        'AState': 0,
        'BState': 0,
        'CState': 0,
        'DState': 0,
        'text': textnAnC
        },
        {'AWired': 1, 
            'BWired': 0,
            'CWired': 1,
            'DWired': 0,
            'AState': 1,
            'BState': 0,
            'CState': 0,
            'DState': 0,
            'text': textAnC
            }
           

        ];

        

        // apply the function above to every machine defined in the trialContent array that is relevant to the current trial,
        //  and returns a new array m with this information
        const m = trialContent.map((i)=>{
            return(makeMachine(i, colors, condition))
        });

        // randomize the order in which machines are displayed on the screen
        const m_prime = Array.from(Array(m.length).keys()).map((i)=>{
            let index = display_order_within[i];
            return(m[index])
        })


        // in the screens that show several machine configurations, we reveal them one by one
        // to do so we define variables that control whether a given machine configuration or button is visible
        //
        // visibility of machine configurations
        const [vis1, setVis1] = useState('hidden');
        const [vis2, setVis2] = useState('hidden');
        const [vis3, setVis3] = useState('hidden');
        // visibility of the Reveal and NextPage buttons 
        // (they are conditioned on the number of machine configurations, because if there is only one we don't need to
        // do progressive reveal)
        const [visReveal, setVisReveal] = useState(m_prime.length == 1 ? 'hidden' : 'visible');
        const [visNext, setVisNext] = useState(m_prime.length == 1 ? 'visible' :'hidden');

        // controls what happens when we click on the Reveal button
        const handleReveal = ()=>{
            if(vis1==='hidden'){setVis1('visible')}
            else if (vis2==='hidden') {setVis2('visible')}
            else {setVis3('visible')
            setVisReveal('hidden')
            setVisNext('visible')
        }
            
            
        };

        // an array storing information about the visibility of each machine configuration
        // we use an array in order to dynamically access the variables (using indices)
        const visibilityContainer = ['visible', vis1, vis2, vis3];

        // display every machine relevant to the current trial
        const machineImgs = Array.from(Array(m_prime.length).keys()).map((a)=>{
            let i = m_prime[a];
            return(
                <div style={{
                    width: '100%'
               }}>
                    <p style={{visibility: visibilityContainer[a]}}>{i.text}</p>
                    <span style={{
                        alignItems:'center', 
                    justifyContent: 'center'}}>
                        
                        <Image 
                    
                    wiring={i.wiring} states={i.states} colors={i.colors}  connections={i.connections}
                    shapes={{AShape: shapeAssignment[0],
                        BShape: 'circle',
                        CShape: shapeAssignment[1],
                        DShape: 'square',
                        EShape: 'circle'
                    }}
                    r={r_intro}
                    metaVisibility={visibilityContainer[a]}
                    texts={['', '', '', '']}
                    
                        /></span>
                </div>
            )
        });
        
        

    // manages what happens when we click on the next-page button
    const handleClick = () => {
        // increment the training number so as to go to the next page
        props.incrementTraining(props.trainingNumber)
    }

    // the 'show more machines' button
    const newMachineButton = <button style={{...buttonStyle, visibility: visReveal}} onClick={()=>handleReveal()}>
        Show next 
    </button>;

    // text of the next-page button
    const nextPageText = 'Next';
    // the next-page button
    const nextPageButton = <button style={{
        ...buttonStyle, visibility: visNext
    }} onClick={() => handleClick()}>{nextPageText}</button>;

   // text asking participants to encode information
   const encodingText = <p style={{visibility: visNext}}>Before moving to the next page, please take a moment to make sure you understand the way the machine works.</p>
   

    // the jsx content to display
    const toReturn = <span><br></br>
                {newMachineButton}
                <div className='trainingInstructionsContainer'>
                    <div className='trainingInstructionsContained'>
                        {machineImgs[0]}
                        {machineImgs[1]}
                    </div>
                    <div className='trainingInstructionsContained'>
                        {machineImgs[2]}
                        {machineImgs[3]}
                    </div>
                </div>
                {encodingText}
                {nextPageButton}
   <br></br></span>


        return(
            <div style={{...textStyle}}>
    {toReturn}
</div> 
        )
}

    
const TrainingTwo = (props)=>{
    // the text introducing the prediction phase
    const outroText = <span>
    <p>In the next pages, we will help you learn this information better by asking you to play a simple prediction task.</p>
    <p>Please try to be as accurate as you can!</p></span>;

    const handleClick = () => {
        // increment the training number so as to go to the next page
        props.incrementTraining(props.trainingNumber)
    }

    const nextPageButton = <button style={{
        ...buttonStyle, 
    }} onClick={() => handleClick()}>Next</button>;

    return(
        <div style={textStyle}>
            {outroText}
            {nextPageButton}
        </div>
    )

}

export default TrainingPhase;