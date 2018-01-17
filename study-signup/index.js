import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";


const Index = () => {
    return (
        <div className="Index">
            <h1>Website Usability Study</h1>
            <div className="__secondaryHeader">
                <h2>Internet Security Research Lab</h2>
                <h2>2236 TMCB</h2>
            </div>

            <h3>Study Description</h3>
            <p>
                We are conducting a study on how to improve the usability and security of websites.
                We are recruiting a variety of participants to help us in this effort.
                If you choose to participate in this study, you will be required to:
            </p>
            <ul>
                <li>Meet with a study coordinator at the beginning of the study for approximately 15 minutes</li>
                <li>Complete a short (2&ndash;3 minute) task on the study website 12 times over a 14-day period</li>
                <li>Meet again with a study coordinator at the end of the study for 20&ndash;30 minutes</li>
            </ul>

            <h3>Prerequisites</h3>
            <p>
                In order to complete this study, you must have access to a computer that can run an up-to-date version of Google Chrome.
                The computers available in the Harold B. Lee Library on BYU campus will fulfill this requirement.
            </p>
            <p>
                Several groups of participants will be participating in this study and we will only be able to accept limited numbers of participants for each group.
                Some groups will have additional participation requirements.
                We have a limited capacity for each group.
                To be apply for this study, you must fill out a brief survey.
                This survey will help us know which groups you may be eligible for.
            </p>
            <p>
                We will contact you within 1&ndash;2 business days to let you know if we have space for you in the study.
                If we do have space, we will send you a link to schedule a time for your initial meeting with a study coordinator.
            </p>
            <h3>Compensation</h3>
            <p>
                We will compensate you $10&ndash;25 to participate in this study.
                Your exact payment will depend on the number of days you complete a study task, as detailed in the table below.
                You may complete a maximum of one task per day.

                <table className="__compensationTable" align='center'>
                    <thead>
                        <th>Number days completed</th>
                        <th>Compensation</th>
                    </thead>
                    <tr>
                        <td>0&ndash;3</td>
                        <td>$10</td>
                    </tr>
                    <tr>
                        <td>4&ndash;6</td>
                        <td>$15</td>
                    </tr>
                    <tr>
                        <td>7&ndash;9</td>
                        <td>$20</td>
                    </tr>
                    <tr>
                        <td>10&ndash;12</td>
                        <td>$25</td>
                    </tr>
                </table>

                <h3>Further Information</h3>
                <p>
                    This research study has been approved by the Brigham Young University Institutional Review Board for Human Subjects.

                    If you have any questions about this study, please contact:
                </p>
                <table align="center">
                    <tr>Kent Seamons, PhD</tr>
                    <tr><a href="mailto:seamons@cs.byu.edu">seamons@.cs.byu.edu</a></tr>
                    <tr>801-422-3722</tr>
                    <tr>2230 TMCB</tr>
                </table>


                <p>
                    To apply to participate in this study, please take this brief survey:<br />
                </p>
                <div className="__center horiz">
                    <a className="__surveyLink" href="#">Take Eligibility Survey</a>
                </div>



            </p>

        </div>
    )
}

const reactEntry = document.createElement("div");
ReactDOM.render(<Index />, reactEntry);
document.body.appendChild(reactEntry)
