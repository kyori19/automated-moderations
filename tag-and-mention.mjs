#!/usr/bin/env node

const suspend = (mastodonHost, accessToken) => (id) => fetch(
    `https://${mastodonHost}/api/v1/admin/accounts/${id}/action`,
    {
            method: 'post',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'suspend',
            }),
        },
    );

const exec = async () => {
    const mastodonHost = process.env.MASTODON_HOST;
    if (!mastodonHost) {
        console.log('MASTODON_HOST is not set.');
        return;
    }
    console.log(`Mastodon: ${mastodonHost}`);

    const accessToken = process.env.ACCESS_TOKEN;
    if (!accessToken) {
        console.log('ACCESS_TOKEN is not set.');
        return;
    }

    const hashtag = process.argv[2];
    if (!hashtag) {
        console.log('Hashtag is not provided.');
        return;
    }

    console.log(`Listing statuses for hashtag #${hashtag}...`);
    const accounts = await fetch(
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
            .map(({ account, content }) => {
                console.log(`Found @${account.acct}.`);
                return account.id;
            }))
        .then((accounts) => new Set(accounts));

    if (accounts.size === 0) {
        console.log('No accounts will be suspended.');
        return;
    }

    console.log(`Suspending ${accounts.size} accounts...`);
    await Promise.all(Array.from(accounts).map(suspend(mastodonHost, accessToken)));
    console.log('Done!');
};

await exec();
setInterval(exec, 10 * 1000);
