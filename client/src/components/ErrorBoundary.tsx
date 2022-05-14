import { Component } from "react";

class ErrorBoundary extends Component<
  { children: any },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="flex justify-center mx-3">
            <div className="bg-[#F9D7DA] text-[#842029] px-4 py-3 rounded-lg text-center">
              Có lỗi đã xảy ra
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
