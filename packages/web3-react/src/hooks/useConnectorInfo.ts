import { useAccount } from 'wagmi';
import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { LedgerHQFrameConnector } from 'web3-ledgerhq-frame-connector';
import { LedgerHQConnector } from 'web3-ledgerhq-connector';
import { useWeb3 } from './useWeb3';
import { PROVIDER_NAMES } from '../constants';
import {
  isBraveWalletProvider,
  isCoin98Provider,
  isCoinbaseProvider,
  isDappBrowserProvider,
  isGamestopProvider,
  isImTokenProvider,
  isMathWalletProvider,
  isMetamaskProvider,
  isOperaWalletProvider,
  isTrustProvider,
  isXdefiProvider,
  isZerionProvider,
} from '../helpers';

type ConnectorInfo = {
  providerName?: string;
  isConnectedViaWagmi: boolean;
  isGnosis: boolean;
  isLedger: boolean;
  isLedgerLive: boolean;
  isWalletLink: boolean;
  isCoinbase: boolean;
  isMetamask: boolean;
  isCoin98: boolean;
  isMathWallet: boolean;
  isImToken: boolean;
  isTrust: boolean;
  isBraveWallet: boolean;
  isOperaWallet: boolean;
  isGamestop: boolean;
  isXdefi: boolean;
  isDappBrowser: boolean;
  isInjected: boolean;
};

export const useConnectorInfo = (): ConnectorInfo => {
  const { active, connector } = useWeb3();

  // === WAGMI connectors BEGIN
  const { isConnected, connector: wagmiConnector } = useAccount();

  const isConnectedViaWagmi = isConnected && !!wagmiConnector;

  // === WAGMI connectors END
  // === WEB3-REACT connectors BEGIN
  const isGnosis = active && connector instanceof SafeAppConnector;
  const isLedgerLive = active && connector instanceof LedgerHQFrameConnector;
  const isLedger = connector instanceof LedgerHQConnector;

  // WalletLink is used by Coinbase, but it can be used by other wallets too.
  const isWalletLink = active && connector instanceof WalletLinkConnector;

  // This detection doesn't work for the connection via QR code scanning.
  const isCoinbase = active && isCoinbaseProvider();

  const isInjected =
    // check for web3-react
    (active && connector instanceof InjectedConnector) ||
    // check for wagmi
    (isConnectedViaWagmi && wagmiConnector.id === 'injected');
  const isDappBrowser = isInjected && isDappBrowserProvider();
  const isMetamask = isInjected && isMetamaskProvider();
  const isCoin98 = isInjected && isCoin98Provider();
  const isMathWallet = isInjected && isMathWalletProvider();
  const isImToken = isInjected && isImTokenProvider();
  const isTrust = isInjected && isTrustProvider();
  const isBraveWallet = isInjected && isBraveWalletProvider();
  const isOperaWallet = isInjected && isOperaWalletProvider();
  const isGamestop = isInjected && isGamestopProvider();
  const isXdefi = isInjected && isXdefiProvider();
  const isZerion = isInjected && isZerionProvider();

  const providerName = (() => {
    if (isConnectedViaWagmi && wagmiConnector.name) return wagmiConnector.name;

    // Do not try to detect providerName if the app is opened in a mobile wallet dapp browser,
    // because such wallets often mimic other wallets which makes proper detection to be hard.
    // Also, if the app is opened in a mobile wallet dapp browser,
    // then we autoconnect the wallet via injected connector,
    // and we don't allow to disconnect in such case.
    // So it is easy for a user to understand which wallet app is being used for connection.
    if (isDappBrowser) return undefined;

    if (isGnosis) return PROVIDER_NAMES.GNOSIS;
    if (isLedger) return PROVIDER_NAMES.LEDGER;
    if (isLedgerLive) return PROVIDER_NAMES.LEDGER_HQ_LIVE;
    if (isImToken) return PROVIDER_NAMES.IM_TOKEN;
    if (isTrust) return PROVIDER_NAMES.TRUST;

    // Wallets which has conflicts with each other.
    // The order of wallets checks here is important.
    // Most "aggressive" wallet, which overrides other wallets, goes first.
    if (isXdefi) return PROVIDER_NAMES.XDEFI;
    if (isGamestop) return PROVIDER_NAMES.GAMESTOP;
    if (isMathWallet) return PROVIDER_NAMES.MATH_WALLET;
    if (isCoin98) return PROVIDER_NAMES.COIN98;
    if (isCoinbase) return PROVIDER_NAMES.COINBASE;
    if (isOperaWallet) return PROVIDER_NAMES.OPERA;
    if (isBraveWallet) return PROVIDER_NAMES.BRAVE;
    if (isZerion) return PROVIDER_NAMES.ZERION;
    // Metamask should be last in this list because almost all EIP-1193 wallets
    // are trying to mimic Metamask by setting isMetamask = true
    if (isMetamask) return PROVIDER_NAMES.METAMASK;

    // General providers which doesn't specify what exact wallet is being used.
    // Works as a fallback.
    if (isWalletLink) return PROVIDER_NAMES.WALLET_LINK;
    if (isInjected) return PROVIDER_NAMES.INJECTED;

    return undefined;
  })();

  return {
    providerName,

    isConnectedViaWagmi,

    isGnosis,
    isLedger,
    isLedgerLive,
    isWalletLink,
    isCoinbase,
    isMetamask,
    isCoin98,
    isMathWallet,
    isImToken,
    isTrust,
    isBraveWallet,
    isOperaWallet,
    isGamestop,
    isXdefi,

    isDappBrowser,
    isInjected,
  };
};
