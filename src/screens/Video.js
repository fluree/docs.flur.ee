import React from 'react';
import { Player } from 'video-react';
import { fixSidebar, getTopicAndSubTopic, getNextTopic, getPreviousTopic } from '../actions/LoadTopics';
import { SidebarNav } from '../components/SidebarNav';
import get from 'lodash.get';
import marked from 'marked';
import { Button } from 'react-bootstrap';

const baseVideoNav = {
    "intro": {
        "pageName": "Introduction",
        "subTopics": {
            "intro": {
                "headerName": "Intro",
                "file": "intro/1.0-intro"
            },
            "install-mac": {
                "headerName": "Install on Mac",
                "file": "intro/1.1-install-file"
            },
            "install-homebrew": {
                "headerName": "Install With Homebrew",
                "file": "intro/1.2-install-homebrew"
            },}
    },
    "schema": {
        "pageName": "Schema",
        "subTopics": {
        "create-1": {
            "headerName": "Creating a Schema: Part 1",
            "file": "schema/2.0-schema"
        }, 
        "create-2": {
            "headerName": "Creating a Schema: Part 2",
            "file": "schema/2.1-schema"
        },
        "docs": {
            "headerName": "Using the Docs",
            "file": "schema/2.2-schema-docs"
        },
        "schema-challenge": {
            "headerName": "Schema Challenge",
            "file": "schema/2.3-schema-challenge"
        },
        "schema-challenge-solution": {
            "headerName": "Schema Challenge: Solution",
            "file": "schema/2.4-schema-challenge-solution"
        }
        }
    },
    "query": {
        "pageName": "Query",
        "subTopics": {
            "add-schema": {
                "headerName": "Add Basic Schema",
                "file": "query/3.1-query-add-basic"
            },
            "query-basic": {
                "headerName": "Basic Queries",
                "file": "query/3.2-query-basic"
            },
            "query-basic-select": {
                "headerName": "Basic Query: Select Key",
                "file": "query/3.3-query-basic-select"
            },
            "query-basic-challenge": {
                "headerName": "Basic Query: Challenge",
                "file": "query/3.4-query-basic-challenge"
            },
            "query-basic-challenge-solution": {
                "headerName": "Basic Query: Challenge Solution",
                "file": "query/3.5-query-basic-challenge-solution"
            },
            "query-basic-limit-block": {
                "headerName": "Basic Query: Limit and Block",
                "file": "query/3.6-query-basic-limit-block"
            },
            "query-block": {
                "headerName": "Block Queries",
                "file": "query/3.7-block-queries"
            },
            "query-history": {
                "headerName": "History Queries",
                "file": "query/3.8-history-queries"
            },
            "query-crawl": {
                "headerName": "Crawling Relationships",
                "file": "query/3.9-query-crawl"
            },
            "query-crawl-reverse": {
                "headerName": "Crawling Relationships in Reverse",
                "file": "query/3.10-query-crawl-reverse"
            },
            "query-sub-select": {
                "headerName": "Sub-Select Options in Queries",
                "file": "query/3.11-query-sub-select"
            },
            "query-recursion": {
                "headerName": "Recursion in Queries",
                "file": "query/3.12-query-recursion"
            },
            "query-multi": {
                "headerName": "Multi Queries",
                "file": "query/3.13-query-multi"
            },
            "query-analytical": {
                "headerName": "Analytical Queries",
                "file": "query/3.14-analytical-queries"
            },
            "query-analytical-agg": {
                "headerName": "Analytical Queries: Aggregate Functions",
                "file": "query/3.15-analytical-queries-agg"
            },
            "query-analytical-block": {
                "headerName": "Analytical Queries: Across Blocks",
                "file": "query/3.16-analytical-queries-block"
            },
            "query-analytical-triple-options": {
                "headerName": "Analytical Queries: Triple Options",
                "file": "query/3.17-analytical-queries-triple-options"
            },
            "query-analytical-wikidata": {
                "headerName": "Analytical Queries: Wikidata",
                "file": "query/3.18-analytical-queries-wikidata"
            },
            "query-sparql": {
                "headerName": "SPARQL",
                "file": "query/3.19-SPARQL"
            },
            "query-graphql": {
                "headerName": "GraphQL",
                "file": "query/3.20-GraphQL"
            }
        },
    },
        "transact": {
            "pageName": "Transact",
            "subTopics": {
                "transact-keys": {
                    "headerName": "Transact Keys",
                    "file": "transact/4.1-transact-keys"
                }, 
                "temp-ids": {
                    "headerName": "Temporary Ids",
                    "file": "transact/4.2-temp-ids"
                },
                "adding-data": {
                    "headerName": "Adding Data",
                    "file": "transact/4.3-adding-data"
                },
                "nested-txns": {
                    "headerName": "Nested Transactions",
                    "file": "transact/4.4-nested-txns"
                },
                "updating-data": {
                    "headerName": "Updating Data",
                    "file": "transact/4.5-updating-data"
                },
                "upserting-data": {
                    "headerName": "Upserting Data",
                    "file": "transact/4.6-upserting-data"
                },
                "deleting-data": {
                    "headerName": "Deleting Data",
                    "file": "transact/4.7-deleting-data"
                }
            }
        }
}

