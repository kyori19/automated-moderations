#!/usr/bin/env node

import common from './common.mjs';

const accounts = async (mastodonHost, accessToken) => {
    console.log('Listing statuses with media...');
    return fetch(
        `https://${mastodonHost}/api/v1/timelines/public?remote=true&only_media=true&limit=40`,
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        },
    )
        .then((res) => res.json())
        .then((statuses) => statuses
            .filter(({account, mentions}) => account.username.length === 10 && mentions.length > 2)
            .map(({account}) => {
                console.log(`Found @${account.acct}`);
                return account.id;
            }));
};

await common(accounts);
