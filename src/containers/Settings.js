import React from 'react';
import './Settings.css';

import { Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export default class Home extends React.Component {
  changeEmail() {}

  changePassword() {}

  render() {
    return (
      <div>
        <div className="user-panel">
          <Avatar size="large" icon={<UserOutlined />} />
          <h2>Username</h2>
        </div>

        <div className="user-settings">
          <Button
            block
            className="btn-settings-user"
            type="primary"
            onClick={() => this.changeEmail()}
          >
            Change Email
          </Button>
          <br />
          <Button
            block
            type="primary"
            className="btn-settings-user"
            onClick={() => this.changePassword()}
          >
            Change Password
          </Button>
        </div>
      </div>
    );
  }
}
