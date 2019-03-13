import React from 'react';
import { SidebarNav, fixSidebar, getTopicAndSubTopic, getNextTopic, getPreviousTopic } from '../components/LoadTopics';
import get from 'lodash.get';
import marked from 'marked';
import { Button, Form, FormGroup, ControlLabel, FormControl, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { parseJSON } from '../flureeFetch';
import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/theme/xcode'

const apiNav = {
    "intro": {
        "pageName": "Intro",
        "subTopics": {
            "intro": {
                "headerName": "Intro",
                "file": "overview"
            }
        }
    },
    "downloaded-endpoints": {
        "pageName": "Downloaded Endpoints",
        "subTopics": {
            "overview": {
                "headerName": "Overview",
                "file": "downloaded-overview"
            },
            "downloaded-examples": {
                "headerName": "Examples",
                "file": "downloaded-examples"
            }
        }
    },
    "hosted-endpoints": {
        "pageName": "Hosted Endpoints",
        "subTopics": {
            "overview": {
                "headerName": "Overview",
                "file": "hosted-overview"
            },
            "getting-tokens": {
                "headerName": "Getting Tokens",
                "file": "getting-tokens"
            },
            "hosted-examples": {
                "headerName": "Examples",
                "file": "hosted-examples"
            }
        }
    }
}

const endpoints = [ "block", "graphql", "history", "multi-query", "query", "signin", "sparql", "transact"] 

class API extends React.Component {
    state = {
        headers: [],
        headerLinks: [],
        fixedSidebar: false
    }

    componentDidMount(){
        window.addEventListener('scroll', fixSidebar.bind(this))
        this.getTopicAndLoad()
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.match.params.topic !== this.props.match.params.topic || prevProps.match.params.subtopic !== this.props.match.params.subtopic){
            this.getTopicAndLoad()
        }
    }

    componentWillUnmount(){
        window.removeEventListener('scroll', this.fixSideBar);
   }

   getTopicAndLoad = () => {
        let promise = new Promise((resolve, reject) => {
            resolve(getTopicAndSubTopic(this.props, "api", apiNav))
        })

        promise.then((resp) => {
            let [topic, subtopic] = resp;
            this.loadSection(topic, subtopic, apiNav)
        }) 
        .catch(resp => {
            this.loadSection("intro", "intro", apiNav)
        })
   }

    loadSection = (topic, subtopic, nav) => {
        let section;
        let subTopics = get(nav, [topic, "subTopics"]);
        subtopic = subtopic ? subtopic :  Object.keys(subTopics)[0]
        let fileName = get(subTopics, [subtopic, "file"])

        try {
            section = require(`../content/api/${fileName}.md`)
        } catch {
            section = require(`../content/docs/404.md`)            
        }
        
        fetch(section)
        .then(response => {
            return response.text()
        })
        .then(text => {
            let markdown = marked(text)
            let markedHTML = document.createElement('div')
            markedHTML.innerHTML= markdown

            let h3s = markedHTML.getElementsByTagName("h3")
            let keys = Object.keys(h3s)

            let nextTopic = getNextTopic(topic, subtopic, apiNav, "api")
            let previousTopic = getPreviousTopic(topic, subtopic, apiNav, "api")

            const headers = []
            const headerLinks = []
            keys.map(key => {
                headers.push(h3s[key].innerText)
                headerLinks.push(h3s[key].id)
            return null })
        this.setState({text: text, markdown: markdown, nextTopic: nextTopic, previousTopic: previousTopic, topic: topic, subtopic: subtopic, headers: headers, headerLinks: headerLinks}, this.scrollToTop)
        return null
    })
    }

    scrollToTop = () => {
        if (!this.props.location.hash) {
            window.scrollTo(0, 0)
        }
    }

    getHTML = () => {
        const markdown = this.state.markdown
        let markedHTML = document.createElement('div')
        markedHTML.innerHTML= markdown
        return markedHTML
    }

    render(){
        const { markdown, headers, headerLinks, topic, subtopic, previousTopic, nextTopic,  fixedSidebar } = this.state;
       
        return (
            <div>
                <div className="col-sm-3">
                    <div className={fixedSidebar ? "fixedSidebar" : "sidebar" }>
                        <SidebarNav page="api" nav={apiNav} robust={true} chosenSubTopic={subtopic} chosenTopic={topic} headers={headers} headerLinks={headerLinks} />
                    </div>
                </div>
                <div className="col-sm-6">
                    <article className="mt20 mb20 docs-section" style={{minHeight: "400px", width: "95%"}} dangerouslySetInnerHTML={{__html: markdown}}></article>
                    <div style={{width: "85%"}}>
                        { 
                            previousTopic 
                            ?
                            <Button onClick={() => this.props.history.push(previousTopic)} className="pull-left">Previous</Button>
                            : null
                        }
                        {
                            nextTopic 
                            ?
                            <Button onClick={() => this.props.history.push(nextTopic)} className="pull-right">Next</Button>
                            : null
                        }       
                    </div>
                </div>
                <div className="col-sm-3">
                    <div 
                    // style={fixedSidebar ? {position: "fixed", top: "20px", right: "20px", bottom: "20px", overflowY: "scroll"} : {paddingLeft: "20px"} }
                    >
                        <APITest />
                    </div>
                </div>
            </div>
        )
    }
}

