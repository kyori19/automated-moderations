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

const exec = (accounts) => async () => {
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

    const ids = new Set(await accounts(mastodonHost, accessToken));

    if (ids.size === 0) {
        console.log('No accounts will be suspended.');
        return;
    }

    console.log(`Suspending ${ids.size} accounts...`);
    await Promise.all(Array.from(ids).map(suspend(mastodonHost, accessToken)));
    console.log('Done!');
};

export default async (accounts) => {
    const fn = exec(accounts);
    await fn();
    setInterval(fn, 3 * 1000);
};
