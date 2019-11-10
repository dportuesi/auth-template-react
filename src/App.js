import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import Routes from './Routes';
import { Auth } from "aws-amplify";
import { Menu, Icon } from 'antd'
import 'antd/dist/antd.css';
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
      current: ''
    };
  }

  async componentDidMount() {
    try {
      await Auth.currentSession();
      this.userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }
  
    this.setState({ isAuthenticating: false });
  }
  
  userHasAuthenticated = authenticated => {
    this.setState({ 
      isAuthenticated: authenticated,
    });
  }

  handleLogout = async event => {
    await Auth.signOut();
  
    this.userHasAuthenticated(false);

    this.props.history.push("/login");
  }

  handleNavItemClick = e => {
    this.setState({
      current: e.key,
    });
  };

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };
    return (
      !this.state.isAuthenticating &&
      <div>
        <div className="navbar" >
          <div className="logo">
              <a href="/">logo</a>
          </div>
          <Menu style={{float: 'right'}} onClick={this.handleNavItemClick} selectedKeys={[this.state.current]} mode="horizontal" >
            {this.state.isAuthenticated
              ? <Menu.Item onClick={ this.handleLogout } key="logout" >
                  <Icon type="logout" />
                  Logout
                </Menu.Item>
              : <Menu>
                  <Menu.Item onClick={() => this.props.history.push("/signup")} key="register">
                    <Icon type="form" />
                    Register
                  </Menu.Item>
                  <Menu.Item onClick={() => this.props.history.push("/login")} key="login">
                    <Icon type="login" />
                    Login
                  </Menu.Item>     
                </Menu>
            }    
          </Menu>
          </div>
        
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(App);
