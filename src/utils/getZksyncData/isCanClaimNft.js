import axios from "axios";

const isCanClaimNft = async (address) => {
    try {
        const url = "https://qr-mint.g7p.io/api/checkWhitelist?wallet=" + address;
        const res = await axios.get(url, {timeout: 20000});
        const response = res.data.success === true ? "yes" : "no";
        console.log(response);
        return response;
    } catch (e) {
        if (e.response && e.response.status === 400) {
            if (e.response.data && e.response.data.message === "Your address is not eligible for this initial mint. Follow @zksync on Twitter for opportunities to mint the Libertas Omnibus project 🫡") {
                return "no";
            }
            return "error";
        }
        return "error";
    }
}
export default isCanClaimNft;
