import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
    headers: { 'User-Agent': 'Mozilla/5.0 Node.js' }
};

https.get('https://api.github.com/repos/DavidHDev/react-bits/git/trees/main?recursive=1', options, (res) => {
    let raw = '';
    res.on('data', chunk => raw += chunk);
    res.on('end', () => {
        try {
            const data = JSON.parse(raw);
            if(!data.tree) {
                console.error("No tree found:", data);
                return;
            }
            const tree = data.tree;
            const targets = ['Cubes', 'ScrollStack', 'BubbleMenu', 'TiltedCard'];
            
            tree.forEach(item => {
                // Ensure we only grab standard versions, skip tailwind version entirely
                if (item.path.includes('/tailwind/')) return;
                
                if (item.type === 'blob' && item.path.endsWith('.jsx')) {
                    const filename = path.basename(item.path, '.jsx');
                    if (targets.includes(filename)) {
                        console.log(`Found Vanilla: ${item.path}`);
                        const url = `https://raw.githubusercontent.com/DavidHDev/react-bits/main/${item.path}`;
                        const destDir = path.join(__dirname, 'src', 'reactbits');
                        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
                        const destFile = path.join(destDir, `${filename}.jsx`);
                        
                        https.get(url, (fileRes) => {
                            let fileRaw = '';
                            fileRes.on('data', c => fileRaw += c);
                            fileRes.on('end', () => {
                                fs.writeFileSync(destFile, fileRaw);
                                console.log(`Downloaded Vanilla ${filename} successfully.`);
                            });
                        });
                    }
                }
                
                if (item.type === 'blob' && item.path.endsWith('.css')) {
                    const filename = path.basename(item.path, '.css');
                    if (targets.includes(filename)) {
                        const url = `https://raw.githubusercontent.com/DavidHDev/react-bits/main/${item.path}`;
                        const destDir = path.join(__dirname, 'src', 'reactbits');
                        const destFile = path.join(destDir, `${filename}.css`);
                        https.get(url, (fileRes) => {
                            let fileRaw = '';
                            fileRes.on('data', c => fileRaw += c);
                            fileRes.on('end', () => fs.writeFileSync(destFile, fileRaw));
                        });
                    }
                }
            });
        } catch (e) {
            console.error('JSON Error', e);
        }
    });
}).on('error', e => console.error(e));
