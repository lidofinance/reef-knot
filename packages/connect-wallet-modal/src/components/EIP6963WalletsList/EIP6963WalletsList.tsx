import { MouseEvent, useMemo, ElementType } from 'react';
import { useReefKnotContext, useReefKnotModal } from '@reef-knot/core-react';
import type { EIP6963ProviderDetail } from '@reef-knot/core-react';
import type { ReefKnotWalletsModalConfig } from '@reef-knot/types';
import { isIOS, isIPad } from '@reef-knot/wallets-helpers';
import { Terms } from '../Terms';
import {
  ContentHeader,
  Subtitle,
  WalletsButtonsContainer,
  WalletsButtonsScrollBox,
} from '../ConnectWalletModalLayout/styles';
import { WalletIconImg, BackButton } from './styles';
import { ConnectButtonBase } from '../ConnectButtonBase';
import { validateIcon, FALLBACK_WALLET_ICON } from '../../helpers/validateIcon';

type EIP6963WalletsListProps = {
  providers: readonly EIP6963ProviderDetail[];
  onSelect: (provider: EIP6963ProviderDetail) => void | Promise<void>;
  config: ReefKnotWalletsModalConfig;
  onBack: () => void;
};

// Additional check because `@supports selector(::-webkit-scrollbar)`
// passes as true on iOS/iPad devices, but styles will not really apply
const isSupportedCustomScrollbar = !isIOS && !isIPad;

export const EIP6963WalletsList = ({
  providers,
  onSelect,
  config,
  onBack,
}: EIP6963WalletsListProps) => {
  const { closeModal, termsChecked } = useReefKnotModal();
  const { loadingWalletId } = useReefKnotContext();

  const someProviderIsLoading = loadingWalletId != null;

  const handleSelect = async (provider: EIP6963ProviderDetail) => {
    if (!termsChecked || someProviderIsLoading) return;
    try {
      await onSelect(provider);
      // onSelect calls onConnectSuccess → onCloseSuccess which closes the eip6963 modal;
      // close the remaining wallet list modal here (both updates are batched by React 18)
      closeModal({ success: true });
    } catch (error) {
      // stay open on rejection so the user can retry, log error for debugging
      console.warn('EIP6963WalletsList: wallet connection failed', error);
    }
  };

  const handleBack = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onBack();
  };

  const providerIcons = useMemo(
    () =>
      Object.fromEntries(
        providers.map((p) => [
          p.info.uuid,
          function ProviderIcon() {
            return (
              <WalletIconImg
                src={validateIcon(p.info.icon) ?? FALLBACK_WALLET_ICON}
                alt={p.info.name}
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_WALLET_ICON;
                }}
              />
            );
          },
        ]),
      ) as Record<string, ElementType>,
    [providers],
  );

  return (
    <>
      <ContentHeader>
        <Terms config={config} />
        <Subtitle>
          <BackButton onClick={handleBack} aria-label="Go back" />
          <span>Select browser wallet</span>
        </Subtitle>
      </ContentHeader>
      <WalletsButtonsScrollBox
        $isCompact
        $isSupportedCustomScrollbar={isSupportedCustomScrollbar}
      >
        <WalletsButtonsContainer
          $buttonsFullWidth
          $isCompact
          $isSupportedCustomScrollbar={isSupportedCustomScrollbar}
        >
          {providers.map((provider) => (
            <ConnectButtonBase
              key={provider.info.uuid}
              icon={providerIcons[provider.info.uuid]}
              isCompact
              disabled={!termsChecked || someProviderIsLoading}
              isLoading={loadingWalletId === provider.info.rdns}
              onClick={() => void handleSelect(provider)}
            >
              {provider.info.name}
            </ConnectButtonBase>
          ))}
        </WalletsButtonsContainer>
      </WalletsButtonsScrollBox>
    </>
  );
};
