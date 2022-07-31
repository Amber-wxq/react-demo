import React from "react";
import {Link} from "react-router";
import NavLink from "./NavLink";
class App extends React.Component {
    render(){
        return <div>
            <h1>React Router Test04</h1>
            <ul role="nav">
                {/* <li><Link to="/about" activeStyle={{color:'red'}}>About</Link></li>
                <li><Link to="/repos" activeStyle={{color:'red'}}>Repos</Link></li> */}
                {/* <li><Link to="/about" activeClassName="active">About</Link></li>
                <li><Link to="/repos" activeClassName="active">Repos</Link></li> */}
                <li><NavLink to="/about">About</NavLink></li>
                <li><NavLink to="/repos">Repos</NavLink></li>
            </ul>
            {this.props.children}
        </div>
    }
}

export default App;