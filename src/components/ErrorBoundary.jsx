import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error caught by boundary:", error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo,
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div
                    style={{
                        padding: "20px",
                        textAlign: "center",
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        fontFamily: "Arial, sans-serif",
                    }}
                >
                    <h1>Something went wrong.</h1>
                    <p>We're sorry, but something unexpected happened.</p>
                    <details
                        style={{ whiteSpace: "pre-wrap", marginTop: "20px" }}
                    >
                        <summary>Error Details (for developers)</summary>
                        <p>
                            <strong>Error:</strong>{" "}
                            {this.state.error && this.state.error.toString()}
                        </p>
                        <p>
                            <strong>Component Stack:</strong>{" "}
                            {this.state.errorInfo.componentStack}
                        </p>
                    </details>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: "20px",
                            padding: "10px 20px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
