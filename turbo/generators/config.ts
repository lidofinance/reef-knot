import { PlopTypes } from "@turbo/gen";
import { walletGenerator } from './wallet/config';

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  walletGenerator(plop);
}
