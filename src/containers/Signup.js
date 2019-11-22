import React, { Component } from "react";
import "./Signup.css";
import {
    Form,
    Input,
    Checkbox,
    Button,
} from 'antd';
import { Auth } from "aws-amplify";

import { hasNumber, hasUpperCase, hasLowerCase } from "../util/Util"

class Signup extends Component {

    state = {
        confirmDirty: false,
        autoCompleteResult: [],
      };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      confirmationCode: "",
      newUser: null,
      termsAgreed: false
    };
  }

  validateForm() {
    return (
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword &&
      this.state.termsAgreed === true &&
      this.state.username.length > 0
    );
  }

  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0;
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

  onCheckAllChange = (e, val) => {
    this.setState({
      [val]: e.target.checked,
    });
  };

  handleSubmit = async event => {
  event.preventDefault();

  this.setState({ isLoading: true });

  try {
    const newUser = await Auth.signUp({
      username: this.state.email,
      password: this.state.password
    });
    this.setState({
      newUser
    });
  } catch (e) {
    alert(e.message);
  }

  this.setState({ isLoading: false });
}

handleConfirmationSubmit = async event => {
  event.preventDefault();

  this.setState({ isLoading: true });

    try {
      await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
      await Auth.signIn(this.state.email, this.state.password);

      this.props.userHasAuthenticated(true);
      this.props.history.push("/");
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  }

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
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

  renderConfirmationForm() {  
    const { getFieldDecorator } = this.props.form; 
    return (
      <Form onSubmit={this.handleConfirmationSubmit} className="confirmation-form">
        <Form.Item htmlFor="confirmationCode" extra="Please check your email for the confirmation code.">
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your confirmation code!' }],
            onChange: (e) => this.handleChange(e, 'confirmationCode')
          })(
            <Input
              id="confirmationCode"
            />,
          )}
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit" className="confirmation-form-button" disabled={!this.validateConfirmationForm()} loading={this.state.isLoading}>
            Confirm
          </Button>
        </Form.Item>
      </Form>
    );
  }

  renderForm() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
    };
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

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit} className="signup-form">
        <Form.Item htmlFor="email" label="Email" >
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
            onChange: (e) => this.handleChange(e, 'email') 
          })(<Input 
                placeholder="Email"
                id='email'
            />)}
        </Form.Item>
        <Form.Item htmlFor="username" label="Username">
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!', whitespace: true }],
            onChange: (e) => this.handleChange(e, 'username')
          })(<Input 
              placeholder="Username"
              id='username'
          />)}
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
                onBlur={this.handleConfirmBlur} 
                placeholder="Confirm Password"
                type="password"
                id="confirmPassword"
          />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          {getFieldDecorator('agreement', {
            valuePropName: 'checked',
            onChange: (e) => this.onCheckAllChange(e, 'termsAgreed') 
          })(
            <Checkbox >
              I have read and agree to the <a href="\">agreement</a>
            </Checkbox>,
          )}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" loading={this.state.isLoading} disabled={!this.validateForm()}>
            Register
          </Button>
        </Form.Item>
      </Form>
    );
  }

  render() {
    return (
      <div className="Signup">
        {this.state.newUser === null
          ? this.renderForm()
          : this.renderConfirmationForm()}
      </div>
    );
  }
}

export default Form.create()(Signup);