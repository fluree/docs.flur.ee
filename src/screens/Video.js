import React from 'react';
import { Player } from 'video-react';
import { fixSidebar, getTopicAndSubTopic, getNextTopic, getPreviousTopic } from '../actions/LoadTopics';
import { SidebarNav } from '../components/SidebarNav';
import get from 'lodash.get';
import marked from 'marked';
import { Button } from 'react-bootstrap';
import { getVideoNav } from '../navs/nav';

class Video extends React.Component {
    state = {
        headers: [],
        headerLinks: [],
        fixSidebar: false,
        vidName: "Introduction",
        videoFile: "schema/2.0-schema",
        videoDesc: "",
        topic: "schema",
        subtopic: "1"
    }

    componentDidMount(){
        window.addEventListener('scroll', fixSidebar.bind(this))
        if(this.props.version !== "0.9.1"){
            let videoNav = getVideoNav(this.props.version);
            this.setState({ nav: videoNav}, () => this.getVideoAndLoad())
        }
    }

    componentDidUpdate(prevProps){
        if(this.props.version !== "0.9.1" && (prevProps.match.params.topic !== this.props.match.params.topic || prevProps.match.params.subtopic !== this.props.match.params.subtopic)){
            let videoNav = getVideoNav(this.props.version);
            this.setState({ nav: videoNav}, () => this.getVideoAndLoad())
        }
    }

    componentWillUnmount(){
        window.removeEventListener('scroll', this.fixSideBar);
   }

    getVideoAndLoad = () => {
        const { nav } = this.state;
        let promise = new Promise((resolve, reject) => {
            resolve(getTopicAndSubTopic(this.props, "video", nav))
        })

        promise.then(resp => {
            let [topic, subtopic] = resp;
            this.loadVideo(topic, subtopic, nav)
        })
        .catch(resp => {
            this.loadVideo("intro", "intro", nav)
        })
    }

    loadVideo = (topic, subtopic ) => {
        const { nav } = this.state;
        let videoDesc;
        let subTopics = get(nav, [topic, "subTopics"]);
        subtopic = subtopic ? subtopic :  Object.keys(subTopics)[0]
        let videoFile = get(subTopics, [subtopic, "file"])
        let vidName = get(subTopics, [subtopic, "headerName"])
        let version = this.props.version

        try {
            videoDesc = require(`../content/${videoFile}.md`)
            fetch(videoDesc)
            .then(response => {
                return response.text()
            })
            .then(text => {
                let videoDesc = marked(text)
                let nextTopic = getNextTopic(topic, subtopic, nav, "video", version)
                console.log(nextTopic)
                let previousTopic = getPreviousTopic(topic, subtopic, nav, "video", version)
                this.setState({topic: topic, subtopic: subtopic, vidName: vidName, 
                    videoFile: videoFile, videoDesc: videoDesc, nextTopic: nextTopic, 
                    previousTopic: previousTopic})
            })
        } catch {
            this.setState({topic: topic, subtopic: subtopic, vidName: vidName, 
                videoFile: videoFile, videoDesc: "", nextTopic:  Object.keys(subTopics)[1]})         
        }
       
    }

    render() {
        let { videoFile, videoDesc, vidName, topic, subtopic, fixedSidebar, nextTopic, 
            previousTopic, nav } = this.state
        return(
            <div>
                { this.props.version === "0.9.1"
                ?
                <div style={{margin: "50px"}} className="text-center">
                    <h1 className="color-success" style={{fontVariant: "small-caps"}}>
                    There are no videos for version 0.9.1
                    </h1>
                </div>
                :
                <>
                { this.state.nav &&
                <>
                <div className="col-md-3">  
                    <div className={fixedSidebar ? "fixedSidebar" : "sidebar" }>
                        <SidebarNav robust={false} page="video" nav={nav} chosenSubTopic={subtopic} chosenTopic={topic} version={this.props.version}/>
                    </div>
                </div>
                <div className="col-md-9">
                    <div  style={{width: "90%"}}>
                        <h2 className="text-center">
                            { 
                                previousTopic 
                                ?
                                <Button onClick={() => this.props.history.push(previousTopic)} className="pull-left fluree-button">Previous</Button>
                                : null
                            }
                            {vidName}
                            {
                                nextTopic 
                                ?
                                <Button onClick={() => this.props.history.push(nextTopic)} className="pull-right fluree-button">Next</Button>
                                : null
                            }     
                        </h2>
                        <div className="text-center">
                                <Player
                                playsInline
                                poster={`https://s3.amazonaws.com/fluree-docs/${videoFile}.png`}
                                src={`https://s3.amazonaws.com/fluree-docs/${videoFile}.mp4`}/>
                        </div>
                        <div>
                            <article style={{width: "95%"}} dangerouslySetInnerHTML={{__html: videoDesc}}></article>
                        </div>
                    </div>
                </div>
                </>
                }
                </>
                }
            </div>
        )
    }
}

export default Video;