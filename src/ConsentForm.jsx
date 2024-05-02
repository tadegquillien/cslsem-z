
//the consent form, accessed at the start of the experiment

import { buttonStyle } from './dimensions';

const consentStyle = {
    marginLeft: "20vw",
    marginRight: "20vw"
}

const ConsentForm = (props) => {
    return (
        <div style={consentStyle}>
            <h1>Participant Information Sheet</h1>
            <p>This study was certified according to the Informatics Research Ethics Process, RT number 2019/58792. Please take time to read the following information carefully. You should keep this page for your records. </p>

            <h2>Who are the researchers?</h2>
            <p>The researchers are from the Informatics department at the University of Edinburgh: Christopher G. Lucas and Tadeg Quillien.</p>

            <h2>What is the purpose of the study?</h2>
            <p>The purpose of this study is to investigate how people think about simple causal systems.</p>

            <h2>Why have I been asked to take part?</h2>
            <p>You’ve been asked to take part because we’re interested in seeing how many different people think about the same task.  </p>

            <h2>Do I have to take part?</h2>
            <p>No – participation in this study is entirely up to you. You can withdraw from the study at any time, without giving a reason. Your rights will not be affected. We will not use any identifiable data we collect from you in any publications or presentations submitted after you have withdrawn consent. However, we will retain your withdrawal request. </p>

            <h2>What will happen if I decide to take part? </h2>
            <p>You are invited to participate in an online study that involves observing, interacting with, and making judgments about simple stimuli on a web-based interface. Once you finish, we may have some questions about your experience (e.g., age, gender, feedback about how you approached the task). Your responses will be recorded.
                Specifically, we collect nonidentifiable data about your responses during the study, including mouse clicks, keyboard presses, and answers to questionnaires. We do not record your audio or video. We also collect minimal identifiable information about your worker ID and IP address to prevent repeat participation. The identifiable information will only be stored in a secure database and only for the duration of data collection. This information will be stripped from the datasets prior to any academic publications.
                We estimate that the study session will last about 9 minutes. You will be given full instructions shortly.</p>
            {/* I timed myself taking the study at 7 minutes 29 seconds. */}
            
            <h2>Compensation.</h2>
            <p>You will be paid for your participation in this study in accordance with the Prolific description. </p>
            <h2>Are there any risks associated with taking part?</h2>
            <p>There are no significant risks associated with participation.</p>
            <h2>Are there any benefits associated with taking part?</h2>
            <p>Other than the payment mentioned, there are no tangible benefits to you. However, you will be contributing to our knowledge of human cognition.</p>
            <h2>What will happen to the results of this study? </h2>
            <p>The results of this study may be summarized in published articles, reports and presentations. Quotes or key findings will be anonymized: We will remove any information that could, in our assessment, allow anyone to identify you. With your consent, information can also be used for future research. Your anonymized data may be publicly released and other data may be archived for a minimum of 2 years.</p>

            <h2>Data protection and confidentiality.</h2>
            <p>Your data will be processed in accordance with Data Protection Law.  All identifiable information collected about you will be kept strictly confidential. Your data will be referred to by a unique participant number rather than by name. All identifiable data will only be viewed by the research team (listed above).
                All identifiable electronic data will be stored on a password-protected encrypted computer, on the School of Informatics’ secure file servers, or on the University’s secure encrypted cloud storage services (DataShare, ownCloud, or Sharepoint) and all paper records will be stored in a locked filing cabinet in the PI’s office. Your consent information will be kept separately from your responses in order to minimize risk. </p>
            <h2>What are my data protection rights?</h2>
            <p> The University of Edinburgh is a Data Controller for the information you provide. You have the right to access information held about you. Your right of access can be exercised in accordance with Data Protection Law. You also have other rights including rights of correction, erasure and objection. However, for fully anonymized data, it may be impossible to find, edit, and/or delete information about any individual. For more details, including the right to lodge a complaint with the Information Commissioner’s Office, please visit www.ico.org.uk. Questions, comments and requests about your personal data can also be sent to the University Data Protection Officer at dpo@ed.ac.uk.
                For general information about how we use your data, go to: edin.ac/privacy-research</p>

            <h2>Who can I contact?</h2>
            <p>If you have any further questions about the study, please contact the lead researcher, Tadeg Quillien, tadeg.quillien@ed.ac.uk.
                If you have a complaint that the research team (tadeg.quillien@ed.ac.uk) cannot resolve, please contact
                inf-ethics@inf.ed.ac.uk. When you contact us, please provide the study title and detail the nature of your complaint.
            </p>
            <h2>Consent</h2>
            <p> By proceeding with the study, I agree to all of the following statements: <br></br>
                <span style={{ paddingLeft: "20px" }}>-I have read and understood the above information.</span> <br></br>
                <span style={{ paddingLeft: "20px" }}>-I understand that my participation is voluntary, and I can withdraw at any time.</span> <br></br>
                <span style={{ paddingLeft: "20px" }}>-I consent to my anonymized data being used in academic publications and presentations.</span> <br></br>
                <span style={{ paddingLeft: "20px" }}>-I allow my data to be used in future ethically approved research.</span> </p>

            <button style={buttonStyle} onClick={() => props.setCurrentPhase("instructions")}>I agree</button>
            <br></br>
            <br></br>
        </div>


    )
}

export default ConsentForm;