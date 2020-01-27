import React from 'react';
import {Button} from 'react-bootstrap';

class Help extends React.Component {
    render() {
        return (
            <div style={{
                height: "100vh"
            }}>
                <h2 style={{
                    textAlign: "center",
                    marginBottom: "20px"
                }}>Need Help?</h2>
                <div
                    style={{
                            display: "flex",
                            justifyContent: "space-around"
                        }}>
                    <div 
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            border: "solid 1px #ccc",
                            boxShadow: "2px 2px  3px  #ccc",
                            borderRadius: "4px",
                            padding: "0 15px 0 15px",
                            width: "35%"
                        }}>
                        <div className="image-haeder"
                            style={{
                                textAlign: "center"
                            }}>
                            <img
                             style={{
                                width: "200px",
                                height: "150px"
                            }}
                             alt="Contact Image" src={require('../theme/assets/contactImage.png')}/>
                        </div>
                       <h3 
                        style={{
                            textAlign: "center"
                        }}
                        >Contact</h3>
                       <p 
                        style={{
                            textAlign: "center",
                            margin:"10px 0 20px 0"
                        }}>Email us with any questions, comments, or concerns.</p> 
                        <div
                            style={{
                                textAlign: "center"
                            }}>
                             <a
                             style={{
                            width: "75%"
                        }}
                        className="buttonPurple no-underline"
                             href="mailto:support@flur.ee">Send Us An Email</a>
                        </div>
                          
                    </div>
                    <div
                         style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "35%",
                            justifyContent: "center",
                            border: "solid 1px #ccc",
                            boxShadow: "2px 2px  3px  #ccc",
                            borderRadius: "4px",
                            padding: "0 15px 30px 15px",
                        }}>
                          <div
                          className="image-header"
                            style={{
                                textAlign: "center"
                            }}>
                            <img
                             style={{
                                width: "200px",
                                height: "125px"
                            }}
                             alt="Contact Image" src={require('../theme/assets/slackimage.png')}/>
                        </div>
                        <h3
                        style={{
                            textAlign: "center",
                            marginTop: "10px"
                        }}
                        >Join Fluree Slack</h3>
                        <p
                        style={{
                            textAlign: "center",
                            margin:"10px 0 30px 0"
                        }}>Meet Fluree developers, ask quesitons, and help others when you join our Slack Channel</p>
                        <div style={{
                            textAlign: "center"
                        }}>
                            <a className="no-underline" href="https://launchpass.com/flureedb" 
                                rel="noopener noreferrer" target="_blank"
                                style={{
                            width: "75%"
                        }}
                        className="buttonPurple no-underline">
                                Join Our Slack Channel 
                                <i style={{
                                    marginLeft: "4px"
                                }} className="fab fa-slack"/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Help;