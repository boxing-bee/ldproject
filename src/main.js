import * as LaunchDarkly from 'launchdarkly-js-client-sdk';

// Use import.meta.env to access the environment variable
const clientSideId = import.meta.env.VITE_LAUNCHDARKLY_CLIENT_SIDE_ID;

if (!clientSideId) {
    console.error('LaunchDarkly client-side ID is missing!');
} else {
    const client = LaunchDarkly.initialize(clientSideId, {
        key: 'user-key', // Replace with a valid user key
    });

    client.on('ready', () => {
        console.log('LaunchDarkly client is ready');
    });

    const form = document.getElementById('name-form');
    const greetingDiv = document.getElementById('greeting');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value || 'friend';
        const email = document.getElementById('email').value || 'anon@example.com';

        // Create the user context
        const context = {
            kind: 'user',
            key: email,
            name: name,
            custom: {
                group: 'dev-group', // Change this to control access to `special_greeting`
            },
        };

        // Update the user context in LaunchDarkly
        await client.identify(context).then(() => {
            console.log('User context updated');
        });

        // Read flag values
        const specialGreeting = await client.variation('special_greeting', false);
        const showGreeting = await client.variation('show_greeting', false);

        // Debug logs
        console.log('special_greeting:', specialGreeting);
        console.log('show_greeting:', showGreeting);

        // Set greeting message
        if (showGreeting) {
            let message = `Hello, ${name}!`;
            if (specialGreeting) {
                message += ' You’ve unlocked a special greeting';
            }
            greetingDiv.textContent = message;
        } else {
            greetingDiv.textContent = 'Greetings are currently turned off.';
        }
    });
}