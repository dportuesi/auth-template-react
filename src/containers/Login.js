import React, { Component } from "react";
import { Auth } from "aws-amplify";
import "./Login.css";
import { Button, Form, Input, Icon, Checkbox} from 'antd';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
        isLoading: false,
        email: "",
        password: "",
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
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

  handleSubmit = async event => {
    event.preventDefault();
  
    this.setState({ isLoading: true });
  
    try {
      await Auth.signIn(this.state.email, this.state.password);
      this.props.userHasAuthenticated(true);
      this.props.history.push("/");
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="Login">
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item htmlFor='email'>
            {getFieldDecorator('email', {
              rules: [{ required: true, message: 'Please input your email!' }],
              onChange: (e) => this.handleChange(e, 'email')
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)'}} />}
                placeholder="Email"
                id='email'
              />,
            )}
          </Form.Item>
          <Form.Item htmlFor='password'>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
              onChange: (e) => this.handleChange(e, 'password')
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="Password"
                id='password'
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(<Checkbox>Remember me</Checkbox>)}
            <a className="login-form-forgot" href="/login/reset">
              Forgot password
            </a>
            <Button type="primary" htmlType="submit" loading={this.state.isLoading} disabled={!this.validateForm()} className="login-form-button">
              Log in
            </Button>
            Or <a href="/signup">register now!</a>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create()(Login);
