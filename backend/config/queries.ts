import { sql } from './db.js'

// AI Gf Sprite Load

export async function sprite(userid: number, gfid: number) {
    const load = await sql`
    select gf from AI_girlfriends
    where gfID = ${gfid}
    `
}

export async function load_messages(usermessage: object) {
    const message_object: object = usermessage;
    const message: string = message_object.message;
    const userid: number = message_object.userid;
    const messagedate: Date = message_object.date;

    if (message_object && Object.keys(message_object).length > 1) {
        const load = await sql`
        select message from messages
        where ${userid} == ${messages.userid}
        and where ${messagedate} == ${messages.messagedate}
        `;
    }
}

export async function save_message(usermessage: object) {
    const message_object = usermessage;
    const message: string = message_object.message;
    const userid: number = message_object.userid;
    const messagedate: Date = message_object.date;

    if (message_object && Object.keys(message_object).length > 1) {
        const save = await sql`
        insert into messages (message)
        values (${message})
        where ${userid} == ${messages.userid}
        `;
    }
}

export async function save_conversation(messageschunk: object) {
    const messageschunk_object = messageschunk;
    const messages: string = messageschunk_object.messages;
    const userid: number = messageschunk_object.userid;
    const messagedate: Date = messageschunk_object.date;

    if (message_object && Object.keys(messageschunk_object).length > 1){
        const save = await sql`
        insert into messages (conversationhistory)
        values (${userid}, ${messages}, ${messagedate})
        where ${userid} == ${messages.userid}
        `
    }
}

export async function load_conversation(userid: number) {
    const userid_number = userid;
    if (userid_number) {
        const load_conversation: Object = await sql`
        select conversationhistory from messages
        where ${userid} == ${messages.userid}
        `
    }
}

export async function display_conversation(userid: number) {
    const userid_number = userid;
    if (userid_number) {
        const display_conversation: Object = await sql`
        select conversationname, date from messages
        where ${userid} == ${messages.userid}
        `
    }
}
