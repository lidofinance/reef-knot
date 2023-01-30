import { ThemeName } from '@lidofinance/lido-ui';

const ThemeSelect = (props: {
  selectedTheme: ThemeName;
  handleSelect: (value: ThemeName) => void;
}) => {
  const { selectedTheme, handleSelect } = props;
  return (
    <div>
      <label htmlFor="themeSwitcher">
        Theme:&nbsp;
        <select
          name="themeSwitcher"
          value={selectedTheme}
          onChange={(e) => handleSelect?.(e.target.value as ThemeName)}
        >
          <option value={ThemeName.light}>Light</option>
          <option value={ThemeName.dark}>Dark</option>
        </select>
      </label>
    </div>
  );
};

export default ThemeSelect;
