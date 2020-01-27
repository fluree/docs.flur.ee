import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Button } from 'react-bootstrap';

const Splash = (props) => {
        return (
            <div className="row text-center" style={{ backgroundColor: "#fff", padding: "50px 0 50px 0", display: "flex", justifyContent: "center"}}>
                <div style={{paddingBottom: "20px", marginRight:"40px"}}>
                    <h1 className="color-success font-header" style={{fontSize: "36px", weight:"700", textAlign: "left", color: "#091133", marginBottom:"10px"}}>Fluree Docs</h1>
                    <p className="font-paragraph" style={{ color: "#091133", maxWidth:"350px", weight: "400", textAlign: "left", fontSize: "16px", marginTop:"15px"}}>
                        Ready to dive deeper into Fluree? Here you'll find videos, docs, examples, and 
                        more to help you learn how to use Fluree for your business or project.
                    </p>
                    <div className="mt20" style={{textAlign: "left"}}>
                        <LinkContainer to="/lesson" style={{margin:"2px", textAlign: "left"}}>
                            <Button id="landingpage-button" style={{
                                backgroundColor: "#4B56A5",
                                borderRadius: "2px",
                                fontFamily: "CooperHewitt",
                                fontStyle: "normal",
                                fontWeight: "bold",
                                fontSize: "16px",
                                textAlign: "left",
                                color: "#fff"
                            }}>
                               Visit the Docs
                            </Button>
                        </LinkContainer>
                    </div>
                </div>
                <div>
                    <img style={{height: "300px", marginLeft:"30px"}} alt="Fluree" src={require('../theme/assets/homepagegraphic.png')} />
                </div>
            </div>
        )
}


const FPPanel = (props) => {
    return(
        <div 
        style={{
            marginTop:"30px", 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "center",
            width: "100%"
            }}>
                <h2 
                    className="color-success"
                    style={{
                        color: "#091133",
                        textAlign: "center",
                        weight: "600",
                        fontSize: "36px" ,
                        marginBottom: "20px"
                    }}
                >Learn Fluree How You Learn Best</h2>
          
            <div 
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "3em",
                    marginBottom: "2em",
                    margin: "0 1em 0 1em",
                    paddingBottom: "5em"
                }}>
                    <div style={{
                        backgroundColor: "white", 
                        width: "200px", 
                        height: "160px", 
                        margin: "0 30px 0 30px",  
                        display: "flex", 
                        justifyContent: "center",
                        flexDirection: "column"
                        }}>
                        <i className="fas fa-video mb10" style={{color: "#13C6FF", fontSize: "50px", textAlign:"center"}}/>
                        <p
                            style={{
                            color: "#091133",
                            textAlign: "center"
                            }}
                        >Through Videos... 
                        </p>
                        <LinkContainer to="/video"
                            style={{
                                marginTop: "auto"
                            }}>
                            <Button bsStyle="success" 
                            style={{
                                backgroundColor: "#13C6FF"
                            }}><i className="fas fa-video" />&nbsp;&nbsp;Videos</Button>
                        </LinkContainer>
                    </div>
                    <div style={{
                        backgroundColor: "white", 
                        width: "200px", 
                        height: "160px", 
                        margin: "0 30px 0 30px",   
                        margin: "0", 
                        display: "flex", 
                        justifyContent: "center",
                        flexDirection: "column"
                        //backgroundColor: "white", width: "200px", height: "160px", paddingTop: "5px",  margin: "20px 30px"
                        }}>
                        <i className="fas fa-chalkboard-teacher mb10" style={{color: "#13C6FF", fontSize: "50px", textAlign:"center"}}/>
                        <p 
                            style={{
                            color: "#091133",
                            textAlign: "center"
                            }}
                        >Step-By-Step Guided Lessons</p>
                        <LinkContainer to="/lesson"
                            style={{
                                marginTop: "auto"
                            }}>
                            <Button bsStyle="success"><i className="fas fa-chalkboard-teacher"/>&nbsp;&nbsp;Lessons</Button>
                        </LinkContainer>
                    </div>
              
                    <div 
                    style={{
                        backgroundColor: "white", 
                        width: "200px", 
                        height: "160px",  
                        margin: "0 30px 0 30px", 
                        display: "flex", 
                        justifyContent: "center",
                        flexDirection: "column"
                    }}>
                        <i className="fas fa-book mb10" style={{color: "#13C6FF", fontSize: "50px", textAlign:"center"}}/>
                        <p
                            style={{color: "#091133"}}
                        >Or Read the Docs</p>
                        <LinkContainer to="/docs/getting-started"
                            style={{
                                marginTop: "auto"
                            }}>
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
            <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
            }}>
                <Splash/>
                { version !== "0.9.1" && <FPPanel /> }
            </div>
        )
}

export default Landing; 