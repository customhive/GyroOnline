(()=>{var j0=Object.create;var fh=Object.defineProperty;var Q0=Object.getOwnPropertyDescriptor;var eg=Object.getOwnPropertyNames;var tg=Object.getPrototypeOf,ng=Object.prototype.hasOwnProperty;var ig=i=>{throw TypeError(i)};var sg=(i,e)=>()=>{try{return e||i((e={exports:{}}).exports,e),e.exports}catch(t){throw e=0,t}},so=(i,e)=>{for(var t in e)fh(i,t,{get:e[t],enumerable:!0})},rg=(i,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of eg(e))!ng.call(i,s)&&s!==t&&fh(i,s,{get:()=>e[s],enumerable:!(n=Q0(e,s))||n.enumerable});return i};var Af=(i,e,t)=>(t=i!=null?j0(tg(i)):{},rg(e||!i||!i.__esModule?fh(t,"default",{value:i,enumerable:!0}):t,i));var Tr=(i,e,t)=>e.has(i)?ig("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(i):e.set(i,t);var Id=sg((tw,Pd)=>{"use strict";var oe={};oe.generateIdentifier=function(){return Math.random().toString(36).substring(2,12)};oe.localCName=oe.generateIdentifier();oe.splitLines=function(i){return i.trim().split(`
`).map(e=>e.trim())};oe.splitSections=function(i){return i.split(`
m=`).map((t,n)=>(n>0?"m="+t:t).trim()+`\r
`)};oe.getDescription=function(i){let e=oe.splitSections(i);return e&&e[0]};oe.getMediaSections=function(i){let e=oe.splitSections(i);return e.shift(),e};oe.matchPrefix=function(i,e){return oe.splitLines(i).filter(t=>t.indexOf(e)===0)};oe.parseCandidate=function(i){let e;i.indexOf("a=candidate:")===0?e=i.substring(12).split(" "):e=i.substring(10).split(" ");let t={foundation:e[0],component:{1:"rtp",2:"rtcp"}[e[1]]||e[1],protocol:e[2].toLowerCase(),priority:parseInt(e[3],10),ip:e[4],address:e[4],port:parseInt(e[5],10),type:e[7]};for(let n=8;n<e.length;n+=2)switch(e[n]){case"raddr":t.relatedAddress=e[n+1];break;case"rport":t.relatedPort=parseInt(e[n+1],10);break;case"tcptype":t.tcpType=e[n+1];break;case"ufrag":t.ufrag=e[n+1],t.usernameFragment=e[n+1];break;default:t[e[n]]===void 0&&(t[e[n]]=e[n+1]);break}return t};oe.writeCandidate=function(i){let e=[];e.push(i.foundation);let t=i.component;t==="rtp"?e.push(1):t==="rtcp"?e.push(2):e.push(t),e.push(i.protocol.toUpperCase()),e.push(i.priority),e.push(i.address||i.ip),e.push(i.port);let n=i.type;return e.push("typ"),e.push(n),n!=="host"&&i.relatedAddress&&i.relatedPort!==void 0&&(e.push("raddr"),e.push(i.relatedAddress),e.push("rport"),e.push(i.relatedPort)),i.tcpType&&i.protocol.toLowerCase()==="tcp"&&(e.push("tcptype"),e.push(i.tcpType)),(i.usernameFragment||i.ufrag)&&(e.push("ufrag"),e.push(i.usernameFragment||i.ufrag)),"candidate:"+e.join(" ")};oe.parseIceOptions=function(i){return i.substring(14).split(" ")};oe.parseRtpMap=function(i){let e=i.substring(9).split(" "),t={payloadType:parseInt(e.shift(),10)};return e=e[0].split("/"),t.name=e[0],t.clockRate=parseInt(e[1],10),t.channels=e.length===3?parseInt(e[2],10):1,t.numChannels=t.channels,t};oe.writeRtpMap=function(i){let e=i.payloadType;i.preferredPayloadType!==void 0&&(e=i.preferredPayloadType);let t=i.channels||i.numChannels||1;return"a=rtpmap:"+e+" "+i.name+"/"+i.clockRate+(t!==1?"/"+t:"")+`\r
`};oe.parseExtmap=function(i){let e=i.substring(9).split(" ");return{id:parseInt(e[0],10),direction:e[0].indexOf("/")>0?e[0].split("/")[1]:"sendrecv",uri:e[1],attributes:e.slice(2).join(" ")}};oe.writeExtmap=function(i){return"a=extmap:"+(i.id||i.preferredId)+(i.direction&&i.direction!=="sendrecv"?"/"+i.direction:"")+" "+i.uri+(i.attributes?" "+i.attributes:"")+`\r
`};oe.parseFmtp=function(i){let e={},t,n=i.substring(i.indexOf(" ")+1).split(";");for(let s=0;s<n.length;s++)t=n[s].trim().split("="),e[t[0].trim()]=t[1];return e};oe.writeFmtp=function(i){let e="",t=i.payloadType;if(i.preferredPayloadType!==void 0&&(t=i.preferredPayloadType),i.parameters&&Object.keys(i.parameters).length){let n=[];Object.keys(i.parameters).forEach(s=>{i.parameters[s]!==void 0?n.push(s+"="+i.parameters[s]):n.push(s)}),e+="a=fmtp:"+t+" "+n.join(";")+`\r
`}return e};oe.parseRtcpFb=function(i){let e=i.substring(i.indexOf(" ")+1).split(" ");return{type:e.shift(),parameter:e.join(" ")}};oe.writeRtcpFb=function(i){let e="",t=i.payloadType;return i.preferredPayloadType!==void 0&&(t=i.preferredPayloadType),i.rtcpFeedback&&i.rtcpFeedback.length&&i.rtcpFeedback.forEach(n=>{e+="a=rtcp-fb:"+t+" "+n.type+(n.parameter&&n.parameter.length?" "+n.parameter:"")+`\r
`}),e};oe.parseSsrcMedia=function(i){let e=i.indexOf(" "),t={ssrc:parseInt(i.substring(7,e),10)},n=i.indexOf(":",e);return n>-1?(t.attribute=i.substring(e+1,n),t.value=i.substring(n+1)):t.attribute=i.substring(e+1),t};oe.parseSsrcGroup=function(i){let e=i.substring(13).split(" ");return{semantics:e.shift(),ssrcs:e.map(t=>parseInt(t,10))}};oe.getMid=function(i){let e=oe.matchPrefix(i,"a=mid:")[0];if(e)return e.substring(6)};oe.parseFingerprint=function(i){let e=i.substring(14).split(" ");return{algorithm:e[0].toLowerCase(),value:e[1].toUpperCase()}};oe.getDtlsParameters=function(i,e){return{role:"auto",fingerprints:oe.matchPrefix(i+e,"a=fingerprint:").map(oe.parseFingerprint)}};oe.writeDtlsParameters=function(i,e){let t="a=setup:"+e+`\r
`;return i.fingerprints.forEach(n=>{t+="a=fingerprint:"+n.algorithm+" "+n.value+`\r
`}),t};oe.parseCryptoLine=function(i){let e=i.substring(9).split(" ");return{tag:parseInt(e[0],10),cryptoSuite:e[1],keyParams:e[2],sessionParams:e.slice(3)}};oe.writeCryptoLine=function(i){return"a=crypto:"+i.tag+" "+i.cryptoSuite+" "+(typeof i.keyParams=="object"?oe.writeCryptoKeyParams(i.keyParams):i.keyParams)+(i.sessionParams?" "+i.sessionParams.join(" "):"")+`\r
`};oe.parseCryptoKeyParams=function(i){if(i.indexOf("inline:")!==0)return null;let e=i.substring(7).split("|");return{keyMethod:"inline",keySalt:e[0],lifeTime:e[1],mkiValue:e[2]?e[2].split(":")[0]:void 0,mkiLength:e[2]?e[2].split(":")[1]:void 0}};oe.writeCryptoKeyParams=function(i){return i.keyMethod+":"+i.keySalt+(i.lifeTime?"|"+i.lifeTime:"")+(i.mkiValue&&i.mkiLength?"|"+i.mkiValue+":"+i.mkiLength:"")};oe.getCryptoParameters=function(i,e){return oe.matchPrefix(i+e,"a=crypto:").map(oe.parseCryptoLine)};oe.getIceParameters=function(i,e){let t=oe.matchPrefix(i+e,"a=ice-ufrag:")[0],n=oe.matchPrefix(i+e,"a=ice-pwd:")[0];return t&&n?{usernameFragment:t.substring(12),password:n.substring(10)}:null};oe.writeIceParameters=function(i){let e="a=ice-ufrag:"+i.usernameFragment+`\r
a=ice-pwd:`+i.password+`\r
`;return i.iceLite&&(e+=`a=ice-lite\r
`),e};oe.parseRtpParameters=function(i){let e={codecs:[],headerExtensions:[],fecMechanisms:[],rtcp:[]},n=oe.splitLines(i)[0].split(" ");e.profile=n[2];for(let r=3;r<n.length;r++){let a=n[r],o=oe.matchPrefix(i,"a=rtpmap:"+a+" ")[0];if(o){let c=oe.parseRtpMap(o),l=oe.matchPrefix(i,"a=fmtp:"+a+" ");switch(c.parameters=l.length?oe.parseFmtp(l[0]):{},c.rtcpFeedback=oe.matchPrefix(i,"a=rtcp-fb:"+a+" ").map(oe.parseRtcpFb),e.codecs.push(c),c.name.toUpperCase()){case"RED":case"ULPFEC":e.fecMechanisms.push(c.name.toUpperCase());break;default:break}}}oe.matchPrefix(i,"a=extmap:").forEach(r=>{e.headerExtensions.push(oe.parseExtmap(r))});let s=oe.matchPrefix(i,"a=rtcp-fb:* ").map(oe.parseRtcpFb);return e.codecs.forEach(r=>{s.forEach(a=>{r.rtcpFeedback.find(c=>c.type===a.type&&c.parameter===a.parameter)||r.rtcpFeedback.push(a)})}),e};oe.writeRtpDescription=function(i,e){let t="";t+="m="+i+" ",t+=e.codecs.length>0?"9":"0",t+=" "+(e.profile||"UDP/TLS/RTP/SAVPF")+" ",t+=e.codecs.map(s=>s.preferredPayloadType!==void 0?s.preferredPayloadType:s.payloadType).join(" ")+`\r
`,t+=`c=IN IP4 0.0.0.0\r
`,t+=`a=rtcp:9 IN IP4 0.0.0.0\r
`,e.codecs.forEach(s=>{t+=oe.writeRtpMap(s),t+=oe.writeFmtp(s),t+=oe.writeRtcpFb(s)});let n=0;return e.codecs.forEach(s=>{s.maxptime>n&&(n=s.maxptime)}),n>0&&(t+="a=maxptime:"+n+`\r
`),e.headerExtensions&&e.headerExtensions.forEach(s=>{t+=oe.writeExtmap(s)}),t};oe.parseRtpEncodingParameters=function(i){let e=[],t=oe.parseRtpParameters(i),n=t.fecMechanisms.indexOf("RED")!==-1,s=t.fecMechanisms.indexOf("ULPFEC")!==-1,r=oe.matchPrefix(i,"a=ssrc:").map(h=>oe.parseSsrcMedia(h)).filter(h=>h.attribute==="cname"),a=r.length>0&&r[0].ssrc,o,c=oe.matchPrefix(i,"a=ssrc-group:FID").map(h=>h.substring(17).split(" ").map(d=>parseInt(d,10)));c.length>0&&c[0].length>1&&c[0][0]===a&&(o=c[0][1]),t.codecs.forEach(h=>{if(h.name.toUpperCase()==="RTX"&&h.parameters.apt){let u={ssrc:a,codecPayloadType:parseInt(h.parameters.apt,10)};a&&o&&(u.rtx={ssrc:o}),e.push(u),n&&(u=JSON.parse(JSON.stringify(u)),u.fec={ssrc:a,mechanism:s?"red+ulpfec":"red"},e.push(u))}}),e.length===0&&a&&e.push({ssrc:a});let l=oe.matchPrefix(i,"b=");return l.length&&(l[0].indexOf("b=TIAS:")===0?l=parseInt(l[0].substring(7),10):l[0].indexOf("b=AS:")===0?l=parseInt(l[0].substring(5),10)*1e3*.95-2e3*8:l=void 0,e.forEach(h=>{h.maxBitrate=l})),e};oe.parseRtcpParameters=function(i){let e={},t=oe.matchPrefix(i,"a=ssrc:").map(r=>oe.parseSsrcMedia(r)).filter(r=>r.attribute==="cname")[0];t&&(e.cname=t.value,e.ssrc=t.ssrc);let n=oe.matchPrefix(i,"a=rtcp-rsize");e.reducedSize=n.length>0,e.compound=n.length===0;let s=oe.matchPrefix(i,"a=rtcp-mux");return e.mux=s.length>0,e};oe.writeRtcpParameters=function(i){let e="";return i.reducedSize&&(e+=`a=rtcp-rsize\r
`),i.mux&&(e+=`a=rtcp-mux\r
`),i.ssrc!==void 0&&i.cname&&(e+="a=ssrc:"+i.ssrc+" cname:"+i.cname+`\r
`),e};oe.parseMsid=function(i){let e,t=oe.matchPrefix(i,"a=msid:");if(t.length===1)return e=t[0].substring(7).split(" "),{stream:e[0],track:e[1]};let n=oe.matchPrefix(i,"a=ssrc:").map(s=>oe.parseSsrcMedia(s)).filter(s=>s.attribute==="msid");if(n.length>0)return e=n[0].value.split(" "),{stream:e[0],track:e[1]}};oe.parseSctpDescription=function(i){let e=oe.parseMLine(i),t=oe.matchPrefix(i,"a=max-message-size:"),n;t.length>0&&(n=parseInt(t[0].substring(19),10)),isNaN(n)&&(n=65536);let s=oe.matchPrefix(i,"a=sctp-port:");if(s.length>0)return{port:parseInt(s[0].substring(12),10),protocol:e.fmt,maxMessageSize:n};let r=oe.matchPrefix(i,"a=sctpmap:");if(r.length>0){let a=r[0].substring(10).split(" ");return{port:parseInt(a[0],10),protocol:a[1],maxMessageSize:n}}};oe.writeSctpDescription=function(i,e){let t=[];return i.protocol!=="DTLS/SCTP"?t=["m="+i.kind+" 9 "+i.protocol+" "+e.protocol+`\r
`,`c=IN IP4 0.0.0.0\r
`,"a=sctp-port:"+e.port+`\r
`]:t=["m="+i.kind+" 9 "+i.protocol+" "+e.port+`\r
`,`c=IN IP4 0.0.0.0\r
`,"a=sctpmap:"+e.port+" "+e.protocol+` 65535\r
`],e.maxMessageSize!==void 0&&t.push("a=max-message-size:"+e.maxMessageSize+`\r
`),t.join("")};oe.generateSessionId=function(){return Math.random().toString().substr(2,22)};oe.writeSessionBoilerplate=function(i,e,t){let n,s=e!==void 0?e:2;return i?n=i:n=oe.generateSessionId(),`v=0\r
o=`+(t||"thisisadapterortc")+" "+n+" "+s+` IN IP4 127.0.0.1\r
s=-\r
t=0 0\r
`};oe.getDirection=function(i,e){let t=oe.splitLines(i);for(let n=0;n<t.length;n++)switch(t[n]){case"a=sendrecv":case"a=sendonly":case"a=recvonly":case"a=inactive":return t[n].substring(2);default:}return e?oe.getDirection(e):"sendrecv"};oe.getKind=function(i){return oe.splitLines(i)[0].split(" ")[0].substring(2)};oe.isRejected=function(i){return i.split(" ",2)[1]==="0"};oe.parseMLine=function(i){let t=oe.splitLines(i)[0].substring(2).split(" ");return{kind:t[0],port:parseInt(t[1],10),protocol:t[2],fmt:t.slice(3).join(" ")}};oe.parseOLine=function(i){let t=oe.matchPrefix(i,"o=")[0].substring(2).split(" ");return{username:t[0],sessionId:t[1],sessionVersion:parseInt(t[2],10),netType:t[3],addressType:t[4],address:t[5]}};oe.isValidSDP=function(i){if(typeof i!="string"||i.length===0)return!1;let e=oe.splitLines(i);for(let t=0;t<e.length;t++)if(e[t].length<2||e[t].charAt(1)!=="=")return!1;return!0};typeof Pd=="object"&&(Pd.exports=oe)});var gt={R:13,H:2.4,K:3,wallE:.7,ringOutSpeed:16.5},Yi=i=>{let e=Math.min(i,gt.R)/gt.R;return gt.H*e*e},ph=75,$i=2,$t={azure:{id:"azure",kit:{Q:"sonic",W:"phantom",E:"blitz",R:"meteor"},name:"\u30A2\u30BA\u30FC\u30EB\u30FB\u30D5\u30A1\u30F3\u30B0",en:"AZURE FANG",type:"ATTACK",typeJa:"\u30A2\u30BF\u30C3\u30AF",color:3127551,css:"#2fb8ff",teeth:3,atk:1.27,def:.94,mass:1,speed:15.5,decay:7,spinMax:1e3,cdMul:1,guardMul:1,bars:{atk:5,def:2,sta:2,spd:5},desc:"\u98DB\u3073\u9053\u5177\u30FB\u77AC\u9593\u79FB\u52D5\u30FB\u7A81\u9032\u3067\u653B\u3081\u7ACB\u3066\u308B\u30D2\u30C3\u30C8\u30A2\u30F3\u30C9\u30A2\u30A6\u30A7\u30A4\u578B\u3002"},gaia:{id:"gaia",kit:{Q:"quake",W:"aegis",E:"anchor",R:"nova"},name:"\u30AC\u30A4\u30A2\u30FB\u30D0\u30B9\u30C6\u30A3\u30AA\u30F3",en:"GAIA BASTION",type:"DEFENSE",typeJa:"\u30C7\u30A3\u30D5\u30A7\u30F3\u30B9",color:5106314,css:"#4dea8a",teeth:6,atk:1.04,def:1.28,mass:1.35,speed:12.5,decay:5.6,spinMax:1e3,cdMul:1,guardMul:1.35,bars:{atk:2,def:5,sta:3,spd:2},desc:"\u8DB3\u6B62\u3081\u30FB\u5F15\u304D\u5BC4\u305B\u30FB\u30D1\u30EA\u30A3\u3067\u76F8\u624B\u3092\u6355\u307E\u3048\u308B\u30AB\u30A6\u30F3\u30BF\u30FC\u578B\u3002"},sol:{id:"sol",kit:{Q:"flare",W:"sanctuary",E:"satellite",R:"eclipse"},name:"\u30BD\u30EB\u30FB\u30A8\u30BF\u30FC\u30CA\u30EB",en:"SOL ETERNAL",type:"STAMINA",typeJa:"\u30B9\u30BF\u30DF\u30CA",color:16758062,css:"#ffb52e",teeth:4,atk:.96,def:1,mass:1.05,speed:14,decay:5.4,spinMax:1040,cdMul:.9,guardMul:1,bars:{atk:3,def:3,sta:5,spd:3},desc:"\u56DE\u8EE2\u3092\u5438\u53CE\u30FB\u56DE\u5FA9\u3057\u306A\u304C\u3089\u7C98\u308A\u52DD\u3064\u30C9\u30EC\u30A4\u30F3\u578B\u3002"}},Cf=16726862,Ve={sonic:{name:"\u30BD\u30CB\u30C3\u30AF\u30A8\u30C3\u30B8",en:"SONIC EDGE",aim:"line",cd:3.5,range:17,speed:34,radius:.85,dmg:46,kb:9.5,slow:1.2,desc:"\u72D9\u3063\u305F\u65B9\u5411\u3078\u885D\u6483\u6CE2\u3092\u653E\u3064\u3002\u547D\u4E2D\u3057\u305F\u76F8\u624B\u3092\u5F3E\u304D\u98DB\u3070\u3057\u3001\u5C11\u3057\u306E\u9593\u30B9\u30ED\u30A6\u306B\u3059\u308B\u3002"},phantom:{name:"\u30D5\u30A1\u30F3\u30C8\u30E0\u30B9\u30C6\u30C3\u30D7",en:"PHANTOM STEP",aim:"blink",cd:7,range:6,speed:30,empower:3,bonus:40,kb:8,desc:"\u6B8B\u50CF\u3092\u6B8B\u3057\u3066\u77AC\u9593\u79FB\u52D5\u3059\u308B\u3002\u79FB\u52D5\u4E2D\u306F\u7121\u6575\u3002\u305D\u306E\u5F8C3\u79D2\u9593\u3001\u6B21\u306E\u4F53\u5F53\u305F\u308A\u304C\u5F37\u5316\u3055\u308C\u308B\u3002"},blitz:{name:"\u30D6\u30EA\u30C3\u30C4\u30C0\u30C3\u30B7\u30E5",en:"BLITZ DASH",aim:"dash",cd:6,dist:9.5,minDist:4,speed:40,dmg:54,kb:13.5,desc:"\u72D9\u3063\u305F\u5730\u70B9\u3078\u9AD8\u901F\u3067\u7A81\u9032\u3059\u308B\u3002\u5F53\u3066\u308B\u3068\u5927\u30C0\u30E1\u30FC\u30B8\u3068\u5F37\u3044\u30CE\u30C3\u30AF\u30D0\u30C3\u30AF\u3002"},meteor:{name:"\u30E1\u30C6\u30AA\u30C9\u30E9\u30A4\u30D6",en:"METEOR DRIVE",aim:"leap",cd:2,ult:!0,range:11.5,aoe:4.6,air:1,dmg:165,kb:18.5,desc:"\u3010\u5FC5\u6BBA\u6280\u3011\u7A7A\u9AD8\u304F\u8DF3\u3073\u3001\u6307\u5B9A\u5730\u70B9\u3078\u843D\u4E0B\u3057\u3066\u5468\u56F2\u3092\u5439\u304D\u98DB\u3070\u3059\u3002"},quake:{name:"\u30AF\u30A8\u30A4\u30AF\u30D4\u30E9\u30FC",en:"QUAKE PILLAR",aim:"ground",cd:4.5,range:10.5,aoe:2.8,delay:.6,dmg:72,stun:1,kb:4,desc:"\u6307\u5B9A\u5730\u70B9\u306E\u5E8A\u3092\u5C11\u3057\u9045\u308C\u3066\u7A81\u304D\u4E0A\u3052\u308B\u3002\u5DFB\u304D\u8FBC\u3093\u3060\u76F8\u624B\u306B\u30C0\u30E1\u30FC\u30B8\u3092\u4E0E\u3048\u3001\u52D5\u304D\u3092\u6B62\u3081\u308B\u3002"},aegis:{name:"\u30A4\u30FC\u30B8\u30B9\u30AC\u30FC\u30C9",en:"AEGIS GUARD",aim:"self",cd:7,dur:1.4,parryDmg:36,desc:"\u77ED\u6642\u9593\u30D0\u30EA\u30A2\u3092\u5F35\u308B\u3002\u4F53\u5F53\u305F\u308A\u3092\u53D7\u3051\u308B\u3068\u30D1\u30EA\u30A3\u3057\u3066\u53CD\u6483\u3001\u98DB\u3073\u9053\u5177\u306F\u6483\u3061\u8FD4\u3059\u3002"},anchor:{name:"\u30A2\u30F3\u30AB\u30FC\u30C1\u30A7\u30FC\u30F3",en:"ANCHOR CHAIN",aim:"line",cd:8,range:13.5,speed:30,radius:.85,dmg:36,pull:19,slow:1.8,chain:!0,desc:"\u9396\u3092\u6483\u3061\u51FA\u3057\u3001\u547D\u4E2D\u3057\u305F\u76F8\u624B\u3092\u81EA\u5206\u306E\u65B9\u3078\u5F15\u304D\u5BC4\u305B\u308B\u3002"},nova:{name:"\u30D5\u30A9\u30FC\u30C8\u30EC\u30B9\u30CE\u30F4\u30A1",en:"FORTRESS NOVA",aim:"self",cd:2,ult:!0,charge:.8,aoe:6.5,dmg:185,kb:20,armor:.3,desc:"\u3010\u5FC5\u6BBA\u6280\u3011\u305D\u306E\u5834\u3067\u529B\u3092\u6E9C\u3081\uFF08\u6E9C\u3081\u4E2D\u306F\u88AB\u30C0\u30E1\u30FC\u30B8\u6FC0\u6E1B\uFF09\u3001\u5468\u56F2\u4E00\u5E2F\u3092\u5439\u304D\u98DB\u3070\u3059\u3002"},flare:{name:"\u30D7\u30ED\u30DF\u30CD\u30F3\u30B9",en:"PROMINENCE",aim:"cone",cd:4.5,range:6.8,half:.6,dmg:42,heal:.4,kb:6,desc:"\u6247\u72B6\u306B\u708E\u3092\u5674\u304D\u51FA\u3059\u3002\u4E0E\u3048\u305F\u30C0\u30E1\u30FC\u30B8\u306E40%\u3076\u3093\u81EA\u5206\u306E\u56DE\u8EE2\u304C\u56DE\u5FA9\u3059\u308B\u3002"},sanctuary:{name:"\u30B5\u30F3\u30AF\u30C1\u30E5\u30A2\u30EA",en:"SANCTUARY",aim:"self",cd:12,radius:4.4,dur:5,regen:13,desc:"\u8DB3\u5143\u306B\u967D\u3060\u307E\u308A\u3092\u4F5C\u308B\u3002\u4E2D\u306B\u3044\u308B\u9593\u306F\u56DE\u8EE2\u304C\u56DE\u5FA9\u3057\u7D9A\u3051\u3001\u8E0F\u307F\u8FBC\u3093\u3060\u76F8\u624B\u306F\u30B9\u30ED\u30A6\u306B\u306A\u308B\u3002"},satellite:{name:"\u30B5\u30C6\u30E9\u30A4\u30C8",en:"SATELLITE",aim:"self",cd:9,count:3,dur:6,orbit:2.5,size:.55,dmg:21,kb:7,desc:"3\u3064\u306E\u5149\u7403\u30926\u79D2\u9593\u307E\u3068\u3046\u3002\u89E6\u308C\u305F\u76F8\u624B\u306B\u30C0\u30E1\u30FC\u30B8\u3092\u4E0E\u3048\u3066\u5F3E\u304F\u3002"},eclipse:{name:"\u30A8\u30AF\u30EA\u30D7\u30B9",en:"ECLIPSE",aim:"self",cd:2,ult:!0,range:9.5,breakRange:12.5,dur:3,drain:38,heal:.5,desc:"\u3010\u5FC5\u6BBA\u6280\u3011\u8FD1\u304F\u306E\u76F8\u624B\u3068\u5149\u306E\u5E2F\u3067\u3064\u306A\u304C\u308A\u30013\u79D2\u9593\u56DE\u8EE2\u3092\u5438\u3044\u53D6\u308A\u7D9A\u3051\u308B\u3002\u96E2\u308C\u3059\u304E\u308B\u3068\u5207\u308C\u308B\u3002"}};for(let i in Ve)Ve[i].id=i;var Ht=["Q","W","E","R"],fn=(i,e)=>Ve[i.blade.kit[e]],ro=i=>Ht.map(e=>Ve[i.kit[e]]),Ss=[{id:"easy",name:"EASY",ja:"\u3084\u3055\u3057\u3044",think:.95,aimErr:3.2,dodge:.15,cast:.3,chase:.3,windup:1.35},{id:"normal",name:"NORMAL",ja:"\u3075\u3064\u3046",think:.55,aimErr:1.5,dodge:.5,cast:.5,chase:.5,windup:1},{id:"hard",name:"HARD",ja:"\u3064\u3088\u3044",think:.3,aimErr:.5,dodge:.85,cast:.75,chase:.7,windup:.8}];function ag(i){return function(){i|=0,i=i+1831565813|0;let e=Math.imul(i^i>>>15,1|i);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}var og=4,cg=1.25,ao=(i,e,t)=>i<e?e:i>t?t:i;function Rf(i,e){return{side:i,blade:e,x:0,z:0,vx:0,vz:0,spin:e.spinMax,spinMax:e.spinMax,dir:1,radius:1.25,mass:e.mass,cmd:null,cast:null,dash:null,air:null,out:null,blink:null,charge:null,orbs:null,tether:null,empower:0,projN:0,phase:i*2.1,tumble:0,launch:0,guard:0,slow:0,hitCd:0,cd:{Q:0,W:0,E:0,R:0},windup:{Q:0,W:0,E:0,R:0},ult:0,lastHit:null,stats:{dealt:0,taken:0,clashes:0,skillHits:0,parries:0,maxHit:0}}}var Gt=i=>!i.air&&!i.out&&!i.blink,tn=i=>Math.max(0,i.spin/i.spinMax),lg=i=>1+.85*(1-tn(i));function Pf(i,e,t){if(i.dash||i.blink){let h=i.dash||i.blink;if(i.vx=h.dx*h.speed,i.vz=h.dz*h.speed,h.t-=e,h.t<=0){let u=i.blade.speed*.8;i.vx=h.dx*u,i.vz=h.dz*u,i.dash=i.blink=null}i.x+=i.vx*e,i.z+=i.vz*e;return}let n=tn(i),s=i.slow>0?.6:1,r=gt.K*(.55+3.2/(Math.hypot(i.x,i.z)+1.5)),a=-r*i.x,o=-r*i.z,c=.15;if(i.spin<=0)c=2.2;else if(i.charge)c=9;else if(i.tumble>0)c=.55;else if(i.cmd){let h=i.cmd,u=h.x-i.x,d=h.z-i.z,f=Math.hypot(u,d);if(h.t-=e,f<.9||h.t<=0)i.cmd=null;else{let m=i.blade.speed*1.2*(.55+.45*n)*s,x=(u/f*m-i.vx)*9,g=(d/f*m-i.vz)*9,p=Math.hypot(x,g);p>70&&(x*=70/p,g*=70/p),a=x,o=g}}if(i.spin>0&&i.tumble<=0&&!i.cmd&&!i.charge){let h=Math.hypot(i.vx,i.vz),u=i.blade.speed*(.3+.7*n)*s;if(i.phase+=e,h>.05){let d=ao((u-h)*1.6,-8,12),f=(2.2+2.6*Math.sin(i.phase*1.3)*Math.sin(i.phase*.47+1))*n*i.dir;a+=i.vx/h*d-i.vz/h*f,o+=i.vz/h*d+i.vx/h*f}else a+=Math.cos(i.phase*3)*5,o+=Math.sin(i.phase*3)*5;if(t&&Gt(t)){let d=t.x-i.x,f=t.z-i.z,m=Math.hypot(d,f)||1;if(Math.sin(i.phase*cg+.5)>.55){let p=3.2*n;a+=(d/m*u*1.15-i.vx)*p,o+=(f/m*u*1.15-i.vz)*p}let g=og*(.35+.65*n);a+=d/m*g,o+=f/m*g}}i.vx+=a*e,i.vz+=o*e;let l=Math.exp(-c*e);i.vx*=l,i.vz*=l,i.x+=i.vx*e,i.z+=i.vz*e}function If(i){let e=gt.R-i.radius,t=Math.hypot(i.x,i.z);if(t<=e)return null;let n=i.x/t,s=i.z/t;return i.x=n*e,i.z=s*e,{nx:n,nz:s,vn:i.vx*n+i.vz*s}}function Lf(i,e){let t=(1+gt.wallE)*e.vn;i.vx-=t*e.nx,i.vz-=t*e.nz}function hg(i){return{blade:i.blade,x:i.x,z:i.z,vx:i.vx,vz:i.vz,spin:i.spin,spinMax:i.spinMax,dir:i.dir,radius:i.radius,tumble:i.tumble,slow:i.slow,phase:i.phase,cmd:i.cmd?{...i.cmd}:null,dash:i.dash?{...i.dash}:null,blink:i.blink?{...i.blink}:null,charge:i.charge}}function mh(i,e,t,n){let s=[];if(i.air){for(let c=0;c<n;c++)s.push({x:i.air.tx,z:i.air.tz});return s}let r=hg(i),a=t/n,o=Math.max(1,Math.ceil(a*40));for(let c=0;c<n;c++){for(let l=0;l<o;l++){let h=a/o;Pf(r,h,e),r.tumble=Math.max(0,r.tumble-h),r.slow=Math.max(0,r.slow-h);let u=If(r);u&&u.vn>0&&(Lf(r,u),r.dash=null)}s.push({x:r.x,z:r.z})}return s}function xn(i,e,t){if(t<=.001)return{x:i.x,z:i.z};let n=mh(i,e,t,Math.max(1,Math.ceil(t*20)));return n[n.length-1]}function bi(i,e,t,n,s,r=0){let a={x:t.x,z:t.z},o=0;for(let c=0;c<3;c++)o=r+Math.hypot(a.x-i,a.z-e)/s,a=xn(t,n,o);return{x:a.x,z:a.z,t:o}}var Er=class{constructor(e,t,n=1){this.rng=ag(n),this.tops=[Rf(0,e),Rf(1,t)],this.projectiles=[],this.zones=[],this.events=[],this.time=0,this.result=null,this.projId=0,this.resetRound()}other(e){return this.tops[1-e.side]}emit(e,t){this.events.push({type:e,...t})}resetRound(){this.projectiles.length=0,this.zones.length=0,this.result=null,this.time=0;for(let e of this.tops){let t=e.side===0?1:-1;e.x=0,e.z=7.5*t,e.vx=e.blade.speed*.75*t,e.vz=0,e.spin=e.spinMax,e.cmd=e.cast=e.dash=e.air=e.out=e.blink=e.charge=e.orbs=e.tether=null,e.tumble=e.launch=e.guard=e.slow=e.hitCd=e.empower=0,e.lastHit=null;for(let n of Ht)e.cd[n]=n==="R"?0:1.2}}issueMove(e,t,n){if(this.result||e.air||e.out||e.dash||e.blink||e.charge)return!1;let s=gt.R-e.radius-.2,r=Math.hypot(t,n);return r>s&&(t*=s/r,n*=s/r),e.cmd={x:t,z:n,t:2.2},!0}busy(e){return!!(this.result||e.spin<=0||e.air||e.out||e.cast||e.dash||e.blink||e.charge)}canCast(e,t){if(this.busy(e)||e.cd[t]>0)return!1;let n=fn(e,t);if(n.ult&&e.ult<100||n.id!=="aegis"&&e.tumble>0)return!1;if(n.id==="eclipse"){let s=this.other(e);if(!Gt(s)||Math.hypot(s.x-e.x,s.z-e.z)>n.range)return!1}return!0}groundTarget(e,t,n,s){let r=n-e.x,a=s-e.z,o=Math.hypot(r,a);o>t.range&&(r*=t.range/o,a*=t.range/o);let c=e.x+r,l=e.z+a,h=gt.R-(t.aim==="leap"?1.6:.6),u=Math.hypot(c,l);return u>h&&(c*=h/u,l*=h/u),{x:c,z:l}}cast(e,t,n,s){if(!this.canCast(e,t))return!1;let r=fn(e,t);e.cd[t]=r.cd*e.blade.cdMul,r.ult&&(e.ult=0);let a=n-e.x,o=s-e.z,c=Math.hypot(a,o);c<.01?(a=0,o=e.side===0?-1:1):(a/=c,o/=c);let l={key:t,skill:r,t:e.windup[t],T:e.windup[t],dx:a,dz:o,ax:n,az:s,dist:c};if(r.aim==="ground"||r.aim==="leap"){let h=this.groundTarget(e,r,n,s);l.ax=h.x,l.az=h.z}return this.emit("cast",{top:e,key:t,skill:r,windup:l.T,dx:a,dz:o,ax:l.ax,az:l.az}),l.t<=0?this.execute(e,l):e.cast=l,!0}execute(e,t){let n=t.skill,s=this.other(e);switch(n.id){case"sonic":case"anchor":{let r={id:e.side*3e4+(e.projN=(e.projN+1)%3e4),skill:n,owner:e,x:e.x+t.dx*.9,z:e.z+t.dz*.9,dx:t.dx,dz:t.dz,speed:n.speed,left:n.range,r:n.radius,dmg:n.dmg*e.blade.atk,dead:!1};this.projectiles.push(r),this.emit("shoot",{top:e,proj:r});break}case"blitz":{let r=ao(t.dist,n.minDist,n.dist);e.dash={dx:t.dx,dz:t.dz,speed:n.speed,t:r/n.speed},e.cmd=null,this.emit("dash",{top:e,dx:t.dx,dz:t.dz,dist:r});break}case"phantom":{let r=ao(t.dist,2,n.range);e.blink={dx:t.dx,dz:t.dz,speed:n.speed,t:r/n.speed},e.cmd=null,e.tumble=0,this.emit("blink",{top:e,dx:t.dx,dz:t.dz,dist:r});break}case"meteor":e.air={t:0,T:n.air,sx:e.x,sz:e.z,tx:t.ax,tz:t.az},e.cmd=null,e.vx=e.vz=0,this.emit("leap",{top:e,tx:t.ax,tz:t.az,T:n.air});break;case"quake":{let r={kind:"quake",skill:n,owner:e,x:t.ax,z:t.az,r:n.aoe,t:0,T:n.delay};this.zones.push(r),this.emit("zone",{zone:r,top:e});break}case"aegis":e.guard=n.dur*e.blade.guardMul,this.emit("guard",{top:e,dur:e.guard});break;case"nova":e.charge={t:0,T:n.charge,skill:n},e.cmd=null,this.emit("charge",{top:e,T:n.charge});break;case"flare":{let r=0;if(Gt(s)){let a=s.x-e.x,o=s.z-e.z,c=Math.hypot(a,o),l=Math.acos(ao((a*t.dx+o*t.dz)/(c||1),-1,1)),h=Math.atan2(s.radius*.8,Math.max(c,.5));c<n.range+s.radius*.6&&l<n.half+h&&(r=this.hurt(s,n.dmg*e.blade.atk*(s.guard>0?.3:1)/s.blade.def,e,"flare"),e.spin=Math.min(e.spinMax,e.spin+r*n.heal),s.guard<=0&&this.knock(s,t.dx,t.dz,n.kb,.25,.8),e.stats.skillHits++)}this.emit("flare",{top:e,dx:t.dx,dz:t.dz,hit:r,heal:r*n.heal,target:s});break}case"sanctuary":{let r={kind:"sanctuary",skill:n,owner:e,x:e.x,z:e.z,r:n.radius,t:0,T:n.dur,healed:0,tick:0};this.zones.push(r),this.emit("zone",{zone:r,top:e});break}case"satellite":e.orbs={n:n.count,alive:(1<<n.count)-1,t:n.dur,ang:0,cd:0,skill:n},this.emit("orbs",{top:e});break;case"eclipse":e.tether={t:0,T:n.dur,skill:n,acc:0,tick:0},this.emit("tether",{top:e,target:s});break}}hurt(e,t,n,s){return this.result||t<=0?0:(e.charge&&(t*=e.charge.skill.armor),e.spin-=t,e.stats.taken+=t,e.ult=Math.min(100,e.ult+t*.06),n&&(n.stats.dealt+=t,n.stats.maxHit=Math.max(n.stats.maxHit,t),s!=="drain"&&(n.ult=Math.min(100,n.ult+t*.085))),e.lastHit={dmg:t,time:this.time,kind:s},t)}knock(e,t,n,s,r,a){if(e.charge)return;let o=s*lg(e)/Math.sqrt(e.mass);e.vx=t*o,e.vz=n*o,e.tumble=Math.max(e.tumble,r),a>0&&(e.launch=Math.max(e.launch,a)),e.cmd=null,e.dash=null,e.cast=null}finish(e,t,n){this.result||(this.result={winner:e,loser:t,kind:n},this.emit("finish",{winner:e,loser:t,kind:n}))}timeUp(){let[e,t]=this.tops,n=tn(e)>=tn(t)?e:t;this.finish(n,this.other(n),"time")}step(e){this.time+=e;let[t,n]=this.tops;if(this.updateTop(t,e,n),this.updateTop(n,e,t),this.collide(t,n),this.walls(t),this.walls(n),this.updateProjectiles(e),this.updateZones(e),!this.result)for(let s of this.tops){if(s.spin>0||s.out)continue;s.spin=0;let r=s.lastHit,a=r&&this.time-r.time<.35&&r.dmg>=55;this.finish(this.other(s),s,a?"burst":"spin");break}}updateTop(e,t,n){for(let r of Ht)e.cd[r]=Math.max(0,e.cd[r]-t);if(e.tumble=Math.max(0,e.tumble-t),e.launch=Math.max(0,e.launch-t),e.slow=Math.max(0,e.slow-t),e.hitCd=Math.max(0,e.hitCd-t),e.empower=Math.max(0,e.empower-t),e.guard>0&&(e.guard-=t,e.guard<=0&&(e.guard=0,this.emit("guardEnd",{top:e}))),!this.result&&e.spin>0&&(e.spin-=e.blade.decay*t,e.ult=Math.min(100,e.ult+.8*t)),e.out){let r=e.out;r.t+=t,r.vy-=26*t,r.y+=r.vy*t,e.x+=e.vx*t,e.z+=e.vz*t;return}if(e.air){let r=e.air;r.t+=t;let a=Math.min(1,r.t/r.T),o=a*a*(3-2*a);e.x=r.sx+(r.tx-r.sx)*o,e.z=r.sz+(r.tz-r.sz)*o,a>=1&&this.land(e,n);return}if(e.cast&&(e.cast.t-=t,e.cast.t<=0)){let r=e.cast;e.cast=null,!this.result&&e.spin>0&&this.execute(e,r)}(this.result||e.spin<=0)&&(e.tether&&this.emit("tetherEnd",{top:e,broke:!0}),e.orbs&&this.emit("orbsEnd",{top:e}),e.charge=e.tether=e.orbs=null),e.charge&&(e.charge.t+=t,e.charge.t>=e.charge.T&&this.novaBlast(e,n)),e.orbs&&this.updateOrbs(e,n,t),e.tether&&this.updateTether(e,n,t);let s=e.blink;Pf(e,t,n),s&&!e.blink&&(e.empower=Ve.phantom.empower,this.emit("blinkEnd",{top:e}))}land(e,t){let n=Ve.meteor,s=e.air.tx,r=e.air.tz;e.air=null,e.x=s,e.z=r,e.vx=e.vz=0,e.tumble=.2;let a=0;if(Gt(t)){let o=t.x-s,c=t.z-r,l=Math.hypot(o,c);if(l<n.aoe+t.radius*.5){l<.05?(o=1,c=0):(o/=l,c/=l);let h=l<2?1:1-.45*((l-2)/(n.aoe-1.5)),u=t.guard>0?.4:1;a=this.hurt(t,n.dmg*h*u*e.blade.atk/t.blade.def,e,"meteor"),this.knock(t,o,c,n.kb*h*u,.8*u,2),l<2.6&&(t.x=s+o*2.6,t.z=r+c*2.6),e.stats.skillHits++}}this.emit("meteor",{top:e,x:s,z:r,hit:a,target:a?t:null})}novaBlast(e,t){let n=e.charge.skill;e.charge=null;let s=0;if(Gt(t)){let r=t.x-e.x,a=t.z-e.z,o=Math.hypot(r,a);if(o<n.aoe+t.radius*.5){o<.05?(r=1,a=0):(r/=o,a/=o);let c=o<3?1:1-.5*((o-3)/(n.aoe-2.5));s=this.hurt(t,n.dmg*c*e.blade.atk/t.blade.def,e,"nova"),this.knock(t,r,a,n.kb*c,.8,2),e.stats.skillHits++}}this.emit("nova",{top:e,x:e.x,z:e.z,hit:s,target:s?t:null})}orbPos(e,t){let n=e.orbs,s=n.ang+t/n.skill.count*Math.PI*2;return{x:e.x+Math.cos(s)*n.skill.orbit,z:e.z+Math.sin(s)*n.skill.orbit}}updateOrbs(e,t,n){let s=e.orbs,r=s.skill;if(s.t-=n,s.ang+=4.2*n,s.cd=Math.max(0,s.cd-n),s.cd<=0&&Gt(t))for(let a=0;a<r.count;a++){if(!(s.alive&1<<a))continue;let o=this.orbPos(e,a);if(Math.hypot(t.x-o.x,t.z-o.z)>r.size+t.radius)continue;let c=t.x-e.x,l=t.z-e.z,h=Math.hypot(c,l)||1;c/=h,l/=h;let u=this.hurt(t,r.dmg*e.blade.atk*(t.guard>0?.3:1)/t.blade.def,e,"orb");t.guard<=0&&this.knock(t,c,l,r.kb,.2,1),s.alive&=~(1<<a),s.n--,s.cd=.25,e.stats.skillHits++,this.emit("orbHit",{top:e,target:t,x:o.x,z:o.z,dmg:u});break}(s.t<=0||s.n<=0)&&(e.orbs=null,this.emit("orbsEnd",{top:e}))}updateTether(e,t,n){let s=e.tether,r=s.skill;s.t+=n;let a=Math.hypot(t.x-e.x,t.z-e.z);if(s.t>=s.T||!Gt(t)||a>r.breakRange){s.acc>.5&&this.emit("drain",{top:e,target:t,dmg:s.acc,heal:s.acc*r.heal}),e.tether=null,this.emit("tetherEnd",{top:e,broke:s.t<s.T});return}let o=this.hurt(t,r.drain*n*e.blade.atk/t.blade.def,e,"drain");e.spin=Math.min(e.spinMax,e.spin+o*r.heal),t.slow=Math.max(t.slow,.15),s.acc+=o,s.tick+=n,s.tick>=.5&&(this.emit("drain",{top:e,target:t,dmg:s.acc,heal:s.acc*r.heal}),s.acc=0,s.tick=0)}updateZones(e){for(let t of this.zones){t.t+=e;let n=t.owner,s=this.other(n),r=t.skill;if(t.kind==="quake"){if(t.t<t.T)continue;t.dead=!0;let a=0;if(Gt(s)&&!this.result){let o=s.x-t.x,c=s.z-t.z,l=Math.hypot(o,c);if(l<t.r+s.radius*.5){l<.05?(o=0,c=1):(o/=l,c/=l);let h=s.guard>0?.3:1;a=this.hurt(s,r.dmg*h*n.blade.atk/s.blade.def,n,"quake"),h===1&&this.knock(s,o,c,r.kb,r.stun,0),n.stats.skillHits++}}this.emit("quake",{top:n,x:t.x,z:t.z,r:t.r,hit:a,target:a?s:null})}else if(t.kind==="sanctuary"){if(t.t>=t.T||this.result){t.dead=!0,this.emit("zoneEnd",{zone:t});continue}if(!n.out&&!n.air&&n.spin>0&&Math.hypot(n.x-t.x,n.z-t.z)<t.r){let a=Math.min(r.regen*e,n.spinMax-n.spin);n.spin+=a,t.healed+=a,t.tick+=e,t.tick>=1&&(t.healed>=1&&this.emit("heal",{top:n,amount:t.healed}),t.healed=0,t.tick=0)}Gt(s)&&Math.hypot(s.x-t.x,s.z-t.z)<t.r&&(s.slow=Math.max(s.slow,.2))}}this.zones.some(t=>t.dead)&&(this.zones=this.zones.filter(t=>!t.dead))}collide(e,t){if(!Gt(e)||!Gt(t))return;let n=t.x-e.x,s=t.z-e.z,r=Math.hypot(n,s),a=e.radius+t.radius;if(r>=a)return;r>1e-4?(n/=r,s/=r):(n=1,s=0);let o=e.mass+t.mass,c=a-r;e.x-=n*c*(t.mass/o),e.z-=s*c*(t.mass/o),t.x+=n*c*(e.mass/o),t.z+=s*c*(e.mass/o);let l=(e.vx-t.vx)*n+(e.vz-t.vz)*s;if(l<=0)return;let h=Math.max(0,e.vx*n+e.vz*s),u=Math.max(0,-(t.vx*n+t.vz*s)),d=tn(e),f=tn(t),m=!this.result&&e.hitCd<=0&&t.hitCd<=0,x=2+Math.min(l,24)*1,g=(h+1)/(h+u+2),p=x*(.3+.9*(1-g))*t.blade.atk/e.blade.def,M=x*(.3+.9*g)*e.blade.atk/t.blade.def,C=Math.min(l,24),v="clash",w=null,T=(E,P,N,F)=>{let B=P===t?1:-1;this.knock(P,B*n,B*s,N,F,1.6),E.vx=-B*n*3,E.vz=-B*s*3,E.dash=null,w=E},R=(E,P,N,F)=>{let B=N*E.blade.atk/P.blade.def;P===t?(M=M*F+B,p*=.2):(p=p*F+B,M*=.2)},y=!0;if(!m)y=!1;else if(e.guard>0!=t.guard>0){let E=e.guard>0?e:t,P=this.other(E);v="parry",C+=10,T(E,P,11.5,.65),E.guard=0,E.stats.parries++,this.emit("guardEnd",{top:E}),R(E,P,Ve.aegis.parryDmg,.5)}else if(!!e.dash!=!!t.dash){let E=e.dash?e:t,P=this.other(E);v="dash",C+=14,T(E,P,Ve.blitz.kb,.55),E.stats.skillHits++,R(E,P,Ve.blitz.dmg,1)}else if(e.empower>0!=t.empower>0){let E=e.empower>0?e:t,P=this.other(E);v="empower",C+=10,T(E,P,Ve.phantom.kb,.45),E.empower=0,E.stats.skillHits++,R(E,P,Ve.phantom.bonus,1)}else y=!1;if(!y){e.dash=null,t.dash=null;let E=1.5*l/(1/e.mass+1/t.mass)+2.5+1.5*(d+f),P=E/e.mass*(1+.35*(1-d))*(e.charge?.1:1),N=E/t.mass*(1+.35*(1-f))*(t.charge?.1:1);e.vx-=n*P,e.vz-=s*P,t.vx+=n*N,t.vz+=s*N;let F=.22*Math.min(l,24);e.vx+=-s*F,e.vz+=n*F,t.vx-=-s*F,t.vz-=n*F,d<.3&&P>12&&(e.launch=Math.max(e.launch,1.2)),f<.3&&N>12&&(t.launch=Math.max(t.launch,1.2))}m&&(e.hitCd=t.hitCd=.12,v==="clash"&&l>9&&(e.tumble=Math.max(e.tumble,.12),t.tumble=Math.max(t.tumble,.12)),e.stats.clashes++,t.stats.clashes++,p=this.hurt(e,p,t,v),M=this.hurt(t,M,e,v),this.emit("clash",{x:(e.x+t.x)/2,z:(e.z+t.z)/2,nx:n,nz:s,power:C,kind:v,src:w,a:e,b:t,dmgA:p,dmgB:M}))}walls(e){if(e.air||e.out)return;let t=If(e);if(!t||t.vn<=0)return;if(e.blink){e.blink.t=0;return}if(!this.result&&e.launch>0&&t.vn>gt.ringOutSpeed){e.tether&&this.emit("tetherEnd",{top:e,broke:!0}),e.orbs&&this.emit("orbsEnd",{top:e}),e.out={t:0,y:0,vy:7+t.vn*.35},e.cmd=e.dash=e.cast=e.charge=e.tether=e.orbs=null,e.guard=0,this.emit("ringout",{top:e,x:e.x,z:e.z,nx:t.nx,nz:t.nz,power:t.vn}),this.finish(this.other(e),e,"over");return}Lf(e,t),e.dash=null;let n=0;t.vn>4&&(n=(t.vn-4)*(e.launch>0?2.2:1)/e.blade.def,n=this.hurt(e,n,e.launch>0?this.other(e):null,"wall")),t.vn>2&&this.emit("wall",{top:e,x:e.x+t.nx,z:e.z+t.nz,nx:t.nx,nz:t.nz,power:t.vn,dmg:n,slam:e.launch>0})}updateProjectiles(e){for(let t of this.projectiles){let n=t.speed*e,s=t.skill;t.x+=t.dx*n,t.z+=t.dz*n,t.left-=n;let r=this.other(t.owner);if(!this.result&&Gt(r)&&Math.hypot(r.x-t.x,r.z-t.z)<t.r+r.radius){if(r.guard>0){t.owner=r,t.dx=-t.dx,t.dz=-t.dz,t.left=s.range,t.dmg*=1.2,r.stats.parries++,this.emit("reflect",{top:r,proj:t,x:t.x,z:t.z});continue}let a=t.owner,o=this.hurt(r,t.dmg/r.blade.def,a,s.id);if(s.chain){let c=a.x-r.x,l=a.z-r.z,h=Math.hypot(c,l)||1;if(!r.charge){let u=Math.min(s.pull,h*3.2);r.vx=c/h*u,r.vz=l/h*u,r.tumble=Math.max(r.tumble,.5),r.cmd=null,r.dash=null,r.cast=null}}else this.knock(r,t.dx,t.dz,s.kb,.35,1.5);r.slow=s.slow,a.stats.skillHits++,t.dead=!0,this.emit("projHit",{proj:t,top:r,x:t.x,z:t.z,dx:t.dx,dz:t.dz,dmg:o})}else(t.left<=0||Math.hypot(t.x,t.z)>gt.R+.5)&&(t.dead=!0,this.emit("projEnd",{proj:t,x:t.x,z:t.z}))}this.projectiles.some(t=>t.dead)&&(this.projectiles=this.projectiles.filter(t=>!t.dead))}};var Ts=class{constructor(e,t,n){this.world=e,this.me=t,this.foe=e.other(t),this.level=n,this.t=.6+e.rng()*.4,this.dodged=new Set,this.keyOf={};for(let s of Ht)this.keyOf[fn(t,s).id]=s}jitter(e,t=1){let n=this.world.rng,s=this.level.aimErr*t;return{x:e.x+(n()*2-1)*s,z:e.z+(n()*2-1)*s}}has(e){let t=this.keyOf[e];return t&&this.world.canCast(this.me,t)}use(e,t=this.me.x,n=this.me.z){return this.world.cast(this.me,this.keyOf[e],t,n)}escape(e,t,n,s){let{world:r,me:a,level:o}=this,c=a.x-e,l=a.z-t,h=Math.hypot(c,l);if(h>n+1.5||r.rng()>o.dodge+.1)return!1;h<.1&&(c=-a.x||1,l=-a.z);let u=Math.hypot(c,l)||1;return c/=u,l/=u,s<.3&&this.has("aegis")?this.use("aegis"):s<.6&&this.has("phantom")?this.use("phantom",a.x+c*6,a.z+l*6):s<.7&&this.has("blitz")?this.use("blitz",a.x+c*9,a.z+l*9):(r.issueMove(a,e+c*(n+4),t+l*(n+4)),!0)}defence(e){let{world:t,me:n,foe:s,level:r}=this,a=t.rng;for(let o of t.projectiles){if(o.owner===n||this.dodged.has(o.id))continue;let c=n.x-o.x,l=n.z-o.z,h=c*o.dx+l*o.dz,u=c*-o.dz+l*o.dx;if(h<0||h>o.left||Math.abs(u)>2.6||(this.dodged.add(o.id),a()>r.dodge))continue;let d=u>=0?1:-1;return h/o.speed<.28&&this.has("aegis")?this.use("aegis"):h/o.speed<.3&&this.has("phantom")?this.use("phantom",n.x-o.dz*d*6,n.z+o.dx*d*6):(t.issueMove(n,n.x-o.dz*d*4.5,n.z+o.dx*d*4.5),!0)}for(let o of t.zones)if(o.owner!==n&&o.kind==="quake"&&this.escape(o.x,o.z,o.r,o.T-o.t))return!0;if(s.air&&this.escape(s.air.tx,s.air.tz,Ve.meteor.aoe,s.air.T-s.air.t)||s.charge&&this.escape(s.x,s.z,Ve.nova.aoe,s.charge.T-s.charge.t))return!0;if(s.tether&&a()<r.dodge){let o=e||1,c=n.x-(s.x-n.x)/o*9,l=n.z-(s.z-n.z)/o*9;return this.has("blitz")?this.use("blitz",c,l):this.has("phantom")?this.use("phantom",c,l):(t.issueMove(n,c,l),!0)}return this.has("aegis")&&e<7&&a()<r.dodge&&(s.dash||s.empower>0&&e<4)?this.use("aegis"):this.has("aegis")&&s.cast&&s.cast.skill.id==="blitz"&&e<8&&a()<r.dodge*.7?this.use("aegis"):!1}offence(e){let{world:t,me:n,foe:s,level:r}=this,a=t.rng;if(!Gt(s))return!1;let o=(l=0)=>a()<r.cast+l,c=s.guard>0;if(this.has("meteor")&&!c&&e<Ve.meteor.range+2&&o(s.tumble>0?.3:0)){let l=this.jitter(xn(s,n,Ve.meteor.air*.85),.8);return this.use("meteor",l.x,l.z)}if(this.has("nova")&&e<Ve.nova.aoe-1.6&&o(s.tumble>0?.4:0))return this.use("nova");if(this.has("eclipse")&&e<Ve.eclipse.range-2&&o(.1))return this.use("eclipse");if(c)return!1;if(this.has("blitz")&&e>3&&e<Ve.blitz.dist+1&&o()){let l=this.jitter(bi(n.x,n.z,s,n,Ve.blitz.speed,n.windup[this.keyOf.blitz]),.6);return this.use("blitz",l.x,l.z)}if(this.has("sonic")&&e<Ve.sonic.range-1&&o()){let l=this.jitter(bi(n.x,n.z,s,n,Ve.sonic.speed,n.windup[this.keyOf.sonic]));return this.use("sonic",l.x,l.z)}if(this.has("phantom")&&e>3.5&&e<Ve.phantom.range+2.5&&o(-.15)){let l=xn(s,n,.25),h=Math.hypot(l.x-n.x,l.z-n.z)||1;return this.use("phantom",n.x+(l.x-n.x)/h*(h-2.2),n.z+(l.z-n.z)/h*(h-2.2))}if(this.has("anchor")&&e>4.5&&e<Ve.anchor.range-1&&o()){let l=this.jitter(bi(n.x,n.z,s,n,Ve.anchor.speed,n.windup[this.keyOf.anchor]));return this.use("anchor",l.x,l.z)}if(this.has("quake")&&e<Ve.quake.range+1&&o(s.tumble>.3||s.slow>.5?.3:0)){let l=this.jitter(xn(s,n,Ve.quake.delay+n.windup[this.keyOf.quake]),.7);return this.use("quake",l.x,l.z)}if(this.has("flare")&&e<Ve.flare.range-.8&&o(.15)){let l=this.jitter(xn(s,n,.08+n.windup[this.keyOf.flare]),.5);return this.use("flare",l.x,l.z)}return this.has("satellite")&&e<9&&o()?this.use("satellite"):this.has("sanctuary")&&tn(n)<.82&&o(-.1)?this.use("sanctuary"):this.has("aegis")&&e<3.4&&a()<r.cast*.25?this.use("aegis"):!1}update(e){let{world:t,me:n,foe:s,level:r}=this;if(t.result||n.out||n.air||n.blink||n.charge||n.spin<=0||(this.t-=e,this.t>0))return;this.t=r.think*(.7+t.rng()*.6);let a=t.rng,o=s.x-n.x,c=s.z-n.z,l=Math.hypot(o,c);if(this.defence(l)||this.offence(l)||n.tumble>0||n.dash||n.cast)return;let h=Math.hypot(n.x,n.z);if(n.launch>0&&h>gt.R-4){t.issueMove(n,n.x*.3,n.z*.3);return}if(s.guard>0&&l<6){t.issueMove(n,n.x-o/l*5,n.z-c/l*5);return}let u=t.zones.find(x=>x.owner===n&&x.kind==="sanctuary");if(u&&tn(n)<.95&&a()<.7){Math.hypot(n.x-u.x,n.z-u.z)>u.r*.6&&t.issueMove(n,u.x,u.z);return}let d=t.zones.find(x=>x.owner===s&&x.kind==="sanctuary");if(d&&Math.hypot(s.x-d.x,s.z-d.z)<d.r&&a()<r.dodge*.6||!Gt(s))return;let f=tn(n)-tn(s),m=r.chase+(f<-.1?.15:0)+(n.empower>0||n.orbs?.35:0)+(n.tether?.3:0);if(a()<m){let x=xn(s,n,Math.min(.5,l/20));t.issueMove(n,x.x,x.z)}}};var gp=0,su=1,xp=2;var cs=1,_p=2,rr=3,Ui=0,jt=1,Nt=2,Rn=0,ar=1,It=2,ru=3,au=4,yp=5;var ls=100,vp=101,Mp=102,bp=103,Sp=104,Tp=200,Ep=201,wp=202,Ap=203,ou=204,cu=205,Cp=206,Rp=207,Pp=208,Ip=209,Lp=210,Dp=211,Np=212,Up=213,Op=214,zo=0,Bo=1,Vo=2,Ws=3,Ho=4,Go=5,Wo=6,Xo=7,Tc=0,Fp=1,kp=2,Bn=0,Ma=1,ba=2,Sa=3,hs=4,Ta=5,Ea=6,wa=7;var lu=300,Oi=301,us=302,Ec=303,wc=304,Aa=306,qo=1e3,qn=1001,Yo=1002,Yt=1003,zp=1004;var Ca=1005;var Jt=1006,Ac=1007;var Fi=1008;var pn=1009,hu=1010,uu=1011,or=1012,Cc=1013,Vn=1014,Pn=1015,Qt=1016,Rc=1017,Pc=1018,cr=1020,du=35902,fu=35899,pu=1021,mu=1022,In=1023,Yn=1026,ki=1027,Ic=1028,Lc=1029,zi=1030,Dc=1031;var Nc=1033,Ra=33776,Pa=33777,Ia=33778,La=33779,Uc=35840,Oc=35841,Fc=35842,kc=35843,zc=36196,Bc=37492,Vc=37496,Hc=37488,Gc=37489,Da=37490,Wc=37491,Xc=37808,qc=37809,Yc=37810,$c=37811,Zc=37812,Jc=37813,Kc=37814,jc=37815,Qc=37816,el=37817,tl=37818,nl=37819,il=37820,sl=37821,rl=36492,al=36494,ol=36495,cl=36283,ll=36284,Na=36285,hl=36286;var zr=2300,$o=2301,Fo=2302,Wh=2303,Xh=2400,qh=2401,Yh=2402;var Bp=3200;var Ua=0,Vp=1,xi="",zt="srgb",Br="srgb-linear",Vr="linear",ht="srgb";var ko=7680;var Hp=519,Gp=512,Wp=513,Xp=514,ul=515,qp=516,Yp=517,dl=518,$p=519,gu=35044,ds=35048;var xu="300 es",zn=2e3,Xs=2001;function ug(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function dg(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Hr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Zp(){let i=Hr("canvas");return i.style.display="block",i}var Df={},qs=null;function Gr(...i){let e="THREE."+i.shift();qs?qs("log",e,...i):console.log(e,...i)}function Jp(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Xe(...i){i=Jp(i);let e="THREE."+i.shift();if(qs)qs("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function We(...i){i=Jp(i);let e="THREE."+i.shift();if(qs)qs("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function es(...i){let e=i.join(" ");e in Df||(Df[e]=!0,Xe(...i))}function Kp(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var jp={[zo]:Bo,[Vo]:Wo,[Ho]:Xo,[Ws]:Go,[Bo]:zo,[Wo]:Vo,[Xo]:Ho,[Go]:Ws},$n=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},nn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var gh=Math.PI/180,Zo=180/Math.PI;function di(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(nn[i&255]+nn[i>>8&255]+nn[i>>16&255]+nn[i>>24&255]+"-"+nn[e&255]+nn[e>>8&255]+"-"+nn[e>>16&15|64]+nn[e>>24&255]+"-"+nn[t&63|128]+nn[t>>8&255]+"-"+nn[t>>16&255]+nn[t>>24&255]+nn[n&255]+nn[n>>8&255]+nn[n>>16&255]+nn[n>>24&255]).toLowerCase()}function nt(i,e,t){return Math.max(e,Math.min(t,i))}function fg(i,e){return(i%e+e)%e}function xh(i,e,t){return(1-t)*i+t*e}function Xn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function yt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var Su=class Su{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=nt(this.x,e.x,t.x),this.y=nt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=nt(this.x,e,t),this.y=nt(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(nt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(nt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Su.prototype.isVector2=!0;var se=Su,Zn=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3],d=r[a+0],f=r[a+1],m=r[a+2],x=r[a+3];if(u!==x||c!==d||l!==f||h!==m){let g=c*d+l*f+h*m+u*x;g<0&&(d=-d,f=-f,m=-m,x=-x,g=-g);let p=1-o;if(g<.9995){let M=Math.acos(g),C=Math.sin(M);p=Math.sin(p*M)/C,o=Math.sin(o*M)/C,c=c*p+d*o,l=l*p+f*o,h=h*p+m*o,u=u*p+x*o}else{c=c*p+d*o,l=l*p+f*o,h=h*p+m*o,u=u*p+x*o;let M=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=M,l*=M,h*=M,u*=M}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,a){let o=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=r[a],d=r[a+1],f=r[a+2],m=r[a+3];return e[t]=o*m+h*u+c*f-l*d,e[t+1]=c*m+h*d+l*u-o*f,e[t+2]=l*m+h*f+o*d-c*u,e[t+3]=h*m-o*u-c*d-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(s/2),u=o(r/2),d=c(n/2),f=c(s/2),m=c(r/2);switch(a){case"XYZ":this._x=d*h*u+l*f*m,this._y=l*f*u-d*h*m,this._z=l*h*m+d*f*u,this._w=l*h*u-d*f*m;break;case"YXZ":this._x=d*h*u+l*f*m,this._y=l*f*u-d*h*m,this._z=l*h*m-d*f*u,this._w=l*h*u+d*f*m;break;case"ZXY":this._x=d*h*u-l*f*m,this._y=l*f*u+d*h*m,this._z=l*h*m+d*f*u,this._w=l*h*u-d*f*m;break;case"ZYX":this._x=d*h*u-l*f*m,this._y=l*f*u+d*h*m,this._z=l*h*m-d*f*u,this._w=l*h*u+d*f*m;break;case"YZX":this._x=d*h*u+l*f*m,this._y=l*f*u+d*h*m,this._z=l*h*m-d*f*u,this._w=l*h*u-d*f*m;break;case"XZY":this._x=d*h*u-l*f*m,this._y=l*f*u-d*h*m,this._z=l*h*m+d*f*u,this._w=l*h*u+d*f*m;break;default:Xe("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],h=t[6],u=t[10],d=n+o+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(a-s)*f}else if(n>o&&n>u){let f=2*Math.sqrt(1+n-o-u);this._w=(h-c)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+l)/f}else if(o>u){let f=2*Math.sqrt(1+o-n-u);this._w=(r-l)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(c+h)/f}else{let f=2*Math.sqrt(1+u-n-o);this._w=(a-s)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(nt(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+a*o+s*l-r*c,this._y=s*h+a*c+r*o-n*l,this._z=r*h+a*l+n*c-s*o,this._w=a*h-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let c=1-t;if(o<.9995){let l=Math.acos(o),h=Math.sin(l);c=Math.sin(c*l)/h,t=Math.sin(t*l)/h,this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this._onChangeCallback()}else this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Tu=class Tu{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Nf.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Nf.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*s-o*n),h=2*(o*t-r*s),u=2*(r*n-a*t);return this.x=t+c*l+a*u-o*h,this.y=n+c*h+o*l-r*u,this.z=s+c*u+r*h-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=nt(this.x,e.x,t.x),this.y=nt(this.y,e.y,t.y),this.z=nt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=nt(this.x,e,t),this.y=nt(this.y,e,t),this.z=nt(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(nt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return _h.copy(this).projectOnVector(e),this.sub(_h)}reflect(e){return this.sub(_h.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(nt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Tu.prototype.isVector3=!0;var I=Tu,_h=new I,Nf=new Zn,Eu=class Eu{constructor(e,t,n,s,r,a,o,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l)}set(e,t,n,s,r,a,o,c,l){let h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],f=n[5],m=n[8],x=s[0],g=s[3],p=s[6],M=s[1],C=s[4],v=s[7],w=s[2],T=s[5],R=s[8];return r[0]=a*x+o*M+c*w,r[3]=a*g+o*C+c*T,r[6]=a*p+o*v+c*R,r[1]=l*x+h*M+u*w,r[4]=l*g+h*C+u*T,r[7]=l*p+h*v+u*R,r[2]=d*x+f*M+m*w,r[5]=d*g+f*C+m*T,r[8]=d*p+f*v+m*R,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8];return t*a*h-t*o*l-n*r*h+n*o*c+s*r*l-s*a*c}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],u=h*a-o*l,d=o*c-h*r,f=l*r-a*c,m=t*u+n*d+s*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/m;return e[0]=u*x,e[1]=(s*l-h*n)*x,e[2]=(o*n-s*a)*x,e[3]=d*x,e[4]=(h*t-s*c)*x,e[5]=(s*r-o*t)*x,e[6]=f*x,e[7]=(n*c-l*t)*x,e[8]=(a*t-n*r)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-s*l,s*c,-s*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return es("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(yh.makeScale(e,t)),this}rotate(e){return es("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(yh.makeRotation(-e)),this}translate(e,t){return es("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(yh.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Eu.prototype.isMatrix3=!0;var Je=Eu,yh=new Je,Uf=new Je().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Of=new Je().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function pg(){let i={enabled:!0,workingColorSpace:Br,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ht&&(s.r=fi(s.r),s.g=fi(s.g),s.b=fi(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ht&&(s.r=Gs(s.r),s.g=Gs(s.g),s.b=Gs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===xi?Vr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return es("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return es("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Br]:{primaries:e,whitePoint:n,transfer:Vr,toXYZ:Uf,fromXYZ:Of,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:zt},outputColorSpaceConfig:{drawingBufferColorSpace:zt}},[zt]:{primaries:e,whitePoint:n,transfer:ht,toXYZ:Uf,fromXYZ:Of,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:zt}}}),i}var it=pg();function fi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Gs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Es,Jo=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Es===void 0&&(Es=Hr("canvas")),Es.width=e.width,Es.height=e.height;let s=Es.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Es}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Hr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=fi(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(fi(t[n]/255)*255):t[n]=fi(t[n]);return{data:t,width:e.width,height:e.height}}else return Xe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},mg=0,Ys=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:mg++}),this.uuid=di(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(vh(s[a].image)):r.push(vh(s[a]))}else r=vh(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function vh(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Jo.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Xe("Texture: Unable to serialize Texture."),{})}var gg=0,Mh=new I,un=class i extends $n{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=qn,s=qn,r=Jt,a=Fi,o=In,c=pn,l=i.DEFAULT_ANISOTROPY,h=xi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:gg++}),this.uuid=di(),this.name="",this.source=new Ys(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new se(0,0),this.repeat=new se(1,1),this.center=new se(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Je,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Mh).x}get height(){return this.source.getSize(Mh).y}get depth(){return this.source.getSize(Mh).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Xe(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Xe(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==lu)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case qo:e.x=e.x-Math.floor(e.x);break;case qn:e.x=e.x<0?0:1;break;case Yo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case qo:e.y=e.y-Math.floor(e.y);break;case qn:e.y=e.y<0?0:1;break;case Yo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};un.DEFAULT_IMAGE=null;un.DEFAULT_MAPPING=lu;un.DEFAULT_ANISOTROPY=1;var wu=class wu{constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,c=e.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],m=c[9],x=c[2],g=c[6],p=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-x)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+x)<.1&&Math.abs(m+g)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let C=(l+1)/2,v=(f+1)/2,w=(p+1)/2,T=(h+d)/4,R=(u+x)/4,y=(m+g)/4;return C>v&&C>w?C<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(C),s=T/n,r=R/n):v>w?v<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),n=T/s,r=y/s):w<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),n=R/r,s=y/r),this.set(n,s,r,t),this}let M=Math.sqrt((g-m)*(g-m)+(u-x)*(u-x)+(d-h)*(d-h));return Math.abs(M)<.001&&(M=1),this.x=(g-m)/M,this.y=(u-x)/M,this.z=(d-h)/M,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=nt(this.x,e.x,t.x),this.y=nt(this.y,e.y,t.y),this.z=nt(this.z,e.z,t.z),this.w=nt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=nt(this.x,e,t),this.y=nt(this.y,e,t),this.z=nt(this.z,e,t),this.w=nt(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(nt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};wu.prototype.isVector4=!0;var Pt=wu,Ko=class extends $n{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Jt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Pt(0,0,e,t),this.scissorTest=!1,this.viewport=new Pt(0,0,e,t),this.textures=[];let s={width:e,height:t,depth:n.depth},r=new un(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:Jt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new Ys(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Bt=class extends Ko{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Wr=class extends un{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Yt,this.minFilter=Yt,this.wrapR=qn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var jo=class extends un{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Yt,this.minFilter=Yt,this.wrapR=qn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var Sc=class Sc{constructor(e,t,n,s,r,a,o,c,l,h,u,d,f,m,x,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l,h,u,d,f,m,x,g)}set(e,t,n,s,r,a,o,c,l,h,u,d,f,m,x,g){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=m,p[11]=x,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Sc().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,s=1/ws.setFromMatrixColumn(e,0).length(),r=1/ws.setFromMatrixColumn(e,1).length(),a=1/ws.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let d=a*h,f=a*u,m=o*h,x=o*u;t[0]=c*h,t[4]=-c*u,t[8]=l,t[1]=f+m*l,t[5]=d-x*l,t[9]=-o*c,t[2]=x-d*l,t[6]=m+f*l,t[10]=a*c}else if(e.order==="YXZ"){let d=c*h,f=c*u,m=l*h,x=l*u;t[0]=d+x*o,t[4]=m*o-f,t[8]=a*l,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=f*o-m,t[6]=x+d*o,t[10]=a*c}else if(e.order==="ZXY"){let d=c*h,f=c*u,m=l*h,x=l*u;t[0]=d-x*o,t[4]=-a*u,t[8]=m+f*o,t[1]=f+m*o,t[5]=a*h,t[9]=x-d*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){let d=a*h,f=a*u,m=o*h,x=o*u;t[0]=c*h,t[4]=m*l-f,t[8]=d*l+x,t[1]=c*u,t[5]=x*l+d,t[9]=f*l-m,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){let d=a*c,f=a*l,m=o*c,x=o*l;t[0]=c*h,t[4]=x-d*u,t[8]=m*u+f,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-l*h,t[6]=f*u+m,t[10]=d-x*u}else if(e.order==="XZY"){let d=a*c,f=a*l,m=o*c,x=o*l;t[0]=c*h,t[4]=-u,t[8]=l*h,t[1]=d*u+x,t[5]=a*h,t[9]=f*u-m,t[2]=m*u-f,t[6]=o*h,t[10]=x*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(xg,e,_g)}lookAt(e,t,n){let s=this.elements;return _n.subVectors(e,t),_n.lengthSq()===0&&(_n.z=1),_n.normalize(),Si.crossVectors(n,_n),Si.lengthSq()===0&&(Math.abs(n.z)===1?_n.x+=1e-4:_n.z+=1e-4,_n.normalize(),Si.crossVectors(n,_n)),Si.normalize(),oo.crossVectors(_n,Si),s[0]=Si.x,s[4]=oo.x,s[8]=_n.x,s[1]=Si.y,s[5]=oo.y,s[9]=_n.y,s[2]=Si.z,s[6]=oo.z,s[10]=_n.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],f=n[13],m=n[2],x=n[6],g=n[10],p=n[14],M=n[3],C=n[7],v=n[11],w=n[15],T=s[0],R=s[4],y=s[8],E=s[12],P=s[1],N=s[5],F=s[9],B=s[13],D=s[2],V=s[6],X=s[10],z=s[14],K=s[3],q=s[7],Q=s[11],ee=s[15];return r[0]=a*T+o*P+c*D+l*K,r[4]=a*R+o*N+c*V+l*q,r[8]=a*y+o*F+c*X+l*Q,r[12]=a*E+o*B+c*z+l*ee,r[1]=h*T+u*P+d*D+f*K,r[5]=h*R+u*N+d*V+f*q,r[9]=h*y+u*F+d*X+f*Q,r[13]=h*E+u*B+d*z+f*ee,r[2]=m*T+x*P+g*D+p*K,r[6]=m*R+x*N+g*V+p*q,r[10]=m*y+x*F+g*X+p*Q,r[14]=m*E+x*B+g*z+p*ee,r[3]=M*T+C*P+v*D+w*K,r[7]=M*R+C*N+v*V+w*q,r[11]=M*y+C*F+v*X+w*Q,r[15]=M*E+C*B+v*z+w*ee,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],h=e[2],u=e[6],d=e[10],f=e[14],m=e[3],x=e[7],g=e[11],p=e[15],M=c*f-l*d,C=o*f-l*u,v=o*d-c*u,w=a*f-l*h,T=a*d-c*h,R=a*u-o*h;return t*(x*M-g*C+p*v)-n*(m*M-g*w+p*T)+s*(m*C-x*w+p*R)-r*(m*v-x*T+g*R)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],a=e[5],o=e[9],c=e[2],l=e[6],h=e[10];return t*(a*h-o*l)-n*(r*h-o*c)+s*(r*l-a*c)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],u=e[9],d=e[10],f=e[11],m=e[12],x=e[13],g=e[14],p=e[15],M=t*o-n*a,C=t*c-s*a,v=t*l-r*a,w=n*c-s*o,T=n*l-r*o,R=s*l-r*c,y=h*x-u*m,E=h*g-d*m,P=h*p-f*m,N=u*g-d*x,F=u*p-f*x,B=d*p-f*g,D=M*B-C*F+v*N+w*P-T*E+R*y;if(D===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let V=1/D;return e[0]=(o*B-c*F+l*N)*V,e[1]=(s*F-n*B-r*N)*V,e[2]=(x*R-g*T+p*w)*V,e[3]=(d*T-u*R-f*w)*V,e[4]=(c*P-a*B-l*E)*V,e[5]=(t*B-s*P+r*E)*V,e[6]=(g*v-m*R-p*C)*V,e[7]=(h*R-d*v+f*C)*V,e[8]=(a*F-o*P+l*y)*V,e[9]=(n*P-t*F-r*y)*V,e[10]=(m*T-x*v+p*M)*V,e[11]=(u*v-h*T-f*M)*V,e[12]=(o*E-a*N-c*y)*V,e[13]=(t*N-n*E+s*y)*V,e[14]=(x*C-m*w-g*M)*V,e[15]=(h*w-u*C+d*M)*V,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,c=e.z,l=r*a,h=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+n,h*c-s*a,0,l*c-s*o,h*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,h=a+a,u=o+o,d=r*l,f=r*h,m=r*u,x=a*h,g=a*u,p=o*u,M=c*l,C=c*h,v=c*u,w=n.x,T=n.y,R=n.z;return s[0]=(1-(x+p))*w,s[1]=(f+v)*w,s[2]=(m-C)*w,s[3]=0,s[4]=(f-v)*T,s[5]=(1-(d+p))*T,s[6]=(g+M)*T,s[7]=0,s[8]=(m+C)*R,s[9]=(g-M)*R,s[10]=(1-(d+x))*R,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=ws.set(s[0],s[1],s[2]).length(),o=ws.set(s[4],s[5],s[6]).length(),c=ws.set(s[8],s[9],s[10]).length();r<0&&(a=-a),Un.copy(this);let l=1/a,h=1/o,u=1/c;return Un.elements[0]*=l,Un.elements[1]*=l,Un.elements[2]*=l,Un.elements[4]*=h,Un.elements[5]*=h,Un.elements[6]*=h,Un.elements[8]*=u,Un.elements[9]*=u,Un.elements[10]*=u,t.setFromRotationMatrix(Un),n.x=a,n.y=o,n.z=c,this}makePerspective(e,t,n,s,r,a,o=zn,c=!1){let l=this.elements,h=2*r/(t-e),u=2*r/(n-s),d=(t+e)/(t-e),f=(n+s)/(n-s),m,x;if(c)m=r/(a-r),x=a*r/(a-r);else if(o===zn)m=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===Xs)m=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=zn,c=!1){let l=this.elements,h=2/(t-e),u=2/(n-s),d=-(t+e)/(t-e),f=-(n+s)/(n-s),m,x;if(c)m=1/(a-r),x=a/(a-r);else if(o===zn)m=-2/(a-r),x=-(a+r)/(a-r);else if(o===Xs)m=-1/(a-r),x=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=u,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};Sc.prototype.isMatrix4=!0;var dt=Sc,ws=new I,Un=new dt,xg=new I(0,0,0),_g=new I(1,1,1),Si=new I,oo=new I,_n=new I,Ff=new dt,kf=new Zn,Jn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(nt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-nt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(nt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-nt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(nt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-nt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Xe("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Ff.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ff,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return kf.setFromEuler(this),this.setFromQuaternion(kf,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Jn.DEFAULT_ORDER="XYZ";var $s=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},yg=0,zf=new I,As=new Zn,ai=new dt,co=new I,wr=new I,vg=new I,Mg=new Zn,Bf=new I(1,0,0),Vf=new I(0,1,0),Hf=new I(0,0,1),Gf={type:"added"},bg={type:"removed"},Cs={type:"childadded",child:null},bh={type:"childremoved",child:null},Ot=class i extends $n{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:yg++}),this.uuid=di(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new I,t=new Jn,n=new Zn,s=new I(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new dt},normalMatrix:{value:new Je}}),this.matrix=new dt,this.matrixWorld=new dt,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new $s,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return As.setFromAxisAngle(e,t),this.quaternion.multiply(As),this}rotateOnWorldAxis(e,t){return As.setFromAxisAngle(e,t),this.quaternion.premultiply(As),this}rotateX(e){return this.rotateOnAxis(Bf,e)}rotateY(e){return this.rotateOnAxis(Vf,e)}rotateZ(e){return this.rotateOnAxis(Hf,e)}translateOnAxis(e,t){return zf.copy(e).applyQuaternion(this.quaternion),this.position.add(zf.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Bf,e)}translateY(e){return this.translateOnAxis(Vf,e)}translateZ(e){return this.translateOnAxis(Hf,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ai.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?co.copy(e):co.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),wr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ai.lookAt(wr,co,this.up):ai.lookAt(co,wr,this.up),this.quaternion.setFromRotationMatrix(ai),s&&(ai.extractRotation(s.matrixWorld),As.setFromRotationMatrix(ai),this.quaternion.premultiply(As.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(We("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Gf),Cs.child=e,this.dispatchEvent(Cs),Cs.child=null):We("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(bg),bh.child=e,this.dispatchEvent(bh),bh.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ai.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ai.multiply(e.parent.matrixWorld)),e.applyMatrix4(ai),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Gf),Cs.child=e,this.dispatchEvent(Cs),Cs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(wr,e,vg),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(wr,Mg,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let u=c[l];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let c=this.animations[o];s.animations.push(r(e.animations,c))}}if(t){let o=a(e.geometries),c=a(e.materials),l=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),f=a(e.animations),m=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),m.length>0&&(n.nodes=m)}return n.object=s,n;function a(o){let c=[];for(let l in o){let h=o[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Ot.DEFAULT_UP=new I(0,1,0);Ot.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ot.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var vn=class extends Ot{constructor(){super(),this.isGroup=!0,this.type="Group"}},Sg={type:"move"},Zs=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new vn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new vn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new vn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null,o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(let x of e.hand.values()){let g=t.getJointPose(x,n),p=this._getHandJoint(l,x);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}let h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,m=.005;l.inputState.pinching&&d>f+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&d<=f-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Sg)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new vn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Qp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ti={h:0,s:0,l:0},lo={h:0,s:0,l:0};function Sh(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var Te=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=zt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,it.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=it.workingColorSpace){return this.r=e,this.g=t,this.b=n,it.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=it.workingColorSpace){if(e=fg(e,1),t=nt(t,0,1),n=nt(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Sh(a,r,e+1/3),this.g=Sh(a,r,e),this.b=Sh(a,r,e-1/3)}return it.colorSpaceToWorking(this,s),this}setStyle(e,t=zt){function n(r){r!==void 0&&parseFloat(r)<1&&Xe("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Xe("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Xe("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=zt){let n=Qp[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Xe("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=fi(e.r),this.g=fi(e.g),this.b=fi(e.b),this}copyLinearToSRGB(e){return this.r=Gs(e.r),this.g=Gs(e.g),this.b=Gs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=zt){return it.workingToColorSpace(sn.copy(this),e),Math.round(nt(sn.r*255,0,255))*65536+Math.round(nt(sn.g*255,0,255))*256+Math.round(nt(sn.b*255,0,255))}getHexString(e=zt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=it.workingColorSpace){it.workingToColorSpace(sn.copy(this),t);let n=sn.r,s=sn.g,r=sn.b,a=Math.max(n,s,r),o=Math.min(n,s,r),c,l,h=(o+a)/2;if(o===a)c=0,l=0;else{let u=a-o;switch(l=h<=.5?u/(a+o):u/(2-a-o),a){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=it.workingColorSpace){return it.workingToColorSpace(sn.copy(this),t),e.r=sn.r,e.g=sn.g,e.b=sn.b,e}getStyle(e=zt){it.workingToColorSpace(sn.copy(this),e);let t=sn.r,n=sn.g,s=sn.b;return e!==zt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Ti),this.setHSL(Ti.h+e,Ti.s+t,Ti.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Ti),e.getHSL(lo);let n=xh(Ti.h,lo.h,t),s=xh(Ti.s,lo.s,t),r=xh(Ti.l,lo.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},sn=new Te;Te.NAMES=Qp;var Xr=class i{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Te(e),this.density=t}clone(){return new i(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var ts=class extends Ot{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Jn,this.environmentIntensity=1,this.environmentRotation=new Jn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},On=new I,oi=new I,Th=new I,ci=new I,Rs=new I,Ps=new I,Wf=new I,Eh=new I,wh=new I,Ah=new I,Ch=new Pt,Rh=new Pt,Ph=new Pt,ui=class i{constructor(e=new I,t=new I,n=new I){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),On.subVectors(e,t),s.cross(On);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){On.subVectors(s,t),oi.subVectors(n,t),Th.subVectors(e,t);let a=On.dot(On),o=On.dot(oi),c=On.dot(Th),l=oi.dot(oi),h=oi.dot(Th),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(l*c-o*h)*d,m=(a*h-o*c)*d;return r.set(1-f-m,m,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,ci)===null?!1:ci.x>=0&&ci.y>=0&&ci.x+ci.y<=1}static getInterpolation(e,t,n,s,r,a,o,c){return this.getBarycoord(e,t,n,s,ci)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,ci.x),c.addScaledVector(a,ci.y),c.addScaledVector(o,ci.z),c)}static getInterpolatedAttribute(e,t,n,s,r,a){return Ch.setScalar(0),Rh.setScalar(0),Ph.setScalar(0),Ch.fromBufferAttribute(e,t),Rh.fromBufferAttribute(e,n),Ph.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Ch,r.x),a.addScaledVector(Rh,r.y),a.addScaledVector(Ph,r.z),a}static isFrontFacing(e,t,n,s){return On.subVectors(n,t),oi.subVectors(e,t),On.cross(oi).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return On.subVectors(this.c,this.b),oi.subVectors(this.a,this.b),On.cross(oi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,a,o;Rs.subVectors(s,n),Ps.subVectors(r,n),Eh.subVectors(e,n);let c=Rs.dot(Eh),l=Ps.dot(Eh);if(c<=0&&l<=0)return t.copy(n);wh.subVectors(e,s);let h=Rs.dot(wh),u=Ps.dot(wh);if(h>=0&&u<=h)return t.copy(s);let d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return a=c/(c-h),t.copy(n).addScaledVector(Rs,a);Ah.subVectors(e,r);let f=Rs.dot(Ah),m=Ps.dot(Ah);if(m>=0&&f<=m)return t.copy(r);let x=f*l-c*m;if(x<=0&&l>=0&&m<=0)return o=l/(l-m),t.copy(n).addScaledVector(Ps,o);let g=h*m-f*u;if(g<=0&&u-h>=0&&f-m>=0)return Wf.subVectors(r,s),o=(u-h)/(u-h+(f-m)),t.copy(s).addScaledVector(Wf,o);let p=1/(g+x+d);return a=x*p,o=d*p,t.copy(n).addScaledVector(Rs,a).addScaledVector(Ps,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Kn=class{constructor(e=new I(1/0,1/0,1/0),t=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Fn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Fn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Fn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Fn):Fn.fromBufferAttribute(r,a),Fn.applyMatrix4(e.matrixWorld),this.expandByPoint(Fn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ho.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ho.copy(n.boundingBox)),ho.applyMatrix4(e.matrixWorld),this.union(ho)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Fn),Fn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ar),uo.subVectors(this.max,Ar),Is.subVectors(e.a,Ar),Ls.subVectors(e.b,Ar),Ds.subVectors(e.c,Ar),Ei.subVectors(Ls,Is),wi.subVectors(Ds,Ls),Zi.subVectors(Is,Ds);let t=[0,-Ei.z,Ei.y,0,-wi.z,wi.y,0,-Zi.z,Zi.y,Ei.z,0,-Ei.x,wi.z,0,-wi.x,Zi.z,0,-Zi.x,-Ei.y,Ei.x,0,-wi.y,wi.x,0,-Zi.y,Zi.x,0];return!Ih(t,Is,Ls,Ds,uo)||(t=[1,0,0,0,1,0,0,0,1],!Ih(t,Is,Ls,Ds,uo))?!1:(fo.crossVectors(Ei,wi),t=[fo.x,fo.y,fo.z],Ih(t,Is,Ls,Ds,uo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Fn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Fn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(li[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),li[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),li[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),li[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),li[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),li[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),li[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),li[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(li),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},li=[new I,new I,new I,new I,new I,new I,new I,new I],Fn=new I,ho=new Kn,Is=new I,Ls=new I,Ds=new I,Ei=new I,wi=new I,Zi=new I,Ar=new I,uo=new I,fo=new I,Ji=new I;function Ih(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Ji.fromArray(i,r);let o=s.x*Math.abs(Ji.x)+s.y*Math.abs(Ji.y)+s.z*Math.abs(Ji.z),c=e.dot(Ji),l=t.dot(Ji),h=n.dot(Ji);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}var kt=new I,po=new se,Tg=0,wt=class extends $n{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Tg++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=gu,this.updateRanges=[],this.gpuType=Pn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)po.fromBufferAttribute(this,t),po.applyMatrix3(e),this.setXY(t,po.x,po.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)kt.fromBufferAttribute(this,t),kt.applyMatrix3(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)kt.fromBufferAttribute(this,t),kt.applyMatrix4(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)kt.fromBufferAttribute(this,t),kt.applyNormalMatrix(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)kt.fromBufferAttribute(this,t),kt.transformDirection(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Xn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=yt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Xn(t,this.array)),t}setX(e,t){return this.normalized&&(t=yt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Xn(t,this.array)),t}setY(e,t){return this.normalized&&(t=yt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Xn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=yt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Xn(t,this.array)),t}setW(e,t){return this.normalized&&(t=yt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array),s=yt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array),s=yt(s,this.array),r=yt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var qr=class extends wt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Yr=class extends wt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var ot=class extends wt{constructor(e,t,n){super(new Float32Array(e),t,n)}},Eg=new Kn,Cr=new I,Lh=new I,jn=class{constructor(e=new I,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Eg.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Cr.subVectors(e,this.center);let t=Cr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Cr,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Lh.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Cr.copy(e.center).add(Lh)),this.expandByPoint(Cr.copy(e.center).sub(Lh))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},wg=0,An=new dt,Dh=new Ot,Ns=new I,yn=new Kn,Rr=new Kn,qt=new I,vt=class i extends $n{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:wg++}),this.uuid=di(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(ug(e)?Yr:qr)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Je().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return An.makeRotationFromQuaternion(e),this.applyMatrix4(An),this}rotateX(e){return An.makeRotationX(e),this.applyMatrix4(An),this}rotateY(e){return An.makeRotationY(e),this.applyMatrix4(An),this}rotateZ(e){return An.makeRotationZ(e),this.applyMatrix4(An),this}translate(e,t,n){return An.makeTranslation(e,t,n),this.applyMatrix4(An),this}scale(e,t,n){return An.makeScale(e,t,n),this.applyMatrix4(An),this}lookAt(e){return Dh.lookAt(e),Dh.updateMatrix(),this.applyMatrix4(Dh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ns).negate(),this.translate(Ns.x,Ns.y,Ns.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ot(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Xe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Kn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){We("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];yn.setFromBufferAttribute(r),this.morphTargetsRelative?(qt.addVectors(this.boundingBox.min,yn.min),this.boundingBox.expandByPoint(qt),qt.addVectors(this.boundingBox.max,yn.max),this.boundingBox.expandByPoint(qt)):(this.boundingBox.expandByPoint(yn.min),this.boundingBox.expandByPoint(yn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&We('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new jn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){We("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(e){let n=this.boundingSphere.center;if(yn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];Rr.setFromBufferAttribute(o),this.morphTargetsRelative?(qt.addVectors(yn.min,Rr.min),yn.expandByPoint(qt),qt.addVectors(yn.max,Rr.max),yn.expandByPoint(qt)):(yn.expandByPoint(Rr.min),yn.expandByPoint(Rr.max))}yn.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)qt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(qt));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)qt.fromBufferAttribute(o,l),c&&(Ns.fromBufferAttribute(e,l),qt.add(Ns)),s=Math.max(s,n.distanceToSquared(qt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&We('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){We("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new wt(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let o=[],c=[];for(let y=0;y<n.count;y++)o[y]=new I,c[y]=new I;let l=new I,h=new I,u=new I,d=new se,f=new se,m=new se,x=new I,g=new I;function p(y,E,P){l.fromBufferAttribute(n,y),h.fromBufferAttribute(n,E),u.fromBufferAttribute(n,P),d.fromBufferAttribute(r,y),f.fromBufferAttribute(r,E),m.fromBufferAttribute(r,P),h.sub(l),u.sub(l),f.sub(d),m.sub(d);let N=1/(f.x*m.y-m.x*f.y);isFinite(N)&&(x.copy(h).multiplyScalar(m.y).addScaledVector(u,-f.y).multiplyScalar(N),g.copy(u).multiplyScalar(f.x).addScaledVector(h,-m.x).multiplyScalar(N),o[y].add(x),o[E].add(x),o[P].add(x),c[y].add(g),c[E].add(g),c[P].add(g))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let y=0,E=M.length;y<E;++y){let P=M[y],N=P.start,F=P.count;for(let B=N,D=N+F;B<D;B+=3)p(e.getX(B+0),e.getX(B+1),e.getX(B+2))}let C=new I,v=new I,w=new I,T=new I;function R(y){w.fromBufferAttribute(s,y),T.copy(w);let E=o[y];C.copy(E),C.sub(w.multiplyScalar(w.dot(E))).normalize(),v.crossVectors(T,E);let N=v.dot(c[y])<0?-1:1;a.setXYZW(y,C.x,C.y,C.z,N)}for(let y=0,E=M.length;y<E;++y){let P=M[y],N=P.start,F=P.count;for(let B=N,D=N+F;B<D;B+=3)R(e.getX(B+0)),R(e.getX(B+1)),R(e.getX(B+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new wt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let s=new I,r=new I,a=new I,o=new I,c=new I,l=new I,h=new I,u=new I;if(e)for(let d=0,f=e.count;d<f;d+=3){let m=e.getX(d+0),x=e.getX(d+1),g=e.getX(d+2);s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,x),a.fromBufferAttribute(t,g),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(n,m),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,g),o.add(h),c.add(h),l.add(h),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(g,l.x,l.y,l.z)}else for(let d=0,f=t.count;d<f;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)qt.fromBufferAttribute(e,t),qt.normalize(),e.setXYZ(t,qt.x,qt.y,qt.z)}toNonIndexed(){function e(o,c){let l=o.array,h=o.itemSize,u=o.normalized,d=new l.constructor(c.length*h),f=0,m=0;for(let x=0,g=c.length;x<g;x++){o.isInterleavedBufferAttribute?f=c[x]*o.data.stride+o.offset:f=c[x]*h;for(let p=0;p<h;p++)d[m++]=l[f++]}return new wt(d,h,u)}if(this.index===null)return Xe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let o in s){let c=s[o],l=e(c,n);t.setAttribute(o,l)}let r=this.morphAttributes;for(let o in r){let c=[],l=r[o];for(let h=0,u=l.length;h<u;h++){let d=l[h],f=e(d,n);c.push(f)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,c=a.length;o<c;o++){let l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let c in n){let l=n[c];e.data.attributes[c]=l.toJSON(e.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){let f=l[u];h.push(f.toJSON(e.data))}h.length>0&&(s[c]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let l in s){let h=s[l];this.setAttribute(l,h.clone(t))}let r=e.morphAttributes;for(let l in r){let h=[],u=r[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let l=0,h=a.length;l<h;l++){let u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},Qo=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=gu,this.updateRanges=[],this.version=0,this.uuid=di()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=di()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=di()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},hn=new I,$r=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)hn.fromBufferAttribute(this,t),hn.applyMatrix4(e),this.setXYZ(t,hn.x,hn.y,hn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)hn.fromBufferAttribute(this,t),hn.applyNormalMatrix(e),this.setXYZ(t,hn.x,hn.y,hn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)hn.fromBufferAttribute(this,t),hn.transformDirection(e),this.setXYZ(t,hn.x,hn.y,hn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Xn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=yt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=yt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=yt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=yt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=yt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Xn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Xn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Xn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Xn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array),s=yt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array),s=yt(s,this.array),r=yt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){Gr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new wt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Gr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Nh=new I,Ag=new I,Cg=new Je,kn=class{constructor(e=new I(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=Nh.subVectors(n,t).cross(Ag.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let s=e.delta(Nh),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Cg.getNormalMatrix(e),s=this.coplanarPoint(Nh).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Rg=0,Cn=class extends $n{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Rg++}),this.uuid=di(),this.name="",this.type="Material",this.blending=ar,this.side=Ui,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ou,this.blendDst=cu,this.blendEquation=ls,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Te(0,0,0),this.blendAlpha=0,this.depthFunc=Ws,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Hp,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ko,this.stencilZFail=ko,this.stencilZPass=ko,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Xe(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Xe(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let c=r[o];delete c.metadata,a.push(c)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Te().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new kn().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new se().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new se().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},pi=class extends Cn{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Te(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Us,Pr=new I,Os=new I,Fs=new I,ks=new se,Ir=new se,em=new dt,mo=new I,Lr=new I,go=new I,Xf=new se,Uh=new se,qf=new se,Ci=class extends Ot{constructor(e=new pi){if(super(),this.isSprite=!0,this.type="Sprite",Us===void 0){Us=new vt;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Qo(t,5);Us.setIndex([0,1,2,0,2,3]),Us.setAttribute("position",new $r(n,3,0,!1)),Us.setAttribute("uv",new $r(n,2,3,!1))}this.geometry=Us,this.material=e,this.center=new se(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&We('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Os.setFromMatrixScale(this.matrixWorld),em.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Fs.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Os.multiplyScalar(-Fs.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let a=this.center;xo(mo.set(-.5,-.5,0),Fs,a,Os,s,r),xo(Lr.set(.5,-.5,0),Fs,a,Os,s,r),xo(go.set(.5,.5,0),Fs,a,Os,s,r),Xf.set(0,0),Uh.set(1,0),qf.set(1,1);let o=e.ray.intersectTriangle(mo,Lr,go,!1,Pr);if(o===null&&(xo(Lr.set(-.5,.5,0),Fs,a,Os,s,r),Uh.set(0,1),o=e.ray.intersectTriangle(mo,go,Lr,!1,Pr),o===null))return;let c=e.ray.origin.distanceTo(Pr);c<e.near||c>e.far||t.push({distance:c,point:Pr.clone(),uv:ui.getInterpolation(Pr,mo,Lr,go,Xf,Uh,qf,new se),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function xo(i,e,t,n,s,r){ks.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(Ir.x=r*ks.x-s*ks.y,Ir.y=s*ks.x+r*ks.y):Ir.copy(ks),i.copy(e),i.x+=Ir.x,i.y+=Ir.y,i.applyMatrix4(em)}var hi=new I,Oh=new I,_o=new I,yo=new I,ns=class{constructor(e=new I,t=new I(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,hi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=hi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(hi.copy(this.origin).addScaledVector(this.direction,t),hi.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Oh.copy(e).add(t).multiplyScalar(.5),_o.copy(t).sub(e).normalize(),yo.copy(this.origin).sub(Oh);let r=e.distanceTo(t)*.5,a=-this.direction.dot(_o),o=yo.dot(this.direction),c=-yo.dot(_o),l=yo.lengthSq(),h=Math.abs(1-a*a),u,d,f,m;if(h>0)if(u=a*c-o,d=a*o-c,m=r*h,u>=0)if(d>=-m)if(d<=m){let x=1/h;u*=x,d*=x,f=u*(u+a*d+2*o)+d*(a*u+d+2*c)+l}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d<=-m?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l):d<=m?(u=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+l):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Oh).addScaledVector(_o,d),f}intersectSphere(e,t){if(e.radius<0)return null;hi.subVectors(e.center,this.origin);let n=hi.dot(this.direction),s=hi.dot(hi)-n*n,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,c,l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(e.min.x-d.x)*l,s=(e.max.x-d.x)*l):(n=(e.max.x-d.x)*l,s=(e.min.x-d.x)*l),h>=0?(r=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-d.z)*u,c=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,c=(e.min.z-d.z)*u),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,hi)!==null}intersectTriangle(e,t,n,s,r){let a=this.origin,o=this.direction,c=o.x,l=o.y,h=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,m=t.x-a.x,x=t.y-a.y,g=t.z-a.z,p=n.x-a.x,M=n.y-a.y,C=n.z-a.z,v=Math.abs(c),w=Math.abs(l),T=Math.abs(h),R,y,E,P,N,F,B,D,V,X,z,K;if(v>=w&&v>=T?(E=c,F=u,V=m,K=p,c>=0?(R=l,y=h,P=d,N=f,B=x,D=g,X=M,z=C):(R=h,y=l,P=f,N=d,B=g,D=x,X=C,z=M)):w>=T?(E=l,F=d,V=x,K=M,l>=0?(R=h,y=c,P=f,N=u,B=g,D=m,X=C,z=p):(R=c,y=h,P=u,N=f,B=m,D=g,X=p,z=C)):(E=h,F=f,V=g,K=C,h>=0?(R=c,y=l,P=u,N=d,B=m,D=x,X=p,z=M):(R=l,y=c,P=d,N=u,B=x,D=m,X=M,z=p)),E===0)return null;let q=R/E,Q=y/E,ee=1/E,Ue=P-q*F,Re=N-Q*F,ut=B-q*V,st=D-Q*V,ct=X-q*K,J=z-Q*K,ne=ct*st-J*ut,ye=Ue*J-Re*ct,qe=ut*Re-st*Ue;if(s){if(ne<0||ye<0||qe<0)return null}else if((ne<0||ye<0||qe<0)&&(ne>0||ye>0||qe>0))return null;let Se=ne+ye+qe;if(Se===0)return null;let Ye=ee*(ne*F+ye*V+qe*K);return(Se>0?Ye<0:Ye>0)?null:this.at(Ye/Se,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},At=class extends Cn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Te(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Jn,this.combine=Tc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Yf=new dt,Ki=new ns,vo=new jn,$f=new I,Mo=new I,bo=new I,So=new I,Fh=new I,To=new I,Zf=new I,Eo=new I,Ze=class extends Ot{constructor(e=new vt,t=new At){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){To.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let h=o[c],u=r[c];h!==0&&(Fh.fromBufferAttribute(u,e),a?To.addScaledVector(Fh,h):To.addScaledVector(Fh.sub(t),h))}t.add(To)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),vo.copy(n.boundingSphere),vo.applyMatrix4(r),Ki.copy(e.ray).recast(e.near),!(vo.containsPoint(Ki.origin)===!1&&(Ki.intersectSphere(vo,$f)===null||Ki.origin.distanceToSquared($f)>(e.far-e.near)**2))&&(Yf.copy(r).invert(),Ki.copy(e.ray).applyMatrix4(Yf),!(n.boundingBox!==null&&Ki.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Ki)))}_computeIntersections(e,t,n){let s,r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,x=d.length;m<x;m++){let g=d[m],p=a[g.materialIndex],M=Math.max(g.start,f.start),C=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let v=M,w=C;v<w;v+=3){let T=o.getX(v),R=o.getX(v+1),y=o.getX(v+2);s=wo(this,p,e,n,l,h,u,T,R,y),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,f.start),x=Math.min(o.count,f.start+f.count);for(let g=m,p=x;g<p;g+=3){let M=o.getX(g),C=o.getX(g+1),v=o.getX(g+2);s=wo(this,a,e,n,l,h,u,M,C,v),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let m=0,x=d.length;m<x;m++){let g=d[m],p=a[g.materialIndex],M=Math.max(g.start,f.start),C=Math.min(c.count,Math.min(g.start+g.count,f.start+f.count));for(let v=M,w=C;v<w;v+=3){let T=v,R=v+1,y=v+2;s=wo(this,p,e,n,l,h,u,T,R,y),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,f.start),x=Math.min(c.count,f.start+f.count);for(let g=m,p=x;g<p;g+=3){let M=g,C=g+1,v=g+2;s=wo(this,a,e,n,l,h,u,M,C,v),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}};function Pg(i,e,t,n,s,r,a,o){let c;if(e.side===jt?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,e.side===Ui,o),c===null)return null;Eo.copy(o),Eo.applyMatrix4(i.matrixWorld);let l=t.ray.origin.distanceTo(Eo);return l<t.near||l>t.far?null:{distance:l,point:Eo.clone(),object:i}}function wo(i,e,t,n,s,r,a,o,c,l){i.getVertexPosition(o,Mo),i.getVertexPosition(c,bo),i.getVertexPosition(l,So);let h=Pg(i,e,t,n,Mo,bo,So,Zf);if(h){let u=new I;ui.getBarycoord(Zf,Mo,bo,So,u),s&&(h.uv=ui.getInterpolatedAttribute(s,o,c,l,u,new se)),r&&(h.uv1=ui.getInterpolatedAttribute(r,o,c,l,u,new se)),a&&(h.normal=ui.getInterpolatedAttribute(a,o,c,l,u,new I),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a:o,b:c,c:l,normal:new I,materialIndex:0};ui.getNormal(Mo,bo,So,d.normal),h.face=d,h.barycoord=u}return h}var Zr=class extends un{constructor(e=null,t=1,n=1,s,r,a,o,c,l=Yt,h=Yt,u,d){super(null,a,o,c,l,h,s,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Jr=class extends wt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},zs=new dt,Jf=new dt,Ao=[],Kf=new Kn,Ig=new dt,Dr=new Ze,Nr=new jn,Kr=class extends Ze{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Jr(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Ig)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Kn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,zs),Kf.copy(e.boundingBox).applyMatrix4(zs),this.boundingBox.union(Kf)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new jn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,zs),Nr.copy(e.boundingSphere).applyMatrix4(zs),this.boundingSphere.union(Nr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(Dr.geometry=this.geometry,Dr.material=this.material,Dr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Nr.copy(this.boundingSphere),Nr.applyMatrix4(n),e.ray.intersectsSphere(Nr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,zs),Jf.multiplyMatrices(n,zs),Dr.matrixWorld=Jf,Dr.raycast(e,Ao);for(let a=0,o=Ao.length;a<o;a++){let c=Ao[a];c.instanceId=r,c.object=this,t.push(c)}Ao.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Jr(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Zr(new Float32Array(s*this.count),s,this.count,Ic,Pn));let r=this.morphTexture.source.data.data,a=0;for(let l=0;l<n.length;l++)a+=n[l];let o=this.geometry.morphTargetsRelative?1:1-a,c=s*e;return r[c]=o,r.set(n,c+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},ji=new jn,Lg=new se(.5,.5),Co=new I,Js=class{constructor(e=new kn,t=new kn,n=new kn,s=new kn,r=new kn,a=new kn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=zn,n=!1){let s=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],l=r[3],h=r[4],u=r[5],d=r[6],f=r[7],m=r[8],x=r[9],g=r[10],p=r[11],M=r[12],C=r[13],v=r[14],w=r[15];if(s[0].setComponents(l-a,f-h,p-m,w-M).normalize(),s[1].setComponents(l+a,f+h,p+m,w+M).normalize(),s[2].setComponents(l+o,f+u,p+x,w+C).normalize(),s[3].setComponents(l-o,f-u,p-x,w-C).normalize(),n)s[4].setComponents(c,d,g,v).normalize(),s[5].setComponents(l-c,f-d,p-g,w-v).normalize();else if(s[4].setComponents(l-c,f-d,p-g,w-v).normalize(),t===zn)s[5].setComponents(l+c,f+d,p+g,w+v).normalize();else if(t===Xs)s[5].setComponents(c,d,g,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ji.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ji.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ji)}intersectsSprite(e){ji.center.set(0,0,0);let t=Lg.distanceTo(e.center);return ji.radius=.7071067811865476+t,ji.applyMatrix4(e.matrixWorld),this.intersectsSphere(ji)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(Co.x=s.normal.x>0?e.max.x:e.min.x,Co.y=s.normal.y>0?e.max.y:e.min.y,Co.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Co)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var jr=class extends Cn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Te(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},ec=new I,tc=new I,jf=new dt,Ur=new ns,Ro=new jn,kh=new I,Qf=new I,Qr=class extends Ot{constructor(e=new vt,t=new jr){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)ec.fromBufferAttribute(t,s-1),tc.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=ec.distanceTo(tc);e.setAttribute("lineDistance",new ot(n,1))}else Xe("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ro.copy(n.boundingSphere),Ro.applyMatrix4(s),Ro.radius+=r,e.ray.intersectsSphere(Ro)===!1)return;jf.copy(s).invert(),Ur.copy(e.ray).applyMatrix4(jf);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){let f=Math.max(0,a.start),m=Math.min(h.count,a.start+a.count);for(let x=f,g=m-1;x<g;x+=l){let p=h.getX(x),M=h.getX(x+1),C=Po(this,e,Ur,c,p,M,x);C&&t.push(C)}if(this.isLineLoop){let x=h.getX(m-1),g=h.getX(f),p=Po(this,e,Ur,c,x,g,m-1);p&&t.push(p)}}else{let f=Math.max(0,a.start),m=Math.min(d.count,a.start+a.count);for(let x=f,g=m-1;x<g;x+=l){let p=Po(this,e,Ur,c,x,x+1,x);p&&t.push(p)}if(this.isLineLoop){let x=Po(this,e,Ur,c,m-1,f,m-1);x&&t.push(x)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function Po(i,e,t,n,s,r,a){let o=i.geometry.attributes.position;if(ec.fromBufferAttribute(o,s),tc.fromBufferAttribute(o,r),t.distanceSqToSegment(ec,tc,kh,Qf)>n)return;kh.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo(kh);if(!(l<e.near||l>e.far))return{distance:l,point:Qf.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}var Ks=class extends Cn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Te(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},ep=new dt,$h=new ns,Io=new jn,Lo=new I,is=class extends Ot{constructor(e=new vt,t=new Ks){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Io.copy(n.boundingSphere),Io.applyMatrix4(s),Io.radius+=r,e.ray.intersectsSphere(Io)===!1)return;ep.copy(s).invert(),$h.copy(e.ray).applyMatrix4(ep);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,u=n.attributes.position;if(l!==null){let d=Math.max(0,a.start),f=Math.min(l.count,a.start+a.count);for(let m=d,x=f;m<x;m++){let g=l.getX(m);Lo.fromBufferAttribute(u,g),tp(Lo,g,c,s,e,t,this)}}else{let d=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let m=d,x=f;m<x;m++)Lo.fromBufferAttribute(u,m),tp(Lo,m,c,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function tp(i,e,t,n,s,r,a){let o=$h.distanceSqToPoint(i);if(o<t){let c=new I;$h.closestPointToPoint(i,c),c.applyMatrix4(n);let l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}var ea=class extends un{constructor(e=[],t=Oi,n,s,r,a,o,c,l,h){super(e,t,n,s,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Qn=class extends un{constructor(e,t,n,s,r,a,o,c,l){super(e,t,n,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Ri=class extends un{constructor(e,t,n=Vn,s,r,a,o=Yt,c=Yt,l,h=Yn,u=1){if(h!==Yn&&h!==ki)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:t,depth:u};super(d,s,r,a,o,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ys(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},nc=class extends Ri{constructor(e,t=Vn,n=Oi,s,r,a=Yt,o=Yt,c,l=Yn){let h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,n,s,r,a,o,c,l),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},ta=class extends un{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},ei=class i extends vt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let c=[],l=[],h=[],u=[],d=0,f=0;m("z","y","x",-1,-1,n,t,e,a,r,0),m("z","y","x",1,-1,n,t,-e,a,r,1),m("x","z","y",1,1,e,n,t,s,a,2),m("x","z","y",1,-1,e,n,-t,s,a,3),m("x","y","z",1,-1,e,t,n,s,r,4),m("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new ot(l,3)),this.setAttribute("normal",new ot(h,3)),this.setAttribute("uv",new ot(u,2));function m(x,g,p,M,C,v,w,T,R,y,E){let P=v/R,N=w/y,F=v/2,B=w/2,D=T/2,V=R+1,X=y+1,z=0,K=0,q=new I;for(let Q=0;Q<X;Q++){let ee=Q*N-B;for(let Ue=0;Ue<V;Ue++){let Re=Ue*P-F;q[x]=Re*M,q[g]=ee*C,q[p]=D,l.push(q.x,q.y,q.z),q[x]=0,q[g]=0,q[p]=T>0?1:-1,h.push(q.x,q.y,q.z),u.push(Ue/R),u.push(1-Q/y),z+=1}}for(let Q=0;Q<y;Q++)for(let ee=0;ee<R;ee++){let Ue=d+ee+V*Q,Re=d+ee+V*(Q+1),ut=d+(ee+1)+V*(Q+1),st=d+(ee+1)+V*Q;c.push(Ue,Re,st),c.push(Re,ut,st),K+=6}o.addGroup(f,K,E),f+=K,d+=z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var na=class i extends vt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);let r=[],a=[],o=[],c=[],l=new I,h=new se;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){let f=n+u/t*s;l.x=e*Math.cos(f),l.y=e*Math.sin(f),a.push(l.x,l.y,l.z),o.push(0,0,1),h.x=(a[d]/e+1)/2,h.y=(a[d+1]/e+1)/2,c.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new ot(a,3)),this.setAttribute("normal",new ot(o,3)),this.setAttribute("uv",new ot(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.segments,e.thetaStart,e.thetaLength)}},Kt=class i extends vt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};let l=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],f=[],m=0,x=[],g=n/2,p=0;M(),a===!1&&(e>0&&C(!0),t>0&&C(!1)),this.setIndex(h),this.setAttribute("position",new ot(u,3)),this.setAttribute("normal",new ot(d,3)),this.setAttribute("uv",new ot(f,2));function M(){let v=new I,w=new I,T=0,R=(t-e)/n;for(let y=0;y<=r;y++){let E=[],P=y/r,N=P*(t-e)+e;for(let F=0;F<=s;F++){let B=F/s,D=B*c+o,V=Math.sin(D),X=Math.cos(D);w.x=N*V,w.y=-P*n+g,w.z=N*X,u.push(w.x,w.y,w.z),v.set(V,R,X).normalize(),d.push(v.x,v.y,v.z),f.push(B,1-P),E.push(m++)}x.push(E)}for(let y=0;y<s;y++)for(let E=0;E<r;E++){let P=x[E][y],N=x[E+1][y],F=x[E+1][y+1],B=x[E][y+1];(e>0||E!==0)&&(h.push(P,N,B),T+=3),(t>0||E!==r-1)&&(h.push(N,F,B),T+=3)}l.addGroup(p,T,0),p+=T}function C(v){let w=m,T=new se,R=new I,y=0,E=v===!0?e:t,P=v===!0?1:-1;for(let F=1;F<=s;F++)u.push(0,g*P,0),d.push(0,P,0),f.push(.5,.5),m++;let N=m;for(let F=0;F<=s;F++){let D=F/s*c+o,V=Math.cos(D),X=Math.sin(D);R.x=E*X,R.y=g*P,R.z=E*V,u.push(R.x,R.y,R.z),d.push(0,P,0),T.x=V*.5+.5,T.y=X*.5*P+.5,f.push(T.x,T.y),m++}for(let F=0;F<s;F++){let B=w+F,D=N+F;v===!0?h.push(D,D+1,B):h.push(D+1,D,B),y+=3}l.addGroup(p,y,v===!0?1:2),p+=y}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},ia=class i extends Kt{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}};var Mn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Xe("Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,a;t?a=t:a=e*n[r-1];let o=0,c=r-1,l;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),l=n[s]-a,l<0)o=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===a)return s/(r-1);let h=n[s],d=n[s+1]-h,f=(a-h)/d;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),c=t||(a.isVector2?new se:new I);return c.copy(o).sub(a).normalize(),c}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new I,s=[],r=[],a=[],o=new I,c=new dt;for(let f=0;f<=e;f++){let m=f/e;s[f]=this.getTangentAt(m,new I)}r[0]=new I,a[0]=new I;let l=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();let m=Math.acos(nt(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(o,m))}a[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(nt(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let m=1;m<=e;m++)r[m].applyMatrix4(c.makeRotationAxis(s[m],f*m)),a[m].crossVectors(s[m],r[m])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},js=class extends Mn{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new se){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+e*r,c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*h-f*u+this.aX,l=d*u+f*h+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},ic=class extends js{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function _u(){let i=0,e=0,t=0,n=0;function s(r,a,o,c){i=r,e=o,t=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){s(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,h,u){let d=(a-r)/l-(o-r)/(l+h)+(o-a)/h,f=(o-a)/h-(c-a)/(h+u)+(c-o)/u;d*=h,f*=h,s(a,o,d,f)},calc:function(r){let a=r*r,o=a*r;return i+e*r+t*a+n*o}}}var np=new I,ip=new I,zh=new _u,Bh=new _u,Vh=new _u,sc=class extends Mn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new I){let n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e,o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,h;this.closed||o>0?l=s[(o-1)%r]:(ip.subVectors(s[0],s[1]).add(s[0]),l=ip);let u=s[o%r],d=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(np.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=np),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,m=Math.pow(l.distanceToSquared(u),f),x=Math.pow(u.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(h),f);x<1e-4&&(x=1),m<1e-4&&(m=x),g<1e-4&&(g=x),zh.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,m,x,g),Bh.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,m,x,g),Vh.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,m,x,g)}else this.curveType==="catmullrom"&&(zh.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),Bh.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),Vh.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(zh.calc(c),Bh.calc(c),Vh.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new I().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function sp(i,e,t,n,s){let r=(n-e)*.5,a=(s-t)*.5,o=i*i,c=i*o;return(2*t-2*n+r+a)*c+(-3*t+3*n-2*r-a)*o+r*i+t}function Dg(i,e){let t=1-i;return t*t*e}function Ng(i,e){return 2*(1-i)*i*e}function Ug(i,e){return i*i*e}function Fr(i,e,t,n){return Dg(i,e)+Ng(i,t)+Ug(i,n)}function Og(i,e){let t=1-i;return t*t*t*e}function Fg(i,e){let t=1-i;return 3*t*t*i*e}function kg(i,e){return 3*(1-i)*i*i*e}function zg(i,e){return i*i*i*e}function kr(i,e,t,n,s){return Og(i,e)+Fg(i,t)+kg(i,n)+zg(i,s)}var sa=class extends Mn{constructor(e=new se,t=new se,n=new se,s=new se){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new se){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(kr(e,s.x,r.x,a.x,o.x),kr(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},rc=class extends Mn{constructor(e=new I,t=new I,n=new I,s=new I){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new I){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(kr(e,s.x,r.x,a.x,o.x),kr(e,s.y,r.y,a.y,o.y),kr(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},ra=class extends Mn{constructor(e=new se,t=new se){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new se){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new se){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ac=class extends Mn{constructor(e=new I,t=new I){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new I){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new I){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},aa=class extends Mn{constructor(e=new se,t=new se,n=new se){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new se){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(Fr(e,s.x,r.x,a.x),Fr(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},oc=class extends Mn{constructor(e=new I,t=new I,n=new I){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new I){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(Fr(e,s.x,r.x,a.x),Fr(e,s.y,r.y,a.y),Fr(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},oa=class extends Mn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new se){let n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],l=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(sp(o,c.x,l.x,h.x,u.x),sp(o,c.y,l.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new se().fromArray(s))}return this}},Zh=Object.freeze({__proto__:null,ArcCurve:ic,CatmullRomCurve3:sc,CubicBezierCurve:sa,CubicBezierCurve3:rc,EllipseCurve:js,LineCurve:ra,LineCurve3:ac,QuadraticBezierCurve:aa,QuadraticBezierCurve3:oc,SplineCurve:oa}),cc=class extends Mn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Zh[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let a=s[r]-n,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,c=a.getPoints(o);for(let l=0;l<c.length;l++){let h=c[l];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new Zh[s.type]().fromJSON(s))}return this}},ss=class extends cc{constructor(e){super(),this.type="Path",this.currentPoint=new se,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new ra(this.currentPoint.clone(),new se(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new aa(this.currentPoint.clone(),new se(e,t),new se(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){let o=new sa(this.currentPoint.clone(),new se(e,t),new se(n,s),new se(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new oa(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){let o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+o,t+c,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,c){let l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+l,t+h,n,s,r,a,o,c),this}absellipse(e,t,n,s,r,a,o,c){let l=new js(e,t,n,s,r,a,o,c);if(this.curves.length>0){let u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);let h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},Qs=class extends ss{constructor(e){super(e),this.uuid=di(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new ss().fromJSON(s))}return this}};function Bg(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=tm(i,0,s,t,!0),a=[];if(!r||r.next===r.prev)return a;let o,c,l;if(n&&(r=Xg(i,e,r,t)),i.length>80*t){o=i[0],c=i[1];let h=o,u=c;for(let d=t;d<s;d+=t){let f=i[d],m=i[d+1];f<o&&(o=f),m<c&&(c=m),f>h&&(h=f),m>u&&(u=m)}l=Math.max(h-o,u-c),l=l!==0?32767/l:0}return ca(r,a,t,o,c,l,0),a}function tm(i,e,t,n,s){let r;if(s===nx(i,e,t,n)>0)for(let a=e;a<t;a+=n)r=rp(a/n|0,i[a],i[a+1],r);else for(let a=t-n;a>=e;a-=n)r=rp(a/n|0,i[a],i[a+1],r);return r&&er(r,r.next)&&(ha(r),r=r.next),r}function rs(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(er(t,t.next)||Dt(t.prev,t,t.next)===0)){if(ha(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function ca(i,e,t,n,s,r,a){if(!i)return;!a&&r&&Jg(i,n,s,r);let o=i;for(;i.prev!==i.next;){let c=i.prev,l=i.next;if(r?Hg(i,n,s,r):Vg(i)){e.push(c.i,i.i,l.i),ha(i),i=l.next,o=l.next;continue}if(i=l,i===o){a?a===1?(i=Gg(rs(i),e),ca(i,e,t,n,s,r,2)):a===2&&Wg(i,e,t,n,s,r):ca(rs(i),e,t,n,s,r,1);break}}}function Vg(i){let e=i.prev,t=i,n=i.next;if(Dt(e,t,n)>=0)return!1;let s=e.x,r=t.x,a=n.x,o=e.y,c=t.y,l=n.y,h=Math.min(s,r,a),u=Math.min(o,c,l),d=Math.max(s,r,a),f=Math.max(o,c,l),m=n.next;for(;m!==e;){if(m.x>=h&&m.x<=d&&m.y>=u&&m.y<=f&&Or(s,o,r,c,a,l,m.x,m.y)&&Dt(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Hg(i,e,t,n){let s=i.prev,r=i,a=i.next;if(Dt(s,r,a)>=0)return!1;let o=s.x,c=r.x,l=a.x,h=s.y,u=r.y,d=a.y,f=Math.min(o,c,l),m=Math.min(h,u,d),x=Math.max(o,c,l),g=Math.max(h,u,d),p=Jh(f,m,e,t,n),M=Jh(x,g,e,t,n),C=i.prevZ,v=i.nextZ;for(;C&&C.z>=p&&v&&v.z<=M;){if(C.x>=f&&C.x<=x&&C.y>=m&&C.y<=g&&C!==s&&C!==a&&Or(o,h,c,u,l,d,C.x,C.y)&&Dt(C.prev,C,C.next)>=0||(C=C.prevZ,v.x>=f&&v.x<=x&&v.y>=m&&v.y<=g&&v!==s&&v!==a&&Or(o,h,c,u,l,d,v.x,v.y)&&Dt(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;C&&C.z>=p;){if(C.x>=f&&C.x<=x&&C.y>=m&&C.y<=g&&C!==s&&C!==a&&Or(o,h,c,u,l,d,C.x,C.y)&&Dt(C.prev,C,C.next)>=0)return!1;C=C.prevZ}for(;v&&v.z<=M;){if(v.x>=f&&v.x<=x&&v.y>=m&&v.y<=g&&v!==s&&v!==a&&Or(o,h,c,u,l,d,v.x,v.y)&&Dt(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function Gg(i,e){let t=i;do{let n=t.prev,s=t.next.next;!er(n,s)&&im(n,t,t.next,s)&&la(n,s)&&la(s,n)&&(e.push(n.i,t.i,s.i),ha(t),ha(t.next),t=i=s),t=t.next}while(t!==i);return rs(t)}function Wg(i,e,t,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Qg(a,o)){let c=sm(a,o);a=rs(a,a.next),c=rs(c,c.next),ca(a,e,t,n,s,r,0),ca(c,e,t,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function Xg(i,e,t,n){let s=[];for(let r=0,a=e.length;r<a;r++){let o=e[r]*n,c=r<a-1?e[r+1]*n:i.length,l=tm(i,o,c,n,!1);l===l.next&&(l.steiner=!0),s.push(jg(l))}s.sort(qg);for(let r=0;r<s.length;r++)t=Yg(s[r],t);return t}function qg(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function Yg(i,e){let t=$g(i,e);if(!t)return e;let n=sm(t,i);return rs(n,n.next),rs(t,t.next)}function $g(i,e){let t=e,n=i.x,s=i.y,r=-1/0,a;if(er(i,t))return t;do{if(er(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,a=t.x<t.next.x?t:t.next,u===n))return a}t=t.next}while(t!==e);if(!a)return null;let o=a,c=a.x,l=a.y,h=1/0;t=a;do{if(n>=t.x&&t.x>=c&&n!==t.x&&nm(s<l?n:r,s,c,l,s<l?r:n,s,t.x,t.y)){let u=Math.abs(s-t.y)/(n-t.x);la(t,i)&&(u<h||u===h&&(t.x>a.x||t.x===a.x&&Zg(a,t)))&&(a=t,h=u)}t=t.next}while(t!==o);return a}function Zg(i,e){return Dt(i.prev,i,e.prev)<0&&Dt(e.next,i,i.next)<0}function Jg(i,e,t,n){let s=i;do s.z===0&&(s.z=Jh(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Kg(s)}function Kg(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let l=0;l<t&&(o++,a=a.nextZ,!!a);l++);let c=t;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,t*=2}while(e>1);return i}function Jh(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function jg(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function nm(i,e,t,n,s,r,a,o){return(s-a)*(e-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(n-o)}function Or(i,e,t,n,s,r,a,o){return!(i===a&&e===o)&&nm(i,e,t,n,s,r,a,o)}function Qg(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!ex(i,e)&&(la(i,e)&&la(e,i)&&tx(i,e)&&(Dt(i.prev,i,e.prev)||Dt(i,e.prev,e))||er(i,e)&&Dt(i.prev,i,i.next)>0&&Dt(e.prev,e,e.next)>0)}function Dt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function er(i,e){return i.x===e.x&&i.y===e.y}function im(i,e,t,n){let s=No(Dt(i,e,t)),r=No(Dt(i,e,n)),a=No(Dt(t,n,i)),o=No(Dt(t,n,e));return!!(s!==r&&a!==o||s===0&&Do(i,t,e)||r===0&&Do(i,n,e)||a===0&&Do(t,i,n)||o===0&&Do(t,e,n))}function Do(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function No(i){return i>0?1:i<0?-1:0}function ex(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&im(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function la(i,e){return Dt(i.prev,i,i.next)<0?Dt(i,e,i.next)>=0&&Dt(i,i.prev,e)>=0:Dt(i,e,i.prev)<0||Dt(i,i.next,e)<0}function tx(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function sm(i,e){let t=Kh(i.i,i.x,i.y),n=Kh(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function rp(i,e,t,n){let s=Kh(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function ha(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Kh(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function nx(i,e,t,n){let s=0;for(let r=e,a=t-n;r<t;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}var jh=class{static triangulate(e,t,n=2){return Bg(e,t,n)}},Qi=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];ap(e),op(n,e);let a=e.length;t.forEach(ap);for(let c=0;c<t.length;c++)s.push(a),a+=t[c].length,op(n,t[c]);let o=jh.triangulate(n,s);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}};function ap(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function op(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var ua=class i extends vt{constructor(e=new Qs([new se(.5,.5),new se(-.5,.5),new se(-.5,-.5),new se(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,s=[],r=[];for(let o=0,c=e.length;o<c;o++){let l=e[o];a(l)}this.setAttribute("position",new ot(s,3)),this.setAttribute("uv",new ot(r,2)),this.computeVertexNormals();function a(o){let c=[],l=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,m=t.bevelSize!==void 0?t.bevelSize:f-.1,x=t.bevelOffset!==void 0?t.bevelOffset:0,g=t.bevelSegments!==void 0?t.bevelSegments:3,p=t.extrudePath,M=t.UVGenerator!==void 0?t.UVGenerator:ix,C,v=!1,w,T,R,y;if(p){C=p.getSpacedPoints(h),v=!0,d=!1;let ie=p.isCatmullRomCurve3?p.closed:!1;w=p.computeFrenetFrames(h,ie),T=new I,R=new I,y=new I}d||(g=0,f=0,m=0,x=0);let E=o.extractPoints(l),P=E.shape,N=E.holes;if(!Qi.isClockWise(P)){P=P.reverse();for(let ie=0,ae=N.length;ie<ae;ie++){let ce=N[ie];Qi.isClockWise(ce)&&(N[ie]=ce.reverse())}}function B(ie){let ce=10000000000000001e-36,le=ie[0];for(let de=1;de<=ie.length;de++){let He=de%ie.length,Be=ie[He],$e=Be.x-le.x,Ke=Be.y-le.y,L=$e*$e+Ke*Ke,ft=Math.max(Math.abs(Be.x),Math.abs(Be.y),Math.abs(le.x),Math.abs(le.y)),rt=ce*ft*ft;if(L<=rt){ie.splice(He,1),de--;continue}le=Be}}B(P),N.forEach(B);let D=N.length,V=P;for(let ie=0;ie<D;ie++){let ae=N[ie];P=P.concat(ae)}function X(ie,ae,ce){return ae||We("ExtrudeGeometry: vec does not exist"),ie.clone().addScaledVector(ae,ce)}let z=P.length;function K(ie,ae,ce){let le,de,He,Be=ie.x-ae.x,$e=ie.y-ae.y,Ke=ce.x-ie.x,L=ce.y-ie.y,ft=Be*Be+$e*$e,rt=Be*L-$e*Ke;if(Math.abs(rt)>Number.EPSILON){let A=Math.sqrt(ft),_=Math.sqrt(Ke*Ke+L*L),k=ae.x-$e/A,W=ae.y+Be/A,$=ce.x-L/_,he=ce.y+Ke/_,ue=(($-k)*L-(he-W)*Ke)/(Be*L-$e*Ke);le=k+Be*ue-ie.x,de=W+$e*ue-ie.y;let Z=le*le+de*de;if(Z<=2)return new se(le,de);He=Math.sqrt(Z/2)}else{let A=!1;Be>Number.EPSILON?Ke>Number.EPSILON&&(A=!0):Be<-Number.EPSILON?Ke<-Number.EPSILON&&(A=!0):Math.sign($e)===Math.sign(L)&&(A=!0),A?(le=-$e,de=Be,He=Math.sqrt(ft)):(le=Be,de=$e,He=Math.sqrt(ft/2))}return new se(le/He,de/He)}let q=[];for(let ie=0,ae=V.length,ce=ae-1,le=ie+1;ie<ae;ie++,ce++,le++)ce===ae&&(ce=0),le===ae&&(le=0),q[ie]=K(V[ie],V[ce],V[le]);let Q=[],ee,Ue=q.concat();for(let ie=0,ae=D;ie<ae;ie++){let ce=N[ie];ee=[];for(let le=0,de=ce.length,He=de-1,Be=le+1;le<de;le++,He++,Be++)He===de&&(He=0),Be===de&&(Be=0),ee[le]=K(ce[le],ce[He],ce[Be]);Q.push(ee),Ue=Ue.concat(ee)}let Re;if(g===0)Re=Qi.triangulateShape(V,N);else{let ie=[],ae=[];for(let ce=0;ce<g;ce++){let le=ce/g,de=f*Math.cos(le*Math.PI/2),He=m*Math.sin(le*Math.PI/2)+x;for(let Be=0,$e=V.length;Be<$e;Be++){let Ke=X(V[Be],q[Be],He);ye(Ke.x,Ke.y,-de),le===0&&ie.push(Ke)}for(let Be=0,$e=D;Be<$e;Be++){let Ke=N[Be];ee=Q[Be];let L=[];for(let ft=0,rt=Ke.length;ft<rt;ft++){let A=X(Ke[ft],ee[ft],He);ye(A.x,A.y,-de),le===0&&L.push(A)}le===0&&ae.push(L)}}Re=Qi.triangulateShape(ie,ae)}let ut=Re.length,st=m+x;for(let ie=0;ie<z;ie++){let ae=d?X(P[ie],Ue[ie],st):P[ie];v?(R.copy(w.normals[0]).multiplyScalar(ae.x),T.copy(w.binormals[0]).multiplyScalar(ae.y),y.copy(C[0]).add(R).add(T),ye(y.x,y.y,y.z)):ye(ae.x,ae.y,0)}for(let ie=1;ie<=h;ie++)for(let ae=0;ae<z;ae++){let ce=d?X(P[ae],Ue[ae],st):P[ae];v?(R.copy(w.normals[ie]).multiplyScalar(ce.x),T.copy(w.binormals[ie]).multiplyScalar(ce.y),y.copy(C[ie]).add(R).add(T),ye(y.x,y.y,y.z)):ye(ce.x,ce.y,u/h*ie)}for(let ie=g-1;ie>=0;ie--){let ae=ie/g,ce=f*Math.cos(ae*Math.PI/2),le=m*Math.sin(ae*Math.PI/2)+x;for(let de=0,He=V.length;de<He;de++){let Be=X(V[de],q[de],le);ye(Be.x,Be.y,u+ce)}for(let de=0,He=N.length;de<He;de++){let Be=N[de];ee=Q[de];for(let $e=0,Ke=Be.length;$e<Ke;$e++){let L=X(Be[$e],ee[$e],le);v?ye(L.x,L.y+C[h-1].y,C[h-1].x+ce):ye(L.x,L.y,u+ce)}}}ct(),J();function ct(){let ie=s.length/3;if(d){let ae=0,ce=z*ae;for(let le=0;le<ut;le++){let de=Re[le];qe(de[2]+ce,de[1]+ce,de[0]+ce)}ae=h+g*2,ce=z*ae;for(let le=0;le<ut;le++){let de=Re[le];qe(de[0]+ce,de[1]+ce,de[2]+ce)}}else{for(let ae=0;ae<ut;ae++){let ce=Re[ae];qe(ce[2],ce[1],ce[0])}for(let ae=0;ae<ut;ae++){let ce=Re[ae];qe(ce[0]+z*h,ce[1]+z*h,ce[2]+z*h)}}n.addGroup(ie,s.length/3-ie,0)}function J(){let ie=s.length/3,ae=0;ne(V,ae),ae+=V.length;for(let ce=0,le=N.length;ce<le;ce++){let de=N[ce];ne(de,ae),ae+=de.length}n.addGroup(ie,s.length/3-ie,1)}function ne(ie,ae){let ce=ie.length;for(;--ce>=0;){let le=ce,de=ce-1;de<0&&(de=ie.length-1);for(let He=0,Be=h+g*2;He<Be;He++){let $e=z*He,Ke=z*(He+1),L=ae+le+$e,ft=ae+de+$e,rt=ae+de+Ke,A=ae+le+Ke;Se(L,ft,rt,A)}}}function ye(ie,ae,ce){c.push(ie),c.push(ae),c.push(ce)}function qe(ie,ae,ce){Ye(ie),Ye(ae),Ye(ce);let le=s.length/3,de=M.generateTopUV(n,s,le-3,le-2,le-1);xt(de[0]),xt(de[1]),xt(de[2])}function Se(ie,ae,ce,le){Ye(ie),Ye(ae),Ye(le),Ye(ae),Ye(ce),Ye(le);let de=s.length/3,He=M.generateSideWallUV(n,s,de-6,de-3,de-2,de-1);xt(He[0]),xt(He[1]),xt(He[3]),xt(He[1]),xt(He[2]),xt(He[3])}function Ye(ie){s.push(c[ie*3+0]),s.push(c[ie*3+1]),s.push(c[ie*3+2])}function xt(ie){r.push(ie.x),r.push(ie.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return sx(t,n,e)}static fromJSON(e,t){let n=[];for(let r=0,a=e.shapes.length;r<a;r++){let o=t[e.shapes[r]];n.push(o)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new Zh[s.type]().fromJSON(s)),new i(n,e.options)}},ix={generateTopUV:function(i,e,t,n,s){let r=e[t*3],a=e[t*3+1],o=e[n*3],c=e[n*3+1],l=e[s*3],h=e[s*3+1];return[new se(r,a),new se(o,c),new se(l,h)]},generateSideWallUV:function(i,e,t,n,s,r){let a=e[t*3],o=e[t*3+1],c=e[t*3+2],l=e[n*3],h=e[n*3+1],u=e[n*3+2],d=e[s*3],f=e[s*3+1],m=e[s*3+2],x=e[r*3],g=e[r*3+1],p=e[r*3+2];return Math.abs(o-h)<Math.abs(a-l)?[new se(a,1-c),new se(l,1-u),new se(d,1-m),new se(x,1-p)]:[new se(o,1-c),new se(h,1-u),new se(f,1-m),new se(g,1-p)]}};function sx(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var da=class i extends vt{constructor(e=[new se(0,-.5),new se(.5,0),new se(0,.5)],t=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:s},t=Math.floor(t),s=nt(s,0,Math.PI*2);let r=[],a=[],o=[],c=[],l=[],h=1/t,u=new I,d=new se,f=new I,m=new I,x=new I,g=0,p=0;for(let M=0;M<=e.length-1;M++)switch(M){case 0:g=e[M+1].x-e[M].x,p=e[M+1].y-e[M].y,f.x=p*1,f.y=-g,f.z=p*0,x.copy(f),f.normalize(),c.push(f.x,f.y,f.z);break;case e.length-1:c.push(x.x,x.y,x.z);break;default:g=e[M+1].x-e[M].x,p=e[M+1].y-e[M].y,f.x=p*1,f.y=-g,f.z=p*0,m.copy(f),f.x+=x.x,f.y+=x.y,f.z+=x.z,f.normalize(),c.push(f.x,f.y,f.z),x.copy(m)}for(let M=0;M<=t;M++){let C=n+M*h*s,v=Math.sin(C),w=Math.cos(C);for(let T=0;T<=e.length-1;T++){u.x=e[T].x*v,u.y=e[T].y,u.z=e[T].x*w,a.push(u.x,u.y,u.z),d.x=M/t,d.y=T/(e.length-1),o.push(d.x,d.y);let R=c[3*T+0]*v,y=c[3*T+1],E=c[3*T+0]*w;l.push(R,y,E)}}for(let M=0;M<t;M++)for(let C=0;C<e.length-1;C++){let v=C+M*e.length,w=v,T=v+e.length,R=v+e.length+1,y=v+1;r.push(w,T,y),r.push(R,y,T)}this.setIndex(r),this.setAttribute("position",new ot(a,3)),this.setAttribute("uv",new ot(o,2)),this.setAttribute("normal",new ot(l,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.points,e.segments,e.phiStart,e.phiLength)}};var mi=class i extends vt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(n),c=Math.floor(s),l=o+1,h=c+1,u=e/o,d=t/c,f=[],m=[],x=[],g=[];for(let p=0;p<h;p++){let M=p*d-a;for(let C=0;C<l;C++){let v=C*u-r;m.push(v,-M,0),x.push(0,0,1),g.push(C/o),g.push(1-p/c)}}for(let p=0;p<c;p++)for(let M=0;M<o;M++){let C=M+l*p,v=M+l*(p+1),w=M+1+l*(p+1),T=M+1+l*p;f.push(C,v,T),f.push(v,w,T)}this.setIndex(f),this.setAttribute("position",new ot(m,3)),this.setAttribute("normal",new ot(x,3)),this.setAttribute("uv",new ot(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},Pi=class i extends vt{constructor(e=.5,t=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);let o=[],c=[],l=[],h=[],u=e,d=(t-e)/s,f=new I,m=new se;for(let x=0;x<=s;x++){for(let g=0;g<=n;g++){let p=r+g/n*a;f.x=u*Math.cos(p),f.y=u*Math.sin(p),c.push(f.x,f.y,f.z),l.push(0,0,1),m.x=(f.x/t+1)/2,m.y=(f.y/t+1)/2,h.push(m.x,m.y)}u+=d}for(let x=0;x<s;x++){let g=x*(n+1);for(let p=0;p<n;p++){let M=p+g,C=M,v=M+n+1,w=M+n+2,T=M+1;o.push(C,v,T),o.push(v,w,T)}}this.setIndex(o),this.setAttribute("position",new ot(c,3)),this.setAttribute("normal",new ot(l,3)),this.setAttribute("uv",new ot(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}};var as=class i extends vt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let c=Math.min(a+o,Math.PI),l=0,h=[],u=new I,d=new I,f=[],m=[],x=[],g=[];for(let p=0;p<=n;p++){let M=[],C=p/n,v=a+C*o,w=e*Math.cos(v),T=Math.sqrt(e*e-w*w),R=0;p===0&&a===0?R=.5/t:p===n&&c===Math.PI&&(R=-.5/t);for(let y=0;y<=t;y++){let E=y/t,P=s+E*r;u.x=-T*Math.cos(P),u.y=w,u.z=T*Math.sin(P),m.push(u.x,u.y,u.z),d.copy(u).normalize(),x.push(d.x,d.y,d.z),g.push(E+R,1-C),M.push(l++)}h.push(M)}for(let p=0;p<n;p++)for(let M=0;M<t;M++){let C=h[p][M+1],v=h[p][M],w=h[p+1][M],T=h[p+1][M+1];(p!==0||a>0)&&f.push(C,v,T),(p!==n-1||c<Math.PI)&&f.push(v,w,T)}this.setIndex(f),this.setAttribute("position",new ot(m,3)),this.setAttribute("normal",new ot(x,3)),this.setAttribute("uv",new ot(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var os=class i extends vt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),s=Math.floor(s);let c=[],l=[],h=[],u=[],d=new I,f=new I,m=new I;for(let x=0;x<=n;x++){let g=a+x/n*o;for(let p=0;p<=s;p++){let M=p/s*r;f.x=(e+t*Math.cos(g))*Math.cos(M),f.y=(e+t*Math.cos(g))*Math.sin(M),f.z=t*Math.sin(g),l.push(f.x,f.y,f.z),d.x=e*Math.cos(M),d.y=e*Math.sin(M),m.subVectors(f,d).normalize(),h.push(m.x,m.y,m.z),u.push(p/s),u.push(x/n)}}for(let x=1;x<=n;x++)for(let g=1;g<=s;g++){let p=(s+1)*x+g-1,M=(s+1)*(x-1)+g-1,C=(s+1)*(x-1)+g,v=(s+1)*x+g;c.push(p,M,v),c.push(M,C,v)}this.setIndex(c),this.setAttribute("position",new ot(l,3)),this.setAttribute("normal",new ot(h,3)),this.setAttribute("uv",new ot(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}};function fs(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];if(cp(s))s.isRenderTargetTexture?(Xe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(cp(s[0])){let r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function rn(i){let e={};for(let t=0;t<i.length;t++){let n=fs(i[t]);for(let s in n)e[s]=n[s]}return e}function cp(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function rx(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function yu(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:it.workingColorSpace}var _i={clone:fs,merge:rn},ax=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ox=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Ct=class extends Cn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ax,this.fragmentShader=ox,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=fs(e.uniforms),this.uniformsGroups=rx(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new Te().setHex(s.value);break;case"v2":this.uniforms[n].value=new se().fromArray(s.value);break;case"v3":this.uniforms[n].value=new I().fromArray(s.value);break;case"v4":this.uniforms[n].value=new Pt().fromArray(s.value);break;case"m3":this.uniforms[n].value=new Je().fromArray(s.value);break;case"m4":this.uniforms[n].value=new dt().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},tr=class extends Ct{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},bn=class extends Cn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Te(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Te(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ua,this.normalScale=new se(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Jn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},nr=class extends bn{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new se(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return nt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Te(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Te(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Te(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var fa=class extends Cn{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Te(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Te(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ua,this.normalScale=new se(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Jn,this.combine=Tc,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},lc=class extends Cn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Bp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},hc=class extends Cn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};var pa=class extends jr{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}};function Bs(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Hh(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}var Ii=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},uc=class extends Ii{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Xh,endingEnd:Xh}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],c=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case qh:r=e,o=2*t-n;break;case Yh:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(c===void 0)switch(this.getSettings_().endingEnd){case qh:a=e,c=2*n-t;break;case Yh:a=1,c=n+s[1]-s[0];break;default:a=e-1,c=t}let l=(n-t)*.5,h=this.valueSize;this._weightPrev=l/(t-o),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,m=(n-t)/(s-t),x=m*m,g=x*m,p=-d*g+2*d*x-d*m,M=(1+d)*g+(-1.5-2*d)*x+(-.5+d)*m+1,C=(-1-f)*g+(1.5+f)*x+.5*m,v=f*g-f*x;for(let w=0;w!==o;++w)r[w]=p*a[h+w]+M*a[l+w]+C*a[c+w]+v*a[u+w];return r}},dc=class extends Ii{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=(n-t)/(s-t),u=1-h;for(let d=0;d!==o;++d)r[d]=a[l+d]*u+a[c+d]*h;return r}},fc=class extends Ii{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},pc=class extends Ii{interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=this.inTangents,u=this.outTangents;if(!h||!u){let m=(n-t)/(s-t),x=1-m;for(let g=0;g!==o;++g)r[g]=a[l+g]*x+a[c+g]*m;return r}let d=o*2,f=e-1;for(let m=0;m!==o;++m){let x=a[l+m],g=a[c+m],p=f*d+m*2,M=u[p],C=u[p+1],v=e*d+m*2,w=h[v],T=h[v+1],R=lx(n,t,M,w,s);r[m]=rm(R,x,C,T,g)}return r}};function rm(i,e,t,n,s){let r=1-i;return r*r*r*e+3*r*r*i*t+3*r*i*i*n+i*i*i*s}function cx(i,e,t,n,s){let r=1-i;return 3*r*r*(t-e)+6*r*i*(n-t)+3*i*i*(s-n)}function lx(i,e,t,n,s){let r=(i-e)/(s-e);for(let a=0;a<8;a++){let o=rm(r,e,t,n,s)-i;if(Math.abs(o)<1e-10)break;let c=cx(r,e,t,n,s);if(Math.abs(c)<1e-10)break;r=Math.max(0,Math.min(1,r-o/c))}return r}var Sn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Bs(t,this.TimeBufferType),this.values=Bs(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Bs(e.times,Array),values:Bs(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s),Hh(e.settings)&&(n.settings={inTangents:Bs(e.settings.inTangents,Array),outTangents:Bs(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new fc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new dc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new uc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new pc(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case zr:t=this.InterpolantFactoryMethodDiscrete;break;case $o:t=this.InterpolantFactoryMethodLinear;break;case Fo:t=this.InterpolantFactoryMethodSmooth;break;case Wh:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Xe("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return zr;case this.InterpolantFactoryMethodLinear:return $o;case this.InterpolantFactoryMethodSmooth:return Fo;case this.InterpolantFactoryMethodBezier:return Wh}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e;Hh(this.settings)&&(lp(this.settings.inTangents,e),lp(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(We("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(We("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let c=n[o];if(typeof c=="number"&&isNaN(c)){We("KeyframeTrack: Time is not a valid number.",this,o,c),e=!1;break}if(a!==null&&a>c){We("KeyframeTrack: Out of order keys.",this,o,c,a),e=!1;break}a=c}if(s!==void 0&&dg(s))for(let o=0,c=s.length;o!==c;++o){let l=s[o];if(isNaN(l)){We("KeyframeTrack: Value is not a valid number.",this,o,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Fo,r=e.length-1,a=1;for(let o=1;o<r;++o){let c=!1,l=e[o],h=e[o+1];if(l!==h&&(o!==1||l!==e[0]))if(s)c=!0;else{let u=o*n,d=u-n,f=u+n;for(let m=0;m!==n;++m){let x=t[u+m];if(x!==t[d+m]||x!==t[f+m]){c=!0;break}}}if(c){if(o!==a){e[a]=e[o];let u=o*n,d=a*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,c=a*n,l=0;l!==n;++l)t[c+l]=t[o+l];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,Hh(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function lp(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]*=e}Sn.prototype.ValueTypeName="";Sn.prototype.TimeBufferType=Float32Array;Sn.prototype.ValueBufferType=Float32Array;Sn.prototype.DefaultInterpolation=$o;var Li=class extends Sn{constructor(e,t,n){super(e,t,n)}};Li.prototype.ValueTypeName="bool";Li.prototype.ValueBufferType=Array;Li.prototype.DefaultInterpolation=zr;Li.prototype.InterpolantFactoryMethodLinear=void 0;Li.prototype.InterpolantFactoryMethodSmooth=void 0;var mc=class extends Sn{constructor(e,t,n,s){super(e,t,n,s)}};mc.prototype.ValueTypeName="color";var gc=class extends Sn{constructor(e,t,n,s){super(e,t,n,s)}};gc.prototype.ValueTypeName="number";var xc=class extends Ii{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(n-t)/(s-t),l=e*o;for(let h=l+o;l!==h;l+=4)Zn.slerpFlat(r,0,a,l-o,a,l,c);return r}},ma=class extends Sn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new xc(this.times,this.values,this.getValueSize(),e)}};ma.prototype.ValueTypeName="quaternion";ma.prototype.InterpolantFactoryMethodSmooth=void 0;var Di=class extends Sn{constructor(e,t,n){super(e,t,n)}};Di.prototype.ValueTypeName="string";Di.prototype.ValueBufferType=Array;Di.prototype.DefaultInterpolation=zr;Di.prototype.InterpolantFactoryMethodLinear=void 0;Di.prototype.InterpolantFactoryMethodSmooth=void 0;var _c=class extends Sn{constructor(e,t,n,s){super(e,t,n,s)}};_c.prototype.ValueTypeName="vector";var yc=class{constructor(e,t,n){let s=this,r=!1,a=0,o=0,c,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){let u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=l.length;u<d;u+=2){let f=l[u],m=l[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},am=new yc,vc=class{constructor(e){this.manager=e!==void 0?e:am,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};vc.DEFAULT_MATERIAL_NAME="__DEFAULT";var ir=class extends Ot{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Te(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},ga=class extends ir{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ot.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Te(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Gh=new dt,hp=new I,up=new I,xa=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new se(512,512),this.mapType=pn,this.map=null,this.mapPass=null,this.matrix=new dt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Js,this._frameExtents=new se(1,1),this._viewportCount=1,this._viewports=[new Pt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;hp.setFromMatrixPosition(e.matrixWorld),t.position.copy(hp),up.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(up),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,s){Gh.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Gh,e.coordinateSystem,e.reversedDepth);let r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,c=s?s.x/r.x:0,l=s?s.y/r.y:0;e.coordinateSystem===Xs||e.reversedDepth?t.set(.5*a,0,0,.5*a+c,0,.5*o,0,.5*o+l,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+c,0,.5*o,0,.5*o+l,0,0,.5,.5,0,0,0,1),t.multiply(Gh)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Uo=new I,Oo=new Zn,Wn=new I,_a=class extends Ot{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new dt,this.projectionMatrix=new dt,this.projectionMatrixInverse=new dt,this.coordinateSystem=zn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Uo,Oo,Wn),Wn.x===1&&Wn.y===1&&Wn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Uo,Oo,Wn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Uo,Oo,Wn),Wn.x===1&&Wn.y===1&&Wn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Uo,Oo,Wn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Ai=new I,dp=new se,fp=new se,Zt=class extends _a{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Zo*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(gh*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Zo*2*Math.atan(Math.tan(gh*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ai.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ai.x,Ai.y).multiplyScalar(-e/Ai.z),Ai.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ai.x,Ai.y).multiplyScalar(-e/Ai.z)}getViewSize(e,t){return this.getViewBounds(e,dp,fp),t.subVectors(fp,dp)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(gh*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}};var Qh=class extends xa{constructor(){super(new Zt(90,1,.5,500)),this.isPointLightShadow=!0}},gi=class extends ir{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Qh}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},Ni=class extends _a{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,a=n+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},eu=class extends xa{constructor(){super(new Ni(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},sr=class extends ir{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ot.DEFAULT_UP),this.updateMatrix(),this.target=new Ot,this.shadow=new eu}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}};var Vs=-90,Hs=1,Mc=class extends Ot{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Zt(Vs,Hs,e,t);s.layers=this.layers,this.add(s);let r=new Zt(Vs,Hs,e,t);r.layers=this.layers,this.add(r);let a=new Zt(Vs,Hs,e,t);a.layers=this.layers,this.add(a);let o=new Zt(Vs,Hs,e,t);o.layers=this.layers,this.add(o);let c=new Zt(Vs,Hs,e,t);c.layers=this.layers,this.add(c);let l=new Zt(Vs,Hs,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,c]=t;for(let l of t)this.remove(l);if(e===zn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Xs)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,c,l,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(n,4,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},bc=class extends Zt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},ya=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=hx.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function hx(){this._document.hidden===!1&&this.reset()}var vu="\\[\\]\\.:\\/",ux=new RegExp("["+vu+"]","g"),Mu="[^"+vu+"]",dx="[^"+vu.replace("\\.","")+"]",fx=/((?:WC+[\/:])*)/.source.replace("WC",Mu),px=/(WCOD+)?/.source.replace("WCOD",dx),mx=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Mu),gx=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Mu),xx=new RegExp("^"+fx+px+mx+gx+"$"),_x=["material","materials","bones","map"],tu=class{constructor(e,t,n){let s=n||Et.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Et=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(ux,"")}static parseTrackName(e){let t=xx.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);_x.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let c=n(o.children);if(c)return c}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Xe("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){We("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){We("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){We("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===l){l=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){We("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){We("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){We("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){We("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}let a=e[s];if(a===void 0){let l=t.nodeName;We("PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){We("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){We("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Et.Composite=tu;Et.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Et.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Et.prototype.GetterByBindingType=[Et.prototype._getValue_direct,Et.prototype._getValue_array,Et.prototype._getValue_arrayElement,Et.prototype._getValue_toArray];Et.prototype.SetterByBindingTypeAndVersioning=[[Et.prototype._setValue_direct,Et.prototype._setValue_direct_setNeedsUpdate,Et.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Et.prototype._setValue_array,Et.prototype._setValue_array_setNeedsUpdate,Et.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Et.prototype._setValue_arrayElement,Et.prototype._setValue_arrayElement_setNeedsUpdate,Et.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Et.prototype._setValue_fromArray,Et.prototype._setValue_fromArray_setNeedsUpdate,Et.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var tS=new Float32Array(1);var pp=new dt,va=class{constructor(e,t,n=0,s=1/0){this.ray=new ns(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new $s,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):We("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return pp.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(pp),this}intersectObject(e,t=!0,n=[]){return nu(e,this,n,t),n.sort(mp),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)nu(e[s],this,n,t);return n.sort(mp),n}};function mp(i,e){return i.distance-e.distance}function nu(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let a=0,o=r.length;a<o;a++)nu(r[a],e,t,!0)}}var Au=class Au{constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}};Au.prototype.isMatrix2=!0;var iu=Au;function bu(i,e,t,n){let s=yx(n);switch(t){case pu:return i*e;case Ic:return i*e/s.components*s.byteLength;case Lc:return i*e/s.components*s.byteLength;case zi:return i*e*2/s.components*s.byteLength;case Dc:return i*e*2/s.components*s.byteLength;case mu:return i*e*3/s.components*s.byteLength;case In:return i*e*4/s.components*s.byteLength;case Nc:return i*e*4/s.components*s.byteLength;case Ra:case Pa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Ia:case La:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Oc:case kc:return Math.max(i,16)*Math.max(e,8)/4;case Uc:case Fc:return Math.max(i,8)*Math.max(e,8)/2;case zc:case Bc:case Hc:case Gc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Vc:case Da:case Wc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Xc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case qc:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Yc:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case $c:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Zc:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Jc:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Kc:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case jc:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Qc:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case el:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case tl:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case nl:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case il:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case sl:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case rl:case al:case ol:return Math.ceil(i/4)*Math.ceil(e/4)*16;case cl:case ll:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Na:case hl:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function yx(i){switch(i){case pn:case hu:return{byteLength:1,components:1};case or:case uu:case Qt:return{byteLength:2,components:1};case Rc:case Pc:return{byteLength:2,components:4};case Vn:case Cc:case Pn:return{byteLength:4,components:1};case du:case fu:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Xe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function Cm(){let i=null,e=!1,t=null,n=null;function s(r,a){n=i.requestAnimationFrame(s),t(r,a)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Mx(i){let e=new WeakMap;function t(o,c){let l=o.array,h=o.usage,u=l.byteLength,d=i.createBuffer();i.bindBuffer(c,d),i.bufferData(c,l,h),o.onUploadCallback();let f;if(l instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=i.SHORT;else if(l instanceof Uint32Array)f=i.UNSIGNED_INT;else if(l instanceof Int32Array)f=i.INT;else if(l instanceof Int8Array)f=i.BYTE;else if(l instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,c,l){let h=c.array,u=c.updateRanges;if(i.bindBuffer(l,o),u.length===0)i.bufferSubData(l,0,h);else{u.sort((f,m)=>f.start-m.start);let d=0;for(let f=1;f<u.length;f++){let m=u[d],x=u[f];x.start<=m.start+m.count+1?m.count=Math.max(m.count,x.start+x.count-m.start):(++d,u[d]=x)}u.length=d+1;for(let f=0,m=u.length;f<m;f++){let x=u[f];i.bufferSubData(l,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let c=e.get(o);c&&(i.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var bx=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Sx=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Tx=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ex=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,wx=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Ax=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Cx=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Rx=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Px=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Ix=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Lx=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Dx=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Nx=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Ux=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Ox=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Fx=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,kx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,zx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Bx=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Vx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Hx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Gx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Wx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Xx=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,qx=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Yx=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,$x=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Zx=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Jx=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Kx=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,jx="gl_FragColor = linearToOutputTexel( gl_FragColor );",Qx=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,e_=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,t_=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,n_=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,i_=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,s_=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,r_=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,a_=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,o_=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,c_=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,l_=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,h_=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,u_=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,d_=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,f_=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,p_=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,m_=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,g_=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,x_=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,__=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,y_=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,v_=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,M_=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,b_=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,S_=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,T_=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,E_=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,w_=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,A_=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,C_=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,R_=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,P_=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,I_=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,L_=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,D_=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,N_=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,U_=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,O_=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,F_=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,k_=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,z_=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,B_=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,V_=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,H_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,G_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,W_=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,X_=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,q_=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Y_=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,$_=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Z_=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,J_=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,K_=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,j_=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Q_=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ey=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ty=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ny=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,iy=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,sy=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,ry=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,ay=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,oy=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,cy=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ly=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,hy=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,uy=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,dy=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,fy=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,py=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,my=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,gy=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,xy=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,_y=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,yy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,vy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,My=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,by=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Sy=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ty=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ey=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ay=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Cy=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Ry=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Py=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Iy=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Ly=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Dy=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ny=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Uy=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Oy=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Fy=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ky=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,zy=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,By=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Vy=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Hy=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Gy=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Wy=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Xy=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qy=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Yy=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$y=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Zy=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Jy=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Ky=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,jy=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Qy=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ev=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,tv=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,tt={alphahash_fragment:bx,alphahash_pars_fragment:Sx,alphamap_fragment:Tx,alphamap_pars_fragment:Ex,alphatest_fragment:wx,alphatest_pars_fragment:Ax,aomap_fragment:Cx,aomap_pars_fragment:Rx,batching_pars_vertex:Px,batching_vertex:Ix,begin_vertex:Lx,beginnormal_vertex:Dx,bsdfs:Nx,iridescence_fragment:Ux,bumpmap_pars_fragment:Ox,clipping_planes_fragment:Fx,clipping_planes_pars_fragment:kx,clipping_planes_pars_vertex:zx,clipping_planes_vertex:Bx,color_fragment:Vx,color_pars_fragment:Hx,color_pars_vertex:Gx,color_vertex:Wx,common:Xx,cube_uv_reflection_fragment:qx,defaultnormal_vertex:Yx,displacementmap_pars_vertex:$x,displacementmap_vertex:Zx,emissivemap_fragment:Jx,emissivemap_pars_fragment:Kx,colorspace_fragment:jx,colorspace_pars_fragment:Qx,envmap_fragment:e_,envmap_common_pars_fragment:t_,envmap_pars_fragment:n_,envmap_pars_vertex:i_,envmap_physical_pars_fragment:p_,envmap_vertex:s_,fog_vertex:r_,fog_pars_vertex:a_,fog_fragment:o_,fog_pars_fragment:c_,gradientmap_pars_fragment:l_,lightmap_pars_fragment:h_,lights_lambert_fragment:u_,lights_lambert_pars_fragment:d_,lights_pars_begin:f_,lights_toon_fragment:m_,lights_toon_pars_fragment:g_,lights_phong_fragment:x_,lights_phong_pars_fragment:__,lights_physical_fragment:y_,lights_physical_pars_fragment:v_,lights_fragment_begin:M_,lights_fragment_maps:b_,lights_fragment_end:S_,lightprobes_pars_fragment:T_,logdepthbuf_fragment:E_,logdepthbuf_pars_fragment:w_,logdepthbuf_pars_vertex:A_,logdepthbuf_vertex:C_,map_fragment:R_,map_pars_fragment:P_,map_particle_fragment:I_,map_particle_pars_fragment:L_,metalnessmap_fragment:D_,metalnessmap_pars_fragment:N_,morphinstance_vertex:U_,morphcolor_vertex:O_,morphnormal_vertex:F_,morphtarget_pars_vertex:k_,morphtarget_vertex:z_,normal_fragment_begin:B_,normal_fragment_maps:V_,normal_pars_fragment:H_,normal_pars_vertex:G_,normal_vertex:W_,normalmap_pars_fragment:X_,clearcoat_normal_fragment_begin:q_,clearcoat_normal_fragment_maps:Y_,clearcoat_pars_fragment:$_,iridescence_pars_fragment:Z_,opaque_fragment:J_,packing:K_,premultiplied_alpha_fragment:j_,project_vertex:Q_,dithering_fragment:ey,dithering_pars_fragment:ty,roughnessmap_fragment:ny,roughnessmap_pars_fragment:iy,shadowmap_pars_fragment:sy,shadowmap_pars_vertex:ry,shadowmap_vertex:ay,shadowmask_pars_fragment:oy,skinbase_vertex:cy,skinning_pars_vertex:ly,skinning_vertex:hy,skinnormal_vertex:uy,specularmap_fragment:dy,specularmap_pars_fragment:fy,tonemapping_fragment:py,tonemapping_pars_fragment:my,transmission_fragment:gy,transmission_pars_fragment:xy,uv_pars_fragment:_y,uv_pars_vertex:yy,uv_vertex:vy,worldpos_vertex:My,background_vert:by,background_frag:Sy,backgroundCube_vert:Ty,backgroundCube_frag:Ey,cube_vert:wy,cube_frag:Ay,depth_vert:Cy,depth_frag:Ry,distance_vert:Py,distance_frag:Iy,equirect_vert:Ly,equirect_frag:Dy,linedashed_vert:Ny,linedashed_frag:Uy,meshbasic_vert:Oy,meshbasic_frag:Fy,meshlambert_vert:ky,meshlambert_frag:zy,meshmatcap_vert:By,meshmatcap_frag:Vy,meshnormal_vert:Hy,meshnormal_frag:Gy,meshphong_vert:Wy,meshphong_frag:Xy,meshphysical_vert:qy,meshphysical_frag:Yy,meshtoon_vert:$y,meshtoon_frag:Zy,points_vert:Jy,points_frag:Ky,shadow_vert:jy,shadow_frag:Qy,sprite_vert:ev,sprite_frag:tv},_e={common:{diffuse:{value:new Te(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Je},alphaMap:{value:null},alphaMapTransform:{value:new Je},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Je}},envmap:{envMap:{value:null},envMapRotation:{value:new Je},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Je}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Je}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Je},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Je},normalScale:{value:new se(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Je},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Je}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Je}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Je}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Te(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new I},probesMax:{value:new I},probesResolution:{value:new I}},points:{diffuse:{value:new Te(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Je},alphaTest:{value:0},uvTransform:{value:new Je}},sprite:{diffuse:{value:new Te(16777215)},opacity:{value:1},center:{value:new se(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Je},alphaMap:{value:null},alphaMapTransform:{value:new Je},alphaTest:{value:0}}},ni={basic:{uniforms:rn([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.fog]),vertexShader:tt.meshbasic_vert,fragmentShader:tt.meshbasic_frag},lambert:{uniforms:rn([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new Te(0)},envMapIntensity:{value:1}}]),vertexShader:tt.meshlambert_vert,fragmentShader:tt.meshlambert_frag},phong:{uniforms:rn([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new Te(0)},specular:{value:new Te(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:tt.meshphong_vert,fragmentShader:tt.meshphong_frag},standard:{uniforms:rn([_e.common,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.roughnessmap,_e.metalnessmap,_e.fog,_e.lights,{emissive:{value:new Te(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:tt.meshphysical_vert,fragmentShader:tt.meshphysical_frag},toon:{uniforms:rn([_e.common,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.gradientmap,_e.fog,_e.lights,{emissive:{value:new Te(0)}}]),vertexShader:tt.meshtoon_vert,fragmentShader:tt.meshtoon_frag},matcap:{uniforms:rn([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,{matcap:{value:null}}]),vertexShader:tt.meshmatcap_vert,fragmentShader:tt.meshmatcap_frag},points:{uniforms:rn([_e.points,_e.fog]),vertexShader:tt.points_vert,fragmentShader:tt.points_frag},dashed:{uniforms:rn([_e.common,_e.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:tt.linedashed_vert,fragmentShader:tt.linedashed_frag},depth:{uniforms:rn([_e.common,_e.displacementmap]),vertexShader:tt.depth_vert,fragmentShader:tt.depth_frag},normal:{uniforms:rn([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,{opacity:{value:1}}]),vertexShader:tt.meshnormal_vert,fragmentShader:tt.meshnormal_frag},sprite:{uniforms:rn([_e.sprite,_e.fog]),vertexShader:tt.sprite_vert,fragmentShader:tt.sprite_frag},background:{uniforms:{uvTransform:{value:new Je},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:tt.background_vert,fragmentShader:tt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Je}},vertexShader:tt.backgroundCube_vert,fragmentShader:tt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:tt.cube_vert,fragmentShader:tt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:tt.equirect_vert,fragmentShader:tt.equirect_frag},distance:{uniforms:rn([_e.common,_e.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:tt.distance_vert,fragmentShader:tt.distance_frag},shadow:{uniforms:rn([_e.lights,_e.fog,{color:{value:new Te(0)},opacity:{value:1}}]),vertexShader:tt.shadow_vert,fragmentShader:tt.shadow_frag}};ni.physical={uniforms:rn([ni.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Je},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Je},clearcoatNormalScale:{value:new se(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Je},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Je},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Je},sheen:{value:0},sheenColor:{value:new Te(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Je},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Je},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Je},transmissionSamplerSize:{value:new se},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Je},attenuationDistance:{value:0},attenuationColor:{value:new Te(0)},specularColor:{value:new Te(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Je},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Je},anisotropyVector:{value:new se},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Je}}]),vertexShader:tt.meshphysical_vert,fragmentShader:tt.meshphysical_frag};var fl={r:0,b:0,g:0},nv=new dt,Rm=new Je;Rm.set(-1,0,0,0,1,0,0,0,1);function iv(i,e,t,n,s,r){let a=new Te(0),o=s===!0?0:1,c,l,h=null,u=0,d=null;function f(M){let C=M.isScene===!0?M.background:null;if(C&&C.isTexture){let v=M.backgroundBlurriness>0;C=e.get(C,v)}return C}function m(M){let C=!1,v=f(M);v===null?g(a,o):v&&v.isColor&&(g(v,1),C=!0);let w=i.xr.getEnvironmentBlendMode();w==="additive"?t.buffers.color.setClear(0,0,0,1,r):w==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||C)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function x(M,C){let v=f(C);v&&(v.isCubeTexture||v.mapping===Aa)?(l===void 0&&(l=new Ze(new ei(1,1,1),new Ct({name:"BackgroundCubeMaterial",uniforms:fs(ni.backgroundCube.uniforms),vertexShader:ni.backgroundCube.vertexShader,fragmentShader:ni.backgroundCube.fragmentShader,side:jt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(w,T,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(l)),l.material.uniforms.envMap.value=v,l.material.uniforms.backgroundBlurriness.value=C.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=C.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(nv.makeRotationFromEuler(C.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Rm),l.material.toneMapped=it.getTransfer(v.colorSpace)!==ht,(h!==v||u!==v.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,h=v,u=v.version,d=i.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new Ze(new mi(2,2),new Ct({name:"BackgroundMaterial",uniforms:fs(ni.background.uniforms),vertexShader:ni.background.vertexShader,fragmentShader:ni.background.fragmentShader,side:Ui,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=C.backgroundIntensity,c.material.toneMapped=it.getTransfer(v.colorSpace)!==ht,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(h!==v||u!==v.version||d!==i.toneMapping)&&(c.material.needsUpdate=!0,h=v,u=v.version,d=i.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null))}function g(M,C){M.getRGB(fl,yu(i)),t.buffers.color.setClear(fl.r,fl.g,fl.b,C,r)}function p(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(M,C=1){a.set(M),o=C,g(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(M){o=M,g(a,o)},render:m,addToRenderList:x,dispose:p}}function sv(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null),r=s,a=!1;function o(N,F,B,D,V){let X=!1,z=u(N,D,B,F);r!==z&&(r=z,l(r.object)),X=f(N,D,B,V),X&&m(N,D,B,V),V!==null&&e.update(V,i.ELEMENT_ARRAY_BUFFER),(X||a)&&(a=!1,v(N,F,B,D),V!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(V).buffer))}function c(){return i.createVertexArray()}function l(N){return i.bindVertexArray(N)}function h(N){return i.deleteVertexArray(N)}function u(N,F,B,D){let V=D.wireframe===!0,X=n[F.id];X===void 0&&(X={},n[F.id]=X);let z=N.isInstancedMesh===!0?N.id:0,K=X[z];K===void 0&&(K={},X[z]=K);let q=K[B.id];q===void 0&&(q={},K[B.id]=q);let Q=q[V];return Q===void 0&&(Q=d(c()),q[V]=Q),Q}function d(N){let F=[],B=[],D=[];for(let V=0;V<t;V++)F[V]=0,B[V]=0,D[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:B,attributeDivisors:D,object:N,attributes:{},index:null}}function f(N,F,B,D){let V=r.attributes,X=F.attributes,z=0,K=B.getAttributes();for(let q in K)if(K[q].location>=0){let ee=V[q],Ue=X[q];if(Ue===void 0&&(q==="instanceMatrix"&&N.instanceMatrix&&(Ue=N.instanceMatrix),q==="instanceColor"&&N.instanceColor&&(Ue=N.instanceColor)),ee===void 0||ee.attribute!==Ue||Ue&&ee.data!==Ue.data)return!0;z++}return r.attributesNum!==z||r.index!==D}function m(N,F,B,D){let V={},X=F.attributes,z=0,K=B.getAttributes();for(let q in K)if(K[q].location>=0){let ee=X[q];ee===void 0&&(q==="instanceMatrix"&&N.instanceMatrix&&(ee=N.instanceMatrix),q==="instanceColor"&&N.instanceColor&&(ee=N.instanceColor));let Ue={};Ue.attribute=ee,ee&&ee.data&&(Ue.data=ee.data),V[q]=Ue,z++}r.attributes=V,r.attributesNum=z,r.index=D}function x(){let N=r.newAttributes;for(let F=0,B=N.length;F<B;F++)N[F]=0}function g(N){p(N,0)}function p(N,F){let B=r.newAttributes,D=r.enabledAttributes,V=r.attributeDivisors;B[N]=1,D[N]===0&&(i.enableVertexAttribArray(N),D[N]=1),V[N]!==F&&(i.vertexAttribDivisor(N,F),V[N]=F)}function M(){let N=r.newAttributes,F=r.enabledAttributes;for(let B=0,D=F.length;B<D;B++)F[B]!==N[B]&&(i.disableVertexAttribArray(B),F[B]=0)}function C(N,F,B,D,V,X,z){z===!0?i.vertexAttribIPointer(N,F,B,V,X):i.vertexAttribPointer(N,F,B,D,V,X)}function v(N,F,B,D){x();let V=D.attributes,X=B.getAttributes(),z=F.defaultAttributeValues;for(let K in X){let q=X[K];if(q.location>=0){let Q=V[K];if(Q===void 0&&(K==="instanceMatrix"&&N.instanceMatrix&&(Q=N.instanceMatrix),K==="instanceColor"&&N.instanceColor&&(Q=N.instanceColor)),Q!==void 0){let ee=Q.normalized,Ue=Q.itemSize,Re=e.get(Q);if(Re===void 0)continue;let ut=Re.buffer,st=Re.type,ct=Re.bytesPerElement,J=st===i.INT||st===i.UNSIGNED_INT||Q.gpuType===Cc;if(Q.isInterleavedBufferAttribute){let ne=Q.data,ye=ne.stride,qe=Q.offset;if(ne.isInstancedInterleavedBuffer){for(let Se=0;Se<q.locationSize;Se++)p(q.location+Se,ne.meshPerAttribute);N.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let Se=0;Se<q.locationSize;Se++)g(q.location+Se);i.bindBuffer(i.ARRAY_BUFFER,ut);for(let Se=0;Se<q.locationSize;Se++)C(q.location+Se,Ue/q.locationSize,st,ee,ye*ct,(qe+Ue/q.locationSize*Se)*ct,J)}else{if(Q.isInstancedBufferAttribute){for(let ne=0;ne<q.locationSize;ne++)p(q.location+ne,Q.meshPerAttribute);N.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let ne=0;ne<q.locationSize;ne++)g(q.location+ne);i.bindBuffer(i.ARRAY_BUFFER,ut);for(let ne=0;ne<q.locationSize;ne++)C(q.location+ne,Ue/q.locationSize,st,ee,Ue*ct,Ue/q.locationSize*ne*ct,J)}}else if(z!==void 0){let ee=z[K];if(ee!==void 0)switch(ee.length){case 2:i.vertexAttrib2fv(q.location,ee);break;case 3:i.vertexAttrib3fv(q.location,ee);break;case 4:i.vertexAttrib4fv(q.location,ee);break;default:i.vertexAttrib1fv(q.location,ee)}}}}M()}function w(){E();for(let N in n){let F=n[N];for(let B in F){let D=F[B];for(let V in D){let X=D[V];for(let z in X)h(X[z].object),delete X[z];delete D[V]}}delete n[N]}}function T(N){if(n[N.id]===void 0)return;let F=n[N.id];for(let B in F){let D=F[B];for(let V in D){let X=D[V];for(let z in X)h(X[z].object),delete X[z];delete D[V]}}delete n[N.id]}function R(N){for(let F in n){let B=n[F];for(let D in B){let V=B[D];if(V[N.id]===void 0)continue;let X=V[N.id];for(let z in X)h(X[z].object),delete X[z];delete V[N.id]}}}function y(N){for(let F in n){let B=n[F],D=N.isInstancedMesh===!0?N.id:0,V=B[D];if(V!==void 0){for(let X in V){let z=V[X];for(let K in z)h(z[K].object),delete z[K];delete V[X]}delete B[D],Object.keys(B).length===0&&delete n[F]}}}function E(){P(),a=!0,r!==s&&(r=s,l(r.object))}function P(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:E,resetDefaultState:P,dispose:w,releaseStatesOfGeometry:T,releaseStatesOfObject:y,releaseStatesOfProgram:R,initAttributes:x,enableAttribute:g,disableUnusedAttributes:M}}function rv(i,e,t){let n;function s(c){n=c}function r(c,l){i.drawArrays(n,c,l),t.update(l,n,1)}function a(c,l,h){h!==0&&(i.drawArraysInstanced(n,c,l,h),t.update(l,n,h))}function o(c,l,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,l,0,h);let d=0;for(let f=0;f<h;f++)d+=l[f];t.update(d,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function av(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let R=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(R){return!(R!==In&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){let y=R===Qt&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==pn&&R!==Pn&&!y&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function c(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp",h=c(l);h!==l&&(Xe("WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);let u=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&d===!1&&Xe("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),M=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),C=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),w=i.getParameter(i.MAX_SAMPLES),T=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:m,maxTextureSize:x,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:M,maxVaryings:C,maxFragmentUniforms:v,maxSamples:w,samples:T}}function ov(i){let e=this,t=null,n=0,s=!1,r=!1,a=new kn,o=new Je,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){let m=u.clippingPlanes,x=u.clipIntersection,g=u.clipShadows,p=i.get(u);if(!s||m===null||m.length===0||r&&!g)r?h(null):l();else{let M=r?0:n,C=M*4,v=p.clippingState||null;c.value=v,v=h(m,d,C,f);for(let w=0;w!==C;++w)v[w]=t[w];p.clippingState=v,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=M}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,m){let x=u!==null?u.length:0,g=null;if(x!==0){if(g=c.value,m!==!0||g===null){let p=f+x*4,M=d.matrixWorldInverse;o.getNormalMatrix(M),(g===null||g.length<p)&&(g=new Float32Array(p));for(let C=0,v=f;C!==x;++C,v+=4)a.copy(u[C]).applyMatrix4(M,o),a.normal.toArray(g,v),g[v+3]=a.constant}c.value=g,c.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,g}}var hr=4,cv=6,lv=20,hv=256,Oa=new Ni,om=new Te,Cu=null,Ru=0,Pu=0,Iu=!1,uv=new I,ps=new I,dr=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){let{size:a=256,position:o=uv}=r;Cu=this._renderer.getRenderTarget(),Ru=this._renderer.getActiveCubeFace(),Pu=this._renderer.getActiveMipmapLevel(),Iu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,s,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=hm(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=lm(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Cu,Ru,Pu),this._renderer.xr.enabled=Iu,e.scissorTest=!1,lr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Oi||e.mapping===us?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Cu=this._renderer.getRenderTarget(),Ru=this._renderer.getActiveCubeFace(),Pu=this._renderer.getActiveMipmapLevel(),Iu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Jt,minFilter:Jt,generateMipmaps:!1,type:Qt,format:In,colorSpace:Br,depthBuffer:!1},s=cm(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=cm(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=dv(r)),this._blurMaterial=pv(r,e,t),this._ggxMaterial=fv(r,e,t)}return s}_compileMaterial(e){let t=new Ze(new vt,e);this._renderer.compile(t,Oa)}_sceneToCubeUV(e,t,n,s,r){let c=new Zt(90,1,t,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(om),u.toneMapping=Bn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Ze(new ei,new At({name:"PMREM.Background",side:jt,depthWrite:!1,depthTest:!1})));let x=this._backgroundBox,g=x.material,p=!1,M=e.background;M?M.isColor&&(g.color.copy(M),e.background=null,p=!0):(g.color.copy(om),p=!0);for(let C=0;C<6;C++){let v=C%3;v===0?(c.up.set(0,l[C],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[C],r.y,r.z)):v===1?(c.up.set(0,0,l[C]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[C],r.z)):(c.up.set(0,l[C],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[C]));let w=this._cubeSize;lr(s,v*w,C>2?w:0,w,w),u.setRenderTarget(s),p&&u.render(x,c),u.render(e,c)}u.toneMapping=f,u.autoClear=d,e.background=M}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===Oi||e.mapping===us;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=hm()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=lm());let r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=e;let c=this._cubeSize;lr(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,Oa)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){let s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let c=a.uniforms,l=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),u=Math.sqrt(l*l-h*h),d=l*1.25,f=u*d,{_lodMax:m}=this,x=this._sizeLods[n],g=3*x*(n>m-hr?n-m+hr:0),p=4*(this._cubeSize-x);c.envMap.value=e.texture,c.roughness.value=f,c.mipInt.value=m-t,lr(r,g,p,3*x,2*x),s.setRenderTarget(r),s.render(o,Oa),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=m-n,lr(e,g,p,3*x,2*x),s.setRenderTarget(e),s.render(o,Oa)}_blur(e,t,n,s){let r=this._pingPongRenderTarget,a=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,n,a),this._blurPass(r,e,n,n,a)}_blurPass(e,t,n,s,r){let a=this._renderer,o=this._blurMaterial,c=this._lodMeshes[s];c.material=o;let l=o.uniforms;l.envMap.value=e.texture,l.sigma.value=r,l.mipInt.value=this._lodMax-n;let h=this._sizeLods[s],u=3*h*(s>this._lodMax-hr?s-this._lodMax+hr:0),d=4*(this._cubeSize-h);lr(t,u,d,3*h,2*h),a.setRenderTarget(t),a.render(c,Oa)}};function dv(i){let e=[],t=[],n=i,s=i-hr+1+cv;for(let r=0;r<s;r++){let a=Math.pow(2,n);e.push(a);let o=1/(a-2),c=-o,l=1+o,h=[c,c,l,c,l,l,c,c,l,l,c,l],u=6,d=6,f=3,m=new Float32Array(f*d*u),x=new Float32Array(f*d*u);for(let p=0;p<u;p++){let M=p%3*2/3-1,C=p>2?0:-1,v=[M,C,0,M+2/3,C,0,M+2/3,C+1,0,M,C,0,M+2/3,C+1,0,M,C+1,0];m.set(v,f*d*p);for(let w=0;w<d;w++){let T=h[w*2]*2-1,R=h[w*2+1]*2-1;p===0?ps.set(1,R,T):p===1?ps.set(-T,1,-R):p===2?ps.set(-T,R,1):p===3?ps.set(-1,R,-T):p===4?ps.set(-T,-1,R):ps.set(T,R,-1),ps.toArray(x,(p*d+w)*f)}}let g=new vt;g.setAttribute("position",new wt(m,f)),g.setAttribute("outputDirection",new wt(x,f)),t.push(new Ze(g,null)),n>hr&&n--}return{lodMeshes:t,sizeLods:e}}function cm(i,e,t){let n=new Bt(i,e,t);return n.texture.mapping=Aa,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function lr(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function fv(i,e,t){return new Ct({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:hv,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:xl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function pv(i,e,t){return new Ct({name:"SphericalGaussianBlur",defines:{SAMPLES:lv,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:xl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function lm(){return new Ct({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:xl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function hm(){return new Ct({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:xl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function xl(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var ml=class extends Bt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new ea(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new ei(5,5,5),r=new Ct({name:"CubemapFromEquirect",uniforms:fs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:jt,blending:Rn});r.uniforms.tEquirect.value=t;let a=new Ze(s,r),o=t.minFilter;return t.minFilter===Fi&&(t.minFilter=Jt),new Mc(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}};function mv(i){let e=new WeakMap,t=new WeakMap,n=null;function s(d,f=!1){return d==null?null:f?a(d):r(d)}function r(d){if(d&&d.isTexture){let f=d.mapping;if(f===Ec||f===wc)if(e.has(d)){let m=e.get(d).texture;return o(m,d.mapping)}else{let m=d.image;if(m&&m.height>0){let x=new ml(m.height);return x.fromEquirectangularTexture(i,d),e.set(d,x),d.addEventListener("dispose",l),o(x.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture){let f=d.mapping,m=f===Ec||f===wc,x=f===Oi||f===us;if(m||x){let g=t.get(d),p=g!==void 0?g.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==p)return n===null&&(n=new dr(i)),g=m?n.fromEquirectangular(d,g):n.fromCubemap(d,g),g.texture.pmremVersion=d.pmremVersion,t.set(d,g),g.texture;if(g!==void 0)return g.texture;{let M=d.image;return m&&M&&M.height>0||x&&M&&c(M)?(n===null&&(n=new dr(i)),g=m?n.fromEquirectangular(d):n.fromCubemap(d),g.texture.pmremVersion=d.pmremVersion,t.set(d,g),d.addEventListener("dispose",h),g.texture):null}}}return d}function o(d,f){return f===Ec?d.mapping=Oi:f===wc&&(d.mapping=us),d}function c(d){let f=0,m=6;for(let x=0;x<m;x++)d[x]!==void 0&&f++;return f===m}function l(d){let f=d.target;f.removeEventListener("dispose",l);let m=e.get(f);m!==void 0&&(e.delete(f),m.dispose())}function h(d){let f=d.target;f.removeEventListener("dispose",h);let m=t.get(f);m!==void 0&&(t.delete(f),m.dispose())}function u(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:u}}function gv(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&es("WebGLRenderer: "+n+" extension not supported."),s}}}function xv(i,e,t,n){let s={},r=new WeakMap;function a(u){let d=u.target;d.index!==null&&e.remove(d.index);for(let m in d.attributes)e.remove(d.attributes[m]);d.removeEventListener("dispose",a),delete s[d.id];let f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,t.memory.geometries++),d}function c(u){let d=u.attributes;for(let f in d)e.update(d[f],i.ARRAY_BUFFER)}function l(u){let d=[],f=u.index,m=u.attributes.position,x=0;if(m===void 0)return;if(f!==null){let M=f.array;x=f.version;for(let C=0,v=M.length;C<v;C+=3){let w=M[C+0],T=M[C+1],R=M[C+2];d.push(w,T,T,R,R,w)}}else{let M=m.array;x=m.version;for(let C=0,v=M.length/3-1;C<v;C+=3){let w=C+0,T=C+1,R=C+2;d.push(w,T,T,R,R,w)}}let g=new(m.count>=65535?Yr:qr)(d,1);g.version=x;let p=r.get(u);p&&e.remove(p),r.set(u,g)}function h(u){let d=r.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:h}}function _v(i,e,t){let n;function s(u){n=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function c(u,d){i.drawElements(n,d,r,u*a),t.update(d,n,1)}function l(u,d,f){f!==0&&(i.drawElementsInstanced(n,d,r,u*a,f),t.update(d,n,f))}function h(u,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,u,0,f);let x=0;for(let g=0;g<f;g++)x+=d[g];t.update(x,n,1)}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h}function yv(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:We("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function vv(i,e,t){let n=new WeakMap,s=new Pt;function r(a,o,c){let l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(o);if(d===void 0||d.count!==u){let E=function(){R.dispose(),n.delete(o),o.removeEventListener("dispose",E)};d!==void 0&&d.texture.dispose();let f=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],M=o.morphAttributes.color||[],C=0;f===!0&&(C=1),m===!0&&(C=2),x===!0&&(C=3);let v=o.attributes.position.count*C,w=1;v>e.maxTextureSize&&(w=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);let T=new Float32Array(v*w*4*u),R=new Wr(T,v,w,u);R.type=Pn,R.needsUpdate=!0;let y=C*4;for(let P=0;P<u;P++){let N=g[P],F=p[P],B=M[P],D=v*w*4*P;for(let V=0;V<N.count;V++){let X=V*y;f===!0&&(s.fromBufferAttribute(N,V),T[D+X+0]=s.x,T[D+X+1]=s.y,T[D+X+2]=s.z,T[D+X+3]=0),m===!0&&(s.fromBufferAttribute(F,V),T[D+X+4]=s.x,T[D+X+5]=s.y,T[D+X+6]=s.z,T[D+X+7]=0),x===!0&&(s.fromBufferAttribute(B,V),T[D+X+8]=s.x,T[D+X+9]=s.y,T[D+X+10]=s.z,T[D+X+11]=B.itemSize===4?s.w:1)}}d={count:u,texture:R,size:new se(v,w)},n.set(o,d),o.addEventListener("dispose",E)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let f=0;for(let x=0;x<l.length;x++)f+=l[x];let m=o.morphTargetsRelative?1:1-f;c.getUniforms().setValue(i,"morphTargetBaseInfluence",m),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function Mv(i,e,t,n,s){let r=new WeakMap;function a(l){let h=s.render.frame,u=l.geometry,d=e.get(l,u);if(r.get(d)!==h&&(e.update(d),r.set(d,h)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==h&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,h))),l.isSkinnedMesh){let f=l.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return d}function o(){r=new WeakMap}function c(l){let h=l.target;h.removeEventListener("dispose",c),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}var bv={[Ma]:"LINEAR_TONE_MAPPING",[ba]:"REINHARD_TONE_MAPPING",[Sa]:"CINEON_TONE_MAPPING",[hs]:"ACES_FILMIC_TONE_MAPPING",[Ea]:"AGX_TONE_MAPPING",[wa]:"NEUTRAL_TONE_MAPPING",[Ta]:"CUSTOM_TONE_MAPPING"};function Sv(i,e,t,n,s,r){let a=new Bt(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,c=null,l=new vt;l.setAttribute("position",new ot([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new ot([0,2,0,0,2,0],2));let h=new tr({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),u=new Ze(l,h),d=new Ni(-1,1,1,-1,0,1),f=null,m=null,x=!1,g,p=null,M=[],C=!1;this.setSize=function(v,w){a.setSize(v,w),o!==null&&o.setSize(v,w),c!==null&&c.setSize(v,w);for(let T=0;T<M.length;T++){let R=M[T];R.setSize&&R.setSize(v,w)}},this.setEffects=function(v){M=v,C=M.length>0&&M[0].isRenderPass===!0;let w=a.width,T=a.height;M.length>0&&o===null&&(o=new Bt(w,T,{type:Qt,depthBuffer:!1,stencilBuffer:!1}),c=new Bt(w,T,{type:Qt,depthBuffer:!1,stencilBuffer:!1}));for(let R=0;R<M.length;R++){let y=M[R];y.setSize&&y.setSize(w,T)}},this.begin=function(v,w){if(x||v.toneMapping===Bn&&M.length===0)return!1;if(p=w,w!==null){let T=w.width,R=w.height;(a.width!==T||a.height!==R)&&this.setSize(T,R)}return C===!1&&v.setRenderTarget(a),g=v.toneMapping,v.toneMapping=Bn,!0},this.hasRenderPass=function(){return C},this.end=function(v,w){v.toneMapping=g,x=!0;let T=a,R=o;for(let y=0;y<M.length;y++){let E=M[y];E.enabled!==!1&&(E.render(v,R,T,w),E.needsSwap!==!1&&(T=R,R=R===o?c:o))}if(f!==v.outputColorSpace||m!==v.toneMapping){f=v.outputColorSpace,m=v.toneMapping,h.defines={},it.getTransfer(f)===ht&&(h.defines.SRGB_TRANSFER="");let y=bv[m];y&&(h.defines[y]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=T.texture,v.setRenderTarget(p),v.render(u,d),p=null,x=!1},this.isCompositing=function(){return x},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),c!==null&&c.dispose(),l.dispose(),h.dispose()}}var Pm=new un,Nu=new Ri(1,1),Im=new Wr,Lm=new jo,Dm=new ea,um=[],dm=[],fm=new Float32Array(16),pm=new Float32Array(9),mm=new Float32Array(4);function fr(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=um[s];if(r===void 0&&(r=new Float32Array(s),um[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Wt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Xt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function _l(i,e){let t=dm[e];t===void 0&&(t=new Int32Array(e),dm[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Tv(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Ev(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Wt(t,e))return;i.uniform2fv(this.addr,e),Xt(t,e)}}function wv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Wt(t,e))return;i.uniform3fv(this.addr,e),Xt(t,e)}}function Av(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Wt(t,e))return;i.uniform4fv(this.addr,e),Xt(t,e)}}function Cv(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Wt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Xt(t,e)}else{if(Wt(t,n))return;mm.set(n),i.uniformMatrix2fv(this.addr,!1,mm),Xt(t,n)}}function Rv(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Wt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Xt(t,e)}else{if(Wt(t,n))return;pm.set(n),i.uniformMatrix3fv(this.addr,!1,pm),Xt(t,n)}}function Pv(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Wt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Xt(t,e)}else{if(Wt(t,n))return;fm.set(n),i.uniformMatrix4fv(this.addr,!1,fm),Xt(t,n)}}function Iv(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Lv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Wt(t,e))return;i.uniform2iv(this.addr,e),Xt(t,e)}}function Dv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Wt(t,e))return;i.uniform3iv(this.addr,e),Xt(t,e)}}function Nv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Wt(t,e))return;i.uniform4iv(this.addr,e),Xt(t,e)}}function Uv(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Ov(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Wt(t,e))return;i.uniform2uiv(this.addr,e),Xt(t,e)}}function Fv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Wt(t,e))return;i.uniform3uiv(this.addr,e),Xt(t,e)}}function kv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Wt(t,e))return;i.uniform4uiv(this.addr,e),Xt(t,e)}}function zv(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Nu.compareFunction=t.isReversedDepthBuffer()?dl:ul,r=Nu):r=Pm,t.setTexture2D(e||r,s)}function Bv(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Lm,s)}function Vv(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Dm,s)}function Hv(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Im,s)}function Gv(i){switch(i){case 5126:return Tv;case 35664:return Ev;case 35665:return wv;case 35666:return Av;case 35674:return Cv;case 35675:return Rv;case 35676:return Pv;case 5124:case 35670:return Iv;case 35667:case 35671:return Lv;case 35668:case 35672:return Dv;case 35669:case 35673:return Nv;case 5125:return Uv;case 36294:return Ov;case 36295:return Fv;case 36296:return kv;case 35678:case 36198:case 36298:case 36306:case 35682:return zv;case 35679:case 36299:case 36307:return Bv;case 35680:case 36300:case 36308:case 36293:return Vv;case 36289:case 36303:case 36311:case 36292:return Hv}}function Wv(i,e){i.uniform1fv(this.addr,e)}function Xv(i,e){let t=fr(e,this.size,2);i.uniform2fv(this.addr,t)}function qv(i,e){let t=fr(e,this.size,3);i.uniform3fv(this.addr,t)}function Yv(i,e){let t=fr(e,this.size,4);i.uniform4fv(this.addr,t)}function $v(i,e){let t=fr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Zv(i,e){let t=fr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Jv(i,e){let t=fr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Kv(i,e){i.uniform1iv(this.addr,e)}function jv(i,e){i.uniform2iv(this.addr,e)}function Qv(i,e){i.uniform3iv(this.addr,e)}function eM(i,e){i.uniform4iv(this.addr,e)}function tM(i,e){i.uniform1uiv(this.addr,e)}function nM(i,e){i.uniform2uiv(this.addr,e)}function iM(i,e){i.uniform3uiv(this.addr,e)}function sM(i,e){i.uniform4uiv(this.addr,e)}function rM(i,e,t){let n=this.cache,s=e.length,r=_l(t,s);Wt(n,r)||(i.uniform1iv(this.addr,r),Xt(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=Nu:a=Pm;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function aM(i,e,t){let n=this.cache,s=e.length,r=_l(t,s);Wt(n,r)||(i.uniform1iv(this.addr,r),Xt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Lm,r[a])}function oM(i,e,t){let n=this.cache,s=e.length,r=_l(t,s);Wt(n,r)||(i.uniform1iv(this.addr,r),Xt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Dm,r[a])}function cM(i,e,t){let n=this.cache,s=e.length,r=_l(t,s);Wt(n,r)||(i.uniform1iv(this.addr,r),Xt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Im,r[a])}function lM(i){switch(i){case 5126:return Wv;case 35664:return Xv;case 35665:return qv;case 35666:return Yv;case 35674:return $v;case 35675:return Zv;case 35676:return Jv;case 5124:case 35670:return Kv;case 35667:case 35671:return jv;case 35668:case 35672:return Qv;case 35669:case 35673:return eM;case 5125:return tM;case 36294:return nM;case 36295:return iM;case 36296:return sM;case 35678:case 36198:case 36298:case 36306:case 35682:return rM;case 35679:case 36299:case 36307:return aM;case 35680:case 36300:case 36308:case 36293:return oM;case 36289:case 36303:case 36311:case 36292:return cM}}var Uu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Gv(t.type)}},Ou=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=lM(t.type)}},Fu=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],n)}}},Lu=/(\w+)(\])?(\[|\.)?/g;function gm(i,e){i.seq.push(e),i.map[e.id]=e}function hM(i,e,t){let n=i.name,s=n.length;for(Lu.lastIndex=0;;){let r=Lu.exec(n),a=Lu.lastIndex,o=r[1],c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){gm(t,l===void 0?new Uu(o,i,e):new Ou(o,i,e));break}else{let u=t.map[o];u===void 0&&(u=new Fu(o),gm(t,u)),t=u}}}var ur=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=e.getActiveUniform(t,a),c=e.getUniformLocation(t,o.name);hM(o,c,this)}let s=[],r=[];for(let a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&n.push(a)}return n}};function xm(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var uM=37297,dM=0;function fM(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}var _m=new Je;function pM(i){it._getMatrix(_m,it.workingColorSpace,i);let e=`mat3( ${_m.elements.map(t=>t.toFixed(4))} )`;switch(it.getTransfer(i)){case Vr:return[e,"LinearTransferOETF"];case ht:return[e,"sRGBTransferOETF"];default:return Xe("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function ym(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+fM(i.getShaderSource(e),o)}else return r}function mM(i,e){let t=pM(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var gM={[Ma]:"Linear",[ba]:"Reinhard",[Sa]:"Cineon",[hs]:"ACESFilmic",[Ea]:"AgX",[wa]:"Neutral",[Ta]:"Custom"};function xM(i,e){let t=gM[e];return t===void 0?(Xe("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var pl=new I;function _M(){it.getLuminanceCoefficients(pl);let i=pl.x.toFixed(4),e=pl.y.toFixed(4),t=pl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function yM(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ka).join(`
`)}function vM(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function MM(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function ka(i){return i!==""}function vm(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Mm(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var bM=/^[ \t]*#include +<([\w\d./]+)>/gm;function ku(i){return i.replace(bM,TM)}var SM=new Map;function TM(i,e){let t=tt[e];if(t===void 0){let n=SM.get(e);if(n!==void 0)t=tt[n],Xe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return ku(t)}var EM=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function bm(i){return i.replace(EM,wM)}function wM(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Sm(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}var AM={[cs]:"SHADOWMAP_TYPE_PCF",[rr]:"SHADOWMAP_TYPE_VSM"};function CM(i){return AM[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var RM={[Oi]:"ENVMAP_TYPE_CUBE",[us]:"ENVMAP_TYPE_CUBE",[Aa]:"ENVMAP_TYPE_CUBE_UV"};function PM(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":RM[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var IM={[us]:"ENVMAP_MODE_REFRACTION"};function LM(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":IM[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var DM={[Tc]:"ENVMAP_BLENDING_MULTIPLY",[Fp]:"ENVMAP_BLENDING_MIX",[kp]:"ENVMAP_BLENDING_ADD"};function NM(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":DM[i.combine]||"ENVMAP_BLENDING_NONE"}function UM(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function OM(i,e,t,n){let s=i.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,c=CM(t),l=PM(t),h=LM(t),u=NM(t),d=UM(t),f=yM(t),m=vM(r),x=s.createProgram(),g,p,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(ka).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(ka).join(`
`),p.length>0&&(p+=`
`)):(g=[Sm(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ka).join(`
`),p=[Sm(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Bn?"#define TONE_MAPPING":"",t.toneMapping!==Bn?tt.tonemapping_pars_fragment:"",t.toneMapping!==Bn?xM("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",tt.colorspace_pars_fragment,mM("linearToOutputTexel",t.outputColorSpace),_M(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ka).join(`
`)),a=ku(a),a=vm(a,t),a=Mm(a,t),o=ku(o),o=vm(o,t),o=Mm(o,t),a=bm(a),o=bm(o),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",t.glslVersion===xu?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===xu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let C=M+g+a,v=M+p+o,w=xm(s,s.VERTEX_SHADER,C),T=xm(s,s.FRAGMENT_SHADER,v);s.attachShader(x,w),s.attachShader(x,T),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function R(N){if(i.debug.checkShaderErrors){let F=s.getProgramInfoLog(x)||"",B=s.getShaderInfoLog(w)||"",D=s.getShaderInfoLog(T)||"",V=F.trim(),X=B.trim(),z=D.trim(),K=!0,q=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(K=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,w,T);else{let Q=ym(s,w,"vertex"),ee=ym(s,T,"fragment");We("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+N.name+`
Material Type: `+N.type+`

Program Info Log: `+V+`
`+Q+`
`+ee)}else V!==""?Xe("WebGLProgram: Program Info Log:",V):(X===""||z==="")&&(q=!1);q&&(N.diagnostics={runnable:K,programLog:V,vertexShader:{log:X,prefix:g},fragmentShader:{log:z,prefix:p}})}s.deleteShader(w),s.deleteShader(T),y=new ur(s,x),E=MM(s,x)}let y;this.getUniforms=function(){return y===void 0&&R(this),y};let E;this.getAttributes=function(){return E===void 0&&R(this),E};let P=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=s.getProgramParameter(x,uM)),P},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=dM++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=w,this.fragmentShader=T,this}var FM=0,zu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Bu(e),t.set(e,n)),n}},Bu=class{constructor(e){this.id=FM++,this.code=e,this.usedTimes=0}};function kM(i){return i===zi||i===Da||i===Na}function zM(i,e,t,n,s,r){let a=new $s,o=new zu,c=new Set,l=[],h=new Map,u=n.logarithmicDepthBuffer,d=n.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(y){return c.add(y),y===0?"uv":`uv${y}`}function x(y,E,P,N,F,B){let D=N.fog,V=F.geometry,X=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?N.environment:null,z=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap,K=e.get(y.envMap||X,z),q=K&&K.mapping===Aa?K.image.height:null,Q=f[y.type];y.precision!==null&&(d=n.getMaxPrecision(y.precision),d!==y.precision&&Xe("WebGLProgram.getParameters:",y.precision,"not supported, using",d,"instead."));let ee=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,Ue=ee!==void 0?ee.length:0,Re=0;V.morphAttributes.position!==void 0&&(Re=1),V.morphAttributes.normal!==void 0&&(Re=2),V.morphAttributes.color!==void 0&&(Re=3);let ut,st,ct,J;if(Q){let bt=ni[Q];ut=bt.vertexShader,st=bt.fragmentShader}else{ut=y.vertexShader,st=y.fragmentShader;let bt=o.getVertexShaderStage(y),pt=o.getFragmentShaderStage(y);o.update(y,bt,pt),ct=bt.id,J=pt.id}let ne=i.getRenderTarget(),ye=i.state.buffers.depth.getReversed(),qe=F.isInstancedMesh===!0,Se=F.isBatchedMesh===!0,Ye=!!y.map,xt=!!y.matcap,ie=!!K,ae=!!y.aoMap,ce=!!y.lightMap,le=!!y.bumpMap&&y.wireframe===!1,de=!!y.normalMap,He=!!y.displacementMap,Be=!!y.emissiveMap,$e=!!y.metalnessMap,Ke=!!y.roughnessMap,L=y.anisotropy>0,ft=y.clearcoat>0,rt=y.dispersion>0,A=y.retroreflectivity>0,_=y.iridescence>0,k=y.sheen>0,W=y.transmission>0,$=L&&!!y.anisotropyMap,he=ft&&!!y.clearcoatMap,ue=ft&&!!y.clearcoatNormalMap,Z=ft&&!!y.clearcoatRoughnessMap,te=_&&!!y.iridescenceMap,fe=_&&!!y.iridescenceThicknessMap,Oe=k&&!!y.sheenColorMap,xe=k&&!!y.sheenRoughnessMap,pe=!!y.specularMap,Fe=!!y.specularColorMap,Ge=!!y.specularIntensityMap,je=W&&!!y.transmissionMap,O=W&&!!y.thicknessMap,me=!!y.gradientMap,j=!!y.alphaMap,ge=y.alphaTest>0,be=!!y.alphaHash,re=!!y.extensions,ke=Bn;y.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(ke=i.toneMapping);let De={shaderID:Q,shaderType:y.type,shaderName:y.name,vertexShader:ut,fragmentShader:st,defines:y.defines,customVertexShaderID:ct,customFragmentShaderID:J,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:d,batching:Se,batchingColor:Se&&F._colorsTexture!==null,instancing:qe,instancingColor:qe&&F.instanceColor!==null,instancingMorph:qe&&F.morphTexture!==null,outputColorSpace:ne===null?i.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:it.workingColorSpace,alphaToCoverage:!!y.alphaToCoverage,map:Ye,matcap:xt,envMap:ie,envMapMode:ie&&K.mapping,envMapCubeUVHeight:q,aoMap:ae,lightMap:ce,bumpMap:le,normalMap:de,displacementMap:He,emissiveMap:Be,normalMapObjectSpace:de&&y.normalMapType===Vp,normalMapTangentSpace:de&&y.normalMapType===Ua,packedNormalMap:de&&y.normalMapType===Ua&&kM(y.normalMap.format),metalnessMap:$e,roughnessMap:Ke,anisotropy:L,anisotropyMap:$,clearcoat:ft,clearcoatMap:he,clearcoatNormalMap:ue,clearcoatRoughnessMap:Z,dispersion:rt,retroreflection:A,iridescence:_,iridescenceMap:te,iridescenceThicknessMap:fe,sheen:k,sheenColorMap:Oe,sheenRoughnessMap:xe,specularMap:pe,specularColorMap:Fe,specularIntensityMap:Ge,transmission:W,transmissionMap:je,thicknessMap:O,gradientMap:me,opaque:y.transparent===!1&&y.blending===ar&&y.alphaToCoverage===!1,alphaMap:j,alphaTest:ge,alphaHash:be,combine:y.combine,mapUv:Ye&&m(y.map.channel),aoMapUv:ae&&m(y.aoMap.channel),lightMapUv:ce&&m(y.lightMap.channel),bumpMapUv:le&&m(y.bumpMap.channel),normalMapUv:de&&m(y.normalMap.channel),displacementMapUv:He&&m(y.displacementMap.channel),emissiveMapUv:Be&&m(y.emissiveMap.channel),metalnessMapUv:$e&&m(y.metalnessMap.channel),roughnessMapUv:Ke&&m(y.roughnessMap.channel),anisotropyMapUv:$&&m(y.anisotropyMap.channel),clearcoatMapUv:he&&m(y.clearcoatMap.channel),clearcoatNormalMapUv:ue&&m(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Z&&m(y.clearcoatRoughnessMap.channel),iridescenceMapUv:te&&m(y.iridescenceMap.channel),iridescenceThicknessMapUv:fe&&m(y.iridescenceThicknessMap.channel),sheenColorMapUv:Oe&&m(y.sheenColorMap.channel),sheenRoughnessMapUv:xe&&m(y.sheenRoughnessMap.channel),specularMapUv:pe&&m(y.specularMap.channel),specularColorMapUv:Fe&&m(y.specularColorMap.channel),specularIntensityMapUv:Ge&&m(y.specularIntensityMap.channel),transmissionMapUv:je&&m(y.transmissionMap.channel),thicknessMapUv:O&&m(y.thicknessMap.channel),alphaMapUv:j&&m(y.alphaMap.channel),vertexTangents:!!V.attributes.tangent&&(de||L),vertexNormals:!!V.attributes.normal,vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!V.attributes.uv&&(Ye||j),fog:!!D,useFog:y.fog===!0,fogExp2:!!D&&D.isFogExp2,flatShading:y.wireframe===!1&&(y.flatShading===!0||V.attributes.normal===void 0&&de===!1&&(y.isMeshLambertMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isMeshPhysicalMaterial)),sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:ye,skinning:F.isSkinnedMesh===!0,hasPositionAttribute:V.attributes.position!==void 0,morphTargets:V.morphAttributes.position!==void 0,morphNormals:V.morphAttributes.normal!==void 0,morphColors:V.morphAttributes.color!==void 0,morphTargetsCount:Ue,morphTextureStride:Re,numSunLights:E.sun.length,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numSunLightShadows:E.sunShadowMap.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numLightProbeGrids:B.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:ke,decodeVideoTexture:Ye&&y.map.isVideoTexture===!0&&it.getTransfer(y.map.colorSpace)===ht,decodeVideoTextureEmissive:Be&&y.emissiveMap.isVideoTexture===!0&&it.getTransfer(y.emissiveMap.colorSpace)===ht,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===Nt,flipSided:y.side===jt,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:re&&y.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(re&&y.extensions.multiDraw===!0||Se)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return De.vertexUv1s=c.has(1),De.vertexUv2s=c.has(2),De.vertexUv3s=c.has(3),c.clear(),De}function g(y){let E=[];if(y.shaderID?E.push(y.shaderID):(E.push(y.customVertexShaderID),E.push(y.customFragmentShaderID)),y.defines!==void 0)for(let P in y.defines)E.push(P),E.push(y.defines[P]);return y.isRawShaderMaterial===!1&&(p(E,y),M(E,y),E.push(i.outputColorSpace)),E.push(y.customProgramCacheKey),E.join()}function p(y,E){y.push(E.precision),y.push(E.outputColorSpace),y.push(E.envMapMode),y.push(E.envMapCubeUVHeight),y.push(E.mapUv),y.push(E.alphaMapUv),y.push(E.lightMapUv),y.push(E.aoMapUv),y.push(E.bumpMapUv),y.push(E.normalMapUv),y.push(E.displacementMapUv),y.push(E.emissiveMapUv),y.push(E.metalnessMapUv),y.push(E.roughnessMapUv),y.push(E.anisotropyMapUv),y.push(E.clearcoatMapUv),y.push(E.clearcoatNormalMapUv),y.push(E.clearcoatRoughnessMapUv),y.push(E.iridescenceMapUv),y.push(E.iridescenceThicknessMapUv),y.push(E.sheenColorMapUv),y.push(E.sheenRoughnessMapUv),y.push(E.specularMapUv),y.push(E.specularColorMapUv),y.push(E.specularIntensityMapUv),y.push(E.transmissionMapUv),y.push(E.thicknessMapUv),y.push(E.combine),y.push(E.fogExp2),y.push(E.sizeAttenuation),y.push(E.morphTargetsCount),y.push(E.morphAttributeCount),y.push(E.numSunLights),y.push(E.numDirLights),y.push(E.numPointLights),y.push(E.numSpotLights),y.push(E.numSpotLightMaps),y.push(E.numHemiLights),y.push(E.numRectAreaLights),y.push(E.numSunLightShadows),y.push(E.numDirLightShadows),y.push(E.numPointLightShadows),y.push(E.numSpotLightShadows),y.push(E.numSpotLightShadowsWithMaps),y.push(E.numLightProbes),y.push(E.shadowMapType),y.push(E.toneMapping),y.push(E.numClippingPlanes),y.push(E.numClipIntersection),y.push(E.depthPacking)}function M(y,E){a.disableAll(),E.instancing&&a.enable(0),E.instancingColor&&a.enable(1),E.instancingMorph&&a.enable(2),E.matcap&&a.enable(3),E.envMap&&a.enable(4),E.normalMapObjectSpace&&a.enable(5),E.normalMapTangentSpace&&a.enable(6),E.clearcoat&&a.enable(7),E.iridescence&&a.enable(8),E.alphaTest&&a.enable(9),E.vertexColors&&a.enable(10),E.vertexAlphas&&a.enable(11),E.vertexUv1s&&a.enable(12),E.vertexUv2s&&a.enable(13),E.vertexUv3s&&a.enable(14),E.vertexTangents&&a.enable(15),E.anisotropy&&a.enable(16),E.alphaHash&&a.enable(17),E.batching&&a.enable(18),E.dispersion&&a.enable(19),E.retroreflection&&a.enable(24),E.batchingColor&&a.enable(20),E.gradientMap&&a.enable(21),E.packedNormalMap&&a.enable(22),E.vertexNormals&&a.enable(23),y.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.reversedDepthBuffer&&a.enable(4),E.skinning&&a.enable(5),E.morphTargets&&a.enable(6),E.morphNormals&&a.enable(7),E.morphColors&&a.enable(8),E.premultipliedAlpha&&a.enable(9),E.shadowMapEnabled&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),E.decodeVideoTextureEmissive&&a.enable(20),E.alphaToCoverage&&a.enable(21),E.numLightProbeGrids>0&&a.enable(22),E.hasPositionAttribute&&a.enable(23),y.push(a.mask)}function C(y){let E=f[y.type],P;if(E){let N=ni[E];P=_i.clone(N.uniforms)}else P=y.uniforms;return P}function v(y,E){let P=h.get(E);return P!==void 0?++P.usedTimes:(P=new OM(i,E,y,s),l.push(P),h.set(E,P)),P}function w(y){if(--y.usedTimes===0){let E=l.indexOf(y);l[E]=l[l.length-1],l.pop(),h.delete(y.cacheKey),y.destroy()}}function T(y){o.remove(y)}function R(){o.dispose()}return{getParameters:x,getProgramCacheKey:g,getUniforms:C,acquireProgram:v,releaseProgram:w,releaseShaderCache:T,programs:l,dispose:R}}function BM(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function VM(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function Tm(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Em(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,m,x,g,p){let M=i[e];return M===void 0?(M={id:d.id,object:d,geometry:f,material:m,materialVariant:a(d),groupOrder:x,renderOrder:d.renderOrder,z:g,group:p},i[e]=M):(M.id=d.id,M.object=d,M.geometry=f,M.material=m,M.materialVariant=a(d),M.groupOrder=x,M.renderOrder=d.renderOrder,M.z=g,M.group=p),e++,M}function c(d,f,m,x,g,p,M){M.reversedDepth===!0&&(g=-g);let C=o(d,f,m,x,g,p);m.transmission>0?n.push(C):m.transparent===!0?s.push(C):t.push(C)}function l(d,f,m,x,g,p){let M=o(d,f,m,x,g,p);m.transmission>0?n.unshift(M):m.transparent===!0?s.unshift(M):t.unshift(M)}function h(d,f){t.length>1&&t.sort(d||VM),n.length>1&&n.sort(f||Tm),s.length>1&&s.sort(f||Tm)}function u(){for(let d=e,f=i.length;d<f;d++){let m=i[d];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:c,unshift:l,finish:u,sort:h}}function HM(){let i=new WeakMap;function e(n,s){let r=i.get(n),a;return r===void 0?(a=new Em,i.set(n,[a])):s>=r.length?(a=new Em,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function GM(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new I,color:new Te};break;case"SpotLight":t={position:new I,direction:new I,color:new Te,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new I,color:new Te,distance:0,decay:0};break;case"HemisphereLight":t={direction:new I,skyColor:new Te,groundColor:new Te};break;case"RectAreaLight":t={color:new Te,position:new I,halfWidth:new I,halfHeight:new I};break}return i[e.id]=t,t}}}function WM(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new se};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new se};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new se,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var XM=0;function qM(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function YM(i){let e=new GM,t=WM(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new I);let s=new I,r=new dt,a=new dt;function o(l){let h=0,u=0,d=0;for(let F=0;F<9;F++)n.probe[F].set(0,0,0);let f=0,m=0,x=0,g=0,p=0,M=0,C=0,v=0,w=0,T=0,R=0,y=0,E=0,P=0;l.sort(qM);for(let F=0,B=l.length;F<B;F++){let D=l[F],V=D.color,X=D.intensity,z=D.distance,K=null;if(D.shadow&&D.shadow.map&&(D.shadow.map.texture.format===zi?K=D.shadow.map.texture:K=D.shadow.map.depthTexture||D.shadow.map.texture),D.isAmbientLight)h+=V.r*X,u+=V.g*X,d+=V.b*X;else if(D.isLightProbe){for(let q=0;q<9;q++)n.probe[q].addScaledVector(D.sh.coefficients[q],X);P++}else if(D.isSunLight){let q=e.get(D);if(q.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){let Q=D.shadow,ee=t.get(D);ee.shadowIntensity=Q.intensity,ee.shadowBias=Q.bias,ee.shadowNormalBias=Q.normalBias,ee.shadowRadius=Q.radius,ee.shadowMapSize.copy(Q.mapSize).multiply(Q.getFrameExtents()),n.sunShadow[m]=ee,n.sunShadowMap[m]=K;let Ue=Q.getViewportCount();for(let Re=0;Re<Ue;Re++)n.sunShadowMatrix[x+Re]=Q.getMatrix(Re),n.sunShadowCascade[x+Re]=Q._cascadeData[Re];x+=Ue,m++}n.sun[f]=q,f++}else if(D.isDirectionalLight){let q=e.get(D);if(q.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){let Q=D.shadow,ee=t.get(D);ee.shadowIntensity=Q.intensity,ee.shadowBias=Q.bias,ee.shadowNormalBias=Q.normalBias,ee.shadowRadius=Q.radius,ee.shadowMapSize=Q.mapSize,n.directionalShadow[g]=ee,n.directionalShadowMap[g]=K,n.directionalShadowMatrix[g]=D.shadow.matrix,w++}n.directional[g]=q,g++}else if(D.isSpotLight){let q=e.get(D);q.position.setFromMatrixPosition(D.matrixWorld),q.color.copy(V).multiplyScalar(X),q.distance=z,q.coneCos=Math.cos(D.angle),q.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),q.decay=D.decay,n.spot[M]=q;let Q=D.shadow;if(D.map&&(n.spotLightMap[y]=D.map,y++,Q.updateMatrices(D),D.castShadow&&E++),n.spotLightMatrix[M]=Q.matrix,D.castShadow){let ee=t.get(D);ee.shadowIntensity=Q.intensity,ee.shadowBias=Q.bias,ee.shadowNormalBias=Q.normalBias,ee.shadowRadius=Q.radius,ee.shadowMapSize=Q.mapSize,n.spotShadow[M]=ee,n.spotShadowMap[M]=K,R++}M++}else if(D.isRectAreaLight){let q=e.get(D);q.color.copy(V).multiplyScalar(X),q.halfWidth.set(D.width*.5,0,0),q.halfHeight.set(0,D.height*.5,0),n.rectArea[C]=q,C++}else if(D.isPointLight){let q=e.get(D);if(q.color.copy(D.color).multiplyScalar(D.intensity),q.distance=D.distance,q.decay=D.decay,D.castShadow){let Q=D.shadow,ee=t.get(D);ee.shadowIntensity=Q.intensity,ee.shadowBias=Q.bias,ee.shadowNormalBias=Q.normalBias,ee.shadowRadius=Q.radius,ee.shadowMapSize=Q.mapSize,ee.shadowCameraNear=Q.camera.near,ee.shadowCameraFar=Q.camera.far,n.pointShadow[p]=ee,n.pointShadowMap[p]=K,n.pointShadowMatrix[p]=D.shadow.matrix,T++}n.point[p]=q,p++}else if(D.isHemisphereLight){let q=e.get(D);q.skyColor.copy(D.color).multiplyScalar(X),q.groundColor.copy(D.groundColor).multiplyScalar(X),n.hemi[v]=q,v++}}C>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=_e.LTC_FLOAT_1,n.rectAreaLTC2=_e.LTC_FLOAT_2):(n.rectAreaLTC1=_e.LTC_HALF_1,n.rectAreaLTC2=_e.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let N=n.hash;(N.sunLength!==f||N.directionalLength!==g||N.pointLength!==p||N.spotLength!==M||N.rectAreaLength!==C||N.hemiLength!==v||N.numSunShadows!==m||N.numDirectionalShadows!==w||N.numPointShadows!==T||N.numSpotShadows!==R||N.numSpotMaps!==y||N.numLightProbes!==P)&&(n.sun.length=f,n.directional.length=g,n.spot.length=M,n.rectArea.length=C,n.point.length=p,n.hemi.length=v,n.sunShadow.length=m,n.sunShadowMap.length=m,n.sunShadowMatrix.length=x,n.sunShadowCascade.length=x,n.directionalShadow.length=w,n.directionalShadowMap.length=w,n.directionalShadowMatrix.length=w,n.pointShadow.length=T,n.pointShadowMap.length=T,n.pointShadowMatrix.length=T,n.spotShadow.length=R,n.spotShadowMap.length=R,n.spotLightMatrix.length=R+y-E,n.spotLightMap.length=y,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=P,N.sunLength=f,N.directionalLength=g,N.pointLength=p,N.spotLength=M,N.rectAreaLength=C,N.hemiLength=v,N.numSunShadows=m,N.numDirectionalShadows=w,N.numPointShadows=T,N.numSpotShadows=R,N.numSpotMaps=y,N.numLightProbes=P,n.version=XM++)}function c(l,h){let u=0,d=0,f=0,m=0,x=0,g=0,p=h.matrixWorldInverse;for(let M=0,C=l.length;M<C;M++){let v=l[M];if(v.isSunLight){let w=n.sun[u];w.direction.setFromMatrixPosition(v.matrixWorld),w.direction.transformDirection(p),u++}else if(v.isDirectionalLight){let w=n.directional[d];w.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(p),d++}else if(v.isSpotLight){let w=n.spot[m];w.position.setFromMatrixPosition(v.matrixWorld),w.position.applyMatrix4(p),w.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(p),m++}else if(v.isRectAreaLight){let w=n.rectArea[x];w.position.setFromMatrixPosition(v.matrixWorld),w.position.applyMatrix4(p),a.identity(),r.copy(v.matrixWorld),r.premultiply(p),a.extractRotation(r),w.halfWidth.set(v.width*.5,0,0),w.halfHeight.set(0,v.height*.5,0),w.halfWidth.applyMatrix4(a),w.halfHeight.applyMatrix4(a),x++}else if(v.isPointLight){let w=n.point[f];w.position.setFromMatrixPosition(v.matrixWorld),w.position.applyMatrix4(p),f++}else if(v.isHemisphereLight){let w=n.hemi[g];w.direction.setFromMatrixPosition(v.matrixWorld),w.direction.transformDirection(p),g++}}}return{setup:o,setupView:c,state:n}}function wm(i){let e=new YM(i),t=[],n=[],s=[];function r(d){u.camera=d,t.length=0,n.length=0,s.length=0}function a(d){t.push(d)}function o(d){n.push(d)}function c(d){s.push(d)}function l(){e.setup(t)}function h(d){e.setupView(t,d)}let u={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:u,setupLights:l,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:c}}function $M(i){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new wm(i),e.set(s,[o])):r>=a.length?(o=new wm(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}var ZM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,JM=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,KM=[new I(1,0,0),new I(-1,0,0),new I(0,1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1)],jM=[new I(0,-1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1),new I(0,-1,0),new I(0,-1,0)],Am=new dt,Fa=new I,Du=new I;function QM(i,e,t){let n=new Js,s=new se,r=new se,a=new Pt,o=new lc,c=new hc,l={},h=t.maxTextureSize,u={[Ui]:jt,[jt]:Ui,[Nt]:Nt},d=new Ct({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new se},radius:{value:4}},vertexShader:ZM,fragmentShader:JM}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let m=new vt;m.setAttribute("position",new wt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new Ze(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=cs;let p=this.type;this.render=function(T,R,y){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||T.length===0)return;this.type===_p&&(Xe("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=cs);let E=i.getRenderTarget(),P=i.getActiveCubeFace(),N=i.getActiveMipmapLevel(),F=i.state;F.setBlending(Rn),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);let B=p!==this.type;B&&R.traverse(function(D){D.material&&(Array.isArray(D.material)?D.material.forEach(V=>V.needsUpdate=!0):D.material.needsUpdate=!0)});for(let D=0,V=T.length;D<V;D++){let X=T[D],z=X.shadow;if(z===void 0){Xe("WebGLShadowMap:",X,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;s.copy(z.mapSize);let K=z.getFrameExtents();s.multiply(K),r.copy(z.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/K.x),s.x=r.x*K.x,z.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/K.y),s.y=r.y*K.y,z.mapSize.y=r.y));let q=i.state.buffers.depth.getReversed();if(z.camera._reversedDepth=q,z.map===null||B===!0){if(z.map!==null&&(z.map.depthTexture!==null&&(z.map.depthTexture.dispose(),z.map.depthTexture=null),z.map.dispose()),this.type===rr){if(X.isPointLight){Xe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}z.map=new Bt(s.x,s.y,{format:zi,type:Qt,minFilter:Jt,magFilter:Jt,generateMipmaps:!1}),z.map.texture.name=X.name+".shadowMap",z.map.depthTexture=new Ri(s.x,s.y,Pn),z.map.depthTexture.name=X.name+".shadowMapDepth",z.map.depthTexture.format=Yn,z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=Yt,z.map.depthTexture.magFilter=Yt}else X.isPointLight?(z.map=new ml(s.x),z.map.depthTexture=new nc(s.x,Vn)):(z.map=new Bt(s.x,s.y),z.map.depthTexture=new Ri(s.x,s.y,Vn)),z.map.depthTexture.name=X.name+".shadowMap",z.map.depthTexture.format=Yn,this.type===cs?(z.map.depthTexture.compareFunction=q?dl:ul,z.map.depthTexture.minFilter=Jt,z.map.depthTexture.magFilter=Jt):(z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=Yt,z.map.depthTexture.magFilter=Yt);z.camera.updateProjectionMatrix()}z.map.isWebGLCubeRenderTarget!==!0&&(z.map.width!==s.x||z.map.height!==s.y)&&z.map.setSize(s.x,s.y);let Q=z.map.isWebGLCubeRenderTarget?6:z.getViewportCount();X.isPointLight!==!0&&z.updateMatrices(X,y);for(let ee=0;ee<Q;ee++){let Ue=z.getCamera(ee);if(X.isPointLight){let Re=z.camera,ut=z.matrix,st=X.distance||Re.far;st!==Re.far&&(Re.far=st,Re.updateProjectionMatrix()),Fa.setFromMatrixPosition(X.matrixWorld),Re.position.copy(Fa),Du.copy(Re.position),Du.add(KM[ee]),Re.up.copy(jM[ee]),Re.lookAt(Du),Re.updateMatrixWorld(),ut.makeTranslation(-Fa.x,-Fa.y,-Fa.z),Am.multiplyMatrices(Re.projectionMatrix,Re.matrixWorldInverse),z._frustum.setFromProjectionMatrix(Am,Re.coordinateSystem,Re.reversedDepth)}if(z.map.isWebGLCubeRenderTarget)i.setRenderTarget(z.map,ee),i.clear();else{ee===0&&(i.setRenderTarget(z.map),i.clear());let Re=z.getViewport(ee);a.set(r.x*Re.x,r.y*Re.y,r.x*Re.z,r.y*Re.w),F.viewport(a)}n=z.getFrustum(ee),v(R,y,Ue,X,this.type)}z.isPointLightShadow!==!0&&this.type===rr&&M(z,y),z.needsUpdate=!1}p=this.type,g.needsUpdate=!1,i.setRenderTarget(E,P,N)};function M(T,R){let y=e.update(x);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null?T.mapPass=new Bt(s.x,s.y,{format:zi,type:Qt}):(T.mapPass.width!==T.map.width||T.mapPass.height!==T.map.height)&&T.mapPass.setSize(T.map.width,T.map.height),d.uniforms.shadow_pass.value=T.map.depthTexture,d.uniforms.resolution.value.set(T.map.width,T.map.height),d.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(R,null,y,d,x,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value.set(T.map.width,T.map.height),f.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(R,null,y,f,x,null)}function C(T,R,y,E){let P=null,N=y.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(N!==void 0)P=N;else if(P=y.isPointLight===!0?c:o,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){let F=P.uuid,B=R.uuid,D=l[F];D===void 0&&(D={},l[F]=D);let V=D[B];V===void 0&&(V=P.clone(),D[B]=V,R.addEventListener("dispose",w)),P=V}if(P.visible=R.visible,P.wireframe=R.wireframe,E===rr?P.side=R.shadowSide!==null?R.shadowSide:R.side:P.side=R.shadowSide!==null?R.shadowSide:u[R.side],P.alphaMap=R.alphaMap,P.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,P.map=R.map,P.clipShadows=R.clipShadows,P.clippingPlanes=R.clippingPlanes,P.clipIntersection=R.clipIntersection,P.displacementMap=R.displacementMap,P.displacementScale=R.displacementScale,P.displacementBias=R.displacementBias,P.wireframeLinewidth=R.wireframeLinewidth,P.linewidth=R.linewidth,y.isPointLight===!0&&P.isMeshDistanceMaterial===!0){let F=i.properties.get(P);F.light=y}return P}function v(T,R,y,E,P){if(T.visible===!1)return;if(T.layers.test(R.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&P===rr)&&(!T.frustumCulled||T.intersectsFrustum(n))){T.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,T.matrixWorld);let B=e.update(T),D=T.material;if(Array.isArray(D)){let V=B.groups;for(let X=0,z=V.length;X<z;X++){let K=V[X],q=D[K.materialIndex];if(q&&q.visible){let Q=C(T,q,E,P);T.onBeforeShadow(i,T,R,y,B,Q,K),i.renderBufferDirect(y,null,B,Q,T,K),T.onAfterShadow(i,T,R,y,B,Q,K)}}}else if(D.visible){let V=C(T,D,E,P);T.onBeforeShadow(i,T,R,y,B,V,null),i.renderBufferDirect(y,null,B,V,T,null),T.onAfterShadow(i,T,R,y,B,V,null)}}let F=T.children;for(let B=0,D=F.length;B<D;B++)v(F[B],R,y,E,P)}function w(T){T.target.removeEventListener("dispose",w);for(let y in l){let E=l[y],P=T.target.uuid;P in E&&(E[P].dispose(),delete E[P])}}}function eb(i,e){function t(){let O=!1,me=new Pt,j=null,ge=new Pt(0,0,0,0);return{setMask:function(be){j!==be&&!O&&(i.colorMask(be,be,be,be),j=be)},setLocked:function(be){O=be},setClear:function(be,re,ke,De,bt){bt===!0&&(be*=De,re*=De,ke*=De),me.set(be,re,ke,De),ge.equals(me)===!1&&(i.clearColor(be,re,ke,De),ge.copy(me))},reset:function(){O=!1,j=null,ge.set(-1,0,0,0)}}}function n(){let O=!1,me=!1,j=null,ge=null,be=null;return{setReversed:function(re){if(me!==re){let ke=e.get("EXT_clip_control");re?ke.clipControlEXT(ke.LOWER_LEFT_EXT,ke.ZERO_TO_ONE_EXT):ke.clipControlEXT(ke.LOWER_LEFT_EXT,ke.NEGATIVE_ONE_TO_ONE_EXT),me=re;let De=be;be=null,this.setClear(De)}},getReversed:function(){return me},setTest:function(re){re?ne(i.DEPTH_TEST):ye(i.DEPTH_TEST)},setMask:function(re){j!==re&&!O&&(i.depthMask(re),j=re)},setFunc:function(re){if(me&&(re=jp[re]),ge!==re){switch(re){case zo:i.depthFunc(i.NEVER);break;case Bo:i.depthFunc(i.ALWAYS);break;case Vo:i.depthFunc(i.LESS);break;case Ws:i.depthFunc(i.LEQUAL);break;case Ho:i.depthFunc(i.EQUAL);break;case Go:i.depthFunc(i.GEQUAL);break;case Wo:i.depthFunc(i.GREATER);break;case Xo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ge=re}},setLocked:function(re){O=re},setClear:function(re){be!==re&&(be=re,me&&(re=1-re),i.clearDepth(re))},reset:function(){O=!1,j=null,ge=null,be=null,me=!1}}}function s(){let O=!1,me=null,j=null,ge=null,be=null,re=null,ke=null,De=null,bt=null;return{setTest:function(pt){O||(pt?ne(i.STENCIL_TEST):ye(i.STENCIL_TEST))},setMask:function(pt){me!==pt&&!O&&(i.stencilMask(pt),me=pt)},setFunc:function(pt,Nn,Hn){(j!==pt||ge!==Nn||be!==Hn)&&(i.stencilFunc(pt,Nn,Hn),j=pt,ge=Nn,be=Hn)},setOp:function(pt,Nn,Hn){(re!==pt||ke!==Nn||De!==Hn)&&(i.stencilOp(pt,Nn,Hn),re=pt,ke=Nn,De=Hn)},setLocked:function(pt){O=pt},setClear:function(pt){bt!==pt&&(i.clearStencil(pt),bt=pt)},reset:function(){O=!1,me=null,j=null,ge=null,be=null,re=null,ke=null,De=null,bt=null}}}let r=new t,a=new n,o=new s,c=new WeakMap,l=new WeakMap,h={},u={},d={},f=new WeakMap,m=[],x=null,g=!1,p=null,M=null,C=null,v=null,w=null,T=null,R=null,y=new Te(0,0,0),E=0,P=!1,N=null,F=null,B=null,D=null,V=null,X=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),z=!1,K=0,q=i.getParameter(i.VERSION);q.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(q)[1]),z=K>=1):q.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),z=K>=2);let Q=null,ee={},Ue=i.getParameter(i.SCISSOR_BOX),Re=i.getParameter(i.VIEWPORT),ut=new Pt().fromArray(Ue),st=new Pt().fromArray(Re);function ct(O,me,j,ge){let be=new Uint8Array(4),re=i.createTexture();i.bindTexture(O,re),i.texParameteri(O,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(O,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ke=0;ke<j;ke++)O===i.TEXTURE_3D||O===i.TEXTURE_2D_ARRAY?i.texImage3D(me,0,i.RGBA,1,1,ge,0,i.RGBA,i.UNSIGNED_BYTE,be):i.texImage2D(me+ke,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,be);return re}let J={};J[i.TEXTURE_2D]=ct(i.TEXTURE_2D,i.TEXTURE_2D,1),J[i.TEXTURE_CUBE_MAP]=ct(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),J[i.TEXTURE_2D_ARRAY]=ct(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),J[i.TEXTURE_3D]=ct(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ne(i.DEPTH_TEST),a.setFunc(Ws),le(!1),de(su),ne(i.CULL_FACE),ae(Rn);function ne(O){h[O]!==!0&&(i.enable(O),h[O]=!0)}function ye(O){h[O]!==!1&&(i.disable(O),h[O]=!1)}function qe(O,me){return d[O]!==me?(i.bindFramebuffer(O,me),d[O]=me,O===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=me),O===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=me),!0):!1}function Se(O,me){let j=m,ge=!1;if(O){j=f.get(me),j===void 0&&(j=[],f.set(me,j));let be=O.textures;if(j.length!==be.length||j[0]!==i.COLOR_ATTACHMENT0){for(let re=0,ke=be.length;re<ke;re++)j[re]=i.COLOR_ATTACHMENT0+re;j.length=be.length,ge=!0}}else j[0]!==i.BACK&&(j[0]=i.BACK,ge=!0);ge&&i.drawBuffers(j)}function Ye(O){return x!==O?(i.useProgram(O),x=O,!0):!1}let xt={[ls]:i.FUNC_ADD,[vp]:i.FUNC_SUBTRACT,[Mp]:i.FUNC_REVERSE_SUBTRACT};xt[bp]=i.MIN,xt[Sp]=i.MAX;let ie={[Tp]:i.ZERO,[Ep]:i.ONE,[wp]:i.SRC_COLOR,[ou]:i.SRC_ALPHA,[Lp]:i.SRC_ALPHA_SATURATE,[Pp]:i.DST_COLOR,[Cp]:i.DST_ALPHA,[Ap]:i.ONE_MINUS_SRC_COLOR,[cu]:i.ONE_MINUS_SRC_ALPHA,[Ip]:i.ONE_MINUS_DST_COLOR,[Rp]:i.ONE_MINUS_DST_ALPHA,[Dp]:i.CONSTANT_COLOR,[Np]:i.ONE_MINUS_CONSTANT_COLOR,[Up]:i.CONSTANT_ALPHA,[Op]:i.ONE_MINUS_CONSTANT_ALPHA};function ae(O,me,j,ge,be,re,ke,De,bt,pt){if(O===Rn){g===!0&&(ye(i.BLEND),g=!1);return}if(g===!1&&(ne(i.BLEND),g=!0),O!==yp){if(O!==p||pt!==P){if((M!==ls||w!==ls)&&(i.blendEquation(i.FUNC_ADD),M=ls,w=ls),pt)switch(O){case ar:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case It:i.blendFunc(i.ONE,i.ONE);break;case ru:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case au:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:We("WebGLState: Invalid blending: ",O);break}else switch(O){case ar:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case It:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case ru:We("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case au:We("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:We("WebGLState: Invalid blending: ",O);break}C=null,v=null,T=null,R=null,y.set(0,0,0),E=0,p=O,P=pt}return}be=be||me,re=re||j,ke=ke||ge,(me!==M||be!==w)&&(i.blendEquationSeparate(xt[me],xt[be]),M=me,w=be),(j!==C||ge!==v||re!==T||ke!==R)&&(i.blendFuncSeparate(ie[j],ie[ge],ie[re],ie[ke]),C=j,v=ge,T=re,R=ke),(De.equals(y)===!1||bt!==E)&&(i.blendColor(De.r,De.g,De.b,bt),y.copy(De),E=bt),p=O,P=!1}function ce(O,me){O.side===Nt?ye(i.CULL_FACE):ne(i.CULL_FACE);let j=O.side===jt;me&&(j=!j),le(j),O.blending===ar&&O.transparent===!1?ae(Rn):ae(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),a.setFunc(O.depthFunc),a.setTest(O.depthTest),a.setMask(O.depthWrite),r.setMask(O.colorWrite);let ge=O.stencilWrite;o.setTest(ge),ge&&(o.setMask(O.stencilWriteMask),o.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),o.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),Be(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?ne(i.SAMPLE_ALPHA_TO_COVERAGE):ye(i.SAMPLE_ALPHA_TO_COVERAGE)}function le(O){N!==O&&(O?i.frontFace(i.CW):i.frontFace(i.CCW),N=O)}function de(O){O!==gp?(ne(i.CULL_FACE),O!==F&&(O===su?i.cullFace(i.BACK):O===xp?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ye(i.CULL_FACE),F=O}function He(O){O!==B&&(z&&i.lineWidth(O),B=O)}function Be(O,me,j){O?(ne(i.POLYGON_OFFSET_FILL),(D!==me||V!==j)&&(D=me,V=j,a.getReversed()&&(me=-me),i.polygonOffset(me,j))):ye(i.POLYGON_OFFSET_FILL)}function $e(O){O?ne(i.SCISSOR_TEST):ye(i.SCISSOR_TEST)}function Ke(O){O===void 0&&(O=i.TEXTURE0+X-1),Q!==O&&(i.activeTexture(O),Q=O)}function L(O,me,j){j===void 0&&(Q===null?j=i.TEXTURE0+X-1:j=Q);let ge=ee[j];ge===void 0&&(ge={type:void 0,texture:void 0},ee[j]=ge),(ge.type!==O||ge.texture!==me)&&(Q!==j&&(i.activeTexture(j),Q=j),i.bindTexture(O,me||J[O]),ge.type=O,ge.texture=me)}function ft(){let O=ee[Q];O!==void 0&&O.type!==void 0&&(i.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function rt(){try{i.compressedTexImage2D(...arguments)}catch(O){We("WebGLState:",O)}}function A(){try{i.compressedTexImage3D(...arguments)}catch(O){We("WebGLState:",O)}}function _(){try{i.texSubImage2D(...arguments)}catch(O){We("WebGLState:",O)}}function k(){try{i.texSubImage3D(...arguments)}catch(O){We("WebGLState:",O)}}function W(){try{i.compressedTexSubImage2D(...arguments)}catch(O){We("WebGLState:",O)}}function $(){try{i.compressedTexSubImage3D(...arguments)}catch(O){We("WebGLState:",O)}}function he(){try{i.texStorage2D(...arguments)}catch(O){We("WebGLState:",O)}}function ue(){try{i.texStorage3D(...arguments)}catch(O){We("WebGLState:",O)}}function Z(){try{i.texImage2D(...arguments)}catch(O){We("WebGLState:",O)}}function te(){try{i.texImage3D(...arguments)}catch(O){We("WebGLState:",O)}}function fe(O){return u[O]!==void 0?u[O]:i.getParameter(O)}function Oe(O,me){u[O]!==me&&(i.pixelStorei(O,me),u[O]=me)}function xe(O){ut.equals(O)===!1&&(i.scissor(O.x,O.y,O.z,O.w),ut.copy(O))}function pe(O){st.equals(O)===!1&&(i.viewport(O.x,O.y,O.z,O.w),st.copy(O))}function Fe(O,me){let j=l.get(me);j===void 0&&(j=new WeakMap,l.set(me,j));let ge=j.get(O);ge===void 0&&(ge=i.getUniformBlockIndex(me,O.name),j.set(O,ge))}function Ge(O,me){let ge=l.get(me).get(O);c.get(me)!==ge&&(i.uniformBlockBinding(me,ge,O.__bindingPointIndex),c.set(me,ge))}function je(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},u={},Q=null,ee={},d={},f=new WeakMap,m=[],x=null,g=!1,p=null,M=null,C=null,v=null,w=null,T=null,R=null,y=new Te(0,0,0),E=0,P=!1,N=null,F=null,B=null,D=null,V=null,ut.set(0,0,i.canvas.width,i.canvas.height),st.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ne,disable:ye,bindFramebuffer:qe,drawBuffers:Se,useProgram:Ye,setBlending:ae,setMaterial:ce,setFlipSided:le,setCullFace:de,setLineWidth:He,setPolygonOffset:Be,setScissorTest:$e,activeTexture:Ke,bindTexture:L,unbindTexture:ft,compressedTexImage2D:rt,compressedTexImage3D:A,texImage2D:Z,texImage3D:te,pixelStorei:Oe,getParameter:fe,updateUBOMapping:Fe,uniformBlockBinding:Ge,texStorage2D:he,texStorage3D:ue,texSubImage2D:_,texSubImage3D:k,compressedTexSubImage2D:W,compressedTexSubImage3D:$,scissor:xe,viewport:pe,reset:je}}function tb(i,e,t,n,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new se,h=new WeakMap,u=new Set,d,f=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(A,_){return m?new OffscreenCanvas(A,_):Hr("canvas")}function g(A,_,k){let W=1,$=rt(A);if(($.width>k||$.height>k)&&(W=k/Math.max($.width,$.height)),W<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){let he=Math.floor(W*$.width),ue=Math.floor(W*$.height);d===void 0&&(d=x(he,ue));let Z=_?x(he,ue):d;return Z.width=he,Z.height=ue,Z.getContext("2d").drawImage(A,0,0,he,ue),Xe("WebGLRenderer: Texture has been resized from ("+$.width+"x"+$.height+") to ("+he+"x"+ue+")."),Z}else return"data"in A&&Xe("WebGLRenderer: Image in DataTexture is too big ("+$.width+"x"+$.height+")."),A;return A}function p(A){return A.generateMipmaps}function M(A){i.generateMipmap(A)}function C(A){return A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?i.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(A,_,k,W,$,he=!1){if(A!==null){if(i[A]!==void 0)return i[A];Xe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let ue;W&&(ue=e.get("EXT_texture_norm16"),ue||Xe("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Z=_;if(_===i.RED&&(k===i.FLOAT&&(Z=i.R32F),k===i.HALF_FLOAT&&(Z=i.R16F),k===i.UNSIGNED_BYTE&&(Z=i.R8),k===i.UNSIGNED_SHORT&&ue&&(Z=ue.R16_EXT),k===i.SHORT&&ue&&(Z=ue.R16_SNORM_EXT)),_===i.RED_INTEGER&&(k===i.UNSIGNED_BYTE&&(Z=i.R8UI),k===i.UNSIGNED_SHORT&&(Z=i.R16UI),k===i.UNSIGNED_INT&&(Z=i.R32UI),k===i.BYTE&&(Z=i.R8I),k===i.SHORT&&(Z=i.R16I),k===i.INT&&(Z=i.R32I)),_===i.RG&&(k===i.FLOAT&&(Z=i.RG32F),k===i.HALF_FLOAT&&(Z=i.RG16F),k===i.UNSIGNED_BYTE&&(Z=i.RG8),k===i.UNSIGNED_SHORT&&ue&&(Z=ue.RG16_EXT),k===i.SHORT&&ue&&(Z=ue.RG16_SNORM_EXT)),_===i.RG_INTEGER&&(k===i.UNSIGNED_BYTE&&(Z=i.RG8UI),k===i.UNSIGNED_SHORT&&(Z=i.RG16UI),k===i.UNSIGNED_INT&&(Z=i.RG32UI),k===i.BYTE&&(Z=i.RG8I),k===i.SHORT&&(Z=i.RG16I),k===i.INT&&(Z=i.RG32I)),_===i.RGB_INTEGER&&(k===i.UNSIGNED_BYTE&&(Z=i.RGB8UI),k===i.UNSIGNED_SHORT&&(Z=i.RGB16UI),k===i.UNSIGNED_INT&&(Z=i.RGB32UI),k===i.BYTE&&(Z=i.RGB8I),k===i.SHORT&&(Z=i.RGB16I),k===i.INT&&(Z=i.RGB32I)),_===i.RGBA_INTEGER&&(k===i.UNSIGNED_BYTE&&(Z=i.RGBA8UI),k===i.UNSIGNED_SHORT&&(Z=i.RGBA16UI),k===i.UNSIGNED_INT&&(Z=i.RGBA32UI),k===i.BYTE&&(Z=i.RGBA8I),k===i.SHORT&&(Z=i.RGBA16I),k===i.INT&&(Z=i.RGBA32I)),_===i.RGB&&(k===i.UNSIGNED_SHORT&&ue&&(Z=ue.RGB16_EXT),k===i.SHORT&&ue&&(Z=ue.RGB16_SNORM_EXT),k===i.UNSIGNED_INT_5_9_9_9_REV&&(Z=i.RGB9_E5),k===i.UNSIGNED_INT_10F_11F_11F_REV&&(Z=i.R11F_G11F_B10F)),_===i.RGBA){let te=he?Vr:it.getTransfer($);k===i.FLOAT&&(Z=i.RGBA32F),k===i.HALF_FLOAT&&(Z=i.RGBA16F),k===i.UNSIGNED_BYTE&&(Z=te===ht?i.SRGB8_ALPHA8:i.RGBA8),k===i.UNSIGNED_SHORT&&ue&&(Z=ue.RGBA16_EXT),k===i.SHORT&&ue&&(Z=ue.RGBA16_SNORM_EXT),k===i.UNSIGNED_SHORT_4_4_4_4&&(Z=i.RGBA4),k===i.UNSIGNED_SHORT_5_5_5_1&&(Z=i.RGB5_A1)}return(Z===i.R16F||Z===i.R32F||Z===i.RG16F||Z===i.RG32F||Z===i.RGBA16F||Z===i.RGBA32F)&&e.get("EXT_color_buffer_float"),Z}function w(A,_){let k;return A?_===null||_===Vn||_===cr?k=i.DEPTH24_STENCIL8:_===Pn?k=i.DEPTH32F_STENCIL8:_===or&&(k=i.DEPTH24_STENCIL8,Xe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===Vn||_===cr?k=i.DEPTH_COMPONENT24:_===Pn?k=i.DEPTH_COMPONENT32F:_===or&&(k=i.DEPTH_COMPONENT16),k}function T(A,_){return p(A)===!0||A.isFramebufferTexture&&A.minFilter!==Yt&&A.minFilter!==Jt?Math.log2(Math.max(_.width,_.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?_.mipmaps.length:1}function R(A){let _=A.target;_.removeEventListener("dispose",R),E(_),_.isVideoTexture&&h.delete(_),_.isHTMLTexture&&u.delete(_)}function y(A){let _=A.target;_.removeEventListener("dispose",y),N(_)}function E(A){let _=n.get(A);if(_.__webglInit===void 0)return;let k=A.source,W=f.get(k);if(W){let $=W[_.__cacheKey];$.usedTimes--,$.usedTimes===0&&P(A),Object.keys(W).length===0&&f.delete(k)}n.remove(A)}function P(A){let _=n.get(A);i.deleteTexture(_.__webglTexture);let k=A.source,W=f.get(k);delete W[_.__cacheKey],a.memory.textures--}function N(A){let _=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let W=0;W<6;W++){if(Array.isArray(_.__webglFramebuffer[W]))for(let $=0;$<_.__webglFramebuffer[W].length;$++)i.deleteFramebuffer(_.__webglFramebuffer[W][$]);else i.deleteFramebuffer(_.__webglFramebuffer[W]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[W])}else{if(Array.isArray(_.__webglFramebuffer))for(let W=0;W<_.__webglFramebuffer.length;W++)i.deleteFramebuffer(_.__webglFramebuffer[W]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let W=0;W<_.__webglColorRenderbuffer.length;W++)_.__webglColorRenderbuffer[W]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[W]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}let k=A.textures;for(let W=0,$=k.length;W<$;W++){let he=n.get(k[W]);he.__webglTexture&&(i.deleteTexture(he.__webglTexture),a.memory.textures--),n.remove(k[W])}n.remove(A)}let F=0;function B(){F=0}function D(){return F}function V(A){F=A}function X(){let A=F;return A>=s.maxTextures&&Xe("WebGLTextures: Trying to use "+(A+1)+" texture units while this GPU supports only "+s.maxTextures),F+=1,A}function z(A){let _=[];return _.push(A.wrapS),_.push(A.wrapT),_.push(A.wrapR||0),_.push(A.magFilter),_.push(A.minFilter),_.push(A.anisotropy),_.push(A.internalFormat),_.push(A.format),_.push(A.type),_.push(A.generateMipmaps),_.push(A.premultiplyAlpha),_.push(A.flipY),_.push(A.unpackAlignment),_.push(A.colorSpace),_.join()}function K(A,_){let k=n.get(A);if(A.isVideoTexture&&L(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&k.__version!==A.version){let W=A.image;if(W===null)Xe("WebGLRenderer: Texture marked for update but no image data found.");else if(W.complete===!1)Xe("WebGLRenderer: Texture marked for update but image is incomplete");else{ye(k,A,_);return}}else A.isExternalTexture&&(k.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,k.__webglTexture,i.TEXTURE0+_)}function q(A,_){let k=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&k.__version!==A.version){ye(k,A,_);return}else A.isExternalTexture&&(k.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,k.__webglTexture,i.TEXTURE0+_)}function Q(A,_){let k=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&k.__version!==A.version){ye(k,A,_);return}t.bindTexture(i.TEXTURE_3D,k.__webglTexture,i.TEXTURE0+_)}function ee(A,_){let k=n.get(A);if(A.isCubeDepthTexture!==!0&&A.version>0&&k.__version!==A.version){qe(k,A,_);return}t.bindTexture(i.TEXTURE_CUBE_MAP,k.__webglTexture,i.TEXTURE0+_)}let Ue={[qo]:i.REPEAT,[qn]:i.CLAMP_TO_EDGE,[Yo]:i.MIRRORED_REPEAT},Re={[Yt]:i.NEAREST,[zp]:i.NEAREST_MIPMAP_NEAREST,[Ca]:i.NEAREST_MIPMAP_LINEAR,[Jt]:i.LINEAR,[Ac]:i.LINEAR_MIPMAP_NEAREST,[Fi]:i.LINEAR_MIPMAP_LINEAR},ut={[Gp]:i.NEVER,[$p]:i.ALWAYS,[Wp]:i.LESS,[ul]:i.LEQUAL,[Xp]:i.EQUAL,[dl]:i.GEQUAL,[qp]:i.GREATER,[Yp]:i.NOTEQUAL};function st(A,_){if(_.type===Pn&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===Jt||_.magFilter===Ac||_.magFilter===Ca||_.magFilter===Fi||_.minFilter===Jt||_.minFilter===Ac||_.minFilter===Ca||_.minFilter===Fi)&&Xe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(A,i.TEXTURE_WRAP_S,Ue[_.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,Ue[_.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,Ue[_.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,Re[_.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,Re[_.minFilter]),_.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,ut[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===Yt||_.minFilter!==Ca&&_.minFilter!==Fi||_.type===Pn&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){let k=e.get("EXT_texture_filter_anisotropic");i.texParameterf(A,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function ct(A,_){let k=!1;A.__webglInit===void 0&&(A.__webglInit=!0,_.addEventListener("dispose",R));let W=_.source,$=f.get(W);$===void 0&&($={},f.set(W,$));let he=z(_);if(he!==A.__cacheKey){$[he]===void 0&&($[he]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,k=!0),$[he].usedTimes++;let ue=$[A.__cacheKey];ue!==void 0&&($[A.__cacheKey].usedTimes--,ue.usedTimes===0&&P(_)),A.__cacheKey=he,A.__webglTexture=$[he].texture}return k}function J(A,_,k){return Math.floor(Math.floor(A/k)/_)}function ne(A,_,k,W){let he=A.updateRanges;if(he.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,_.width,_.height,k,W,_.data);else{he.sort((Oe,xe)=>Oe.start-xe.start);let ue=0;for(let Oe=1;Oe<he.length;Oe++){let xe=he[ue],pe=he[Oe],Fe=xe.start+xe.count,Ge=J(pe.start,_.width,4),je=J(xe.start,_.width,4);pe.start<=Fe+1&&Ge===je&&J(pe.start+pe.count-1,_.width,4)===Ge?xe.count=Math.max(xe.count,pe.start+pe.count-xe.start):(++ue,he[ue]=pe)}he.length=ue+1;let Z=t.getParameter(i.UNPACK_ROW_LENGTH),te=t.getParameter(i.UNPACK_SKIP_PIXELS),fe=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,_.width);for(let Oe=0,xe=he.length;Oe<xe;Oe++){let pe=he[Oe],Fe=Math.floor(pe.start/4),Ge=Math.ceil(pe.count/4),je=Fe%_.width,O=Math.floor(Fe/_.width),me=Ge,j=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,je),t.pixelStorei(i.UNPACK_SKIP_ROWS,O),t.texSubImage2D(i.TEXTURE_2D,0,je,O,me,j,k,W,_.data)}A.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,Z),t.pixelStorei(i.UNPACK_SKIP_PIXELS,te),t.pixelStorei(i.UNPACK_SKIP_ROWS,fe)}}function ye(A,_,k){let W=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(W=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(W=i.TEXTURE_3D);let $=ct(A,_),he=_.source;t.bindTexture(W,A.__webglTexture,i.TEXTURE0+k);let ue=n.get(he);if(he.version!==ue.__version||$===!0){if(t.activeTexture(i.TEXTURE0+k),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){let j=it.getPrimaries(it.workingColorSpace),ge=_.colorSpace===xi?null:it.getPrimaries(_.colorSpace),be=_.colorSpace===xi||j===ge?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,be)}t.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment);let te=g(_.image,!1,s.maxTextureSize);te=ft(_,te);let fe=r.convert(_.format,_.colorSpace),Oe=r.convert(_.type),xe=v(_.internalFormat,fe,Oe,_.normalized,_.colorSpace,_.isVideoTexture);st(W,_);let pe,Fe=_.mipmaps,Ge=_.isVideoTexture!==!0,je=ue.__version===void 0||$===!0,O=he.dataReady,me=T(_,te);if(_.isDepthTexture)xe=w(_.format===ki,_.type),je&&(Ge?t.texStorage2D(i.TEXTURE_2D,1,xe,te.width,te.height):t.texImage2D(i.TEXTURE_2D,0,xe,te.width,te.height,0,fe,Oe,null));else if(_.isDataTexture)if(Fe.length>0){Ge&&je&&t.texStorage2D(i.TEXTURE_2D,me,xe,Fe[0].width,Fe[0].height);for(let j=0,ge=Fe.length;j<ge;j++)pe=Fe[j],Ge?O&&t.texSubImage2D(i.TEXTURE_2D,j,0,0,pe.width,pe.height,fe,Oe,pe.data):t.texImage2D(i.TEXTURE_2D,j,xe,pe.width,pe.height,0,fe,Oe,pe.data);_.generateMipmaps=!1}else Ge?(je&&t.texStorage2D(i.TEXTURE_2D,me,xe,te.width,te.height),O&&ne(_,te,fe,Oe)):t.texImage2D(i.TEXTURE_2D,0,xe,te.width,te.height,0,fe,Oe,te.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){Ge&&je&&t.texStorage3D(i.TEXTURE_2D_ARRAY,me,xe,Fe[0].width,Fe[0].height,te.depth);for(let j=0,ge=Fe.length;j<ge;j++)if(pe=Fe[j],_.format!==In)if(fe!==null)if(Ge){if(O)if(_.layerUpdates.size>0){let be=bu(pe.width,pe.height,_.format,_.type);for(let re of _.layerUpdates){let ke=pe.data.subarray(re*be/pe.data.BYTES_PER_ELEMENT,(re+1)*be/pe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,re,pe.width,pe.height,1,fe,ke)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,pe.width,pe.height,te.depth,fe,pe.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,j,xe,pe.width,pe.height,te.depth,0,pe.data,0,0);else Xe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ge?O&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,pe.width,pe.height,te.depth,fe,Oe,pe.data):t.texImage3D(i.TEXTURE_2D_ARRAY,j,xe,pe.width,pe.height,te.depth,0,fe,Oe,pe.data);_.layerUpdates.size>0&&_.clearLayerUpdates()}else{Ge&&je&&t.texStorage2D(i.TEXTURE_2D,me,xe,Fe[0].width,Fe[0].height);for(let j=0,ge=Fe.length;j<ge;j++)pe=Fe[j],_.format!==In?fe!==null?Ge?O&&t.compressedTexSubImage2D(i.TEXTURE_2D,j,0,0,pe.width,pe.height,fe,pe.data):t.compressedTexImage2D(i.TEXTURE_2D,j,xe,pe.width,pe.height,0,pe.data):Xe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ge?O&&t.texSubImage2D(i.TEXTURE_2D,j,0,0,pe.width,pe.height,fe,Oe,pe.data):t.texImage2D(i.TEXTURE_2D,j,xe,pe.width,pe.height,0,fe,Oe,pe.data)}else if(_.isDataArrayTexture)if(Ge){if(je&&t.texStorage3D(i.TEXTURE_2D_ARRAY,me,xe,te.width,te.height,te.depth),O)if(_.layerUpdates.size>0){let j=bu(te.width,te.height,_.format,_.type);for(let ge of _.layerUpdates){let be=te.data.subarray(ge*j/te.data.BYTES_PER_ELEMENT,(ge+1)*j/te.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ge,te.width,te.height,1,fe,Oe,be)}_.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,te.width,te.height,te.depth,fe,Oe,te.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,xe,te.width,te.height,te.depth,0,fe,Oe,te.data);else if(_.isData3DTexture)Ge?(je&&t.texStorage3D(i.TEXTURE_3D,me,xe,te.width,te.height,te.depth),O&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,te.width,te.height,te.depth,fe,Oe,te.data)):t.texImage3D(i.TEXTURE_3D,0,xe,te.width,te.height,te.depth,0,fe,Oe,te.data);else if(_.isFramebufferTexture){if(je)if(Ge)t.texStorage2D(i.TEXTURE_2D,me,xe,te.width,te.height);else{let j=te.width,ge=te.height;for(let be=0;be<me;be++)t.texImage2D(i.TEXTURE_2D,be,xe,j,ge,0,fe,Oe,null),j>>=1,ge>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in i){let j=i.canvas;if(j.hasAttribute("layoutsubtree")||j.setAttribute("layoutsubtree","true"),te.parentNode!==j){j.appendChild(te),u.add(_),j.onpaint=ge=>{let be=ge.changedElements;for(let re of u)be.includes(re.image)&&(re.needsUpdate=!0)},j.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,te);else{let be=i.RGBA,re=i.RGBA,ke=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,be,re,ke,te)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Fe.length>0){if(Ge&&je){let j=rt(Fe[0]);t.texStorage2D(i.TEXTURE_2D,me,xe,j.width,j.height)}for(let j=0,ge=Fe.length;j<ge;j++)pe=Fe[j],Ge?O&&t.texSubImage2D(i.TEXTURE_2D,j,0,0,fe,Oe,pe):t.texImage2D(i.TEXTURE_2D,j,xe,fe,Oe,pe);_.generateMipmaps=!1}else if(Ge){if(je){let j=rt(te);t.texStorage2D(i.TEXTURE_2D,me,xe,j.width,j.height)}O&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,fe,Oe,te)}else t.texImage2D(i.TEXTURE_2D,0,xe,fe,Oe,te);p(_)&&M(W),ue.__version=he.version,_.onUpdate&&_.onUpdate(_)}A.__version=_.version}function qe(A,_,k){if(_.image.length!==6)return;let W=ct(A,_),$=_.source;t.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+k);let he=n.get($);if($.version!==he.__version||W===!0){t.activeTexture(i.TEXTURE0+k);let ue=it.getPrimaries(it.workingColorSpace),Z=_.colorSpace===xi?null:it.getPrimaries(_.colorSpace),te=_.colorSpace===xi||ue===Z?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,te);let fe=_.isCompressedTexture||_.image[0].isCompressedTexture,Oe=_.image[0]&&_.image[0].isDataTexture,xe=[];for(let re=0;re<6;re++)!fe&&!Oe?xe[re]=g(_.image[re],!0,s.maxCubemapSize):xe[re]=Oe?_.image[re].image:_.image[re],xe[re]=ft(_,xe[re]);let pe=xe[0],Fe=r.convert(_.format,_.colorSpace),Ge=r.convert(_.type),je=v(_.internalFormat,Fe,Ge,_.normalized,_.colorSpace),O=_.isVideoTexture!==!0,me=he.__version===void 0||W===!0,j=$.dataReady,ge=T(_,pe);st(i.TEXTURE_CUBE_MAP,_);let be;if(fe){O&&me&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ge,je,pe.width,pe.height);for(let re=0;re<6;re++){be=xe[re].mipmaps;for(let ke=0;ke<be.length;ke++){let De=be[ke];_.format!==In?Fe!==null?O?j&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,ke,0,0,De.width,De.height,Fe,De.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,ke,je,De.width,De.height,0,De.data):Xe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):O?j&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,ke,0,0,De.width,De.height,Fe,Ge,De.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,ke,je,De.width,De.height,0,Fe,Ge,De.data)}}}else{if(be=_.mipmaps,O&&me){be.length>0&&ge++;let re=rt(xe[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,ge,je,re.width,re.height)}for(let re=0;re<6;re++)if(Oe){O?j&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,xe[re].width,xe[re].height,Fe,Ge,xe[re].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,je,xe[re].width,xe[re].height,0,Fe,Ge,xe[re].data);for(let ke=0;ke<be.length;ke++){let bt=be[ke].image[re].image;O?j&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,ke+1,0,0,bt.width,bt.height,Fe,Ge,bt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,ke+1,je,bt.width,bt.height,0,Fe,Ge,bt.data)}}else{O?j&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,Fe,Ge,xe[re]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,je,Fe,Ge,xe[re]);for(let ke=0;ke<be.length;ke++){let De=be[ke];O?j&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,ke+1,0,0,Fe,Ge,De.image[re]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,ke+1,je,Fe,Ge,De.image[re])}}}p(_)&&M(i.TEXTURE_CUBE_MAP),he.__version=$.version,_.onUpdate&&_.onUpdate(_)}A.__version=_.version}function Se(A,_,k,W,$,he){let ue=r.convert(k.format,k.colorSpace),Z=r.convert(k.type),te=v(k.internalFormat,ue,Z,k.normalized,k.colorSpace),fe=n.get(_),Oe=n.get(k);if(Oe.__renderTarget=_,!fe.__hasExternalTextures){let xe=Math.max(1,_.width>>he),pe=Math.max(1,_.height>>he);$===i.TEXTURE_3D||$===i.TEXTURE_2D_ARRAY?t.texImage3D($,he,te,xe,pe,_.depth,0,ue,Z,null):t.texImage2D($,he,te,xe,pe,0,ue,Z,null)}t.bindFramebuffer(i.FRAMEBUFFER,A),Ke(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,W,$,Oe.__webglTexture,0,$e(_)):($===i.TEXTURE_2D||$>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&$<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,W,$,Oe.__webglTexture,he),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ye(A,_,k){if(i.bindRenderbuffer(i.RENDERBUFFER,A),_.depthBuffer){let W=_.depthTexture,$=W&&W.isDepthTexture?W.type:null,he=w(_.stencilBuffer,$),ue=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;Ke(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,$e(_),he,_.width,_.height):k?i.renderbufferStorageMultisample(i.RENDERBUFFER,$e(_),he,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,he,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,ue,i.RENDERBUFFER,A)}else{let W=_.textures;for(let $=0;$<W.length;$++){let he=W[$],ue=r.convert(he.format,he.colorSpace),Z=r.convert(he.type),te=v(he.internalFormat,ue,Z,he.normalized,he.colorSpace);Ke(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,$e(_),te,_.width,_.height):k?i.renderbufferStorageMultisample(i.RENDERBUFFER,$e(_),te,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,te,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function xt(A,_,k){let W=_.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,A),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let $=n.get(_.depthTexture);if($.__renderTarget=_,(!$.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),W){if($.__webglInit===void 0&&($.__webglInit=!0,_.depthTexture.addEventListener("dispose",R)),$.__webglTexture===void 0){$.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),st(i.TEXTURE_CUBE_MAP,_.depthTexture);let fe=r.convert(_.depthTexture.format),Oe=r.convert(_.depthTexture.type),xe;_.depthTexture.format===Yn?xe=i.DEPTH_COMPONENT24:_.depthTexture.format===ki&&(xe=i.DEPTH24_STENCIL8);for(let pe=0;pe<6;pe++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,xe,_.width,_.height,0,fe,Oe,null)}}else K(_.depthTexture,0);let he=$.__webglTexture,ue=$e(_),Z=W?i.TEXTURE_CUBE_MAP_POSITIVE_X+k:i.TEXTURE_2D,te=_.depthTexture.format===ki?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(_.depthTexture.format===Yn)Ke(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,te,Z,he,0,ue):i.framebufferTexture2D(i.FRAMEBUFFER,te,Z,he,0);else if(_.depthTexture.format===ki)Ke(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,te,Z,he,0,ue):i.framebufferTexture2D(i.FRAMEBUFFER,te,Z,he,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ie(A){let _=n.get(A),k=A.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==A.depthTexture){let W=A.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),W){let $=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,W.removeEventListener("dispose",$)};W.addEventListener("dispose",$),_.__depthDisposeCallback=$}_.__boundDepthTexture=W}if(A.depthTexture&&!_.__autoAllocateDepthBuffer)if(k)for(let W=0;W<6;W++)xt(_.__webglFramebuffer[W],A,W);else{let W=A.texture.mipmaps;W&&W.length>0?xt(_.__webglFramebuffer[0],A,0):xt(_.__webglFramebuffer,A,0)}else if(k){_.__webglDepthbuffer=[];for(let W=0;W<6;W++)if(t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[W]),_.__webglDepthbuffer[W]===void 0)_.__webglDepthbuffer[W]=i.createRenderbuffer(),Ye(_.__webglDepthbuffer[W],A,!1);else{let $=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,he=_.__webglDepthbuffer[W];i.bindRenderbuffer(i.RENDERBUFFER,he),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,he)}}else{let W=A.texture.mipmaps;if(W&&W.length>0?t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),Ye(_.__webglDepthbuffer,A,!1);else{let $=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,he=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,he),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,he)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function ae(A,_,k){let W=n.get(A);_!==void 0&&Se(W.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),k!==void 0&&ie(A)}function ce(A){let _=A.texture,k=n.get(A),W=n.get(_);A.addEventListener("dispose",y);let $=A.textures,he=A.isWebGLCubeRenderTarget===!0,ue=$.length>1;if(ue||(W.__webglTexture===void 0&&(W.__webglTexture=i.createTexture()),W.__version=_.version,a.memory.textures++),he){k.__webglFramebuffer=[];for(let Z=0;Z<6;Z++)if(_.mipmaps&&_.mipmaps.length>0){k.__webglFramebuffer[Z]=[];for(let te=0;te<_.mipmaps.length;te++)k.__webglFramebuffer[Z][te]=i.createFramebuffer()}else k.__webglFramebuffer[Z]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){k.__webglFramebuffer=[];for(let Z=0;Z<_.mipmaps.length;Z++)k.__webglFramebuffer[Z]=i.createFramebuffer()}else k.__webglFramebuffer=i.createFramebuffer();if(ue)for(let Z=0,te=$.length;Z<te;Z++){let fe=n.get($[Z]);fe.__webglTexture===void 0&&(fe.__webglTexture=i.createTexture(),a.memory.textures++)}if(A.samples>0&&Ke(A)===!1){k.__webglMultisampledFramebuffer=i.createFramebuffer(),k.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let Z=0;Z<$.length;Z++){let te=$[Z];k.__webglColorRenderbuffer[Z]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,k.__webglColorRenderbuffer[Z]);let fe=r.convert(te.format,te.colorSpace),Oe=r.convert(te.type),xe=v(te.internalFormat,fe,Oe,te.normalized,te.colorSpace,A.isXRRenderTarget===!0),pe=$e(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,pe,xe,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Z,i.RENDERBUFFER,k.__webglColorRenderbuffer[Z])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(k.__webglDepthRenderbuffer=i.createRenderbuffer(),Ye(k.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(he){t.bindTexture(i.TEXTURE_CUBE_MAP,W.__webglTexture),st(i.TEXTURE_CUBE_MAP,_);for(let Z=0;Z<6;Z++)if(_.mipmaps&&_.mipmaps.length>0)for(let te=0;te<_.mipmaps.length;te++)Se(k.__webglFramebuffer[Z][te],A,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,te);else Se(k.__webglFramebuffer[Z],A,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0);p(_)&&M(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ue){for(let Z=0,te=$.length;Z<te;Z++){let fe=$[Z],Oe=n.get(fe),xe=i.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(xe=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(xe,Oe.__webglTexture),st(xe,fe),Se(k.__webglFramebuffer,A,fe,i.COLOR_ATTACHMENT0+Z,xe,0),p(fe)&&M(xe)}t.unbindTexture()}else{let Z=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(Z=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Z,W.__webglTexture),st(Z,_),_.mipmaps&&_.mipmaps.length>0)for(let te=0;te<_.mipmaps.length;te++)Se(k.__webglFramebuffer[te],A,_,i.COLOR_ATTACHMENT0,Z,te);else Se(k.__webglFramebuffer,A,_,i.COLOR_ATTACHMENT0,Z,0);p(_)&&M(Z),t.unbindTexture()}A.depthBuffer&&ie(A)}function le(A){let _=A.textures;for(let k=0,W=_.length;k<W;k++){let $=_[k];if(p($)){let he=C(A),ue=n.get($).__webglTexture;t.bindTexture(he,ue),M(he),t.unbindTexture()}}}let de=[],He=[];function Be(A){if(A.samples>0){if(Ke(A)===!1){let _=A.textures,k=A.width,W=A.height,$=i.COLOR_BUFFER_BIT,he=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ue=n.get(A),Z=_.length>1;if(Z)for(let fe=0;fe<_.length;fe++)t.bindFramebuffer(i.FRAMEBUFFER,ue.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+fe,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,ue.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+fe,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,ue.__webglMultisampledFramebuffer);let te=A.texture.mipmaps;te&&te.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ue.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ue.__webglFramebuffer);for(let fe=0;fe<_.length;fe++){if(A.resolveDepthBuffer&&(A.depthBuffer&&($|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&($|=i.STENCIL_BUFFER_BIT)),Z){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ue.__webglColorRenderbuffer[fe]);let Oe=n.get(_[fe]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Oe,0)}i.blitFramebuffer(0,0,k,W,0,0,k,W,$,i.NEAREST),c===!0&&(de.length=0,He.length=0,de.push(i.COLOR_ATTACHMENT0+fe),A.depthBuffer&&A.storeMultisampledDepthBuffer===!1&&(de.push(he),He.push(he),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,He)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,de))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Z)for(let fe=0;fe<_.length;fe++){t.bindFramebuffer(i.FRAMEBUFFER,ue.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+fe,i.RENDERBUFFER,ue.__webglColorRenderbuffer[fe]);let Oe=n.get(_[fe]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,ue.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+fe,i.TEXTURE_2D,Oe,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ue.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.storeMultisampledDepthBuffer===!1&&c){let _=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function $e(A){return Math.min(s.maxSamples,A.samples)}function Ke(A){let _=n.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function L(A){let _=a.render.frame;h.get(A)!==_&&(h.set(A,_),A.update())}function ft(A,_){let k=A.colorSpace,W=A.format,$=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||k!==Br&&k!==xi&&(it.getTransfer(k)===ht?(W!==In||$!==pn)&&Xe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):We("WebGLTextures: Unsupported texture color space:",k)),_}function rt(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(l.width=A.naturalWidth||A.width,l.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(l.width=A.displayWidth,l.height=A.displayHeight):(l.width=A.width,l.height=A.height),l}this.allocateTextureUnit=X,this.resetTextureUnits=B,this.getTextureUnits=D,this.setTextureUnits=V,this.setTexture2D=K,this.setTexture2DArray=q,this.setTexture3D=Q,this.setTextureCube=ee,this.rebindTextures=ae,this.setupRenderTarget=ce,this.updateRenderTargetMipmap=le,this.updateMultisampleRenderTarget=Be,this.setupDepthRenderbuffer=ie,this.setupFrameBufferTexture=Se,this.useMultisampledRTT=Ke,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function nb(i,e){function t(n,s=xi){let r,a=it.getTransfer(s);if(n===pn)return i.UNSIGNED_BYTE;if(n===Rc)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Pc)return i.UNSIGNED_SHORT_5_5_5_1;if(n===du)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===fu)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===hu)return i.BYTE;if(n===uu)return i.SHORT;if(n===or)return i.UNSIGNED_SHORT;if(n===Cc)return i.INT;if(n===Vn)return i.UNSIGNED_INT;if(n===Pn)return i.FLOAT;if(n===Qt)return i.HALF_FLOAT;if(n===pu)return i.ALPHA;if(n===mu)return i.RGB;if(n===In)return i.RGBA;if(n===Yn)return i.DEPTH_COMPONENT;if(n===ki)return i.DEPTH_STENCIL;if(n===Ic)return i.RED;if(n===Lc)return i.RED_INTEGER;if(n===zi)return i.RG;if(n===Dc)return i.RG_INTEGER;if(n===Nc)return i.RGBA_INTEGER;if(n===Ra||n===Pa||n===Ia||n===La)if(a===ht)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Ra)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Pa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ia)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===La)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Ra)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Pa)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ia)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===La)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Uc||n===Oc||n===Fc||n===kc)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Uc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Oc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Fc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===kc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===zc||n===Bc||n===Vc||n===Hc||n===Gc||n===Da||n===Wc)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===zc||n===Bc)return a===ht?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Vc)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Hc)return r.COMPRESSED_R11_EAC;if(n===Gc)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Da)return r.COMPRESSED_RG11_EAC;if(n===Wc)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Xc||n===qc||n===Yc||n===$c||n===Zc||n===Jc||n===Kc||n===jc||n===Qc||n===el||n===tl||n===nl||n===il||n===sl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Xc)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===qc)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Yc)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===$c)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Zc)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Jc)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Kc)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===jc)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Qc)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===el)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===tl)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===nl)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===il)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===sl)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===rl||n===al||n===ol)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===rl)return a===ht?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===al)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ol)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===cl||n===ll||n===Na||n===hl)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===cl)return r.COMPRESSED_RED_RGTC1_EXT;if(n===ll)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Na)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===hl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===cr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var ib=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,sb=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Vu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new ta(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Ct({vertexShader:ib,fragmentShader:sb,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ze(new mi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Hu=class extends $n{constructor(e,t){super();let n=this,s=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,m=null,x=typeof XRWebGLBinding<"u",g=new Vu,p={},M=t.getContextAttributes(),C=null,v=null,w=[],T=[],R=new se,y=null,E=null,P=new Zt;P.viewport=new Pt;let N=new Zt;N.viewport=new Pt;let F=[P,N],B=new bc,D=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let ne=w[J];return ne===void 0&&(ne=new Zs,w[J]=ne),ne.getTargetRaySpace()},this.getControllerGrip=function(J){let ne=w[J];return ne===void 0&&(ne=new Zs,w[J]=ne),ne.getGripSpace()},this.getHand=function(J){let ne=w[J];return ne===void 0&&(ne=new Zs,w[J]=ne),ne.getHandSpace()};function X(J){let ne=T.indexOf(J.inputSource);if(ne===-1)return;let ye=w[ne];ye!==void 0&&(ye.update(J.inputSource,J.frame,l||a),ye.dispatchEvent({type:J.type,data:J.inputSource}))}function z(){s.removeEventListener("select",X),s.removeEventListener("selectstart",X),s.removeEventListener("selectend",X),s.removeEventListener("squeeze",X),s.removeEventListener("squeezestart",X),s.removeEventListener("squeezeend",X),s.removeEventListener("end",z),s.removeEventListener("inputsourceschange",K);for(let J=0;J<w.length;J++){let ne=T[J];ne!==null&&(T[J]=null,w[J].disconnect(ne))}D=null,V=null,g.reset();for(let J in p)delete p[J];if(e.setRenderTarget(C),f=null,d=null,u=null,s=null,v=null,ct.stop(),n.isPresenting=!1,e.setPixelRatio(y),e.setSize(R.width,R.height,!1),E!==null){let J=E.camera;J.fov=E.fov,J.zoom=E.zoom,J.updateProjectionMatrix(),E=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,n.isPresenting===!0&&Xe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){o=J,n.isPresenting===!0&&Xe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(J){l=J},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(J){if(s=J,s!==null){if(C=e.getRenderTarget(),s.addEventListener("select",X),s.addEventListener("selectstart",X),s.addEventListener("selectend",X),s.addEventListener("squeeze",X),s.addEventListener("squeezestart",X),s.addEventListener("squeezeend",X),s.addEventListener("end",z),s.addEventListener("inputsourceschange",K),M.xrCompatible!==!0&&await t.makeXRCompatible(),y=e.getPixelRatio(),e.getSize(R),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let ye=null,qe=null,Se=null;M.depth&&(Se=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ye=M.stencil?ki:Yn,qe=M.stencil?cr:Vn);let Ye={colorFormat:t.RGBA8,depthFormat:Se,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(Ye),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),v=new Bt(d.textureWidth,d.textureHeight,{format:In,type:pn,depthTexture:new Ri(d.textureWidth,d.textureHeight,qe,void 0,void 0,void 0,void 0,void 0,void 0,ye),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let ye={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,ye),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new Bt(f.framebufferWidth,f.framebufferHeight,{format:In,type:pn,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),ct.setContext(s),ct.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function K(J){for(let ne=0;ne<J.removed.length;ne++){let ye=J.removed[ne],qe=T.indexOf(ye);qe>=0&&(T[qe]=null,w[qe].disconnect(ye))}for(let ne=0;ne<J.added.length;ne++){let ye=J.added[ne],qe=T.indexOf(ye);if(qe===-1){for(let Ye=0;Ye<w.length;Ye++)if(Ye>=T.length){T.push(ye),qe=Ye;break}else if(T[Ye]===null){T[Ye]=ye,qe=Ye;break}if(qe===-1)break}let Se=w[qe];Se&&Se.connect(ye)}}let q=new I,Q=new I;function ee(J,ne,ye){q.setFromMatrixPosition(ne.matrixWorld),Q.setFromMatrixPosition(ye.matrixWorld);let qe=q.distanceTo(Q),Se=ne.projectionMatrix.elements,Ye=ye.projectionMatrix.elements,xt=Se[14]/(Se[10]-1),ie=Se[14]/(Se[10]+1),ae=(Se[9]+1)/Se[5],ce=(Se[9]-1)/Se[5],le=(Se[8]-1)/Se[0],de=(Ye[8]+1)/Ye[0],He=xt*le,Be=xt*de,$e=qe/(-le+de),Ke=$e*-le;if(ne.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(Ke),J.translateZ($e),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),Se[10]===-1)J.projectionMatrix.copy(ne.projectionMatrix),J.projectionMatrixInverse.copy(ne.projectionMatrixInverse);else{let L=xt+$e,ft=ie+$e,rt=He-Ke,A=Be+(qe-Ke),_=ae*ie/ft*L,k=ce*ie/ft*L;J.projectionMatrix.makePerspective(rt,A,_,k,L,ft),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function Ue(J,ne){ne===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(ne.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(s===null)return;let ne=J.near,ye=J.far;g.texture!==null&&(g.depthNear>0&&(ne=g.depthNear),g.depthFar>0&&(ye=g.depthFar)),B.near=N.near=P.near=ne,B.far=N.far=P.far=ye,(D!==B.near||V!==B.far)&&(s.updateRenderState({depthNear:B.near,depthFar:B.far}),D=B.near,V=B.far),B.layers.mask=J.layers.mask|6,P.layers.mask=B.layers.mask&-5,N.layers.mask=B.layers.mask&-3;let qe=J.parent,Se=B.cameras;Ue(B,qe);for(let Ye=0;Ye<Se.length;Ye++)Ue(Se[Ye],qe);Se.length===2?ee(B,P,N):B.projectionMatrix.copy(P.projectionMatrix),E===null&&J.isPerspectiveCamera&&(E={camera:J,fov:J.fov,zoom:J.zoom}),Re(J,B,qe)};function Re(J,ne,ye){ye===null?J.matrix.copy(ne.matrixWorld):(J.matrix.copy(ye.matrixWorld),J.matrix.invert(),J.matrix.multiply(ne.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(ne.projectionMatrix),J.projectionMatrixInverse.copy(ne.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=Zo*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return B},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(J){c=J,d!==null&&(d.fixedFoveation=J),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=J)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(B)},this.getCameraTexture=function(J){return p[J]};let ut=null;function st(J,ne){if(h=ne.getViewerPose(l||a),m=ne,h!==null){let ye=h.views;f!==null&&(e.setRenderTargetFramebuffer(v,f.framebuffer),e.setRenderTarget(v));let qe=!1;ye.length!==B.cameras.length&&(B.cameras.length=0,qe=!0);for(let ie=0;ie<ye.length;ie++){let ae=ye[ie],ce=null;if(f!==null)ce=f.getViewport(ae);else{let de=u.getViewSubImage(d,ae);ce=de.viewport,ie===0&&(e.setRenderTargetTextures(v,de.colorTexture,de.depthStencilTexture),e.setRenderTarget(v))}let le=F[ie];le===void 0&&(le=new Zt,le.layers.enable(ie),le.viewport=new Pt,F[ie]=le),le.matrix.fromArray(ae.transform.matrix),le.matrix.decompose(le.position,le.quaternion,le.scale),le.projectionMatrix.fromArray(ae.projectionMatrix),le.projectionMatrixInverse.copy(le.projectionMatrix).invert(),le.viewport.set(ce.x,ce.y,ce.width,ce.height),ie===0&&(B.matrix.copy(le.matrix),B.matrix.decompose(B.position,B.quaternion,B.scale)),qe===!0&&B.cameras.push(le)}let Se=s.enabledFeatures;if(Se&&Se.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){u=n.getBinding();let ie=u.getDepthInformation(ye[0]);ie&&ie.isValid&&ie.texture&&g.init(ie,s.renderState)}if(Se&&Se.includes("camera-access")&&x){e.state.unbindTexture(),u=n.getBinding();for(let ie=0;ie<ye.length;ie++){let ae=ye[ie].camera;if(ae){let ce=p[ae];ce||(ce=new ta,p[ae]=ce);let le=u.getCameraImage(ae);ce.sourceTexture=le}}}}for(let ye=0;ye<w.length;ye++){let qe=T[ye],Se=w[ye];qe!==null&&Se!==void 0&&Se.update(qe,ne,l||a)}ut&&ut(J,ne),ne.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ne}),m=null}let ct=new Cm;ct.setAnimationLoop(st),this.setAnimationLoop=function(J){ut=J},this.dispose=function(){}}},rb=new dt,Nm=new Je;Nm.set(-1,0,0,0,1,0,0,0,1);function ab(i,e){function t(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,yu(i)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,M,C,v){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(g,p):p.isMeshLambertMaterial?(r(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(g,p),u(g,p)):p.isMeshPhongMaterial?(r(g,p),h(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(g,p),d(g,p),p.isMeshPhysicalMaterial&&f(g,p,v)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),x(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(a(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?c(g,p,M,C):p.isSpriteMaterial?l(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,t(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===jt&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,t(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===jt&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,t(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,t(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);let M=e.get(p),C=M.envMap,v=M.envMapRotation;C&&(g.envMap.value=C,g.envMapRotation.value.setFromMatrix4(rb.makeRotationFromEuler(v)).transpose(),C.isCubeTexture&&C.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(Nm),g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,g.aoMapTransform))}function a(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function c(g,p,M,C){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*M,g.scale.value=C*.5,p.map&&(g.map.value=p.map,t(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function l(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,M){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===jt&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.retroreflectivity>0&&(g.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=M.texture,g.transmissionSamplerSize.value.set(M.width,M.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function x(g,p){let M=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(M.matrixWorld),g.nearDistance.value=M.shadow.camera.near,g.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function ob(i,e,t,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(v,w){let T=w.program;n.uniformBlockBinding(v,T)}function l(v,w){let T=s[v.id];T===void 0&&(g(v),T=h(v),s[v.id]=T,v.addEventListener("dispose",M));let R=w.program;n.updateUBOMapping(v,R);let y=e.render.frame;r[v.id]!==y&&(d(v),r[v.id]=y)}function h(v){let w=u();v.__bindingPointIndex=w;let T=i.createBuffer(),R=v.__size,y=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,T),i.bufferData(i.UNIFORM_BUFFER,R,y),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,w,T),T}function u(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return We("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(v){let w=s[v.id],T=v.uniforms,R=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,w);for(let y=0,E=T.length;y<E;y++){let P=T[y];if(Array.isArray(P))for(let N=0,F=P.length;N<F;N++)f(P[N],y,N,R);else f(P,y,0,R)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(v,w,T,R){if(x(v,w,T,R)===!0){let y=v.__offset,E=v.value;if(Array.isArray(E)){let P=0;for(let N=0;N<E.length;N++){let F=E[N],B=p(F);m(F,v.__data,P),typeof F!="number"&&typeof F!="boolean"&&!F.isMatrix3&&!ArrayBuffer.isView(F)&&(P+=B.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(E,v.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,y,v.__data)}}function m(v,w,T){typeof v=="number"||typeof v=="boolean"?w[0]=v:v.isMatrix3?(w[0]=v.elements[0],w[1]=v.elements[1],w[2]=v.elements[2],w[3]=0,w[4]=v.elements[3],w[5]=v.elements[4],w[6]=v.elements[5],w[7]=0,w[8]=v.elements[6],w[9]=v.elements[7],w[10]=v.elements[8],w[11]=0):ArrayBuffer.isView(v)?w.set(new v.constructor(v.buffer,v.byteOffset,w.length)):v.toArray(w,T)}function x(v,w,T,R){let y=v.value,E=w+"_"+T;if(R[E]===void 0)return typeof y=="number"||typeof y=="boolean"?R[E]=y:ArrayBuffer.isView(y)?R[E]=y.slice():R[E]=y.clone(),!0;{let P=R[E];if(typeof y=="number"||typeof y=="boolean"){if(P!==y)return R[E]=y,!0}else{if(ArrayBuffer.isView(y))return!0;if(P.equals(y)===!1)return P.copy(y),!0}}return!1}function g(v){let w=v.uniforms,T=0,R=16;for(let E=0,P=w.length;E<P;E++){let N=Array.isArray(w[E])?w[E]:[w[E]];for(let F=0,B=N.length;F<B;F++){let D=N[F],V=Array.isArray(D.value)?D.value:[D.value];for(let X=0,z=V.length;X<z;X++){let K=V[X],q=p(K),Q=T%R,ee=Q%q.boundary,Ue=Q+ee;T+=ee,Ue!==0&&R-Ue<q.storage&&(T+=R-Ue),D.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),D.__offset=T,T+=q.storage}}}let y=T%R;return y>0&&(T+=R-y),v.__size=T,v.__cache={},this}function p(v){let w={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(w.boundary=4,w.storage=4):v.isVector2?(w.boundary=8,w.storage=8):v.isVector3||v.isColor?(w.boundary=16,w.storage=12):v.isVector4?(w.boundary=16,w.storage=16):v.isMatrix3?(w.boundary=48,w.storage=48):v.isMatrix4?(w.boundary=64,w.storage=64):v.isTexture?Xe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(w.boundary=16,w.storage=v.byteLength):Xe("WebGLRenderer: Unsupported uniform value type.",v),w}function M(v){let w=v.target;w.removeEventListener("dispose",M);let T=a.indexOf(w.__bindingPointIndex);a.splice(T,1),i.deleteBuffer(s[w.id]),delete s[w.id],delete r[w.id]}function C(){for(let v in s)i.deleteBuffer(s[v]);a=[],s={},r={}}return{bind:c,update:l,dispose:C}}var cb=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),ti=null;function lb(){return ti===null&&(ti=new Zr(cb,16,16,zi,Qt),ti.name="DFG_LUT",ti.minFilter=Jt,ti.magFilter=Jt,ti.wrapS=qn,ti.wrapT=qn,ti.generateMipmaps=!1,ti.needsUpdate=!0),ti}var gl=class{constructor(e={}){let{canvas:t=Zp(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=pn}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=a;let x=f,g=new Set([Nc,Dc,Lc]),p=new Set([pn,Vn,or,cr,Rc,Pc]),M=new Uint32Array(4),C=new Int32Array(4),v=new I,w=null,T=null,R=[],y=[],E=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Bn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let P=this,N=!1,F=null,B=null,D=null,V=null;this._outputColorSpace=zt;let X=0,z=0,K=null,q=-1,Q=null,ee=new Pt,Ue=new Pt,Re=null,ut=new Te(0),st=0,ct=t.width,J=t.height,ne=1,ye=null,qe=null,Se=new Pt(0,0,ct,J),Ye=new Pt(0,0,ct,J),xt=!1,ie=new Js,ae=!1,ce=!1,le=new dt,de=new I,He=new Pt,Be={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},$e=!1;function Ke(){return K===null?ne:1}let L=n;function ft(b,U){return t.getContext(b,U)}let rt,A,_,k,W,$,he,ue,Z,te,fe,Oe,xe,pe,Fe,Ge,je,O,me,j,ge,be,re;try{let b={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"186"}`),t.addEventListener("webglcontextlost",bt,!1),t.addEventListener("webglcontextrestored",pt,!1),t.addEventListener("webglcontextcreationerror",Nn,!1),L===null){let U="webgl2";if(L=ft(U,b),L===null)throw ft(U)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}ke()}catch(b){throw t.removeEventListener("webglcontextlost",bt,!1),t.removeEventListener("webglcontextrestored",pt,!1),t.removeEventListener("webglcontextcreationerror",Nn,!1),We("WebGLRenderer: "+b.message),b}function ke(){rt=new gv(L),rt.init(),ge=new nb(L,rt),A=new av(L,rt,e,ge),_=new eb(L,rt),A.reversedDepthBuffer&&d&&_.buffers.depth.setReversed(!0),B=L.createFramebuffer(),D=L.createFramebuffer(),V=L.createFramebuffer(),k=new yv(L),W=new BM,$=new tb(L,rt,_,W,A,ge,k),he=new mv(P),ue=new Mx(L),be=new sv(L,ue),Z=new xv(L,ue,k,be),te=new Mv(L,Z,ue,be,k),O=new vv(L,A,$),Fe=new ov(W),fe=new zM(P,he,rt,A,be,Fe),Oe=new ab(P,W),xe=new HM,pe=new $M(rt),je=new iv(P,he,_,te,m,c),Ge=new QM(P,te,A),re=new ob(L,k,A,_),me=new rv(L,rt,k),j=new _v(L,rt,k),k.programs=fe.programs,P.capabilities=A,P.extensions=rt,P.properties=W,P.renderLists=xe,P.shadowMap=Ge,P.state=_,P.info=k}x!==pn&&(E=new Sv(x,t.width,t.height,o,s,r));let De=new Hu(P,L);this.xr=De,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){let b=rt.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){let b=rt.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return ne},this.setPixelRatio=function(b){b!==void 0&&(ne=b,this.setSize(ct,J,!1))},this.getSize=function(b){return b.set(ct,J)},this.setSize=function(b,U,Y=!0){if(De.isPresenting){Xe("WebGLRenderer: Can't change size while VR device is presenting.");return}ct=b,J=U,t.width=Math.floor(b*ne),t.height=Math.floor(U*ne),Y===!0&&(t.style.width=b+"px",t.style.height=U+"px"),E!==null&&E.setSize(t.width,t.height),this.setViewport(0,0,b,U)},this.getDrawingBufferSize=function(b){return b.set(ct*ne,J*ne).floor()},this.setDrawingBufferSize=function(b,U,Y){ct=b,J=U,ne=Y,t.width=Math.floor(b*Y),t.height=Math.floor(U*Y),this.setViewport(0,0,b,U)},this.setEffects=function(b){if(x===pn){We("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let U=0;U<b.length;U++)if(b[U].isOutputPass===!0){Xe("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}E.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy(ee)},this.getViewport=function(b){return b.copy(Se)},this.setViewport=function(b,U,Y,H){b.isVector4?Se.set(b.x,b.y,b.z,b.w):Se.set(b,U,Y,H),_.viewport(ee.copy(Se).multiplyScalar(ne).round())},this.getScissor=function(b){return b.copy(Ye)},this.setScissor=function(b,U,Y,H){b.isVector4?Ye.set(b.x,b.y,b.z,b.w):Ye.set(b,U,Y,H),_.scissor(Ue.copy(Ye).multiplyScalar(ne).round())},this.getScissorTest=function(){return xt},this.setScissorTest=function(b){_.setScissorTest(xt=b)},this.setOpaqueSort=function(b){ye=b},this.setTransparentSort=function(b){qe=b},this.getClearColor=function(b){return b.copy(je.getClearColor())},this.setClearColor=function(){je.setClearColor(...arguments)},this.getClearAlpha=function(){return je.getClearAlpha()},this.setClearAlpha=function(){je.setClearAlpha(...arguments)},this.clear=function(b=!0,U=!0,Y=!0){let H=0;if(b){let G=!1;if(K!==null){let Me=K.texture.format;G=g.has(Me)}if(G){let Me=K.texture.type,Ce=p.has(Me),ve=je.getClearColor(),Ie=je.getClearAlpha(),Ne=ve.r,et=ve.g,at=ve.b;Ce?(M[0]=Ne,M[1]=et,M[2]=at,M[3]=Ie,L.clearBufferuiv(L.COLOR,0,M)):(C[0]=Ne,C[1]=et,C[2]=at,C[3]=Ie,L.clearBufferiv(L.COLOR,0,C))}else H|=L.COLOR_BUFFER_BIT}U&&(H|=L.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Y&&(H|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H!==0&&L.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(b){b.setRenderer(this),F=b},this.dispose=function(){t.removeEventListener("webglcontextlost",bt,!1),t.removeEventListener("webglcontextrestored",pt,!1),t.removeEventListener("webglcontextcreationerror",Nn,!1),je.dispose(),xe.dispose(),pe.dispose(),W.dispose(),he.dispose(),te.dispose(),be.dispose(),re.dispose(),fe.dispose(),De.dispose(),De.removeEventListener("sessionstart",_f),De.removeEventListener("sessionend",yf),qi.stop()};function bt(b){b.preventDefault(),Gr("WebGLRenderer: Context Lost."),N=!0}function pt(){Gr("WebGLRenderer: Context Restored."),N=!1;let b=k.autoReset,U=Ge.enabled,Y=Ge.autoUpdate,H=Ge.needsUpdate,G=Ge.type;ke(),k.autoReset=b,Ge.enabled=U,Ge.autoUpdate=Y,Ge.needsUpdate=H,Ge.type=G}function Nn(b){We("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function Hn(b){let U=b.target;U.removeEventListener("dispose",Hn),X0(U)}function X0(b){q0(b),W.remove(b)}function q0(b){let U=W.get(b).programs;U!==void 0&&(U.forEach(function(Y){fe.releaseProgram(Y)}),b.isShaderMaterial&&fe.releaseShaderCache(b))}this.renderBufferDirect=function(b,U,Y,H,G,Me){U===null&&(U=Be);let Ce=G.isMesh&&G.matrixWorld.determinantAffine()<0,ve=Z0(b,U,Y,H,G);_.setMaterial(H,Ce);let Ie=Y.index,Ne=1;if(H.wireframe===!0){if(Ie=Z.getWireframeAttribute(Y),Ie===void 0)return;Ne=2}let et=Y.drawRange,at=Y.attributes.position,Le=et.start*Ne,mt=(et.start+et.count)*Ne;Me!==null&&(Le=Math.max(Le,Me.start*Ne),mt=Math.min(mt,(Me.start+Me.count)*Ne)),Ie!==null?(Le=Math.max(Le,0),mt=Math.min(mt,Ie.count)):at!=null&&(Le=Math.max(Le,0),mt=Math.min(mt,at.count));let Ft=mt-Le;if(Ft<0||Ft===1/0)return;be.setup(G,H,ve,Y,Ie);let Tt,Mt=me;if(Ie!==null&&(Tt=ue.get(Ie),Mt=j,Mt.setIndex(Tt)),G.isMesh)H.wireframe===!0?(_.setLineWidth(H.wireframeLinewidth*Ke()),Mt.setMode(L.LINES)):Mt.setMode(L.TRIANGLES);else if(G.isLine){let en=H.linewidth;en===void 0&&(en=1),_.setLineWidth(en*Ke()),G.isLineSegments?Mt.setMode(L.LINES):G.isLineLoop?Mt.setMode(L.LINE_LOOP):Mt.setMode(L.LINE_STRIP)}else G.isPoints?Mt.setMode(L.POINTS):G.isSprite&&Mt.setMode(L.TRIANGLES);if(G.isBatchedMesh)if(rt.get("WEBGL_multi_draw"))Mt.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{let en=G._multiDrawStarts,we=G._multiDrawCounts,ln=G._multiDrawCount,lt=Ie?ue.get(Ie).bytesPerElement:1,wn=W.get(H).currentProgram.getUniforms();for(let Gn=0;Gn<ln;Gn++)wn.setValue(L,"_gl_DrawID",Gn),Mt.render(en[Gn]/lt,we[Gn])}else if(G.isInstancedMesh)Mt.renderInstances(Le,Ft,G.count);else if(Y.isInstancedBufferGeometry){let en=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,we=Math.min(Y.instanceCount,en);Mt.renderInstances(Le,Ft,we)}else Mt.render(Le,Ft)};function xf(b,U,Y,H){F!==null&&b.isNodeMaterial&&F.setObject(H,b),ae===!0&&Fe.setState(b,Y,!1),b.transparent===!0&&b.side===Nt&&b.forceSinglePass===!1?(b.side=jt,b.needsUpdate=!0,io(b,U,H),b.side=Ui,b.needsUpdate=!0,io(b,U,H),b.side=Nt):io(b,U,H)}this.compile=function(b,U,Y=null){Y===null&&(Y=b),F!==null&&F.renderStart(b,U,Y),T=pe.get(Y),T.init(U),y.push(T),Y.traverseVisible(function(G){G.isLight&&G.layers.test(U.layers)&&(T.pushLight(G),G.castShadow&&T.pushShadow(G))}),b!==Y&&b.traverseVisible(function(G){G.isLight&&G.layers.test(U.layers)&&(T.pushLight(G),G.castShadow&&T.pushShadow(G))}),T.setupLights(),F!==null&&F.updateLights(T.state.lightsArray),ce=this.localClippingEnabled,ae=Fe.init(this.clippingPlanes,ce),ae===!0&&Fe.setGlobalState(this.clippingPlanes,U),F!==null&&Ge.render(T.state.shadowsArray,Y,U);let H=new Set;return b.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;let Me=G.material;if(Me)if(Array.isArray(Me))for(let Ce=0;Ce<Me.length;Ce++){let ve=Me[Ce];xf(ve,Y,U,G),H.add(ve)}else xf(Me,Y,U,G),H.add(Me)}),T=y.pop(),F!==null&&F.renderEnd(),H},this.compileAsync=function(b,U,Y=null){let H=this.compile(b,U,Y);return new Promise(G=>{function Me(){if(H.forEach(function(Ce){let Ie=W.get(Ce).currentProgram;(Ie===void 0||Ie.isReady())&&H.delete(Ce)}),H.size===0){G(b);return}setTimeout(Me,10)}rt.get("KHR_parallel_shader_compile")!==null?Me():setTimeout(Me,10)})};let uh=null;function Y0(b){uh&&uh(b)}function _f(){qi.stop()}function yf(){qi.start()}let qi=new Cm;qi.setAnimationLoop(Y0),typeof self<"u"&&qi.setContext(self),this.setAnimationLoop=function(b){uh=b,De.setAnimationLoop(b),b===null?qi.stop():qi.start()},De.addEventListener("sessionstart",_f),De.addEventListener("sessionend",yf),this.render=function(b,U){if(U!==void 0&&U.isCamera!==!0){We("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(N===!0)return;F!==null&&F.renderStart(b,U);let Y=De.enabled===!0&&De.isPresenting===!0,H=E!==null&&(K===null||Y)&&E.begin(P,K);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),De.enabled===!0&&De.isPresenting===!0&&(E===null||E.isCompositing()===!1)&&(De.cameraAutoUpdate===!0&&De.updateCamera(U),U=De.getCamera()),b.isScene===!0&&b.onBeforeRender(P,b,U,K),T=pe.get(b,y.length),T.init(U),T.state.textureUnits=$.getTextureUnits(),y.push(T),le.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),ie.setFromProjectionMatrix(le,zn,U.reversedDepth),ce=this.localClippingEnabled,ae=Fe.init(this.clippingPlanes,ce),w=xe.get(b,R.length),w.init(),R.push(w),De.enabled===!0&&De.isPresenting===!0){let Ce=P.xr.getDepthSensingMesh();Ce!==null&&dh(Ce,U,-1/0,P.sortObjects)}dh(b,U,0,P.sortObjects),w.finish(),F!==null&&F.updateLights(T.state.lightsArray),P.sortObjects===!0&&w.sort(ye,qe),$e=De.enabled===!1||De.isPresenting===!1||De.hasDepthSensing()===!1,$e&&je.addToRenderList(w,b),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ae===!0&&Fe.beginShadows();let G=T.state.shadowsArray;if(Ge.render(G,b,U),ae===!0&&Fe.endShadows(),(H&&E.hasRenderPass())===!1){let Ce=w.opaque,ve=w.transmissive;if(T.setupLights(),U.isArrayCamera){let Ie=U.cameras;if(ve.length>0)for(let Ne=0,et=Ie.length;Ne<et;Ne++){let at=Ie[Ne];Mf(Ce,ve,b,at)}$e&&je.render(b);for(let Ne=0,et=Ie.length;Ne<et;Ne++){let at=Ie[Ne];vf(w,b,at,at.viewport)}}else ve.length>0&&Mf(Ce,ve,b,U),$e&&je.render(b),vf(w,b,U)}K!==null&&z===0&&($.updateMultisampleRenderTarget(K),$.updateRenderTargetMipmap(K)),H&&E.end(P),b.isScene===!0&&b.onAfterRender(P,b,U),be.resetDefaultState(),q=-1,Q=null,y.pop(),y.length>0?(T=y[y.length-1],$.setTextureUnits(T.state.textureUnits),ae===!0&&Fe.setGlobalState(P.clippingPlanes,T.state.camera)):T=null,R.pop(),R.length>0?w=R[R.length-1]:w=null,F!==null&&F.renderEnd()};function dh(b,U,Y,H){if(b.visible===!1)return;if(b.layers.test(U.layers)){if(b.isGroup)Y=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(U);else if(b.isLightProbeGrid)T.pushLightProbeGrid(b);else if(b.isLight)T.pushLight(b),b.castShadow&&T.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||b.intersectsFrustum(ie)){H&&He.setFromMatrixPosition(b.matrixWorld).applyMatrix4(le);let Ce=te.update(b),ve=b.material;ve.visible&&w.push(b,Ce,ve,Y,He.z,null,U)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||b.intersectsFrustum(ie))){let Ce=te.update(b),ve=b.material;if(H&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),He.copy(b.boundingSphere.center)):(Ce.boundingSphere===null&&Ce.computeBoundingSphere(),He.copy(Ce.boundingSphere.center)),He.applyMatrix4(b.matrixWorld).applyMatrix4(le)),Array.isArray(ve)){let Ie=Ce.groups;for(let Ne=0,et=Ie.length;Ne<et;Ne++){let at=Ie[Ne],Le=ve[at.materialIndex];Le&&Le.visible&&w.push(b,Ce,Le,Y,He.z,at,U)}}else ve.visible&&w.push(b,Ce,ve,Y,He.z,null,U)}}let Me=b.children;for(let Ce=0,ve=Me.length;Ce<ve;Ce++)dh(Me[Ce],U,Y,H)}function vf(b,U,Y,H){let{opaque:G,transmissive:Me,transparent:Ce}=b;T.setupLightsView(Y),ae===!0&&Fe.setGlobalState(P.clippingPlanes,Y),H&&_.viewport(ee.copy(H)),G.length>0&&no(G,U,Y),Me.length>0&&no(Me,U,Y),Ce.length>0&&no(Ce,U,Y),_.buffers.depth.setTest(!0),_.buffers.depth.setMask(!0),_.buffers.color.setMask(!0),_.setPolygonOffset(!1)}function Mf(b,U,Y,H){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[H.id]===void 0){let Le=rt.has("EXT_color_buffer_half_float")||rt.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[H.id]=new Bt(1,1,{generateMipmaps:!0,type:Le?Qt:pn,minFilter:Fi,samples:Math.max(4,A.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:it.workingColorSpace})}let Me=T.state.transmissionRenderTarget[H.id],Ce=H.viewport||ee;Me.setSize(Ce.z*P.transmissionResolutionScale,Ce.w*P.transmissionResolutionScale);let ve=P.getRenderTarget(),Ie=P.getActiveCubeFace(),Ne=P.getActiveMipmapLevel();P.setRenderTarget(Me),P.getClearColor(ut),st=P.getClearAlpha(),st<1&&P.setClearColor(16777215,.5),P.clear(),$e&&je.render(Y);let et=P.toneMapping;P.toneMapping=Bn;let at=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),T.setupLightsView(H),ae===!0&&Fe.setGlobalState(P.clippingPlanes,H),no(b,Y,H),$.updateMultisampleRenderTarget(Me),$.updateRenderTargetMipmap(Me),rt.has("WEBGL_multisampled_render_to_texture")===!1){let Le=!1;for(let mt=0,Ft=U.length;mt<Ft;mt++){let Tt=U[mt],{object:Mt,geometry:en,material:we,group:ln}=Tt;if(we.side===Nt&&Mt.layers.test(H.layers)){let lt=we.side;we.side=jt,we.needsUpdate=!0,bf(Mt,Y,H,en,we,ln),we.side=lt,we.needsUpdate=!0,Le=!0}}Le===!0&&($.updateMultisampleRenderTarget(Me),$.updateRenderTargetMipmap(Me))}P.setRenderTarget(ve,Ie,Ne),P.setClearColor(ut,st),at!==void 0&&(H.viewport=at),P.toneMapping=et}function no(b,U,Y){let H=U.isScene===!0?U.overrideMaterial:null;for(let G=0,Me=b.length;G<Me;G++){let Ce=b[G],{object:ve,geometry:Ie,group:Ne}=Ce,et=Ce.material;et.allowOverride===!0&&H!==null&&(et=H),ve.layers.test(Y.layers)&&bf(ve,U,Y,Ie,et,Ne)}}function bf(b,U,Y,H,G,Me){F!==null&&G.isNodeMaterial&&F.setObject(b,G),b.onBeforeRender(P,U,Y,H,G,Me),b.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),G.onBeforeRender(P,U,Y,H,b,Me),G.transparent===!0&&G.side===Nt&&G.forceSinglePass===!1?(G.side=jt,G.needsUpdate=!0,P.renderBufferDirect(Y,U,H,G,b,Me),G.side=Ui,G.needsUpdate=!0,P.renderBufferDirect(Y,U,H,G,b,Me),G.side=Nt):P.renderBufferDirect(Y,U,H,G,b,Me),b.onAfterRender(P,U,Y,H,G,Me)}function io(b,U,Y){U.isScene!==!0&&(U=Be);let H=W.get(b),G=T.state.lights,Me=T.state.shadowsArray,Ce=G.state.version,ve=fe.getParameters(b,G.state,Me,U,Y,T.state.lightProbeGridArray),Ie=fe.getProgramCacheKey(ve),Ne=H.programs;H.environment=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?U.environment:null,H.fog=U.fog;let et=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap;H.envMap=he.get(b.envMap||H.environment,et),H.envMapRotation=H.environment!==null&&b.envMap===null?U.environmentRotation:b.envMapRotation,Ne===void 0&&(b.addEventListener("dispose",Hn),Ne=new Map,H.programs=Ne);let at=Ne.get(Ie);if(at!==void 0){if(H.currentProgram===at&&H.lightsStateVersion===Ce)return Tf(b,ve),at}else ve.uniforms=fe.getUniforms(b),F!==null&&b.isNodeMaterial&&F.build(b,Y,ve),b.onBeforeCompile(ve,P),at=fe.acquireProgram(ve,Ie),Ne.set(Ie,at),H.uniforms=ve.uniforms;let Le=H.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Le.clippingPlanes=Fe.uniform),Tf(b,ve),H.needsLights=K0(b),H.lightsStateVersion=Ce,H.needsLights&&(Le.ambientLightColor.value=G.state.ambient,Le.lightProbe.value=G.state.probe,Le.sunLights.value=G.state.sun,Le.sunLightShadows.value=G.state.sunShadow,Le.directionalLights.value=G.state.directional,Le.directionalLightShadows.value=G.state.directionalShadow,Le.spotLights.value=G.state.spot,Le.spotLightShadows.value=G.state.spotShadow,Le.rectAreaLights.value=G.state.rectArea,Le.ltc_1.value=G.state.rectAreaLTC1,Le.ltc_2.value=G.state.rectAreaLTC2,Le.pointLights.value=G.state.point,Le.pointLightShadows.value=G.state.pointShadow,Le.hemisphereLights.value=G.state.hemi,Le.sunShadowMatrix.value=G.state.sunShadowMatrix,Le.sunShadowCascade.value=G.state.sunShadowCascade,Le.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Le.spotLightMatrix.value=G.state.spotLightMatrix,Le.spotLightMap.value=G.state.spotLightMap,Le.pointShadowMatrix.value=G.state.pointShadowMatrix),H.lightProbeGrid=T.state.lightProbeGridArray.length>0,H.currentProgram=at,H.uniformsList=null,at}function Sf(b){if(b.uniformsList===null){let U=b.currentProgram.getUniforms();b.uniformsList=ur.seqWithValue(U.seq,b.uniforms)}return b.uniformsList}function Tf(b,U){let Y=W.get(b);Y.outputColorSpace=U.outputColorSpace,Y.batching=U.batching,Y.batchingColor=U.batchingColor,Y.instancing=U.instancing,Y.instancingColor=U.instancingColor,Y.instancingMorph=U.instancingMorph,Y.skinning=U.skinning,Y.morphTargets=U.morphTargets,Y.morphNormals=U.morphNormals,Y.morphColors=U.morphColors,Y.morphTargetsCount=U.morphTargetsCount,Y.numClippingPlanes=U.numClippingPlanes,Y.numIntersection=U.numClipIntersection,Y.vertexAlphas=U.vertexAlphas,Y.vertexTangents=U.vertexTangents,Y.toneMapping=U.toneMapping}function $0(b,U){if(b.length===0)return null;if(b.length===1)return b[0].texture!==null?b[0]:null;v.setFromMatrixPosition(U.matrixWorld);for(let Y=0,H=b.length;Y<H;Y++){let G=b[Y];if(G.texture!==null&&G.boundingBox.containsPoint(v))return G}return null}function Z0(b,U,Y,H,G){U.isScene!==!0&&(U=Be),$.resetTextureUnits();let Me=U.fog,Ce=H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial?U.environment:null,ve=K===null?P.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:it.workingColorSpace,Ie=H.isMeshStandardMaterial||H.isMeshLambertMaterial&&!H.envMap||H.isMeshPhongMaterial&&!H.envMap,Ne=he.get(H.envMap||Ce,Ie),et=H.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,at=!!Y.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Le=!!Y.morphAttributes.position,mt=!!Y.morphAttributes.normal,Ft=!!Y.morphAttributes.color,Tt=Bn;H.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(Tt=P.toneMapping);let Mt=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,en=Mt!==void 0?Mt.length:0,we=W.get(H),ln=T.state.lights;if(ae===!0&&(ce===!0||b!==Q)){let St=b===Q&&H.id===q;Fe.setState(H,b,St)}let lt=!1;H.version===we.__version?(we.needsLights&&we.lightsStateVersion!==ln.state.version||we.outputColorSpace!==ve||G.isBatchedMesh&&we.batching===!1||!G.isBatchedMesh&&we.batching===!0||G.isBatchedMesh&&we.batchingColor===!0&&G._colorsTexture===null||G.isBatchedMesh&&we.batchingColor===!1&&G._colorsTexture!==null||G.isInstancedMesh&&we.instancing===!1||!G.isInstancedMesh&&we.instancing===!0||G.isSkinnedMesh&&we.skinning===!1||!G.isSkinnedMesh&&we.skinning===!0||G.isInstancedMesh&&we.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&we.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&we.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&we.instancingMorph===!1&&G.morphTexture!==null||we.envMap!==Ne||H.fog===!0&&we.fog!==Me||we.numClippingPlanes!==void 0&&(we.numClippingPlanes!==Fe.numPlanes||we.numIntersection!==Fe.numIntersection)||we.vertexAlphas!==et||we.vertexTangents!==at||we.morphTargets!==Le||we.morphNormals!==mt||we.morphColors!==Ft||we.toneMapping!==Tt||we.morphTargetsCount!==en||!!we.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(lt=!0):(lt=!0,we.__version=H.version);let wn=we.currentProgram;lt===!0&&(wn=io(H,U,G),F&&H.isNodeMaterial&&F.onUpdateProgram(H,wn,we));let Gn=!1,yi=!1,Ms=!1,_t=wn.getUniforms(),Ut=we.uniforms;if(_.useProgram(wn.program)&&(Gn=!0,yi=!0,Ms=!0),H.id!==q&&(q=H.id,yi=!0),we.needsLights){let St=$0(T.state.lightProbeGridArray,G);we.lightProbeGrid!==St&&(we.lightProbeGrid=St,yi=!0)}if(Gn||Q!==b){_.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),_t.setValue(L,"projectionMatrix",b.projectionMatrix),_t.setValue(L,"viewMatrix",b.matrixWorldInverse);let Mi=_t.map.cameraPosition;Mi!==void 0&&Mi.setValue(L,de.setFromMatrixPosition(b.matrixWorld)),A.logarithmicDepthBuffer&&_t.setValue(L,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&_t.setValue(L,"isOrthographic",b.isOrthographicCamera===!0),Q!==b&&(Q=b,yi=!0,Ms=!0)}if(we.needsLights&&(ln.state.sunShadowMap.length>0&&_t.setValue(L,"sunShadowMap",ln.state.sunShadowMap,$),ln.state.directionalShadowMap.length>0&&_t.setValue(L,"directionalShadowMap",ln.state.directionalShadowMap,$),ln.state.spotShadowMap.length>0&&_t.setValue(L,"spotShadowMap",ln.state.spotShadowMap,$),ln.state.pointShadowMap.length>0&&_t.setValue(L,"pointShadowMap",ln.state.pointShadowMap,$)),G.isSkinnedMesh){_t.setOptional(L,G,"bindMatrix"),_t.setOptional(L,G,"bindMatrixInverse");let St=G.skeleton;St&&(St.boneTexture===null&&St.computeBoneTexture(),_t.setValue(L,"boneTexture",St.boneTexture,$))}G.isBatchedMesh&&(_t.setOptional(L,G,"batchingTexture"),_t.setValue(L,"batchingTexture",G._matricesTexture,$),_t.setOptional(L,G,"batchingIdTexture"),_t.setValue(L,"batchingIdTexture",G._indirectTexture,$),_t.setOptional(L,G,"batchingColorTexture"),G._colorsTexture!==null&&_t.setValue(L,"batchingColorTexture",G._colorsTexture,$));let vi=Y.morphAttributes;if((vi.position!==void 0||vi.normal!==void 0||vi.color!==void 0)&&O.update(G,Y,wn),(yi||we.receiveShadow!==G.receiveShadow)&&(we.receiveShadow=G.receiveShadow,_t.setValue(L,"receiveShadow",G.receiveShadow)),(H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial)&&H.envMap===null&&U.environment!==null&&(Ut.envMapIntensity.value=U.environmentIntensity),Ut.dfgLUT!==void 0&&(Ut.dfgLUT.value=lb()),yi){if(_t.setValue(L,"toneMappingExposure",P.toneMappingExposure),we.needsLights&&J0(Ut,Ms),Me&&H.fog===!0&&Oe.refreshFogUniforms(Ut,Me),Oe.refreshMaterialUniforms(Ut,H,ne,J,T.state.transmissionRenderTarget[b.id]),we.needsLights&&we.lightProbeGrid){let St=we.lightProbeGrid;Ut.probesSH.value=St.texture,Ut.probesMin.value.copy(St.boundingBox.min),Ut.probesMax.value.copy(St.boundingBox.max),Ut.probesResolution.value.copy(St.resolution)}ur.upload(L,Sf(we),Ut,$)}if(H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(ur.upload(L,Sf(we),Ut,$),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&_t.setValue(L,"center",G.center),_t.setValue(L,"modelViewMatrix",G.modelViewMatrix),_t.setValue(L,"normalMatrix",G.normalMatrix),_t.setValue(L,"modelMatrix",G.matrixWorld),H.uniformsGroups!==void 0){let St=H.uniformsGroups;for(let Mi=0,bs=St.length;Mi<bs;Mi++){let wf=St[Mi];re.update(wf,wn),re.bind(wf,wn)}}return wn}function J0(b,U){b.ambientLightColor.needsUpdate=U,b.lightProbe.needsUpdate=U,b.sunLights.needsUpdate=U,b.sunLightShadows.needsUpdate=U,b.directionalLights.needsUpdate=U,b.directionalLightShadows.needsUpdate=U,b.pointLights.needsUpdate=U,b.pointLightShadows.needsUpdate=U,b.spotLights.needsUpdate=U,b.spotLightShadows.needsUpdate=U,b.rectAreaLights.needsUpdate=U,b.hemisphereLights.needsUpdate=U}function K0(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return X},this.getActiveMipmapLevel=function(){return z},this.getRenderTarget=function(){return K},this.setRenderTargetTextures=function(b,U,Y){let H=W.get(b);H.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),W.get(b.texture).__webglTexture=U,W.get(b.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:Y,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,U){let Y=W.get(b);Y.__webglFramebuffer=U,Y.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(b,U=0,Y=0){K=b,X=U,z=Y;let H=null,G=!1,Me=!1;if(b){let ve=W.get(b);if(ve.__useDefaultFramebuffer!==void 0){_.bindFramebuffer(L.FRAMEBUFFER,ve.__webglFramebuffer),ee.copy(b.viewport),Ue.copy(b.scissor),Re=b.scissorTest,_.viewport(ee),_.scissor(Ue),_.setScissorTest(Re),q=-1;return}else if(ve.__webglFramebuffer===void 0)$.setupRenderTarget(b);else if(ve.__hasExternalTextures)$.rebindTextures(b,W.get(b.texture).__webglTexture,W.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){let et=b.depthTexture;if(ve.__boundDepthTexture!==et){if(et!==null&&W.has(et)&&(b.width!==et.image.width||b.height!==et.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");$.setupDepthRenderbuffer(b)}}let Ie=b.texture;(Ie.isData3DTexture||Ie.isDataArrayTexture||Ie.isCompressedArrayTexture)&&(Me=!0);let Ne=W.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Ne[U])?H=Ne[U][Y]:H=Ne[U],G=!0):b.samples>0&&$.useMultisampledRTT(b)===!1?H=W.get(b).__webglMultisampledFramebuffer:Array.isArray(Ne)?H=Ne[Y]:H=Ne,ee.copy(b.viewport),Ue.copy(b.scissor),Re=b.scissorTest}else ee.copy(Se).multiplyScalar(ne).floor(),Ue.copy(Ye).multiplyScalar(ne).floor(),Re=xt;if(Y!==0&&(H=B),_.bindFramebuffer(L.FRAMEBUFFER,H)&&_.drawBuffers(b,H),_.viewport(ee),_.scissor(Ue),_.setScissorTest(Re),G){let ve=W.get(b.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+U,ve.__webglTexture,Y)}else if(Me){let ve=U;for(let Ie=0;Ie<b.textures.length;Ie++){let Ne=W.get(b.textures[Ie]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+Ie,Ne.__webglTexture,Y,ve)}}else if(b!==null&&Y!==0){let ve=W.get(b.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,ve.__webglTexture,Y)}q=-1};function Ef(b){let U=W.get(b);return(U.__readFormat!==b.format||U.__readType!==b.type)&&(U.__readFormat=b.format,U.__readType=b.type,U.__formatReadable=A.textureFormatReadable(b.format),U.__typeReadable=A.textureTypeReadable(b.type)),U}this.readRenderTargetPixels=function(b,U,Y,H,G,Me,Ce,ve=0){if(!(b&&b.isWebGLRenderTarget)){We("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ie=W.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Ce!==void 0&&(Ie=Ie[Ce]),Ie){_.bindFramebuffer(L.FRAMEBUFFER,Ie);try{let Ne=b.textures[ve],et=Ne.format,at=Ne.type;b.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+ve);let Le=Ef(Ne);if(Le.__formatReadable===!1){We("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Le.__typeReadable===!1){We("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=b.width-H&&Y>=0&&Y<=b.height-G&&L.readPixels(U,Y,H,G,ge.convert(et),ge.convert(at),Me)}finally{let Ne=K!==null?W.get(K).__webglFramebuffer:null;_.bindFramebuffer(L.FRAMEBUFFER,Ne)}}},this.readRenderTargetPixelsAsync=async function(b,U,Y,H,G,Me,Ce,ve=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ie=W.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Ce!==void 0&&(Ie=Ie[Ce]),Ie)if(U>=0&&U<=b.width-H&&Y>=0&&Y<=b.height-G){_.bindFramebuffer(L.FRAMEBUFFER,Ie);let Ne=b.textures[ve],et=Ne.format,at=Ne.type;b.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+ve);let Le=Ef(Ne);if(Le.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Le.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let mt=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,mt),L.bufferData(L.PIXEL_PACK_BUFFER,Me.byteLength,L.STREAM_READ),L.readPixels(U,Y,H,G,ge.convert(et),ge.convert(at),0),L.bindBuffer(L.PIXEL_PACK_BUFFER,null);let Ft=K!==null?W.get(K).__webglFramebuffer:null;_.bindFramebuffer(L.FRAMEBUFFER,Ft);let Tt=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await Kp(L,Tt,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,mt),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,Me),L.bindBuffer(L.PIXEL_PACK_BUFFER,null),L.deleteBuffer(mt),L.deleteSync(Tt),Me}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,U=null,Y=0){let H=Math.pow(2,-Y),G=Math.floor(b.image.width*H),Me=Math.floor(b.image.height*H),Ce=U!==null?U.x:0,ve=U!==null?U.y:0;$.setTexture2D(b,0),L.copyTexSubImage2D(L.TEXTURE_2D,Y,0,0,Ce,ve,G,Me),_.unbindTexture()},this.copyTextureToTexture=function(b,U,Y=null,H=null,G=0,Me=0){let Ce,ve,Ie,Ne,et,at,Le,mt,Ft,Tt=b.isCompressedTexture?b.mipmaps[Me]:b.image;if(Y!==null)Ce=Y.max.x-Y.min.x,ve=Y.max.y-Y.min.y,Ie=Y.isBox3?Y.max.z-Y.min.z:1,Ne=Y.min.x,et=Y.min.y,at=Y.isBox3?Y.min.z:0;else{let Ut=Math.pow(2,-G);Ce=Math.floor(Tt.width*Ut),ve=Math.floor(Tt.height*Ut),b.isDataArrayTexture?Ie=Tt.depth:b.isData3DTexture?Ie=Math.floor(Tt.depth*Ut):Ie=1,Ne=0,et=0,at=0}H!==null?(Le=H.x,mt=H.y,Ft=H.z):(Le=0,mt=0,Ft=0);let Mt=ge.convert(U.format),en=ge.convert(U.type),we;U.isData3DTexture?($.setTexture3D(U,0),we=L.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?($.setTexture2DArray(U,0),we=L.TEXTURE_2D_ARRAY):($.setTexture2D(U,0),we=L.TEXTURE_2D),_.activeTexture(L.TEXTURE0),_.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,U.flipY),_.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),_.pixelStorei(L.UNPACK_ALIGNMENT,U.unpackAlignment);let ln=_.getParameter(L.UNPACK_ROW_LENGTH),lt=_.getParameter(L.UNPACK_IMAGE_HEIGHT),wn=_.getParameter(L.UNPACK_SKIP_PIXELS),Gn=_.getParameter(L.UNPACK_SKIP_ROWS),yi=_.getParameter(L.UNPACK_SKIP_IMAGES);_.pixelStorei(L.UNPACK_ROW_LENGTH,Tt.width),_.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Tt.height),_.pixelStorei(L.UNPACK_SKIP_PIXELS,Ne),_.pixelStorei(L.UNPACK_SKIP_ROWS,et),_.pixelStorei(L.UNPACK_SKIP_IMAGES,at);let Ms=b.isDataArrayTexture||b.isData3DTexture,_t=U.isDataArrayTexture||U.isData3DTexture;if(b.isDepthTexture){let Ut=W.get(b),vi=W.get(U),St=W.get(Ut.__renderTarget),Mi=W.get(vi.__renderTarget);_.bindFramebuffer(L.READ_FRAMEBUFFER,St.__webglFramebuffer),_.bindFramebuffer(L.DRAW_FRAMEBUFFER,Mi.__webglFramebuffer);for(let bs=0;bs<Ie;bs++)Ms&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,W.get(b).__webglTexture,G,at+bs),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,W.get(U).__webglTexture,Me,Ft+bs)),L.blitFramebuffer(Ne,et,Ce,ve,Le,mt,Ce,ve,L.DEPTH_BUFFER_BIT,L.NEAREST);_.bindFramebuffer(L.READ_FRAMEBUFFER,null),_.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(G!==0||b.isRenderTargetTexture||W.has(b)){let Ut=W.get(b),vi=W.get(U);_.bindFramebuffer(L.READ_FRAMEBUFFER,D),_.bindFramebuffer(L.DRAW_FRAMEBUFFER,V);for(let St=0;St<Ie;St++)Ms?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Ut.__webglTexture,G,at+St):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Ut.__webglTexture,G),_t?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,vi.__webglTexture,Me,Ft+St):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,vi.__webglTexture,Me),G!==0?L.blitFramebuffer(Ne,et,Ce,ve,Le,mt,Ce,ve,L.COLOR_BUFFER_BIT,L.NEAREST):_t?L.copyTexSubImage3D(we,Me,Le,mt,Ft+St,Ne,et,Ce,ve):L.copyTexSubImage2D(we,Me,Le,mt,Ne,et,Ce,ve);_.bindFramebuffer(L.READ_FRAMEBUFFER,null),_.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else _t?b.isDataTexture||b.isData3DTexture?L.texSubImage3D(we,Me,Le,mt,Ft,Ce,ve,Ie,Mt,en,Tt.data):U.isCompressedArrayTexture?L.compressedTexSubImage3D(we,Me,Le,mt,Ft,Ce,ve,Ie,Mt,Tt.data):L.texSubImage3D(we,Me,Le,mt,Ft,Ce,ve,Ie,Mt,en,Tt):b.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,Me,Le,mt,Ce,ve,Mt,en,Tt.data):b.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,Me,Le,mt,Tt.width,Tt.height,Mt,Tt.data):L.texSubImage2D(L.TEXTURE_2D,Me,Le,mt,Ce,ve,Mt,en,Tt);_.pixelStorei(L.UNPACK_ROW_LENGTH,ln),_.pixelStorei(L.UNPACK_IMAGE_HEIGHT,lt),_.pixelStorei(L.UNPACK_SKIP_PIXELS,wn),_.pixelStorei(L.UNPACK_SKIP_ROWS,Gn),_.pixelStorei(L.UNPACK_SKIP_IMAGES,yi),Me===0&&U.generateMipmaps&&L.generateMipmap(we),_.unbindTexture()},this.initRenderTarget=function(b){W.get(b).__webglFramebuffer===void 0&&$.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?$.setTextureCube(b,0):b.isData3DTexture?$.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?$.setTexture2DArray(b,0):$.setTexture2D(b,0),_.unbindTexture()},this.resetState=function(){X=0,z=0,K=null,_.reset(),be.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return zn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=it._getDrawingBufferColorSpace(e),t.unpackColorSpace=it._getUnpackColorSpace()}};var pr={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};var Tn=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},hb=new Ni(-1,1,1,-1,0,1),Gu=class extends vt{constructor(){super(),this.setAttribute("position",new ot([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ot([0,2,0,0,2,0],2))}},ub=new Gu,Bi=class{constructor(e){this._mesh=new Ze(ub,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,hb)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var vl=class extends Tn{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof Ct?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=_i.clone(e.uniforms),this.material=new Ct({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Bi(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var za=class extends Tn{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},Ml=class extends Tn{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}};var bl=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new se);this._width=n.width,this._height=n.height,t=new Bt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Qt}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new vl(pr),this.copyPass.material.blending=Rn,this.timer=new ya}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let s=0,r=this.passes.length;s<r;s++){let a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){let o=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}za!==void 0&&(a instanceof za?n=!0:a instanceof Ml&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new se);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var Sl=class extends Tn{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new Te}render(e,t,n){let s=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}};var Um={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Te(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};var mr=class i extends Tn{constructor(e,t=1,n,s){super(),this.strength=t,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new se(e.x,e.y):new se(256,256),this.clearColor=new Te(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Bt(r,a,{type:Qt,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){let u=new Bt(r,a,{type:Qt,depthBuffer:!1});u.texture.name="UnrealBloomPass.h"+h,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);let d=new Bt(r,a,{type:Qt,depthBuffer:!1});d.texture.name="UnrealBloomPass.v"+h,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),r=Math.round(r/2),a=Math.round(a/2)}let o=Um;this.highPassUniforms=_i.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Ct({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let c=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new se(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let l=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=l,this.bloomTintColors=[new I(1,1,1),new I(1,1,1),new I(1,1,1),new I(1,1,1),new I(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=_i.clone(pr.uniforms),this.blendMaterial=new Ct({uniforms:this.copyUniforms,vertexShader:pr.vertexShader,fragmentShader:pr.fragmentShader,premultipliedAlpha:!0,blending:It,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Te,this._oldClearAlpha=1,this._basic=new At,this._fsQuad=new Bi(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new se(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();let a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this._fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[c].uniforms.direction.value=i.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=i.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[c];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=a}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let a=0;a<e;a++)t.push(.39894*Math.exp(-.5*a*a/(n*n))/n);let s=[],r=[];for(let a=1;a<e;a+=2){let o=t[a],c=a+1<e?t[a+1]:0,l=o+c;s.push((a*o+(a+1)*c)/l),r.push(l)}return new Ct({defines:{KERNEL_PAIRS:s.length},uniforms:{colorTexture:{value:null},invSize:{value:new se(.5,.5)},direction:{value:new se(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:s},gaussianWeights:{value:r}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new Ct({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};mr.BlurDirectionX=new se(1,0);mr.BlurDirectionY=new se(0,1);var Ba={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};var Tl=class extends Tn{constructor(){super(),this.isOutputPass=!0,this.uniforms=_i.clone(Ba.uniforms),this.material=new tr({name:Ba.name,uniforms:this.uniforms,vertexShader:Ba.vertexShader,fragmentShader:Ba.fragmentShader}),this._fsQuad=new Bi(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},it.getTransfer(this._outputColorSpace)===ht&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Ma?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===ba?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Sa?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===hs?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Ea?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===wa?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Ta&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var El=class extends ts{constructor(){super(),this.name="RoomEnvironment",this.position.y=-3.5;let e=new ei;e.deleteAttribute("uv");let t=new bn({side:jt}),n=new bn,s=new gi(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);let r=new Ze(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let a=new Kr(e,n,6),o=new Ot;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);let c=new Ze(e,gr(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);let l=new Ze(e,gr(50));l.position.set(-16.109,18.021,-8.207),l.scale.set(.1,2.425,2.751),this.add(l);let h=new Ze(e,gr(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);let u=new Ze(e,gr(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);let d=new Ze(e,gr(20));d.position.set(3.235,11.486,-12.541),d.scale.set(2.5,2,.1),this.add(d);let f=new Ze(e,gr(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function gr(i){return new fa({color:0,emissive:16777215,emissiveIntensity:i})}var Ln=gt.R+2.2;function Om(i,e){let t=document.createElement("canvas");t.width=t.height=i;let n=t.getContext("2d"),s=i/(Ln*2);n.translate(i/2,i/2),n.scale(s,s),e(n);let r=new Qn(t);return r.colorSpace=zt,r.anisotropy=8,r}function Wu(i,e){i.beginPath(),i.arc(0,0,e,0,Math.PI*2)}function db(i){let e=gt.R;i.fillStyle="#0a0e1c",i.fillRect(-Ln,-Ln,Ln*2,Ln*2);let t=i.createRadialGradient(0,0,0,0,0,e);t.addColorStop(0,"#2b3a63"),t.addColorStop(.45,"#1a2442"),t.addColorStop(1,"#0d1326"),i.fillStyle=t,Wu(i,e),i.fill();for(let[n,s,r]of[[9.6,12.4,"rgba(120,160,255,0.05)"],[5.8,6.6,"rgba(120,160,255,0.08)"],[0,2.6,"rgba(140,190,255,0.09)"]])i.fillStyle=r,i.beginPath(),i.arc(0,0,s,0,Math.PI*2),i.arc(0,0,n,0,Math.PI*2,!0),i.fill();for(let n=0;n<900;n++){let s=Math.random()*e,r=Math.random()*Math.PI*2,a=.1+Math.random()*.5;i.strokeStyle=`rgba(${Math.random()<.5?"255,255,255":"0,0,0"},${.02+Math.random()*.05})`,i.lineWidth=.02+Math.random()*.03,i.beginPath(),i.arc(0,0,s,r,r+a),i.stroke()}i.strokeStyle="rgba(255,255,255,0.05)",i.lineWidth=.05;for(let n=0;n<24;n++){let s=n/24*Math.PI*2;i.beginPath(),i.moveTo(Math.cos(s)*2.8,Math.sin(s)*2.8),i.lineTo(Math.cos(s)*e,Math.sin(s)*e),i.stroke()}i.fillStyle="#161d33",i.beginPath(),i.arc(0,0,Ln,0,Math.PI*2),i.arc(0,0,e,0,Math.PI*2,!0),i.fill()}function fb(i){let e=gt.R;i.fillStyle="#000",i.fillRect(-Ln,-Ln,Ln*2,Ln*2),i.lineCap="butt";let t=(n,s,r,a)=>{i.strokeStyle=r,i.lineWidth=s,i.setLineDash(a||[]),Wu(i,n),i.stroke(),i.setLineDash([])};t(2.6,.07,"#57d8ff"),t(6.2,.05,"#2f7fd0",[.5,.35]),t(9.6,.07,"#3aa8ff"),t(12.35,.5,"#ff5a2a",[.9,.6]),t(11.95,.05,"#ff9a4a"),i.strokeStyle="#2c8fe0",i.lineWidth=.05;for(let n=0;n<12;n++){let s=n/12*Math.PI*2+Math.PI/12;i.beginPath(),i.moveTo(Math.cos(s)*9.6,Math.sin(s)*9.6),i.lineTo(Math.cos(s)*11.9,Math.sin(s)*11.9),i.stroke()}for(let n=0;n<72;n++){let s=n/72*Math.PI*2,r=n%6===0?5.7:6;i.beginPath(),i.moveTo(Math.cos(s)*r,Math.sin(s)*r),i.lineTo(Math.cos(s)*6.2,Math.sin(s)*6.2),i.stroke()}i.strokeStyle="#7fe4ff",i.lineWidth=.08,i.beginPath();for(let n=0;n<6;n++){let s=n/6*Math.PI*2;i[n?"lineTo":"moveTo"](Math.cos(s)*1.7,Math.sin(s)*1.7)}i.closePath(),i.stroke(),i.beginPath();for(let n=0;n<3;n++){let s=n/3*Math.PI*2-Math.PI/2;i[n?"lineTo":"moveTo"](Math.cos(s)*1.1,Math.sin(s)*1.1)}i.closePath(),i.stroke(),i.fillStyle="#bff2ff",Wu(i,.22),i.fill()}function pb(){let i=document.createElement("canvas");i.width=i.height=2048;let e=i.getContext("2d"),t=2048/180;e.fillStyle="#04060d",e.fillRect(0,0,2048,2048),e.translate(1024,1024),e.scale(t,t);let n=e.createRadialGradient(0,0,14,0,0,70);n.addColorStop(0,"rgba(46,104,255,0.55)"),n.addColorStop(.25,"rgba(30,60,170,0.26)"),n.addColorStop(.6,"rgba(20,30,90,0.1)"),n.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=n,e.fillRect(-90,-90,180,180);for(let[r,a,o,c]of[[21.5,.22,.9,null],[24,.08,.5,[1.2,.8]],[31,.12,.45,null],[33,1.2,.07,[4,2]],[42,.1,.3,[.6,2.4]],[54,.14,.22,null],[70,.1,.14,null]])e.strokeStyle=`rgba(90,150,255,${o})`,e.lineWidth=a,e.setLineDash(c||[]),e.beginPath(),e.arc(0,0,r,0,Math.PI*2),e.stroke();e.setLineDash([]);for(let r=0;r<36;r++){let a=r/36*Math.PI*2,o=r%3===0;e.strokeStyle=`rgba(90,150,255,${o?.3:.1})`,e.lineWidth=o?.12:.06,e.beginPath(),e.moveTo(Math.cos(a)*(o?24:31),Math.sin(a)*(o?24:31)),e.lineTo(Math.cos(a)*88,Math.sin(a)*88),e.stroke()}for(let r=0;r<18;r++){let a=r/18*Math.PI*2+.09;e.fillStyle=`rgba(70,130,255,${r%2?.05:.1})`,e.beginPath(),e.arc(0,0,30.4,a,a+.17),e.arc(0,0,25,a+.17,a,!0),e.closePath(),e.fill()}let s=new Qn(i);return s.colorSpace=zt,s.anisotropy=8,s}function Fm(i){let e=new gl({canvas:i,antialias:!0,powerPreference:"high-performance"});e.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),e.shadowMap.enabled=!0,e.shadowMap.type=cs,e.toneMapping=hs,e.toneMappingExposure=1;let t=new ts;t.background=new Te(263693),t.fog=new Xr(263693,.011);let n=new dr(e);t.environment=n.fromScene(new El,.04).texture,t.environmentIntensity=.55;let s=new Zt(40,1,.5,400);t.add(new ga(10470655,724248,.55));let r=new sr(16777215,1.8);r.position.set(9,26,12),r.castShadow=!0,r.shadow.mapSize.set(2048,2048);let a=r.shadow.camera;a.left=-17,a.right=17,a.top=17,a.bottom=-17,a.near=5,a.far=60,r.shadow.bias=-6e-4,r.shadow.normalBias=.03,t.add(r);let o=new sr(6982911,.9);o.position.set(-14,10,-16),t.add(o);let{R:c,H:l}=gt,h=[];for(let z=0;z<=48;z++){let K=c*z/48;h.push(new se(K,Yi(K)))}h.push(new se(c+.02,l+.15),new se(c+.3,l+1),new se(c+1.25,l+1),new se(c+1.7,l+.35),new se(c+2.1,-2.5));let u=new da(h,128),d=u.attributes.position,f=u.attributes.uv;for(let z=0;z<d.count;z++)f.setXY(z,d.getX(z)/(Ln*2)+.5,.5-d.getZ(z)/(Ln*2));let m=new bn({map:Om(2048,db),emissiveMap:Om(2048,fb),emissive:16777215,emissiveIntensity:.85,metalness:.82,roughness:.36,side:Nt}),x=new Ze(u,m);x.receiveShadow=!0,t.add(x);let g=new At({color:3524863}),p=new Ze(new os(c+.34,.07,10,160),g);p.rotation.x=Math.PI/2,p.position.y=l+1.04,t.add(p);let M=new Ze(new os(c+1.22,.05,8,160),new At({color:2245802}));M.rotation.x=Math.PI/2,M.position.y=l+1.03,t.add(M);let C=new Ze(new Kt(c+4.5,c+6,1.6,64),new bn({color:790818,metalness:.7,roughness:.5}));C.position.y=-1.7,C.receiveShadow=!0,t.add(C);let v=new Ze(new os(c+4.5,.06,8,128),new At({color:1922760}));v.rotation.x=Math.PI/2,v.position.y=-.88,t.add(v);let w=new Ze(new mi(180,180),new At({map:pb(),fog:!1}));w.rotation.x=-Math.PI/2,w.position.y=-2.5,t.add(w);let T=[],R=new Kt(.15,1.5,46,20,1,!0);R.translate(0,23,0);for(let z=0;z<8;z++){let K=z/8*Math.PI*2+.4,q=new Ze(R,new At({color:z%2?2780415:9059583,transparent:!0,opacity:.018,blending:It,depthWrite:!1,side:Nt,fog:!1}));q.position.set(Math.cos(K)*34,-2.5,Math.sin(K)*34),t.add(q),T.push({m:q,a:K,ph:z*1.7})}let y=1400,E=new Float32Array(y*3),P=new Float32Array(y*3),N=[new Te(3837183),new Te(16730762),new Te(16765562),new Te(9109482)];for(let z=0;z<y;z++){let K=Math.random()*Math.PI*2,q=34+Math.random()*46;E[z*3]=Math.cos(K)*q,E[z*3+1]=-1+(q-34)*.55+Math.random()*3,E[z*3+2]=Math.sin(K)*q;let Q=N[Math.random()*N.length|0],ee=.25+Math.random()*.75;P[z*3]=Q.r*ee,P[z*3+1]=Q.g*ee,P[z*3+2]=Q.b*ee}let F=new vt;F.setAttribute("position",new wt(E,3)),F.setAttribute("color",new wt(P,3));let B=new is(F,new Ks({size:.55,vertexColors:!0,transparent:!0,blending:It,depthWrite:!1,fog:!1}));t.add(B);let D=new bl(e);D.addPass(new Sl(t,s));let V=new mr(new se(1,1),.6,.5,.9);D.addPass(V),D.addPass(new Tl);let X={renderer:e,scene:t,camera:s,composer:D,bloom:V,floorMat:m,rimMat:g,beams:T,crowd:B,key:r,rimColor:new Te(3524863),rimPulse:0,rimPulseColor:new Te(16777215),width:1,height:1,resize(){let z=window.innerWidth,K=window.innerHeight;X.width=z,X.height=K,e.setSize(z,K,!1),D.setSize(z,K),s.aspect=z/K,s.updateProjectionMatrix()},update(z,K){for(let q of T)q.m.rotation.z=Math.sin(K*.35+q.ph)*.28-Math.cos(q.a)*.45,q.m.rotation.x=Math.cos(K*.3+q.ph)*.28+Math.sin(q.a)*.45;B.rotation.y=K*.01,B.material.opacity=.75+Math.sin(K*7)*.08,X.rimPulse=Math.max(0,X.rimPulse-z*2.2),g.color.copy(X.rimColor).lerp(X.rimPulseColor,Math.min(1,X.rimPulse)),g.color.multiplyScalar(1.1+X.rimPulse*.7),m.emissiveIntensity=.85+X.rimPulse*.25+Math.sin(K*2)*.05},pulseRim(z,K=1){X.rimPulseColor.set(z),X.rimPulse=Math.max(X.rimPulse,K)},render(){D.render()}};return X.resize(),X}function mb(i,e){let t=new Qs,n=Math.PI*2/i,s=(a,o,c)=>t[c?"moveTo":"lineTo"](Math.cos(o)*a,Math.sin(o)*a);for(let a=0;a<i;a++){let o=a*n;e==="ATTACK"?(s(.62,o,a===0),s(1.04,o+n*.1),s(1,o+n*.22),s(.84,o+n*.5),s(.7,o+n*.78)):e==="DEFENSE"?(s(.9,o,a===0),s(1,o+n*.12),s(1,o+n*.62),s(.9,o+n*.76),s(.84,o+n*.88)):(s(.74,o,a===0),s(.98,o+n*.16),s(.98,o+n*.5),s(.86,o+n*.74),s(.74,o+n*.86))}t.closePath();let r=new ss;return r.absarc(0,0,.4,0,Math.PI*2,!0),t.holes.push(r),t}function gb(){let i=document.createElement("canvas");i.width=i.height=256;let e=i.getContext("2d");e.translate(128,128);for(let s=0;s<90;s++){let r=84+Math.random()*40,a=Math.random()*Math.PI*2,o=.5+Math.random()*1.6;e.strokeStyle=`rgba(255,255,255,${.05+Math.random()*.22})`,e.lineWidth=1+Math.random()*4,e.beginPath(),e.arc(0,0,r,a,a+o),e.stroke()}let t=e.createRadialGradient(0,0,90,0,0,128);t.addColorStop(0,"rgba(255,255,255,0)"),t.addColorStop(.7,"rgba(255,255,255,0.35)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.beginPath(),e.arc(0,0,128,0,Math.PI*2),e.fill();let n=new Qn(i);return n.colorSpace=zt,n}var Xu=null;function km(i,e){let t=new Te(i.color),n=new vn,s=new vn;n.add(s);let r=(w,T,R=0,y=s)=>{let E=new Ze(w,T);return E.position.y=R,E.castShadow=!0,y.add(E),E},a=new bn({color:12174038,metalness:1,roughness:.2,envMapIntensity:1}),o=new bn({color:1317418,metalness:.9,roughness:.32}),c=new nr({color:t.clone().multiplyScalar(.42),metalness:.5,roughness:.34,clearcoat:.5,clearcoatRoughness:.2,envMapIntensity:.6,emissive:t,emissiveIntensity:.14}),l=new nr({color:t.clone().multiplyScalar(.16),metalness:.7,roughness:.32,clearcoat:.5,clearcoatRoughness:.2,envMapIntensity:.7}),h=new At({color:t.clone().lerp(new Te(16777215),.2).multiplyScalar(1.2)}),u=r(new ia(.17,.36,16),a,.18);u.rotation.x=Math.PI,r(new Kt(.44,.2,.2,24),o,.44),r(new Kt(.9,.78,.13,64),a,.59),r(new Kt(.8,.8,.05,64),h,.68);let d={depth:.18,bevelEnabled:!0,bevelThickness:.045,bevelSize:.04,bevelSegments:3,curveSegments:24},f=new ua(mb(i.teeth,i.type),d);f.rotateX(-Math.PI/2),r(f,c,.75);let m=r(f,l,.93);m.scale.set(.7,.55,.7),m.rotation.y=Math.PI/i.teeth;let x=Math.PI*2/i.teeth;for(let w=0;w<i.teeth;w++){let T=(w+.3)*x,R=r(new Kt(.065,.065,.06,12),a,1);R.position.x=Math.cos(T)*.86,R.position.z=-Math.sin(T)*.86;let y=r(new ei(.2,.03,.045),h,.985),E=(w+.52)*x;y.position.x=Math.cos(E)*.8,y.position.z=-Math.sin(E)*.8,y.rotation.y=E,y.castShadow=!1}r(new Kt(.4,.44,.1,40),a,1.07),r(new Kt(.3,.34,.1,6),l,1.14),r(new Kt(.13,.15,.06,20),h,1.2),Xu||(Xu=gb());let g=new At({map:Xu,color:t,transparent:!0,opacity:.3,blending:It,depthWrite:!1,side:Nt}),p=new Ze(new na(1.12,48),g);p.rotation.x=-Math.PI/2,p.position.y=.9,n.add(p);let M=new Ze(new mi(1,1),new At({map:e,color:t,transparent:!0,opacity:.5,blending:It,depthWrite:!1}));M.rotation.x=-Math.PI/2,M.position.y=.06,M.scale.setScalar(5),M.renderOrder=5,n.add(M);let C=new Ct({uniforms:{uColor:{value:t.clone().lerp(new Te(16777215),.35)},uTime:{value:0},uAlpha:{value:0}},vertexShader:`varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); vP = position; gl_Position = projectionMatrix * mv; }`,fragmentShader:`uniform vec3 uColor; uniform float uTime; uniform float uAlpha; varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main(){ float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
        float band = 0.5 + 0.5 * sin(vP.y * 9.0 - uTime * 9.0);
        float hex = smoothstep(0.86, 1.0, abs(sin(atan(vP.z, vP.x) * 6.0 + vP.y * 3.0)));
        gl_FragColor = vec4(uColor * (f * 1.5 + band * 0.12 + hex * 0.35) * uAlpha, 1.0); }`,blending:It,depthWrite:!1,transparent:!0,side:Nt}),v=new Ze(new as(1.5,32,20),C);return v.position.y=.7,v.visible=!1,n.add(v),s.scale.setScalar(1.25),p.scale.setScalar(1.25),p.position.y=1.12,v.scale.setScalar(1.25),v.position.y=.85,{group:n,spin:s,blur:p,blurMat:g,aura:M,shield:v,shieldMat:C,body:c,color:t,wobble:Math.random()*6,shieldAlpha:0}}function zm(i){i.group.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()})}var Qe=(i,e)=>Yi(Math.hypot(i,e)),wl=new Te;function Gm(){let i=document.createElement("canvas");i.width=i.height=128;let e=i.getContext("2d"),t=e.createRadialGradient(64,64,0,64,64,64);t.addColorStop(0,"rgba(255,255,255,1)"),t.addColorStop(.25,"rgba(255,255,255,0.55)"),t.addColorStop(.6,"rgba(255,255,255,0.12)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.fillRect(0,0,128,128);let n=new Qn(i);return n.colorSpace=zt,n}var Rl=class{constructor(e,t=6e3){this.max=t,this.cursor=0,this.pos=new Float32Array(t*3),this.vel=new Float32Array(t*3),this.base=new Float32Array(t*3),this.col=new Float32Array(t*3),this.size=new Float32Array(t),this.size0=new Float32Array(t),this.life=new Float32Array(t),this.life0=new Float32Array(t),this.grav=new Float32Array(t),this.drag=new Float32Array(t);let n=new vt;n.setAttribute("position",new wt(this.pos,3).setUsage(ds)),n.setAttribute("aColor",new wt(this.col,3).setUsage(ds)),n.setAttribute("aSize",new wt(this.size,1).setUsage(ds)),this.mat=new Ct({uniforms:{uScale:{value:600}},vertexShader:`
        attribute float aSize; attribute vec3 aColor; varying vec3 vColor; uniform float uScale;
        void main(){ vColor = aColor; vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * uScale / -mv.z; gl_Position = projectionMatrix * mv; }`,fragmentShader:`
        varying vec3 vColor;
        void main(){ float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.05, d);
          gl_FragColor = vec4(vColor * a * a, 1.0); }`,blending:It,depthWrite:!1,transparent:!0}),this.points=new is(n,this.mat),this.points.frustumCulled=!1,this.points.renderOrder=20,e.add(this.points)}emit(e,t,n,s,r,a,o,c,l,h=18,u=1.2){let d=this.cursor;this.cursor=(d+1)%this.max;let f=d*3;this.pos[f]=e,this.pos[f+1]=t,this.pos[f+2]=n,this.vel[f]=s,this.vel[f+1]=r,this.vel[f+2]=a,wl.set(l),this.base[f]=wl.r,this.base[f+1]=wl.g,this.base[f+2]=wl.b,this.life[d]=this.life0[d]=o,this.size0[d]=c,this.grav[d]=h,this.drag[d]=u}burst(e,t,n,s,r,a,o={}){let{dx:c=0,dy:l=0,dz:h=0,bias:u=0,up:d=.6,life:f=.5,size:m=.22,gravity:x=18,drag:g=1.2,flat:p=!1}=o;for(let M=0;M<s;M++){let C=Math.random()*Math.PI*2,v=p?0:(Math.random()*.9+.05)*d,w=a*(.35+Math.random()*.65),T=Math.cos(v*Math.PI*.5),R=Math.cos(C)*T,y=Math.sin(v*Math.PI*.5),E=Math.sin(C)*T;R=R*(1-u)+c*u,y=y*(1-u)+l*u,E=E*(1-u)+h*u,this.emit(e,t,n,R*w,y*w,E*w,f*(.5+Math.random()*.7),m*(.6+Math.random()*.8),r,x,g)}}update(e){let{pos:t,vel:n,base:s,col:r,size:a,size0:o,life:c,life0:l,grav:h,drag:u,max:d}=this;for(let m=0;m<d;m++){if(c[m]<=0){a[m]!==0&&(a[m]=0);continue}c[m]-=e;let x=m*3;if(c[m]<=0){a[m]=0;continue}let g=Math.exp(-u[m]*e);if(n[x]*=g,n[x+1]=n[x+1]*g-h[m]*e,n[x+2]*=g,t[x]+=n[x]*e,t[x+1]+=n[x+1]*e,t[x+2]+=n[x+2]*e,h[m]>0){let C=Qe(t[x],t[x+2])+.03;t[x+1]<C&&(t[x+1]=C,n[x+1]=Math.abs(n[x+1])*.35)}let p=c[m]/l[m],M=p<.7?p/.7:1;r[x]=s[x]*M,r[x+1]=s[x+1]*M,r[x+2]=s[x+2]*M,a[m]=o[m]*(.4+.6*p)}let f=this.points.geometry;f.attributes.position.needsUpdate=!0,f.attributes.aColor.needsUpdate=!0,f.attributes.aSize.needsUpdate=!0}},Pl=class{constructor(e,t=24){this.items=[];let n=new Pi(.82,1,72);n.rotateX(-Math.PI/2);for(let s=0;s<t;s++){let r=new At({color:16777215,transparent:!0,blending:It,depthWrite:!1,side:Nt}),a=new Ze(n,r);a.visible=!1,a.renderOrder=12,e.add(a),this.items.push({m:a,t:0,T:0,r0:0,r1:0,a:1})}this.i=0}spawn(e,t,n,s,r,a,o,c=1){let l=this.items[this.i];this.i=(this.i+1)%this.items.length,l.t=0,l.T=a,l.r0=s,l.r1=r,l.a=c,l.m.material.color.set(o),l.m.position.set(e,t,n),l.m.visible=!0}update(e){for(let t of this.items){if(!t.m.visible)continue;t.t+=e;let n=t.t/t.T;if(n>=1){t.m.visible=!1;continue}let s=1-(1-n)*(1-n)*(1-n);t.m.scale.setScalar(t.r0+(t.r1-t.r0)*s),t.m.material.opacity=t.a*(1-n)*(1-n)}}},Il=class{constructor(e,t){this.sprites=[];for(let n=0;n<16;n++){let s=new Ci(new pi({map:t,color:16777215,blending:It,depthWrite:!1,transparent:!0}));s.visible=!1,s.renderOrder=21,e.add(s),this.sprites.push({s,t:0,T:1,size:1,a:1})}this.lights=[];for(let n=0;n<3;n++){let s=new gi(16777215,0,30,1.6);e.add(s),this.lights.push({l:s,t:0,T:1,p:0})}this.si=0,this.li=0}flash(e,t,n,s,r,a,o=1,c=0){let l=this.sprites[this.si];if(this.si=(this.si+1)%this.sprites.length,l.t=0,l.T=r,l.size=s,l.a=o,l.s.material.color.set(a),l.s.position.set(e,t,n),l.s.visible=!0,c>0){let h=this.lights[this.li];this.li=(this.li+1)%this.lights.length,h.t=0,h.T=r*1.5,h.p=c*.1,h.l.color.set(a),h.l.position.set(e,t+3,n)}}update(e){for(let t of this.sprites){if(!t.s.visible)continue;t.t+=e;let n=t.t/t.T;if(n>=1){t.s.visible=!1;continue}t.s.scale.setScalar(t.size*(.6+.6*n)),t.s.material.opacity=t.a*.7*(1-n)*(1-n)}for(let t of this.lights){if(t.p<=0)continue;t.t+=e;let n=Math.min(1,t.t/t.T);t.l.intensity=t.p*(1-n)*(1-n),n>=1&&(t.p=0)}}},Bm=.7,Ll=class{constructor(e,t,n=64){this.n=n,this.pts=[],this.color=new Te(t),this.width=.2,this.boost=0,this.posArr=new Float32Array(n*2*3),this.colArr=new Float32Array(n*2*3);let s=[];for(let a=0;a<n-1;a++){let o=a*2;s.push(o,o+1,o+2,o+1,o+3,o+2)}let r=new vt;r.setAttribute("position",new wt(this.posArr,3).setUsage(ds)),r.setAttribute("color",new wt(this.colArr,3).setUsage(ds)),r.setIndex(s),this.mesh=new Ze(r,new At({vertexColors:!0,transparent:!0,blending:It,depthWrite:!1,side:Nt})),this.mesh.frustumCulled=!1,this.mesh.renderOrder=8,e.add(this.mesh)}reset(){this.pts.length=0,this.rebuild()}push(e,t,n=0){let s=this.pts[0];s&&Math.hypot(s.x-e,s.z-t)>4&&(this.pts.length=0),s&&this.pts.length&&Math.hypot(s.x-e,s.z-t)<.16&&Math.abs(s.lift-n)<.3?(s.x=e,s.z=t,s.lift=n):(this.pts.unshift({x:e,z:t,lift:n,age:0,w:this.width*(1+this.boost*1.6),b:1+this.boost*1.5}),this.pts.length>this.n&&this.pts.pop())}update(e){let t=this.pts;for(let n=1;n<t.length;n++)t[n].age+=e;for(;t.length>1&&t[t.length-1].age>=Bm;)t.pop();this.rebuild()}rebuild(){let{pts:e,n:t,posArr:n,colArr:s,color:r}=this;for(let o=0;o<t;o++){let c=e[Math.min(o,e.length-1)],l=e[Math.min(o+1,e.length-1)]||c,h=o*6;if(!c||o>=e.length){for(let M=0;M<6;M++)s[h+M]=0;if(c)for(let M=0;M<2;M++)n[h+M*3]=c.x,n[h+M*3+1]=0,n[h+M*3+2]=c.z;continue}let u=c.x-l.x,d=c.z-l.z,f=Math.hypot(u,d)||1;u/=f,d/=f;let m=(1-o/t)*Math.max(0,1-c.age/Bm),x=c.w*(.15+.85*m),g=Qe(c.x,c.z)+.07+c.lift;n[h]=c.x-d*x,n[h+1]=g,n[h+2]=c.z+u*x,n[h+3]=c.x+d*x,n[h+4]=g,n[h+5]=c.z-u*x;let p=m*m*.85*c.b;for(let M=0;M<2;M++)s[h+M*3]=r.r*p,s[h+M*3+1]=r.g*p,s[h+M*3+2]=r.b*p}let a=this.mesh.geometry;a.attributes.position.needsUpdate=!0,a.attributes.color.needsUpdate=!0}dispose(e){e.remove(this.mesh),this.mesh.geometry.dispose(),this.mesh.material.dispose()}},Al=20,qu=64,Cl=5,Vm=40,Yu={x:0,z:0};function Hm(i,e){let t=Math.hypot(i,e),n=t>gt.R?gt.R/t:1;return Yu.x=i*n,Yu.z=e*n,Yu}var Dl=class{constructor(e){this.scene=e,this.pools={rect:[],ring:[],path:[]},this.used={rect:0,ring:0,path:0}}begin(){for(let e in this.pools){for(let t=0;t<this.used[e];t++)this.pools[e][t].visible=!1;this.used[e]=0}}get(e){let t=this.pools[e],n=t[this.used[e]++];if(!n){let s=new vt;if(e==="path")s.setAttribute("position",new wt(new Float32Array(Vm*3),3)),n=new Qr(s,new pa({transparent:!0,depthWrite:!1,dashSize:.35,gapSize:.3,blending:It}));else{let r=e==="rect"?Al:qu,a=e==="rect"?1:Cl;s.setAttribute("position",new wt(new Float32Array((r+1)*(a+1)*3),3));let o=[];for(let c=0;c<r;c++)for(let l=0;l<a;l++){let h=c*(a+1)+l,u=h+a+1;o.push(h,u,h+1,u,u+1,h+1)}s.setIndex(o),n=new Ze(s,new At({transparent:!0,depthWrite:!1,side:Nt,blending:It}))}n.frustumCulled=!1,n.renderOrder=6,this.scene.add(n),t.push(n)}return n.visible=!0,n}rect(e,t,n,s,r,a,o,c,l=.08){if(r<=.01)return;let h=this.get("rect"),u=h.geometry.attributes.position.array;for(let d=0;d<=Al;d++){let f=e+n*r*(d/Al),m=t+s*r*(d/Al);for(let x=0;x<2;x++){let g=x?1:-1,p=Hm(f-s*a*g,m+n*a*g),M=(d*2+x)*3;u[M]=p.x,u[M+1]=Qe(p.x,p.z)+l,u[M+2]=p.z}}h.geometry.attributes.position.needsUpdate=!0,h.material.color.set(o),h.material.opacity=c}lane(e,t,n,s,r,a,o,c,l){this.rect(e,t,n,s,r,a,o,c);let h=.06;this.rect(e-s*(a-h),t+n*(a-h),n,s,r,h,o,l,.1),this.rect(e+s*(a-h),t-n*(a-h),n,s,r,h,o,l,.1),this.rect(e+n*r+s*a,t+s*r-n*a,-s,n,a*2,h,o,l,.1)}ring(e,t,n,s,r,a,o=.08,c=0,l=Math.PI*2){if(s<=.01)return;let h=this.get("ring"),u=h.geometry.attributes.position.array;for(let d=0;d<=qu;d++){let f=c+d/qu*(l-c),m=Math.cos(f),x=Math.sin(f);for(let g=0;g<=Cl;g++){let p=n+(s-n)*(g/Cl),M=Hm(e+m*p,t+x*p),C=(d*(Cl+1)+g)*3;u[C]=M.x,u[C+1]=Qe(M.x,M.z)+o,u[C+2]=M.z}}h.geometry.attributes.position.needsUpdate=!0,h.material.color.set(r),h.material.opacity=a}sector(e,t,n,s,r,a,o,c,l){let h=Math.atan2(s,n);this.ring(e,t,0,r,o,c,.08,h-a,h+a),this.ring(e,t,r-.1,r,o,l,.1,h-a,h+a);for(let u of[-1,1])this.rect(e,t,Math.cos(h+a*u),Math.sin(h+a*u),r,.05,o,l,.1)}path(e,t,n){if(e.length<2)return;let s=this.get("path"),r=s.geometry.attributes.position.array;for(let a=0;a<Vm;a++){let o=e[Math.min(a,e.length-1)];r[a*3]=o.x,r[a*3+1]=Qe(o.x,o.z)+.12,r[a*3+2]=o.z}s.geometry.attributes.position.needsUpdate=!0,s.computeLineDistances(),s.material.color.set(t),s.material.opacity=n}};var ii=10479871,Vi=16767050,xr=16773568,ms=9306032,$u=54*Math.PI/180,_r=(i,e,t)=>i<e?e:i>t?t:i,Zu=(i,e,t,n)=>{let s=i*t+e*n,r=i*i+e*e-gt.R*gt.R;return r>=0?0:-s+Math.sqrt(s*s-r)},Ju=new I,Nl=class{constructor(e){let t=this.stage=Fm(e);this.scene=t.scene,this.camera=t.camera,this.glow=Gm(),this.particles=new Rl(this.scene),this.waves=new Pl(this.scene),this.flashes=new Il(this.scene,this.glow),this.ground=new Dl(this.scene),this.tops=[],this.projs=new Map,this.telegraphs=[],this.markers=[],this.scorch=[],this.world=null,this.playerSide=0,this.time=0,this.shake=0,this.punch=0,this.orbit=.6,this.orbiting=!0,this.look=new I(0,.6,.8),this.zoom=1.12,this.focus=null,this.aimInfo=null,this.raycaster=new va,this.pillars=[];let n=new Kt(1,.55,34,32,1,!0);n.translate(0,17,0);for(let r=0;r<2;r++){let a=new Ze(n,new At({color:16777215,transparent:!0,opacity:0,blending:It,depthWrite:!1,side:Nt,fog:!1}));a.visible=!1,this.scene.add(a),this.pillars.push({m:a,t:0,T:.7})}let s=new At({color:16777215,transparent:!0,blending:It,depthWrite:!1,side:Nt});this.projGeoFlat=new Pi(.5,1.05,24,1,-1.05,2.1).rotateX(-Math.PI/2),this.projGeoUp=new Pi(.45,.95,24,1,-1.05,2.1),this.projMat=s,this.orbGeo=new as(.42,16,12),this.orbMat=new At({color:16774084}),this.cones=[],window.addEventListener("resize",()=>this.stage.resize())}setMatch(e,t){for(let n of this.tops)this.scene.remove(n.group,n.light,...n.orbs),n.trail.dispose(this.scene),zm(n);if(this.tops=[],this.world=e,this.playerSide=t,!!e){for(let n of e.tops){let s=km(n.blade,this.glow);s.trail=new Ll(this.scene,n.blade.color),s.light=new gi(n.blade.color,26,13,1.7),s.drop=0,s.dropV=0,s.fall=0,s.hold=!1,s.ox=0,s.oz=0,s.orbs=[];for(let r=0;r<Ve.satellite.count;r++){let a=new vn;a.add(new Ze(this.orbGeo,this.orbMat));let o=new Ci(new pi({map:this.glow,color:n.blade.color,blending:It,depthWrite:!1,transparent:!0}));o.scale.setScalar(2.6),a.add(o),a.visible=!1,this.scene.add(a),s.orbs.push(a)}this.scene.add(s.group,s.light),this.tops.push(s)}this.clearRound()}}clearRound(){for(let e of this.projs.values())this.scene.remove(e.group);this.projs.clear(),this.telegraphs.length=0,this.markers.length=0,this.scorch.length=0,this.cones.length=0,this.focus=null;for(let e of this.tops)e.trail.reset(),e.fall=0,e.shieldAlpha=0,e.group.visible=!0}launch(e,t=9){let n=this.tops[e];n.drop=t,n.dropV=0}colorOf(e){return e.blade.color}dangerOf(e){return e.side===this.playerSide?ii:Cf}pick(e,t){let n=this.stage;this.raycaster.setFromCamera(new se(e/n.width*2-1,-(t/n.height)*2+1),this.camera);let s=this.raycaster.ray.origin,r=this.raycaster.ray.direction;if(r.y>-.01)return null;let a=0,o=0,c=0;for(let l=0;l<5;l++){let h=(a-s.y)/r.y;o=s.x+r.x*h,c=s.z+r.z*h,a=Qe(o,c)}return{x:o,z:c,inside:Math.hypot(o,c)<=gt.R}}toScreen(e,t,n){return Ju.set(e,t,n).project(this.camera),{x:(Ju.x*.5+.5)*this.stage.width,y:(-Ju.y*.5+.5)*this.stage.height}}addShake(e){this.shake=Math.min(1.3,this.shake+e)}handle(e){let t=this.particles,n=this.waves,s=this.flashes;switch(e.type){case"clash":{let r=Qe(e.x,e.z)+.85,a=e.power,o=Math.min(150,14+a*4),c=-e.nz,l=e.nx;if(t.burst(e.x,r,e.z,o*.4,xr,9+a*.7,{dx:c,dz:l,bias:.6,up:.7,life:.55,size:.17}),t.burst(e.x,r,e.z,o*.4,xr,9+a*.7,{dx:-c,dz:-l,bias:.6,up:.7,life:.55,size:.17}),t.burst(e.x,r,e.z,o*.2,this.colorOf(e.a),6+a*.4,{up:1,life:.7,size:.2}),t.burst(e.x,r,e.z,o*.2,this.colorOf(e.b),6+a*.4,{up:1,life:.7,size:.2}),n.spawn(e.x,r-.7,e.z,.4,1.8+a*.16,.32,16777215,.8),s.flash(e.x,r,e.z,2.2+a*.16,.18,xr,.8,40+a*7),this.addShake(a*.014),a>16&&(this.punch=Math.max(this.punch,Math.min(1,a/34))),e.kind==="parry")n.spawn(e.x,r-.7,e.z,.5,7,.5,Vi,1),n.spawn(e.x,r-.6,e.z,.3,4,.35,16777215,1),t.burst(e.x,r,e.z,110,Vi,22,{up:.5,life:.7,size:.3,gravity:8}),s.flash(e.x,r,e.z,11,.35,16773296,1,220),this.addShake(.5);else if(e.kind==="dash"||e.kind==="empower"){let h=e.src,u=h===e.a?1:-1;n.spawn(e.x,r-.7,e.z,.5,6,.45,this.colorOf(h),1),t.burst(e.x,r,e.z,120,this.colorOf(h),26,{dx:e.nx*u,dz:e.nz*u,bias:.65,up:.5,life:.6,size:.3,gravity:6}),s.flash(e.x,r,e.z,9,.3,this.colorOf(h),1,180),this.addShake(.45)}break}case"wall":{let r=Qe(e.x,e.z)+.6,a=e.slam?16738874:this.colorOf(e.top);t.burst(e.x,r,e.z,8+e.power*2.5,e.slam?16756858:xr,7+e.power*.6,{dx:-e.nx,dz:-e.nz,bias:.55,up:.8,life:.5}),s.flash(e.x,r,e.z,2+e.power*.2,.2,a,.9,e.slam?120:0),this.stage.pulseRim(a,Math.min(1,.25+e.power/14)),this.addShake(e.power*(e.slam?.03:.012));break}case"cast":e.windup>0&&this.telegraphs.push({top:e.top,key:e.key,skill:e.skill,t:0,T:e.windup,dx:e.dx,dz:e.dz,ax:e.ax,az:e.az});break;case"blink":{let r=e.top,a=Qe(r.x,r.z),o=this.colorOf(r);n.spawn(r.x,a+.1,r.z,.6,3.2,.3,o,.9),t.burst(r.x,a+.8,r.z,50,o,7,{up:1,life:.5,gravity:-3,drag:2}),t.burst(r.x,a+.8,r.z,20,16777215,4,{up:1,life:.35,gravity:0});break}case"blinkEnd":{let r=e.top,a=Qe(r.x,r.z),o=this.colorOf(r);n.spawn(r.x,a+.1,r.z,3,.8,.25,16777215,.9),t.burst(r.x,a+.8,r.z,40,o,9,{up:.8,life:.4,gravity:2}),s.flash(r.x,a+.8,r.z,5,.2,o,1,70);break}case"zone":{let r=e.zone,a=Qe(r.x,r.z),o=this.colorOf(e.top);r.kind==="sanctuary"&&(n.spawn(r.x,a+.1,r.z,.5,r.r,.5,ms,1),n.spawn(r.x,a+.12,r.z,.3,r.r*.6,.4,o,1),t.burst(r.x,a+.3,r.z,80,o,9,{flat:!0,life:.6,gravity:-5,drag:2.5}),s.flash(r.x,a+1,r.z,9,.4,o,.9,120));break}case"quake":{let r=Qe(e.x,e.z),a=this.colorOf(e.top);n.spawn(e.x,r+.12,e.z,.5,e.r*1.35,.5,16777215,1),n.spawn(e.x,r+.14,e.z,.3,e.r,.4,a,1),t.burst(e.x,r+.2,e.z,150,a,24,{dy:1,bias:.75,up:1,life:.8,size:.32,gravity:30}),t.burst(e.x,r+.2,e.z,70,14207136,14,{dy:1,bias:.5,up:1,life:.9,size:.26,gravity:24});for(let c=0;c<40;c++){let l=Math.random()*6.283,h=Math.random()*e.r;t.emit(e.x+Math.cos(l)*h,r+.1,e.z+Math.sin(l)*h,0,9+Math.random()*14,0,.5,.3,a,26,.5)}s.flash(e.x,r+1,e.z,e.r*3.2,.3,a,1,200);let o=this.pillars[0].m.visible?this.pillars[1]:this.pillars[0];o.t=0,o.T=.45,o.r=e.r*.8,o.m.scale.y=.22,o.m.visible=!0,o.m.position.set(e.x,r,e.z),o.m.material.color.set(a),this.scorch.push({x:e.x,z:e.z,t:0,T:1.2,color:a,r:e.r}),this.addShake(e.hit?.6:.3),e.hit&&(this.punch=Math.max(this.punch,.7));break}case"charge":{let r=e.top,a=Qe(r.x,r.z),o=this.colorOf(r);n.spawn(r.x,a+.1,r.z,Ve.nova.aoe,1,e.T,o,.8),s.flash(r.x,a+1,r.z,7,.4,o,1,120),this.addShake(.2);break}case"nova":{let r=Qe(e.x,e.z),a=this.colorOf(e.top),o=Ve.nova.aoe;n.spawn(e.x,r+.12,e.z,1,o*1.15,.5,16777215,1),n.spawn(e.x,r+.14,e.z,.6,o,.65,a,1),n.spawn(e.x,r+.16,e.z,.3,o*1.7,.9,a,.5),t.burst(e.x,r+.5,e.z,320,a,42,{flat:!0,life:.55,size:.36,gravity:0,drag:3.2}),t.burst(e.x,r+.5,e.z,180,16777215,26,{up:.6,life:.8,size:.3,gravity:12}),s.flash(e.x,r+1,e.z,28,.5,16777215,1,520),s.flash(e.x,r+1,e.z,18,.8,a,1,0),this.scorch.push({x:e.x,z:e.z,t:0,T:2,color:a,r:o}),this.stage.pulseRim(a,1),this.addShake(1.1),this.punch=1;break}case"flare":{let r=e.top,a=Qe(r.x,r.z)+.8,o=Ve.flare,c=Math.atan2(e.dz,e.dx);for(let l=0;l<170;l++){let h=c+(Math.random()*2-1)*o.half,u=(.35+Math.random()*.65)*o.range*3.4,d=Math.random()<.3?16777215:Math.random()<.5?this.colorOf(r):16738858;t.emit(r.x+Math.cos(h)*1.2,a+(Math.random()-.5)*.6,r.z+Math.sin(h)*1.2,Math.cos(h)*u,Math.random()*3,Math.sin(h)*u,.3+Math.random()*.25,.34,d,-3,3.4)}this.cones.push({x:r.x,z:r.z,dx:e.dx,dz:e.dz,t:0,T:.35,color:this.colorOf(r)}),s.flash(r.x+e.dx*2,a,r.z+e.dz*2,8,.25,16752704,1,140),this.addShake(e.hit?.35:.12),e.hit&&this.siphon(e.target,r,26,ms);break}case"orbs":{let r=e.top,a=Qe(r.x,r.z);n.spawn(r.x,a+.1,r.z,.6,Ve.satellite.orbit+.6,.35,this.colorOf(r),1),t.burst(r.x,a+.8,r.z,40,16774084,8,{up:1,life:.5,gravity:0,drag:2});break}case"orbHit":{let r=Qe(e.x,e.z)+.9,a=this.colorOf(e.top);t.burst(e.x,r,e.z,70,a,16,{up:.8,life:.5,size:.26,gravity:8}),t.burst(e.x,r,e.z,24,16777215,9,{up:1,life:.35}),n.spawn(e.x,r-.8,e.z,.3,3,.3,a,1),s.flash(e.x,r,e.z,5,.2,a,1,90),this.addShake(.2);break}case"tether":{let r=e.top,a=Qe(r.x,r.z),o=this.colorOf(r);n.spawn(r.x,a+.1,r.z,.6,5,.5,o,1),n.spawn(e.target.x,Qe(e.target.x,e.target.z)+.1,e.target.z,4,.8,.4,o,1),s.flash(r.x,a+1,r.z,10,.4,o,1,200),this.stage.pulseRim(o,.8),this.addShake(.3);break}case"tetherEnd":{let r=e.top,a=Qe(r.x,r.z);n.spawn(r.x,a+.1,r.z,.6,3.5,.4,e.broke?16777215:ms,.9);break}case"heal":{let r=e.top;t.burst(r.x,Qe(r.x,r.z)+.6,r.z,20,ms,3,{up:1,life:.7,gravity:-6,drag:1});break}case"shoot":{let r=e.proj,a=this.colorOf(e.top),o=Qe(r.x,r.z)+.8;t.burst(r.x,o,r.z,40,a,16,{dx:r.dx,dz:r.dz,bias:.7,up:.4,life:.35,gravity:4}),s.flash(r.x,o,r.z,5,.18,a,1,60),n.spawn(e.top.x,Qe(e.top.x,e.top.z)+.1,e.top.z,.6,2.6,.3,a,.7);break}case"reflect":{let r=this.colorOf(e.top),a=Qe(e.x,e.z)+.8;t.burst(e.x,a,e.z,70,Vi,18,{up:.6,life:.5,gravity:6}),n.spawn(e.x,a-.6,e.z,.4,5,.4,Vi,1),s.flash(e.x,a,e.z,8,.28,16773296,1,160),this.addShake(.3);break}case"projHit":{let r=Qe(e.x,e.z)+.8,a=this.colorOf(e.proj.owner);t.burst(e.x,r,e.z,90,a,22,{dx:e.dx,dz:e.dz,bias:.55,up:.6,life:.55,size:.28,gravity:8}),t.burst(e.x,r,e.z,30,16777215,12,{up:1,life:.4}),n.spawn(e.x,r-.7,e.z,.4,4.5,.4,a,1),s.flash(e.x,r,e.z,7,.25,a,1,150),this.addShake(.32),this.punch=Math.max(this.punch,.5);break}case"projEnd":{t.burst(e.x,Qe(e.x,e.z)+.8,e.z,18,this.colorOf(e.proj.owner),6,{life:.35,gravity:3});break}case"guard":{let r=e.top,a=Qe(r.x,r.z);n.spawn(r.x,a+.1,r.z,.6,3,.35,16777215,.9),t.burst(r.x,a+.8,r.z,40,this.colorOf(r),8,{up:1,life:.5,gravity:-4});break}case"dash":{let r=e.top,a=Qe(r.x,r.z),o=this.colorOf(r);n.spawn(r.x,a+.1,r.z,.6,4,.35,o,1),t.burst(r.x,a+.6,r.z,60,o,18,{dx:-e.dx,dz:-e.dz,bias:.7,up:.4,life:.45,gravity:4}),s.flash(r.x,a+.8,r.z,5,.2,o,1,80),this.telegraphs=this.telegraphs.filter(c=>!(c.top===r&&c.key==="E"));break}case"leap":{let r=e.top,a=Qe(r.x,r.z),o=this.colorOf(r);n.spawn(r.x,a+.1,r.z,.6,6,.5,o,1),n.spawn(r.x,a+.15,r.z,.4,3.5,.35,16777215,1),t.burst(r.x,a+.5,r.z,120,o,14,{up:1,bias:.4,dy:1,life:.8,gravity:2}),s.flash(r.x,a+1,r.z,9,.35,o,1,200),this.addShake(.3),this.telegraphs.push({top:r,key:"R",skill:Ve.meteor,t:0,T:e.T,ax:e.tx,az:e.tz});break}case"meteor":{let r=Qe(e.x,e.z),a=this.colorOf(e.top),o=Ve.meteor.aoe;n.spawn(e.x,r+.12,e.z,.8,o*1.5,.7,16777215,1),n.spawn(e.x,r+.14,e.z,.5,o*1.15,.55,a,1),n.spawn(e.x,r+.16,e.z,.3,o*2.3,1,16753226,.6),t.burst(e.x,r+.4,e.z,320,a,34,{up:.75,life:.9,size:.34,gravity:14}),t.burst(e.x,r+.4,e.z,160,16767392,22,{up:1,life:1.1,size:.3,gravity:9}),t.burst(e.x,r+.2,e.z,120,16777215,40,{flat:!0,life:.4,size:.3,gravity:0,drag:3}),s.flash(e.x,r+1,e.z,26,.5,16777215,1,520),s.flash(e.x,r+1,e.z,16,.8,a,1,0);let c=this.pillars[0].m.visible?this.pillars[1]:this.pillars[0];c.t=0,c.T=.7,c.r=o*.55,c.m.scale.y=1,c.m.visible=!0,c.m.position.set(e.x,r,e.z),c.m.material.color.set(a),this.scorch.push({x:e.x,z:e.z,t:0,T:2.6,color:a,r:o}),this.stage.pulseRim(a,1),this.addShake(1.1),this.punch=1;break}case"ringout":{let r=Yi(gt.R)+.8,a=e.x+e.nx,o=e.z+e.nz;t.burst(a,r,o,200,16742986,26,{dx:e.nx,dy:.7,dz:e.nz,bias:.5,up:1,life:.9,size:.32,gravity:12}),t.burst(a,r,o,80,16777215,16,{up:1,life:.6}),s.flash(a,r,o,14,.5,16747098,1,400),this.stage.pulseRim(16726826,1.6),this.addShake(.9),this.punch=1;break}case"finish":{let r=e.loser;if(e.kind!=="over"&&e.kind!=="time"){let a=Qe(r.x,r.z)+.8;t.burst(r.x,a,r.z,220,this.colorOf(r),24,{up:1,life:1,size:.32,gravity:10}),t.burst(r.x,a,r.z,90,16777215,30,{flat:!0,life:.5,gravity:0,drag:3}),n.spawn(r.x,a-.7,r.z,.6,9,.8,16777215,1),n.spawn(r.x,a-.65,r.z,.4,5.5,.6,this.colorOf(e.winner),1),s.flash(r.x,a,r.z,18,.6,16777215,1,420),this.addShake(.8)}this.focus={top:r,w:.6,zoom:.78};break}}}syncProjectiles(){let e=new Set;for(let t of this.world.projectiles){e.add(t.id);let n=this.projs.get(t.id);if(!n){let s=new vn,r=this.projMat.clone();s.add(new Ze(this.projGeoFlat,r),new Ze(this.projGeoUp,r)),t.skill.chain&&(s.children[0].scale.setScalar(.6),s.children[1].scale.setScalar(.6));let a=new Ci(new pi({map:this.glow,blending:It,depthWrite:!1,transparent:!0}));a.scale.setScalar(4.5),s.add(a),this.scene.add(s),n={proj:t,group:s,mat:r,sprite:a,side:-1},this.projs.set(t.id,n)}if(n.proj=t,n.side!==t.owner.side){n.side=t.owner.side;let s=this.colorOf(t.owner);n.mat.color.set(s).multiplyScalar(1.5),n.sprite.material.color.set(s)}n.group.rotation.y=Math.atan2(-t.dz,t.dx)}for(let t of[...this.projs.keys()])e.has(t)||this.dropProj(t)}capture(){return this.world.tops.map(e=>({x:e.x,z:e.z}))}absorb(e){this.world.tops.forEach((t,n)=>{let s=this.tops[n],r=e[n].x+s.ox-t.x,a=e[n].z+s.oz-t.z;Math.hypot(r,a)>3.5||t.air||t.out?s.ox=s.oz=0:(s.ox=r,s.oz=a)})}dropProj(e){let t=this.projs.get(e);t&&(this.scene.remove(t.group),t.mat.dispose(),t.sprite.material.dispose(),this.projs.delete(e))}marker(e,t){this.markers.push({x:e,z:t,t:0})}update(e,t,n){this.time+=t;let s=this.ground,r=this.particles,a=this.world;if(s.begin(),this.aimInfo=null,a){for(let h of a.tops)this.updateTop(h,this.tops[h.side],e,t);this.syncProjectiles();for(let h of this.projs.values()){let u=h.proj,d=Qe(u.x,u.z)+.85;if(h.group.position.set(u.x,d,u.z),u.skill.chain&&this.chain(u.owner.x,u.owner.z,u.x,u.z,this.colorOf(u.owner),1),h.group.children[1].rotation.x+=e*22,e>0)for(let f=0;f<3;f++)r.emit(u.x-u.dx*Math.random()*1.2+(Math.random()-.5)*.9,d+(Math.random()-.5)*.8,u.z-u.dz*Math.random()*1.2+(Math.random()-.5)*.9,-u.dx*4,Math.random()*2,-u.dz*4,.3,.3,this.colorOf(u.owner),0,1)}this.drawTelegraphs(e),this.drawOngoing(e);let c=a.tops[this.playerSide],l=a.other(c);if(!a.result&&!c.out){if(c.air||s.ring(c.x,c.z,1.55,1.63,16777215,.45),c.cmd){let h=.5+.5*Math.sin(this.time*10);s.ring(c.cmd.x,c.cmd.z,.25+h*.1,.42+h*.1,ii,.8);let u=c.cmd.x-c.x,d=c.cmd.z-c.z,f=Math.hypot(u,d);f>1.6&&s.rect(c.x+u/f*1.4,c.z+d/f*1.4,u/f,d/f,f-1.8,.035,ii,.35)}n&&this.drawAim(n,c,l,a)}}for(let c of this.markers){c.t+=t;let l=c.t/.45;if(l<1){let h=1.5-1.1*l;s.ring(c.x,c.z,h-.12,h,ii,1-l),s.ring(c.x,c.z,0,.18,16777215,1-l)}}this.markers.length&&this.markers[0].t>.45&&this.markers.shift();for(let c of this.scorch){c.t+=e;let l=c.t/c.T;l<1&&(s.ring(c.x,c.z,0,c.r*(.9+.1*l),16742954,.22*(1-l)*(1-l)),s.ring(c.x,c.z,c.r*.92,c.r,c.color,.6*(1-l)))}this.scorch.length&&this.scorch[0].t>this.scorch[0].T&&this.scorch.shift();for(let c of this.pillars){if(!c.m.visible)continue;c.t+=t;let l=c.t/c.T;if(l>=1){c.m.visible=!1;continue}c.m.material.opacity=.75*(1-l)*(1-l),c.m.scale.x=c.m.scale.z=c.r*(1-.6*l)}let o=Math.max(e,t*.12);r.update(o),this.waves.update(o),this.flashes.update(o),this.stage.update(t,this.time),this.updateCamera(t)}updateTop(e,t,n,s){let r=this.particles,a=Qe(e.x,e.z),o=tn(e),c=this.colorOf(e),l=0;t.hold?t.drop=7+Math.sin(this.time*3+e.side*2)*.18:t.drop>0&&(t.dropV+=60*s,t.drop-=t.dropV*s,t.drop<=0&&(t.drop=0,this.waves.spawn(e.x,a+.1,e.z,.5,4.5,.45,c,1),r.burst(e.x,a+.3,e.z,70,c,13,{up:.6,life:.6}),r.burst(e.x,a+.3,e.z,30,xr,9,{up:.9,life:.5}),this.flashes.flash(e.x,a+.6,e.z,6,.25,c,1,120),this.addShake(.28),this.landed=(this.landed||0)+1)),e.out?l=Yi(gt.R)-a+e.out.y:e.air&&(l=Math.sin(Math.PI*Math.min(1,e.air.t/e.air.T))*7.5),l+=t.drop;let h=a+l,u=Math.exp(-s*14);t.ox*=u,t.oz*=u,t.group.position.set(e.x+t.ox,h,e.z+t.oz),t.group.visible=!(e.out&&e.out.t>2.2),t.light.position.set(e.x+t.ox,h+3.2,e.z+t.oz),t.light.intensity=t.group.visible?2+4*o+(e.dash||e.air?8:0):0;let d=e.spin<=0&&!e.out;t.fall=d?Math.min(1,t.fall+s*1.6):0;let f=(5+42*o)*(1-t.fall);t.spin.rotation.y-=e.dir*f*n,t.blur.rotation.z+=11*n,t.blurMat.opacity=(.05+.2*o)*(1-t.fall),t.wobble+=(2.4+7*(1-o))*n;let m=.03+.4*Math.pow(1-o,2.2)+(e.tumble>0?.14:0);m=m*(1-t.fall)+.62*t.fall,e.out?(t.group.rotation.x+=s*7,t.group.rotation.z+=s*5):t.group.rotation.set(m*Math.cos(t.wobble)+e.vz*.006,0,m*Math.sin(t.wobble)-e.vx*.006),t.group.scale.setScalar(e.air?1+.35*Math.sin(Math.PI*Math.min(1,e.air.t/e.air.T)):1),t.spin.visible=t.blur.visible=!e.blink;let x=e.ult>=100&&!this.world.result;t.aura.material.opacity=(.1+.16*o+(x?.22+.14*Math.sin(this.time*9):0))*(1-t.fall),t.aura.visible=l<.5,t.aura.scale.setScalar(x?7.5:5.5),t.body.emissiveIntensity=.14+(x?.25+.15*Math.sin(this.time*9):0)+(e.dash?.8:0)+(e.empower>0?.5+.3*Math.sin(this.time*30):0)+(e.charge?1.2:0);let g=e.guard>0?1:0;if(t.shieldAlpha+=(g-t.shieldAlpha)*Math.min(1,s*14),t.shield.visible=t.shieldAlpha>.02,t.shield.visible){t.shieldMat.uniforms.uTime.value=this.time;let M=e.guard>0&&e.guard<.35?.5+.5*Math.sin(this.time*50):1;t.shieldMat.uniforms.uAlpha.value=t.shieldAlpha*M,t.shield.rotation.y+=s*2}if(t.trail.boost=e.dash||e.blink?1:e.air?.6:e.empower>0?.5:0,!e.out&&t.drop<=0&&t.trail.push(e.x+t.ox,e.z+t.oz,l),t.trail.update(s),n<=0||e.out)return;let p=Math.hypot(e.vx,e.vz);if(e.blink){for(let M=0;M<8;M++)r.emit(e.x+(Math.random()-.5)*1.2,a+.3+Math.random()*1.2,e.z+(Math.random()-.5)*1.2,0,Math.random(),0,.4,.4,Math.random()<.3?16777215:c,0,2);return}if(e.empower>0&&Math.random()<.8){let M=Math.random()*6.283;r.emit(e.x+Math.cos(M)*1.3,a+.4+Math.random()*.9,e.z+Math.sin(M)*1.3,-Math.sin(M)*6,1,Math.cos(M)*6,.25,.26,Math.random()<.5?16777215:c,0,1)}if(e.dash)for(let M=0;M<6;M++)r.emit(e.x+(Math.random()-.5)*1.6,h+.3+Math.random()*.9,e.z+(Math.random()-.5)*1.6,-e.vx*.1,Math.random()*2,-e.vz*.1,.35,.34,c,0,2);else if(e.air)for(let M=0;M<5;M++)r.emit(e.x+(Math.random()-.5)*1.4,h+Math.random(),e.z+(Math.random()-.5)*1.4,(Math.random()-.5)*3,-4,(Math.random()-.5)*3,.5,.36,Math.random()<.5?c:16761466,4,1);else{if(Math.random()<p*.03*(d?0:1)&&r.emit(e.x,a+.08,e.z,-e.vx*.2+(Math.random()-.5)*3,1.5+Math.random()*2.5,-e.vz*.2+(Math.random()-.5)*3,.35,.14,xr,14,1),x&&Math.random()<.5){let M=Math.random()*6.283;r.emit(e.x+Math.cos(M)*1.2,a+.2,e.z+Math.sin(M)*1.2,0,3+Math.random()*3,0,.6,.2,c,-2,.5)}e.slow>0&&Math.random()<.4&&r.emit(e.x+(Math.random()-.5)*1.6,a+1.4,e.z+(Math.random()-.5)*1.6,0,-1.5,0,.5,.2,10138879,0,.5),o<.25&&!d&&Math.random()<.3&&r.emit(e.x+(Math.random()-.5),a+.1,e.z+(Math.random()-.5),(Math.random()-.5)*4,2+Math.random()*2,(Math.random()-.5)*4,.4,.16,16747082,12,1)}}chain(e,t,n,s,r,a){let o=n-e,c=s-t,l=Math.hypot(o,c);l<.5||(this.ground.rect(e,t,o/l,c/l,l,.07,r,.9*a,.85),this.ground.rect(e,t,o/l,c/l,l,.2,r,.22*a,.84))}siphon(e,t,n,s){let r=Qe(e.x,e.z)+.9;for(let a=0;a<n;a++){let o=.3+Math.random()*.3,c=e.x+(Math.random()-.5)*1.6,l=e.z+(Math.random()-.5)*1.6;this.particles.emit(c,r+(Math.random()-.5),l,(t.x-c)/o,(Math.random()-.5)*2,(t.z-l)/o,o,.3,s,0,0)}}drawOngoing(e){let t=this.ground,n=this.particles,s=this.world;for(let r of s.zones){let a=Math.min(1,r.t/r.T);if(r.kind==="quake"){let o=this.dangerOf(r.owner),c=.5+.5*Math.sin(this.time*20);if(t.ring(r.x,r.z,0,r.r,o,.1+.08*c),t.ring(r.x,r.z,0,r.r*a,o,.26),t.ring(r.x,r.z,r.r-.13,r.r,o,.95),e>0&&Math.random()<.6){let l=Math.random()*6.283,h=Math.random()*r.r;n.emit(r.x+Math.cos(l)*h,Qe(r.x,r.z)+.1,r.z+Math.sin(l)*h,0,2+Math.random()*3,0,.3,.16,14207136,10,1)}}else{let o=this.colorOf(r.owner),c=Math.min(1,(r.T-r.t)/.5,r.t/.2),l=.5+.5*Math.sin(this.time*3);if(t.ring(r.x,r.z,0,r.r,o,(.1+.05*l)*c),t.ring(r.x,r.z,0,r.r*.55,ms,.07*c),t.ring(r.x,r.z,r.r-.12,r.r,o,.85*c),t.ring(r.x,r.z,r.r-.42,r.r-.28,16777215,.7*c,.1,-Math.PI/2,-Math.PI/2+Math.PI*2*(1-a)),e>0)for(let h=0;h<2;h++){let u=Math.random()*6.283,d=Math.sqrt(Math.random())*r.r;n.emit(r.x+Math.cos(u)*d,Qe(r.x,r.z)+.1,r.z+Math.sin(u)*d,0,1.5+Math.random()*2.5,0,.9,.16,Math.random()<.5?ms:o,-1,.4)}}}for(let r of s.tops){let a=this.tops[r.side],o=this.colorOf(r),c=Qe(r.x,r.z);if(r.charge){let l=r.charge.skill,h=Math.min(1,r.charge.t/r.charge.T),u=this.dangerOf(r),d=.5+.5*Math.sin(this.time*22);if(t.ring(r.x,r.z,0,l.aoe,u,.08+.07*d),t.ring(r.x,r.z,0,l.aoe*h,u,.22),t.ring(r.x,r.z,l.aoe-.14,l.aoe,u,.95),e>0)for(let f=0;f<6;f++){let m=Math.random()*6.283,x=3+Math.random()*4,g=.3;n.emit(r.x+Math.cos(m)*x,c+.3+Math.random()*1.5,r.z+Math.sin(m)*x,-Math.cos(m)*x/g,0,-Math.sin(m)*x/g,g,.3,o,0,0)}}for(let l=0;l<a.orbs.length;l++){let h=a.orbs[l];if(h.visible=!!(r.orbs&&r.orbs.alive&1<<l),!h.visible)continue;let u=s.orbPos(r,l),d=Qe(u.x,u.z)+.95;h.position.set(u.x,d,u.z),h.children[1].material.opacity=r.orbs.t<1?.5+.5*Math.sin(this.time*30):1,e>0&&n.emit(u.x,d,u.z,(Math.random()-.5)*2,Math.random()*1.5,(Math.random()-.5)*2,.35,.3,o,0,1)}if(r.tether){let l=s.other(r),h=.5+.5*Math.sin(this.time*26),u=l.x-r.x,d=l.z-r.z,f=Math.hypot(u,d)||1,m=_r((f-r.tether.skill.range)/(r.tether.skill.breakRange-r.tether.skill.range),0,1);t.rect(r.x,r.z,u/f,d/f,f,.12+.08*h,m>.5?16777215:o,.95,.9),t.rect(r.x,r.z,u/f,d/f,f,.5+.2*h,o,.2*(1-m*.7),.88),t.ring(l.x,l.z,1.5,1.7,o,.5+.4*h),e>0&&this.siphon(l,r,2,Math.random()<.5?o:ms)}}for(let r of this.cones){r.t+=e;let a=r.t/r.T;a<1&&t.sector(r.x,r.z,r.dx,r.dz,Ve.flare.range,Ve.flare.half,r.color,.5*(1-a)*(1-a),.9*(1-a))}this.cones.length&&this.cones[0].t>this.cones[0].T&&this.cones.shift()}drawTelegraphs(e){let t=this.ground;for(let n of this.telegraphs){n.t+=e;let s=n.top,r=Math.min(1,n.t/n.T),a=this.dangerOf(s),o=n.skill;if(o.aim==="leap"){if(!s.air){n.done=!0;continue}let c=o.aoe,l=.5+.5*Math.sin(this.time*18);t.ring(n.ax,n.az,0,c,a,.1+.08*l),t.ring(n.ax,n.az,0,c*r,a,.22),t.ring(n.ax,n.az,c-.14,c,a,.95),t.ring(n.ax,n.az,1.9,2,a,.5)}else{if(!s.cast||s.cast.key!==n.key){n.done=!0;continue}if(o.aim==="cone")t.sector(s.x,s.z,n.dx,n.dz,o.range,o.half,a,.12,.85),t.ring(s.x,s.z,0,o.range*r,a,.25,.09,Math.atan2(n.dz,n.dx)-o.half,Math.atan2(n.dz,n.dx)+o.half);else if(o.aim==="ground")t.ring(n.ax,n.az,o.aoe-.13,o.aoe,a,.9),t.ring(n.ax,n.az,0,o.aoe,a,.1);else if(o.aim==="line"||o.aim==="dash"){let c=o.aim==="line",l=Math.min(Zu(s.x,s.z,n.dx,n.dz),c?o.range:_r(s.cast.dist,o.minDist,o.dist)+1),h=c?o.radius:1.25;t.lane(s.x,s.z,n.dx,n.dz,l,h,a,.1,.8),t.rect(s.x,s.z,n.dx,n.dz,l*r,h,a,.28)}}}this.telegraphs.some(n=>n.done)&&(this.telegraphs=this.telegraphs.filter(n=>!n.done))}drawAim(e,t,n,s){let r=this.ground,a=e.key,o=fn(t,a),c=e.x-t.x,l=e.z-t.z,h=Math.hypot(c,l);h<.01?(c=0,l=-1):(c/=h,l/=h);let u=t.cd[a]<=.25&&(!o.ult||t.ult>=100),d=Gt(n),f=8423584,m=!1,x=null,g=0;if(o.aim==="blink"){let p=Math.min(Zu(t.x,t.z,c,l)-t.radius,_r(h,2,o.range)),M=u?ii:f;r.lane(t.x+c*1.4,t.z+l*1.4,c,l,Math.max(0,p-1.4),.5,M,.1,.6),r.ring(t.x+c*p,t.z+l*p,1.2,1.33,M,.9),r.ring(t.x+c*p,t.z+l*p,0,1.2,M,.12),r.ring(t.x,t.z,o.range-.05,o.range,ii,.25);return}if(o.aim==="cone"){if(d){let M=xn(n,t,.08);x={x:M.x,z:M.z};let C=M.x-t.x,v=M.z-t.z,w=Math.hypot(C,v)||1,T=Math.acos(_r((C*c+v*l)/w,-1,1));m=w<o.range+n.radius*.6&&T<o.half+Math.atan2(n.radius*.8,Math.max(w,.5))}let p=u?m?Vi:ii:f;r.sector(t.x,t.z,c,l,o.range,o.half,p,u?.16:.07,u?.9:.4)}else if(o.aim==="line"||o.aim==="dash"){let p=o.aim==="line",M=Math.min(Zu(t.x,t.z,c,l),p?o.range:_r(h,o.minDist,o.dist)),C=p?o.radius:1.25;if(d){x=bi(t.x,t.z,n,t,o.speed),g=x.t;let w=x.x-t.x,T=x.z-t.z,R=w*c+T*l,y=Math.abs(w*-l+T*c);m=R>0&&R<M+(p?.5:1.6)&&y<C+n.radius*.8}let v=u?m?Vi:ii:f;r.lane(t.x+c*1.4,t.z+l*1.4,c,l,M-1.4,C,v,u?.16:.07,u?.9:.4),p||r.ring(t.x+c*M,t.z+l*M,1.2,1.33,v,.8)}else if(o.aim==="leap"||o.aim==="ground"){let p=s.groundTarget(t,o,e.x,e.z),M=o.aim==="leap"?o.air:o.delay;if(d){let v=xn(n,t,M);x={x:v.x,z:v.z},g=M,m=Math.hypot(v.x-p.x,v.z-p.z)<o.aoe+n.radius*.3}let C=u?m?Vi:ii:f;r.ring(t.x,t.z,o.range-.06,o.range,ii,.35),r.ring(p.x,p.z,0,o.aoe,C,u?.14:.06),r.ring(p.x,p.z,o.aoe-.12,o.aoe,C,.95),o.aim==="leap"&&r.ring(p.x,p.z,1.9,2,C,.55)}else return;if(x&&u){let p=m?Vi:16777215;r.path([{x:n.x,z:n.z},...mh(n,t,Math.min(g,1.4),24)],p,m?.95:.55);let C=m?.5+.5*Math.sin(this.time*16):0;r.ring(x.x,x.z,1.15+C*.1,1.3+C*.1,p,m?1:.6),r.ring(x.x,x.z,0,.16,p,m?1:.6);let v=this.toScreen(x.x,Qe(x.x,x.z)+1.6,x.z);this.aimInfo={lock:m,x:v.x,y:v.y}}}updateCamera(e){let t=this.camera,n=this.stage,s=this.world,r=1-Math.exp(-e*3.5),a=0,o=.3,c=1;if(this.orbiting)this.orbit+=e*.12,c=1.12;else{let g=this.playerSide?Math.PI:0;if(this.orbit=g+Math.atan2(Math.sin(this.orbit-g),Math.cos(this.orbit-g))*Math.exp(-e*3),o=this.playerSide?-.3:.3,s){let[p,M]=s.tops,C=p.out?0:p.x,v=p.out?0:p.z,w=M.out?0:M.x,T=M.out?0:M.z;a=(C+w)*.08,o+=(v+T)*.08;let R=this.focus;R&&(a+=(R.top.x-a)*R.w,o+=(_r(R.top.z,-gt.R,gt.R)-o)*R.w,c=R.zoom)}}this.look.x+=(a-this.look.x)*r,this.look.z+=(o-this.look.z)*r,this.zoom+=(c-this.zoom)*r,this.punch=Math.max(0,this.punch-e*3.2),this.shake*=Math.exp(-e*7.5);let l=Math.tan(t.fov*Math.PI/360),h=gt.R+2.2,d=Math.max(h*Math.sin($u)*1.26/l,h*1.04/(l*t.aspect))*this.zoom*(1-this.punch*.035),f=Math.sin($u)*d,m=Math.cos($u)*d,x=this.shake*.55;t.position.set(this.look.x+Math.sin(this.orbit)*m+(Math.random()-.5)*x,this.look.y+f+(Math.random()-.5)*x,this.look.z+Math.cos(this.orbit)*m+(Math.random()-.5)*x),t.lookAt(this.look),this.particles.mat.uniforms.uScale.value=n.height*n.renderer.getPixelRatio()/(2*l)}render(){this.stage.render()}};var Ae=(i,e=document)=>e.querySelector(i),gs=(i,e,t)=>{let n=document.createElement(i);return e&&(n.className=e),t!=null&&(n.innerHTML=t),n},Dn=i=>`<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${i}</svg>`,Ku={sonic:Dn('<path d="M31 5a20 20 0 1 0 0 38 15 19 0 0 1 0-38z" fill="currentColor" stroke="none"/><path d="M4 16h9M2 24h9M4 32h9" stroke-width="2.5" opacity=".6"/>'),phantom:Dn('<circle cx="33" cy="24" r="9" fill="currentColor" stroke="none"/><circle cx="20" cy="24" r="9" stroke-width="3" opacity=".6" stroke-dasharray="4 4"/><circle cx="10" cy="24" r="7" stroke-width="2.5" opacity=".3" stroke-dasharray="3 4"/>'),blitz:Dn('<path d="M6 9l15 15L6 39M19 9l15 15-15 15" stroke-width="5"/><path d="M36 14l8 10-8 10" stroke-width="4" opacity=".55"/>'),meteor:Dn('<circle cx="30" cy="31" r="11" fill="currentColor" stroke="none"/><path d="M5 4l15 17M15 3l11 13M3 15l12 12" stroke-width="3.5" opacity=".7"/><path d="M12 44h34" stroke-width="2.5" opacity=".5"/>'),quake:Dn('<path d="M24 4l8 26H16z" fill="currentColor" stroke="none"/><path d="M9 16l5 16H5zM39 14l5 18h-9z" fill="currentColor" stroke="none" opacity=".6"/><path d="M3 38l8-3 6 5 7-5 7 5 6-5 8 3" stroke-width="3.5"/>'),aegis:Dn('<path d="M24 4l17 6v13c0 10-7 17-17 21C14 40 7 33 7 23V10z" stroke-width="3.5"/><path d="M24 12l9 3v8c0 6-4 10-9 12z" fill="currentColor" stroke="none"/>'),anchor:Dn('<path d="M30 6l12 12-8 8-12-12z" fill="currentColor" stroke="none"/><ellipse cx="19" cy="29" rx="6" ry="3.5" transform="rotate(-45 19 29)" stroke-width="3.5"/><ellipse cx="10" cy="38" rx="6" ry="3.5" transform="rotate(-45 10 38)" stroke-width="3.5" opacity=".65"/>'),nova:Dn('<circle cx="24" cy="24" r="7" fill="currentColor" stroke="none"/><circle cx="24" cy="24" r="13" stroke-width="3"/><path d="M24 2v6M24 40v6M2 24h6M40 24h6M8 8l5 5M35 35l5 5M40 8l-5 5M13 35l-5 5" stroke-width="3.5" opacity=".75"/>'),flare:Dn('<path d="M6 24L42 6v36z" fill="currentColor" stroke="none" opacity=".35"/><path d="M6 24L42 6M6 24l36 18" stroke-width="3"/><path d="M18 24c4-4 4 4 8 0s4 4 8 0" stroke-width="3.5"/>'),sanctuary:Dn('<circle cx="24" cy="24" r="19" stroke-width="3" stroke-dasharray="6 5"/><path d="M24 13v22M13 24h22" stroke-width="7"/>'),satellite:Dn('<circle cx="24" cy="24" r="7" stroke-width="3.5"/><circle cx="24" cy="6" r="5" fill="currentColor" stroke="none"/><circle cx="8.5" cy="33" r="5" fill="currentColor" stroke="none"/><circle cx="39.5" cy="33" r="5" fill="currentColor" stroke="none"/>'),eclipse:Dn('<circle cx="29" cy="19" r="13" fill="currentColor" stroke="none"/><circle cx="23" cy="24" r="12" fill="#0a0f1e" stroke="currentColor" stroke-width="2.5"/><path d="M6 42c6-2 8-6 12-9" stroke-width="3.5" opacity=".7"/>')},xb={over:["OVER FINISH","\u5834\u5916\u3078\u5439\u304D\u98DB\u3070\u3057\u305F\uFF01"],burst:["BURST FINISH","\u4E00\u6483\u3067\u56DE\u8EE2\u3092\u65AD\u3061\u5207\u3063\u305F\uFF01"],spin:["SPIN FINISH","\u56DE\u8EE2\u304C\u5C3D\u304D\u305F\uFF01"],time:["TIME UP","\u6B8B\u308A\u56DE\u8EE2\u6570\u3067\u5224\u5B9A"]},Ul=class{constructor(e){this.h=e,this.hud=Ae("#hud"),this.labels=Ae("#labels"),this.announceEl=Ae("#announce"),this.cutin=Ae("#cutin"),this.lockEl=Ae("#lock"),this.vignette=Ae("#vignette"),this.flashEl=Ae("#flash"),this.blade="azure",this.level=1,this.side=0,this.fighters=[this.buildFighter(0),this.buildFighter(1)],this.skills={},this.buildTitle(),this.tags=[],this.lastTime=-1,Ae("#btn-mute").onclick=()=>this.h.mute(),Ae("#btn-pause").onclick=()=>this.h.pause(),Ae("#btn-resume").onclick=()=>this.h.pause(),Ae("#btn-quit").onclick=()=>this.h.quit(),Ae("#btn-again").onclick=()=>this.h.again(),Ae("#btn-back").onclick=()=>this.h.quit(),Ae("#btn-host").onclick=()=>this.h.host(),Ae("#lb-leave").onclick=()=>this.h.quit(),Ae("#lb-ready").onclick=()=>this.h.ready(),Ae("#lb-copy").onclick=()=>this.h.copy(),Ae("#lb-url").onclick=n=>n.target.select();let t=Ae("#lb-blades");for(let n of Object.values($t)){let s=gs("button","lb-blade",`<i></i><b>${n.en}</b><span>${n.typeJa}</span>`);s.style.setProperty("--c",n.css),s.dataset.id=n.id,s.onclick=()=>this.h.pick(n.id),t.appendChild(s)}document.querySelectorAll("button").forEach(n=>n.addEventListener("mouseenter",()=>this.h.hover()))}buildFighter(e){let t=Ae("#f"+e);return t.innerHTML=`
      <div class="f-head"><span class="f-tag"></span><span class="f-name"></span><span class="f-type"></span></div>
      <div class="gauge"><div class="g-ghost"></div><div class="g-fill"></div><div class="g-ticks"></div><span class="g-num"></span></div>
      <div class="f-foot"><div class="pips"></div><div class="f-ult"><i></i><span>ULT</span></div></div>`,{root:t,tag:Ae(".f-tag",t),name:Ae(".f-name",t),type:Ae(".f-type",t),fill:Ae(".g-fill",t),ghost:Ae(".g-ghost",t),num:Ae(".g-num",t),pips:Ae(".pips",t),ult:Ae(".f-ult i",t),ultBox:Ae(".f-ult",t),ghostV:1,shown:1}}buildSkills(e){let t=Ae("#skillbar");t.innerHTML="",this.skills={};for(let n of Ht){let s=ro(e)[Ht.indexOf(n)],r=s.aim==="self"?"\u62BC\u3059\u3068\u5373\u767A\u52D5":"\u9577\u62BC\u3057\u3067\u7167\u6E96 \u2192 \u96E2\u3057\u3066\u767A\u52D5",a=gs("div","skill"+(s.ult?" ult":""));a.innerHTML=`<div class="s-ring"></div><div class="s-icon">${Ku[s.id]}</div><div class="s-cd"></div><div class="s-num"></div><div class="s-key">${n}</div>
        <div class="s-tip"><b>${s.name}</b><i>${s.en}</i><p>${s.desc}</p><span>${s.ult?"\u30B2\u30FC\u30B8 100%":"\u30AF\u30FC\u30EB\u30C0\u30A6\u30F3 "+ +(s.cd*e.cdMul).toFixed(1)+"\u79D2"}\u3000\uFF0F\u3000${r}</span></div>`,a.addEventListener("mousedown",o=>{o.stopPropagation(),o.preventDefault(),this.h.skillClick(n)}),t.appendChild(a),this.skills[n]={root:a,cd:Ae(".s-cd",a),num:Ae(".s-num",a),ring:Ae(".s-ring",a),ready:!0}}}buildTitle(){let e=Ae("#blades");for(let n of Object.values($t)){let s=gs("button","blade");s.style.setProperty("--c",n.css);let r=(a,o)=>`<div class="stat"><span>${a}</span><div>${'<i class="on"></i>'.repeat(o)}${"<i></i>".repeat(5-o)}</div></div>`;s.innerHTML=`<div class="b-disc"><div class="b-disc-in"></div></div><div class="b-type">${n.type}</div><div class="b-en">${n.en}</div><div class="b-name">${n.name}</div>
        <div class="b-stats">${r("\u653B\u6483",n.bars.atk)}${r("\u9632\u5FA1",n.bars.def)}${r("\u6301\u4E45",n.bars.sta)}${r("\u901F\u5EA6",n.bars.spd)}</div><p>${n.desc}</p>`,s.onclick=()=>{this.blade=n.id,this.h.ui(),this.refreshTitle()},s.dataset.id=n.id,e.appendChild(s)}let t=Ae("#levels");Ss.forEach((n,s)=>{let r=gs("button","level",`<b>${n.name}</b><span>${n.ja}</span>`);r.onclick=()=>{this.level=s,this.h.ui(),this.refreshTitle()},r.dataset.i=s,t.appendChild(r)}),Ae("#btn-start").onclick=()=>this.h.start(this.blade,this.level),this.refreshTitle()}refreshTitle(){document.querySelectorAll(".blade").forEach(t=>t.classList.toggle("on",t.dataset.id===this.blade)),document.querySelectorAll(".level").forEach(t=>t.classList.toggle("on",Number(t.dataset.i)===this.level));let e=$t[this.blade];Ae("#how").style.setProperty("--c",e.css),Ae("#how-name").textContent=e.name+" \u306E\u30B9\u30AD\u30EB",Ae("#how").innerHTML=ro(e).map((t,n)=>`<div class="how-row"><kbd>${Ht[n]}</kbd><div class="how-icon">${Ku[t.id]}</div><div><b>${t.name}</b><span>${t.desc}</span></div></div>`).join("")}show(e,t){Ae("#"+e).classList.toggle("hidden",!t)}setMuted(e){Ae("#btn-mute").classList.toggle("off",e),Ae("#btn-mute").textContent=e?"\u266A OFF":"\u266A ON"}slot(e){return e.side===this.side?0:1}startMatch(e,t,n,s){this.side=t,this.labels.innerHTML="",this.tags=[];for(let a of e.tops){let o=a.side===t,c=this.fighters[this.slot(a)];c.root.style.setProperty("--c",a.blade.css),c.tag.textContent=o?"YOU":n,c.name.textContent=a.blade.name,c.type.textContent=a.blade.typeJa+(!o&&s?" \uFF0F "+s:""),c.ghostV=c.shown=1;let l=gs("div","tag "+(o?"me":"foe"),`<span>${o?"YOU":n}</span><div><i></i></div>`);l.style.setProperty("--c",a.blade.css),this.labels.appendChild(l),this.tags[a.side]={root:l,fill:Ae("i",l)}}let r=e.tops[t];this.buildSkills(r.blade),Ae("#skillbar").style.setProperty("--c",r.blade.css),this.setScore([0,0])}setScore(e){this.fighters.forEach((t,n)=>{let s=e[n===0?this.side:1-this.side];t.pips.innerHTML="";for(let r=0;r<$i;r++)t.pips.appendChild(gs("i",r<s?"on":""))})}setNet(e,t){let n=Ae("#netstat");n.textContent!==e&&(n.textContent=e),n.classList.toggle("bad",!!t),n.classList.toggle("hidden",!e)}toast(e){let t=Ae("#toast");t.textContent=e,t.className="",t.offsetWidth,t.className="show"}setMenuMode(e){Ae("#pause-title").textContent=e?"MENU":"PAUSE",Ae("#pause-note").textContent=e?"\u30AA\u30F3\u30E9\u30A4\u30F3\u5BFE\u6226\u4E2D\u306F\u4E00\u6642\u505C\u6B62\u3067\u304D\u307E\u305B\u3093\u3002":"",Ae("#btn-quit").textContent=e?"\u5BFE\u6226\u3092\u3084\u3081\u308B":"\u30BF\u30A4\u30C8\u30EB\u3078",Ae("#btn-again").textContent=e?"\u3082\u3046\u4E00\u5EA6\uFF08\u30ED\u30D3\u30FC\u3078\uFF09":"\u3082\u3046\u4E00\u5EA6",Ae("#btn-back").textContent=e?"\u9000\u51FA\u3059\u308B":"\u30D6\u30EC\u30FC\u30C9\u9078\u629E\u3078"}showLobby(e){let t={opening:"\u30EB\u30FC\u30E0\u3092\u6E96\u5099\u3057\u3066\u3044\u307E\u3059\u2026",waiting:"\u76F8\u624B\u306E\u53C2\u52A0\u3092\u5F85\u3063\u3066\u3044\u307E\u3059",connecting:"\u30EB\u30FC\u30E0\u306B\u63A5\u7D9A\u3057\u3066\u3044\u307E\u3059\u2026",connected:e.peer&&e.peer.ready&&e.me.ready?"\u307E\u3082\u306A\u304F\u958B\u59CB\u3057\u307E\u3059":"\u63A5\u7D9A\u3057\u307E\u3057\u305F\u3002\u30D6\u30EC\u30FC\u30C9\u3092\u9078\u3093\u3067\u6E96\u5099OK\u3092\u62BC\u3057\u3066\u304F\u3060\u3055\u3044",failed:e.error||"\u63A5\u7D9A\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F"}[e.status],n=Ae("#lb-status");n.textContent=t,n.className="lb-status "+e.status,Ae("#lb-invite").classList.toggle("hidden",e.role!=="host"||!e.url),e.url&&Ae("#lb-url").value!==e.url&&(Ae("#lb-url").value=e.url);let s=(o,c,l)=>{let h=l&&$t[l.blade];o.style.setProperty("--c",h?h.css:"#3a4566"),o.classList.toggle("ready",!!(l&&l.ready)),o.classList.toggle("empty",!l),o.innerHTML=`<span class="lb-who">${c}</span><b>${h?h.en:"\u2014 \u2014 \u2014"}</b><span class="lb-name">${h?h.name+"\uFF08"+h.typeJa+"\uFF09":"\u672A\u63A5\u7D9A"}</span><em>${l?l.ready?"READY":"\u9078\u629E\u4E2D\u2026":""}</em>`};s(Ae("#lb-me"),"YOU",e.me),s(Ae("#lb-peer"),"RIVAL",e.peer),document.querySelectorAll(".lb-blade").forEach(o=>{o.classList.toggle("on",o.dataset.id===e.me.blade),o.disabled=e.me.ready});let r=Ae("#lb-ready");r.disabled=e.status!=="connected",r.textContent=e.me.ready?"\u6E96\u5099\u3092\u53D6\u308A\u6D88\u3059":"\u6E96\u5099OK",r.classList.toggle("armed",e.me.ready);let a=Ae("#lb-kit");a.style.setProperty("--c",$t[e.me.blade].css),a.innerHTML=ro($t[e.me.blade]).map((o,c)=>`<div class="how-row"><kbd>${Ht[c]}</kbd><div class="how-icon">${Ku[o.id]}</div><div><b>${o.name}</b><span>${o.desc}</span></div></div>`).join("")}setRound(e){Ae("#round").textContent="ROUND "+e}announce(e,t="",n="",s=1.2){let r=this.announceEl;r.className="",r.innerHTML=`<div class="a-main">${e}</div>${t?`<div class="a-sub">${t}</div>`:""}`,r.offsetWidth,r.style.setProperty("--d",s+"s"),r.className="show "+n}finish(e,t){let[n,s]=xb[e];this.announce(n,`${s}\u3000<b>${t?"ROUND GET!":"ROUND LOST\u2026"}</b>`,"finish "+(t?"win":"lose"),2.6)}cutIn(e,t,n){let s=this.cutin;s.className="",s.style.setProperty("--c",t),s.innerHTML=`<div class="ci-bar"></div><div class="ci-text"><span>${n?"ENEMY ULTIMATE":"ULTIMATE"}</span><b>${e.en}</b><i>${e.name}</i></div>`,s.offsetWidth,s.className="show"+(n?" enemy":"")}flash(e="#fff",t=.5){let n=this.flashEl;n.style.background=e,n.style.transition="none",n.style.opacity=t,n.offsetWidth,n.style.transition="opacity .45s ease-out",n.style.opacity=0}pop(e,t,n,s=""){let r=gs("div","pop "+s,n);r.style.left=e+"px",r.style.top=t+"px",r.style.setProperty("--r",(Math.random()*60-30).toFixed(0)+"px"),this.labels.appendChild(r),r.addEventListener("animationend",()=>r.remove())}denied(e){let t=this.skills[e].root;t.classList.remove("denied"),t.offsetWidth,t.classList.add("denied")}castFx(e){let t=this.skills[e].root;t.classList.remove("fired"),t.offsetWidth,t.classList.add("fired")}update(e,t,n,s,r){e.tops.forEach((h,u)=>{let d=this.fighters[this.slot(h)],f=Math.max(0,h.spin/h.spinMax);d.ghostV<f&&(d.ghostV=f),d.ghostV+=(f-d.ghostV)*Math.min(1,r*2.2),d.fill.style.transform=`scaleX(${f})`,d.ghost.style.transform=`scaleX(${d.ghostV})`,d.num.textContent=Math.ceil(Math.max(0,h.spin)*3.6)+" rpm",d.root.classList.toggle("low",f<.25),d.ult.style.transform=`scaleX(${h.ult/100})`,d.ultBox.classList.toggle("ready",h.ult>=100);let m=this.tags[u],x=h.out||e.result;if(m.root.style.opacity=x?0:1,!x){let g=t.tops[u].group.position,p=t.toScreen(g.x,g.y+2.5,g.z);m.root.style.transform=`translate(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px)`,m.fill.style.transform=`scaleX(${f})`}});let a=e.tops[this.side];for(let h of Ht){let u=fn(a,h),d=this.skills[h],f=a.cd[h],m=u.cd*a.blade.cdMul,x=u.ult&&a.ult<100,g=f<=0&&!x;d.cd.style.setProperty("--p",x?0:Math.min(1,f/m)),d.num.textContent=x?Math.floor(a.ult)+"%":f>0?f<1?f.toFixed(1):Math.ceil(f):"",u.ult&&d.ring.style.setProperty("--p",a.ult/100),g!==d.ready&&(d.ready=g,d.root.classList.toggle("wait",!g),g&&(d.root.classList.remove("up"),d.root.offsetWidth,d.root.classList.add("up"))),d.root.classList.toggle("aim",s===h)}let o=Math.max(0,Math.ceil(n));if(o!==this.lastTime){this.lastTime=o;let h=Ae("#time");h.textContent=o,h.classList.toggle("hurry",o<=10)}let c=t.aimInfo;c&&c.lock?(this.lockEl.style.opacity=1,this.lockEl.style.transform=`translate(${c.x.toFixed(1)}px,${c.y.toFixed(1)}px)`):this.lockEl.style.opacity=0;let l=Math.max(0,1-a.spin/a.spinMax/.25);this.vignette.style.opacity=e.result?0:l*.9}showResult(e,t,n,s){let r=n.tops[this.side],a=n.tops[1-this.side];t=[t[this.side],t[1-this.side]],Ae("#result").classList.toggle("lose",!e),Ae("#res-title").textContent=e?"VICTORY":"DEFEAT",Ae("#res-sub").textContent=e?"\u898B\u4E8B\u306A\u52DD\u5229\uFF01":"\u3042\u3068\u4E00\u6B69\u2026\u3082\u3046\u4E00\u5EA6\u6311\u6226\u3057\u3088\u3046",Ae("#res-score").innerHTML=`<b style="color:${r.blade.css}">${t[0]}</b><span>-</span><b style="color:${a.blade.css}">${t[1]}</b>`;let o=(c,l,h)=>`<tr><td>${l}</td><th>${c}</th><td>${h}</td></tr>`;Ae("#res-stats").innerHTML=`<tr class="head"><td style="color:${r.blade.css}">${r.blade.name}</td><th></th><td style="color:${a.blade.css}">${a.blade.name}</td></tr>`+o("\u4E0E\u3048\u305F\u30C0\u30E1\u30FC\u30B8",Math.round(r.stats.dealt),Math.round(a.stats.dealt))+o("\u6700\u5927\u30D2\u30C3\u30C8",Math.round(r.stats.maxHit),Math.round(a.stats.maxHit))+o("\u30B9\u30AD\u30EB\u547D\u4E2D",r.stats.skillHits,a.stats.skillHits)+o("\u30D1\u30EA\u30A3 / \u53CD\u5C04",r.stats.parries,a.stats.parries)+o("\u6FC0\u7A81\u56DE\u6570",r.stats.clashes,a.stats.clashes),Ae("#res-finish").textContent=s.join("\u3000/\u3000"),this.show("result",!0)}};var Ol=class{constructor(){this.ctx=null,this.muted=!1,this.musicOn=!1,this.step=0,this.nextTime=0,this.intensity=0}unlock(){if(this.ctx){this.ctx.state==="suspended"&&this.ctx.resume();return}let e=window.AudioContext||window.webkitAudioContext;if(!e)return;let t=this.ctx=new e;this.master=t.createGain(),this.master.gain.value=this.muted?0:.8;let n=t.createDynamicsCompressor();n.threshold.value=-14,n.ratio.value=6,this.master.connect(n).connect(t.destination),this.sfx=t.createGain(),this.sfx.gain.value=.9,this.sfx.connect(this.master),this.music=t.createGain(),this.music.gain.value=.32,this.music.connect(this.master);let s=t.sampleRate;this.noiseBuf=t.createBuffer(1,s,t.sampleRate);let r=this.noiseBuf.getChannelData(0);for(let a=0;a<s;a++)r[a]=Math.random()*2-1}setMuted(e){this.muted=e,this.master&&this.master.gain.setTargetAtTime(e?0:.8,this.ctx.currentTime,.02)}tone(e,t,n,s,r,a=0,o=this.sfx){let c=this.ctx;if(!c)return;let l=c.currentTime+a,h=c.createOscillator(),u=c.createGain();h.type=e,h.frequency.setValueAtTime(t,l),n!==t&&h.frequency.exponentialRampToValueAtTime(Math.max(20,n),l+s),u.gain.setValueAtTime(1e-4,l),u.gain.exponentialRampToValueAtTime(r,l+.006),u.gain.exponentialRampToValueAtTime(1e-4,l+s),h.connect(u).connect(o),h.start(l),h.stop(l+s+.02)}noise(e,t,n,s,r=1,a="bandpass",o=0,c=this.sfx){let l=this.ctx;if(!l)return;let h=l.currentTime+o,u=l.createBufferSource();u.buffer=this.noiseBuf,u.loop=!0;let d=l.createBiquadFilter();d.type=a,d.Q.value=r,d.frequency.setValueAtTime(n,h),s!==n&&d.frequency.exponentialRampToValueAtTime(Math.max(30,s),h+e);let f=l.createGain();f.gain.setValueAtTime(1e-4,h),f.gain.exponentialRampToValueAtTime(t,h+.005),f.gain.exponentialRampToValueAtTime(1e-4,h+e),u.connect(d).connect(f).connect(c),u.start(h,Math.random()),u.stop(h+e+.02)}clash(e){let t=Math.min(1,e/28),n=.12+.4*t,s=1500+Math.random()*900;this.tone("triangle",s,s*.98,.18+.25*t,n*.5),this.tone("square",s*1.51,s*1.5,.09+.1*t,n*.16),this.tone("sine",s*2.76,s*2.7,.25+.3*t,n*.22),this.noise(.07+.08*t,n,5200,2200,.8),t>.5&&this.tone("sine",150,45,.25,n*.9)}wall(e,t){let n=Math.min(1,e/18);this.noise(.12,.1+.25*n,1800,500,1.2),this.tone("triangle",420,180,.14,.1+.2*n),t&&this.tone("sine",120,40,.3,.5)}windup(){this.tone("sawtooth",220,660,.3,.07),this.noise(.3,.05,800,3200,2)}shoot(){this.noise(.28,.3,4200,700,1.4),this.tone("sawtooth",980,240,.22,.14)}projHit(){this.noise(.2,.4,2600,500,.7),this.tone("square",520,110,.2,.2),this.tone("sine",140,50,.25,.5)}guard(){this.tone("sine",520,1040,.25,.22),this.tone("triangle",780,1560,.3,.12,.04)}parry(){this.tone("triangle",2400,2350,.5,.3),this.tone("sine",3600,3500,.6,.2),this.noise(.1,.4,7e3,3e3,.7),this.tone("sine",170,50,.3,.6)}dash(){this.noise(.35,.35,500,5200,.9),this.tone("sawtooth",160,720,.25,.12)}leap(){this.noise(.9,.25,300,4200,1.5),this.tone("sawtooth",110,880,.9,.12),this.tone("sine",220,1760,.9,.1)}meteor(){this.tone("sine",190,28,.9,1),this.tone("triangle",90,30,.7,.6),this.noise(.8,.7,2600,90,.5,"lowpass"),this.noise(.25,.4,6e3,1500,.7)}blink(){this.noise(.22,.25,6e3,900,2),this.tone("sine",1500,500,.2,.14)}quake(){this.tone("sine",130,34,.55,.9),this.noise(.45,.5,1400,120,.6,"lowpass"),this.noise(.15,.3,3e3,900,.8)}flare(){this.noise(.45,.4,900,3600,.7),this.tone("sawtooth",240,90,.4,.12)}heal(){[523,659,784].forEach((e,t)=>this.tone("sine",e,e*1.01,.35,.13,t*.06))}drain(){this.tone("sine",300,620,.22,.12),this.tone("triangle",150,80,.2,.2)}chain(){this.noise(.25,.3,3e3,1500,3),[0,.04,.08,.12].forEach(e=>this.tone("square",1800+e*3e3,1500,.04,.07,e))}ringout(){this.tone("sawtooth",1400,180,.8,.2),this.noise(.7,.4,5e3,400,.8),this.tone("sine",140,40,.5,.7)}ultReady(){[660,880,1320].forEach((e,t)=>this.tone("triangle",e,e,.22,.16,t*.07))}denied(){this.tone("square",150,120,.08,.08)}move(){this.tone("sine",880,1200,.05,.05)}ui(){this.tone("triangle",720,960,.07,.14)}hover(){this.tone("sine",1300,1300,.03,.04)}beep(e){e?(this.tone("square",880,880,.5,.18),this.tone("sawtooth",1320,1320,.55,.12),this.noise(.5,.25,800,6e3,.8)):this.tone("square",440,440,.16,.16)}finish(e){(e?[523,659,784,1047]:[392,330,262,196]).forEach((n,s)=>{this.tone("triangle",n,n,.45,.2,s*.13),this.tone("sawtooth",n/2,n/2,.45,.07,s*.13)})}startMusic(){!this.ctx||this.musicOn||(this.musicOn=!0,this.step=0,this.nextTime=this.ctx.currentTime+.1)}stopMusic(){this.musicOn=!1}update(){let e=this.ctx;if(!e||!this.musicOn)return;let t=60/138/4;for(;this.nextTime<e.currentTime+.15;){let n=this.step%64,s=Math.floor(n/16),r=n%16,a=this.nextTime-e.currentTime,c=[55,55,65.4,49][s],l=this.music,h=this.intensity;r%4===0&&this.tone("sine",150,42,.16,.9,a,l),r%4===2&&this.noise(.03,.12+.1*h,9e3,9e3,1,"highpass",a,l),r%8===4&&this.noise(.11,.35,1900,1100,.8,"bandpass",a,l),(r%2===1||r%8===0)&&this.tone("sawtooth",c,c,t*.9,.22,a,l);let u=[1,1.5,2,2.4,3,2.4,2,1.5];(h>.3||r%2===0)&&this.tone("square",c*4*u[r%8],c*4*u[r%8],t*.8,.035+.035*h,a,l),this.nextTime+=t,this.step++}}};var ju=class{constructor(){this.encoder=new TextEncoder,this._pieces=[],this._parts=[]}append_buffer(e){this.flush(),this._parts.push(e)}append(e){this._pieces.push(e)}flush(){if(this._pieces.length>0){let e=new Uint8Array(this._pieces);this._parts.push(e),this._pieces=[]}}toArrayBuffer(){let e=[];for(let t of this._parts)e.push(t);return _b(e).buffer}};function _b(i){let e=0;for(let s of i)e+=s.byteLength;let t=new Uint8Array(e),n=0;for(let s of i){let r=new Uint8Array(s.buffer,s.byteOffset,s.byteLength);t.set(r,n),n+=s.byteLength}return t}function td(i){return new Qu(i).unpack()}function nd(i){let e=new ed,t=e.pack(i);return t instanceof Promise?t.then(()=>e.getBuffer()):e.getBuffer()}var Qu=class{constructor(e){this.index=0,this.dataBuffer=e,this.dataView=new Uint8Array(this.dataBuffer),this.length=this.dataBuffer.byteLength}unpack(){let e=this.unpack_uint8();if(e<128)return e;if((e^224)<32)return(e^224)-32;let t;if((t=e^160)<=15)return this.unpack_raw(t);if((t=e^176)<=15)return this.unpack_string(t);if((t=e^144)<=15)return this.unpack_array(t);if((t=e^128)<=15)return this.unpack_map(t);switch(e){case 192:return null;case 193:return;case 194:return!1;case 195:return!0;case 202:return this.unpack_float();case 203:return this.unpack_double();case 204:return this.unpack_uint8();case 205:return this.unpack_uint16();case 206:return this.unpack_uint32();case 207:return this.unpack_uint64();case 208:return this.unpack_int8();case 209:return this.unpack_int16();case 210:return this.unpack_int32();case 211:return this.unpack_int64();case 212:return;case 213:return;case 214:return;case 215:return;case 216:return t=this.unpack_uint16(),this.unpack_string(t);case 217:return t=this.unpack_uint32(),this.unpack_string(t);case 218:return t=this.unpack_uint16(),this.unpack_raw(t);case 219:return t=this.unpack_uint32(),this.unpack_raw(t);case 220:return t=this.unpack_uint16(),this.unpack_array(t);case 221:return t=this.unpack_uint32(),this.unpack_array(t);case 222:return t=this.unpack_uint16(),this.unpack_map(t);case 223:return t=this.unpack_uint32(),this.unpack_map(t)}}unpack_uint8(){let e=this.dataView[this.index]&255;return this.index++,e}unpack_uint16(){let e=this.read(2),t=(e[0]&255)*256+(e[1]&255);return this.index+=2,t}unpack_uint32(){let e=this.read(4),t=((e[0]*256+e[1])*256+e[2])*256+e[3];return this.index+=4,t}unpack_uint64(){let e=this.read(8),t=((((((e[0]*256+e[1])*256+e[2])*256+e[3])*256+e[4])*256+e[5])*256+e[6])*256+e[7];return this.index+=8,t}unpack_int8(){let e=this.unpack_uint8();return e<128?e:e-256}unpack_int16(){let e=this.unpack_uint16();return e<32768?e:e-65536}unpack_int32(){let e=this.unpack_uint32();return e<2**31?e:e-2**32}unpack_int64(){let e=this.unpack_uint64();return e<2**63?e:e-2**64}unpack_raw(e){if(this.length<this.index+e)throw new Error(`BinaryPackFailure: index is out of range ${this.index} ${e} ${this.length}`);let t=this.dataBuffer.slice(this.index,this.index+e);return this.index+=e,t}unpack_string(e){let t=this.read(e),n=0,s="",r,a;for(;n<e;)r=t[n],r<160?(a=r,n++):(r^192)<32?(a=(r&31)<<6|t[n+1]&63,n+=2):(r^224)<16?(a=(r&15)<<12|(t[n+1]&63)<<6|t[n+2]&63,n+=3):(a=(r&7)<<18|(t[n+1]&63)<<12|(t[n+2]&63)<<6|t[n+3]&63,n+=4),s+=String.fromCodePoint(a);return this.index+=e,s}unpack_array(e){let t=new Array(e);for(let n=0;n<e;n++)t[n]=this.unpack();return t}unpack_map(e){let t={};for(let n=0;n<e;n++){let s=this.unpack();t[s]=this.unpack()}return t}unpack_float(){let e=this.unpack_uint32(),t=e>>31,n=(e>>23&255)-127,s=e&8388607|8388608;return(t===0?1:-1)*s*2**(n-23)}unpack_double(){let e=this.unpack_uint32(),t=this.unpack_uint32(),n=e>>31,s=(e>>20&2047)-1023,a=(e&1048575|1048576)*2**(s-20)+t*2**(s-52);return(n===0?1:-1)*a}read(e){let t=this.index;if(t+e<=this.length)return this.dataView.subarray(t,t+e);throw new Error("BinaryPackFailure: read index out of range")}},ed=class{getBuffer(){return this._bufferBuilder.toArrayBuffer()}pack(e){if(typeof e=="string")this.pack_string(e);else if(typeof e=="number")Math.floor(e)===e?this.pack_integer(e):this.pack_double(e);else if(typeof e=="boolean")e===!0?this._bufferBuilder.append(195):e===!1&&this._bufferBuilder.append(194);else if(e===void 0)this._bufferBuilder.append(192);else if(typeof e=="object")if(e===null)this._bufferBuilder.append(192);else{let t=e.constructor;if(e instanceof Array){let n=this.pack_array(e);if(n instanceof Promise)return n.then(()=>this._bufferBuilder.flush())}else if(e instanceof ArrayBuffer)this.pack_bin(new Uint8Array(e));else if("BYTES_PER_ELEMENT"in e){let n=e;this.pack_bin(new Uint8Array(n.buffer,n.byteOffset,n.byteLength))}else if(e instanceof Date)this.pack_string(e.toString());else{if(e instanceof Blob)return e.arrayBuffer().then(n=>{this.pack_bin(new Uint8Array(n)),this._bufferBuilder.flush()});if(t==Object||t.toString().startsWith("class")){let n=this.pack_object(e);if(n instanceof Promise)return n.then(()=>this._bufferBuilder.flush())}else throw new Error(`Type "${t.toString()}" not yet supported`)}}else throw new Error(`Type "${typeof e}" not yet supported`);this._bufferBuilder.flush()}pack_bin(e){let t=e.length;if(t<=15)this.pack_uint8(160+t);else if(t<=65535)this._bufferBuilder.append(218),this.pack_uint16(t);else if(t<=4294967295)this._bufferBuilder.append(219),this.pack_uint32(t);else throw new Error("Invalid length");this._bufferBuilder.append_buffer(e)}pack_string(e){let t=this._textEncoder.encode(e),n=t.length;if(n<=15)this.pack_uint8(176+n);else if(n<=65535)this._bufferBuilder.append(216),this.pack_uint16(n);else if(n<=4294967295)this._bufferBuilder.append(217),this.pack_uint32(n);else throw new Error("Invalid length");this._bufferBuilder.append_buffer(t)}pack_array(e){let t=e.length;if(t<=15)this.pack_uint8(144+t);else if(t<=65535)this._bufferBuilder.append(220),this.pack_uint16(t);else if(t<=4294967295)this._bufferBuilder.append(221),this.pack_uint32(t);else throw new Error("Invalid length");let n=s=>{if(s<t){let r=this.pack(e[s]);return r instanceof Promise?r.then(()=>n(s+1)):n(s+1)}};return n(0)}pack_integer(e){if(e>=-32&&e<=127)this._bufferBuilder.append(e&255);else if(e>=0&&e<=255)this._bufferBuilder.append(204),this.pack_uint8(e);else if(e>=-128&&e<=127)this._bufferBuilder.append(208),this.pack_int8(e);else if(e>=0&&e<=65535)this._bufferBuilder.append(205),this.pack_uint16(e);else if(e>=-32768&&e<=32767)this._bufferBuilder.append(209),this.pack_int16(e);else if(e>=0&&e<=4294967295)this._bufferBuilder.append(206),this.pack_uint32(e);else if(e>=-2147483648&&e<=2147483647)this._bufferBuilder.append(210),this.pack_int32(e);else if(e>=-9223372036854776e3&&e<=9223372036854776e3)this._bufferBuilder.append(211),this.pack_int64(e);else if(e>=0&&e<=18446744073709552e3)this._bufferBuilder.append(207),this.pack_uint64(e);else throw new Error("Invalid integer")}pack_double(e){let t=0;e<0&&(t=1,e=-e);let n=Math.floor(Math.log(e)/Math.LN2),s=e/2**n-1,r=Math.floor(s*2**52),a=2**32,o=t<<31|n+1023<<20|r/a&1048575,c=r%a;this._bufferBuilder.append(203),this.pack_int32(o),this.pack_int32(c)}pack_object(e){let t=Object.keys(e),n=t.length;if(n<=15)this.pack_uint8(128+n);else if(n<=65535)this._bufferBuilder.append(222),this.pack_uint16(n);else if(n<=4294967295)this._bufferBuilder.append(223),this.pack_uint32(n);else throw new Error("Invalid length");let s=r=>{if(r<t.length){let a=t[r];if(e.hasOwnProperty(a)){this.pack(a);let o=this.pack(e[a]);if(o instanceof Promise)return o.then(()=>s(r+1))}return s(r+1)}};return s(0)}pack_uint8(e){this._bufferBuilder.append(e)}pack_uint16(e){this._bufferBuilder.append(e>>8),this._bufferBuilder.append(e&255)}pack_uint32(e){let t=e&4294967295;this._bufferBuilder.append((t&4278190080)>>>24),this._bufferBuilder.append((t&16711680)>>>16),this._bufferBuilder.append((t&65280)>>>8),this._bufferBuilder.append(t&255)}pack_uint64(e){let t=e/4294967296,n=e%2**32;this._bufferBuilder.append((t&4278190080)>>>24),this._bufferBuilder.append((t&16711680)>>>16),this._bufferBuilder.append((t&65280)>>>8),this._bufferBuilder.append(t&255),this._bufferBuilder.append((n&4278190080)>>>24),this._bufferBuilder.append((n&16711680)>>>16),this._bufferBuilder.append((n&65280)>>>8),this._bufferBuilder.append(n&255)}pack_int8(e){this._bufferBuilder.append(e&255)}pack_int16(e){this._bufferBuilder.append((e&65280)>>8),this._bufferBuilder.append(e&255)}pack_int32(e){this._bufferBuilder.append(e>>>24&255),this._bufferBuilder.append((e&16711680)>>>16),this._bufferBuilder.append((e&65280)>>>8),this._bufferBuilder.append(e&255)}pack_int64(e){let t=Math.floor(e/4294967296),n=e%2**32;this._bufferBuilder.append((t&4278190080)>>>24),this._bufferBuilder.append((t&16711680)>>>16),this._bufferBuilder.append((t&65280)>>>8),this._bufferBuilder.append(t&255),this._bufferBuilder.append((n&4278190080)>>>24),this._bufferBuilder.append((n&16711680)>>>16),this._bufferBuilder.append((n&65280)>>>8),this._bufferBuilder.append(n&255)}constructor(){this._bufferBuilder=new ju,this._textEncoder=new TextEncoder}};var Xm=!0,qm=!0;function yr(i,e,t){let n=i.match(e);return n&&n.length>=t&&parseFloat(n[t],10)}function si(i,e,t){if(!i.RTCPeerConnection)return;if(!Object.getOwnPropertyDescriptor(EventTarget.prototype,"addEventListener").writable){Va("Unable to polyfill events");return}let s=i.RTCPeerConnection.prototype,r=s.addEventListener;s.addEventListener=function(o,c){if(o!==e)return r.apply(this,arguments);let l=h=>{let u=t(h);u&&(c.handleEvent?c.handleEvent(u):c(u))};return this._eventMap=this._eventMap||{},this._eventMap[e]||(this._eventMap[e]=new Map),this._eventMap[e].set(c,l),r.apply(this,[o,l])};let a=s.removeEventListener;s.removeEventListener=function(o,c){if(o!==e||!this._eventMap||!this._eventMap[e])return a.apply(this,arguments);if(!this._eventMap[e].has(c))return a.apply(this,arguments);let l=this._eventMap[e].get(c);return this._eventMap[e].delete(c),this._eventMap[e].size===0&&delete this._eventMap[e],Object.keys(this._eventMap).length===0&&delete this._eventMap,a.apply(this,[o,l])},Object.defineProperty(s,"on"+e,{get(){return this["_on"+e]},set(o){this["_on"+e]&&(this.removeEventListener(e,this["_on"+e]),delete this["_on"+e]),o&&this.addEventListener(e,this["_on"+e]=o)},enumerable:!0,configurable:!0})}function Ym(i){return typeof i!="boolean"?new Error("Argument type: "+typeof i+". Please use a boolean."):(Xm=i,i?"adapter.js logging disabled":"adapter.js logging enabled")}function $m(i){return typeof i!="boolean"?new Error("Argument type: "+typeof i+". Please use a boolean."):(qm=!i,"adapter.js deprecation warnings "+(i?"disabled":"enabled"))}function Va(){if(typeof window=="object"){if(Xm)return;typeof console<"u"&&typeof console.log=="function"&&console.log.apply(console,arguments)}}function vr(i,e){qm&&console.warn(i+" is deprecated, please use "+e+" instead.")}function Zm(i){let e={browser:null,version:null};if(typeof i>"u"||!i.navigator||!i.navigator.userAgent)return e.browser="Not a browser.",e;let{navigator:t}=i;if(t.userAgentData&&t.userAgentData.brands){let n=t.userAgentData.brands.find(s=>s.brand==="Chromium");if(n){let s=parseInt(n.version,10);if(s>=90)return{browser:"chrome",version:s}}}if(t.mozGetUserMedia)e.browser="firefox",e.version=parseInt(yr(t.userAgent,/Firefox\/(\d+)\./,1));else if(t.webkitGetUserMedia||i.isSecureContext===!1&&i.webkitRTCPeerConnection)e.browser="chrome",e.version=parseInt(yr(t.userAgent,/Chrom(e|ium)\/(\d+)\./,2))||null;else if(i.RTCPeerConnection&&t.userAgent.match(/AppleWebKit\/(\d+)\./))e.browser="safari",e.version=parseInt(yr(t.userAgent,/AppleWebKit\/(\d+)\./,1)),e.supportsUnifiedPlan=i.RTCRtpTransceiver&&"currentDirection"in i.RTCRtpTransceiver.prototype,e._safariVersion=yr(t.userAgent,/Version\/(\d+(\.?\d+))/,1);else return e.browser="Not a supported browser.",e;return e}function Wm(i){return Object.prototype.toString.call(i)==="[object Object]"}function sd(i){return Wm(i)?Object.keys(i).reduce(function(e,t){let n=Wm(i[t]),s=n?sd(i[t]):i[t],r=n&&!Object.keys(s).length;return s===void 0||r?e:Object.assign(e,{[t]:s})},{}):i}function id(i,e,t){!e||t.has(e.id)||(t.set(e.id,e),Object.keys(e).forEach(n=>{n.endsWith("Id")?id(i,i.get(e[n]),t):n.endsWith("Ids")&&e[n].forEach(s=>{id(i,i.get(s),t)})}))}function rd(i,e,t){let n=t?"outbound-rtp":"inbound-rtp",s=new Map;if(e===null)return s;let r=[];return i.forEach(a=>{a.type==="track"&&a.trackIdentifier===e.id&&r.push(a)}),r.forEach(a=>{i.forEach(o=>{o.type===n&&o.trackId===a.id&&id(i,o,s)})}),s}var zl={};so(zl,{fixNegotiationNeeded:()=>ud,shimAddTrackRemoveTrack:()=>hd,shimAddTrackRemoveTrackWithNative:()=>Km,shimGetSendersWithDtmf:()=>cd,shimGetUserMedia:()=>Fl,shimMediaStream:()=>ad,shimOnTrack:()=>od,shimPeerConnection:()=>kl,shimSenderReceiverGetStats:()=>ld});var Jm=Va;function Fl(i,e){if(e.version>=64)return;let t=i&&i.navigator;if(!t.mediaDevices)return;let n=function(o){if(typeof o!="object"||o.mandatory||o.optional)return o;let c={};return Object.keys(o).forEach(l=>{if(l==="require"||l==="advanced"||l==="mediaSource")return;let h=typeof o[l]=="object"?o[l]:{ideal:o[l]};h.exact!==void 0&&typeof h.exact=="number"&&(h.min=h.max=h.exact);let u=function(d,f){return d?d+f.charAt(0).toUpperCase()+f.slice(1):f==="deviceId"?"sourceId":f};if(h.ideal!==void 0){c.optional=c.optional||[];let d={};typeof h.ideal=="number"?(d[u("min",l)]=h.ideal,c.optional.push(d),d={},d[u("max",l)]=h.ideal,c.optional.push(d)):(d[u("",l)]=h.ideal,c.optional.push(d))}h.exact!==void 0&&typeof h.exact!="number"?(c.mandatory=c.mandatory||{},c.mandatory[u("",l)]=h.exact):["min","max"].forEach(d=>{h[d]!==void 0&&(c.mandatory=c.mandatory||{},c.mandatory[u(d,l)]=h[d])})}),o.advanced&&(c.optional=(c.optional||[]).concat(o.advanced)),c},s=function(o,c){if(e.version>=61)return c(o);if(o=JSON.parse(JSON.stringify(o)),o&&typeof o.audio=="object"){let l=function(h,u,d){u in h&&!(d in h)&&(h[d]=h[u],delete h[u])};o=JSON.parse(JSON.stringify(o)),l(o.audio,"autoGainControl","googAutoGainControl"),l(o.audio,"noiseSuppression","googNoiseSuppression"),o.audio=n(o.audio)}if(o&&typeof o.video=="object"){let l=o.video.facingMode;l=l&&(typeof l=="object"?l:{ideal:l});let h=e.version<66;if(l&&(l.exact==="user"||l.exact==="environment"||l.ideal==="user"||l.ideal==="environment")&&!(t.mediaDevices.getSupportedConstraints&&t.mediaDevices.getSupportedConstraints().facingMode&&!h)){delete o.video.facingMode;let u;if(l.exact==="environment"||l.ideal==="environment"?u=["back","rear"]:(l.exact==="user"||l.ideal==="user")&&(u=["front"]),u)return t.mediaDevices.enumerateDevices().then(d=>{d=d.filter(m=>m.kind==="videoinput");let f=d.find(m=>u.some(x=>m.label.toLowerCase().includes(x)));return!f&&d.length&&u.includes("back")&&(f=d[d.length-1]),f&&(o.video.deviceId=l.exact?{exact:f.deviceId}:{ideal:f.deviceId}),o.video=n(o.video),Jm("chrome: "+JSON.stringify(o)),c(o)})}o.video=n(o.video)}return Jm("chrome: "+JSON.stringify(o)),c(o)},r=function(o){return e.version>=64?o:{name:{PermissionDeniedError:"NotAllowedError",PermissionDismissedError:"NotAllowedError",InvalidStateError:"NotAllowedError",DevicesNotFoundError:"NotFoundError",ConstraintNotSatisfiedError:"OverconstrainedError",TrackStartError:"NotReadableError",MediaDeviceFailedDueToShutdown:"NotAllowedError",MediaDeviceKillSwitchOn:"NotAllowedError",TabCaptureError:"AbortError",ScreenCaptureError:"AbortError",DeviceCaptureError:"AbortError"}[o.name]||o.name,message:o.message,constraint:o.constraint||o.constraintName,toString(){return this.name+(this.message&&": ")+this.message}}},a=function(o,c,l){s(o,h=>{t.webkitGetUserMedia(h,c,u=>{l&&l(r(u))})})};if(t.getUserMedia=a.bind(t),t.mediaDevices.getUserMedia){let o=t.mediaDevices.getUserMedia.bind(t.mediaDevices);t.mediaDevices.getUserMedia=function(c){return s(c,l=>o(l).then(h=>{if(l.audio&&!h.getAudioTracks().length||l.video&&!h.getVideoTracks().length)throw h.getTracks().forEach(u=>{u.stop()}),new DOMException("","NotFoundError");return h},h=>Promise.reject(r(h))))}}}function ad(i){i.MediaStream=i.MediaStream||i.webkitMediaStream}function od(i,e){if(!(e.version>102))if(typeof i=="object"&&i.RTCPeerConnection&&!("ontrack"in i.RTCPeerConnection.prototype)){Object.defineProperty(i.RTCPeerConnection.prototype,"ontrack",{get(){return this._ontrack},set(n){this._ontrack&&this.removeEventListener("track",this._ontrack),this.addEventListener("track",this._ontrack=n)},enumerable:!0,configurable:!0});let t=i.RTCPeerConnection.prototype.setRemoteDescription;i.RTCPeerConnection.prototype.setRemoteDescription=function(){return this._ontrackpoly||(this._ontrackpoly=s=>{s.stream.addEventListener("addtrack",r=>{let a;i.RTCPeerConnection.prototype.getReceivers?a=this.getReceivers().find(c=>c.track&&c.track.id===r.track.id):a={track:r.track};let o=new Event("track");o.track=r.track,o.receiver=a,o.transceiver={receiver:a},o.streams=[s.stream],this.dispatchEvent(o)}),s.stream.getTracks().forEach(r=>{let a;i.RTCPeerConnection.prototype.getReceivers?a=this.getReceivers().find(c=>c.track&&c.track.id===r.id):a={track:r};let o=new Event("track");o.track=r,o.receiver=a,o.transceiver={receiver:a},o.streams=[s.stream],this.dispatchEvent(o)})},this.addEventListener("addstream",this._ontrackpoly)),t.apply(this,arguments)}}else si(i,"track",t=>(t.transceiver||Object.defineProperty(t,"transceiver",{value:{receiver:t.receiver}}),t))}function cd(i){if(typeof i=="object"&&i.RTCPeerConnection&&!("getSenders"in i.RTCPeerConnection.prototype)&&"createDTMFSender"in i.RTCPeerConnection.prototype){let e=function(s,r){return{track:r,get dtmf(){return this._dtmf===void 0&&(r.kind==="audio"?this._dtmf=s.createDTMFSender(r):this._dtmf=null),this._dtmf},_pc:s}};if(!i.RTCPeerConnection.prototype.getSenders){i.RTCPeerConnection.prototype.getSenders=function(){return this._senders=this._senders||[],this._senders.slice()};let s=i.RTCPeerConnection.prototype.addTrack;i.RTCPeerConnection.prototype.addTrack=function(o,c){let l=s.apply(this,arguments);return l||(l=e(this,o),this._senders.push(l)),l};let r=i.RTCPeerConnection.prototype.removeTrack;i.RTCPeerConnection.prototype.removeTrack=function(o){r.apply(this,arguments);let c=this._senders.indexOf(o);c!==-1&&this._senders.splice(c,1)}}let t=i.RTCPeerConnection.prototype.addStream;i.RTCPeerConnection.prototype.addStream=function(r){this._senders=this._senders||[],t.apply(this,[r]),r.getTracks().forEach(a=>{this._senders.push(e(this,a))})};let n=i.RTCPeerConnection.prototype.removeStream;i.RTCPeerConnection.prototype.removeStream=function(r){this._senders=this._senders||[],n.apply(this,[r]),r.getTracks().forEach(a=>{let o=this._senders.find(c=>c.track===a);o&&this._senders.splice(this._senders.indexOf(o),1)})}}else if(typeof i=="object"&&i.RTCPeerConnection&&"getSenders"in i.RTCPeerConnection.prototype&&"createDTMFSender"in i.RTCPeerConnection.prototype&&i.RTCRtpSender&&!("dtmf"in i.RTCRtpSender.prototype)){let e=i.RTCPeerConnection.prototype.getSenders;i.RTCPeerConnection.prototype.getSenders=function(){let n=e.apply(this,[]);return n.forEach(s=>s._pc=this),n},Object.defineProperty(i.RTCRtpSender.prototype,"dtmf",{get(){return this._dtmf===void 0&&(this.track.kind==="audio"?this._dtmf=this._pc.createDTMFSender(this.track):this._dtmf=null),this._dtmf}})}}function ld(i,e){if(e.version>=67||!(typeof i=="object"&&i.RTCPeerConnection&&i.RTCRtpSender&&i.RTCRtpReceiver))return;if(!("getStats"in i.RTCRtpSender.prototype)){let n=i.RTCPeerConnection.prototype.getSenders;n&&(i.RTCPeerConnection.prototype.getSenders=function(){let a=n.apply(this,[]);return a.forEach(o=>o._pc=this),a});let s=i.RTCPeerConnection.prototype.addTrack;s&&(i.RTCPeerConnection.prototype.addTrack=function(){let a=s.apply(this,arguments);return a._pc=this,a}),i.RTCRtpSender.prototype.getStats=function(){let a=this;return this._pc.getStats().then(o=>rd(o,a.track,!0))}}if(!("getStats"in i.RTCRtpReceiver.prototype)){let n=i.RTCPeerConnection.prototype.getReceivers;n&&(i.RTCPeerConnection.prototype.getReceivers=function(){let r=n.apply(this,[]);return r.forEach(a=>a._pc=this),r}),si(i,"track",s=>(s.receiver._pc=s.srcElement,s)),i.RTCRtpReceiver.prototype.getStats=function(){let r=this;return this._pc.getStats().then(a=>rd(a,r.track,!1))}}if(!("getStats"in i.RTCRtpSender.prototype&&"getStats"in i.RTCRtpReceiver.prototype))return;let t=i.RTCPeerConnection.prototype.getStats;i.RTCPeerConnection.prototype.getStats=function(){if(arguments.length>0&&arguments[0]instanceof i.MediaStreamTrack){let s=arguments[0],r,a,o;return this.getSenders().forEach(c=>{c.track===s&&(r?o=!0:r=c)}),this.getReceivers().forEach(c=>(c.track===s&&(a?o=!0:a=c),c.track===s)),o||r&&a?Promise.reject(new DOMException("There are more than one sender or receiver for the track.","InvalidAccessError")):r?r.getStats():a?a.getStats():Promise.reject(new DOMException("There is no sender or receiver for the track.","InvalidAccessError"))}return t.apply(this,arguments)}}function Km(i){i.RTCPeerConnection.prototype.getLocalStreams=function(){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},Object.keys(this._shimmedLocalStreams).map(a=>this._shimmedLocalStreams[a][0])};let e=i.RTCPeerConnection.prototype.addTrack;i.RTCPeerConnection.prototype.addTrack=function(a,o){if(!o)return e.apply(this,arguments);this._shimmedLocalStreams=this._shimmedLocalStreams||{};let c=e.apply(this,arguments);return this._shimmedLocalStreams[o.id]?this._shimmedLocalStreams[o.id].indexOf(c)===-1&&this._shimmedLocalStreams[o.id].push(c):this._shimmedLocalStreams[o.id]=[o,c],c};let t=i.RTCPeerConnection.prototype.addStream;i.RTCPeerConnection.prototype.addStream=function(a){this._shimmedLocalStreams=this._shimmedLocalStreams||{},a.getTracks().forEach(l=>{if(this.getSenders().find(u=>u.track===l))throw new DOMException("Track already exists.","InvalidAccessError")});let o=this.getSenders();t.apply(this,arguments);let c=this.getSenders().filter(l=>o.indexOf(l)===-1);this._shimmedLocalStreams[a.id]=[a].concat(c)};let n=i.RTCPeerConnection.prototype.removeStream;i.RTCPeerConnection.prototype.removeStream=function(a){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},delete this._shimmedLocalStreams[a.id],n.apply(this,arguments)};let s=i.RTCPeerConnection.prototype.removeTrack;i.RTCPeerConnection.prototype.removeTrack=function(a){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},a&&Object.keys(this._shimmedLocalStreams).forEach(o=>{let c=this._shimmedLocalStreams[o].indexOf(a);c!==-1&&this._shimmedLocalStreams[o].splice(c,1),this._shimmedLocalStreams[o].length===1&&delete this._shimmedLocalStreams[o]}),s.apply(this,arguments)}}function hd(i,e){if(!i.RTCPeerConnection)return;if(i.RTCPeerConnection.prototype.addTrack&&e.version>=65)return Km(i);let t=i.RTCPeerConnection.prototype.getLocalStreams;i.RTCPeerConnection.prototype.getLocalStreams=function(){let h=t.apply(this);return this._reverseStreams=this._reverseStreams||{},h.map(u=>this._reverseStreams[u.id])};let n=i.RTCPeerConnection.prototype.addStream;i.RTCPeerConnection.prototype.addStream=function(h){if(this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{},h.getTracks().forEach(u=>{if(this.getSenders().find(f=>f.track===u))throw new DOMException("Track already exists.","InvalidAccessError")}),!this._reverseStreams[h.id]){let u=new i.MediaStream(h.getTracks());this._streams[h.id]=u,this._reverseStreams[u.id]=h,h=u}n.apply(this,[h])};let s=i.RTCPeerConnection.prototype.removeStream;i.RTCPeerConnection.prototype.removeStream=function(h){this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{},s.apply(this,[this._streams[h.id]||h]),delete this._reverseStreams[this._streams[h.id]?this._streams[h.id].id:h.id],delete this._streams[h.id]},i.RTCPeerConnection.prototype.addTrack=function(h,u){if(this.signalingState==="closed")throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.","InvalidStateError");let d=[].slice.call(arguments,1);if(d.length!==1||!d[0].getTracks().find(x=>x===h))throw new DOMException("The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.","NotSupportedError");if(this.getSenders().find(x=>x.track===h))throw new DOMException("Track already exists.","InvalidAccessError");this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{};let m=this._streams[u.id];if(m)m.addTrack(h),Promise.resolve().then(()=>{this.dispatchEvent(new Event("negotiationneeded"))});else{let x=new i.MediaStream([h]);this._streams[u.id]=x,this._reverseStreams[x.id]=u,this.addStream(x)}return this.getSenders().find(x=>x.track===h)};function r(l,h){let u=h.sdp;return Object.keys(l._reverseStreams||[]).forEach(d=>{let f=l._reverseStreams[d],m=l._streams[f.id];u=u.replace(new RegExp(m.id,"g"),f.id)}),new RTCSessionDescription({type:h.type,sdp:u})}function a(l,h){let u=h.sdp;return Object.keys(l._reverseStreams||[]).forEach(d=>{let f=l._reverseStreams[d],m=l._streams[f.id];u=u.replace(new RegExp(f.id,"g"),m.id)}),new RTCSessionDescription({type:h.type,sdp:u})}["createOffer","createAnswer"].forEach(function(l){let h=i.RTCPeerConnection.prototype[l],u={[l](){let d=arguments;return arguments.length&&typeof arguments[0]=="function"?h.apply(this,[m=>{let x=r(this,m);d[0].apply(null,[x])},m=>{d[1]&&d[1].apply(null,m)},arguments[2]]):h.apply(this,arguments).then(m=>r(this,m))}};i.RTCPeerConnection.prototype[l]=u[l]});let o=i.RTCPeerConnection.prototype.setLocalDescription;i.RTCPeerConnection.prototype.setLocalDescription=function(){return!arguments.length||!arguments[0].type?o.apply(this,arguments):(arguments[0]=a(this,arguments[0]),o.apply(this,arguments))};let c=Object.getOwnPropertyDescriptor(i.RTCPeerConnection.prototype,"localDescription");Object.defineProperty(i.RTCPeerConnection.prototype,"localDescription",{get(){let l=c.get.apply(this);return l.type===""?l:r(this,l)}}),i.RTCPeerConnection.prototype.removeTrack=function(h){if(this.signalingState==="closed")throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.","InvalidStateError");if(!h._pc)throw new DOMException("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.","TypeError");if(!(h._pc===this))throw new DOMException("Sender was not created by this connection.","InvalidAccessError");this._streams=this._streams||{};let d;Object.keys(this._streams).forEach(f=>{this._streams[f].getTracks().find(x=>h.track===x)&&(d=this._streams[f])}),d&&(d.getTracks().length===1?this.removeStream(this._reverseStreams[d.id]):d.removeTrack(h.track),this.dispatchEvent(new Event("negotiationneeded")))}}function kl(i,e){!i.RTCPeerConnection&&i.webkitRTCPeerConnection&&(i.RTCPeerConnection=i.webkitRTCPeerConnection),i.RTCPeerConnection&&e.version<53&&["setLocalDescription","setRemoteDescription","addIceCandidate"].forEach(function(t){let n=i.RTCPeerConnection.prototype[t],s={[t](){return arguments[0]=new(t==="addIceCandidate"?i.RTCIceCandidate:i.RTCSessionDescription)(arguments[0]),n.apply(this,arguments)}};i.RTCPeerConnection.prototype[t]=s[t]})}function ud(i,e){e.version>102||si(i,"negotiationneeded",t=>{let n=t.target;if(!((e.version<72||n.getConfiguration&&n.getConfiguration().sdpSemantics==="plan-b")&&n.signalingState!=="stable"))return t})}var Hl={};so(Hl,{shimAddTransceiver:()=>_d,shimCreateAnswer:()=>Md,shimCreateOffer:()=>vd,shimGetDisplayMedia:()=>jm,shimGetParameters:()=>yd,shimGetStats:()=>fd,shimGetUserMedia:()=>Bl,shimOnTrack:()=>dd,shimPeerConnection:()=>Vl,shimRTCDataChannel:()=>xd,shimReceiverGetStats:()=>md,shimRemoveStream:()=>gd,shimSenderGetStats:()=>pd});function Bl(i,e){let t=i&&i.navigator;if(!t.mediaDevices)return;let n=i&&i.MediaStreamTrack;if(t.getUserMedia=function(s,r,a){vr("navigator.getUserMedia","navigator.mediaDevices.getUserMedia"),t.mediaDevices.getUserMedia(s).then(r,a)},!(e.version>55&&"autoGainControl"in t.mediaDevices.getSupportedConstraints())){let s=function(a,o,c){o in a&&!(c in a)&&(a[c]=a[o],delete a[o])},r=t.mediaDevices.getUserMedia.bind(t.mediaDevices);if(t.mediaDevices.getUserMedia=function(a){return typeof a=="object"&&typeof a.audio=="object"&&(a=JSON.parse(JSON.stringify(a)),s(a.audio,"autoGainControl","mozAutoGainControl"),s(a.audio,"noiseSuppression","mozNoiseSuppression")),r(a)},n&&n.prototype.getSettings){let a=n.prototype.getSettings;n.prototype.getSettings=function(){let o=a.apply(this,arguments);return s(o,"mozAutoGainControl","autoGainControl"),s(o,"mozNoiseSuppression","noiseSuppression"),o}}if(n&&n.prototype.applyConstraints){let a=n.prototype.applyConstraints;n.prototype.applyConstraints=function(o){return this.kind==="audio"&&typeof o=="object"&&(o=JSON.parse(JSON.stringify(o)),s(o,"autoGainControl","mozAutoGainControl"),s(o,"noiseSuppression","mozNoiseSuppression")),a.apply(this,[o])}}}}function jm(i,e){i.navigator.mediaDevices&&(i.navigator.mediaDevices&&"getDisplayMedia"in i.navigator.mediaDevices||(i.navigator.mediaDevices.getDisplayMedia=function(n){if(!(n&&n.video)){let s=new DOMException("getDisplayMedia without video constraints is undefined");return s.name="NotFoundError",s.code=8,Promise.reject(s)}return n.video===!0?n.video={mediaSource:e}:n.video.mediaSource=e,i.navigator.mediaDevices.getUserMedia(n)}))}function dd(i){typeof i=="object"&&i.RTCTrackEvent&&"receiver"in i.RTCTrackEvent.prototype&&!("transceiver"in i.RTCTrackEvent.prototype)&&Object.defineProperty(i.RTCTrackEvent.prototype,"transceiver",{get(){return{receiver:this.receiver}}})}function Vl(i,e){typeof i!="object"||!(i.RTCPeerConnection||i.mozRTCPeerConnection)||(!i.RTCPeerConnection&&i.mozRTCPeerConnection&&(i.RTCPeerConnection=i.mozRTCPeerConnection),e.version<53&&["setLocalDescription","setRemoteDescription","addIceCandidate"].forEach(function(t){let n=i.RTCPeerConnection.prototype[t],s={[t](){return arguments[0]=new(t==="addIceCandidate"?i.RTCIceCandidate:i.RTCSessionDescription)(arguments[0]),n.apply(this,arguments)}};i.RTCPeerConnection.prototype[t]=s[t]}))}function fd(i,e){if(typeof i!="object"||!(i.RTCPeerConnection||i.mozRTCPeerConnection)||e.version>=151)return;let t={inboundrtp:"inbound-rtp",outboundrtp:"outbound-rtp",candidatepair:"candidate-pair",localcandidate:"local-candidate",remotecandidate:"remote-candidate"},n=i.RTCPeerConnection.prototype.getStats;i.RTCPeerConnection.prototype.getStats=function(){let[r,a,o]=arguments;return this.signalingState==="closed"?Promise.resolve(new Map):n.apply(this,[r||null]).then(c=>{if(e.version<53&&!a)try{c.forEach(l=>{l.type=t[l.type]||l.type})}catch(l){if(l.name!=="TypeError")throw l;c.forEach((h,u)=>{c.set(u,Object.assign({},h,{type:t[h.type]||h.type}))})}return c}).then(a,o)}}function pd(i){if(!(typeof i=="object"&&i.RTCPeerConnection&&i.RTCRtpSender)||i.RTCRtpSender&&"getStats"in i.RTCRtpSender.prototype)return;let e=i.RTCPeerConnection.prototype.getSenders;e&&(i.RTCPeerConnection.prototype.getSenders=function(){let s=e.apply(this,[]);return s.forEach(r=>r._pc=this),s});let t=i.RTCPeerConnection.prototype.addTrack;t&&(i.RTCPeerConnection.prototype.addTrack=function(){let s=t.apply(this,arguments);return s._pc=this,s}),i.RTCRtpSender.prototype.getStats=function(){return this.track?this._pc.getStats(this.track):Promise.resolve(new Map)}}function md(i){if(!(typeof i=="object"&&i.RTCPeerConnection&&i.RTCRtpSender)||i.RTCRtpSender&&"getStats"in i.RTCRtpReceiver.prototype)return;let e=i.RTCPeerConnection.prototype.getReceivers;e&&(i.RTCPeerConnection.prototype.getReceivers=function(){let n=e.apply(this,[]);return n.forEach(s=>s._pc=this),n}),si(i,"track",t=>(t.receiver._pc=t.srcElement,t)),i.RTCRtpReceiver.prototype.getStats=function(){return this._pc.getStats(this.track)}}function gd(i){!i.RTCPeerConnection||"removeStream"in i.RTCPeerConnection.prototype||(i.RTCPeerConnection.prototype.removeStream=function(t){vr("removeStream","removeTrack"),this.getSenders().forEach(n=>{n.track&&t.getTracks().includes(n.track)&&this.removeTrack(n)})})}function xd(i){i.DataChannel&&!i.RTCDataChannel&&(i.RTCDataChannel=i.DataChannel)}function _d(i,e){if(!(typeof i=="object"&&i.RTCPeerConnection)||e.version>=110)return;let t=i.RTCPeerConnection.prototype.addTransceiver;t&&(i.RTCPeerConnection.prototype.addTransceiver=function(){this.setParametersPromises=[];let s=arguments[1]&&arguments[1].sendEncodings;s===void 0&&(s=[]),s=[...s];let r=s.length>0;r&&s.forEach(o=>{if("rid"in o&&!/^[a-z0-9]{0,16}$/i.test(o.rid))throw new TypeError("Invalid RID value provided.");if("scaleResolutionDownBy"in o&&!(parseFloat(o.scaleResolutionDownBy)>=1))throw new RangeError("scale_resolution_down_by must be >= 1.0");if("maxFramerate"in o&&!(parseFloat(o.maxFramerate)>=0))throw new RangeError("max_framerate must be >= 0.0")});let a=t.apply(this,arguments);if(r){let{sender:o}=a,c=o.getParameters();(!("encodings"in c)||c.encodings.length===1&&Object.keys(c.encodings[0]).length===0)&&(c.encodings=s,o.sendEncodings=s,this.setParametersPromises.push(o.setParameters(c).then(()=>{delete o.sendEncodings}).catch(()=>{delete o.sendEncodings})))}return a})}function yd(i,e){if(!(typeof i=="object"&&i.RTCRtpSender)||e.version>=110)return;let t=i.RTCRtpSender.prototype.getParameters;t&&(i.RTCRtpSender.prototype.getParameters=function(){let s=t.apply(this,arguments);return"encodings"in s||(s.encodings=[].concat(this.sendEncodings||[{}])),s})}function vd(i,e){if(!(typeof i=="object"&&i.RTCPeerConnection)||e.version>=110)return;let t=i.RTCPeerConnection.prototype.createOffer;i.RTCPeerConnection.prototype.createOffer=function(){return this.setParametersPromises&&this.setParametersPromises.length?Promise.all(this.setParametersPromises).then(()=>t.apply(this,arguments)).finally(()=>{this.setParametersPromises=[]}):t.apply(this,arguments)}}function Md(i,e){if(!(typeof i=="object"&&i.RTCPeerConnection)||e.version>=110)return;let t=i.RTCPeerConnection.prototype.createAnswer;i.RTCPeerConnection.prototype.createAnswer=function(){return this.setParametersPromises&&this.setParametersPromises.length?Promise.all(this.setParametersPromises).then(()=>t.apply(this,arguments)).finally(()=>{this.setParametersPromises=[]}):t.apply(this,arguments)}}var Gl={};so(Gl,{shimAudioContext:()=>Rd,shimCallbacksAPI:()=>Td,shimConstraints:()=>Qm,shimCreateOfferLegacy:()=>Cd,shimGetUserMedia:()=>Ed,shimLocalStreamsAPI:()=>bd,shimRTCIceServerUrls:()=>wd,shimRemoteStreamsAPI:()=>Sd,shimTrackEventTransceiver:()=>Ad});function bd(i){if(!(typeof i!="object"||!i.RTCPeerConnection)){if("getLocalStreams"in i.RTCPeerConnection.prototype||(i.RTCPeerConnection.prototype.getLocalStreams=function(){return this._localStreams||(this._localStreams=[]),this._localStreams}),!("addStream"in i.RTCPeerConnection.prototype)){let e=i.RTCPeerConnection.prototype.addTrack;i.RTCPeerConnection.prototype.addStream=function(n){this._localStreams||(this._localStreams=[]),this._localStreams.includes(n)||this._localStreams.push(n),n.getAudioTracks().forEach(s=>e.call(this,s,n)),n.getVideoTracks().forEach(s=>e.call(this,s,n))},i.RTCPeerConnection.prototype.addTrack=function(n,...s){return s&&s.forEach(r=>{this._localStreams?this._localStreams.includes(r)||this._localStreams.push(r):this._localStreams=[r]}),e.apply(this,arguments)}}"removeStream"in i.RTCPeerConnection.prototype||(i.RTCPeerConnection.prototype.removeStream=function(t){this._localStreams||(this._localStreams=[]);let n=this._localStreams.indexOf(t);if(n===-1)return;this._localStreams.splice(n,1);let s=t.getTracks();this.getSenders().forEach(r=>{s.includes(r.track)&&this.removeTrack(r)})})}}function Sd(i){if(!(typeof i!="object"||!i.RTCPeerConnection)&&("getRemoteStreams"in i.RTCPeerConnection.prototype||(i.RTCPeerConnection.prototype.getRemoteStreams=function(){return this._remoteStreams?this._remoteStreams:[]}),!("onaddstream"in i.RTCPeerConnection.prototype))){Object.defineProperty(i.RTCPeerConnection.prototype,"onaddstream",{get(){return this._onaddstream},set(t){this._onaddstream&&(this.removeEventListener("addstream",this._onaddstream),this.removeEventListener("track",this._onaddstreampoly)),this.addEventListener("addstream",this._onaddstream=t),this.addEventListener("track",this._onaddstreampoly=n=>{n.streams.forEach(s=>{if(this._remoteStreams||(this._remoteStreams=[]),this._remoteStreams.includes(s))return;this._remoteStreams.push(s);let r=new Event("addstream");r.stream=s,this.dispatchEvent(r)})})}});let e=i.RTCPeerConnection.prototype.setRemoteDescription;i.RTCPeerConnection.prototype.setRemoteDescription=function(){let n=this;return this._onaddstreampoly||this.addEventListener("track",this._onaddstreampoly=function(s){s.streams.forEach(r=>{if(n._remoteStreams||(n._remoteStreams=[]),n._remoteStreams.indexOf(r)>=0)return;n._remoteStreams.push(r);let a=new Event("addstream");a.stream=r,n.dispatchEvent(a)})}),e.apply(n,arguments)}}}function Td(i){if(typeof i!="object"||!i.RTCPeerConnection)return;let e=i.RTCPeerConnection.prototype,t=e.createOffer,n=e.createAnswer,s=e.setLocalDescription,r=e.setRemoteDescription,a=e.addIceCandidate;e.createOffer=function(l,h){let u=arguments.length>=2?arguments[2]:arguments[0],d=t.apply(this,[u]);return h?(d.then(l,h),Promise.resolve()):d},e.createAnswer=function(l,h){let u=arguments.length>=2?arguments[2]:arguments[0],d=n.apply(this,[u]);return h?(d.then(l,h),Promise.resolve()):d};let o=function(c,l,h){let u=s.apply(this,[c]);return h?(u.then(l,h),Promise.resolve()):u};e.setLocalDescription=o,o=function(c,l,h){let u=r.apply(this,[c]);return h?(u.then(l,h),Promise.resolve()):u},e.setRemoteDescription=o,o=function(c,l,h){let u=a.apply(this,[c]);return h?(u.then(l,h),Promise.resolve()):u},e.addIceCandidate=o}function Ed(i){let e=i&&i.navigator;if(e.mediaDevices&&e.mediaDevices.getUserMedia){let t=e.mediaDevices,n=t.getUserMedia.bind(t);e.mediaDevices.getUserMedia=s=>n(Qm(s))}!e.getUserMedia&&e.mediaDevices&&e.mediaDevices.getUserMedia&&(e.getUserMedia=function(n,s,r){e.mediaDevices.getUserMedia(n).then(s,r)}.bind(e))}function Qm(i){return i&&i.video!==void 0?Object.assign({},i,{video:sd(i.video)}):i}function wd(i){if(!i.RTCPeerConnection)return;let e=i.RTCPeerConnection;i.RTCPeerConnection=function(n,s){if(n&&n.iceServers){let r=[];for(let a=0;a<n.iceServers.length;a++){let o=n.iceServers[a];o.urls===void 0&&o.url?(vr("RTCIceServer.url","RTCIceServer.urls"),o=JSON.parse(JSON.stringify(o)),o.urls=o.url,delete o.url,r.push(o)):r.push(n.iceServers[a])}n.iceServers=r}return new e(n,s)},i.RTCPeerConnection.prototype=e.prototype,"generateCertificate"in e&&Object.defineProperty(i.RTCPeerConnection,"generateCertificate",{get(){return e.generateCertificate}})}function Ad(i){typeof i=="object"&&i.RTCTrackEvent&&"receiver"in i.RTCTrackEvent.prototype&&!("transceiver"in i.RTCTrackEvent.prototype)&&Object.defineProperty(i.RTCTrackEvent.prototype,"transceiver",{get(){return{receiver:this.receiver}}})}function Cd(i){let e=i.RTCPeerConnection.prototype.createOffer;i.RTCPeerConnection.prototype.createOffer=function(n){if(n){typeof n.offerToReceiveAudio<"u"&&(n.offerToReceiveAudio=!!n.offerToReceiveAudio);let s=this.getTransceivers().find(a=>a.receiver.track.kind==="audio");n.offerToReceiveAudio===!1&&s?s.direction==="sendrecv"?s.setDirection?s.setDirection("sendonly"):s.direction="sendonly":s.direction==="recvonly"&&(s.setDirection?s.setDirection("inactive"):s.direction="inactive"):n.offerToReceiveAudio===!0&&!s&&this.addTransceiver("audio",{direction:"recvonly"}),typeof n.offerToReceiveVideo<"u"&&(n.offerToReceiveVideo=!!n.offerToReceiveVideo);let r=this.getTransceivers().find(a=>a.receiver.track.kind==="video");n.offerToReceiveVideo===!1&&r?r.direction==="sendrecv"?r.setDirection?r.setDirection("sendonly"):r.direction="sendonly":r.direction==="recvonly"&&(r.setDirection?r.setDirection("inactive"):r.direction="inactive"):n.offerToReceiveVideo===!0&&!r&&this.addTransceiver("video",{direction:"recvonly"})}return e.apply(this,arguments)}}function Rd(i){typeof i!="object"||i.AudioContext||(i.AudioContext=i.webkitAudioContext)}var Ld={};so(Ld,{removeExtmapAllowMixed:()=>ql,shimAddIceCandidateNullOrEmpty:()=>Xa,shimConnectionState:()=>Xl,shimMaxMessageSize:()=>Ga,shimParameterlessSetLocalDescription:()=>qa,shimRTCIceCandidate:()=>Ha,shimRTCIceCandidateRelayProtocol:()=>Wl,shimSendThrowTypeError:()=>Wa});var Mr=Af(Id());function Ha(i){if(!i.RTCIceCandidate||i.RTCIceCandidate&&"foundation"in i.RTCIceCandidate.prototype)return;let e=i.RTCIceCandidate;i.RTCIceCandidate=function(n){if(typeof n=="object"&&n.candidate&&n.candidate.indexOf("a=")===0&&(n=JSON.parse(JSON.stringify(n)),n.candidate=n.candidate.substring(2)),n.candidate&&n.candidate.length){let s=new e(n),r=Mr.default.parseCandidate(n.candidate);for(let a in r)a in s||Object.defineProperty(s,a,{value:r[a]});return s.toJSON=function(){return{candidate:s.candidate,sdpMid:s.sdpMid,sdpMLineIndex:s.sdpMLineIndex,usernameFragment:s.usernameFragment}},s}return new e(n)},i.RTCIceCandidate.prototype=e.prototype,si(i,"icecandidate",t=>(t.candidate&&Object.defineProperty(t,"candidate",{value:new i.RTCIceCandidate(t.candidate),writable:"false"}),t))}function Wl(i){!i.RTCIceCandidate||i.RTCIceCandidate&&"relayProtocol"in i.RTCIceCandidate.prototype||si(i,"icecandidate",e=>{if(e.candidate){let t=Mr.default.parseCandidate(e.candidate.candidate);t.type==="relay"&&(e.candidate.relayProtocol={0:"tls",1:"tcp",2:"udp"}[t.priority>>24])}return e})}function Ga(i,e){if(!i.RTCPeerConnection||e.browser==="chrome"&&e.version>102||e.browser==="firefox"&&e.version>=113)return;"sctp"in i.RTCPeerConnection.prototype||Object.defineProperty(i.RTCPeerConnection.prototype,"sctp",{get(){return typeof this._sctp>"u"?null:this._sctp}});let t=function(o){if(!o||!o.sdp)return!1;let c=Mr.default.splitSections(o.sdp);return c.shift(),c.some(l=>{let h=Mr.default.parseMLine(l);return h&&h.kind==="application"&&h.protocol.indexOf("SCTP")!==-1})},n=function(o){let c=o.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);if(c===null||c.length<2)return-1;let l=parseInt(c[1],10);return l!==l?-1:l},s=function(o){let c=65536;return e.browser==="firefox"&&(e.version<57?o===-1?c=16384:c=2147483637:e.version<60?c=e.version===57?65535:65536:c=2147483637),c},r=function(o,c){let l=65536;e.browser==="firefox"&&e.version===57&&(l=65535);let h=Mr.default.matchPrefix(o.sdp,"a=max-message-size:");return h.length>0?l=parseInt(h[0].substring(19),10):e.browser==="firefox"&&c!==-1&&(l=2147483637),l},a=i.RTCPeerConnection.prototype.setRemoteDescription;i.RTCPeerConnection.prototype.setRemoteDescription=function(){if(this._sctp=null,e.browser==="chrome"&&e.version>=76){let{sdpSemantics:c}=this.getConfiguration();c==="plan-b"&&Object.defineProperty(this,"sctp",{get(){return typeof this._sctp>"u"?null:this._sctp},enumerable:!0,configurable:!0})}if(t(arguments[0])){let c=n(arguments[0]),l=s(c),h=r(arguments[0],c),u;l===0&&h===0?u=Number.POSITIVE_INFINITY:l===0||h===0?u=Math.max(l,h):u=Math.min(l,h);let d={};Object.defineProperty(d,"maxMessageSize",{get(){return u}}),this._sctp=d}return a.apply(this,arguments)}}function Wa(i,e){if(!(i.RTCPeerConnection&&"createDataChannel"in i.RTCPeerConnection.prototype)||e.browser==="chrome"&&e.version>=149||e.browser==="firefox"&&e.version>60)return;function t(s,r){let a=s.send;s.send=function(){let c=arguments[0],l=c.length||c.size||c.byteLength;if(s.readyState==="open"&&r.sctp&&l>r.sctp.maxMessageSize)throw new TypeError("Message too large (can send a maximum of "+r.sctp.maxMessageSize+" bytes)");return a.apply(s,arguments)}}let n=i.RTCPeerConnection.prototype.createDataChannel;i.RTCPeerConnection.prototype.createDataChannel=function(){let r=n.apply(this,arguments);return t(r,this),r},si(i,"datachannel",s=>(t(s.channel,s.target),s))}function Xl(i){if(!i.RTCPeerConnection||"connectionState"in i.RTCPeerConnection.prototype)return;let e=i.RTCPeerConnection.prototype;Object.defineProperty(e,"connectionState",{get(){return{completed:"connected",checking:"connecting"}[this.iceConnectionState]||this.iceConnectionState},enumerable:!0,configurable:!0}),Object.defineProperty(e,"onconnectionstatechange",{get(){return this._onconnectionstatechange||null},set(t){this._onconnectionstatechange&&(this.removeEventListener("connectionstatechange",this._onconnectionstatechange),delete this._onconnectionstatechange),t&&this.addEventListener("connectionstatechange",this._onconnectionstatechange=t)},enumerable:!0,configurable:!0}),["setLocalDescription","setRemoteDescription"].forEach(t=>{let n=e[t];e[t]=function(){return this._connectionstatechangepoly||(this._connectionstatechangepoly=s=>{let r=s.target;if(r._lastConnectionState!==r.connectionState){r._lastConnectionState=r.connectionState;let a=new Event("connectionstatechange",s);r.dispatchEvent(a)}return s},this.addEventListener("iceconnectionstatechange",this._connectionstatechangepoly)),n.apply(this,arguments)}})}function ql(i,e){if(!i.RTCPeerConnection||e.browser==="chrome"&&e.version>=71||e.browser==="safari"&&e._safariVersion>=13.1)return;let t=i.RTCPeerConnection.prototype.setRemoteDescription;i.RTCPeerConnection.prototype.setRemoteDescription=function(s){if(s&&s.sdp&&s.sdp.indexOf(`
a=extmap-allow-mixed`)!==-1){let r=s.sdp.split(`
`).filter(a=>a.trim()!=="a=extmap-allow-mixed").join(`
`);i.RTCSessionDescription&&s instanceof i.RTCSessionDescription?arguments[0]=new i.RTCSessionDescription({type:s.type,sdp:r}):s.sdp=r}return t.apply(this,arguments)}}function Xa(i,e){if(!(i.RTCPeerConnection&&i.RTCPeerConnection.prototype))return;let t=i.RTCPeerConnection.prototype.addIceCandidate;!t||t.length===0||(i.RTCPeerConnection.prototype.addIceCandidate=function(){return arguments[0]?(e.browser==="chrome"&&e.version<78||e.browser==="firefox"&&e.version<68||e.browser==="safari")&&arguments[0]&&arguments[0].candidate===""?Promise.resolve():t.apply(this,arguments):(arguments[1]&&arguments[1].apply(null),Promise.resolve())})}function qa(i,e){if(!(i.RTCPeerConnection&&i.RTCPeerConnection.prototype))return;let t=i.RTCPeerConnection.prototype.setLocalDescription;!t||t.length===0||(i.RTCPeerConnection.prototype.setLocalDescription=function(){let s=arguments[0]||{};if(typeof s!="object"||s.type&&s.sdp)return t.apply(this,arguments);if(s={type:s.type,sdp:s.sdp},!s.type)switch(this.signalingState){case"stable":case"have-local-offer":case"have-remote-pranswer":s.type="offer";break;default:s.type="answer";break}return s.sdp||s.type!=="offer"&&s.type!=="answer"?t.apply(this,[s]):(s.type==="offer"?this.createOffer:this.createAnswer).apply(this).then(a=>t.apply(this,[a]))})}var yb=Af(Id());function e0({window:i}={},e={shimChrome:!0,shimFirefox:!0,shimSafari:!0}){let t=Va,n=Zm(i),s={browserDetails:n,commonShim:Ld,extractVersion:yr,disableLog:Ym,disableWarnings:$m,sdp:yb};switch(n.browser){case"chrome":if(!zl||!kl||!e.shimChrome)return t("Chrome shim is not included in this adapter release."),s;if(n.version===null)return t("Chrome shim can not determine version, not shimming."),s;t("adapter.js shimming chrome."),s.browserShim=zl,Xa(i,n),qa(i,n),Fl(i,n),ad(i,n),kl(i,n),od(i,n),hd(i,n),cd(i,n),ld(i,n),ud(i,n),Ha(i,n),Wl(i,n),Xl(i,n),Ga(i,n),Wa(i,n),ql(i,n);break;case"firefox":if(!Hl||!Vl||!e.shimFirefox)return t("Firefox shim is not included in this adapter release."),s;t("adapter.js shimming firefox."),s.browserShim=Hl,Xa(i,n),qa(i,n),Bl(i,n),Vl(i,n),fd(i,n),dd(i,n),gd(i,n),pd(i,n),md(i,n),xd(i,n),_d(i,n),yd(i,n),vd(i,n),Md(i,n),Ha(i,n),Xl(i,n),Ga(i,n),Wa(i,n);break;case"safari":if(!Gl||!e.shimSafari)return t("Safari shim is not included in this adapter release."),s;t("adapter.js shimming safari."),s.browserShim=Gl,Xa(i,n),qa(i,n),wd(i,n),Cd(i,n),Td(i,n),bd(i,n),Sd(i,n),Ad(i,n),Ed(i,n),Rd(i,n),Ha(i,n),Wl(i,n),Ga(i,n),Wa(i,n),ql(i,n);break;default:t("Unsupported browser!");break}return s}var vb=e0({window:typeof window>"u"?void 0:window}),Dd=vb;function ys(i,e,t,n){Object.defineProperty(i,e,{get:t,set:n,enumerable:!0,configurable:!0})}var $l=class{constructor(){this.chunkedMTU=16300,this._dataCount=1,this.chunk=e=>{let t=[],n=e.byteLength,s=Math.ceil(n/this.chunkedMTU),r=0,a=0;for(;a<n;){let o=Math.min(n,a+this.chunkedMTU),c=e.slice(a,o),l={__peerData:this._dataCount,n:r,data:c,total:s};t.push(l),a=o,r++}return this._dataCount++,t}}};function Mb(i){let e=0;for(let s of i)e+=s.byteLength;let t=new Uint8Array(e),n=0;for(let s of i)t.set(s,n),n+=s.byteLength;return t}var Nd=Dd.default||Dd,Ya=new class{isWebRTCSupported(){return typeof RTCPeerConnection<"u"}isBrowserSupported(){let i=this.getBrowser(),e=this.getVersion();return this.supportedBrowsers.includes(i)?i==="chrome"?e>=this.minChromeVersion:i==="firefox"?e>=this.minFirefoxVersion:i==="safari"?!this.isIOS&&e>=this.minSafariVersion:!1:!1}getBrowser(){return Nd.browserDetails.browser}getVersion(){return Nd.browserDetails.version||0}isUnifiedPlanSupported(){let i=this.getBrowser(),e=Nd.browserDetails.version||0;if(i==="chrome"&&e<this.minChromeVersion)return!1;if(i==="firefox"&&e>=this.minFirefoxVersion)return!0;if(!window.RTCRtpTransceiver||!("currentDirection"in RTCRtpTransceiver.prototype))return!1;let t,n=!1;try{t=new RTCPeerConnection,t.addTransceiver("audio"),n=!0}catch{}finally{t&&t.close()}return n}toString(){return`Supports:
    browser:${this.getBrowser()}
    version:${this.getVersion()}
    isIOS:${this.isIOS}
    isWebRTCSupported:${this.isWebRTCSupported()}
    isBrowserSupported:${this.isBrowserSupported()}
    isUnifiedPlanSupported:${this.isUnifiedPlanSupported()}`}constructor(){this.isIOS=typeof navigator<"u"?["iPad","iPhone","iPod"].includes(navigator.platform):!1,this.supportedBrowsers=["firefox","chrome","safari"],this.minFirefoxVersion=59,this.minChromeVersion=72,this.minSafariVersion=605}},bb=i=>!i||/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.test(i),n0=()=>Math.random().toString(36).slice(2),t0={iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:["turn:eu-0.turn.peerjs.com:3478","turn:us-0.turn.peerjs.com:3478"],username:"peerjs",credential:"peerjsp"}],sdpSemantics:"unified-plan"},Ud=class extends $l{noop(){}blobToArrayBuffer(e,t){let n=new FileReader;return n.onload=function(s){s.target&&t(s.target.result)},n.readAsArrayBuffer(e),n}binaryStringToArrayBuffer(e){let t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n)&255;return t.buffer}isSecure(){return location.protocol==="https:"}constructor(...e){super(...e),this.CLOUD_HOST="0.peerjs.com",this.CLOUD_PORT=443,this.chunkedBrowsers={Chrome:1,chrome:1},this.defaultConfig=t0,this.browser=Ya.getBrowser(),this.browserVersion=Ya.getVersion(),this.pack=nd,this.unpack=td,this.supports=(function(){let t={browser:Ya.isBrowserSupported(),webRTC:Ya.isWebRTCSupported(),audioVideo:!1,data:!1,binaryBlob:!1,reliable:!1};if(!t.webRTC)return t;let n;try{n=new RTCPeerConnection(t0),t.audioVideo=!0;let s;try{s=n.createDataChannel("_PEERJSTEST",{ordered:!0}),t.data=!0,t.reliable=!!s.ordered;try{s.binaryType="blob",t.binaryBlob=!Ya.isIOS}catch{}}catch{}finally{s&&s.close()}}catch{}finally{n&&n.close()}return t})(),this.validateId=bb,this.randomToken=n0}},mn=new Ud,Sb="PeerJS: ";var Od=class{get logLevel(){return this._logLevel}set logLevel(e){this._logLevel=e}log(...e){this._logLevel>=3&&this._print(3,...e)}warn(...e){this._logLevel>=2&&this._print(2,...e)}error(...e){this._logLevel>=1&&this._print(1,...e)}setLogFunction(e){this._print=e}_print(e,...t){let n=[Sb,...t];for(let s in n)n[s]instanceof Error&&(n[s]="("+n[s].name+") "+n[s].message);e>=3?console.log(...n):e>=2?console.warn("WARNING",...n):e>=1&&console.error("ERROR",...n)}constructor(){this._logLevel=0}},Pe=new Od,Yd={},Tb=Object.prototype.hasOwnProperty,dn="~";function Ka(){}Object.create&&(Ka.prototype=Object.create(null),new Ka().__proto__||(dn=!1));function Eb(i,e,t){this.fn=i,this.context=e,this.once=t||!1}function i0(i,e,t,n,s){if(typeof t!="function")throw new TypeError("The listener must be a function");var r=new Eb(t,n||i,s),a=dn?dn+e:e;return i._events[a]?i._events[a].fn?i._events[a]=[i._events[a],r]:i._events[a].push(r):(i._events[a]=r,i._eventsCount++),i}function Yl(i,e){--i._eventsCount===0?i._events=new Ka:delete i._events[e]}function on(){this._events=new Ka,this._eventsCount=0}on.prototype.eventNames=function(){var e=[],t,n;if(this._eventsCount===0)return e;for(n in t=this._events)Tb.call(t,n)&&e.push(dn?n.slice(1):n);return Object.getOwnPropertySymbols?e.concat(Object.getOwnPropertySymbols(t)):e};on.prototype.listeners=function(e){var t=dn?dn+e:e,n=this._events[t];if(!n)return[];if(n.fn)return[n.fn];for(var s=0,r=n.length,a=new Array(r);s<r;s++)a[s]=n[s].fn;return a};on.prototype.listenerCount=function(e){var t=dn?dn+e:e,n=this._events[t];return n?n.fn?1:n.length:0};on.prototype.emit=function(e,t,n,s,r,a){var o=dn?dn+e:e;if(!this._events[o])return!1;var c=this._events[o],l=arguments.length,h,u;if(c.fn){switch(c.once&&this.removeListener(e,c.fn,void 0,!0),l){case 1:return c.fn.call(c.context),!0;case 2:return c.fn.call(c.context,t),!0;case 3:return c.fn.call(c.context,t,n),!0;case 4:return c.fn.call(c.context,t,n,s),!0;case 5:return c.fn.call(c.context,t,n,s,r),!0;case 6:return c.fn.call(c.context,t,n,s,r,a),!0}for(u=1,h=new Array(l-1);u<l;u++)h[u-1]=arguments[u];c.fn.apply(c.context,h)}else{var d=c.length,f;for(u=0;u<d;u++)switch(c[u].once&&this.removeListener(e,c[u].fn,void 0,!0),l){case 1:c[u].fn.call(c[u].context);break;case 2:c[u].fn.call(c[u].context,t);break;case 3:c[u].fn.call(c[u].context,t,n);break;case 4:c[u].fn.call(c[u].context,t,n,s);break;default:if(!h)for(f=1,h=new Array(l-1);f<l;f++)h[f-1]=arguments[f];c[u].fn.apply(c[u].context,h)}}return!0};on.prototype.on=function(e,t,n){return i0(this,e,t,n,!1)};on.prototype.once=function(e,t,n){return i0(this,e,t,n,!0)};on.prototype.removeListener=function(e,t,n,s){var r=dn?dn+e:e;if(!this._events[r])return this;if(!t)return Yl(this,r),this;var a=this._events[r];if(a.fn)a.fn===t&&(!s||a.once)&&(!n||a.context===n)&&Yl(this,r);else{for(var o=0,c=[],l=a.length;o<l;o++)(a[o].fn!==t||s&&!a[o].once||n&&a[o].context!==n)&&c.push(a[o]);c.length?this._events[r]=c.length===1?c[0]:c:Yl(this,r)}return this};on.prototype.removeAllListeners=function(e){var t;return e?(t=dn?dn+e:e,this._events[t]&&Yl(this,t)):(this._events=new Ka,this._eventsCount=0),this};on.prototype.off=on.prototype.removeListener;on.prototype.addListener=on.prototype.on;on.prefixed=dn;on.EventEmitter=on;Yd=on;var vs={};ys(vs,"ConnectionType",()=>Gi);ys(vs,"PeerErrorType",()=>Vt);ys(vs,"BaseConnectionErrorType",()=>Fd);ys(vs,"DataConnectionErrorType",()=>$d);ys(vs,"SerializationType",()=>eh);ys(vs,"SocketEventType",()=>Hi);ys(vs,"ServerMessageType",()=>an);var Gi=(function(i){return i.Data="data",i.Media="media",i})({}),Vt=(function(i){return i.BrowserIncompatible="browser-incompatible",i.Disconnected="disconnected",i.InvalidID="invalid-id",i.InvalidKey="invalid-key",i.Network="network",i.PeerUnavailable="peer-unavailable",i.SslUnavailable="ssl-unavailable",i.ServerError="server-error",i.SocketError="socket-error",i.SocketClosed="socket-closed",i.UnavailableID="unavailable-id",i.WebRTC="webrtc",i})({}),Fd=(function(i){return i.NegotiationFailed="negotiation-failed",i.ConnectionClosed="connection-closed",i})({}),$d=(function(i){return i.NotOpenYet="not-open-yet",i.MessageToBig="message-too-big",i})({}),eh=(function(i){return i.Binary="binary",i.BinaryUTF8="binary-utf8",i.JSON="json",i.None="raw",i})({}),Hi=(function(i){return i.Message="message",i.Disconnected="disconnected",i.Error="error",i.Close="close",i})({}),an=(function(i){return i.Heartbeat="HEARTBEAT",i.Candidate="CANDIDATE",i.Offer="OFFER",i.Answer="ANSWER",i.Open="OPEN",i.Error="ERROR",i.IdTaken="ID-TAKEN",i.InvalidKey="INVALID-KEY",i.Leave="LEAVE",i.Expire="EXPIRE",i})({}),s0="1.5.5",kd=class extends Yd.EventEmitter{constructor(e,t,n,s,r,a=5e3){super(),this.pingInterval=a,this._disconnected=!0,this._messagesQueue=[];let o=e?"wss://":"ws://";this._baseUrl=o+t+":"+n+s+"peerjs?key="+r}start(e,t){this._id=e;let n=`${this._baseUrl}&id=${e}&token=${t}`;this._socket||!this._disconnected||(this._socket=new WebSocket(n+"&version="+s0),this._disconnected=!1,this._socket.onmessage=s=>{let r;try{r=JSON.parse(s.data),Pe.log("Server message received:",r)}catch{Pe.log("Invalid server message",s.data);return}this.emit(Hi.Message,r)},this._socket.onclose=s=>{this._disconnected||(Pe.log("Socket closed.",s),this._cleanup(),this._disconnected=!0,this.emit(Hi.Disconnected))},this._socket.onopen=()=>{this._disconnected||(this._sendQueuedMessages(),Pe.log("Socket open"),this._scheduleHeartbeat())})}_scheduleHeartbeat(){this._wsPingTimer=setTimeout(()=>{this._sendHeartbeat()},this.pingInterval)}_sendHeartbeat(){if(!this._wsOpen()){Pe.log("Cannot send heartbeat, because socket closed");return}let e=JSON.stringify({type:an.Heartbeat});this._socket.send(e),this._scheduleHeartbeat()}_wsOpen(){return!!this._socket&&this._socket.readyState===1}_sendQueuedMessages(){let e=[...this._messagesQueue];this._messagesQueue=[];for(let t of e)this.send(t)}send(e){if(this._disconnected)return;if(!this._id){this._messagesQueue.push(e);return}if(!e.type){this.emit(Hi.Error,"Invalid message");return}if(!this._wsOpen())return;let t=JSON.stringify(e);this._socket.send(t)}close(){this._disconnected||(this._cleanup(),this._disconnected=!0)}_cleanup(){this._socket&&(this._socket.onopen=this._socket.onmessage=this._socket.onclose=null,this._socket.close(),this._socket=void 0),clearTimeout(this._wsPingTimer)}},Zl=class{constructor(e){this.connection=e}startConnection(e){let t=this._startPeerConnection();if(this.connection.peerConnection=t,this.connection.type===Gi.Media&&e._stream&&this._addTracksToConnection(e._stream,t),e.originator){let n=this.connection,s={ordered:!!e.reliable},r=t.createDataChannel(n.label,s);n._initializeDataChannel(r),this._makeOffer()}else this.handleSDP("OFFER",e.sdp)}_startPeerConnection(){Pe.log("Creating RTCPeerConnection.");let e=new RTCPeerConnection(this.connection.provider.options.config);return this._setupListeners(e),e}_setupListeners(e){let t=this.connection.peer,n=this.connection.connectionId,s=this.connection.type,r=this.connection.provider;Pe.log("Listening for ICE candidates."),e.onicecandidate=a=>{!a.candidate||!a.candidate.candidate||(Pe.log(`Received ICE candidates for ${t}:`,a.candidate),r.socket.send({type:an.Candidate,payload:{candidate:a.candidate,type:s,connectionId:n},dst:t}))},e.oniceconnectionstatechange=()=>{switch(e.iceConnectionState){case"failed":Pe.log("iceConnectionState is failed, closing connections to "+t),this.connection.emitError(Fd.NegotiationFailed,"Negotiation of connection to "+t+" failed."),this.connection.close();break;case"closed":Pe.log("iceConnectionState is closed, closing connections to "+t),this.connection.emitError(Fd.ConnectionClosed,"Connection to "+t+" closed."),this.connection.close();break;case"disconnected":Pe.log("iceConnectionState changed to disconnected on the connection with "+t);break;case"completed":e.onicecandidate=()=>{};break}this.connection.emit("iceStateChanged",e.iceConnectionState)},Pe.log("Listening for data channel"),e.ondatachannel=a=>{Pe.log("Received data channel");let o=a.channel;r.getConnection(t,n)._initializeDataChannel(o)},Pe.log("Listening for remote stream"),e.ontrack=a=>{Pe.log("Received remote stream");let o=a.streams[0],c=r.getConnection(t,n);if(c.type===Gi.Media){let l=c;this._addStreamToMediaConnection(o,l)}}}cleanup(){Pe.log("Cleaning up PeerConnection to "+this.connection.peer);let e=this.connection.peerConnection;if(!e)return;this.connection.peerConnection=null,e.onicecandidate=e.oniceconnectionstatechange=e.ondatachannel=e.ontrack=()=>{};let t=e.signalingState!=="closed",n=!1,s=this.connection.dataChannel;s&&(n=!!s.readyState&&s.readyState!=="closed"),(t||n)&&e.close()}async _makeOffer(){let e=this.connection.peerConnection,t=this.connection.provider;try{let n=await e.createOffer(this.connection.options.constraints);Pe.log("Created offer."),this.connection.options.sdpTransform&&typeof this.connection.options.sdpTransform=="function"&&(n.sdp=this.connection.options.sdpTransform(n.sdp)||n.sdp);try{await e.setLocalDescription(n),Pe.log("Set localDescription:",n,`for:${this.connection.peer}`);let s={sdp:n,type:this.connection.type,connectionId:this.connection.connectionId,metadata:this.connection.metadata};if(this.connection.type===Gi.Data){let r=this.connection;s={...s,label:r.label,reliable:r.reliable,serialization:r.serialization}}t.socket.send({type:an.Offer,payload:s,dst:this.connection.peer})}catch(s){s!="OperationError: Failed to set local offer sdp: Called in wrong state: kHaveRemoteOffer"&&(t.emitError(Vt.WebRTC,s),Pe.log("Failed to setLocalDescription, ",s))}}catch(n){t.emitError(Vt.WebRTC,n),Pe.log("Failed to createOffer, ",n)}}async _makeAnswer(){let e=this.connection.peerConnection,t=this.connection.provider;try{let n=await e.createAnswer();Pe.log("Created answer."),this.connection.options.sdpTransform&&typeof this.connection.options.sdpTransform=="function"&&(n.sdp=this.connection.options.sdpTransform(n.sdp)||n.sdp);try{await e.setLocalDescription(n),Pe.log("Set localDescription:",n,`for:${this.connection.peer}`),t.socket.send({type:an.Answer,payload:{sdp:n,type:this.connection.type,connectionId:this.connection.connectionId},dst:this.connection.peer})}catch(s){t.emitError(Vt.WebRTC,s),Pe.log("Failed to setLocalDescription, ",s)}}catch(n){t.emitError(Vt.WebRTC,n),Pe.log("Failed to create answer, ",n)}}async handleSDP(e,t){t=new RTCSessionDescription(t);let n=this.connection.peerConnection,s=this.connection.provider;Pe.log("Setting remote description",t);let r=this;try{await n.setRemoteDescription(t),Pe.log(`Set remoteDescription:${e} for:${this.connection.peer}`),e==="OFFER"&&await r._makeAnswer()}catch(a){s.emitError(Vt.WebRTC,a),Pe.log("Failed to setRemoteDescription, ",a)}}async handleCandidate(e){Pe.log("handleCandidate:",e);try{await this.connection.peerConnection.addIceCandidate(e),Pe.log(`Added ICE candidate for:${this.connection.peer}`)}catch(t){this.connection.provider.emitError(Vt.WebRTC,t),Pe.log("Failed to handleCandidate, ",t)}}_addTracksToConnection(e,t){if(Pe.log(`add tracks from stream ${e.id} to peer connection`),!t.addTrack)return Pe.error("Your browser does't support RTCPeerConnection#addTrack. Ignored.");e.getTracks().forEach(n=>{t.addTrack(n,e)})}_addStreamToMediaConnection(e,t){Pe.log(`add stream ${e.id} to media connection ${t.connectionId}`),t.addStream(e)}},Jl=class extends Yd.EventEmitter{emitError(e,t){Pe.error("Error:",t),this.emit("error",new zd(`${e}`,t))}},zd=class extends Error{constructor(e,t){typeof t=="string"?super(t):(super(),Object.assign(this,t)),this.type=e}},Kl=class extends Jl{get open(){return this._open}constructor(e,t,n){super(),this.peer=e,this.provider=t,this.options=n,this._open=!1,this.metadata=n.metadata}},Gd,Za=class Za extends Kl{get type(){return Gi.Media}get localStream(){return this._localStream}get remoteStream(){return this._remoteStream}constructor(e,t,n){super(e,t,n),this._localStream=this.options._stream,this.connectionId=this.options.connectionId||Za.ID_PREFIX+mn.randomToken(),this._negotiator=new Zl(this),this._localStream&&this._negotiator.startConnection({_stream:this._localStream,originator:!0})}_initializeDataChannel(e){this.dataChannel=e,this.dataChannel.onopen=()=>{Pe.log(`DC#${this.connectionId} dc connection success`),this.emit("willCloseOnRemote")},this.dataChannel.onclose=()=>{Pe.log(`DC#${this.connectionId} dc closed for:`,this.peer),this.close()}}addStream(e){Pe.log("Receiving stream",e),this._remoteStream=e,super.emit("stream",e)}handleMessage(e){let t=e.type,n=e.payload;switch(e.type){case an.Answer:this._negotiator.handleSDP(t,n.sdp),this._open=!0;break;case an.Candidate:this._negotiator.handleCandidate(n.candidate);break;default:Pe.warn(`Unrecognized message type:${t} from peer:${this.peer}`);break}}answer(e,t={}){if(this._localStream){Pe.warn("Local stream already exists on this MediaConnection. Are you answering a call twice?");return}this._localStream=e,t&&t.sdpTransform&&(this.options.sdpTransform=t.sdpTransform),this._negotiator.startConnection({...this.options._payload,_stream:e});let n=this.provider._getMessages(this.connectionId);for(let s of n)this.handleMessage(s);this._open=!0}close(){this._negotiator&&(this._negotiator.cleanup(),this._negotiator=null),this._localStream=null,this._remoteStream=null,this.provider&&(this.provider._removeConnection(this),this.provider=null),this.options&&this.options._stream&&(this.options._stream=null),this.open&&(this._open=!1,super.emit("close"))}};Gd=new WeakMap,Tr(Za,Gd,Za.ID_PREFIX="mc_");var jl=Za,Bd=class{constructor(e){this._options=e}_buildRequest(e){let t=this._options.secure?"https":"http",{host:n,port:s,path:r,key:a}=this._options,o=new URL(`${t}://${n}:${s}${r}${a}/${e}`);return o.searchParams.set("ts",`${Date.now()}${Math.random()}`),o.searchParams.set("version",s0),fetch(o.href,{referrerPolicy:this._options.referrerPolicy})}async retrieveId(){try{let e=await this._buildRequest("id");if(e.status!==200)throw new Error(`Error. Status:${e.status}`);return e.text()}catch(e){Pe.error("Error retrieving ID",e);let t="";throw this._options.path==="/"&&this._options.host!==mn.CLOUD_HOST&&(t=" If you passed in a `path` to your self-hosted PeerServer, you'll also need to pass in that same path when creating a new Peer."),new Error("Could not get an ID from the server."+t)}}async listAllPeers(){try{let e=await this._buildRequest("peers");if(e.status!==200){if(e.status===401){let t="";throw this._options.host===mn.CLOUD_HOST?t="It looks like you're using the cloud server. You can email team@peerjs.com to enable peer listing for your API key.":t="You need to enable `allow_discovery` on your self-hosted PeerServer to use this feature.",new Error("It doesn't look like you have permission to list peers IDs. "+t)}throw new Error(`Error. Status:${e.status}`)}return e.json()}catch(e){throw Pe.error("Error retrieving list peers",e),new Error("Could not get list peers from the server."+e)}}},Wd,Xd,_s=class _s extends Kl{get type(){return Gi.Data}constructor(e,t,n){super(e,t,n),this.connectionId=this.options.connectionId||_s.ID_PREFIX+n0(),this.label=this.options.label||this.connectionId,this.reliable=!!this.options.reliable,this._negotiator=new Zl(this),this._negotiator.startConnection(this.options._payload||{originator:!0,reliable:this.reliable})}_initializeDataChannel(e){this.dataChannel=e,this.dataChannel.onopen=()=>{Pe.log(`DC#${this.connectionId} dc connection success`),this._open=!0,this.emit("open")},this.dataChannel.onmessage=t=>{Pe.log(`DC#${this.connectionId} dc onmessage:`,t.data)},this.dataChannel.onclose=()=>{Pe.log(`DC#${this.connectionId} dc closed for:`,this.peer),this.close()}}close(e){if(e?.flush){this.send({__peerData:{type:"close"}});return}this._negotiator&&(this._negotiator.cleanup(),this._negotiator=null),this.provider&&(this.provider._removeConnection(this),this.provider=null),this.dataChannel&&(this.dataChannel.onopen=null,this.dataChannel.onmessage=null,this.dataChannel.onclose=null,this.dataChannel=null),this.open&&(this._open=!1,super.emit("close"))}send(e,t=!1){if(!this.open){this.emitError($d.NotOpenYet,"Connection is not open. You should listen for the `open` event before sending messages.");return}return this._send(e,t)}async handleMessage(e){let t=e.payload;switch(e.type){case an.Answer:await this._negotiator.handleSDP(e.type,t.sdp);break;case an.Candidate:await this._negotiator.handleCandidate(t.candidate);break;default:Pe.warn("Unrecognized message type:",e.type,"from peer:",this.peer);break}}};Wd=new WeakMap,Xd=new WeakMap,Tr(_s,Wd,_s.ID_PREFIX="dc_"),Tr(_s,Xd,_s.MAX_BUFFERED_AMOUNT=8388608);var Ql=_s,ja=class extends Ql{get bufferSize(){return this._bufferSize}_initializeDataChannel(e){super._initializeDataChannel(e),this.dataChannel.binaryType="arraybuffer",this.dataChannel.addEventListener("message",t=>this._handleDataMessage(t))}_bufferedSend(e){(this._buffering||!this._trySend(e))&&(this._buffer.push(e),this._bufferSize=this._buffer.length)}_trySend(e){if(!this.open)return!1;if(this.dataChannel.bufferedAmount>Ql.MAX_BUFFERED_AMOUNT)return this._buffering=!0,setTimeout(()=>{this._buffering=!1,this._tryBuffer()},50),!1;try{this.dataChannel.send(e)}catch(t){return Pe.error(`DC#:${this.connectionId} Error when sending:`,t),this._buffering=!0,this.close(),!1}return!0}_tryBuffer(){if(!this.open||this._buffer.length===0)return;let e=this._buffer[0];this._trySend(e)&&(this._buffer.shift(),this._bufferSize=this._buffer.length,this._tryBuffer())}close(e){if(e?.flush){this.send({__peerData:{type:"close"}});return}this._buffer=[],this._bufferSize=0,super.close()}constructor(...e){super(...e),this._buffer=[],this._bufferSize=0,this._buffering=!1}},$a=class extends ja{close(e){super.close(e),this._chunkedData={}}constructor(e,t,n){super(e,t,n),this.chunker=new $l,this.serialization=eh.Binary,this._chunkedData={}}_handleDataMessage({data:e}){let t=td(e),n=t.__peerData;if(n){if(n.type==="close"){this.close();return}this._handleChunk(t);return}this.emit("data",t)}_handleChunk(e){let t=e.__peerData,n=this._chunkedData[t]||{data:[],count:0,total:e.total};if(n.data[e.n]=new Uint8Array(e.data),n.count++,this._chunkedData[t]=n,n.total===n.count){delete this._chunkedData[t];let s=Mb(n.data);this._handleDataMessage({data:s})}}_send(e,t){let n=nd(e);if(n instanceof Promise)return this._send_blob(n);if(!t&&n.byteLength>this.chunker.chunkedMTU){this._sendChunks(n);return}this._bufferedSend(n)}async _send_blob(e){let t=await e;if(t.byteLength>this.chunker.chunkedMTU){this._sendChunks(t);return}this._bufferedSend(t)}_sendChunks(e){let t=this.chunker.chunk(e);Pe.log(`DC#${this.connectionId} Try to send ${t.length} chunks...`);for(let n of t)this.send(n,!0)}},Vd=class extends ja{_handleDataMessage({data:e}){super.emit("data",e)}_send(e,t){this._bufferedSend(e)}constructor(...e){super(...e),this.serialization=eh.None}},Hd=class extends ja{_handleDataMessage({data:e}){let t=this.parse(this.decoder.decode(e)),n=t.__peerData;if(n&&n.type==="close"){this.close();return}this.emit("data",t)}_send(e,t){let n=this.encoder.encode(this.stringify(e));if(n.byteLength>=mn.chunkedMTU){this.emitError($d.MessageToBig,"Message too big for JSON channel");return}this._bufferedSend(n)}constructor(...e){super(...e),this.serialization=eh.JSON,this.encoder=new TextEncoder,this.decoder=new TextDecoder,this.stringify=JSON.stringify,this.parse=JSON.parse}};var qd,Ja=class Ja extends Jl{get id(){return this._id}get options(){return this._options}get open(){return this._open}get socket(){return this._socket}get connections(){let e=Object.create(null);for(let[t,n]of this._connections)e[t]=n;return e}get destroyed(){return this._destroyed}get disconnected(){return this._disconnected}constructor(e,t){super(),this._serializers={raw:Vd,json:Hd,binary:$a,"binary-utf8":$a,default:$a},this._id=null,this._lastServerId=null,this._destroyed=!1,this._disconnected=!1,this._open=!1,this._connections=new Map,this._lostMessages=new Map;let n;if(e&&e.constructor==Object?t=e:e&&(n=e.toString()),t={debug:0,host:mn.CLOUD_HOST,port:mn.CLOUD_PORT,path:"/",key:Ja.DEFAULT_KEY,token:mn.randomToken(),config:mn.defaultConfig,referrerPolicy:"strict-origin-when-cross-origin",serializers:{},...t},this._options=t,this._serializers={...this._serializers,...this.options.serializers},this._options.host==="/"&&(this._options.host=window.location.hostname),this._options.path&&(this._options.path[0]!=="/"&&(this._options.path="/"+this._options.path),this._options.path[this._options.path.length-1]!=="/"&&(this._options.path+="/")),this._options.secure===void 0&&this._options.host!==mn.CLOUD_HOST?this._options.secure=mn.isSecure():this._options.host==mn.CLOUD_HOST&&(this._options.secure=!0),this._options.logFunction&&Pe.setLogFunction(this._options.logFunction),Pe.logLevel=this._options.debug||0,this._api=new Bd(t),this._socket=this._createServerConnection(),!mn.supports.audioVideo&&!mn.supports.data){this._delayedAbort(Vt.BrowserIncompatible,"The current browser does not support WebRTC");return}if(n&&!mn.validateId(n)){this._delayedAbort(Vt.InvalidID,`ID "${n}" is invalid`);return}n?this._initialize(n):this._api.retrieveId().then(s=>this._initialize(s)).catch(s=>this._abort(Vt.ServerError,s))}_createServerConnection(){let e=new kd(this._options.secure,this._options.host,this._options.port,this._options.path,this._options.key,this._options.pingInterval);return e.on(Hi.Message,t=>{this._handleMessage(t)}),e.on(Hi.Error,t=>{this._abort(Vt.SocketError,t)}),e.on(Hi.Disconnected,()=>{this.disconnected||(this.emitError(Vt.Network,"Lost connection to server."),this.disconnect())}),e.on(Hi.Close,()=>{this.disconnected||this._abort(Vt.SocketClosed,"Underlying socket is already closed.")}),e}_initialize(e){this._id=e,this.socket.start(e,this._options.token)}_handleMessage(e){let t=e.type,n=e.payload,s=e.src;switch(t){case an.Open:this._lastServerId=this.id,this._open=!0,this.emit("open",this.id);break;case an.Error:this._abort(Vt.ServerError,n.msg);break;case an.IdTaken:this._abort(Vt.UnavailableID,`ID "${this.id}" is taken`);break;case an.InvalidKey:this._abort(Vt.InvalidKey,`API KEY "${this._options.key}" is invalid`);break;case an.Leave:Pe.log(`Received leave message from ${s}`),this._cleanupPeer(s),this._connections.delete(s);break;case an.Expire:this.emitError(Vt.PeerUnavailable,`Could not connect to peer ${s}`);break;case an.Offer:{let r=n.connectionId,a=this.getConnection(s,r);if(a&&(a.close(),Pe.warn(`Offer received for existing Connection ID:${r}`)),n.type===Gi.Media){let c=new jl(s,this,{connectionId:r,_payload:n,metadata:n.metadata});a=c,this._addConnection(s,a),this.emit("call",c)}else if(n.type===Gi.Data){let c=new this._serializers[n.serialization](s,this,{connectionId:r,_payload:n,metadata:n.metadata,label:n.label,serialization:n.serialization,reliable:n.reliable});a=c,this._addConnection(s,a),this.emit("connection",c)}else{Pe.warn(`Received malformed connection type:${n.type}`);return}let o=this._getMessages(r);for(let c of o)a.handleMessage(c);break}default:{if(!n){Pe.warn(`You received a malformed message from ${s} of type ${t}`);return}let r=n.connectionId,a=this.getConnection(s,r);a&&a.peerConnection?a.handleMessage(e):r?this._storeMessage(r,e):Pe.warn("You received an unrecognized message:",e);break}}}_storeMessage(e,t){this._lostMessages.has(e)||this._lostMessages.set(e,[]),this._lostMessages.get(e).push(t)}_getMessages(e){let t=this._lostMessages.get(e);return t?(this._lostMessages.delete(e),t):[]}connect(e,t={}){if(t={serialization:"default",...t},this.disconnected){Pe.warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect, or call reconnect on this peer if you believe its ID to still be available."),this.emitError(Vt.Disconnected,"Cannot connect to new Peer after disconnecting from server.");return}let n=new this._serializers[t.serialization](e,this,t);return this._addConnection(e,n),n}call(e,t,n={}){if(this.disconnected){Pe.warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect."),this.emitError(Vt.Disconnected,"Cannot connect to new Peer after disconnecting from server.");return}if(!t){Pe.error("To call a peer, you must provide a stream from your browser's `getUserMedia`.");return}let s=new jl(e,this,{...n,_stream:t});return this._addConnection(e,s),s}_addConnection(e,t){Pe.log(`add connection ${t.type}:${t.connectionId} to peerId:${e}`),this._connections.has(e)||this._connections.set(e,[]),this._connections.get(e).push(t)}_removeConnection(e){let t=this._connections.get(e.peer);if(t){let n=t.indexOf(e);n!==-1&&t.splice(n,1)}this._lostMessages.delete(e.connectionId)}getConnection(e,t){let n=this._connections.get(e);if(!n)return null;for(let s of n)if(s.connectionId===t)return s;return null}_delayedAbort(e,t){setTimeout(()=>{this._abort(e,t)},0)}_abort(e,t){Pe.error("Aborting!"),this.emitError(e,t),this._lastServerId?this.disconnect():this.destroy()}destroy(){this.destroyed||(Pe.log(`Destroy peer with ID:${this.id}`),this.disconnect(),this._cleanup(),this._destroyed=!0,this.emit("close"))}_cleanup(){for(let e of this._connections.keys())this._cleanupPeer(e),this._connections.delete(e);this.socket.removeAllListeners()}_cleanupPeer(e){let t=this._connections.get(e);if(t)for(let n of t)n.close()}disconnect(){if(this.disconnected)return;let e=this.id;Pe.log(`Disconnect peer with ID:${e}`),this._disconnected=!0,this._open=!1,this.socket.close(),this._lastServerId=e,this._id=null,this.emit("disconnected",e)}reconnect(){if(this.disconnected&&!this.destroyed)Pe.log(`Attempting reconnection to server with ID ${this._lastServerId}`),this._disconnected=!1,this._initialize(this._lastServerId);else{if(this.destroyed)throw new Error("This peer cannot reconnect to the server. It has already been destroyed.");if(!this.disconnected&&!this.open)Pe.error("In a hurry? We're still trying to make the initial connection!");else throw new Error(`Peer ${this.id} cannot reconnect because it is not disconnected from the server!`)}}listAllPeers(e=t=>{}){this._api.listAllPeers().then(t=>e(t)).catch(t=>this._abort(Vt.ServerError,t))}};qd=new WeakMap,Tr(Ja,qd,Ja.DEFAULT_KEY="peerjs");var Qa=Ja;var ef=3,tf=1,nf=2,sf=3,r0=Object.keys(Ve),a0=["over","burst","spin","time"],o0=["quake","sanctuary"],Lt=2e3,th=400,br=3e4,c0=1,l0=2,h0=4,u0=8,d0=16,f0=32,p0=64,m0=128,Zd=Math.PI*2,Kd=255,Jd=(i,e,t)=>(i=Math.round(i),i<e?e:i>t?t:i),jd=class{constructor(e=512){this.view=new DataView(new ArrayBuffer(e)),this.o=0}u8(e){this.view.setUint8(this.o,Jd(e,0,255)),this.o+=1}u16(e){this.view.setUint16(this.o,Jd(e,0,65535)),this.o+=2}i16(e){this.view.setInt16(this.o,Jd(e,-32768,32767)),this.o+=2}f32(e){this.view.setFloat32(this.o,e),this.o+=4}done(){return this.view.buffer.slice(0,this.o)}},nh=class{constructor(e){this.view=new DataView(e),this.o=0}u8(){let e=this.view.getUint8(this.o);return this.o+=1,e}u16(){let e=this.view.getUint16(this.o);return this.o+=2,e}i16(){let e=this.view.getInt16(this.o);return this.o+=2,e}f32(){let e=this.view.getFloat32(this.o);return this.o+=4,e}};function wb(i,e){i.i16(e.x*Lt),i.i16(e.z*Lt),i.i16(e.vx*th),i.i16(e.vz*th),i.u16(e.spin*50),i.u8(e.ult>=100?Kd:Math.min(Kd-1,Math.floor(e.ult*2.5))),i.u8(e.tumble*100),i.u8(e.launch*100),i.u8(e.guard*100),i.u8(e.slow*100),i.u8(e.hitCd*1e3),i.u8(e.empower*50),i.f32(e.phase);for(let t of Ht)i.u16(e.cd[t]*1e3);i.u16(e.projN),i.u8((e.cmd?c0:0)|(e.dash?l0:0)|(e.blink?h0:0)|(e.air?u0:0)|(e.out?d0:0)|(e.charge?f0:0)|(e.orbs?p0:0)|(e.tether?m0:0)),e.cmd&&(i.i16(e.cmd.x*Lt),i.i16(e.cmd.z*Lt),i.u8(e.cmd.t*100));for(let t of[e.dash,e.blink])t&&(i.i16(t.dx*br),i.i16(t.dz*br),i.u8(t.t*250));if(e.air){let t=e.air;i.u8(t.t*200),i.i16(t.sx*Lt),i.i16(t.sz*Lt),i.i16(t.tx*Lt),i.i16(t.tz*Lt)}if(e.out&&(i.u8(e.out.t*50),i.i16(e.out.y*100),i.i16(e.out.vy*100)),e.charge&&i.u8(e.charge.t*200),e.orbs){let t=e.orbs;i.u8(t.alive),i.u8(t.t*40),i.u16((t.ang%Zd+Zd)%Zd*1e4),i.u8(t.cd*200)}if(e.tether){let t=e.tether;i.u8(t.t*80),i.u16(t.acc*100),i.u8(t.tick*200)}}function Qd(i){let e=i.i16()/br,t=i.i16()/br,n=Math.hypot(e,t)||1;return{dx:e/n,dz:t/n}}function Ab(i,e){e.x=i.i16()/Lt,e.z=i.i16()/Lt,e.vx=i.i16()/th,e.vz=i.i16()/th,e.spin=i.u16()/50;let t=i.u8();e.ult=t===Kd?100:t/2.5,e.tumble=i.u8()/100,e.launch=i.u8()/100,e.guard=i.u8()/100,e.slow=i.u8()/100,e.hitCd=i.u8()/1e3,e.empower=i.u8()/50,e.phase=i.f32();for(let s of Ht)e.cd[s]=i.u16()/1e3;e.projN=i.u16();let n=i.u8();if(e.cast=null,e.cmd=n&c0?{x:i.i16()/Lt,z:i.i16()/Lt,t:i.u8()/100}:null,e.dash=n&l0?{...Qd(i),speed:Ve.blitz.speed,t:i.u8()/250}:null,e.blink=n&h0?{...Qd(i),speed:Ve.phantom.speed,t:i.u8()/250}:null,e.air=n&u0?{t:i.u8()/200,T:Ve.meteor.air,sx:i.i16()/Lt,sz:i.i16()/Lt,tx:i.i16()/Lt,tz:i.i16()/Lt}:null,e.out=n&d0?{t:i.u8()/50,y:i.i16()/100,vy:i.i16()/100}:null,e.charge=n&f0?{t:i.u8()/200,T:Ve.nova.charge,skill:Ve.nova}:null,n&p0){let s=i.u8(),r=0;for(let a=0;a<8;a++)s&1<<a&&r++;e.orbs={alive:s,n:r,t:i.u8()/40,ang:i.u16()/1e4,cd:i.u8()/200,skill:Ve.satellite}}else e.orbs=null;e.tether=n&m0?{t:i.u8()/80,T:Ve.eclipse.dur,skill:Ve.eclipse,acc:i.u16()/100,tick:i.u8()/200}:null}function g0(i,e){let t=new jd;t.u8(tf),t.u16(e.seq&65535),t.u16(e.ack&65535),t.u16(Math.max(0,e.timeLeft)*100);let n=i.result;t.u8(n?1+n.winner.side+2*a0.indexOf(n.kind):0);for(let s of i.tops)wb(t,s);t.u8(i.projectiles.length);for(let s of i.projectiles)t.u16(s.id),t.u8(s.owner.side|r0.indexOf(s.skill.id)<<1),t.i16(s.x*Lt),t.i16(s.z*Lt),t.i16(s.dx*br),t.i16(s.dz*br),t.u16(s.left*1e3),t.u16(s.dmg*100);t.u8(i.zones.length);for(let s of i.zones)t.u8(s.owner.side|o0.indexOf(s.kind)<<1),t.i16(s.x*Lt),t.i16(s.z*Lt),t.u8(s.t*40),t.u16((s.healed||0)*100),t.u8((s.tick||0)*200);return t.done()}function x0(i){let e=new nh(i);return e.u8(),{seq:e.u16(),ack:e.u16(),timeLeft:e.u16()/100}}function _0(i,e){let t=new nh(e);t.u8();let n={seq:t.u16(),ack:t.u16(),timeLeft:t.u16()/100},s=t.u8();if(s){let c=i.tops[s-1&1];i.result={winner:c,loser:i.other(c),kind:a0[s-1>>1]}}else i.result=null;for(let c of i.tops)Ab(t,c);let r=new Map(i.projectiles.map(c=>[c.id,c])),a=t.u8();i.projectiles=[];for(let c=0;c<a;c++){let l=t.u16(),h=t.u8(),u=r.get(l)||{id:l,dead:!1};u.owner=i.tops[h&1],u.skill=Ve[r0[h>>1]],u.x=t.i16()/Lt,u.z=t.i16()/Lt,Object.assign(u,Qd(t)),u.left=t.u16()/1e3,u.dmg=t.u16()/100,u.speed=u.skill.speed,u.r=u.skill.radius,u.dead=!1,i.projectiles.push(u)}let o=t.u8();i.zones=[];for(let c=0;c<o;c++){let l=t.u8(),h=o0[l>>1],u=Ve[h];i.zones.push({kind:h,skill:u,owner:i.tops[l&1],x:t.i16()/Lt,z:t.i16()/Lt,t:t.u8()/40,healed:t.u16()/100,tick:t.u8()/200,r:h==="quake"?u.aoe:u.radius,T:h==="quake"?u.delay:u.dur})}return n}var eo=i=>Math.round(i*100)/100;function y0(i){let e={};for(let t in i){let n=i[t];n!=null&&(typeof n=="number"?e[t]=eo(n):typeof n!="object"?e[t]=n:"blade"in n?e[t]={$t:n.side}:"aim"in n?e[t]={$s:n.id}:"left"in n?e[t]={$p:[n.id,n.owner.side,n.skill.id,eo(n.x),eo(n.z),Math.round(n.dx*1e3)/1e3,Math.round(n.dz*1e3)/1e3]}:"kind"in n&&"owner"in n&&(e[t]={$z:[n.kind,n.owner.side,eo(n.x),eo(n.z)]}))}return e}function v0(i,e){let t={};for(let n in i){let s=i[n];if(s==null||typeof s!="object"){t[n]=s;continue}if("$t"in s)t[n]=e.tops[s.$t&1];else if("$s"in s)t[n]=Ve[s.$s];else if("$p"in s){let[r,a,o,c,l,h,u]=s.$p;t[n]=e.projectiles.find(d=>d.id===r)||{id:r,owner:e.tops[a&1],skill:Ve[o],x:c,z:l,dx:h,dz:u,left:0}}else if("$z"in s){let[r,a,o,c]=s.$z,l=Ve[r];t[n]={kind:r,skill:l,owner:e.tops[a&1],x:o,z:c,t:0,r:r==="quake"?l.aoe:l.radius,T:r==="quake"?l.delay:l.dur}}}return t}function rf(i,e){let t=new DataView(new ArrayBuffer(9));return t.setUint8(0,i),t.setFloat64(1,e),t.buffer}var ih=i=>new DataView(i).getUint8(0),af=i=>new DataView(i).getFloat64(1);function M0(i){let e="",t=new Uint8Array(i);for(let n=0;n<t.length;n++)e+=String.fromCharCode(t[n]);return btoa(e)}function b0(i){let e=atob(i),t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n);return t.buffer}var S0="gyroclash-online-2-",T0="ABCDEFGHJKLMNPQRSTUVWXYZ23456789",Cb=77,E0=16*1024,w0=()=>Array.from({length:6},()=>T0[Math.random()*T0.length|0]).join(""),A0=i=>(i||"").toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,6),sh=class{constructor(e){this.h=e,this.peer=null,this.conn=null,this.ch=null,this.role=null,this.code="",this.connected=!1,this.rtt=.08,this.jitter=0,this.rttKnown=!1,this.lastHeard=0,this.pingT=0,this.joinTimer=0,this.sim=null,this.stats={out:0,in:0,bytesOut:0,bytesIn:0,lost:0,rateOut:0,rateIn:0,t:0,lastOut:0,lastIn:0}}host(){this.role="host",this.openRoom(w0())}openRoom(e){this.code=e;let t=this.peer=new Qa(S0+e);t.on("open",()=>this.h.status("waiting",e)),t.on("connection",n=>{if(this.conn){n.on("open",()=>{n.send({t:"full"}),setTimeout(()=>n.close(),400)});return}this.attach(n)}),t.on("error",n=>{if(n.type==="unavailable-id"&&!this.conn){t.destroy(),this.openRoom(w0());return}n.type!=="peer-unavailable"&&(this.connected||this.fail(n.type))}),t.on("disconnected",()=>{t.destroyed||setTimeout(()=>{t.destroyed||t.reconnect()},1500)})}join(e){this.role="guest",this.code=e;let t=this.peer=new Qa;t.on("open",()=>{this.h.status("connecting",e),this.attach(t.connect(S0+e,{reliable:!0,serialization:"json"})),this.joinTimer=setTimeout(()=>{this.connected||this.fail("timeout")},2e4)}),t.on("error",n=>{this.connected||this.fail(n.type)})}attach(e){this.conn=e,e.on("open",()=>{clearTimeout(this.joinTimer),this.connected=!0,this.lastHeard=performance.now(),this.openStateChannel(e),this.h.open()}),e.on("data",t=>{if(this.lastHeard=performance.now(),!(!t||typeof t!="object")){if(t.t==="b"&&typeof t.d=="string"){try{this.receive(b0(t.d))}catch{}return}this.h.message(t)}}),e.on("close",()=>this.drop("close")),e.on("error",()=>this.drop("error"))}openStateChannel(e){try{let t=e.peerConnection.createDataChannel("gc-state",{negotiated:!0,id:Cb,ordered:!1,maxRetransmits:0});t.binaryType="arraybuffer",t.onmessage=n=>{this.lastHeard=performance.now(),n.data instanceof ArrayBuffer&&this.receive(n.data)},this.ch=t}catch{this.ch=null}}get fast(){return!!(this.ch&&this.ch.readyState==="open")}get congested(){return this.fast&&this.ch.bufferedAmount>E0/4}receive(e){this.stats.in++,this.stats.bytesIn+=e.byteLength;let t=ih(e);if(t===nf){this.sendPacket(rf(sf,af(e)));return}if(t===sf){let n=Math.max(0,(performance.now()-af(e))/1e3);this.rttKnown?(this.jitter=this.jitter*.85+Math.abs(n-this.rtt)*.15,this.rtt=this.rtt*.85+n*.15):(this.rtt=n,this.rttKnown=!0);return}this.h.packet(e)}send(e){if(!this.conn||!this.conn.open)return;this.stats.out++;let t=this.conn;this.sim?this.later(!0,()=>{t.open&&t.send(e)}):t.send(e)}simulate(e,t,n){this.sim={lag:e/2,jitter:t,loss:n/100,last:0,queue:[]}}later(e,t){let n=this.sim,s=performance.now()+n.lag+Math.random()*n.jitter;e&&(s=Math.max(s,n.last+.01),n.last=s),n.queue.push({at:s,fn:t})}sendPacket(e){if(!this.connected)return!1;if(this.sim){if(Math.random()<this.sim.loss)return!0;let t=this.ch;this.later(!1,()=>{try{t&&t.readyState==="open"&&t.send(e)}catch{}})}else if(this.fast){if(this.ch.bufferedAmount>E0)return!1;try{this.ch.send(e)}catch{return!1}}else this.send({t:"b",d:M0(e)});return this.stats.out++,this.stats.bytesOut+=e.byteLength,!0}update(e){if(!this.connected)return;let t=performance.now();if(this.sim&&this.sim.queue.length){let s=this.sim.queue.filter(r=>r.at<=t);this.sim.queue=this.sim.queue.filter(r=>r.at>t);for(let r of s)r.fn()}this.pingT-=e,this.pingT<=0&&(this.pingT=this.rttKnown?.5:.15,this.sendPacket(rf(nf,t)));let n=this.stats;n.t+=e,n.t>=1&&(n.rateOut=(n.bytesOut-n.lastOut)/n.t,n.rateIn=(n.bytesIn-n.lastIn)/n.t,n.lastOut=n.bytesOut,n.lastIn=n.bytesIn,n.t=0),t-this.lastHeard>8e3&&this.drop("timeout")}drop(e){let t=this.conn,n=this.ch;if(!t)return;let s=this.connected;this.conn=null,this.ch=null,this.connected=!1,this.rttKnown=!1;try{t.close()}catch{}try{n&&n.close()}catch{}s?this.h.closed(e):this.role==="guest"&&this.fail(e)}fail(e){clearTimeout(this.joinTimer),this.h.status("failed",e)}leave(){clearTimeout(this.joinTimer);let e=this.conn;this.conn=null,this.connected=!1;try{e&&e.send({t:"bye"})}catch{}setTimeout(()=>{try{this.peer&&this.peer.destroy()}catch{}this.peer=null},150),this.ch=null,this.role=null}};var uf="v0.1.2 \xB7 2026-10-10 20:40",Wi=1/120,Rb={sonic:.42,anchor:.45,blitz:.48,flare:.36,quake:.2},Pb=30,Ib=15,Lb=.25,cn=new URLSearchParams(location.search),df=document.getElementById("stage"),Rt=new Nl(df),Ee=new Ol,S={state:"title",mode:"cpu",side:0,paused:!1,world:null,brain:null,autoBrain:null,score:[0,0],round:0,timeLeft:ph,finishes:[],acc:0,hitstop:0,slow:{s:1,t:0},seq:null,seqT:0,aimKey:null,buffer:null,cursor:{sx:innerWidth/2,sy:innerHeight/2,x:0,z:0},mouseDown:!1,moveRepeat:0,ultWasReady:!1,blade:"azure",level:1,net:null,lobby:{role:null,status:"opening",url:"",error:"",me:{blade:"azure",ready:!1},peer:null},outbox:[],snapT:0,snapSeq:0,tail:0,inSeq:0,ack:0,pending:[],lastSnap:-1,corrections:0,errSum:0,errMax:0,inbox:null,frames:0},Xi=()=>S.mode!=="cpu",En=()=>S.world.tops[S.side],ch=()=>S.world.tops[1-S.side],ze=new Ul({start:(i,e)=>{Ee.unlock(),Ee.ui(),ah(i,e)},again:()=>{Ee.ui(),Xi()?Ob(!0):ah(S.blade,S.level)},quit:()=>{Ee.ui(),mf(),to()},pause:()=>oh(),mute:()=>{Ee.unlock(),Ee.setMuted(!Ee.muted),ze.setMuted(Ee.muted)},ui:()=>{Ee.unlock(),Ee.ui()},hover:()=>Ee.hover(),skillClick:i=>qb(i),host:()=>{Ee.unlock(),Ee.ui(),ff()},ready:()=>{Ee.unlock(),Ee.ui(),Ub(!S.lobby.me.ready)},pick:i=>{Ee.unlock(),Ee.ui(),S.lobby.me.ready||(S.lobby.me.blade=i,ze.blade=i,pf())},copy:()=>Fb()});function Sr(i){for(let e of["title","lobby","result","pause"])ze.show(e,e===i);ze.show("hud",i==="hud"),document.body.classList.toggle("menu",i!=="hud")}function to(){S.state="title",S.mode="cpu",S.side=0,S.paused=!1,S.world=null,S.aimKey=null,S.seq=null,Rt.setMatch(null,0),Rt.orbiting=!0,Ee.stopMusic(),Sr("title"),ze.setMenuMode(!1),ze.setNet(""),ze.labels.innerHTML="",ze.vignette.style.opacity=0}function P0(i,e,t,n){S.world=i,S.side=e,S.score=[0,0],S.round=0,S.finishes=[],S.paused=!1,Rt.setMatch(i,e),Rt.orbiting=!1,Sr("hud"),ze.setMenuMode(Xi()),ze.startMatch(i,e,t,n),Ee.startMusic()}function ah(i,e){S.mode="cpu",S.blade=i,S.level=e;let t=Ss[e],n=Object.keys($t).filter(o=>o!==i),s=cn.get("foe")||n[Math.random()*n.length|0],r=new Er($t[i],$t[s],(Date.now()&16777215)+1);P0(r,0,"CPU",t.name);let a=ch();for(let o of Ht)a.windup[o]=(Rb[fn(a,o).id]||0)*t.windup;S.brain=new Ts(r,a,t),S.autoBrain=cn.has("auto")?new Ts(r,En(),Ss[1]):null,lh(1)}function I0(i){let e=new Er($t[i[0]],$t[i[1]],1);P0(e,S.mode==="host"?0:1,"RIVAL",""),S.brain=null,S.outbox.length=0,S.pending.length=0,S.inSeq=0,S.ack=0,S.snapSeq=0,S.lastSnap=-1,S.corrections=0,S.errSum=S.errMax=0,S.inbox=null,S.lobby.me.ready=!1,S.lobby.peer&&(S.lobby.peer.ready=!1),S.autoBrain=cn.has("auto")?new Ts(S.mode==="host"?e:Xb(e),En(),Ss[1]):null}function lh(i){let e=S.world;S.round=i,e.resetRound(),e.events.length=0,Rt.clearRound();for(let o of Rt.tops)o.hold=!0,o.drop=7;S.state="countdown",S.timeLeft=ph,S.acc=0,S.hitstop=0,S.slow.t=0,S.aimKey=null,S.buffer=null,S.pending.length=0,S.outbox.length=0,S.lastSnap=-1,S.inbox=null,ze.setRound(i),ze.setScore(S.score),S.mode==="host"&&S.net.send({t:"round",n:i,score:S.score});let t=S.score[0]===$i-1&&S.score[1]===$i-1,n=cn.has("quick"),s=n?.1:1.5,r=n?.05:.62,a=()=>{for(let o of Rt.tops)o.hold=!1,o.dropV=0};S.seqT=0,S.seq=[{at:.05,run:()=>ze.announce(t?"FINAL ROUND":"ROUND "+i,`${En().blade.en}\u3000vs\u3000${ch().blade.en}`,"round",1.4)},{at:s,run:()=>{ze.announce("3","","count",.6),Ee.beep()}},{at:s+r,run:()=>{ze.announce("2","","count",.6),Ee.beep()}},{at:s+r*2,run:()=>{ze.announce("1","","count",.6),Ee.beep()}},{at:s+r*3,run:()=>{ze.announce("GO SPIN!","","go",.9),Ee.beep(!0),a()}}],S.mode!=="guest"&&S.seq.push({at:s+r*3+.38,run:L0})}function L0(){if(S.state==="countdown"){for(let i of Rt.tops)i.hold=!1;S.state="fight",S.snapT=0,Ee.clash(18),S.mode==="host"&&S.net.send({t:"go"})}}function Db(i){let e=i.winner.side===S.side;if(S.score[i.winner.side]++,S.finishes.push(`R${S.round} ${e?"WIN":"LOSE"}\uFF08${{over:"\u30AA\u30FC\u30D0\u30FC",burst:"\u30D0\u30FC\u30B9\u30C8",spin:"\u30B9\u30D4\u30F3",time:"\u5224\u5B9A"}[i.kind]}\uFF09`),S.state="finish",S.aimKey=null,S.buffer=null,S.slow={s:.16,t:i.kind==="time"?.3:1.25},S.hitstop=i.kind==="time"?0:.2,S.tail=4,ze.finish(i.kind,e),ze.setScore(S.score),ze.flash("#fff",i.kind==="time"?.2:.7),Ee.finish(e),S.seqT=0,S.mode==="guest"){S.seq=null;return}let t=S.score[0]>=$i||S.score[1]>=$i;S.seq=[{at:3.3,run:()=>{if(!t)return lh(S.round+1);S.mode==="host"&&S.net.send({t:"result",score:S.score,stats:S.world.tops.map(n=>n.stats)}),D0()}}]}function D0(){S.state="result",Rt.orbiting=!0,Ee.stopMusic(),ze.announceEl.className="",ze.labels.innerHTML="",ze.showResult(S.score[S.side]>S.score[1-S.side],S.score,S.world,S.finishes),Sr("result")}function Nb(i){return`${location.origin}${location.pathname}?room=${i}`}function N0(){return S.net&&S.net.leave(),S.net=new sh({status:cf,open:zb,message:Vb,packet:Gb,closed:Bb}),cn.has("lag")&&S.net.simulate(Number(cn.get("lag"))||0,Number(cn.get("jitter"))||0,Number(cn.get("loss"))||0),S.net}function U0(i){S.mode=i,S.state="lobby";let e=S.lobby;e.role=i,e.status="opening",e.url="",e.error="",e.peer=null,e.me={blade:ze.blade,ready:!1},Rt.setMatch(null,0),Rt.orbiting=!0,Sr("lobby"),ze.showLobby(e)}function ff(){U0("host"),N0().host()}function O0(i){U0("guest"),N0().join(i)}function pf(){let i=S.lobby;S.net&&S.net.connected&&S.net.send({t:"lobby",blade:i.me.blade,ready:i.me.ready}),F0()}function F0(){let i=S.lobby;if(S.state==="lobby"&&ze.showLobby(i),S.mode==="host"&&S.state==="lobby"&&i.me.ready&&i.peer&&i.peer.ready){let e=[i.me.blade,i.peer.blade];S.net.send({t:"start",blades:e}),I0(e),lh(1)}}function Ub(i){S.lobby.status==="connected"&&(S.lobby.me.ready=i,pf())}function Ob(i){if(!S.net||!S.net.connected){to();return}S.state="lobby",S.world=null,S.seq=null,Rt.setMatch(null,0),Rt.orbiting=!0,Ee.stopMusic(),ze.labels.innerHTML="",ze.vignette.style.opacity=0,Sr("lobby"),S.lobby.me.ready=!!i,pf()}function mf(){S.net&&(S.net.leave(),S.net=null),cn.has("room")&&history.replaceState(null,"",location.pathname)}async function Fb(){let i=S.lobby.url;if(i)try{await navigator.clipboard.writeText(i),ze.toast("\u62DB\u5F85URL\u3092\u30B3\u30D4\u30FC\u3057\u307E\u3057\u305F")}catch{document.getElementById("lb-url").select(),ze.toast("URL\u3092\u9078\u629E\u3057\u307E\u3057\u305F\u3002Ctrl+C \u3067\u30B3\u30D4\u30FC\u3057\u3066\u304F\u3060\u3055\u3044")}}var kb={"peer-unavailable":"\u30EB\u30FC\u30E0\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002URL\u304C\u53E4\u3044\u304B\u3001\u30DB\u30B9\u30C8\u304C\u30EB\u30FC\u30E0\u3092\u9589\u3058\u3066\u3044\u307E\u3059\u3002",timeout:"\u63A5\u7D9A\u304C\u30BF\u30A4\u30E0\u30A2\u30A6\u30C8\u3057\u307E\u3057\u305F\u3002\u30CD\u30C3\u30C8\u30EF\u30FC\u30AF\u74B0\u5883\u306B\u3088\u3063\u3066\u306F\u76F4\u63A5\u63A5\u7D9A\u3067\u304D\u306A\u3044\u5834\u5408\u304C\u3042\u308A\u307E\u3059\u3002",network:"\u4EF2\u4ECB\u30B5\u30FC\u30D0\u30FC\u306B\u63A5\u7D9A\u3067\u304D\u307E\u305B\u3093\u3002\u30A4\u30F3\u30BF\u30FC\u30CD\u30C3\u30C8\u63A5\u7D9A\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002","server-error":"\u4EF2\u4ECB\u30B5\u30FC\u30D0\u30FC\u306B\u63A5\u7D9A\u3067\u304D\u307E\u305B\u3093\u3002\u5C11\u3057\u5F85\u3063\u3066\u304B\u3089\u3082\u3046\u4E00\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002","browser-incompatible":"\u3053\u306E\u30D6\u30E9\u30A6\u30B6\u306F\u30AA\u30F3\u30E9\u30A4\u30F3\u5BFE\u6226\uFF08WebRTC\uFF09\u306B\u5BFE\u5FDC\u3057\u3066\u3044\u307E\u305B\u3093\u3002",full:"\u3053\u306E\u30EB\u30FC\u30E0\u306F\u6E80\u54E1\u3067\u3059\u3002",version:"\u76F8\u624B\u3068\u30B2\u30FC\u30E0\u306E\u30D0\u30FC\u30B8\u30E7\u30F3\u304C\u9055\u3044\u307E\u3059\u3002\u4E21\u65B9\u306E\u30DA\u30FC\u30B8\u3092\u518D\u8AAD\u307F\u8FBC\u307F\u3057\u3066\u304F\u3060\u3055\u3044\u3002"};function cf(i,e){let t=S.lobby;if(i==="failed"){if(t.status="failed",t.error=kb[e]||`\u63A5\u7D9A\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\uFF08${e}\uFF09`,S.state!=="lobby"){ze.toast(t.error),mf(),to();return}}else t.status=i,i==="waiting"&&(t.url=Nb(e));S.state==="lobby"&&ze.showLobby(t)}function zb(){let i=S.lobby;i.status="connected",S.net.send({t:"hello",v:ef,build:uf,blade:i.me.blade,ready:i.me.ready}),S.state==="lobby"&&ze.showLobby(i)}function Bb(i){let e=S.lobby;e.peer=null,e.me.ready=!1,ze.setNet("");let t=S.state!=="lobby"&&S.state!=="title";S.mode==="host"?(e.status="waiting",S.state="lobby",S.world=null,S.seq=null,S.paused=!1,Rt.setMatch(null,0),Rt.orbiting=!0,Ee.stopMusic(),ze.labels.innerHTML="",Sr("lobby"),ze.showLobby(e),ze.toast(t?"\u76F8\u624B\u3068\u306E\u63A5\u7D9A\u304C\u5207\u308C\u307E\u3057\u305F":"\u76F8\u624B\u304C\u9000\u51FA\u3057\u307E\u3057\u305F")):S.mode==="guest"&&(ze.toast(i==="timeout"?"\u63A5\u7D9A\u304C\u30BF\u30A4\u30E0\u30A2\u30A6\u30C8\u3057\u307E\u3057\u305F":"\u30DB\u30B9\u30C8\u3068\u306E\u63A5\u7D9A\u304C\u5207\u308C\u307E\u3057\u305F"),mf(),to())}var rh=i=>Number.isFinite(i)?Math.max(-50,Math.min(50,i)):0;function Vb(i){let e=S.lobby,t=S.world;switch(i.t){case"hello":if(i.v!==ef){cf("failed","version"),S.net.leave();return}typeof i.build=="string"&&i.build!==uf&&ze.toast(`\u76F8\u624B\u306F\u5225\u306E\u7248\u3067\u3059\uFF08${i.build.slice(0,40)}\uFF09`);case"lobby":if(!$t[i.blade])return;e.peer={blade:i.blade,ready:!!i.ready},S.state==="result"&&i.ready&&ze.toast("\u76F8\u624B\u304C\u518D\u6226\u3092\u5F85\u3063\u3066\u3044\u307E\u3059"),F0();break;case"full":cf("failed","full");break;case"bye":S.net&&S.net.drop("bye");break;case"start":if(S.mode!=="guest"||!Array.isArray(i.blades)||!$t[i.blades[0]]||!$t[i.blades[1]])return;I0(i.blades);break;case"round":if(S.mode!=="guest"||!t)return;S.score=[i.score[0]|0,i.score[1]|0],lh(i.n|0);break;case"go":S.mode==="guest"&&t&&(S.seq=null,L0());break;case"ev":if(S.mode!=="guest"||!t||!Array.isArray(i.l))return;for(let n of i.l)Hb(v0(n,t));break;case"result":if(S.mode!=="guest"||!t)return;S.score=[i.score[0]|0,i.score[1]|0],i.stats.forEach((n,s)=>Object.assign(t.tops[s].stats,n)),D0();break;case"in":{if(S.mode!=="host"||!t||S.state!=="fight")return;let n=t.tops[1];i.k==="m"?t.issueMove(n,rh(i.x),rh(i.z)):i.k==="c"&&Ht.includes(i.key)&&t.cast(n,i.key,rh(i.x),rh(i.z)),S.ack=i.s|0;break}}}function Hb(i){let e=S.world;if(i.type==="ringout"&&i.top&&!i.top.out&&(i.top.out={t:0,y:0,vy:7+(i.power||0)*.35}),i.type==="finish"){if(S.state!=="fight")return;e.result={winner:i.winner,loser:i.loser,kind:i.kind},(i.kind==="spin"||i.kind==="burst")&&(i.loser.spin=0)}H0(i)}function Gb(i){if(S.mode!=="guest"||ih(i)!==tf||!S.world||S.state!=="fight")return;let e=x0(i);if(S.lastSnap>=0){let t=e.seq-S.lastSnap&65535;if(t===0||t>32768)return;t>1&&(S.net.stats.lost+=t-1)}S.lastSnap=e.seq,S.inbox={buf:i,head:e,at:performance.now()}}function Wb(){let i=S.inbox,e=S.world;if(S.inbox=null,!i||!e||S.state!=="fight")return!1;let t=Rt.capture();_0(e,i.buf),S.timeLeft=i.head.timeLeft;let n=i.head.ack;S.pending=S.pending.filter(o=>{let c=o.s-n&65535;return c!==0&&c<32768});let s=En();for(let o of S.pending)o.k==="m"?e.issueMove(s,o.x,o.z):e.cast(s,o.key,o.x,o.z);let r=Math.min(Lb,S.net.rtt/2+(performance.now()-i.at)/1e3);for(let o=Math.round(r/Wi);o>0;o--)e.step(Wi);e.events.length=0,S.acc=0,Rt.absorb(t);let a=0;return e.tops.forEach((o,c)=>{!o.air&&!o.out&&!o.blink&&(a=Math.max(a,Math.hypot(o.x-t[c].x,o.z-t[c].z)))}),S.corrections++,S.errSum+=a,S.errMax=Math.max(S.errMax,a),!0}function Xb(i){return new Proxy(i,{get(e,t){if(t==="cast")return(s,r,a,o)=>z0(r,a,o);if(t==="issueMove")return(s,r,a)=>k0(r,a);let n=e[t];return typeof n=="function"?n.bind(e):n}})}function k0(i,e){let t=S.world,n=En();return t.issueMove(n,i,e)?(S.mode==="guest"&&B0({k:"m",x:n.cmd.x,z:n.cmd.z}),!0):!1}function z0(i,e,t){let n=S.world;return n.cast(En(),i,e,t)?(S.mode==="guest"&&(n.events.length=0,B0({k:"c",key:i,x:e,z:t})),!0):!1}function B0(i){i.s=S.inSeq=S.inSeq+1&65535,i.x=Math.round(i.x*100)/100,i.z=Math.round(i.z*100)/100,S.pending.push(i),S.pending.length>40&&S.pending.shift(),S.net.send({t:"in",...i})}function gf(){let i=Rt.pick(S.cursor.sx,S.cursor.sy);i&&(S.cursor.x=i.x,S.cursor.z=i.z)}function V0(i){if(S.state!=="fight"||S.paused)return;gf();let e=En();k0(S.cursor.x,S.cursor.z)&&!i&&(Rt.marker(e.cmd.x,e.cmd.z),Ee.move())}function hh(i,e,t,n){if(S.state!=="fight"||S.paused)return!1;let s=En();if(!z0(i,e,t)){let r=fn(s,i),a=r.id==="eclipse"&&!S.world.busy(s)&&s.cd[i]<=0&&s.ult>=100;return!a&&s.cd[i]<=.25&&(!r.ult||s.ult>=100)&&!s.air&&!s.out&&!n?S.buffer={key:i,x:e,z:t,t:.45}:n||(Ee.denied(),ze.denied(i),a&&gn(s,"\u5C04\u7A0B\u5916","word dim")),!1}return S.buffer=null,ze.castFx(i),!0}function qb(i){if(Ee.unlock(),S.state!=="fight"||S.paused)return;let e=En(),t=ch(),n=fn(e,i),s={x:t.x,z:t.z};Gt(t)&&(n.aim==="line"||n.aim==="dash"?s=bi(e.x,e.z,t,e,n.speed):n.aim==="leap"?s=xn(t,e,n.air):n.aim==="ground"&&(s=xn(t,e,n.delay))),hh(i,s.x,s.z)}df.addEventListener("mousemove",i=>{S.cursor.sx=i.clientX,S.cursor.sy=i.clientY});df.addEventListener("mousedown",i=>{if(Ee.unlock(),S.cursor.sx=i.clientX,S.cursor.sy=i.clientY,i.button===2&&S.aimKey){S.aimKey=null;return}i.button!==0&&i.button!==2||(S.mouseDown=!0,S.moveRepeat=.12,V0(!1))});window.addEventListener("mouseup",()=>{S.mouseDown=!1});window.addEventListener("contextmenu",i=>i.preventDefault());window.addEventListener("keydown",i=>{if(i.repeat||i.target.tagName==="INPUT")return;let e=i.key.toUpperCase();if(e==="ESCAPE"){S.aimKey?S.aimKey=null:oh();return}if(e==="P")return oh();if(e==="M"){Ee.unlock(),Ee.setMuted(!Ee.muted),ze.setMuted(Ee.muted);return}if(S.state!=="fight"||S.paused||!Ht.includes(e))return;Ee.unlock();let t=En(),n=fn(t,e);if(n.aim==="self"){hh(e,t.x,t.z);return}if(t.cd[e]>.25||n.ult&&t.ult<100||t.air||t.out){Ee.denied(),ze.denied(e);return}S.aimKey=e});window.addEventListener("keyup",i=>{let e=i.key.toUpperCase();e===S.aimKey&&(S.aimKey=null,gf(),hh(e,S.cursor.x,S.cursor.z))});window.addEventListener("blur",()=>{S.aimKey=null,S.mouseDown=!1,S.state==="fight"&&!S.paused&&!Xi()&&!cn.has("auto")&&oh()});function oh(){["countdown","fight","finish"].includes(S.state)&&(S.paused=!S.paused,S.aimKey=null,ze.show("pause",S.paused),Ee.ui())}var C0=()=>S.paused&&!Xi();function gn(i,e,t){let n=Rt.toScreen(i.x,Qe(i.x,i.z)+2.2,i.z);ze.pop(n.x,n.y,e,t)}function ri(i,e){if(e<1)return;let t=e>=90?"huge":e>=45?"big":"";gn(i,Math.round(e),`dmg ${i.side===S.side?"taken":"dealt"} ${t}`)}function of(i,e){e>=1&&gn(i,"+"+Math.round(e),"heal")}function H0(i){Rt.handle(i);let e=t=>t&&t.side===S.side;switch(i.type){case"clash":Ee.clash(i.power),ri(i.a,i.dmgA),ri(i.b,i.dmgB),i.kind==="parry"?(Ee.parry(),S.hitstop=.17,gn(i.src,"PARRY!","word gold"),ze.flash("#ffe9a0",.3)):i.kind==="dash"||i.kind==="empower"?(Ee.projHit(),S.hitstop=.14,gn(i.src===i.a?i.b:i.a,i.kind==="dash"?"DASH HIT!":"PHANTOM STRIKE!","word"),ze.flash(i.src.blade.css,.22)):i.power>9&&(S.hitstop=Math.max(S.hitstop,Math.min(.1,.015+i.power*.0035)));break;case"wall":Ee.wall(i.power,i.slam),ri(i.top,i.dmg),i.slam&&i.dmg>8&&(gn(i.top,"WALL SLAM","word red"),S.hitstop=Math.max(S.hitstop,.07));break;case"cast":i.windup>0&&Ee.windup(),i.skill.ult&&ze.cutIn(i.skill,i.top.blade.css,!e(i.top));break;case"blink":Ee.blink();break;case"blinkEnd":e(i.top)&&gn(i.top,"POWER UP","word gold");break;case"zone":i.zone.kind==="sanctuary"?Ee.heal():Ee.windup();break;case"quake":Ee.quake(),i.hit&&(ri(i.target,i.hit),gn(i.target,"STUN","word red"),S.hitstop=.12);break;case"charge":Ee.leap(),S.slow={s:.4,t:.25};break;case"nova":Ee.meteor(),ze.flash("#fff",.5),i.hit?(ri(i.target,i.hit),S.hitstop=.2,S.slow={s:.35,t:.45}):gn(i.top,"MISS","word dim");break;case"flare":Ee.flare(),i.hit&&(ri(i.target,i.hit),of(i.top,i.heal),S.hitstop=.07);break;case"orbs":Ee.guard();break;case"orbHit":Ee.projHit(),ri(i.target,i.dmg),S.hitstop=.06;break;case"tether":Ee.leap(),S.slow={s:.4,t:.25};break;case"drain":Ee.drain(),ri(i.target,i.dmg),of(i.top,i.heal);break;case"tetherEnd":i.broke&&!S.world.result&&gn(i.top,"BREAK","word dim");break;case"heal":of(i.top,i.amount);break;case"shoot":i.proj.skill.chain?Ee.chain():Ee.shoot();break;case"reflect":Ee.parry(),gn(i.top,"REFLECT!","word gold"),S.hitstop=.1;break;case"projHit":Ee.projHit(),ri(i.top,i.dmg),i.proj.skill.chain&&gn(i.top,"HOOKED!","word"),S.hitstop=.09;break;case"guard":Ee.guard();break;case"dash":Ee.dash();break;case"leap":Ee.leap(),S.slow={s:.3,t:.32};break;case"meteor":Ee.meteor(),ze.flash("#fff",.55),i.hit?(ri(i.target,i.hit),S.hitstop=.2,S.slow={s:.35,t:.45}):gn(i.top,"MISS","word dim");break;case"ringout":Ee.ringout();break;case"finish":Db(i);break}}function Yb(i){let e=S.net;S.outbox.length&&e.send({t:"ev",l:S.outbox.splice(0)}),(S.state==="fight"||S.state==="finish"&&S.tail>0)&&(S.snapT-=i,!(S.snapT>0)&&(S.snapT+=1/(e.congested?Ib:Pb),S.snapT<0&&(S.snapT=0),S.state==="finish"&&S.tail--,S.snapSeq=S.snapSeq+1&65535,e.sendPacket(g0(S.world,{seq:S.snapSeq,ack:S.ack,timeLeft:S.timeLeft}))))}function lf(i,e=!0){let t=S.world,n=S.net;n&&n.update(i);let s=0;if(!C0()){if(S.seq){for(S.seqT+=i;S.seq&&S.seq.length&&S.seq[0].at<=S.seqT;)S.seq.shift().run();S.seq&&!S.seq.length&&(S.seq=null)}if(t&&(S.state==="fight"||S.state==="finish")){Xi()&&S.state==="fight"&&(S.hitstop=0,S.slow.t=0);let a=1;for(S.hitstop>0?(S.hitstop-=i,a=0):S.slow.t>0&&(S.slow.t-=i,a=S.slow.s),s=i*a,S.buffer&&(S.buffer.t-=i,(hh(S.buffer.key,S.buffer.x,S.buffer.z,!0)||S.buffer&&S.buffer.t<=0)&&(S.buffer=null)),S.mouseDown&&S.state==="fight"&&!S.paused&&(S.moveRepeat-=i,S.moveRepeat<=0&&(S.moveRepeat=.1,V0(!0))),S.mode==="guest"&&S.inbox&&Wb()&&(s=0),S.acc+=s;S.acc>=Wi;){if(S.acc-=Wi,S.state==="fight"&&(S.brain&&S.brain.update(Wi),S.autoBrain&&S.autoBrain.update(Wi),S.timeLeft-=Wi,S.mode!=="guest"&&S.timeLeft<=0&&!t.result&&t.timeUp()),t.step(Wi),t.events.length){let o=t.events.splice(0);if(S.mode!=="guest")for(let c of o)S.mode==="host"&&S.outbox.push(y0(c)),H0(c)}if(S.hitstop>0){S.acc=0;break}}if(S.state==="fight"){let o=En().ult>=100;o&&!S.ultWasReady&&(Ee.ultReady(),gn(En(),"ULT READY","word gold")),S.ultWasReady=o}}S.mode==="host"&&t&&n&&n.connected&&Yb(i)}if(!e)return;S.frames++;let r=null;if(t&&S.state==="fight"&&!S.paused&&(gf(),S.aimKey&&(r={key:S.aimKey,x:S.cursor.x,z:S.cursor.z})),Rt.update(s,C0()?0:i,r),t&&["countdown","fight","finish"].includes(S.state)&&(ze.update(t,Rt,S.timeLeft,S.aimKey,i),Ee.intensity=1-Math.min(tn(En()),tn(ch()))),n&&n.connected&&n.rttKnown){let a=Math.round(n.rtt*1e3);ze.setNet(`PING ${a}ms${n.fast?"":" \u30FB \u4F4E\u901F\u56DE\u7DDA\u30E2\u30FC\u30C9"}`,a>160||!n.fast)}else Xi()||ze.setNet("");Ee.update(),cn.has("norender")||Rt.render()}var hf=performance.now();function G0(i,e){let t=Math.max(0,(i-hf)/1e3);hf=i;let n=Math.min(t,e?Xi()?.25:.05:1);for(;n>.05;)lf(.05,!1),n-=.05;lf(n,e)}function W0(i){G0(i,!0),requestAnimationFrame(W0)}requestAnimationFrame(W0);try{let i="setInterval(() => postMessage(0), 16);",e=new Worker(URL.createObjectURL(new Blob([i],{type:"text/javascript"})));e.onmessage=()=>{document.hidden&&Xi()&&S.net&&S.net.connected&&G0(performance.now(),!1)}}catch{}document.addEventListener("visibilitychange",()=>{document.hidden||(hf=performance.now())});window.addEventListener("pagehide",()=>{S.net&&S.net.leave()});to();ze.setMuted(!1);document.getElementById("version").textContent=uf;window.__gc={game:S,view:Rt,ui:ze,audio:Ee,frame:lf,startMatch:ah,openRoom:ff,joinRoom:O0,BLADES:$t};var R0=A0(cn.get("room"));R0.length===6?O0(R0):cn.has("host")?ff():cn.has("demo")&&ah(cn.get("blade")||"azure",Number(cn.get("level")||1));})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
