import React from 'react';

class Help extends React.Component {
    render() {
        return (
            <div className="text-center mt20">
            <div className="row">
                <div className="col-xs-12">
                    <h2>Need Help?</h2>
                </div>
            </div>
            <div className="row text-center">
                <div className="col-sm-6 text-center">
                        <div className="lesson-square">
                            <div className="lesson-square-icon">
                                <i className="fas fa-at"/>
                            </div>
                            <div className="lesson-square-header">
                            support@flur.ee</div>
                            <div className="lesson-square-description">
                            Email us with any questions, comments, or concerns.
                            </div>
                        </div>
                </div>
                <div className="col-sm-6 text-center">
                    <a className="no-underline" href="https://launchpass.com/flureedb" 
                    rel="noopener noreferrer" target="_blank">
                        <div className="lesson-square beginner">
                            <div className="lesson-square-icon">
                                <i className="fab fa-slack"/>
                            </div>
                            <div className="lesson-square-header">
                            Join Our Slack</div>
                            <div className="lesson-square-description">
                            Enter your email address to get a Slack invitation. 
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
        )
    }
}

export default Help;