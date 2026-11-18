import React from 'react';

export class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
}> {
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(
      'ErrorBoundary catched an error:',
      error,
      info.componentStack,
    );
  }

  render() {
    return this.props.children;
  }
}
