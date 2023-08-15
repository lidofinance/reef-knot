import { Select, Option, OptionValue } from '@lidofinance/lido-ui';
import React, { useEffect, useState } from 'react';
import { useWeb3 } from 'reef-knot/web3-react';
import { utils } from 'ethers';
import { CHAINS } from '../config/chains';

const NetworkSelector = () => {
  const { chainId = CHAINS.Goerli, library } = useWeb3();

  const [network, setNetwork] = useState(CHAINS.Goerli);

  const handleChange = (value: OptionValue) => {
    library?.provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: utils.hexValue(value) }],
    });
    setNetwork(value as CHAINS);
  };

  useEffect(() => {
    handleChange(chainId);
  }, [chainId]);

  return (
    <Select label="Network" onChange={handleChange} value={network}>
      <Option value={CHAINS.Mainnet}>Mainet</Option>
      <Option value={CHAINS.Goerli}>Goerli</Option>
    </Select>
  );
};

export default NetworkSelector;
