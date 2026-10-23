import type { ReefKnotUIComponents, ReefKnotTheme } from '../../types/ui';
import { useEIP6963Picker } from '../connection';
import { validateIcon, FALLBACK_WALLET_ICON } from '../helpers/validateIcon';
import { Terms } from './Terms';

/**
 * Renders discovered EIP-6963 providers through the same replaceable wallet
 * buttons. Validates provider-supplied icons and delegates selection to the hook.
 */
export function EIP6963Picker({
  components,
  theme,
}: {
  components: ReefKnotUIComponents;
  theme?: ReefKnotTheme;
}) {
  const state = useEIP6963Picker();
  return (
    <components.EIP6963Picker
      providers={state.providers}
      terms={<Terms components={components} />}
      error={state.error}
    >
      {state.providers.map((provider) => (
        <components.WalletButton
          key={provider.info.uuid}
          name={provider.info.name}
          iconUrl={validateIcon(provider.info.icon) ?? FALLBACK_WALLET_ICON}
          compact
          disabled={state.disabled}
          isLoading={state.loadingWalletId === provider.info.rdns}
          theme={theme}
          onConnect={() => {
            void state.select(provider);
          }}
        />
      ))}
    </components.EIP6963Picker>
  );
}
