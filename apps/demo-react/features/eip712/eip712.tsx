import { useEffect, useRef, useState } from 'react';
import { Button } from '@lidofinance/lido-ui';
import copy from 'copy-to-clipboard';
import { useConnection, usePublicClient, useSignTypedData } from 'wagmi';
import {
  BaseError,
  UserRejectedRequestError,
  hashTypedData,
  zeroAddress,
  type Address,
  type Hex,
} from 'viem';
import { useSupportedChains } from 'hooks/useSupportedChains';
import {
  Badge,
  Card,
  Code,
  Connection,
  Details,
  EnvironmentFields,
  Eyebrow,
  Message,
  Muted,
  Result,
  Row,
} from './styles';

const createTypedData = (wallet: Address, chainId?: number) =>
  ({
    domain: {
      name: 'Reef Knot EIP-712 Test',
      version: '1',
      chainId,
      verifyingContract: zeroAddress,
    },
    types: {
      WalletTest: [
        { name: 'wallet', type: 'address' },
        { name: 'message', type: 'string' },
      ],
    },
    primaryType: 'WalletTest',
    message: {
      wallet,
      message: 'Test EIP-712 signing in Reef Knot. No token approval.',
    },
  }) as const;

type Status =
  'idle' | 'signing' | 'verifying' | 'success' | 'cancelled' | 'error';
type Report = {
  timestamp: string;
  wallet: string;
  connectorId: string;
  account: Address;
  chainId: number;
  typedData: ReturnType<typeof createTypedData>;
  digest: Hex;
  signature?: Hex;
  verified?: boolean;
  error?: string;
};

const shorten = (address: string) =>
  `${address.slice(0, 6)}…${address.slice(-4)}`;

const isUserRejection = (error: unknown) =>
  error instanceof UserRejectedRequestError ||
  (typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 4001);

const CopyButton = ({ text, label }: { text: string; label: string }) => {
  const [feedback, setFeedback] = useState('');
  useEffect(() => {
    setFeedback('');
  }, [text]);
  useEffect(() => {
    if (!feedback) return;
    const timeout = setTimeout(() => setFeedback(''), 2500);
    return () => clearTimeout(timeout);
  }, [feedback]);
  return (
    <Button
      size="xxs"
      variant="translucent"
      onClick={() => setFeedback(copy(text) ? 'Copied' : 'Copy failed')}
      aria-label={label}
    >
      <span aria-live="polite">{feedback || label}</span>
    </Button>
  );
};

