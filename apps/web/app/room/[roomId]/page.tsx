import axios from "axios";
import { BACKEND_URL } from "../../config"


async function getRoom (slug: string) {
    const response = await axios.get(`${BACKEND_URL}/room/${slug}`)
    return response.data.id;
}

export default function chatRoom({
    params
}: {
    params: {
        slug: string
    }
}
) {
    const slug = params.slug
}