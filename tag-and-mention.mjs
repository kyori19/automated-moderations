#!/usr/bin/env node

import common from './common.mjs';

const accounts = async (mastodonHost, accessToken) => {
    const hashtag = process.argv[2];
    if (!hashtag) {
        console.log('Hashtag is not provided.');
        return [];
    }

    console.log(`Listing statuses for hashtag #${hashtag}...`);
    return fetch(
        `https://${mastodonHost}/api/v1/timelines/tag/${hashtag}?remote=true&limit=40`,
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        },
    )
        .then((res) => res.json())
        .then((statuses) => statuses
            .filter(({ account, mentions }) => account.username.length === 10 && mentions.length > 1)
            .map(({ account }) => {
                console.log(`Found @${account.acct}.`);
                return account.id;
            }));
};

await common(accounts);
