const https = require('https');
const fs = require('fs');
const path = require('path');

const options = {
    headers: { 'User-Agent': 'Node.js Script' }
};

https.get('https://api.github.com/repos/DavidHDev/react-bits/git/trees/main?recursive=1', options, (res) => {
    let raw = '';
    res.on('data', chunk => raw += chunk);
    res.on('end', () => {
        const data = JSON.parse(raw);
        if(!data.tree) {
            console.error("No tree found:", data);
            return;
        }
        const tree = data.tree;
        const targets = ['SplashCursor.jsx', 'SplashCursor.js', 'Cubes.jsx', 'ScrollStack.jsx', 'BubbleMenu.jsx', 'TitledCard.jsx', 'TiltedCard.jsx'];
        let count = 0;
        
        tree.forEach(item => {
            const filename = path.basename(item.path);
            if (targets.includes(filename) && item.type === 'blob') {
                const url = `https://raw.githubusercontent.com/DavidHDev/react-bits/main/${item.path}`;
                const componentName = filename.replace(/\.jsx|\.js/, '');
                const destDir = path.join('e:/Projects/MERN/AlgoArena/frontend/src/reactbits', componentName);
                fs.mkdirSync(destDir, { recursive: true });
                
                https.get(url, (fileRes) => {
                    let fileRaw = '';
                    fileRes.on('data', c => fileRaw += c);
                    fileRes.on('end', () => {
                        fs.writeFileSync(path.join(destDir, filename), fileRaw);
                        console.log(`Saved ${filename} from ${item.path}`);
                    });
                });
                count++;
            }
        });
        console.log(`Found ${count} matching components in tree.`);
    });
}).on('error', e => console.error(e));
