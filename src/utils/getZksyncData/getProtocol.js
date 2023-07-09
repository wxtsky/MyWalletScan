import {SyncSwap} from "@utils/getZksyncData/procotols/syncswap.js";
import {Goal3} from "@utils/getZksyncData/procotols/goal3.js";
import {Holdstation} from "@utils/getZksyncData/procotols/holdstation.js";
import {IzumiFinance} from "@utils/getZksyncData/procotols/izumi.js";
import {Maverick} from "@utils/getZksyncData/procotols/maverick.js";
import {Mute} from "@utils/getZksyncData/procotols/muteio.js";
import {OnchainTrade} from "@utils/getZksyncData/procotols/onchaintrade.js";
import {Orbiter} from "@utils/getZksyncData/procotols/orbiter.js";
import {Rollup} from "@utils/getZksyncData/procotols/rollup.js";
import {SpaceFi} from "@utils/getZksyncData/procotols/spacefi.js";
import {Starmaker} from "@utils/getZksyncData/procotols/starmaker.js";
import {Velocore} from "@utils/getZksyncData/procotols/velocore.js";
import {ZkSyncEraPortal} from "@utils/getZksyncData/procotols/zksynceraportal.js";
import {ZkSyncId} from "@utils/getZksyncData/procotols/zksyncid.js";
import {ZkSyncNameService} from "@utils/getZksyncData/procotols/zksyncnameservices.js";

export const getPrtocol = async (transactions, address) => {
    const syncSwap = SyncSwap.getProtocolsState(transactions, address);
    const goal3 = Goal3.getProtocolsState(transactions, address);
    const holdstation = Holdstation.getProtocolsState(transactions, address);
    const iIzumiFinance = IzumiFinance.getProtocolsState(transactions, address);
    const maverick = Maverick.getProtocolsState(transactions, address);
    const mute = Mute.getProtocolsState(transactions, address);
    const onchainTrade = OnchainTrade.getProtocolsState(transactions, address);
    const orbiter = Orbiter.getProtocolsState(transactions, address);
    const rollup = Rollup.getProtocolsState(transactions, address);
    const spaceFi = SpaceFi.getProtocolsState(transactions, address);
    const starmaker = Starmaker.getProtocolsState(transactions, address);
    const velocore = Velocore.getProtocolsState(transactions, address);
    const zksyncportal = ZkSyncEraPortal.getProtocolsState(transactions, address);
    const zksyncid = ZkSyncId.getProtocolsState(transactions, address);
    const zksyncnameservices = ZkSyncNameService.getProtocolsState(transactions, address);

    // 使用 Promise.all 并行执行所有的异步操作
    return await Promise.all([
        syncSwap,
        goal3,
        holdstation,
        iIzumiFinance,
        maverick,
        mute,
        onchainTrade,
        orbiter,
        rollup,
        spaceFi,
        starmaker,
        velocore,
        zksyncportal,
        zksyncid,
        zksyncnameservices
    ]);
}

