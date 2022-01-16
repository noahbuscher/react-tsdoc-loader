# react-tsdoc-loader

react-tsdoc-loader allows for parsing of React components with [react-tsdoc](https://github.com/noahbuscher/react-tsdoc) and injecting the result for use in Storybook, such as in:

- [Storybook Controls](https://storybook.js.org/docs/react/essentials/controls)
- [Storybook Docs](https://storybook.js.org/addons/@storybook/addon-docs) (ArgsTable, DocsPage)

## Install

To install, first run the following in your root directory.

```
npm install -D react-tsdoc-loader
```

To add to storybook, add the following to your `.storybook/main.js` file:

```js
module.exports = {
  typescript: {
    reactDocgen: false // Turns off Storybook's built-in docgen tools
  },
  webpackFinal: async (config, { configType }) => {
    // Run the loader on Typescript component files in your project
    config.module.rules.push({
      test: /\.tsx$/,
      use: ['react-tsdoc-loader'],
      include: path.resolve(__dirname, '../'),
    });
    
    return config;
  },
}
```

That's it! Now your docs will be visible in Storybook.

## Writing Docs

This loader is powered by [react-tsdoc](https://github.com/noahbuscher/react-tsdoc) and uses the `@prop` tag to document props. It will also inject if the prop is required, default value(s), and a _lot_ of helpful type information.

An example component with a default value and description for a prop might look like this:

```tsx
/**
 * Nice button
 *
 * @prop label - Label for the button
 */
const Button = ({
	label = 'Click me!'
}: {
	label: string
}) => (
  <button>{label}</button>
);
```

To learn more, visit the [react-tsdoc](https://github.com/noahbuscher/react-tsdoc).
