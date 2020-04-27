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
  LoginOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { SubMenu } = Menu;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
      current: '',
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

  handleNavItemClick = (e) => {
    this.setState({
      current: e.key,
    });
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
              selectedKeys={[this.state.current]}
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
                    onClick={() => this.props.history.push('/settings')}
                    key="settings"
                  >
                    <SettingOutlined />
                    Settings
                  </Menu.Item>
                  <Menu.Item onClick={this.handleLogout} key="logout">
                    <LogoutOutlined />
                    Logout
                  </Menu.Item>
                </SubMenu>
              ) : (
                <Menu theme="dark" style={{ float: 'right' }} mode="horizontal">
                  <Menu.Item
                    onClick={() => this.props.history.push('/signup')}
                    key="register"
                  >
                    <FormOutlined />
                    Register
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => this.props.history.push('/login')}
                    key="login"
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
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      )
    );
  }
}

export default withRouter(App);
