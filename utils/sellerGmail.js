import { google } from 'googleapis';
import { GOOGLE_CLIENT, GOOGLE_SECRET } from '../config/env.js';
import User from '../models/user/user.js'

const sendGmailToBuyers = async (seller) => {

    const oAuth2Client = new google.auth.OAuth2(
        GOOGLE_CLIENT,
        GOOGLE_SECRET
    );

    oAuth2Client.setCredentials({
        access_token: seller.accessToken,
        refresh_token: seller.refreshToken,
    });

    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    const buyers = await User.find();

    for (const buyer of buyers) {
        const message = [
            `To: ${buyer.email}`,
            `Subject: New Product from ${seller.name}`,
            '',
            `${seller.name} has listed a new product!`,
        ].join('\n');

        try {
            await gmail.users.messages.send({
                userId: 'me',
                requestBody: {
                    raw: Buffer.from(message).toString('base64url'),
                },
            });
        } catch (err) {
            console.error(`Failed to send email to ${buyer.email}:`, err.message);
        }
    }
};

export default sendGmailToBuyers;
