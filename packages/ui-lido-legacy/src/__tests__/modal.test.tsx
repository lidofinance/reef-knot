import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { ThemeProvider, themeLight } from '@lidofinance/lido-ui';
import { Modal } from '../ui-react';

let root: Root;
let container: HTMLDivElement;

// Untyped callers can still pass the removed option.
const legacyProps = { unmountOnExit: false } as object;

async function render(open: boolean) {
  await act(async () =>
    root.render(
      <ThemeProvider theme={themeLight}>
        <Modal open={open} timeout={0} {...legacyProps}>
          content
        </Modal>
      </ThemeProvider>,
    ),
  );
}

beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

it('unmounts the overlay after the modal closes', async () => {
  await render(true);
  expect(document.querySelector('[role="dialog"]')).not.toBeNull();

  await render(false);
  // Let the exit transition finish.
  await act(() => new Promise((resolve) => setTimeout(resolve, 10)));

  expect(document.querySelector('[role="dialog"]')).toBeNull();
});