const EIP712Panel = () => {
  const { address, chainId, chain, connector, isConnected } = useConnection();
  const publicClient = usePublicClient({ chainId });
  const { mutateAsync: signTypedData } = useSignTypedData();
  const { isUnsupported } = useSupportedChains();
  const [status, setStatus] = useState<Status>('idle');
  const [report, setReport] = useState<Report>();
  const [walletOrDevice, setWalletOrDevice] = useState('');
  const [version, setVersion] = useState('');
  const busy = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const pending = status === 'signing' || status === 'verifying';
  const connected = isConnected && !!address && !!chainId && !!connector;
  const typedData = createTypedData(address ?? zeroAddress, chainId);
  const payload = JSON.stringify(typedData, null, 2);

  const runTest = async () => {
    if (!connected || isUnsupported || !publicClient || busy.current) return;
    busy.current = true;
    const attempt: Report = {
      timestamp: new Date().toISOString(),
      wallet: connector.name,
      connectorId: connector.id,
      account: address,
      chainId,
      typedData,
      digest: hashTypedData(typedData),
    };
    setReport(undefined);
    setStatus('signing');
    let nextStatus: Status = 'success';
    try {
      attempt.signature = await signTypedData({
        ...typedData,
        account: address,
        connector,
      });
      if (!mounted.current) return;
      setStatus('verifying');
      attempt.verified = await publicClient.verifyTypedData({
        ...typedData,
        address,
        signature: attempt.signature,
      });
      if (!attempt.verified)
        throw new Error(`The signature is not valid for account ${address}.`);
    } catch (error) {
      const cause =
        error instanceof BaseError ? error.walk(isUserRejection) : error;
      nextStatus = isUserRejection(cause) ? 'cancelled' : 'error';
      attempt.error =
        error instanceof Error
          ? `${error.name}: ${error.message}`
          : String(error);
    } finally {
      busy.current = false;
    }
    if (mounted.current) {
      setReport(attempt);
      setStatus(nextStatus);
    }
  };

  const reportText = JSON.stringify(
    {
      ...report,
      status,
      environment: {
        walletOrDevice: walletOrDevice.trim() || 'Not provided',
        version: version.trim() || 'Not provided',
        source: 'Manually entered',
      },
    },
    null,
    2,
  );

  return (
    <Card aria-label="EIP-712 signing test" data-testid="EIP712Test">
      <Row>
        <h2>EIP-712 signing test</h2>
        <Badge>Message signing</Badge>
      </Row>
      <Muted>
        Sign a demo message and check the signature. No transaction or token
        approval.
      </Muted>

      <Connection>
        {connected ? (
          <>
            <Row>
              <strong>{connector.name}</strong>
              <Badge>{chain?.name ?? `Chain ${chainId}`}</Badge>
            </Row>
            <Row>
              <code title={address}>{shorten(address)}</code>
              <CopyButton text={address} label="Copy address" />
            </Row>
          </>
        ) : (
          <strong>Connect a wallet to begin</strong>
        )}
      </Connection>

      <Message>
        <Eyebrow>Message you will sign</Eyebrow>
        <p>{typedData.message.message}</p>
        {connected && (
          <Details>
            <summary>View typed data</summary>
            <CopyButton text={payload} label="Copy payload" />
            <Code>{payload}</Code>
          </Details>
        )}
      </Message>

      <>
        <Button
          fullwidth
          loading={pending}
          disabled={!connected || pending || isUnsupported || !publicClient}
          onClick={() => void runTest()}
        >
          {pending
            ? status === 'signing'
              ? 'Waiting for wallet…'
              : 'Verifying signature…'
            : status === 'idle'
              ? 'Sign test message'
              : 'Run again'}
        </Button>
        {connected && isUnsupported && (
          <Muted>Switch to a supported network to run the test.</Muted>
        )}
        {connected && !isUnsupported && !publicClient && (
          <Muted>Signature verification is unavailable on this network.</Muted>
        )}
      </>

      <div role="status" aria-live="polite" aria-atomic="true">
        {pending && (
          <Muted>
            {status === 'signing'
              ? 'Review and confirm the message in your wallet.'
              : 'Checking that the signature is valid for your connected account.'}
          </Muted>
        )}
        {report && (
          <Result
            $tone={
              status === 'success'
                ? 'success'
                : status === 'error'
                  ? 'error'
                  : 'neutral'
            }
          >
            <strong>
              {status === 'success'
                ? '✓ Signature verified'
                : status === 'cancelled'
                  ? 'Request cancelled'
                  : 'Test failed'}
            </strong>
            <p>
              {status === 'success'
                ? 'The signature is valid for your connected account.'
                : status === 'cancelled'
                  ? 'The request was declined. You can run the test again.'
                  : report.signature
                    ? 'The signature could not be verified. See technical details below.'
                    : 'The wallet did not return a signature. See technical details below.'}
            </p>
          </Result>
        )}
      </div>

      {report && (
        <>
          <Details>
            <summary>Technical details &amp; test report</summary>
            <Muted>
              This test checks signature validity for the connected account. It
              does not check how your wallet displays the message.
            </Muted>
            <EnvironmentFields>
              <label>
                Wallet or device (optional)
                <input
                  value={walletOrDevice}
                  onChange={(event) => setWalletOrDevice(event.target.value)}
                  placeholder="Wallet app or device model"
                />
              </label>
              <label>
                Software / firmware version (optional)
                <input
                  value={version}
                  onChange={(event) => setVersion(event.target.value)}
                  placeholder="Wallet software or device firmware"
                />
              </label>
            </EnvironmentFields>
            <CopyButton text={reportText} label="Copy test report" />
            <Code>{reportText}</Code>
          </Details>
        </>
      )}
    </Card>
  );
};

export const EIP712Test = () => {
  const { address, chainId, connector } = useConnection();
  // A result belongs to one connection. Discard it when the account changes.
  return <EIP712Panel key={`${connector?.uid}:${address}:${chainId}`} />;
};
