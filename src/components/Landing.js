import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Button } from 'react-bootstrap';

const Splash = (props) => {
        return (
            <div className="row text-center" style={{backgroundColor: "#fff", padding: "80px 0px"}}>
                <div className="col-md-4" style={{paddingBottom: "20px"}}>
                    <h1 className="color-success" style={{fontSize: "56px"}}>Fluree Docs</h1>
                    <h2 className="color-success" style={{fontVariant: "small-caps"}}>Blockchain, Meet Database</h2>
                    <div className="mt10">
                        <LinkContainer to="/lesson" style={{margin:"2px 5px"}}>
                            <Button id="landingpage-button" style={{
                                backgroundColor: "#4B56A5",
                                borderRadius: "2px",
                                fontFamily: "CooperHewitt",
                                fontStyle: "normal",
                                fontWeight: "bold",
                                fontSize: "16px",
                                textAlign: "center",
                                color: "#fff"
                            }}>
                               Start Learning
                            </Button>
                        </LinkContainer>
                    </div>
                </div>
                <div className="col-md s-8">
                    <img style={{height: "300px"}} alt="Fluree" src={require('../theme/assets/homepagegraphic.png')} />
                </div>
            </div>
        )
}


const FPPanel = (props) => {
    return(
        <div className="row mt20 mb20 text-center hidden-xs" style={{height: "250px"}}>
            <div className="col-sm-12">
                <h2 className="color-success">Learn Fluree How You Learn Best</h2>
            </div>
            <div className="col-sm-4">
                <div style={{backgroundColor: "white", width: "200px", height: "160px", paddingTop: "5px", margin: "20px 30px", border: "1px solid #0089bc"}}>
                    <i className="fas fa-video mb10" style={{color: "#13C6FF", fontSize: "50px"}}/>
                    <p>Through Videos... </p>
                    <LinkContainer to="/video">
                        <Button bsStyle="success"><i className="fas fa-video"m />&nbsp;&nbsp;Videos</Button>
                    </LinkContainer>
                </div>
            </div>
            <div className="col-sm-4">
                <div style={{backgroundColor: "white", width: "200px", height: "160px", paddingTop: "5px",  margin: "20px 30px", border: "1px solid #0089bc"}}>
                    <i className="fas fa-chalkboard-teacher mb10" style={{color: "#13C6FF", fontSize: "50px"}}/>
                    <p>Step-By-Step Guided Lessons</p>
                    <LinkContainer to="/lesson">
                        <Button bsStyle="success"><i className="fas fa-chalkboard-teacher"/>&nbsp;&nbsp;Lessons</Button>
                    </LinkContainer>
                </div>
            </div>
            <div className="col-sm-4">
                <div style={{backgroundColor: "white", width: "200px", height: "160px", paddingTop: "5px",  margin: "20px 30px", border: "1px solid #0089bc"}}>
                    <i className="fas fa-book mb10" style={{color: "#13C6FF", fontSize: "50px"}}/>
                    <p>Or Read the Docs</p>
                    <LinkContainer to="/docs/getting-started">
                        <Button bsStyle="success"><i className="fas fa-book"/>&nbsp;&nbsp;Documentation</Button>
                    </LinkContainer>
                </div>
            </div>
        </div>
    )
}

const Landing = (props) =>  {
    const { version } = props
        return (
            <div>
                <Splash/>
                { version !== "0.9.1" && <FPPanel /> }
            </div>
        )
}

export default Landing; 