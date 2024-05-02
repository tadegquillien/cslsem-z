// This code provides a template for how to build a psychology experiment in React

// The experiment structure that this code implements is the following:
// -a screen allowing the participant to enter their Prolific Id
// -Consent Form
// -Instructions
// -Training Phase
// -Transition
// -Test Phase
// -Demographics
// -Ending


// import relevant files and components
import './App.css';
import { useState } from 'react';
import { predictionItems, testItems, test2Items, condition, colorSets } from './randomized-parameters';
import ProlificId from './ProlificId';
import ConsentForm from './ConsentForm';
import Instructions from './Instructions';
import TrainingPhase from './TrainingPhase';
import PredictionPhase from './PredictionPhase';
import Transition from './Transition'
import NewNode from './NewNode';
import TestPhase from './TestPhase';
import Demographics from './Demographics';
import Ending from './Ending';



function App() {
  //keeps track of the current phase
  const [currentPhase, setCurrentPhase] = useState("prolificId");
  //keeps track of the current trial, for the Training phase
  const [trainingNumber, setTrainingNumber] = useState(0);
  // const [training2Number, setTraining2Number] = useState(0);

  // keeps track of the current trial, for the Prediction phase
  const [predictionNumber, setPredictionNumber] = useState(0);

  //keeps track of the current trial, for the Test phase
  const [testNumber, setTestNumber] = useState(0);
  const [test2Number, setTest2Number] = useState(0);


  // increment the trial number, in the Training phase
  const incrementTraining = (integer) => setTrainingNumber(integer + 1);
  // const incrementTraining2 = (integer) => setTraining2Number(integer + 1);

  // increment the trial number in the Prediction phase
  const incrementPrediction = (integer) => setPredictionNumber(integer+1);

  //increment the trial number, in the Test phase
  const incrementTest = (integer) => setTestNumber(integer + 1);
  const incrementTest2 = (integer) => setTest2Number(integer + 1);

  
  

  // create an array with the id numbers of the training phase trials
  const training_ids = [0,1]; 
 // const training_ids = Array.from(Array(trainingItems.length).keys());
  //const training2_ids = Array.from(Array(trainingItems.length).keys());

  // const training2_ids = [0,1];
  // create an array with the id numbers of the test phase trials
  const test_ids = Array.from(Array(testItems.length).keys());
  const test2_ids = Array.from(Array(test2Items.length).keys());


  // Two counters to be use during the training phase
  // they keep track of the proportion of trials the participant predicted correctly
  const [counterCorrect, setCounterCorrect] = useState(0);
  const [counterTotal, setCounterTotal] = useState(0);

  // const [counterCorrect2, setCounterCorrect2] = useState(0);
  // const [counterTotal2, setCounterTotal2] = useState(0);

  // generate the trials of the Training phases
  // (this creates an array, where each element is an instance of the component. 
  // I.e. there is one instance of the component per trial)
  var trainings = training_ids.map((i) => {
    return (
      <TrainingPhase key={i} training_ids={training_ids} phase={currentPhase}
        incrementTraining={incrementTraining} trainingNumber={trainingNumber}
        counterCorrect={counterCorrect} setCounterCorrect={setCounterCorrect}
        counterTotal={counterTotal} setCounterTotal={setCounterTotal} condition={condition}
        colors={colorSets[0]} 
      />
    )
  });

 
  // generate the trials of the Prediction phase

  var prediction_trial_ids = Array.from(Array(predictionItems.length).keys());
  var predictionTrials = prediction_trial_ids.map((i)=>{
  return(
    <PredictionPhase key={i} training_ids={prediction_trial_ids} phase={currentPhase}
    incrementTraining={incrementPrediction} trainingNumber={predictionNumber}
    counterCorrect={counterCorrect} setCounterCorrect={setCounterCorrect}
    counterTotal={counterTotal} setCounterTotal={setCounterTotal} condition={condition}
    colors={colorSets[0]} />
  )});

  //generate the trials of the Test phases
  // (this creates an array, where each element is an instance of the component. 
  // I.e. there is one instance of the component per trial)
  var tests = test_ids.map((i) => {
    return (
      <TestPhase key={i} incrementTest={incrementTest}
        test_ids={test_ids} currentPhase={currentPhase} testNumber={testNumber} condition={condition}
        colors={colorSets[0]} 
      />
    )
  });

  var tests2 = test2_ids.map((i) => {
    return (
      <TestPhase key={i+test_ids.length} incrementTest={incrementTest2}
        test_ids={test2_ids} currentPhase={currentPhase} testNumber={test2Number} condition={condition}
        colors={colorSets[0]} 
      />
    )
  });


  // this code is responsible for displaying the current page to the user.
  // Basically this is a giant if-else command, that checks the current value of the
  // currentPhase variable, as well as the current trial number within that phase,
  // and returns the current page accordingly


  return (
    currentPhase === "prolificId" ? <ProlificId setCurrentPhase={setCurrentPhase} /> :
      currentPhase === "consentForm" ? <ConsentForm setCurrentPhase={setCurrentPhase} /> :
        currentPhase === "instructions" ? <Instructions setCurrentPhase={setCurrentPhase} colors={colorSets[0]}/> :
          currentPhase === "training" ? ((trainingNumber+1) > training_ids.length ?
            setCurrentPhase("prediction") : trainings[trainingNumber]) :
            currentPhase === 'prediction' ? ((predictionNumber+1) > prediction_trial_ids.length ?
            setCurrentPhase('transition') : predictionTrials[predictionNumber]) :
            currentPhase === "transition" ? <Transition setCurrentPhase={setCurrentPhase} context={'internal'} colors={colorSets[0]} /> :
              currentPhase === "test" ? ((testNumber +1) > test_ids.length ?
                setCurrentPhase('demographics') : tests[testNumber]) :
                        currentPhase === "demographics" ? <Demographics setCurrentPhase={setCurrentPhase} /> :
                          currentPhase === "ending" ? <Ending /> :
                            <p>{currentPhase}</p>
  )

}



export default App;
