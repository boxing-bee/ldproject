import * as LaunchDarkly from 'launchdarkly-js-client-sdk';

// Use import.meta.env to access the environment variable
const clientSideId = import.meta.env.VITE_LAUNCHDARKLY_CLIENT_SIDE_ID;

if (!clientSideId) {
    console.error('LaunchDarkly client-side ID is missing!');
} else {
    const client = LaunchDarkly.initialize(clientSideId, {
        key: 'user-key', // Replace with a valid user key
    });

    client.on('ready', async () => {
        console.log('LaunchDarkly client is ready');

        // Create the user context
        const context = {
            kind: 'user',
            key: 'barry@example', // Replace with a valid user key
            name: 'barry', // Optional: Add a name for debugging
            custom: {
                group: 'dev', // Ensure this matches the targeting rules in LaunchDarkly
            },
        };

        // Identify the user
        await client.identify(context).then(() => {
            console.log('User context sent to LaunchDarkly:', context);
        });

        // Log the initial value of the special_greeting flag
        const specialGreeting = await client.variation('special_greeting', false);
        console.log('Initial value of special_greeting:', specialGreeting);
    });
}