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
                <li>Meet with a study coordinator at the beginning of the study for approximately 15 minutes to create an account on the study website.
                    We will also help you complete 1 of 12 required tasks at this time and answer any questions you may have.
                </li>
                <li>Over the next 14-day period, login and complete a short (2&ndash;3 minute) task on the study website.</li>
                <li>Meet again with a study coordinator at the end of the study for 20&ndash;30 minutes.
                    During this time, you will complete a Qualtrics survey and a study coordinator will ask you a few questions
                    to help us better understand your experiences using the study website.
                </li>
            </ul>

            <h3>Prerequisites</h3>
            <p>
                In order to complete this study, you must have access to a computer that can run an up-to-date version of Google Chrome.
                The computers available in the Harold B. Lee Library on BYU campus will fulfill this requirement.
            </p>
            <p>
                Several groups of participants will be participating in this study and we will only be able to accept limited numbers of participants for each group.
                Participation in some groups will require you to receive text messages on your phone or use an app on your smartphone as part of the login process.

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
            You will be compensated between $10&ndash;25 to participate in this study.
            Your exact payment will depend on the number of days you complete a study task, as detailed in the table below.
            You may complete a maximum of one task per day.
            If you withdraw before the end of the study, you will receive prorated compensation according to the table below:

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

                <h3>Confidentiality</h3>
                <p>
                In order to sign up for the study, we will require you to provide an email address
                where we can send you additional information about the study.
                We will only use this email address to coordinate your appointment times.
                Some tasks in this study may require you to receive one or more text messages
                from our automated study system at your personal phone number.
                We will not share your phone number or email address with any third parties except our
                messaging service provider and will delete your phone number and email
                address from our systems at the conclusion of the study.

                We will record the audio of your final interview with a study coordinator.
                These recordings will not be heard by anyone beside the researchers and will
                be stored securely in digital form. We will not publish or share any personally
                identifying information. A unique, random ID will be generated for you, and this ID will
                be used in place of any personally identifying information.
                Any data requiring a specifying identifier will use this ID.

                We may share some
                research data on the Internet, including anonymized survey responses, transcriptions of
                direct quotes from study subjects, timing and interaction data collected from the study website,
                and aggregate demographic data.

                We will not share
                identifying information with this data, including your name, email address, or phone number.
                </p>

                <h3>Risks</h3>
                <p>
                There is minimal risk to participants of this study.
                Risks in this study may include some inconvenience associated
                with completing a study task each day.  To minimize this inconvenience,
                study tasks have been designed to take less than five minutes.
                A study coordinator will assist you in completing the first required task
                and will answer any questions you may have.
                </p>

                <h3>Participation</h3>
                <p>
                Participation in this research study is voluntary.
                You have the right to withdraw at any time or refuse
                to participate entirely without adverse consequences
                in relation to the Internet Security Research Lab,
                Computer Science Department, or Brigham Young University.
                </p>

                <h3>Further Information</h3>
                <p>
                    This research study has been approved by the Brigham Young University Institutional Review Board for Human Subjects.

                    If you have any questions about this study, please contact:
                </p>
                <table align="center">
                    <tr>Kent Seamons, PhD</tr>
                    <tr><a href="mailto:seamons@cs.byu.edu">seamons@cs.byu.edu</a></tr>
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
