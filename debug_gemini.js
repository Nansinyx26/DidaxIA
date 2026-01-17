const https = require('https');
const fs = require('fs');

const API_KEY = "AIzaSyBiAuK77RomVzWfgxCGPDTsZHIee04eITU";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const response = JSON.parse(data);
            if (response.error) {
                fs.writeFileSync('models_error.txt', JSON.stringify(response.error, null, 2));
            } else {
                const models = response.models.map(m => m.name); // only names
                fs.writeFileSync('models_list.json', JSON.stringify(models, null, 2));
            }
        } catch (e) {
            fs.writeFileSync('models_parse_error.txt', data); // save raw data if parse fails
        }
    });

}).on("error", (err) => {
    fs.writeFileSync('models_net_error.txt', err.message);
});
