import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Col, DropdownButton, MenuItem, Button } from 'react-bootstrap';
import { getDocNav } from '../navs/nav';
import { versions } from '../index';

const NavItems = (props) => {
    let docNav = getDocNav(props.version)
    let docKeys = Object.keys(docNav)

    return (<div>
        {
            props.version !== "0.9.1" &&
            <DropdownButton id="Learn" title="Learn" bsStyle={props.btnStyle} style={props.btnStyles}>
                <LinkContainer to="/lesson" className="text-center">
                    <MenuItem>Lessons</MenuItem>
                </LinkContainer>
                <LinkContainer to="/video" className="text-center">
                    <MenuItem>Video</MenuItem>
                </LinkContainer>  
            </DropdownButton>
        }
            <DropdownButton id="Docs" title="Docs" bsStyle={props.btnStyle} style={props.btnStyles}>
                {
                    docKeys.map(docItem => 
                        <LinkContainer to={`/docs/${docItem}`}  className="text-center" key={docItem}>
                            <MenuItem key={docItem}>{docNav[docItem].pageName}</MenuItem>
                        </LinkContainer>
                    )
                }    
            </DropdownButton>
            <LinkContainer to="/api" className="text-center" style={props.btnStyles}>
               <Button bsStyle={props.btnStyle}>API</Button>
            </LinkContainer>
            <LinkContainer to="/library" className="text-center" style={props.btnStyles}>
               <Button bsStyle={props.btnStyle}>Library</Button>
            </LinkContainer>
            <LinkContainer to="/help" className="text-center" style={props.btnStyles}>
                <Button bsStyle={props.btnStyle}>Help</Button>            
            </LinkContainer>
            </div>)}

class Header extends React.Component {

    render() {
      return (
        <div>
            <div className="row" style={{backgroundColor: "#00aeef", height: "115px"}}>
                <div className="col-md-4 col-sm-12">
                    <div className="row">
                        <LinkContainer to="/" style={{display: 'inline-block', height: "80px", margin: "12.5px 25px"}}>
                            <img style={{height: "50px"}} alt="Fluree" src={require('../theme/assets/logo_horizontal_white.png')} />
                        </LinkContainer>
                        <div className="version-toggle" 
                        style={{display: 'inline-block', margin: "37.5px 0px"}}>
                            <DropdownButton
                                style={{background: 'transparent', color: "white", fontWeight: 800}}
                                title={this.props.version}
                                id="version-dropdown"
                            >
                                {versions.map((version, idx) => 
                                    <MenuItem key={version} eventKey={idx} onClick={() => this.props.changeVersion(version)}>{version}</MenuItem>
                                )}
                            </DropdownButton>  
                        </div>
                    </div>
                </div>
                    <Col md={8} smHidden xsHidden>
                        <div className="pull-right" style={{marginRight: "10px"}}>
                            <NavItems version={this.props.version} btnStyle="success" btnStyles={{padding: "10px", backgroundColor: "rgba(255, 255, 255, 0.1)", marginTop: "30px", width: "100px", textAlign: "center", fontWeight: "900", fontSize: "16px"}}/>
                        </div>
                    </Col>
                    <Col xs={12} mdHidden lgHidden style={{backgroundColor: "#84CEC5", height: "55px"}}>
                        <div className="text-center">
                            <NavItems version={this.props.version} btnStyle="info" btnStyles={{margin:"5px", fontSize: "16px", fontWeight: "900", width: "80px", backgroundColor: "rgba(0, 0, 0, 0.15)"}}/>
                        </div>
                    </Col>
            </div>
        </div>
      );
    }
  }
  
  export default Header;