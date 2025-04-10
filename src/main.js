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

        // Get the form and greeting div
        const form = document.getElementById('name-form');
        const greetingDiv = document.getElementById('greeting');
        const messageDiv = document.getElementById('message'); // Div to display flag change info

        // Add an event listener to the form
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get the user input
            const name = document.getElementById('name').value || 'friend';
            const email = document.getElementById('email').value || 'anon@example.com';

            // Create the user context dynamically
            const context = {
                kind: 'user',
                key: email, // Use the email entered by the user
                name: name, // Use the name entered by the user
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

            // Update the greeting message
            if (showGreeting) {
                let message = `Hello, ${name}!`;
                if (specialGreeting) {
                    message += ' You’ve unlocked a special greeting!';
                }
                greetingDiv.textContent = message;
            } else {
                greetingDiv.textContent = 'Greetings are currently turned off.';
            }
        });

        // Add an event listener for flag changes
        client.on('change', (flagKey, changes) => {
            const startTime = Date.now(); // Capture the time when the flag change is detected

            // Debugging: Log the raw flagKey and changes
            console.log('Raw flagKey:', flagKey);
            console.log('Raw changes:', changes);

            // Handle the case where flagKey is an object (batch of flag changes)
            if (typeof flagKey === 'object') {
                Object.keys(flagKey).forEach((key) => {
                    const flagChanges = flagKey[key]; // Get the changes for this specific flag
                    console.log(`Processing flag "${key}" with changes:`, flagChanges);

                    // Ensure the flag changes have a current property
                    if (flagChanges && typeof flagChanges.current !== 'undefined') {
                        // Update the UI to show which flag was toggled off
                        if (flagChanges.current === false) {
                            const endTime = Date.now(); // Capture the time after the UI update
                            const timeTaken = endTime - startTime; // Calculate the time taken in milliseconds

                            // Update the UI with the flag change information
                            if (messageDiv) {
                                messageDiv.textContent = `Flag "${key}" was toggled off. UI updated in ${timeTaken} ms.`;
                            }

                            // Log the time taken in the console
                            console.log(`UI updated for flag "${key}" in ${timeTaken} ms.`);
                        }
                    } else {
                        console.warn(`No valid changes object provided for flag "${key}".`);
                    }
                });
                return;
            }

            // Handle the case where flagKey is a string (single flag change)
            if (typeof flagKey === 'string' && changes && typeof changes.current !== 'undefined') {
                // Update the UI to show which flag was toggled off
                if (changes.current === false) {
                    const endTime = Date.now(); // Capture the time after the UI update
                    const timeTaken = endTime - startTime; // Calculate the time taken in milliseconds

                    // Update the UI with the flag change information
                    if (messageDiv) {
                        messageDiv.textContent = `Flag "${flagKey}" was toggled off. UI updated in ${timeTaken} ms.`;
                    }

                    // Log the time taken in the console
                    console.log(`UI updated for flag "${flagKey}" in ${timeTaken} ms.`);
                }
            } else {
                console.warn(`Unexpected flagKey type or no valid changes provided. flagKey:`, flagKey, 'changes:', changes);
            }
        });
    });
}