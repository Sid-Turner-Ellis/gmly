import { Component, ErrorInfo, ReactNode } from "react";
import { ErrorPage } from "./error-page";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    console.log("shiet", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorPage type="somethingWentWrong" />;
    }

    return this.props.children;
  }
}