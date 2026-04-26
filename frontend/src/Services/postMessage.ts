export async function postMessage(message: String, user: String): Promise<Response | undefined> {
    const messageBody: Object | null | undefined = {
        "User": user,
        "Message": message,
    }

    const fastAPIServer: string = "https://digital-sanctuary-ks6k.onrender.com/"

    try {
        const postMessage = await fetch(fastAPIServer, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(messageBody),
        })
        if (!postMessage.ok) {
            throw new Error("Cannot message Kurisu at the moment");
        }
        else if (postMessage.ok) {
            return postMessage;
        }

    } catch (error) {
        console.log(error)
    }


}