//elicits basic demographic information from the participant

import { useState } from 'react';
import { textStyle, buttonStyle } from './dimensions';
import { sendData } from './chunksIncrementalUsage'
import Data from './Data';


const Demographics = (props) => {

    //keeps track of which page we are on
    const [demographicsTrial, setDemographicsTrial] = useState(0);
    //a list of the pages for the demographics
    const demographicsTrialsList = [
        <DemographicsOne setDemographicsTrial={setDemographicsTrial} />,
        <DemographicsTwo setCurrentPhase={props.setCurrentPhase} />
    ];
    //display the current page
    return (
        demographicsTrialsList[demographicsTrial]
    )

}

const DemographicsOne = (props) => {
    const [comment, setComment] = useState("NA");
    const handleComment = (e) => {
        setComment(e.target.value);
    };
    const handleClick = () => {
        Data.freeComment.push(comment);
        props.setDemographicsTrial((a) => a + 1);
    }
    return (
        <div style={textStyle}>
            <p>Thank you for completing the task!</p>
            <p>Can you tell us a few words about how you made your judgments?</p>
            <br></br>

            <textarea
                onChange={(e) => handleComment(e)}
                style={{ width: "400px", height: "100px" }}></textarea>
            <br></br>
            <button style={buttonStyle} onClick={() => handleClick()}>next</button>
        </div>
    );
};

const DemographicsTwo = (props) => {
    //keep track of the responses
    const [age, setAge] = useState("NA");
    const [gender, setGender] = useState("NA");
    const [race, setRace] = useState("NA");
    const [colorBlind, setColorBlind] = useState("NA");
    const [comment, setComment] = useState("NA");
    //this variable lets us know how many items the participant
    //has also completed. After he has completed all required items
    //he can go to the end of the study
    const [counter, setCounter] = useState(0);

    //the functions used to update the relevant variables when the
    //participant makes a response

    const handleAge = (e) => {
        if (age == "NA") { setCounter((a) => a + 1) };
        setAge(e.target.value);

    };

    const handleGender = (e) => {
        if (gender == "NA") { setCounter((a) => a + 1) };
        setGender(e.target.value);
    };

    const handleRace = (e) => {
        if (race == "NA") { setCounter((a) => a + 1) };
        setRace(e.target.value);
    };

    const handleColorBlind = (e) => {
        setColorBlind(e.target.value);
    };

    const handleComment = (e) => {
        setComment(e.target.value);
    };

    //when the participant hits submit, record the data
    const handleClick = () => {
        Data.demographics.push({ 'age': age });
        Data.demographics.push({ 'gender': gender });
        Data.demographics.push({ 'race': race });
        Data.demographics.push({ 'comment': comment });
        Data.demographics.push({ 'colorBlind': colorBlind });
        props.setCurrentPhase("ending");
        sendData(Data);

    }

    //display the page
    return (
        <div style={textStyle}>

            <h3>Thank you for your participation! Before we finish, please tell us a few things about yourself:</h3>
            <form>
                {/*a number input for age */}
                <label>
                    How old are you? </label>
                <input type="number"
                    onChange={(e) => handleAge(e)}
                />

                <br></br>
                <br></br>

                {/*a dropdown for gender */}
                <label for="gender">What is your gender? </label>

                <select name="gender" id="gender" onChange={(e) => handleGender(e)}>
                    <option value="NA">  </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other / prefer not to say</option>
                </select>

                <br></br>
                <br></br>

                {/*a dropdown for race/ethnicity */}
                <label for="race">What is your race / ethnicity? </label>

                <select name="race" id="race" onChange={(e) => handleRace(e)}>
                    <option value="NA">  </option>
                    <option value="Asian">Asian / Pacific Islander</option>
                    <option value="Black">Black / African-American</option>
                    <option value="Native">Native American</option>
                    <option value="White">White</option>
                    <option value="Hispanic">Hispanic / Latino</option>
                    <option value="other">Other / Prefer not to answer</option>

                </select>

                <br></br>
                <br></br>

                {/*a dropdown for colorblindness */}
                <label for="colorBlind">Are you colorblind / do you have difficulty perceiving colors on your current computer screen? </label>

                <select name="colorBlind" id="colorBlind" onChange={(e) => handleColorBlind(e)}>
                    <option value="NA">  </option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>

                </select>
                <br></br>
                <br></br>
                {/*an optional opportunity to give a comment */}
                <label for="comment">Please let us know if you have any comment about the study:</label>
                <br></br>
                <textarea
                    onChange={(e) => handleComment(e)}
                    style={{ width: "400px", height: "100px" }}></textarea>
            </form>

            {/*when the participant answered all required items, a button appears that allows him to
        go to the end of the study*/}
            {counter > 2 ? <button style={buttonStyle} onClick={() => handleClick()}>submit</button> : null}
        </div>

    )

}

export default Demographics;