class APITest extends React.Component {
    state = {
        host: "downloaded",
        ip: "http://localhost:8080",
        network: "dev",
        dbid: "$network",
        endpoint: "query",
        results: "",
        account: "",
        token: ""
    }

    submitTransaction = () => {
        let header, url;
        let { host, token, account, endpoint, request, dbid, ip, network} = this.state
        if(host === "hosted"){
            let prefix = endpoint === "signin" ? "" : "db/"
            header= {Authorization: `Bearer ${token}`}
            url = `https:${account}.beta.flur.ee/api/${prefix}${endpoint}`
        } else {
            url = `${ip}/fdb/${network}/${dbid}/${endpoint}`
            header= {}
        }

        fetch(url, {
            method: "POST",
            body: request,
            headers: header
        })
        .then(res => {
            return parseJSON(res)
        })
        .then(res => {
            this.setState({results: JSON.stringify(res.json, null, 2)})
        }) 
        .catch(err => {
            this.setState({results: JSON.stringify(err, null, 2)})
        })
        
    }

    render(){
        const { host, ip, network, dbid, account, token, request, results, endpoint } = this.state
        return(
            <div className="mt20">
                <div className="mb20">
                    <h2>Test the Endpoints</h2>
                    <Form onSubmit={(e) => e.preventDefault()}>
                        <FormGroup controlId="host">
                            <ToggleButtonGroup 
                                name="host" 
                                type="radio" 
                                value={this.state.host}
                                onChange={(e) => this.setState({host: e})}>
                                    <ToggleButton key="hosted" style={{fontVariant: "small-caps"}} value="hosted">Hosted</ToggleButton>
                                    <ToggleButton key="downloaded" style={{fontVariant: "small-caps"}} value="downloaded">Downloaded</ToggleButton>
                            </ToggleButtonGroup>
                        </FormGroup>
                        {
                            host === "downloaded"
                            ?
                            <div>
                            <FormGroup controlId="ip">
                                <ControlLabel>IP Address</ControlLabel>
                                <FormControl
                                    type="text"
                                    placeholder="http://localhost:8080"
                                    value={ip}
                                    onChange={(e) => this.setState({ip: e.target.value})}>
                                    </FormControl>
                            </FormGroup>
                            <FormGroup controlId="network">
                                <ControlLabel>Network</ControlLabel>
                                <FormControl
                                    type="text"
                                    placeholder="dev"
                                    value={network}
                                    onChange={(e) => this.setState({network: e.target.value})}>
                                    </FormControl>
                            </FormGroup>
                            <FormGroup controlId="dbid">
                                <ControlLabel>DBID</ControlLabel>
                                <FormControl
                                    type="text"
                                    placeholder="test"
                                    value={dbid}
                                    onChange={(e) => this.setState({dbid: e.target.value})}>
                                    </FormControl>
                            </FormGroup>
                            </div>
                            :
                            <div>
                                <FormGroup controlId="Account">
                                    <ControlLabel>Account</ControlLabel>
                                    <FormControl
                                        type="text"
                                        placeholder="Account"
                                        value={account}
                                        onChange={(e) => this.setState({account: e.target.value})}>
                                    </FormControl>
                                </FormGroup>
                                <FormGroup controlId="Token">
                                    <ControlLabel>Token</ControlLabel>
                                    <FormControl
                                        type="text"
                                        placeholder="Token"
                                        value={token}
                                        onChange={(e) => this.setState({token: e.target.value})}>
                                    </FormControl>
                                </FormGroup>
                            </div>
                        }
                    
                        <FormGroup controlId="endpoint">
                            <ControlLabel>Endpoint</ControlLabel>
                            <FormControl
                                componentClass="select"
                                placeholder=""
                                value={endpoint}
                                onChange={(e) => this.setState({endpoint: e.target.value})}>
                                {endpoints.map(ep => <option value={ep}>{ep}</option>)}
                                </FormControl>
                        </FormGroup>
                        <FormGroup controlId="request">
                            <ControlLabel>Request</ControlLabel>
                            <AceEditor
                            mode="json"
                            theme="xcode"
                            fontSize={14}
                            showPrintMargin={true}
                            showGutter={true}
                            onChange={(e) => this.setState({request: e})}
                            width= {"90%"}
                            height= {"300px"}
                            highlightActiveLine={true}
                            value={request}
                            editorProps={{ $blockScrolling: true }}
                            setOptions={{
                            showLineNumbers: true,
                            tabSize: 2 
                            }}/>
                        </FormGroup>
                    </Form>
                    <div className="text-right">
                        <Button bsStyle="success" onClick={this.submitTransaction}>Submit</Button>
                    </div>
                </div>
                <div className="mt20">
                    <Form>
                        <FormGroup controlId="results">
                            <ControlLabel>Results</ControlLabel>
                            <AceEditor
                            mode="json"
                            theme="xcode"
                            fontSize={14}
                            showPrintMargin={true}
                            showGutter={true}
                            width= {"90%"}
                            height= {"300px"}
                            highlightActiveLine={true}
                            value={results}
                            editorProps={{ $blockScrolling: true }}
                            setOptions={{
                            showLineNumbers: true,
                            tabSize: 2 
                            }}/>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        )
    }
}

export default API;