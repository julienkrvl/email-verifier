const net = require('net');
const SocksClient = require('socks5-client');

function validateEmailSMTP(email, proxyOptions = null) {
    return new Promise((resolve, reject) => {
        const [user, domain] = email.split('@');
        if (!user || !domain) {
            return reject(new Error('Invalid email format.'));
        }

        // Resolve MX records for the domain
        const dns = require('dns');
        dns.resolveMx(domain, (err, addresses) => {
            if (err) {
                return reject(new Error('DNS resolution error.'));
            }
            if (addresses.length === 0) {
                return reject(new Error('No MX records found.'));
            }

            // Connect to the SMTP server
            const mxRecord = addresses[0].exchange;
            const smtpPort = 25;

            let socket;
            if (proxyOptions) {
                socket = new SocksClient({
                    socksHost: proxyOptions.host,
                    socksPort: proxyOptions.port,
                    proxyHost: mxRecord,
                    proxyPort: smtpPort,
                    socksUsername: proxyOptions.username,
                    socksPassword: proxyOptions.password
                });
            } else {
                socket = new net.Socket();
                socket.connect(smtpPort, mxRecord);
            }

            const checkEmail = (socket) => {
                socket.setEncoding('utf8');
                socket.on('data', (data) => {
                    console.log(data);
                    if (data.includes('220')) {
                        socket.write(`EHLO ${domain}\r\n`);
                    } else if (data.includes('250')) {
                        socket.write(`MAIL FROM:<test@example.com>\r\n`);
                    } else if (data.includes('250 2.1.0')) {
                        socket.write(`RCPT TO:<${email}>\r\n`);
                    } else if (data.includes('250 2.1.5')) {
                        resolve(true); // Email is valid
                        socket.write('QUIT\r\n');
                        socket.end();
                    } else if (data.includes('550') || data.includes('450')) {
                        resolve(false); // Email is invalid
                        socket.write('QUIT\r\n');
                        socket.end();
                    }
                });

                socket.on('error', (err) => {
                    reject(err);
                });
            };

            if (proxyOptions) {
                socket.connect((err) => {
                    if (err) {
                        return reject(err);
                    }
                    checkEmail(socket);
                });
            } else {
                socket.on('connect', () => {
                    checkEmail(socket);
                });
            }
        });
    });
}

// Usage example:
const email = 'example@example.com';
// Add the proxyOptions argument if you are using a proxy
// const proxyOptions = {
//     host: '127.0.0.1',
//     port: 1080,
//     username: 'proxyUser',
//     password: 'proxyPass'
// };

validateEmailSMTP(email)
    .then(isValid => {
        console.log(`Email is ${isValid ? 'valid' : 'invalid'}`);
    })
    .catch(error => {
        console.error('Error:', error.message);
    });
