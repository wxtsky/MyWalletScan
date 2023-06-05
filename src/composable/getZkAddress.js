
import localAddressInfo from '@address'
import { zkRow } from './zkTable';

export const initZKAddress = () => {
    const localAddress = localAddressInfo.ZK;
    return localAddress.map(item => {
        return {
            ...zkRow,
            ...item,
            key: item.address,
        }
    })
}