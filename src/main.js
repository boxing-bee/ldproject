import * as LaunchDarkly from 'launchdarkly-js-client-sdk';

const form = document.getElementById('name-form');
const greetingDiv = document.getElementById('greeting');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    const context = {
        kind: 'user',
        key: email || 'anon-user',
        name: name,
        email: email,
        custom: {
            group: 'dev' // change as needed
        }
    };

    const ldClient = LaunchDarkly.initialize('CLIENT_SIDE_KEY', context);

    await ldClient.waitForInitialization();

    const specialGreeting = ldClient.variation('special_greeting', false);
    const showGreeting = ldClient.variation('show_greeting', false);


    console.log('special_greeting:', specialGreeting);
    console.log('show_greeting:', showGreeting);


    let message = '';
    if (showGreeting) {
        message = `Hello, ${name || 'friend'}!`;
        if (specialGreeting) {
            message += ' 🎉 Special greeting for devs!';
        }
    } else {
        message = 'Greetings are currently turned off.';
    }

    greetingDiv.textContent = message;
});
