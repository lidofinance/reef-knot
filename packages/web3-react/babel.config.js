export default {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current', esmodules: true } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
};
