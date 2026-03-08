const fs = require('fs');
const { execSync } = require('child_process');

const files = execSync('find src/app/api -type f -name "route.ts"').toString().trim().split('\n');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('getAuthUser(request)')) {
    content = content.replace(/getAuthUser\(request\)/g, 'getAuthUser()');
    
    // Now check if `request` is unused. 
    // It is unused if it doesn't appear anywhere else like `request.json()` or `(request, `
    // A safe heuristic for this codebase: if content doesn't have `request.` and doesn't have `parseBody(request`, then it's likely unused.
    if (!content.includes('request.') && !content.includes('parseBody(request')) {
      content = content.replace(/request: NextRequest/g, '_request: NextRequest');
    }
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed ${file}`);
  }
}
