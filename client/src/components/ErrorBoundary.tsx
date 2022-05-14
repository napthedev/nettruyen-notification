import { Component } from "react";

class ErrorBoundary extends Component<
  { children: any },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.log(error, errorInfo);
    fetch("https://possession-fruit-off-tubes.trycloudflare.com/errors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error,
        errorInfo,
      }),
    });
  }
  render() {
    if (this.state.hasError) {
      return <h4>Something went wrong</h4>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
