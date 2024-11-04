import { createRestAPIClient, createStreamingAPIClient } from 'masto';

const mastodonHost = process.env.MASTODON_HOST;
if (!mastodonHost) {
    console.log('MASTODON_HOST is not set.');
    process.exit(1);
}
console.log(`Mastodon: ${mastodonHost}`);

const accessToken = process.env.ACCESS_TOKEN;
if (!accessToken) {
    console.log('ACCESS_TOKEN is not set.');
    process.exit(1);
}

const rest = createRestAPIClient({
    url: `https://${mastodonHost}`,
    accessToken,
});
const streaming = createStreamingAPIClient({
    streamingApiUrl: `wss://${mastodonHost}/api/v1/streaming`,
    accessToken,
});

const likely = ({ account, mentions, mediaAttachments }) => {
    if (account.username.length !== 10 || mentions.length === 0) {
        return false;
    }

    if (mentions.length > 5) {
        return true;
    }

    return mentions.length > 3 && mediaAttachments.length > 0;
}

for await (const msg of streaming.public.remote.subscribe()) {
    if (msg.event !== 'update') {
        continue;
    }

    if (likely(msg.payload)) {
        console.log(`Found @${account.acct}`);
        await rest.v1.admin.accounts.$select(account.id).action.create({ type: 'suspend' });
    }
}
