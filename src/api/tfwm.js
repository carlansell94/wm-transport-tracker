import MessagePopup from "../components/message";
import { APP_ID, APP_KEY } from "./auth";

async function tfwmApiRequest(endpoint, params = []) {
    let request = endpoint
        + "?app_id=" + APP_ID
        + "&app_key=" + APP_KEY
        + "&formatter=JSON";
    
    for (const [key, value] of Object.entries(params)) {
        request += `&${key}=${value}`;
    }

    try {
        const response = await fetch(request);
        return await response.json();
    } catch {
        MessagePopup('Error fetching data, check your network connection');
    }
}

export default tfwmApiRequest;