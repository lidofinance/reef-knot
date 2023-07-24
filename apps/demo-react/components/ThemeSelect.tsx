import { ThemeName, Select, Option, OptionValue } from '@lidofinance/lido-ui';

const ThemeSelect = (props: {
  selectedTheme: ThemeName;
  handleSelect: (e: OptionValue) => void;
}) => {
  const { selectedTheme, handleSelect } = props;
  return (
    <div style={{ padding: '0 32px' }}>
      <Select
        label="Theme"
        name="themeSwitcher"
        value={selectedTheme}
        onChange={handleSelect}
      >
        <Option value={ThemeName.light}>Light</Option>
        <Option value={ThemeName.dark}>Dark</Option>
      </Select>
    </div>
  );
};

export default ThemeSelect;
