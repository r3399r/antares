import BN from 'bignumber.js';

export const bn = (n: BN.Value | null): BN => new BN(n === null || n === '' ? 0 : n);

export const bnFormat = (n: BN.Value | null) => bn(n).toFormat();
