import React, { Component } from 'react'

interface Props {
  duration: number
  onTick: (value: number) => void
}

interface State {
  timer: number
  timeout: number
}

export default class Timer extends Component<Props, State> {
  private timeout: any = undefined

  constructor(props: Props) {
    super(props)
    this.state = {
      timeout: 0,
      timer: 0,
    }
  }

  componentDidMount() {
    const duration = this.props.duration || 0
    this.setState(
      {
        timeout: ((new Date().getTime() / 1000) | 0) + duration,
        timer: duration,
      },
      this.tick
    )
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    const { timer } = this.state
    const { onTick } = this.props
    if (prevState.timer !== timer) {
      onTick(timer)
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  }

  tick() {
    const { timer, timeout } = this.state
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    if (timer > 0) {
      this.timeout = setTimeout(() => {
        this.setState({ timer: timeout - ((new Date().getTime() / 1000) | 0) }, this.tick)
      }, 1000)
    }
  }

  render() {
    return null
  }

  restart = () => {
    this.componentDidMount()
  }
}
