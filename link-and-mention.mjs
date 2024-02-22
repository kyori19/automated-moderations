#!/usr/bin/env node

import common from './common.mjs';

const accounts = async (mastodonHost, accessToken) => {
    console.log('Listing statuses...');
    return fetch(
        `https://${mastodonHost}/api/v1/timelines/public?remote=true&limit=40&max_id=111975228698390550`,
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        },
    )
        .then((res) => res.json())
        .then((statuses) => statuses
            .filter(({account, mentions, card}) => account.username.length === 10 && mentions.length > 2 && card.url.contains('xn--68j5e377y.com'))
            .map((s) => {console.log(s); return s})
            .map(({account}) => {
                console.log(`Found @${account.acct}`);
                return account.id;
            }));
};

await common(accounts);
