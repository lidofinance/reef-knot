import { createStore } from 'mipd';

export const providersStore = createStore();
export let providers = providersStore.getProviders();
providersStore.subscribe((providerDetails) => (providers = providerDetails));
