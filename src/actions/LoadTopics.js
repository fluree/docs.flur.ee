import get from 'lodash.get';
import { versions } from "../index";

export function fixSidebar(){
        if(window.scrollY >= 105) {
            this.setState({fixedSidebar: true})
        } else {
            this.setState({fixedSidebar: false})
        }
    }

export function getTopicAndSubTopic(props, nav){
        let version = props.match.params.version;
        let topic = props.match.params.topic; 
        let subtopic = props.match.params.subtopic;

        if(version && !versions.includes(version)) {
            // embedded link from markdown does not include version
            // so, map topic to subtopic & version to topic
            subtopic = topic;
            topic = version;
        }

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

export function getNextTopic(topic, subtopic, nav, page, version){
    
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
                return `/${page}/${version}/${nextTopic}/${subTopics[0]}`
            }
        } else {
            let nextSubTopic = subTopics[nextIdx]
            // Get next subtopic
            return `/${page}/${version}/${topic}/${nextSubTopic}`
        }
}

export function getPreviousTopic(topic, subtopic, nav, page, version){
    
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
                return `/${page}/${version}/${prevTopic}/${subTopics[prevSubTopicIdx]}`
            }
        } else {
            let prevIdx = idx - 1
            let prevSubTopic = subTopics[prevIdx]
            // Get previous subtopic
            return `/${page}/${version}/${topic}/${prevSubTopic}`
        }
    }