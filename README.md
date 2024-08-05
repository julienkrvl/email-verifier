
# Email SMTP Validator

A Node.js script to validate email addresses by checking SMTP servers without sending an email. It supports SOCKS5 proxy for the connections.

## Installation

First, clone the repository and navigate to the project directory:

```bash
git clone https://github.com/yourusername/email-smtp-validator.git
cd email-smtp-validator
```

Then, install the required dependencies:

```bash
npm install
```

## Usage

To validate an email address, edit the `validateEmail.js` file and set the `email` variable to the email address you want to validate. Optionally, you can also set proxy options if you need to use a SOCKS5 proxy.

Example usage:

```javascript
const email = 'example@example.com';
// Remove the proxyOptions argument if not using a proxy
const proxyOptions = {
    host: '127.0.0.1',
    port: 1080,
    username: 'proxyUser',
    password: 'proxyPass'
};

validateEmailSMTP(email)
    .then(isValid => {
        console.log(`Email is ${isValid ? 'valid' : 'invalid'}`);
    })
    .catch(error => {
        console.error('Error:', error.message);
    });
```

To run the script, use:

```bash
npm start
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with your improvements.

## Issues

If you encounter any issues, please report them on the [GitHub Issues](https://github.com/julienkrvl/email-verifier/issues) page.
