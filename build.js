const fs = require('fs');
const path = require('path');
const output = path.join(__dirname, 'dist');
fs.rmSync(output, { recursive:true, force:true });
fs.mkdirSync(output, { recursive:true });
for (const file of ['index.html','thank-you.html','styles.css','app.js']) fs.copyFileSync(path.join(__dirname,file),path.join(output,file));
fs.cpSync(path.join(__dirname,'assets'),path.join(output,'assets'),{recursive:true});
console.log('Built public website in dist.');
