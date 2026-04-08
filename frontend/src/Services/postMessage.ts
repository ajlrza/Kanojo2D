export async function postMessage(message: String, user: String) {
    const messageBody: Object | null | undefined = {
        "User": user,
        "Message": message,
    }

    const fastAPIServer: string = "https://link.com/talk"

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

    } catch (error) {
        return error
    }

}