import React from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/theme/xcode'
import { Button } from 'react-bootstrap';
// import { signedFlureeFetch, parseJSON } from '../flureeFetch';

class Editor extends React.Component {
    state = {
        value: "",
        solution: this.props.solution,
    }
    
    componentDidMount(){
        this.setState({value: "", solution: this.props.solution, result: ""})
    }

    componentDidUpdate(prevProps){
        if(prevProps.solution !== this.props.solution){
            this.setState({value: "", solution: this.props.solution, result: ""})
        }
    }

    onChange = (newValue) => {
        this.setState({value: newValue})
    }

    getSolution = () => {
        this.setState({result: JSON.stringify(this.state.solution, null, 2)})
    }

    // issueQuery = () => {
    //     const query = this.state.value
    //     const parsedQuery = JSON.parse(query)
    //     const fullUri = `http://localhost:8080/fdb/$network/query`
    //     signedFlureeFetch(fullUri, parsedQuery)
    //     .then(response => parseJSON(response))
    //     .then(response => {
    //         const formattedResult = JSON.stringify(response.json, null, 2);
    //         this.setState({result: formattedResult})
    //     })
    //     .catch(err => {
    //         let formattedErr = JSON.stringify(err, null, 2)
    //         this.setState({result: formattedErr})
    //     })
    // }

    render() {
        return (
            <div style={{margin: "5px 40px 0px 20px"}}>
                <div className="text-right" style={{width: "90%"}}>
                      <Button onClick={this.getSolution}>Get Solution</Button>
                    {/* <Button bsStyle="success" onClick={this.issueQuery}>Query</Button> */}
                </div>
                <h2 className="text-center" style={{padding: "2px", color: "#8e8989", fontFamily: 'Open Sans'}}>Test Here</h2>
                <AceEditor
                    mode="json"
                    theme="xcode"
                    fontSize={14}
                    showPrintMargin={true}
                    showGutter={true}
                    onChange={this.onChange}
                    width= {"90%"}
                    height= {"300px"}
                    highlightActiveLine={true}
                    value={this.state.value}
                    editorProps={{ $blockScrolling: true }}
                    setOptions={{
                    showLineNumbers: true,
                    tabSize: 2 
                    }}/>
                <h2 className="text-center" style={{padding: "2px", color: "#8e8989", fontFamily: 'Open Sans'}}>Solution</h2>
                <AceEditor
                    mode="json"
                    theme="xcode"
                    fontSize={14}
                    showPrintMargin={true}
                    showGutter={true}
                    width= {"90%"}
                    height= {"300px"}
                    highlightActiveLine={true}
                    value={this.state.result}
                    editorProps={{ $blockScrolling: true }}
                    setOptions={{
                    showLineNumbers: true,
                    tabSize: 2 
                    }}/>
                     
            </div>
        )
    }
}

export default Editor;