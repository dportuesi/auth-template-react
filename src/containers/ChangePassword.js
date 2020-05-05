import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import './ChangePassword.css';
import { Button, Form, Input, Icon, Divider } from 'antd';
import { hasNumber, hasUpperCase, hasLowerCase, getMinPasswordLength } from '../util/Util';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      oldPassword: '',
      password: '',
      confirmPassword: '',
    };
  }

  validateForm() {
    return (
      this.state.oldPassword.length >= getMinPasswordLength() &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword &&
      this.getPasswordValidity(this.state.password) === 'true'
    );
  }

  handleChange = (event, val) => {
    this.setState({
      [val]: event.target.value,
    });
  };

  handleSubmit = async (event) => {
    console.log('submited');
  };

  handleConfirmBlur = (e) => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  validateOldPassword = (rule, value, callback) => {
    if(value.length < getMinPasswordLength()) {
      callback("Password is too short.");
    } else {
      callback();
    }
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Passwords do not match.');
    } else {
      callback();
    }
  };

  getPasswordValidity = (password) => {
    //TODO: fetch the password policy from aws. Currently its hardcoded in.
    if (!hasNumber(password)) {
      return 'Password does not contain a number.';
    } else if (!hasLowerCase(password)) {
      return 'Password does not contain a lower case character.';
    } else if (!hasUpperCase(password)) {
      return 'Password does not contain a upper case character.';
    }
    return 'true';
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }

    if (value && this.getPasswordValidity(value) !== 'true') {
      callback(this.getPasswordValidity(value));
    }
    callback();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="ChangePassword">
        <Form onSubmit={this.handleSubmit} className="changepassword-form">
          <Form.Item
            htmlFor="oldPassword"
            label="Old Password:"
            hasFeedback
            >
            {getFieldDecorator('oldPassword', {
              rules: [
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                {
                  validator: this.validateOldPassword,
                },
              ],
              onChange: (e) => this.handleChange(e, 'oldPassword'),
            })(
              <Input.Password
                placeholder="Old Password"
                type="password"
                id="oldPassword"
              />
            )}
          </Form.Item>

          <Divider />

          <Form.Item htmlFor="password" label="New Password:" hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Please input your password!',
              },
              {
                validator: this.validateToNextPassword,
              },
            ],
            onChange: (e) => this.handleChange(e, 'password'),
          })(
            <Input.Password
              type="password"
              placeholder="Password"
              id="password"
            />
          )}
        </Form.Item>
        <Form.Item
          htmlFor="confirmPassword"
          label="Confirm New Password:"
          hasFeedback
        >
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: 'Please confirm your password!',
              },
              {
                validator: this.compareToFirstPassword,
              },
            ],
            onChange: (e) => this.handleChange(e, 'confirmPassword'),
          })(
            <Input.Password
              onBlur={this.handleConfirmBlur}
              placeholder="Confirm Password"
              type="password"
              id="confirmPassword"
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={this.state.isLoading}
            disabled={!this.validateForm()}
          >
            Register
          </Button>
        </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create()(Login);
