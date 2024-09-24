import React from 'react';

export class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
}> {
  constructor(props: any) {
    super(props);
  }

  componentDidCatch(error: any, info: any) {
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
