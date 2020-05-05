import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Routes from './Routes';
import { Auth } from 'aws-amplify';
import 'antd/dist/antd.css';
import './App.css';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  FormOutlined,
  LoginOutlined
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { SubMenu } = Menu;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
    };
  }

  async componentDidMount() {
    try {
      await Auth.currentSession();
      this.userHasAuthenticated(true);
    } catch (e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }

    this.setState({ isAuthenticating: false });
  }

  userHasAuthenticated = (authenticated) => {
    this.setState({
      isAuthenticated: authenticated,
    });
  };

  handleLogout = async (event) => {
    await Auth.signOut();

    this.userHasAuthenticated(false);

    this.props.history.push('/login');
  };

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
    };
    return (
      !this.state.isAuthenticating && (
        <Layout className="layout">
          <Header>
            <div className="logo" />
            <Menu
              theme="dark"
              style={{ float: 'right' }}
              onClick={this.handleNavItemClick}
              mode="horizontal"    
            >
              {this.state.isAuthenticated ? (
                <SubMenu
                  title={
                    <>
                      <UserOutlined style={{ fontSize: '24px' }} />
                    </>
                  }
                >
                  <Menu.Item
                    key="settings"
                    onClick={() => this.props.history.push('/user')}
                  >
                    <SettingOutlined />
                    Settings
                  </Menu.Item>
                  <Menu.Item key="logout" onClick={this.handleLogout}>
                    <LogoutOutlined />
                    Logout
                  </Menu.Item>
                </SubMenu>
              ) : (
                <Menu theme="dark" style={{ float: 'right' }} mode="horizontal">
                  <Menu.Item
                    key="register"
                    onClick={() => this.props.history.push('/signup')}
                  >
                    <FormOutlined />
                    Register
                  </Menu.Item>
                  <Menu.Item
                    key="login"
                    onClick={() => this.props.history.push('/login')}
                  >
                    <LoginOutlined />
                    Login
                  </Menu.Item>
                </Menu>
              )}
            </Menu>
          </Header>
          <Content style={{ padding: '0 2px' }}>
            <div className="site-layout-content">
              <Routes childProps={childProps} />
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Auth Template ©2020 Created by Domenic Portuesi
          </Footer>
        </Layout>
      )
    );
  }
}

export default withRouter(App);
