import { textStyle, buttonStyle } from './dimensions';


// this component handles transitions between different parts of the experiment.
// It displays different messages depending on the context in which it is called
// the 'context' variable controls this

const Transition = (props) => {


    const handleClick = () => {
        if (props.context === 'internal') {
            props.setCurrentPhase("test")
        }
        if (props.context === 'internal2') {
            props.setCurrentPhase('test2')
        }
        if (props.context === 'external') {
            props.setCurrentPhase('training2')
        }
    }



    const text = <span>
    <p>Now that you know how this type of machine works, we will ask you a few more questions.</p>
</span>




    const nextPageButton = <button style={buttonStyle} onClick={() => handleClick()}>Next</button>;

    return (
        <div style={textStyle}>
            {text}
           
            {nextPageButton}
            <br></br>
        </div>

    )
}

export default Transition;