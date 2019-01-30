import React from 'react';
import { ToggleButtonGroup, ToggleButton, Button } from 'react-bootstrap';
import get from 'lodash.get';
import { SidebarNav, fixSidebar, getTopicAndSubTopic, getNextTopic, getPreviousTopic } from '../components/LoadTopics';
import marked from 'marked';
import { Search } from './DocIndex';

export const docNav = {
    "getting-started": {
        "subTopics": {
            "intro": {
                "headerName": "Intro",
                "file": "start/intro"
            },
            "installation": {
                "headerName": "Installation",
                "file": "start/installation"
            },
            "user-interface": {
                "headerName": "User Interface",
                "file": "start/ui"
            },
            "basic-schema": {
                "headerName": "Basic Schema",
                "file": "start/basic-schema"
            }
        },
        "pageName": "Getting Started"
    },
    "query": {
        "pageName": "Query",
        "subTopics": {
            "overview": {
                "headerName": "Basic Query",
                "file": "query/basic-query"
            },
            "block-query": {
                "headerName": "Block Query",
                "file": "query/block-query"
            },
            "history-query": {
                "headerName": "History Query",
                "file": "query/history-query"
            },
            "advanced-query": {
                "headerName": "Advanced Query",
                "file": "query/advanced-query"
            },
            "analytical-query": {
                "headerName": "Analytical Query",
                "file": "query/analytical-query"
            },
            "sparql": {
                "headerName": "SPARQL",
                "file": "query/sparql"
            },
            "graphql": {
                "headerName": "GraphQL",
                "file": "query/graphql"
            }
        }

    },
    "transact": {
        "pageName": "Transact",
        "subTopics": {
            "basics": {
                "headerName": "Transaction Basics",
                "file": "transact/basics"
            },
            "adding-data": {
                "headerName": "Adding Data",
                "file": "transact/adding-data"
            },
            "updating-data": {
                "headerName": "Updating Data",
                "file": "transact/updating-data"
            },
            "deleting-data": {
                "headerName": "Deleting Data",
                "file": "transact/deleting-data"
            }
        }
    },
    "smart-functions": {
        "pageName": "Smart Functions",
        "subTopics": {
            "smart-functions": {
                "headerName": "Intro",
                "file": "smart-functions/intro"
            },
            "predicate-spec": {
                "headerName": "Predicate Spec",
                "file": "smart-functions/predicate-spec"
            },
            "collection-spec": {
                "headerName": "Collection Spec",
                "file": "smart-functions/collection-spec"
            },
            "predicate-tx-spec": {
                "headerName": "Predicate Tx Spec",
                "file": "smart-functions/predicate-tx-spec"
            },
            "rules": {
                "headerName": "Rules and Rule Functions",
                "file": "smart-functions/rules"
            },
            "rule-example": {
                "headerName": "Rule Example",
                "file": "smart-functions/rule-example"
            },
            "fns-in-txs": {
                "headerName": "In Transactions",
                "file": "smart-functions/fns-in-txs"
            }
        }
    },
    "identity": {
        "pageName": "Identity",
        "subTopics": {
            "public-private-keys": {
                "headerName": "Public and Private Keys",
                "file": "identity/public-private-keys"
            },
            "auth-records": {
                "headerName": "Auth Records",
                "file": "identity/auth-records"
            },
            "signatures": {
                "headerName": "Signatures",
                "file": "identity/signatures"
            }
        }
    },
    "schema": {
        "pageName": "Schema",
        "subTopics": {
            "overview": {
                "headerName": "Overview",
                "file": "schema/overview"
            },
            "collections": {
                "headerName": "Collections",
                "file": "schema/collections"
            },
            "predicates": {
                "headerName": "Predicates",
                "file": "schema/predicates"
            }
        }
    },
    "database-setup": {
        "pageName": "Database Set-up",
        "subTopics": {
            "creating-a-db": {
                "headerName": "Creating a DB",
                "file": "db-setup/creating-a-database"
            },
            "database-settings": {
                "headerName": "Database Settings",
                "file": "db-setup/database-settings"
            },
            "forking-a-db": {
                "headerName": "Forking a DB",
                "file": "db-setup/forking-a-database"
            },
            "deleting-a-database": {
                "headerName": "Deleting a DB",
                "file": "db-setup/deleting-a-database"
            }
        }
    },
    "infrastructure": {
        "pageName": "Infrastructure",
        "subTopics": {
            "db-infrastructure": {
                "headerName": "Database Infrastructure",
                "file": "infrastructure/db_infrastructure"
            },
            "network-infrastructure": {
                "headerName": "Network Infrastructure",
                "file": "infrastructure/network_infrastructure"
            },
            "system-collections": {
                "headerName": "System Collections",
                "file": "infrastructure/system_collections"
            },
            "application-best-practices": {
                "headerName": "Best Practices",
                "file": "infrastructure/app_best_practices"
            }
        }
    },
    "examples": {
        "pageName": "Examples",
        "subTopics": {
            "cryptocurrency": {
                "headerName": "Cryptocurrency",
                "file": "examples/cryptocurrency"
            },
            "voting": {
                "headerName": "Voting",
                "file": "examples/voting"
            }
        }
    }
}