const videoNav = {
    "0.9.1": { "intro": baseVideoNav["intro"]},
    "0.9.5": baseVideoNav,
    "0.9.6": baseVideoNav
}


class Video extends React.Component {
    state = {
        headers: [],
        headerLinks: [],
        fixSidebar: false,
        vidName: "Introduction",
        videoFile: "schema/2.0-schema",
        videoDesc: "",
        topic: "schema",
        subtopic: "1",
        videoNavVersion: videoNav[this.props.version]
    }

    componentDidMount(){
        window.addEventListener('scroll', fixSidebar.bind(this))
        this.getVideoAndLoad()
    }

    componentDidUpdate(prevProps, prevState){
        console.log("PREV PROPS!", prevProps)
        // if(prevProps.match.params.topic !== this.props.match.params.topic || prevProps.match.params.subtopic !== this.props.match.params.subtopic){
        //     this.getVideoAndLoad()
        // }
    }

    componentWillUnmount(){
        window.removeEventListener('scroll', this.fixSideBar);
   }

    getVideoAndLoad = () => {
        let videoNavVersion = videoNav[this.props.version];
        let promise = new Promise((resolve, reject) => {
            resolve(getTopicAndSubTopic(this.props, "video", videoNavVersion))
        })

        promise.then(resp => {
            let [topic, subtopic] = resp;
            this.loadVideo(topic, subtopic, videoNavVersion)
        })
        .catch(resp => {
            this.loadVideo("intro", "intro", videoNavVersion)
        })
    }

    loadVideo = (topic, subtopic, nav) => {
        let videoNavVersion = this.state.videoNavVersion;
        let videoDesc;
        let subTopics = get(nav, [topic, "subTopics"]);
        subtopic = subtopic ? subtopic :  Object.keys(subTopics)[0]
        let videoFile = get(subTopics, [subtopic, "file"])
        let vidName = get(subTopics, [subtopic, "headerName"])

        try {
            videoDesc = require(`../content/videos/${videoFile}.md`)
            fetch(videoDesc)
            .then(response => {
                return response.text()
            })
            .then(text => {
                let videoDesc = marked(text)
                let nextTopic = getNextTopic(topic, subtopic, videoNavVersion, "video")
                let previousTopic = getPreviousTopic(topic, subtopic, videoNavVersion, "video")
                this.setState({topic: topic, subtopic: subtopic, vidName: vidName, videoFile: videoFile, videoDesc: videoDesc, nextTopic: nextTopic, previousTopic: previousTopic})
            })
        } catch {
            this.setState({topic: topic, subtopic: subtopic, vidName: vidName, videoFile: videoFile, videoDesc: "", nextTopic:  Object.keys(subTopics)[1]})         
        }
       
    }

    render() {
        let { videoFile, videoDesc, vidName, topic, subtopic, fixedSidebar, nextTopic, previousTopic, videoNavVersion } = this.state
        return(
            <div>
                <div className="col-md-3">  
                    <div className={fixedSidebar ? "fixedSidebar" : "sidebar" }>
                        <SidebarNav robust={false} page="video" nav={videoNavVersion} chosenSubTopic={subtopic} chosenTopic={topic}/>
                    </div>
                </div>
                <div className="col-md-9">
                    <div  style={{width: "90%"}}>
                        <h2 className="text-center">
                            { 
                                previousTopic 
                                ?
                                <Button onClick={() => this.props.history.push(previousTopic)} className="pull-left">Previous</Button>
                                : null
                            }
                            {vidName}
                            {
                                nextTopic 
                                ?
                                <Button onClick={() => this.props.history.push(nextTopic)} className="pull-right">Next</Button>
                                : null
                            }     
                        </h2>
                        <div className="text-center">
                                <Player
                                playsInline
                                poster={`https://s3.amazonaws.com/fluree-docs/videos/${videoFile}.png`}
                                src={`https://s3.amazonaws.com/fluree-docs/videos/${videoFile}.mp4`}/>
                        </div>
                        <div>
                            <article style={{width: "95%"}} dangerouslySetInnerHTML={{__html: videoDesc}}></article>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Video;