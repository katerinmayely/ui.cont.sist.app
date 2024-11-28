import { API_URL } from "@/app/utils/settings";
import { HTTPError } from '../../../utils/HTTPError'

export async function GetHelloInfo() {

    const response = await fetch(`${ API_URL }/`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
            , 'Cache-Control': 'no-cache'
        }
    });

    if (!response.ok) {
        throw new HTTPError(response);
    }

    const data = await response.json();
    return data;

}