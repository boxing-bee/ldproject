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
            key: 'barry@example.com', // Replace with a valid user key
            name: 'barry', // Optional: Add a name for debugging
            custom: {
                group: 'dev', // Ensure this matches the targeting rules in LaunchDarkly
            },
        };

        // Identify the user
        await client.identify(context).then(() => {
            console.log('User context sent to LaunchDarkly:', context);
        });

        // Evaluate the flags
        const specialGreeting = await client.variation('special_greeting', false);
        const showGreeting = await client.variation('show_greeting', false);

        // Debug logs
        console.log('special_greeting:', specialGreeting);
        console.log('show_greeting:', showGreeting);

        // Get the greeting div
        const greetingDiv = document.getElementById('greeting');

        // Set the greeting message based on the flags
        if (showGreeting) {
            let message = `Hello, ${context.name}!`;
            if (specialGreeting) {
                message += ' You’ve, unlocked a special greeting!';
            }
            greetingDiv.textContent = message;
        } else {
            greetingDiv.textContent = 'Greetings are currently turned off.';
        }
    });
}