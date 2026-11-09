declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

// Side-effect CSS imports from dependencies.
declare module '*.css';
