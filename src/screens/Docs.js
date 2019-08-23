import React from 'react';
import { ToggleButtonGroup, ToggleButton, Button } from 'react-bootstrap';
import get from 'lodash.get';
import { fixSidebar, getTopicAndSubTopic, getNextTopic, getPreviousTopic } from '../actions/LoadTopics';
import { SidebarNav } from '../components/SidebarNav';
import marked from 'marked';
// import { Search } from './DocIndex';
import Notifications, { notify } from 'react-notify-toast'
import { getDocNav, docNav091, docNav095} from '../navs/docNav';

export const languages = ["flureeql", "graphql", "curl", "sparql"]

class Docs extends React.Component {
    state = {
        headers: [],
        headerLinks: [],
        language: "flureeql",
        fixedSidebar: false,
        displaySearch: false,
        searchValue: "",
        hashAnchor: this.props.location.hash || "",
        scrollElementId: ""
    }

    componentDidMount(){
        // if(this.props.match.path === "/docs/search"){
        //     this.setState({displaySearch: true})
        //     let query = this.props.location.search
        //     let queryPattern = /\?search=/
        //     if(queryPattern.test(query)) {
        //         let searchValue = new URLSearchParams(query).get('search')
        //         this.setState({searchValue: searchValue})
        //         this.props.history.push(`/docs/search?search=${searchValue}`)
        //     }
        // } else {
        //     this.setState({displaySearch: false})
        // }
        // window.addEventListener('scroll', fixSidebar.bind(this))
        let docNav = getDocNav(this.props.version, docNav091, docNav095)
        this.setState({docNav: docNav}, () => this.getTopicAndLoad())
    }

    // componentDidUpdate(prevProps, prevState){
    //     if(this.state.scrollElementId){
    //         let element = document.body.querySelector(this.state.scrollElementId)
    //         window.scrollTo({ top: window.scrollY + element.getBoundingClientRect().top, behavior: "smooth" })
    //         this.setState({scrollElementId: null})
    //     }
    //     if(this.state.hashAnchor && document.querySelector(this.state.hashAnchor)) {
    //         document.querySelector(this.state.hashAnchor).scrollIntoView()
    //         this.setState({hashAnchor: ""})
    //     }
    //     if(prevProps.match.path !== "/docs/search" & this.props.match.path === "/docs/search"){
    //         this.setState({displaySearch: true})
    //     }

    //     if(prevProps.match.params.topic !== this.props.match.params.topic || prevProps.match.params.subtopic !== this.props.match.params.subtopic){
    //         this.setState({displaySearch: false})
    //         this.getTopicAndLoad(this.props)
    //     }
    // }

    componentWillUnmount(){
        window.removeEventListener('scroll', this.fixSideBar);
   }

    getTopicAndLoad = () => {
        const { docNav } = this.state
        console.log("GET TOPIC AND LOAD, ", docNav)
        // if(props.match.path === "/docs/search"){
        //     this.setState({displaySearch: true})
        // } else {
            let promise = new Promise((resolve, reject) => {
                resolve(getTopicAndSubTopic(this.props, docNav))
            })

            promise.then((resp) => {
                let [topic, subtopic] = resp;
                console.log("RESP", resp)
                this.loadSection(topic, subtopic, docNav)
            }) 
            .catch(resp => {
                this.loadSection("getting-started", "intro", docNav)
            })
        // }
    }

    loadSection = (topic, subtopic, nav) => {
        let section;
        let subTopics = get(nav, [topic, "subTopics"]);
        subtopic = subtopic ? subtopic :  Object.keys(subTopics)[0]
        let fileName = get(subTopics, [subtopic, "file"])

        try {
            section = require(`../content/${fileName}.md`)
        } catch {
            section = require(`../content/404.md`)            
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
            console.log("TOPIC", topic, "SUBTOPIC", subtopic, "NAV", nav)
            let nextTopic = getNextTopic(topic, subtopic, nav, "docs")
            let previousTopic = getPreviousTopic(topic, subtopic, nav, "docs")

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

    setScrollElementId = () => {
        let elementId
        document.querySelectorAll('h3').forEach(el => {
            if(el.getBoundingClientRect().x && el.getBoundingClientRect().bottom >= 0 && !elementId) {
                elementId = `#${el.id}`
            }
        })
        return elementId
    }

    scrollToTop = () => {
        if (!this.state.hashAnchor) {
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
        var languageText = { flureeql: "FlureeQL", graphql: "GraphQL", curl: "Curl", sparql: "SPARQL"}
        notify.show(`Coding Examples Now In ${languageText[language]}`, "success", 1500)
        this.setState({language: language, markdown: html, scrollElementId: this.setScrollElementId()})
    }

    render(){
        const { markdown, headers, headerLinks, topic, subtopic, language, previousTopic, nextTopic,  fixedSidebar, displaySearch, docNav } = this.state;
        return(
            <div className="row">
                    <Notifications />
                    <div className="col-md-4 mt20 mb20">
                    <div className={fixedSidebar ? "fixedSidebar" : "sidebar" }>
                            <div>
                                <p>Display Examples in:</p>
                                <ToggleButtonGroup 
                                    name="language" 
                                    type="radio" 
                                    value={language}
                                    onChange={(e) => this.changeLanguage(null, e)}>
                                    { languages.map(lang => <ToggleButton key={lang} style={{fontVariant: "small-caps"}} value={lang}>{lang}</ToggleButton>)}
                                </ToggleButtonGroup>
                            </div>
                            {
                                this.state.docNav &&
                                <SidebarNav page="docs" nav={docNav} robust={false} chosenSubTopic={subtopic} chosenTopic={topic} headers={headers} headerLinks={headerLinks}/>
                            }
                    </div>
                </div>
                    <div className="col-md-8 mb20" id="body-container">
                    <div className="row">
                        <div className="col-xs-6"/>
                        <div className="col-xs-6">
                                <div className="mt10 pull-right" style={{marginRight: "20px"}}>
                                    <form onSubmit= {(e) =>     {   e.preventDefault()
                                                                    this.props.history.push(`/docs/search?search=${this.input.value}`)}}>
                                        <input type="text" ref={(searchTerm) => this.input = searchTerm} placeholder="Search Docs.." name="search"/>
                                        <button><i className="fa fa-search"></i></button>
                                    </form>
                                </div>
                        </div>
                    </div>
                    {   displaySearch 
                        ?
                        <div>No serach</div>
                        // <Search {...this.props} query={this.state.searchValue}/>
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