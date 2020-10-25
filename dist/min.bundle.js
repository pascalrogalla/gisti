#! /usr/bin/env node
var t=require("commander"),e=require("terminal-link"),i=require("lolcatjs"),o=require("configstore"),s=require("@octokit/rest"),a=require("fs"),n=require("chalk"),r=require("inquirer"),l=require("https"),c=require("figlet"),d=require("opn"),p=require("clipboardy");function u(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var g=u(t),f=u(e),m=u(i),h=u(o),y=u(a),w=u(n),b=u(r),v=u(l),k=u(c),S=u(d),G=u(p),$="gisti",L="0.0.12";const q=new h.default($,{},{globalConfigPath:!0});let T;var I=t=>{q.set("github.token",t),console.log("Token successfully saved")},x=()=>q.get("github.token");const C=t=>{!!x()?t():(D(),console.log(w.default.red.bold("Set your personal github access token")),console.log(`run ${w.default.rgb(0,160,200).bold("gisti auth")} or ${w.default.rgb(0,160,200).bold("gisti auth --token <token>")}`))},D=()=>{m.default.fromString(k.default.textSync("GISTI",{font:"ANSI Shadow",horizontalLayout:"full"}))},P=(t,e)=>t?[e]:[],O=(t,e=process.cwd())=>{const i=t.gistId?`${t.gistId}_${t.filename}`:t.filename,o=y.default.createWriteStream(`${e}/${i}`);return new Promise((e=>v.default.get(t.raw_url,(s=>{s.pipe(o),console.log(w.default.green(i+" downloaded")),e(t)}))))},j=({id:t,files:e})=>{const i=`${process.cwd()}/${t}`;(t=>{y.default.existsSync(t)||y.default.mkdirSync(t)})(i);const o=Object.values(e),s=[];for(const t of o)s.push(O(t,i));return Promise.all(s)},z=async({html_url:t})=>{S.default(t)},_=(t,e)=>{Y(t,e).forEach((t=>console.log(t)))},Y=(t,e=!1)=>t.reduce(((t,i)=>{const o=Object.values(i.files);return[...t,...[w.default.rgb(184,190,202).bold(`${i.id} - ${i.description} - Files:${o.length}${i.public?"":w.default.rgb(236,98,113)(" [Private]")}`),...P(e,...o.map((t=>"- "+t.filename)))]]}),[]),A=t=>t.reduce(((t,e)=>{const i=e.split("/");return{...t,[i[i.length-1]]:{content:y.default.readFileSync(e,"utf8")}}}),{}),E=async t=>t.reduce(((t,e)=>[...t,...[{name:`${w.default.rgb(184,190,202).bold(e.id)} - ${e.description}`,value:e}]]),[]),F=(()=>{const t=q.get("github.token");return T=new s.Octokit({auth:t}),T})(),M=(t,e)=>{switch(2*e+t){case 1:return U();case 2:return R();default:return N()}},N=async()=>{const{data:t}=await F.gists.list();return t},R=async()=>{const{data:t}=await F.gists.list();return t.filter((({public:t})=>!1===t))},U=async()=>{const{data:t}=await F.gists.listStarred();return t},W=t=>F.gists.get({gist_id:t}),B=async t=>{const e=await N();return t?e.filter((({id:e,description:i})=>{return o=`${e} ${i}`,t.split(" ").every((t=>o.match(new RegExp(t,"i"))));var o})):e},H=t=>F.gists.delete({gist_id:t}),J=()=>b.default.prompt([{name:"continueDelete",type:"confirm",message:"Are you sure you want to delete this gist?",default:!1}]),K=async()=>{const{searchString:t}=await b.default.prompt([{name:"searchString",type:"input",message:"Search:",validate:t=>!!t.length||"Please enter a search"}]);return await B(t)},Q=async t=>{const e=await(async t=>t.reduce(((t,e)=>{const i=Object.values(e.files);return[...t,new b.default.Separator(w.default.rgb(184,190,202).bold(`${e.description} - files: ${i.length}`)),...P(i.length>1,{name:w.default.rgb(0,160,200).bold(e.id),value:e}),...i.map((t=>({name:""+t.filename,value:{...t,gistId:e.id}})))]}),[]))(t),{gistsToDownload:i}=await(t=>{const e=[{type:"checkbox",message:"Choose gists or files to download",name:"gistsToDownload",pageSize:t.length,choices:t,validate:t=>!(t.length<1)||"You must choose at least one gist or file."}];return b.default.prompt(e)})(e),o=[];for(const t of i)t.id&&o.push(j(t)),t.filename&&o.push(O(t));await Promise.all(o),console.log(w.default.green.bold("Download finished"))},V=async t=>{const e=await E(t),{gistToOpen:i}=await(t=>{const e=[{type:"list",message:"Select gist to open",name:"gistToOpen",pageSize:t.length,choices:t,validate:t=>!(t.length<1)||"You must choose at least one gist or file."}];return b.default.prompt(e)})(e);z(i)},X=async t=>{const e=await E(t),{gistToCopy:i}=await(async t=>{const e=[{type:"list",message:"Select gist to copy",name:"gistToCopy",pageSize:t.length,choices:t,validate:t=>!(t.length<1)||"You must choose at least one gist or file."}];return b.default.prompt(e)})(e);(({id:t})=>{G.default.write(t)})(i)},Z=async t=>{const e=await E(t),{gistToDelete:{id:i}}=await(async t=>{const e=[{type:"list",message:"Select gist to delete",name:"gistToDelete",pageSize:t.length,choices:t,validate:t=>1===t.length||"You must choose one gist."}];return b.default.prompt(e)})(e),{continueDelete:o}=await J();o&&H(i)};m.default.options.seed=744;g.default.name("gisti").description("GISTI - The interactive CLI for gist").version(L),g.default.command("auth [token]").description("Set/Update personal access token").option("-t, --token <token>","Set token").action((async(t,{token:e})=>{if(t=t||e)I(t);else{const t=f.default("https://github.com/settings/tokens","https://github.com/settings/tokens/new?description=GISTI&scopes=gist",{fallback:t=>t});console.log("Create a new personal access token at: "+w.default.rgb(0,160,200).bold(t));const{token:e}=await b.default.prompt([{name:"token",type:"input",message:"Access Token:",validate:t=>!!t.length||"Please enter a token"}]);I(e)}})),g.default.command("list").description("List your gists").option("-x, --private","List private Gists",!1).option("-s, --starred","List starred Gists",!1).option("-p, --public","List public Gists",!1).option("-f, --files","List files of Gist",!1).action((({starred:t,private:e,files:i})=>C((async()=>{const o=await M(t,e);_(o,i)})))),g.default.command("copy").description("Copy the id of a gist to clipboard").option("-x, --private","List private Gists",!1).option("-s, --starred","List starred Gists",!1).option("-p, --public","List public Gists",!1).action((({starred:t,private:e})=>C((async()=>{const i=await M(t,e);X(i)})))),g.default.command("open [id]").description("").option("--id <id>","Gist id for non-interactive update").option("-x, --private","List private Gists",!1).option("-s, --starred","List starred Gists",!1).option("-p, --public","List public Gists",!1).action(((t,{id:e,starred:i,private:o})=>C((async()=>{if(t=t||e)(async t=>{const{data:e}=await W(t);z(e),Promise.resolve()})(t);else{const t=await M(i,o);V(t)}})))),g.default.command("create <files...>").description("").option("-x, --private","Create private Gist",!0).option("-p, --public","Create public Gists",!1).option("-d, --description <description>","Set the gist description").action(((t,{private:e,description:i})=>C((()=>{const o=A(t);(t=>{F.gists.create(t)})({description:i,public:!e,files:o})})))),g.default.command("add  <files...>").description("").option("--id <id>","Gist id for non-interactive add").option("-d, --description <description>","Set the gist description").action(((t,{id:e})=>C((()=>{const i=A(t);console.log(i),console.log("files",t),console.log("Id",e)})))),g.default.command("download [id]").description("").option("--id <id>","Gist id").option("-x, --private","Make Gist private",!1).option("-s, --starred","Search your starred gists",!1).option("-p, --public","List starred Gists",!1).action(((t,{private:e,id:i,starred:o})=>C((async()=>{if(t=t||i){const{data:e}=await W(t);j(e)}else{const t=await M(o,e);Q(t)}})))),g.default.command("search [query]").description("").option("-l, --list","List search result").option("-c, --copy","Copy the id of one resulted gist").option("-o, --open","Open one resulted gist in browser").option("-d, --download","Download resulted gists").action(((t,{list:e,copy:i,open:o,download:s})=>C((async()=>{const a=(({list:t,copy:e,open:i,download:o})=>o?Q:t?_:e?X:i?V:_)({list:e,copy:i,open:o,download:s});if(t){a(await B(t))}else{a(await K())}})))),g.default.command("delete [id]").description("").option("-x, --private","Make Gist private",!1).option("-p, --public","List starred Gists",!1).action(((t,{private:e,id:i,starred:o})=>C((async()=>{if(t=t||i){const{continueDelete:e}=await J();e&&H(t)}else{const t=await M(o,e);Z(t)}}))));g.default.parse(process.argv);
