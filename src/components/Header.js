import React from 'react';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { versions } from '../index';
import { getDocNav } from '../navs/nav';

const NavItems = (props) => {
  let docNav = getDocNav(props.version);
  let docKeys = Object.keys(docNav);

  return (
    <div
      style={{
        marginTop: 'auto',
        marginBottom: 'auto',
        marginLeft: 'auto',
      }}
    >
      <DropdownButton
        id='Docs'
        title='Docs'
        bsStyle={props.btnStyle}
        style={props.btnStyles}
      >
        {docKeys.map((docItem) => (
          <LinkContainer
            to={`/docs/${props.version}/${docItem}`}
            className='text-center'
            key={docItem}
          >
            <MenuItem key={docItem}>{docNav[docItem].pageName}</MenuItem>
          </LinkContainer>
        ))}
      </DropdownButton>
      <LinkContainer
        to={`/api/${props.version}`}
        className='text-center'
        style={props.btnStyles}
      >
        <Button bsStyle={props.btnStyle}>API</Button>
      </LinkContainer>
      <LinkContainer
        to={`/guides/${props.version}`}
        className='text-center'
        style={props.btnStyles}
      >
        <Button bsStyle={props.btnStyle}>Guides</Button>
      </LinkContainer>
      <LinkContainer
        to={`/tools/${props.version}`}
        className='text-center'
        style={props.btnStyles}
      >
        <Button bsStyle={props.btnStyle}>Tools</Button>
      </LinkContainer>
      <LinkContainer to='/help' className='text-center' style={props.btnStyles}>
        <Button bsStyle={props.btnStyle}>Help</Button>
      </LinkContainer>
    </div>
  );
};

class Header extends React.Component {
  render() {
    return (
      <div id='headerContainer'>
        <div id='mainHeader'>
          <LinkContainer to='/' style={{ height: '42px' }}>
            <img
              style={{ height: '100%' }}
              alt='Fluree'
              src={require('../theme/assets/yeti_white_horizontal.png')}
            />
          </LinkContainer>
          <div
            className='version-toggle'
            style={{ display: 'inline-block', margin: 'auto 0 auto 1.8em' }}
          >
            <DropdownButton
              style={{
                background: 'transparent',
                color: 'white',
                padding: '5px',
                fontSize: '1em',
              }}
              title={this.props.version}
              id='version-dropdown'
            >
              {versions.map((version, idx) => (
                <MenuItem
                  key={version}
                  eventKey={idx}
                  onClick={() => this.props.changeVersion(version)}
                >
                  {version}
                </MenuItem>
              ))}
            </DropdownButton>
          </div>

          {/* <Col md={8} smHidden xsHidden> */}
          <NavItems
            version={this.props.version}
            btnStyle='success'
            btnStyles={{
              padding: '5px',
              display: 'inline-block',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              width: '100px',
              textAlign: 'center',
              fontSize: '1em',
            }}
          />

          {/* </Col> */}
          {/* <Col xs={12} mdHidden lgHidden style={{backgroundColor: "#84CEC5", height: "55px"}}>
                    <div className="text-center">
                        <NavItems version={this.props.version} btnStyle="info" btnStyles={{margin:"5px", fontSize: "16px", fontWeight: "900", width: "80px", backgroundColor: "rgba(0, 0, 0, 0.15)"}}/>
                    </div>
                </Col> */}
        </div>
        <div style={{ backgroundColor: '#00A0D1', textAlign: 'center' }}>
          <h3>
            This site only contains archived documentation. For current
            resources visit{' '}
            <a style={{ color: 'white' }} href='developers.flur.ee'>
              developers.flur.ee
            </a>
            <span
              role='img'
              aria-label='smiley-face with sunglasses'
              style={{ marginLeft: '.5rem' }}
            >
              😎
            </span>
          </h3>
        </div>
      </div>
    );
  }
}

export default Header;

//header color :  #13C6FF
