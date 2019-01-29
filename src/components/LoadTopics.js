import React from 'react';
import get from 'lodash.get';
import { LinkContainer } from 'react-router-bootstrap';

class SectionNav extends React.Component {
    state = {

    }
    render() {
        const { headers, headerLinks } = this.props 
        return(
            <div className="third-level-nav">
                {headers && headerLinks
                    ?
                    headers.map((header, index) => <a key={header} href={`#${headerLinks[index]}`}><p>{header}</p></a>)
                :
                null}
            </div>
        )
    }
}

export function SidebarNav(props){
    let { nav, robust }  = props
    let keys = Object.keys(nav)
    let headers = keys.map(key => get(nav[key], "pageName"))
    return (<div className="mt20">
        { keys.map((item, idx) => {
            let subTopicObj = get(nav, [ item, "subTopics"])
            let subTopics = Object.keys(subTopicObj)
            return( 
                <div key={item}>
                    <div className="top-level-nav">
                        <LinkContainer style={{fontWeight: 600, cursor: "pointer"}} to={`/${props.page}/${item}/${subTopics[0]}`}>
                        <div>
                            {headers[idx]}
                        </div>
                        </LinkContainer>
                    </div>
                    { subTopics.map(subtopic => {
                         if(props.chosenTopic === item && props.chosenSubTopic === subtopic){
                            return (<div className="second-level-nav chosen" key={subtopic}>
                                        <LinkContainer to={`/${props.page}/${item}/${subtopic}`}>
                                        <div>
                                            {get(subTopicObj, [subtopic, "headerName"])}
                                        </div>
                                        </LinkContainer>
                                        <SectionNav {...props} />
                                    </div>)
                        } else if (props.chosenTopic === item || robust === true) {
                            return(<div className="second-level-nav" key={subtopic}>
                                        <LinkContainer to={`/${props.page}/${item}/${subtopic}`}>
                                        <div>
                                            {get(subTopicObj, [subtopic, "headerName"])}
                                        </div>
                                        </LinkContainer>
                                    </div>
                            )
                        }
                        return null;
                    })}
                </div>
        )})}
    </div>
    )}

export function fixSidebar(){
        if(window.scrollY >= 105) {
            this.setState({fixedSidebar: true})
        } else {
            this.setState({fixedSidebar: false})
        }
    }

export function getTopicAndSubTopic(props, page, nav){
        let topic = props.match.params.topic; 
        let subtopic = props.match.params.subtopic;

        if(!topic){
            topic = Object.keys(nav)[0]
            let topicObject = nav[topic]
            let subTopics = get(topicObject, "subTopics")
            subtopic = Object.keys(subTopics)[0]
        } else if(!subtopic){
            let subTopics = get(nav, [topic, "subTopics"]);
            let key = Object.keys(subTopics)[0]
            subtopic = key
        }   
        return [topic, subtopic]
    }

export function getNextTopic(topic, subtopic, nav, page){
        let subTopicObj = get(nav, [topic, "subTopics"])
        let subTopics = Object.keys(subTopicObj)
        let idx = subTopics.indexOf(subtopic)
        let nextIdx = idx + 1
        if (nextIdx === subTopics.length) {
            // Get first item of next TOPIC
            let topics = Object.keys(nav)
            let currentTopicIdx = topics.indexOf(topic)
            let nextTopicIdx = currentTopicIdx + 1
            if(nextTopicIdx !== topics.length) {
                let nextTopic = topics[nextTopicIdx]
                let subTopicObj = get(nav, [nextTopic, "subTopics"])
                let subTopics = Object.keys(subTopicObj)
                return `/${page}/${nextTopic}/${subTopics[0]}`
            }
        } else {
            let nextSubTopic = subTopics[nextIdx]
            // Get next subtopic
            return `/${page}/${topic}/${nextSubTopic}`
        }
}

export function getPreviousTopic(topic, subtopic, nav, page){
        let subTopicObj = get(nav, [topic, "subTopics"])
        let subTopics = Object.keys(subTopicObj)
        let idx = subTopics.indexOf(subtopic)
        if (idx === 0) {
            // Get last item of the previous TOPIC
            let topics = Object.keys(nav)
            let currentTopicIdx = topics.indexOf(topic)
            if(currentTopicIdx !== 0) {
                let prevTopicIdx = currentTopicIdx - 1
                let prevTopic = topics[prevTopicIdx]
                let subTopicObj = get(nav, [prevTopic, "subTopics"])
                let subTopics = Object.keys(subTopicObj)
                let prevSubTopicIdx = subTopics.length - 1
                return `/${page}/${prevTopic}/${subTopics[prevSubTopicIdx]}`
            }
        } else {
            let prevIdx = idx - 1
            let prevSubTopic = subTopics[prevIdx]
            // Get previous subtopic
            return `/${page}/${topic}/${prevSubTopic}`
        }
    }

export function PreviousSidebarNav(props) {
    let { nav, robust } = props;
    let hash = props.location.hash;
    let keys = Object.keys(nav)
    let headers = keys.map((key, idx) => get(nav, [idx , "headerName"]))
    return(<div className="mt20">
            { keys.map((key, idx) => {
                let subTopicObj = get(nav, [ key, "subTopics"])
                let subTopics = Object.keys(subTopicObj);
                return( 
                    <div key={headers[idx]}>
                        <div className="top-level-nav">
                            <a style={{fontWeight: 600, cursor: "pointer"}} href={`#${nav[key]["link"]}`}
                                className={`#${nav[key]["link"]}` === hash ? "chosen": null}
                            >
                            <div>
                                {headers[idx]}
                            </div>
                            </a>
                        </div>
                        { subTopics.map((subtopic, idx) => {
                            let subTopicName = subTopicObj[idx]["headerName"]
                                return (<div className="second-level-nav chosen" key={subTopicName}>
                                            <a href={`#${nav[key]["subTopics"][idx]["link"]}`}
                                            className={`#${nav[key]["subTopics"][idx]["link"]}` === hash ? "chosen": null}>
                                            <div>
                                                {get(subTopicObj, [idx, "headerName"])}
                                            </div>
                                            </a>
                                        </div>)
                            return null;
                        })}
                    </div>
            )
            })}
    </div>)

}