export const languages = ["flureeql", "graphql", "curl", "sparql"]

class Docs extends React.Component {
    state = {
        headers: [],
        headerLinks: [],
        language: "flureeql",
        fixedSidebar: false,
        displaySearch: false,
        searchValue: ""
    }

    componentDidMount(){
        if(this.props.match.path === "/docs/search"){
            this.setState({displaySearch: true})
        } else {
            this.setState({displaySearch: false})
        }
        window.addEventListener('scroll', fixSidebar.bind(this))
        this.getTopicAndLoad(this.props)
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.match.path !== "/docs/search" & this.props.match.path === "/docs/search"){
            this.setState({displaySearch: true})
        }

        if(prevProps.match.params.topic !== this.props.match.params.topic || prevProps.match.params.subtopic !== this.props.match.params.subtopic){
            this.setState({displaySearch: false})
            this.getTopicAndLoad(this.props)
        }
    }

    componentWillUnmount(){
        window.removeEventListener('scroll', this.fixSideBar);
   }

    getTopicAndLoad = (props) => {
        if(props.match.path === "/docs/search"){
            this.setState({displaySearch: true})
        } else {
            let promise = new Promise((resolve, reject) => {
                resolve(getTopicAndSubTopic(props, "docs", docNav))
            })

            promise.then((resp) => {
                let [topic, subtopic] = resp;
                this.loadSection(topic, subtopic, docNav)
            }) 
            .catch(resp => {
                this.loadSection("getting-started", "intro", docNav)
            })
        }
    }

    loadSection = (topic, subtopic, nav) => {
        let section;
        let subTopics = get(nav, [topic, "subTopics"]);
        subtopic = subtopic ? subtopic :  Object.keys(subTopics)[0]
        let fileName = get(subTopics, [subtopic, "file"])

        try {
            section = require(`../content/docs/${fileName}.md`)
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

            let language = this.state.language
            let html = this.loadLanguage(markedHTML, language)
            let nextTopic = getNextTopic(topic, subtopic, docNav, "docs")
            let previousTopic = getPreviousTopic(topic, subtopic, docNav, "docs")

            const headers = []
            const headerLinks = []
            keys.map(key => {
                headers.push(h3s[key].innerText)
                headerLinks.push(h3s[key].id)
                return null
            })
        this.setState({text: text, markdown: html, nextTopic: nextTopic, previousTopic: previousTopic, topic: topic, subtopic: subtopic, headers: headers, headerLinks: headerLinks}, this.scrollToTop)
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

    loadLanguage = (html, language) =>{
        html = html ? html : this.getHTML()
        let codeSegments = html.getElementsByTagName('pre')
        for(let segment of codeSegments){
            let code = segment.getElementsByTagName('code')[0]
            if(code.classList.contains(`language-${language}`)){
                segment.style.display = "block";
            } else if (code.classList.contains(`language-all`)){
                segment.style.display = "block";
            } else {
                segment.style.display = "none";
            }
        }
        return html.outerHTML
    }

    changeLanguage = (html, language) => {
        html = this.loadLanguage(html, language)
        this.setState({language: language, markdown: html})
    }

    pushSearch(){
        let { searchValue } = this.state; 
        this.props.history.push(`/docs/search?search=${searchValue}`)
    }

    render(){
        const { markdown, headers, headerLinks, topic, subtopic, language, previousTopic, nextTopic,  fixedSidebar, displaySearch } = this.state;
        return(
            <div className="row">

                    <div className="col-md-4 mt20 mb20">
                    <div className={fixedSidebar ? "fixedSidebar" : "sidebar" }>
                            <div>
                                <ToggleButtonGroup 
                                    name="language" 
                                    type="radio" 
                                    value={language}
                                    onChange={(e) => this.changeLanguage(null, e)}>
                                    { languages.map(lang => <ToggleButton key={lang} style={{fontVariant: "small-caps"}} value={lang}>{lang}</ToggleButton>)}
                                </ToggleButtonGroup>
                            </div>
                            <SidebarNav page="docs" nav={docNav} robust={false} chosenSubTopic={subtopic} chosenTopic={topic} headers={headers} headerLinks={headerLinks}/>
                    </div>
                </div>
                    <div className="col-md-8 mb20">
                    <div className="row">
                        <div className="col-xs-6"/>
                        <div className="col-xs-6">
                                <div className="mt10 pull-right" style={{marginRight: "20px"}}>
                                    <form onSubmit= {(e) =>     {   e.preventDefault()
                                                                    this.pushSearch()}}>
                                        <input type="text" value={this.state.searchValue} onChange={(e) => this.setState({searchValue: e.target.value})} placeholder="Search Docs.." name="search"/>
                                        <button><i className="fa fa-search"></i></button>
                                    </form>
                                </div>
                        </div>
                    </div>
                    {   displaySearch 
                        ?
                        <Search {...this.props}/>
                        :
                        <div>
                            <article className="mb20 docs-section" style={{minHeight: "400px", width: "95%"}} dangerouslySetInnerHTML={{__html: markdown}}></article>
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
                }
                </div>
                </div>
        )
    }
}

export default Docs;