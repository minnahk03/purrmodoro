const esbuild=require('esbuild'),fs=require('fs');
esbuild.buildSync({entryPoints:['preview-entry.tsx'],bundle:true,outfile:'preview-temp.js',minify:true});
const js=fs.readFileSync('preview-temp.js','utf8'),css=fs.readFileSync('preview-temp.css','utf8');
fs.writeFileSync('Preview.html',`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Purrmodoro · Study cat</title><style>${css}body{background:#f2eee6;min-height:100vh;display:grid;place-items:center;padding:28px}#app{width:330px;max-width:100%}.preview-label{font:12px 'Trebuchet MS',sans-serif;color:#887362;text-align:center;margin-bottom:14px}</style><div><div class="preview-label">PURRMODORO · INTERACTIVE PREVIEW</div><div id="app"></div></div><script>${js.replace(/<\/script/gi,'<\\/script')}</script></html>`);
fs.unlinkSync('preview-temp.js');fs.unlinkSync('preview-temp.css');
