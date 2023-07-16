import axios from 'axios';

export async function getAccountInfo(address) {
    try {
        const response = await axios.get(`https://voyager.online/api/contract/${address}`);
        const {classAlias, nonce} = response.data;
        return {
            classAlias: classAlias === 'BraavosProxy' ? 'Braavos' : 'Argent',
            nonce: parseInt(nonce, 16)
        }
    } catch (e) {
        return {
            classAlias: '-',
            nonce: '-'
        }
    }

}

