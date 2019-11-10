import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import {
    Form,
    Input,
    Button,
    Tooltip,
    Icon
} from 'antd';
import "./ResetPassword.css";
import { hasNumber, hasUpperCase, hasLowerCase } from "../util/Util"

class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: "",
      email: "",
      password: "",
      codeSent: false,
      confirmed: false,
      confirmPassword: "",
      isConfirming: false,
      isSendingCode: false
    };
  }

  validateCodeForm() {
    return this.state.email.length > 0;
  }

  validateResetForm() {
    return (
      this.state.code.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  handleChange = (event, val) => {
    /*
    this.setState({
      [event.target.id]: event.target.value
    });
    */
    this.setState({
      [val]: event.target.value
    });
  }

  handleSendCodeClick = async event => {
    event.preventDefault();

    this.setState({ isSendingCode: true });

    try {
      await Auth.forgotPassword(this.state.email);
      this.setState({ codeSent: true });
    } catch (e) {
      alert(e.message);
      this.setState({ isSendingCode: false });
    }
  };

  handleConfirmClick = async event => {
    event.preventDefault();

    this.setState({ isConfirming: true });

    try {
      await Auth.forgotPasswordSubmit(
        this.state.email,
        this.state.code,
        this.state.password
      );
      this.setState({ confirmed: true });
    } catch (e) {
      alert(e.message);
      this.setState({ isConfirming: false });
    }
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Passwords do not match.');
    } else {
      callback();
    }
  };

  getPasswordValidity = (password) => { //TODO: fetch the password policy from aws. Currently its hardcoded in.
    if(!hasNumber(password)) {
      return "Password does not contain a number.";
    } else if(!hasLowerCase(password)) {
      return "Password does not contain a lower case character.";
    } else if(!hasUpperCase(password)) {
      return "Password does not contain a upper case character.";
    }
    return "true";
  }

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    
    if(value && this.getPasswordValidity(value) !== "true") {
      callback(this.getPasswordValidity(value));
    }
    callback();
  };

  renderRequestCodeForm() {
    const { getFieldDecorator } = this.props.form; 
    return (
      <Form onSubmit={this.handleSendCodeClick} className="confirmation-form">
        <Form.Item htmlFor='email'>
            {getFieldDecorator('email', {
                rules: [{ required: true, message: 'Please input your email!' }],
                onChange: (e) => this.handleChange(e, 'email') 
            })(
                <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Email"
                    id='email'
                />,
            )}
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit" className="confirmation-form-button" disabled={!this.validateCodeForm()} loading={this.state.isSendingCode}>
            Send Confirmation
          </Button>
        </Form.Item>
      </Form>
    );
  }

  renderConfirmationForm() {
    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
            span: 24,
            offset: 0,
            },
            sm: {
            span: 16,
            offset: 8,
            },
        },
    };
    const { getFieldDecorator } = this.props.form; 
    return (
      <Form onSubmit={this.handleConfirmClick} className="confirmation-form">
        <Form.Item htmlFor="code" label={
            <span>
              Confirmation Code&nbsp;
              <Tooltip title="Please check your email for the confirmation code.">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }>
          {getFieldDecorator('code', {
            rules: [{ required: true, message: 'Please input code.' }],
            onChange: (e) => this.handleChange(e, 'code')
          })(
            <Input
              id="code"
            />,
          )}
        </Form.Item>
        <Form.Item htmlFor="password" label="Password" hasFeedback>
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
            onChange: (e) => this.handleChange(e, 'password') 
          })(<Input.Password 
                type="password"
                placeholder="Password"
                id="password"
            />)}
        </Form.Item>
        <Form.Item htmlFor="confirmPassword" label="Confirm Password" hasFeedback>
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
            onChange: (e) => this.handleChange(e, 'confirmPassword') 
          })(<Input.Password 
                placeholder="Confirm Password"
                type="password"
                id="confirmPassword"
          />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" loading={this.state.isConfirming} disabled={!this.validateResetForm()}>
            Confirm
          </Button>
        </Form.Item>
        
      </Form>
    );
  }

  renderSuccessMessage() {
    return (
      <div className="success">
        <p>Your password has been reset.</p>
        <p>
          <Link to="/login">
            Click here to login with your new credentials.
          </Link>
        </p>
      </div>
    );
  }

  render() {
    return (
      <div className="ResetPassword">
        {!this.state.codeSent
          ? this.renderRequestCodeForm()
          : !this.state.confirmed
            ? this.renderConfirmationForm()
            : this.renderSuccessMessage()}
      </div>
    );
  }
}

export default Form.create()(ResetPassword);