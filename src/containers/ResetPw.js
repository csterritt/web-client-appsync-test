import React, { Component } from 'react'
import { HelpBlock, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import LoaderButton from '../components/LoaderButton'
import { Auth } from 'aws-amplify'

import './Signup.css'

export default class ResetPw extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      email: '',
      password: '',
      confirmPassword: '',
      confirmationCode: '',
      newUser: null
    }
  }

  validateForm() {
    return (
      this.state.email.length > 0
    )
  }

  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0 &&
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  handleSubmit = async event => {
    event.preventDefault()

    this.setState({ isLoading: true })

    try {
      await Auth.forgotPassword(this.state.email)
      this.setState({
        newUser: true
      })
    } catch (e) {
      alert(e.message)
    }

    this.setState({ isLoading: false })
  }

  handleConfirmationSubmit = async event => {
    event.preventDefault()

    this.setState({ isLoading: true })

    try {
      await Auth.forgotPasswordSubmit(this.state.email, this.state.confirmationCode, this.state.password)
      await Auth.signIn(this.state.email, this.state.password)

      this.props.userHasAuthenticated(true)
      this.props.history.push('/')
    } catch (e) {
      alert(e.message)
      this.setState({ isLoading: false })
    }
  }

  renderConfirmationForm() {
    return (
      <form onSubmit={this.handleConfirmationSubmit}>
        <FormGroup controlId="confirmationCode" bsSize="large">
          <ControlLabel>Confirmation Code</ControlLabel>
          <FormControl autoFocus type="tel" value={this.state.confirmationCode} onChange={this.handleChange}/>
          <HelpBlock>Please check your email for the code.</HelpBlock>
        </FormGroup>

        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>Password</ControlLabel>
          <FormControl value={this.state.password} onChange={this.handleChange} type="password"/>
        </FormGroup>

        <FormGroup controlId="confirmPassword" bsSize="large">
          <ControlLabel>Confirm Password</ControlLabel>
          <FormControl value={this.state.confirmPassword} onChange={this.handleChange} type="password"/>
        </FormGroup>

        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateConfirmationForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Reset"
          loadingText="Resetting…"
        />
      </form>
    )
  }

  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        <FormGroup controlId="email" bsSize="large">
          <ControlLabel>Email</ControlLabel>
          <FormControl autoFocus type="email" value={this.state.email} onChange={this.handleChange}/>
        </FormGroup>

        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Reset password"
          loadingText="Getting reset code…"
        />
      </form>
    )
  }

  render() {
    return (
      <div className="Signup">{this.state.newUser === null ? this.renderForm() : this.renderConfirmationForm()}</div>
    )
  }
}
