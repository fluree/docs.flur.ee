import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Col, DropdownButton, MenuItem, Button } from 'react-bootstrap';
import { docNav } from '../screens/Docs';
import { currentVersion } from '../index';

const docKeys = Object.keys(docNav);
const versions = ["0.9.5", "0.9.1"]

const NavItems = (props) => {
    return (<div>
            <DropdownButton id="Learn" title="Learn" bsStyle={props.btnStyle} style={props.btnStyles}>
                <LinkContainer to="/lesson" className="text-center">
                    <MenuItem>Lessons</MenuItem>
                </LinkContainer>
                <LinkContainer to="/video" className="text-center">
                    <MenuItem>Video</MenuItem>
                </LinkContainer>  
            </DropdownButton>
            <DropdownButton id="Docs" title="Docs" bsStyle={props.btnStyle} style={props.btnStyles}>
                {
                    docKeys.map(docItem => 
                        <LinkContainer to={`/docs/${docItem}`}  className="text-center" key={docItem}>
                            <MenuItem>{docNav[docItem].pageName}</MenuItem>
                        </LinkContainer>
                    )
                }    
            </DropdownButton>
            <LinkContainer to="/api" className="text-center" style={props.btnStyles}>
               <Button bsStyle={props.btnStyle}>API</Button>
            </LinkContainer>
            <LinkContainer to="/help" className="text-center" style={props.btnStyles}>
                <Button bsStyle={props.btnStyle}>Help</Button>            
            </LinkContainer>
            </div>)}

class Header extends React.Component {
    state = {
        version: currentVersion
    }

    componentDidMount(){
        const path = this.props.location.pathname
        const versionPage = path.search("/version/") === -1 ? false : true;
        let version = versionPage ? path.replace("/version/", "") : undefined;
        if(versions.includes(version)){
            this.getVersion(version)
        } else {
            this.getVersion(undefined)
        }
    }

    componentDidUpdate(nextProps){
        if(this.props.match.params.version !== nextProps.match.params.version){
            this.getVersion(nextProps.match.params.version)
        }
    }

    getVersion = (version) => {
        if(version === undefined){
            this.setState({version: currentVersion}, this.props.history.push("/"))
        } else if(version === currentVersion){
            this.setState({version: version}, this.props.history.push("/"))
        } else {
            this.setState({version: version}, this.props.history.push(`/version/${version}`))
        }
    }

    render() {
      return (
        <div>
            <div className="row" style={{backgroundColor: "#00aeef", height: "115px"}}>
                <div className="col-md-4 col-sm-12">
                    <div className="row">
                        <LinkContainer to="/" onClick={() => this.setState({version: currentVersion})} style={{display: 'inline-block', height: "80px", margin: "12.5px 25px"}}>
                            <img style={{height: "50px"}} alt="Fluree" src={require('../theme/assets/logo_horizontal_white.png')} />
                        </LinkContainer>
                        <div className="version-toggle" style={{display: 'inline-block', margin: "37.5px 0px"}}>
                            <DropdownButton
                                style={{background: 'transparent', color: "white", fontWeight: 800}}
                                title={this.state.version}
                                id="version-dropdown"
                            >
                                {versions.map((version, idx) => 
                                    <MenuItem eventKey={idx} onClick={() => this.getVersion(version)}>{version}</MenuItem>
                                )}
                            </DropdownButton>  
                        </div>
                    </div>
                </div>
                {
                    this.state.version !== currentVersion
                    ?
                    null
                    :
                    <>
                        <Col md={8} smHidden xsHidden>
                            <div className="pull-right" style={{marginRight: "10px"}}>
                                <NavItems btnStyle="success" btnStyles={{padding: "10px", backgroundColor: "rgba(255, 255, 255, 0.1)", marginTop: "30px", width: "100px", textAlign: "center", fontWeight: "900", fontSize: "16px"}}/>
                            </div>
                        </Col>
                        <Col xs={12} mdHidden lgHidden style={{backgroundColor: "#84CEC5", height: "55px"}}>
                            <div className="text-center">
                                <NavItems btnStyle="info" btnStyles={{margin:"5px", fontSize: "16px", fontWeight: "900", width: "80px", backgroundColor: "rgba(0, 0, 0, 0.15)"}}/>

                            </div>
                        </Col>
                    </>
                }
            </div>
        </div>
      );
    }
  }
  
  export default Header;