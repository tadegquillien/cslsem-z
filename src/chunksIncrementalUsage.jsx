//This code handles the export of data to the server. Most of it was written by Chentian Jiang (https://github.com/chen10an)

import { ChunksIncremental } from './chunksIncremental';


import Data from './Data';

// We need to create an instance of ChunksIncremental with (optional)
// callbacks for messages and errors.
const wso = new ChunksIncremental(
    "wss://somata.inf.ed.ac.uk/chunks/ws",

    // Callbacks like this could be empty, i.e., "() => {}",
    // but are useful for making sure data are transmitted.

    //() => {}
    (chunksLeft, errStatus, message) => {
        console.log("Received message: " + JSON.stringify(message));
    },
    //     let msgDiv = document.getElementById("messageDiv");
    //     msgDiv.appendChild(document.createTextNode(m+"\n"));
    //     msgDiv.appendChild(document.createElement('br'));
    // },

    (e) => {
        console.log("Encountered error: " + e);
    }
    //     let errorDiv = document.getElementById("errorDiv");
    //     errorDiv.appendChild(document.createTextNode(m+"\n"));
    //     errorDiv.appendChild(document.createElement('br'));
    // }
);

// Session ids should be strings, unique to each experimental session
const sessionId = Math.random().toString(36).substring(7);

// Experiment ids should be descriptive strings. 
const experimentId = "cslsem-z";


// Send a minimalist message, with just a timestamp.
// In a real experiment, this would be replaced with everything that
// is being recorded.
export const sendData = (Data) => {
    // let message = { sessionId: sessionId, experimentId: experimentId, timestamp: Date.now(), Data: Data };
    // console.log(JSON.stringify(message));
    // wso.sendChunk(message);
    var url = 'save_data.php';
    var data_to_send = {filename: experimentId+"_"+sessionId, filedata: Data};
    console.log(JSON.stringify(data_to_send));
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data_to_send),
        headers: new Headers({
                'Content-Type': 'application/json'
        })
    });
}




// This demonstrates what happens if you're missing a correct sessionId or experimentId
// Notice that experimentId has been replaced by experiment_id in the object to be sent
const sendIllFormedMessage = () => {
    let message = { sessionId: sessionId, experiment_id: experimentId, timestamp: Date.now() };
    wso.sendChunk(message);
}