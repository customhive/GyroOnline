(()=>{var mg=Object.create;var vh=Object.defineProperty;var gg=Object.getOwnPropertyDescriptor;var xg=Object.getOwnPropertyNames;var _g=Object.getPrototypeOf,yg=Object.prototype.hasOwnProperty;var vg=i=>{throw TypeError(i)};var bg=(i,e)=>()=>{try{return e||i((e={exports:{}}).exports,e),e.exports}catch(t){throw e=0,t}},uo=(i,e)=>{for(var t in e)vh(i,t,{get:e[t],enumerable:!0})},Mg=(i,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of xg(e))!yg.call(i,s)&&s!==t&&vh(i,s,{get:()=>e[s],enumerable:!(n=gg(e,s))||n.enumerable});return i};var Of=(i,e,t)=>(t=i!=null?mg(_g(i)):{},Mg(e||!i||!i.__esModule?vh(t,"default",{value:i,enumerable:!0}):t,i));var Rr=(i,e,t)=>e.has(i)?vg("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(i):e.set(i,t);var Fd=bg((yw,Od)=>{"use strict";var oe={};oe.generateIdentifier=function(){return Math.random().toString(36).substring(2,12)};oe.localCName=oe.generateIdentifier();oe.splitLines=function(i){return i.trim().split(`
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
`),e};oe.parseRtpParameters=function(i){let e={codecs:[],headerExtensions:[],fecMechanisms:[],rtcp:[]},n=oe.splitLines(i)[0].split(" ");e.profile=n[2];for(let r=3;r<n.length;r++){let a=n[r],o=oe.matchPrefix(i,"a=rtpmap:"+a+" ")[0];if(o){let l=oe.parseRtpMap(o),c=oe.matchPrefix(i,"a=fmtp:"+a+" ");switch(l.parameters=c.length?oe.parseFmtp(c[0]):{},l.rtcpFeedback=oe.matchPrefix(i,"a=rtcp-fb:"+a+" ").map(oe.parseRtcpFb),e.codecs.push(l),l.name.toUpperCase()){case"RED":case"ULPFEC":e.fecMechanisms.push(l.name.toUpperCase());break;default:break}}}oe.matchPrefix(i,"a=extmap:").forEach(r=>{e.headerExtensions.push(oe.parseExtmap(r))});let s=oe.matchPrefix(i,"a=rtcp-fb:* ").map(oe.parseRtcpFb);return e.codecs.forEach(r=>{s.forEach(a=>{r.rtcpFeedback.find(l=>l.type===a.type&&l.parameter===a.parameter)||r.rtcpFeedback.push(a)})}),e};oe.writeRtpDescription=function(i,e){let t="";t+="m="+i+" ",t+=e.codecs.length>0?"9":"0",t+=" "+(e.profile||"UDP/TLS/RTP/SAVPF")+" ",t+=e.codecs.map(s=>s.preferredPayloadType!==void 0?s.preferredPayloadType:s.payloadType).join(" ")+`\r
`,t+=`c=IN IP4 0.0.0.0\r
`,t+=`a=rtcp:9 IN IP4 0.0.0.0\r
`,e.codecs.forEach(s=>{t+=oe.writeRtpMap(s),t+=oe.writeFmtp(s),t+=oe.writeRtcpFb(s)});let n=0;return e.codecs.forEach(s=>{s.maxptime>n&&(n=s.maxptime)}),n>0&&(t+="a=maxptime:"+n+`\r
`),e.headerExtensions&&e.headerExtensions.forEach(s=>{t+=oe.writeExtmap(s)}),t};oe.parseRtpEncodingParameters=function(i){let e=[],t=oe.parseRtpParameters(i),n=t.fecMechanisms.indexOf("RED")!==-1,s=t.fecMechanisms.indexOf("ULPFEC")!==-1,r=oe.matchPrefix(i,"a=ssrc:").map(h=>oe.parseSsrcMedia(h)).filter(h=>h.attribute==="cname"),a=r.length>0&&r[0].ssrc,o,l=oe.matchPrefix(i,"a=ssrc-group:FID").map(h=>h.substring(17).split(" ").map(d=>parseInt(d,10)));l.length>0&&l[0].length>1&&l[0][0]===a&&(o=l[0][1]),t.codecs.forEach(h=>{if(h.name.toUpperCase()==="RTX"&&h.parameters.apt){let u={ssrc:a,codecPayloadType:parseInt(h.parameters.apt,10)};a&&o&&(u.rtx={ssrc:o}),e.push(u),n&&(u=JSON.parse(JSON.stringify(u)),u.fec={ssrc:a,mechanism:s?"red+ulpfec":"red"},e.push(u))}}),e.length===0&&a&&e.push({ssrc:a});let c=oe.matchPrefix(i,"b=");return c.length&&(c[0].indexOf("b=TIAS:")===0?c=parseInt(c[0].substring(7),10):c[0].indexOf("b=AS:")===0?c=parseInt(c[0].substring(5),10)*1e3*.95-2e3*8:c=void 0,e.forEach(h=>{h.maxBitrate=c})),e};oe.parseRtcpParameters=function(i){let e={},t=oe.matchPrefix(i,"a=ssrc:").map(r=>oe.parseSsrcMedia(r)).filter(r=>r.attribute==="cname")[0];t&&(e.cname=t.value,e.ssrc=t.ssrc);let n=oe.matchPrefix(i,"a=rtcp-rsize");e.reducedSize=n.length>0,e.compound=n.length===0;let s=oe.matchPrefix(i,"a=rtcp-mux");return e.mux=s.length>0,e};oe.writeRtcpParameters=function(i){let e="";return i.reducedSize&&(e+=`a=rtcp-rsize\r
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
`};oe.getDirection=function(i,e){let t=oe.splitLines(i);for(let n=0;n<t.length;n++)switch(t[n]){case"a=sendrecv":case"a=sendonly":case"a=recvonly":case"a=inactive":return t[n].substring(2);default:}return e?oe.getDirection(e):"sendrecv"};oe.getKind=function(i){return oe.splitLines(i)[0].split(" ")[0].substring(2)};oe.isRejected=function(i){return i.split(" ",2)[1]==="0"};oe.parseMLine=function(i){let t=oe.splitLines(i)[0].substring(2).split(" ");return{kind:t[0],port:parseInt(t[1],10),protocol:t[2],fmt:t.slice(3).join(" ")}};oe.parseOLine=function(i){let t=oe.matchPrefix(i,"o=")[0].substring(2).split(" ");return{username:t[0],sessionId:t[1],sessionVersion:parseInt(t[2],10),netType:t[3],addressType:t[4],address:t[5]}};oe.isValidSDP=function(i){if(typeof i!="string"||i.length===0)return!1;let e=oe.splitLines(i);for(let t=0;t<e.length;t++)if(e[t].length<2||e[t].charAt(1)!=="=")return!1;return!0};typeof Od=="object"&&(Od.exports=oe)});var ut={R:13,H:2.4,K:3,wallE:.7,ringOutSpeed:16.5},Zi=i=>{let e=Math.min(i,ut.R)/ut.R;return ut.H*e*e},bh=75,ji=2,$t={azure:{id:"azure",kit:{Q:"sonic",W:"phantom",E:"blitz",R:"meteor"},name:"\u30A2\u30BA\u30FC\u30EB\u30FB\u30D5\u30A1\u30F3\u30B0",en:"AZURE FANG",type:"ATTACK",typeJa:"\u30A2\u30BF\u30C3\u30AF",color:3127551,css:"#2fb8ff",teeth:3,atk:1.27,def:.94,mass:1,speed:15.5,decay:7,spinMax:1e3,cdMul:1,guardMul:1,bars:{atk:5,def:2,sta:2,spd:5},desc:"\u98DB\u3073\u9053\u5177\u30FB\u77AC\u9593\u79FB\u52D5\u30FB\u7A81\u9032\u3067\u653B\u3081\u7ACB\u3066\u308B\u30D2\u30C3\u30C8\u30A2\u30F3\u30C9\u30A2\u30A6\u30A7\u30A4\u578B\u3002"},gaia:{id:"gaia",kit:{Q:"quake",W:"aegis",E:"anchor",R:"nova"},name:"\u30AC\u30A4\u30A2\u30FB\u30D0\u30B9\u30C6\u30A3\u30AA\u30F3",en:"GAIA BASTION",type:"DEFENSE",typeJa:"\u30C7\u30A3\u30D5\u30A7\u30F3\u30B9",color:5106314,css:"#4dea8a",teeth:6,atk:1.04,def:1.28,mass:1.35,speed:12.5,decay:5.6,spinMax:1e3,cdMul:1,guardMul:1.35,bars:{atk:2,def:5,sta:3,spd:2},desc:"\u8DB3\u6B62\u3081\u30FB\u5F15\u304D\u5BC4\u305B\u30FB\u30D1\u30EA\u30A3\u3067\u76F8\u624B\u3092\u6355\u307E\u3048\u308B\u30AB\u30A6\u30F3\u30BF\u30FC\u578B\u3002"},sol:{id:"sol",kit:{Q:"flare",W:"sanctuary",E:"satellite",R:"eclipse"},name:"\u30BD\u30EB\u30FB\u30A8\u30BF\u30FC\u30CA\u30EB",en:"SOL ETERNAL",type:"STAMINA",typeJa:"\u30B9\u30BF\u30DF\u30CA",color:16758062,css:"#ffb52e",teeth:4,atk:.96,def:1,mass:1.05,speed:14,decay:5.4,spinMax:1040,cdMul:.9,guardMul:1,bars:{atk:3,def:3,sta:5,spd:3},desc:"\u56DE\u8EE2\u3092\u5438\u53CE\u30FB\u56DE\u5FA9\u3057\u306A\u304C\u3089\u7C98\u308A\u52DD\u3064\u30C9\u30EC\u30A4\u30F3\u578B\u3002"},gale:{id:"gale",kit:{Q:"galeq",W:"windwall",E:"sweep",R:"lastbreath"},name:"\u30B2\u30A4\u30EB\u30FB\u30ED\u30F3\u30C9",en:"GALE RONDO",type:"ATTACK",typeJa:"\u30A2\u30BF\u30C3\u30AF",color:14674674,css:"#dfeaf2",teeth:4,atk:1.25,def:1,mass:.95,speed:15.5,decay:7,spinMax:1e3,cdMul:1,guardMul:1,bars:{atk:5,def:2,sta:2,spd:5},desc:"\u98A8\u3092\u6E9C\u3081\u3066\u7ADC\u5DFB\u3067\u6253\u3061\u4E0A\u3052\u3001\u7A7A\u4E2D\u306E\u76F8\u624B\u306B\u5FC5\u6BBA\u6280\u3092\u53E9\u304D\u8FBC\u3080\u3002"},nox:{id:"nox",kit:{Q:"shuriken",W:"shadow",E:"slash",R:"deathmark"},name:"\u30CE\u30AF\u30B9\u30FB\u30B7\u30A7\u30A4\u30C9",en:"NOX SHADE",type:"ATTACK",typeJa:"\u30A2\u30BF\u30C3\u30AF",color:8029864,css:"#7a86a8",teeth:3,atk:1.25,def:.94,mass:.95,speed:15.5,decay:7,spinMax:1e3,cdMul:1,guardMul:1,bars:{atk:5,def:1,sta:2,spd:5},desc:"\u5F71\u3092\u7F6E\u304D\u3001\u672C\u4F53\u3068\u5F71\u306E\u4E8C\u65B9\u5411\u304B\u3089\u653B\u3081\u308B\u3002\u5F71\u3068\u306F\u4F4D\u7F6E\u3092\u5165\u308C\u66FF\u3048\u3089\u308C\u308B\u3002"},curtain:{id:"curtain",kit:{Q:"fourshot",W:"flourish",E:"lotus",R:"curtaincall"},name:"\u30AB\u30FC\u30C6\u30F3\u30B3\u30FC\u30EB",en:"CURTAIN CALL",type:"ATTACK",typeJa:"\u30A2\u30BF\u30C3\u30AF",color:16736176,css:"#ff5fb0",teeth:4,atk:1.2,def:.94,mass:.95,speed:13.5,decay:6.6,spinMax:1e3,cdMul:1,guardMul:1,bars:{atk:5,def:2,sta:3,spd:2},desc:"4\u767A\u88C5\u586B\u306E\u9060\u8DDD\u96E2\u578B\u30024\u767A\u76EE\u3068\u5FC5\u6BBA\u6280\u306E\u6700\u5F8C\u306E\u4E00\u767A\u304C\u91CD\u3044\u3002"},frost:{id:"frost",kit:{Q:"flashfrost",W:"icewall",E:"frostbite",R:"blizzard"},name:"\u30D5\u30ED\u30B9\u30C8\u30FB\u30D5\u30A7\u30CB\u30C3\u30AF\u30B9",en:"FROST PHOENIX",type:"DEFENSE",typeJa:"\u30C7\u30A3\u30D5\u30A7\u30F3\u30B9",color:10475775,css:"#9fd8ff",teeth:6,atk:1.05,def:1.1,mass:1.15,speed:12.5,decay:5.8,spinMax:1e3,cdMul:1,guardMul:1,bars:{atk:3,def:4,sta:4,spd:2},egg:{dur:3,hp:150,back:.3},desc:"\u6C37\u306E\u58C1\u3068\u5439\u96EA\u3067\u52D5\u304D\u3092\u7E1B\u308B\u30021\u30E9\u30A6\u30F3\u30C9\u306B1\u5EA6\u3001\u56DE\u8EE2\u304C\u5C3D\u304D\u3066\u3082\u5375\u306B\u306A\u308A\u30013\u79D2\u8010\u3048\u308C\u3070\u5FA9\u6D3B\u3059\u308B\u3002"},edge:{id:"edge",kit:{Q:"brokenwings",W:"kiburst",E:"valor",R:"exile"},name:"\u30D6\u30ED\u30FC\u30AF\u30F3\u30FB\u30A8\u30C3\u30B8",en:"BROKEN EDGE",type:"ATTACK",typeJa:"\u30A2\u30BF\u30C3\u30AF",color:3073728,css:"#2ee6c0",teeth:3,atk:1.15,def:1,mass:1.05,speed:15,decay:6.8,spinMax:1e3,cdMul:1,guardMul:1,bars:{atk:4,def:3,sta:2,spd:4},buff:{atk:1.15},desc:"\u5C0F\u523B\u307F\u306A\u7A81\u9032\u3092\u3064\u306A\u3044\u3067\u5F35\u308A\u4ED8\u304D\u3001\u5F31\u3063\u305F\u76F8\u624B\u3092\u65AC\u6483\u3067\u4ED5\u7559\u3081\u308B\u3002"},mirage:{id:"mirage",kit:{Q:"sigil",W:"distort",E:"ethereal",R:"mimic"},name:"\u30DF\u30E9\u30FC\u30B8\u30E5\u30FB\u30C8\u30EA\u30C3\u30AF",en:"MIRAGE TRICK",type:"ATTACK",typeJa:"\u30A2\u30BF\u30C3\u30AF",color:11561983,css:"#b06bff",teeth:5,atk:1.25,def:.94,mass:.92,speed:15.5,decay:6.8,spinMax:1e3,cdMul:1,guardMul:1,bars:{atk:4,def:2,sta:2,spd:5},buff:{atk:1.4},desc:"\u98DB\u3073\u8FBC\u3093\u3067\u306F\u5143\u306E\u4F4D\u7F6E\u3078\u623B\u308A\u3001\u76F4\u524D\u306E\u6280\u3092\u3082\u3046\u4E00\u5EA6\u4F7F\u3063\u3066\u60D1\u308F\u3059\u3002"},guillo:{id:"guillo",kit:{Q:"decimate",W:"cripple",E:"apprehend",R:"guillotine"},name:"\u30AE\u30ED\u30C1\u30F3\u30FB\u30ED\u30FC\u30C9",en:"GUILLOTINE LORD",type:"DEFENSE",typeJa:"\u30C7\u30A3\u30D5\u30A7\u30F3\u30B9",color:15220782,css:"#e8402e",teeth:4,atk:1.04,def:1.1,mass:1.25,speed:12.5,decay:6,spinMax:1e3,cdMul:1,guardMul:1,bars:{atk:4,def:4,sta:3,spd:2},might:1.15,desc:"Q\u30FBW\u30FBE\u3092\u5F53\u3066\u308B\u305F\u3073\u306B\u51FA\u8840\u3092\u91CD\u306D\u308B\u30025\u30B9\u30BF\u30C3\u30AF\u3067\u653B\u6483\u529B\u304C\u4E0A\u304C\u308A\u3001\u5FC5\u6BBA\u6280\u306E\u5A01\u529B\u3082\u8DF3\u306D\u4E0A\u304C\u308B\u3002"},venom:{id:"venom",kit:{Q:"poison",W:"glue",E:"fling",R:"insanity"},name:"\u30F4\u30A7\u30CE\u30E0\u30FB\u30C8\u30EC\u30A4\u30EB",en:"VENOM TRAIL",type:"STAMINA",typeJa:"\u30B9\u30BF\u30DF\u30CA",color:10805802,css:"#a4e22a",teeth:5,atk:.95,def:1.1,mass:1.2,speed:14.5,decay:5.2,spinMax:1060,cdMul:1,guardMul:1,bars:{atk:2,def:4,sta:5,spd:3},buff:{speed:1.3,armor:.75,regen:12},desc:"\u8D70\u3063\u305F\u8DE1\u3092\u6BD2\u306B\u5909\u3048\u3001\u8FFD\u3044\u304B\u3051\u3066\u304F\u308B\u76F8\u624B\u3092\u524A\u308B\u3002\u8FD1\u3065\u304B\u308C\u305F\u3089\u80CC\u5F8C\u3078\u6295\u3052\u98DB\u3070\u3059\u3002"},gear:{id:"gear",kit:{Q:"turret",W:"rockets",E:"grenade",R:"upgrade"},name:"\u30BF\u30FC\u30EC\u30C3\u30C8\u30FB\u30A8\u30F3\u30B8\u30CB\u30A2",en:"TURRET ENGINEER",type:"STAMINA",typeJa:"\u30B9\u30BF\u30DF\u30CA",color:16745544,css:"#ff8448",teeth:6,atk:1,def:1,mass:1,speed:13.5,decay:5,spinMax:1e3,cdMul:1,guardMul:1,bars:{atk:3,def:2,sta:4,spd:3},desc:"\u7832\u53F0\u3092\u4E26\u3079\u3066\u9663\u5730\u3092\u4F5C\u308B\u8A2D\u7F6E\u578B\u3002\u5FC5\u6BBA\u6280\u3067\u6B21\u306E\u30B9\u30AD\u30EB\u3092\u5F37\u5316\u3059\u308B\u3002"},sand:{id:"sand",kit:{Q:"conquer",W:"arise",E:"shift",R:"divide"},name:"\u30B5\u30F3\u30C9\u30FB\u30A8\u30F3\u30DA\u30E9\u30FC",en:"SAND EMPEROR",type:"DEFENSE",typeJa:"\u30C7\u30A3\u30D5\u30A7\u30F3\u30B9",color:15126410,css:"#e6cf8a",teeth:5,atk:1.05,def:.98,mass:.98,speed:13.5,decay:5.8,spinMax:1e3,cdMul:1,guardMul:1,bars:{atk:3,def:3,sta:3,spd:3},desc:"\u5206\u8EAB\u306E\u7802\u5175\u3092\u7F6E\u3044\u3066\u6226\u308F\u305B\u308B\u3002\u7802\u5175\u306E\u58C1\u3067\u76F8\u624B\u3092\u7E01\u307E\u3067\u62BC\u3057\u51FA\u3059\u3002"}},Ff=16726862,Ji={max:5,dur:8,dps:3},Re={sonic:{name:"\u30BD\u30CB\u30C3\u30AF\u30A8\u30C3\u30B8",en:"SONIC EDGE",aim:"line",cd:3.5,tele:.42,range:17,speed:34,radius:.85,dmg:46,kb:9.5,slow:1.2,desc:"\u72D9\u3063\u305F\u65B9\u5411\u3078\u885D\u6483\u6CE2\u3092\u653E\u3064\u3002\u547D\u4E2D\u3057\u305F\u76F8\u624B\u3092\u5F3E\u304D\u98DB\u3070\u3057\u3001\u5C11\u3057\u306E\u9593\u30B9\u30ED\u30A6\u306B\u3059\u308B\u3002"},phantom:{name:"\u30D5\u30A1\u30F3\u30C8\u30E0\u30B9\u30C6\u30C3\u30D7",en:"PHANTOM STEP",aim:"blink",cd:7,range:6,speed:30,empower:3,bonus:40,kb:8,desc:"\u6B8B\u50CF\u3092\u6B8B\u3057\u3066\u77AC\u9593\u79FB\u52D5\u3059\u308B\u3002\u79FB\u52D5\u4E2D\u306F\u7121\u6575\u3002\u305D\u306E\u5F8C3\u79D2\u9593\u3001\u6B21\u306E\u4F53\u5F53\u305F\u308A\u304C\u5F37\u5316\u3055\u308C\u308B\u3002"},blitz:{name:"\u30D6\u30EA\u30C3\u30C4\u30C0\u30C3\u30B7\u30E5",en:"BLITZ DASH",aim:"dash",cd:6,tele:.48,dist:9.5,minDist:4,speed:40,dmg:54,kb:13.5,desc:"\u72D9\u3063\u305F\u5730\u70B9\u3078\u9AD8\u901F\u3067\u7A81\u9032\u3059\u308B\u3002\u5F53\u3066\u308B\u3068\u5927\u30C0\u30E1\u30FC\u30B8\u3068\u5F37\u3044\u30CE\u30C3\u30AF\u30D0\u30C3\u30AF\u3002"},meteor:{name:"\u30E1\u30C6\u30AA\u30C9\u30E9\u30A4\u30D6",en:"METEOR DRIVE",aim:"leap",cd:2,ult:!0,range:11.5,aoe:4.6,air:1,height:7.5,dmg:165,kb:18.5,desc:"\u3010\u5FC5\u6BBA\u6280\u3011\u7A7A\u9AD8\u304F\u8DF3\u3073\u3001\u6307\u5B9A\u5730\u70B9\u3078\u843D\u4E0B\u3057\u3066\u5468\u56F2\u3092\u5439\u304D\u98DB\u3070\u3059\u3002"},quake:{name:"\u30AF\u30A8\u30A4\u30AF\u30D4\u30E9\u30FC",en:"QUAKE PILLAR",aim:"ground",cd:4.5,tele:.2,range:10.5,aoe:2.8,delay:.6,dmg:72,stun:1,kb:4,desc:"\u6307\u5B9A\u5730\u70B9\u306E\u5E8A\u3092\u5C11\u3057\u9045\u308C\u3066\u7A81\u304D\u4E0A\u3052\u308B\u3002\u5DFB\u304D\u8FBC\u3093\u3060\u76F8\u624B\u306B\u30C0\u30E1\u30FC\u30B8\u3092\u4E0E\u3048\u3001\u52D5\u304D\u3092\u6B62\u3081\u308B\u3002"},aegis:{name:"\u30A4\u30FC\u30B8\u30B9\u30AC\u30FC\u30C9",en:"AEGIS GUARD",aim:"self",cd:7,dur:1.4,parryDmg:36,desc:"\u77ED\u6642\u9593\u30D0\u30EA\u30A2\u3092\u5F35\u308B\u3002\u4F53\u5F53\u305F\u308A\u3092\u53D7\u3051\u308B\u3068\u30D1\u30EA\u30A3\u3057\u3066\u53CD\u6483\u3001\u98DB\u3073\u9053\u5177\u306F\u6483\u3061\u8FD4\u3059\u3002"},anchor:{name:"\u30A2\u30F3\u30AB\u30FC\u30C1\u30A7\u30FC\u30F3",en:"ANCHOR CHAIN",aim:"line",cd:8,tele:.45,range:13.5,speed:30,radius:.85,dmg:36,pull:19,slow:1.8,chain:!0,desc:"\u9396\u3092\u6483\u3061\u51FA\u3057\u3001\u547D\u4E2D\u3057\u305F\u76F8\u624B\u3092\u81EA\u5206\u306E\u65B9\u3078\u5F15\u304D\u5BC4\u305B\u308B\u3002"},nova:{name:"\u30D5\u30A9\u30FC\u30C8\u30EC\u30B9\u30CE\u30F4\u30A1",en:"FORTRESS NOVA",aim:"self",cd:2,ult:!0,charge:.8,root:!0,aoe:6.5,dmg:185,kb:20,armor:.3,desc:"\u3010\u5FC5\u6BBA\u6280\u3011\u305D\u306E\u5834\u3067\u529B\u3092\u6E9C\u3081\uFF08\u6E9C\u3081\u4E2D\u306F\u88AB\u30C0\u30E1\u30FC\u30B8\u6FC0\u6E1B\uFF09\u3001\u5468\u56F2\u4E00\u5E2F\u3092\u5439\u304D\u98DB\u3070\u3059\u3002"},flare:{name:"\u30D7\u30ED\u30DF\u30CD\u30F3\u30B9",en:"PROMINENCE",aim:"cone",cd:4.5,tele:.36,range:6.8,half:.6,dmg:42,heal:.4,kb:6,desc:"\u6247\u72B6\u306B\u708E\u3092\u5674\u304D\u51FA\u3059\u3002\u4E0E\u3048\u305F\u30C0\u30E1\u30FC\u30B8\u306E40%\u3076\u3093\u81EA\u5206\u306E\u56DE\u8EE2\u304C\u56DE\u5FA9\u3059\u308B\u3002"},sanctuary:{name:"\u30B5\u30F3\u30AF\u30C1\u30E5\u30A2\u30EA",en:"SANCTUARY",aim:"self",cd:12,radius:4.4,dur:5,regen:13,desc:"\u8DB3\u5143\u306B\u967D\u3060\u307E\u308A\u3092\u4F5C\u308B\u3002\u4E2D\u306B\u3044\u308B\u9593\u306F\u56DE\u8EE2\u304C\u56DE\u5FA9\u3057\u7D9A\u3051\u3001\u8E0F\u307F\u8FBC\u3093\u3060\u76F8\u624B\u306F\u30B9\u30ED\u30A6\u306B\u306A\u308B\u3002"},satellite:{name:"\u30B5\u30C6\u30E9\u30A4\u30C8",en:"SATELLITE",aim:"self",cd:9,count:3,dur:6,orbit:2.5,size:.55,dmg:21,kb:7,desc:"3\u3064\u306E\u5149\u7403\u30926\u79D2\u9593\u307E\u3068\u3046\u3002\u89E6\u308C\u305F\u76F8\u624B\u306B\u30C0\u30E1\u30FC\u30B8\u3092\u4E0E\u3048\u3066\u5F3E\u304F\u3002"},eclipse:{name:"\u30A8\u30AF\u30EA\u30D7\u30B9",en:"ECLIPSE",aim:"self",cd:2,ult:!0,need:"range",range:9.5,breakRange:12.5,dur:3,drain:38,heal:.5,desc:"\u3010\u5FC5\u6BBA\u6280\u3011\u8FD1\u304F\u306E\u76F8\u624B\u3068\u5149\u306E\u5E2F\u3067\u3064\u306A\u304C\u308A\u30013\u79D2\u9593\u56DE\u8EE2\u3092\u5438\u3044\u53D6\u308A\u7D9A\u3051\u308B\u3002\u96E2\u308C\u3059\u304E\u308B\u3068\u5207\u308C\u308B\u3002"},galeq:{name:"\u65CB\u98A8\u5203",en:"STEEL GALE",aim:"line",cd:2.4,tele:.3,range:7.5,speed:46,radius:1,dmg:42,kb:4,tumble:.15,launch:0,stacks:2,keep:8,desc:"\u77ED\u3044\u7A81\u304D\u3092\u653E\u3064\u3002Q\u304BE\u3092\u5408\u308F\u305B\u30662\u56DE\u5F53\u3066\u308B\u3068\u3001\u6B21\u306E\u4E00\u6483\u304C\u76F8\u624B\u3092\u6253\u3061\u4E0A\u3052\u308B\u9577\u5C04\u7A0B\u306E\u7ADC\u5DFB\u306B\u306A\u308B\u3002"},tornado:{name:"\u65CB\u98A8",en:"TORNADO",aim:"line",hidden:!0,range:15,speed:26,radius:1.6,dmg:56,up:1.2},windwall:{name:"\u98A8\u306E\u58C1",en:"WIND WALL",aim:"line",cd:14,ahead:2.8,wall:3.2,dur:4,desc:"\u72D9\u3063\u305F\u65B9\u5411\u306B\u98A8\u306E\u58C1\u30924\u79D2\u5F35\u308B\u3002\u76F8\u624B\u306E\u98DB\u3073\u9053\u5177\u3092\u6D88\u3059\u3002"},sweep:{name:"\u98AF\u6B69",en:"SWEEPING BLADE",aim:"dash",cd:3,tele:.35,dist:5.5,minDist:5.5,speed:36,through:!0,pass:36,slow:.4,desc:"\u76F8\u624B\u3092\u3059\u308A\u629C\u3051\u308B\u77ED\u3044\u7A81\u9032\u3002\u3059\u308C\u9055\u3044\u3056\u307E\u306B\u30C0\u30E1\u30FC\u30B8\u3092\u4E0E\u3048\u3001Q\u306E\u98A8\u3082\u6E9C\u307E\u308B\u3002"},lastbreath:{name:"\u7D42\u306E\u606F\u5439",en:"LAST BREATH",aim:"self",cd:2,ult:!0,need:"up",range:15,dmg:170,kb:12,gap:2.6,desc:"\u3010\u5FC5\u6BBA\u6280\u3011\u6253\u3061\u4E0A\u3052\u4E2D\u306E\u76F8\u624B\u306B\u3060\u3051\u4F7F\u3048\u308B\u3002\u77AC\u6642\u306B\u98DB\u3073\u3064\u304D\u3001\u9023\u6483\u3057\u3066\u5916\u5074\u3078\u53E9\u304D\u843D\u3068\u3059\u3002"},shuriken:{name:"\u5F71\u624B\u88CF\u5263",en:"RAZOR SHURIKEN",aim:"line",cd:3.5,tele:.4,range:15,speed:36,radius:.8,dmg:44,kb:5,tumble:.2,desc:"\u624B\u88CF\u5263\u3092\u6295\u3052\u308B\u3002\u5F71\u304C\u3042\u308C\u3070\u3001\u5F71\u304B\u3089\u3082\u540C\u3058\u5730\u70B9\u3078\u5411\u3051\u3066\u6295\u3052\u308B\u3002"},shadow:{name:"\u5F71\u5206\u8EAB",en:"LIVING SHADOW",aim:"ground",cd:9,re:"swap",range:8,aoe:1.3,dur:4.5,max:2,desc:"\u6307\u5B9A\u5730\u70B9\u306B\u5F71\u30924.5\u79D2\u7F6E\u304F\u3002\u3082\u3046\u4E00\u5EA6\u62BC\u3059\u3068\u5F71\u3068\u4F4D\u7F6E\u3092\u5165\u308C\u66FF\u3048\u308B\u3002"},swap:{name:"\u5F71\u6E21\u308A",en:"SHADOW SWAP",aim:"self",hidden:!0},slash:{name:"\u5F71\u8599\u304E",en:"SHADOW SLASH",aim:"self",cd:5,aoe:3.3,dmg:44,kb:5,tumble:.2,shadowSlow:1.6,desc:"\u672C\u4F53\u3068\u5F71\u306E\u5468\u56F2\u3092\u540C\u6642\u306B\u65AC\u308B\u3002\u5F71\u306E\u65AC\u6483\u304C\u5F53\u305F\u308B\u3068\u30B9\u30ED\u30A6\u3002"},deathmark:{name:"\u6B7B\u306E\u523B\u5370",en:"DEATH MARK",aim:"self",cd:2,ult:!0,need:"range",range:10,gap:2.6,dur:3,pop:80,share:.5,desc:"\u3010\u5FC5\u6BBA\u6280\u3011\u76F8\u624B\u306E\u80CC\u5F8C\u3078\u77AC\u6642\u306B\u56DE\u308A\u8FBC\u307F\u3001\u523B\u5370\u3092\u4ED8\u3051\u308B\u30023\u79D2\u9593\u306B\u4E0E\u3048\u305F\u30C0\u30E1\u30FC\u30B8\u306E50%\u304C\u6700\u5F8C\u306B\u307E\u3068\u3081\u3066\u70B8\u88C2\u3059\u308B\u3002"},fourshot:{name:"\u56DB\u62CD\u5B50",en:"FOUR COUNT",aim:"line",cd:1.5,tele:.3,range:16,speed:38,radius:.75,dmg:30,kb:5,tumble:.15,shots:4,reload:5,desc:"\u5F3E\u3092\u6483\u3064\u30024\u767A\u76EE\u306F\u76F8\u624B\u306E\u56DE\u8EE2\u304C\u6E1B\u3063\u3066\u3044\u308B\u307B\u3069\u5A01\u529B\u304C\u4E0A\u304C\u308A\u3001\u6483\u3063\u305F\u3042\u3068\u306F\u88C5\u586B\u304C\u5165\u308B\u3002"},fourth:{name:"\u56DB\u767A\u76EE",en:"FOURTH SHOT",aim:"line",hidden:!0,range:18,speed:42,radius:1,dmg:52,kb:11,exec:.8},flourish:{name:"\u81F4\u547D\u306E\u4E00\u9583",en:"DEADLY FLOURISH",aim:"line",cd:9,tele:.45,range:22,speed:60,radius:.6,dmg:40,slow:1.5,root:1.2,desc:"\u7D30\u304F\u9577\u3044\u5F3E\u3092\u6483\u3061\u30B9\u30ED\u30A6\u306B\u3059\u308B\u3002\u76F4\u524D2.5\u79D2\u306B\u81EA\u5206\u306E\u653B\u6483\u304C\u5F53\u305F\u3063\u3066\u3044\u308C\u3070\u3001\u30B9\u30BF\u30F3\u306B\u5909\u308F\u308B\u3002"},lotus:{name:"\u84EE\u306E\u7F60",en:"LOTUS TRAP",aim:"ground",cd:8,range:9,aoe:3,trig:1.7,arm:.6,fuse:.9,dur:20,max:2,dmg:60,slow:2,kb:5,desc:"\u898B\u3048\u306B\u304F\u3044\u7F60\u3092\u7F6E\u304F\uFF08\u6700\u59272\u500B\uFF09\u3002\u8E0F\u3093\u3060\u76F8\u624B\u3092\u30B9\u30ED\u30A6\u306B\u3057\u3001\u5C11\u3057\u9045\u308C\u3066\u7206\u767A\u3059\u308B\u3002"},curtaincall:{name:"\u7D42\u5E55",en:"CURTAIN CALL",aim:"cone",cd:2,ult:!0,range:26,half:.5,shots:4,first:.5,every:.75,desc:"\u3010\u5FC5\u6BBA\u6280\u3011\u305D\u306E\u5834\u306B\u7559\u307E\u308A\u3001\u6247\u306E\u4E2D\u306B\u3044\u308B\u76F8\u624B\u3092\u72D9\u3063\u3066\u8D85\u9577\u5C04\u7A0B\u5F3E\u30924\u767A\u6483\u3064\u3002\u6700\u5F8C\u306E\u4E00\u767A\u306F\u7279\u5927\u3002"},curtainshot:{name:"\u7D42\u5E55",en:"CURTAIN CALL",aim:"line",hidden:!0,range:30,speed:46,radius:1,dmg:50,kb:7,slow:1},curtainlast:{name:"\u7D42\u5E55",en:"CURTAIN CALL",aim:"line",hidden:!0,range:30,speed:46,radius:1.4,dmg:105,kb:15,slow:1.5,exec:.5},flashfrost:{name:"\u6C37\u9583",en:"FLASH FROST",aim:"line",cd:8,tele:.3,re:"shatter",range:14,speed:13,radius:1.2,dmg:32,slow:1.5,pierce:!0,desc:"\u3086\u3063\u304F\u308A\u9032\u3080\u6C37\u7403\u3092\u6483\u3061\u3001\u901A\u904E\u3057\u305F\u76F8\u624B\u3092\u30B9\u30ED\u30A6\u306B\u3059\u308B\u3002\u3082\u3046\u4E00\u5EA6\u62BC\u3059\u3068\u305D\u306E\u5834\u3067\u70B8\u88C2\u3057\u3001\u5468\u56F2\u3092\u30B9\u30BF\u30F3\u3002"},shatter:{name:"\u6C37\u9583\u30FB\u70B8\u88C2",en:"SHATTER",aim:"self",hidden:!0,aoe:3.3,dmg:52,stun:1.1},icewall:{name:"\u6C37\u58C1",en:"CRYSTALLIZE",aim:"ground",cd:14,range:9,wall:3.2,aoe:3.2,dur:4,solid:!0,desc:"\u72D9\u3063\u305F\u5730\u70B9\u306B\u6C37\u306E\u58C1\u30924\u79D2\u4F5C\u308B\u3002\u30B3\u30DE\u3082\u98DB\u3073\u9053\u5177\u3082\u901A\u308C\u306A\u3044\u3002"},frostbite:{name:"\u51CD\u50B7",en:"FROSTBITE",aim:"line",cd:4,tele:.35,range:8.5,speed:30,radius:.8,dmg:40,kb:3,tumble:.1,chill:2,desc:"\u77ED\u5C04\u7A0B\u306E\u6C37\u5F3E\u3002\u30B9\u30ED\u30A6\u30FB\u30B9\u30BF\u30F3\u30FB\u6253\u3061\u4E0A\u3052\u4E2D\u306E\u76F8\u624B\u306B\u306F2\u500D\u306E\u30C0\u30E1\u30FC\u30B8\u3002"},blizzard:{name:"\u5439\u96EA",en:"GLACIAL STORM",aim:"ground",cd:2,ult:!0,range:10,aoe:5.6,r0:2.6,grow:1.5,dur:6,dps:40,desc:"\u3010\u5FC5\u6BBA\u6280\u3011\u5F90\u3005\u306B\u5E83\u304C\u308B\u5439\u96EA\u30926\u79D2\u8D77\u3053\u3059\u3002\u4E2D\u306E\u76F8\u624B\u306F\u30B9\u30ED\u30A6\u306B\u306A\u308A\u3001\u56DE\u8EE2\u3092\u524A\u3089\u308C\u7D9A\u3051\u308B\u3002"},brokenwings:{name:"\u4E09\u9023\u821E",en:"BROKEN WINGS",aim:"dash",cd:10,tele:.3,re:"brokenwings",dist:4.2,minDist:3,speed:30,dmg:18,keep:.3,kb:5,window:3,aoe:2.9,slam:28,slamUp:.6,desc:"3\u56DE\u307E\u3067\u7D9A\u3051\u3066\u4F7F\u3048\u308B\u77ED\u3044\u7A81\u9032\u30023\u56DE\u76EE\u306F\u7740\u5730\u70B9\u306E\u5468\u56F2\u3092\u6253\u3061\u4E0A\u3052\u308B\u3002"},kiburst:{name:"\u6C17\u5408",en:"KI BURST",aim:"self",cd:7,aoe:3.1,dmg:26,stun:.55,desc:"\u5468\u56F2\u306E\u76F8\u624B\u3092\u4E00\u77AC\u30B9\u30BF\u30F3\u3055\u305B\u308B\u3002"},valor:{name:"\u52C7\u9032",en:"VALOR",aim:"dash",cd:8,dist:4.8,minDist:3,speed:32,dmg:8,keep:.3,kb:4,shield:70,hold:2,desc:"\u77ED\u304F\u7A81\u9032\u3057\u30012\u79D2\u9593\u30C0\u30E1\u30FC\u30B8\u3092\u80A9\u4EE3\u308F\u308A\u3059\u308B\u30D0\u30EA\u30A2\u3092\u5F35\u308B\u3002"},exile:{name:"\u8FFD\u653E\u8005\u306E\u5203",en:"BLADE OF THE EXILE",aim:"self",cd:2,ult:!0,re:"windslash",dur:10,desc:"\u3010\u5FC5\u6BBA\u6280\u301110\u79D2\u9593\u3001\u4E0E\u3048\u308B\u30C0\u30E1\u30FC\u30B8\u304C15%\u4E0A\u304C\u308B\u3002\u305D\u306E\u9593\u306B\u3082\u3046\u4E00\u5EA6\u62BC\u3059\u3068\u65AC\u6483\u3092\u98DB\u3070\u3057\u3001\u76F8\u624B\u306E\u56DE\u8EE2\u304C\u5C11\u306A\u3044\u307B\u3069\u5927\u30C0\u30E1\u30FC\u30B8\u3002"},windslash:{name:"\u98A8\u65AC\u308A",en:"WIND SLASH",aim:"cone",hidden:!0,range:13,half:.3,speed:36,radius:.9,dmg:54,kb:9,exec:1,fan:3},sigil:{name:"\u60AA\u610F\u306E\u5370",en:"SIGIL OF MALICE",aim:"line",cd:4.5,tele:.38,range:13,speed:36,radius:.8,dmg:38,kb:3,tumble:.1,mark:3.5,pop:46,desc:"\u5F3E\u3092\u5F53\u3066\u3066\u5370\u3092\u4ED8\u3051\u308B\u3002\u5370\u306F\u6B21\u306B\u81EA\u5206\u306E\u30B9\u30AD\u30EB\u304C\u5F53\u305F\u308B\u3068\u70B8\u88C2\u3059\u308B\u3002"},distort:{name:"\u3086\u304C\u307F",en:"DISTORTION",aim:"dash",cd:8,tele:.3,re:"recall",dist:8,minDist:3,speed:38,through:!0,aoe:2.9,dmg:50,kb:6,tumble:.25,window:3,desc:"\u72D9\u3063\u305F\u5730\u70B9\u3078\u98DB\u3073\u8FBC\u307F\u3001\u7740\u5730\u70B9\u306E\u5468\u56F2\u306B\u30C0\u30E1\u30FC\u30B8\u30023\u79D2\u4EE5\u5185\u306B\u3082\u3046\u4E00\u5EA6\u62BC\u3059\u3068\u5143\u306E\u4F4D\u7F6E\u3078\u623B\u308B\u3002"},recall:{name:"\u3086\u304C\u307F\u30FB\u5E30\u9084",en:"RETURN",aim:"self",hidden:!0},ethereal:{name:"\u5E7B\u306E\u9396",en:"ETHEREAL CHAINS",aim:"line",cd:11,tele:.42,range:11,speed:32,radius:.8,dmg:24,slow:1.5,dur:1.5,safe:6,breakRange:10.5,pop:54,root:1.3,desc:"\u9396\u3067\u3064\u306A\u3050\u30021.5\u79D2\u306E\u3042\u3044\u3060\u5F15\u304D\u3061\u304E\u3089\u308C\u306A\u3051\u308C\u3070\u3001\u76F8\u624B\u3092\u30B9\u30BF\u30F3\u3055\u305B\u308B\u3002"},mimic:{name:"\u518D\u6F14",en:"MIMIC",aim:"self",cd:2,ult:!0,dur:2.8,desc:"\u3010\u5FC5\u6BBA\u6280\u3011\u76F4\u524D\u306B\u4F7F\u3063\u305F\u30B9\u30AD\u30EB\u3092\u3001\u5A01\u529B\u309240%\u4E0A\u3052\u3066\u3082\u3046\u4E00\u5EA6\u4F7F\u3046\u3002"},decimate:{name:"\u7686\u6BBA\u3057\u306E\u65A7",en:"DECIMATE",aim:"self",cd:7,charge:.5,aoe:5.2,inner:2.7,dmg:54,weak:20,heal:.08,bleed:1,desc:"\u5C11\u3057\u6E9C\u3081\u3066\u30C9\u30FC\u30CA\u30C4\u72B6\u306B\u65AC\u308B\u3002\u5916\u5468\u3067\u5F53\u3066\u308B\u3068\u5927\u30C0\u30E1\u30FC\u30B8\u3068\u56DE\u5FA9\u3001\u5185\u5074\u306F\u5A01\u529B\u304C\u4F4E\u3044\u3002\u51FA\u8840\u3092\u4ED8\u3051\u308B\u3002"},cripple:{name:"\u811A\u7815\u304D",en:"CRIPPLING STRIKE",aim:"self",cd:6,empower:4,bonus:30,kb:6,slow:2.2,bleed:1,desc:"4\u79D2\u9593\u3001\u6B21\u306E\u4F53\u5F53\u305F\u308A\u3092\u5F37\u5316\u3059\u308B\u3002\u5F53\u3066\u308B\u3068\u5F37\u3044\u30B9\u30ED\u30A6\u3068\u51FA\u8840\u3092\u4ED8\u3051\u308B\u3002"},apprehend:{name:"\u6355\u7E1B",en:"APPREHEND",aim:"cone",cd:10,tele:.35,range:7.8,half:.5,dmg:20,pull:17,slow:1.2,bleed:1,desc:"\u6247\u306E\u4E2D\u306E\u76F8\u624B\u3092\u624B\u524D\u3078\u5F15\u304D\u5BC4\u305B\u308B\u3002\u51FA\u8840\u3092\u4ED8\u3051\u308B\u3002"},guillotine:{name:"\u65AD\u982D\u53F0",en:"NOXIAN GUILLOTINE",aim:"dash",cd:2,ult:!0,tele:.4,dist:9.5,minDist:4,speed:38,dmg:85,kb:12,perBleed:.15,desc:"\u3010\u5FC5\u6BBA\u6280\u3011\u72D9\u3063\u305F\u65B9\u5411\u3078\u7A81\u9032\u3057\u3001\u5F53\u305F\u3063\u305F\u76F8\u624B\u3092\u65AD\u3064\u3002\u76F8\u624B\u306E\u51FA\u88401\u30B9\u30BF\u30C3\u30AF\u306B\u3064\u304D\u5A01\u529B\u304C15%\u4E0A\u304C\u308B\u3002"},poison:{name:"\u6BD2\u306E\u8ECC\u8DE1",en:"POISON TRAIL",aim:"self",cd:1,cost:7,every:.3,aoe:1.4,dur:3.2,dps:23,linger:1.2,desc:"\u5207\u308A\u66FF\u3048\u5F0F\u3002\u30AA\u30F3\u306E\u9593\u306F\u56DE\u8EE2\u3092\u5C11\u3057\u305A\u3064\u6D88\u8CBB\u3057\u3001\u901A\u3063\u305F\u8DE1\u3092\u6BD2\u306E\u5E8A\u306B\u3059\u308B\u3002"},glue:{name:"\u5F37\u529B\u7C98\u7740\u5264",en:"MEGA ADHESIVE",aim:"ground",cd:12,range:10,aoe:3.3,dur:5,desc:"\u7C98\u7740\u5E8A\u30925\u79D2\u7F6E\u304F\u3002\u4E2D\u306E\u76F8\u624B\u306F\u5927\u304D\u304F\u30B9\u30ED\u30A6\u306B\u306A\u308A\u3001\u7A81\u9032\u30FB\u77AC\u9593\u79FB\u52D5\u30FB\u8DF3\u8E8D\u304C\u4F7F\u3048\u306A\u3044\u3002"},fling:{name:"\u6295\u3052\u98DB\u3070\u3057",en:"FLING",aim:"self",cd:9,need:"range",range:3.6,dist:5.5,air:.55,height:3.2,dmg:42,stun:1.4,desc:"\u5BC6\u7740\u3057\u305F\u76F8\u624B\u3092\u81EA\u5206\u306E\u80CC\u5F8C\u3078\u653E\u308A\u6295\u3052\u308B\u3002\u7C98\u7740\u5E8A\u306B\u843D\u3068\u3059\u3068\u30B9\u30BF\u30F3\u3002"},insanity:{name:"\u72C2\u6C17\u306E\u85AC",en:"INSANITY POTION",aim:"self",cd:2,ult:!0,dur:8,desc:"\u3010\u5FC5\u6BBA\u6280\u30118\u79D2\u9593\u3001\u79FB\u52D5\u901F\u5EA6\u304C\u4E0A\u304C\u308A\u3001\u88AB\u30C0\u30E1\u30FC\u30B8\u304C\u6E1B\u308A\u3001\u56DE\u8EE2\u304C\u56DE\u5FA9\u3057\u7D9A\u3051\u308B\u3002"},turret:{name:"\u7832\u53F0\u8A2D\u7F6E",en:"H-28G TURRET",aim:"ground",cd:6,big:!0,range:7,aoe:1.1,dur:18,bigDur:9,max:3,reach:10.5,rate:.9,dmg:20,bigDmg:38,desc:"\u76F8\u624B\u3092\u81EA\u52D5\u3067\u6483\u3064\u7832\u53F0\u3092\u7F6E\u304F\uFF08\u6700\u59273\u57FA\uFF09\u3002\u4F53\u5F53\u305F\u308A\u3055\u308C\u308B\u3068\u58CA\u308C\u308B\u3002"},turretshot:{name:"\u7832\u53F0",en:"TURRET",aim:"line",hidden:!0,range:11,speed:28,radius:.5,dmg:13,kb:1.5,tumble:0,launch:0},rockets:{name:"\u30DE\u30A4\u30AF\u30ED\u30ED\u30B1\u30C3\u30C8",en:"MICRO-ROCKETS",aim:"cone",cd:7,tele:.35,big:!0,range:12,half:.26,speed:30,radius:.55,dmg:24,kb:2,tumble:0,launch:0,fan:5,bigFan:9,desc:"\u6247\u72B6\u306B5\u767A\u306E\u30ED\u30B1\u30C3\u30C8\u3092\u6483\u3064\u3002\u8FD1\u3044\u307B\u3069\u591A\u304F\u5F53\u305F\u308B\u3002"},grenade:{name:"\u96FB\u78C1\u30B0\u30EC\u30CD\u30FC\u30C9",en:"CH-2 GRENADE",aim:"ground",cd:8,tele:.15,big:!0,range:10,aoe:3,bigAoe:4.3,delay:.55,core:1.4,dmg:56,bigDmg:96,stun:1.4,slow:1.8,boost:3,desc:"\u7206\u5F3E\u3092\u6295\u3052\u308B\u3002\u4E2D\u5FC3\u3067\u5F53\u3066\u308B\u3068\u30B9\u30BF\u30F3\u3001\u5916\u5074\u306F\u30B9\u30ED\u30A6\u3002\u5DFB\u304D\u8FBC\u3093\u3060\u81EA\u5206\u306E\u7832\u53F0\u306F3\u79D2\u9593\u9023\u5C04\u3059\u308B\u3002"},upgrade:{name:"\u30A2\u30C3\u30D7\u30B0\u30EC\u30FC\u30C9!!!",en:"UPGRADE!!!",aim:"self",cd:2,ult:!0,dur:10,desc:"\u3010\u5FC5\u6BBA\u6280\u301110\u79D2\u4EE5\u5185\u306E\u6B21\u306EQ\u30FBW\u30FBE\u3092\u5F37\u5316\u3059\u308B\uFF08\u5927\u578B\u7832\u53F0\uFF0F9\u9023\u30ED\u30B1\u30C3\u30C8\uFF0F\u5168\u57DF\u30B9\u30BF\u30F3\u306E\u5927\u578B\u30B0\u30EC\u30CD\u30FC\u30C9\uFF09\u3002"},conquer:{name:"\u5F81\u670D\u306E\u7802",en:"CONQUERING SANDS",aim:"ground",cd:6,need:"soldier",range:10,aoe:1.6,speed:30,dmg:42,slow:1.2,desc:"\u3059\u3079\u3066\u306E\u7802\u5175\u3092\u6307\u5B9A\u5730\u70B9\u3078\u7A81\u9032\u3055\u305B\u308B\u3002\u901A\u308A\u9053\u306E\u76F8\u624B\u306B\u30C0\u30E1\u30FC\u30B8\u3068\u30B9\u30ED\u30A6\u3002"},arise:{name:"\u76EE\u899A\u3081\u3088\uFF01",en:"ARISE!",aim:"ground",cd:3.5,range:8,aoe:2.7,reach:2.7,leash:10,dur:9,max:2,rate:1,dmg:18,kb:3,desc:"\u5206\u8EAB\u306E\u7802\u5175\u3092\u7F6E\u304F\uFF08\u6700\u59272\u4F53\uFF09\u3002\u8FD1\u3065\u3044\u305F\u76F8\u624B\u3092\u81EA\u52D5\u3067\u7A81\u304F\u3002\u81EA\u5206\u304C\u96E2\u308C\u3059\u304E\u308B\u3068\u52D5\u304B\u306A\u3044\u3002"},shift:{name:"\u6D41\u7802",en:"SHIFTING SANDS",aim:"self",cd:9,need:"soldier",speed:36,dmg:30,keep:.5,kb:3,liftUp:.7,shield:60,hold:2,desc:"\u4E00\u756A\u8FD1\u3044\u7802\u5175\u3078\u7A81\u9032\u3059\u308B\u3002\u9014\u4E2D\u3067\u76F8\u624B\u306B\u5F53\u305F\u308B\u3068\u6253\u3061\u4E0A\u3052\u3001\u30D0\u30EA\u30A2\u3092\u5F97\u308B\u3002"},divide:{name:"\u7687\u5E1D\u306E\u5206\u7802\u5DBA",en:"EMPEROR'S DIVIDE",aim:"line",cd:2,ult:!0,tele:.3,range:8,radius:3.6,wall:3.6,back:1,travel:7,speed:22,hold:4,dmg:100,kb:18,solid:!0,desc:"\u3010\u5FC5\u6BBA\u6280\u3011\u80CC\u5F8C\u304B\u3089\u7802\u5175\u306E\u58C1\u304C\u524D\u9032\u3057\u3001\u76F8\u624B\u3092\u5F37\u304F\u62BC\u3057\u51FA\u3059\u3002\u58C1\u306F4\u79D2\u6B8B\u308A\u3001\u81EA\u5206\u3060\u3051\u901A\u308A\u629C\u3051\u3089\u308C\u308B\u3002"}};for(let i in Re)Re[i].id=i;var Ct=["Q","W","E","R"],An=(i,e)=>Re[i.blade.kit[e]],Pr=i=>Ct.map(e=>Re[i.kit[e]]);for(let i of Object.values($t))i.emp=Pr(i).find(e=>e.bonus)||null;var Cs=[{id:"easy",name:"EASY",ja:"\u3084\u3055\u3057\u3044",think:.95,aimErr:3.2,dodge:.15,cast:.3,chase:.3,windup:1.35},{id:"normal",name:"NORMAL",ja:"\u3075\u3064\u3046",think:.55,aimErr:1.5,dodge:.5,cast:.5,chase:.5,windup:1},{id:"hard",name:"HARD",ja:"\u3064\u3088\u3044",think:.3,aimErr:.5,dodge:.85,cast:.75,chase:.7,windup:.8}];function Sg(i){return function(){i|=0,i=i+1831565813|0;let e=Math.imul(i^i>>>15,1|i);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}var Tg=4,Eg=1.25,wg=2.5,Ag=.35,Cg=new Set(["dash","blink","leap"]),bi=(i,e,t)=>i<e?e:i>t?t:i;function Bf(i,e){return{side:i,blade:e,x:0,z:0,vx:0,vz:0,spin:e.spinMax,spinMax:e.spinMax,dir:1,radius:1.25,mass:e.mass,cmd:null,cast:null,dash:null,air:null,out:null,blink:null,charge:null,orbs:null,tether:null,chan:null,ret:null,empower:0,projN:0,zoneN:0,phase:i*2.1,tumble:0,launch:0,guard:0,slow:0,hitCd:0,up:0,ground:0,mark:0,scar:0,poison:0,bleed:0,bleedT:0,shield:0,shieldT:0,buff:0,stack:0,stackT:0,last:0,toggle:!1,dmark:0,dacc:0,egg:0,eggHp:0,eggUsed:!1,dot:0,dotT:0,drop:0,cd:{Q:0,W:0,E:0,R:0},re:{Q:0,W:0,E:0,R:0},windup:{Q:0,W:0,E:0,R:0},ult:0,lastHit:null,stats:{dealt:0,taken:0,clashes:0,skillHits:0,parries:0,maxHit:0}}}var Bt=i=>!i.air&&!i.out&&!i.blink,Ht=i=>Math.max(0,i.spin/i.spinMax),Hf=i=>1+.85*(1-Ht(i)),Ki=i=>!!(i.charge&&i.charge.skill.root||i.egg>0),Rs=i=>Ki(i)||!!i.chan||i.up>0;function Vf(i,e,t){if(i.dash||i.blink){let d=i.dash||i.blink;if(i.vx=d.dx*d.speed,i.vz=d.dz*d.speed,d.t-=e,d.t<=0){let f=i.blade.speed*.8;i.vx=d.dx*f,i.vz=d.dz*f,i.dash=i.blink=null}i.x+=i.vx*e,i.z+=i.vz*e;return}let n=Ht(i),s=i.buff>0&&i.blade.buff,r=(i.ground>0?.4:i.slow>0?.6:1)*(s&&s.speed||1),a=Rs(i),o=ut.K*(.55+3.2/(Math.hypot(i.x,i.z)+1.5)),l=-o*i.x,c=-o*i.z,h=.15;if(i.spin<=0)h=2.2;else if(a)h=9;else if(i.tumble>0)h=.55;else if(i.cmd){let d=i.cmd,f=d.x-i.x,m=d.z-i.z,x=Math.hypot(f,m);if(d.t-=e,x<.9||d.t<=0)i.cmd=null;else{let g=i.blade.speed*1.2*(.55+.45*n)*r,p=(f/x*g-i.vx)*9,S=(m/x*g-i.vz)*9,A=Math.hypot(p,S);A>70&&(p*=70/A,S*=70/A),l=p,c=S}}if(i.spin>0&&i.tumble<=0&&!i.cmd&&!a){let d=Math.hypot(i.vx,i.vz),f=i.blade.speed*(.3+.7*n)*r;if(i.phase+=e,d>.05){let m=bi((f-d)*1.6,-8,12),x=(2.2+2.6*Math.sin(i.phase*1.3)*Math.sin(i.phase*.47+1))*n*i.dir;l+=i.vx/d*m-i.vz/d*x,c+=i.vz/d*m+i.vx/d*x}else l+=Math.cos(i.phase*3)*5,c+=Math.sin(i.phase*3)*5;if(t&&Bt(t)){let m=t.x-i.x,x=t.z-i.z,g=Math.hypot(m,x)||1;if(Math.sin(i.phase*Eg+.5)>.55){let A=3.2*n;l+=(m/g*f*1.15-i.vx)*A,c+=(x/g*f*1.15-i.vz)*A}let S=Tg*(.35+.65*n);l+=m/g*S,c+=x/g*S}}i.vx+=l*e,i.vz+=c*e;let u=Math.exp(-h*e);i.vx*=u,i.vz*=u,i.x+=i.vx*e,i.z+=i.vz*e}function Gf(i){let e=ut.R-i.radius,t=Math.hypot(i.x,i.z);if(t<=e)return null;let n=i.x/t,s=i.z/t;return i.x=n*e,i.z=s*e,{nx:n,nz:s,vn:i.vx*n+i.vz*s}}function Wf(i,e){let t=(1+ut.wallE)*e.vn;i.vx-=t*e.nx,i.vz-=t*e.nz}function Rg(i){return{blade:i.blade,x:i.x,z:i.z,vx:i.vx,vz:i.vz,spin:i.spin,spinMax:i.spinMax,dir:i.dir,radius:i.radius,tumble:i.tumble,slow:i.slow,phase:i.phase,ground:i.ground,buff:i.buff,up:i.up,egg:i.egg,chan:i.chan,cmd:i.cmd?{...i.cmd}:null,dash:i.dash?{...i.dash}:null,blink:i.blink?{...i.blink}:null,charge:i.charge}}function Pg(i,e,t,n){let s=[];if(i.air){for(let l=0;l<n;l++)s.push({x:i.air.tx,z:i.air.tz});return s}let r=Rg(i),a=t/n,o=Math.max(1,Math.ceil(a*40));for(let l=0;l<n;l++){for(let c=0;c<o;c++){let h=a/o;Vf(r,h,e),r.tumble=Math.max(0,r.tumble-h),r.slow=Math.max(0,r.slow-h),r.up=Math.max(0,r.up-h);let u=Gf(r);u&&u.vn>0&&(Wf(r,u),r.dash=null)}s.push({x:r.x,z:r.z})}return s}function fo(i,e,t){if(t<=.001)return{x:i.x,z:i.z};let n=Pg(i,e,t,Math.max(1,Math.ceil(t*20)));return n[n.length-1]}function Xf(i,e,t,n,s,r=0){let a={x:t.x,z:t.z},o=0;for(let l=0;l<3;l++)o=r+Math.hypot(a.x-i,a.z-e)/s,a=fo(t,n,o);return{x:a.x,z:a.z,t:o}}function Ir(i){let e=i.skill=Re[i.kind];return i.r=i.c&&e.bigAoe||e.aoe||e.radius||1,i.T=i.kind==="divide"?e.travel/e.speed+e.hold:i.c&&e.bigDur||e.dur||e.delay||1,e.grow&&(i.r=Math.min(e.aoe,e.r0+(e.aoe-e.r0)*i.t/e.grow)),i}function si(i){if(i.kind!=="divide")return{x:i.x,z:i.z,nx:i.dx,nz:i.dz,moving:!1};let e=i.skill,t=Math.min(i.t*e.speed,e.travel);return{x:i.x+i.dx*t,z:i.z+i.dz*t,nx:i.dx,nz:i.dz,moving:t<e.travel}}var Lr=class{constructor(e,t,n=1){this.rng=Sg(n),this.tops=[Bf(0,e),Bf(1,t)],this.projectiles=[],this.zones=[],this.events=[],this.time=0,this.result=null,this.projId=0,this.resetRound()}other(e){return this.tops[1-e.side]}emit(e,t){this.events.push({type:e,...t})}own(e,t){return this.zones.filter(n=>n.owner===e&&n.kind===t&&!n.dead)}resetRound(){this.projectiles.length=0,this.zones.length=0,this.result=null,this.time=0;for(let e of this.tops){let t=e.side===0?1:-1;e.x=0,e.z=7.5*t,e.vx=e.blade.speed*.75*t,e.vz=0,e.spin=e.spinMax,e.cmd=e.cast=e.dash=e.air=e.out=e.blink=e.charge=e.orbs=e.tether=e.chan=e.ret=null,e.tumble=e.launch=e.guard=e.slow=e.hitCd=e.empower=0,e.up=e.ground=e.mark=e.scar=e.poison=e.bleed=e.bleedT=e.shield=e.shieldT=e.buff=0,e.stack=e.stackT=e.last=e.dmark=e.dacc=e.egg=e.eggHp=e.dot=e.dotT=e.drop=0,e.toggle=e.eggUsed=!1,e.lastHit=null;for(let n of Ct)e.cd[n]=n==="R"?0:1.2,e.re[n]=0}}issueMove(e,t,n){if(this.result||e.air||e.out||e.dash||e.blink||Rs(e))return!1;let s=ut.R-e.radius-.2,r=Math.hypot(t,n);return r>s&&(t*=s/r,n*=s/r),e.cmd={x:t,z:n,t:2.2},!0}busy(e){return!!(this.result||e.spin<=0||e.air||e.out||e.cast||e.dash||e.blink||e.charge||e.chan||e.up>0||e.egg>0)}aimSkill(e,t){let n=An(e,t);return n.re&&e.re[t]>0?Re[n.re]:n.id==="mimic"?Re[e.blade.kit[Ct[e.last]]]:n.id==="galeq"&&e.stack>=n.stacks?Re.tornado:n}ready(e,t,n=0){let s=An(e,t);return s.re&&e.re[t]>0?!0:e.cd[t]<=n&&(!s.ult||e.ult>=100)}blocked(e,t){let n=this.aimSkill(e,t),s=this.other(e),r=Math.hypot(s.x-e.x,s.z-e.z);return n.need==="range"&&!(Bt(s)&&r<=n.range&&!(n.id==="fling"&&s.egg>0))?"\u5C04\u7A0B\u5916":n.need==="up"&&!(Bt(s)&&s.up>0&&r<=n.range)?"\u6253\u3061\u4E0A\u3052\u4E2D\u306E\u307F":n.need==="soldier"&&!this.own(e,"arise").length?"\u7802\u5175\u304C\u3044\u306A\u3044":e.ground>0&&(Cg.has(n.aim)||n.id==="shift")?"\u7C98\u7740\u4E2D":null}canCast(e,t){return this.busy(e)||!this.ready(e,t)||An(e,t).id!=="aegis"&&e.tumble>0?!1:!this.blocked(e,t)}groundTarget(e,t,n,s){let r=n-e.x,a=s-e.z,o=Math.hypot(r,a);o>t.range&&(r*=t.range/o,a*=t.range/o);let l=e.x+r,c=e.z+a,h=ut.R-(t.aim==="leap"?1.6:.6),u=Math.hypot(l,c);return u>h&&(l*=h/u,c*=h/u),{x:l,z:c}}cast(e,t,n,s){if(!this.canCast(e,t))return!1;let r=An(e,t),a=this.aimSkill(e,t),o=!!(r.re&&e.re[t]>0);o?e.re[t]=0:(e.cd[t]=r.cd*e.blade.cdMul,r.ult?e.ult=0:e.last=Ct.indexOf(t),r.id==="mimic"&&(e.buff=r.dur));let l=n-e.x,c=s-e.z,h=Math.hypot(l,c);h<.01?(l=0,c=e.side===0?-1:1):(l/=h,c/=h);let u=o?0:e.windup[t],d={key:t,skill:a,re:o,t:u,T:u,dx:l,dz:c,ax:n,az:s,dist:h};if(a.aim==="ground"||a.aim==="leap"){let f=this.groundTarget(e,a,n,s);d.ax=f.x,d.az=f.z}return this.emit("cast",{top:e,key:t,skill:a,base:r,ult:!!r.ult&&!o,windup:d.T,dx:l,dz:c,ax:d.ax,az:d.az}),d.t<=0?this.execute(e,d):e.cast=d,!0}fire(e,t,n,s,r={}){let a={id:e.side*3e4+(e.projN=(e.projN+1)%3e4),skill:t,owner:e,x:(r.x??e.x)+n*.9,z:(r.z??e.z)+s*.9,dx:n,dz:s,speed:t.speed,left:t.range,r:t.radius,dmg:(r.dmg??t.dmg)*e.blade.atk,hit:!1,dead:!1};return this.projectiles.push(a),r.quiet||this.emit("shoot",{top:e,proj:a}),a}fan(e,t,n,s,r,a={}){let o=Math.atan2(s,n);for(let l=0;l<r;l++){let c=o+(r>1?(l/(r-1)*2-1)*t.half:0);this.fire(e,t,Math.cos(c),Math.sin(c),{...a,quiet:l>0})}}zone(e,t,n,s,r,a){if(t.max){let l=this.own(e,t.id);for(;l.length>=t.max;)this.endZone(l.shift())}let o=Ir({id:e.side*3e4+(e.zoneN=(e.zoneN+1)%3e4),kind:t.id,owner:e,x:n,z:s,dx:0,dz:0,t:0,a:0,b:0,c:0,...r});return this.zones.push(o),a||this.emit("zone",{zone:o,top:e}),o}endZone(e){e.dead||(e.dead=!0,this.emit("zoneEnd",{zone:e}))}startDash(e,t,n,s,r){e.dash={dx:n,dz:s,speed:t.speed,t:r/t.speed,skill:t,hit:!1},e.cmd=null,this.emit("dash",{top:e,dx:n,dz:s,dist:r})}stopDash(e){let t=e.dash;t&&(e.dash=null,this.dashDone(e,t))}dashDone(e,t){let n=t.skill;n.id==="brokenwings"&&e.stack>=3?(e.stack=0,this.burst(e,n,e.x,e.z,n.aoe,{dmg:n.slam,as:{up:n.slamUp}})):n.id==="distort"&&this.burst(e,n,e.x,e.z,n.aoe)}unre(e,t){for(let n of Ct)An(e,n).id===t&&(e.re[n]=0)}inCone(e,t,n,s,r){if(!Bt(t))return!1;let a=t.x-e.x,o=t.z-e.z,l=Math.hypot(a,o),c=Math.acos(bi((a*n+o*s)/(l||1),-1,1)),h=Math.atan2(t.radius*.8,Math.max(l,.5));return l<r.range+t.radius*.6&&c<r.half+h}burst(e,t,n,s,r,a={}){let o=this.other(e),l=0;if(Bt(o)&&!this.result){let c=o.x-n,h=o.z-s,u=Math.hypot(c,h);if(u<r+o.radius*.5){u<.05?(c=1,h=0):(c/=u,h/=u);let d=o.guard>0?.3:1;l=this.hurt(o,(a.dmg??t.dmg)*d*e.blade.atk/o.blade.def,e,t.id),d===1&&this.affect(e,o,a.as||t,c,h),e.stats.skillHits++}}return this.emit("blast",{top:e,skill:t,x:n,z:s,r,hit:l,target:l?o:null}),l}execute(e,t){let n=t.skill,s=this.other(e),r=!!(n.big&&e.blade.id==="gear"&&e.buff>0);switch(r&&(e.buff=0),n.id){case"sonic":case"anchor":case"galeq":case"frostbite":case"sigil":case"ethereal":case"flourish":this.fire(e,n,t.dx,t.dz);break;case"tornado":e.stack=0,this.fire(e,n,t.dx,t.dz);break;case"shuriken":this.fire(e,n,t.dx,t.dz);for(let a of this.own(e,"shadow")){let o=t.ax-a.x,l=t.az-a.z,c=Math.hypot(o,l);c>.5&&this.fire(e,n,o/c,l/c,{x:a.x,z:a.z,quiet:!0})}break;case"fourshot":e.stack++,e.stack>=n.shots?(e.stack=0,e.cd[t.key]=n.reload*e.blade.cdMul,this.fire(e,Re.fourth,t.dx,t.dz)):this.fire(e,n,t.dx,t.dz);break;case"flashfrost":{let a=this.fire(e,n,t.dx,t.dz);e.re[t.key]=a.left/a.speed+.2;break}case"shatter":{let a=this.projectiles.find(o=>o.owner===e&&o.skill.id==="flashfrost"&&!o.dead);a&&this.shatter(a);break}case"rockets":this.fan(e,n,t.dx,t.dz,r?n.bigFan:n.fan);break;case"windslash":this.fan(e,n,t.dx,t.dz,n.fan);break;case"blitz":case"sweep":case"guillotine":this.startDash(e,n,t.dx,t.dz,bi(t.dist,n.minDist,n.dist));break;case"brokenwings":e.stack=t.re?e.stack+1:1,e.stackT=n.window+1,e.stack<3&&(e.re[t.key]=n.window),this.startDash(e,n,t.dx,t.dz,bi(t.dist,n.minDist,n.dist));break;case"valor":e.shield=n.shield,e.shieldT=n.hold,this.startDash(e,n,t.dx,t.dz,bi(t.dist,n.minDist,n.dist)),this.emit("buff",{top:e,skill:n});break;case"distort":e.ret={x:e.x,z:e.z},e.re[t.key]=n.window,this.startDash(e,n,t.dx,t.dz,bi(t.dist,n.minDist,n.dist));break;case"recall":if(e.ret){let a=e.x,o=e.z;e.x=e.ret.x,e.z=e.ret.z,e.vx=e.vz=0,e.cmd=null,e.ret=null,this.emit("warp",{top:e,fx:a,fz:o})}break;case"shift":{let a=null,o=1e9;for(let l of this.own(e,"arise")){let c=Math.hypot(l.x-e.x,l.z-e.z);c<o&&(o=c,a=l)}a&&o>.5&&this.startDash(e,n,(a.x-e.x)/o,(a.z-e.z)/o,o);break}case"phantom":{let a=bi(t.dist,2,n.range);e.blink={dx:t.dx,dz:t.dz,speed:n.speed,t:a/n.speed,skill:n},e.cmd=null,e.tumble=0,this.emit("blink",{top:e,dx:t.dx,dz:t.dz,dist:a});break}case"meteor":e.air={t:0,T:n.air,sx:e.x,sz:e.z,tx:t.ax,tz:t.az,skill:n,by:e.side},e.cmd=null,e.vx=e.vz=0,this.emit("leap",{top:e,tx:t.ax,tz:t.az,T:n.air});break;case"quake":case"glue":case"blizzard":case"lotus":this.zone(e,n,t.ax,t.az);break;case"grenade":this.zone(e,n,t.ax,t.az,{c:r?1:0});break;case"turret":this.zone(e,n,t.ax,t.az,{c:r?1:0,b:.5});break;case"arise":this.zone(e,n,t.ax,t.az,{b:.4});break;case"shadow":for(let a of this.own(e,"shadow"))a.c=0;this.zone(e,n,t.ax,t.az,{c:1}),e.re[t.key]=n.dur;break;case"swap":{let a=this.own(e,"shadow").find(o=>o.c)||this.own(e,"shadow")[0];if(a){let o=e.x,l=e.z;e.x=a.x,e.z=a.z,a.x=o,a.z=l,e.cmd=null,this.emit("warp",{top:e,fx:o,fz:l})}break}case"icewall":this.zone(e,n,t.ax,t.az,{dx:t.dx,dz:t.dz});break;case"windwall":this.zone(e,n,e.x+t.dx*n.ahead,e.z+t.dz*n.ahead,{dx:t.dx,dz:t.dz});break;case"divide":this.zone(e,n,e.x-t.dx*n.back,e.z-t.dz*n.back,{dx:t.dx,dz:t.dz});break;case"conquer":{let a=this.own(e,"arise");a.forEach((o,l)=>{let c=(l-(a.length-1)/2)*1.6;o.dx=t.ax-t.dz*c,o.dz=t.az+t.dx*c,o.c=1}),this.emit("buff",{top:e,skill:n});break}case"slash":{let a=[{x:e.x,z:e.z,sh:!1},...this.own(e,"shadow").map(c=>({x:c.x,z:c.z,sh:!0}))],o=null,l=0;if(Bt(s))for(let c of a)Math.hypot(s.x-c.x,s.z-c.z)<n.aoe+s.radius*.5&&(!o||c.sh)&&(o=c);if(o){let c=s.guard>0?.3:1;if(l=this.hurt(s,n.dmg*c*e.blade.atk/s.blade.def,e,"slash"),c===1){let h=s.x-o.x,u=s.z-o.z,d=Math.hypot(h,u)||1;this.affect(e,s,n,h/d,u/d),o.sh&&(s.slow=Math.max(s.slow,n.shadowSlow))}e.stats.skillHits++}for(let c of a)this.emit("blast",{top:e,skill:n,x:c.x,z:c.z,r:n.aoe,hit:c===o?l:0,target:c===o&&l?s:null});break}case"kiburst":this.burst(e,n,e.x,e.z,n.aoe);break;case"deathmark":{let a=e.x,o=e.z,l=s.x-e.x,c=s.z-e.z,h=Math.hypot(l,c)||1;l/=h,c/=h,this.zone(e,Re.shadow,a,o);let u=s.x+l*n.gap,d=s.z+c*n.gap,f=ut.R-e.radius-.2,m=Math.hypot(u,d);m>f&&(u*=f/m,d*=f/m),e.x=u,e.z=d,e.vx=e.vz=0,e.cmd=null,e.dmark=n.dur,e.dacc=0,this.emit("warp",{top:e,fx:a,fz:o}),this.emit("say",{top:s,text:"DEATH MARK",tone:"red"});break}case"lastbreath":{let a=s.x,o=s.z,l=Math.hypot(a,o);l<.5&&(a=s.x-e.x,o=s.z-e.z,l=Math.hypot(a,o)||1),a/=l,o/=l;let c=e.x,h=e.z;e.x=s.x-a*n.gap,e.z=s.z-o*n.gap,e.vx=e.vz=0,e.cmd=null,s.up=0;let u=this.hurt(s,n.dmg*e.blade.atk/s.blade.def,e,"lastbreath");this.knock(s,a,o,n.kb,.6,2),e.stats.skillHits++,this.emit("warp",{top:e,fx:c,fz:h}),this.emit("blast",{top:e,skill:n,x:s.x,z:s.z,r:4,hit:u,target:s});break}case"curtaincall":e.chan={t:0,n:0,dx:t.dx,dz:t.dz,skill:n},e.cmd=null,this.emit("chan",{top:e,dx:t.dx,dz:t.dz});break;case"aegis":e.guard=n.dur*e.blade.guardMul,this.emit("guard",{top:e,dur:e.guard});break;case"nova":case"decimate":e.charge={t:0,T:n.charge,skill:n},n.root&&(e.cmd=null),this.emit("charge",{top:e,T:n.charge,skill:n});break;case"cripple":e.empower=n.empower,this.emit("buff",{top:e,skill:n});break;case"flare":{let a=0;this.inCone(e,s,t.dx,t.dz,n)&&(a=this.hurt(s,n.dmg*e.blade.atk*(s.guard>0?.3:1)/s.blade.def,e,"flare"),e.spin=Math.min(e.spinMax,e.spin+a*n.heal),s.guard<=0&&this.knock(s,t.dx,t.dz,n.kb,.25,.8),e.stats.skillHits++),this.emit("flare",{top:e,dx:t.dx,dz:t.dz,hit:a,heal:a*n.heal,target:s});break}case"apprehend":{let a=0;if(this.inCone(e,s,t.dx,t.dz,n)){let o=s.guard>0?.3:1;a=this.hurt(s,n.dmg*o*e.blade.atk/s.blade.def,e,"apprehend"),o===1&&(this.pull(s,e,n.pull),this.affect(e,s,n,0,0)),e.stats.skillHits++}this.emit("cone",{top:e,skill:n,dx:t.dx,dz:t.dz,hit:a,target:a?s:null});break}case"fling":{let a=e.x-s.x,o=e.z-s.z,l=Math.hypot(a,o)||1,c=e.x+a/l*n.dist,h=e.z+o/l*n.dist,u=ut.R-1.6,d=Math.hypot(c,h);d>u&&(c*=u/d,h*=u/d),s.air={t:0,T:n.air,sx:s.x,sz:s.z,tx:c,tz:h,skill:n,by:e.side},s.cmd=s.dash=s.cast=s.chan=s.charge=null,s.vx=s.vz=0,s.up=0,this.emit("fling",{top:e,target:s,tx:c,tz:h});break}case"poison":e.toggle=!e.toggle,e.drop=0,this.emit("buff",{top:e,skill:n,off:!e.toggle});break;case"insanity":case"upgrade":e.buff=n.dur,this.emit("buff",{top:e,skill:n});break;case"exile":e.buff=n.dur,e.re[t.key]=n.dur,this.emit("buff",{top:e,skill:n});break;case"sanctuary":this.zone(e,n,e.x,e.z);break;case"satellite":e.orbs={n:n.count,alive:(1<<n.count)-1,t:n.dur,ang:0,cd:0,skill:n},this.emit("orbs",{top:e});break;case"eclipse":e.tether={t:0,T:n.dur,skill:n,acc:0,tick:0},this.emit("tether",{top:e,target:s});break}}hurt(e,t,n,s){if(this.result||t<=0)return 0;let r=n&&n!==e;if(r&&s!=="dot"&&s!=="wall"){let o=n.buff>0&&n.blade.buff;o&&o.atk&&(t*=o.atk),n.blade.might&&e.bleed>=Ji.max&&(t*=n.blade.might)}e.charge&&(t*=e.charge.skill.armor??1);let a=e.buff>0&&e.blade.buff;if(a&&a.armor&&(t*=a.armor),e.shield>0){let o=Math.min(e.shield,t);if(e.shield-=o,t-=o,t<=0)return 0}return e.egg>0?(e.eggHp-=t,e.eggHp<=0&&(e.egg=0,e.spin=0)):e.spin-=t,e.stats.taken+=t,e.ult=Math.min(100,e.ult+t*.06),n&&(n.stats.dealt+=t,n.stats.maxHit=Math.max(n.stats.maxHit,t),s!=="drain"&&(n.ult=Math.min(100,n.ult+t*.085))),s==="dot"||(r&&(e.scar=wg,n.dmark>0&&s!=="deathmark"&&(n.dacc+=t)),e.lastHit={dmg:t,time:this.time,kind:s}),t}dot(e,t,n){e.dot+=this.hurt(e,t,n,"dot")}knock(e,t,n,s,r,a){if(Ki(e))return;let o=s*Hf(e)/Math.sqrt(e.mass);e.vx=t*o,e.vz=n*o,e.tumble=Math.max(e.tumble,r),a>0&&(e.launch=Math.max(e.launch,a)),e.cmd=null,e.dash=null,e.cast=null,e.chan=null}push(e,t,n,s){if(Ki(e))return;let r=s*Hf(e)/Math.sqrt(e.mass);e.vx+=t*r,e.vz+=n*r}pull(e,t,n){if(Ki(e))return;let s=t.x-e.x,r=t.z-e.z,a=Math.hypot(s,r)||1,o=Math.min(n,a*3.2);e.vx=s/a*o,e.vz=r/a*o,e.tumble=Math.max(e.tumble,.5),e.cmd=null,e.dash=null,e.cast=null,e.chan=null}stun(e,t){Ki(e)||(e.tumble=Math.max(e.tumble,t),e.cmd=null,e.dash=null,e.cast=null,e.chan=null,this.emit("say",{top:e,text:"STUN",tone:"red"}))}lift(e,t){Ki(e)||(e.up=Math.max(e.up,t),e.vx=e.vz=0,e.cmd=null,e.dash=null,e.cast=null,e.chan=null,this.emit("say",{top:e,text:"KNOCK UP",tone:"red"}))}bleed(e,t){let n=e.bleed;e.bleed=Math.min(Ji.max,e.bleed+t),e.bleedT=Ji.dur,e.bleed===Ji.max&&n<Ji.max&&this.emit("say",{top:e,text:"HEMORRHAGE",tone:"red"})}affect(e,t,n,s,r,a=!0){if(t.mark>0){t.mark=0;let o=this.hurt(t,Re.sigil.pop*e.blade.atk/t.blade.def,e,"sigil");this.emit("strike",{top:t,src:e,skill:Re.sigil,x:t.x,z:t.z,dmg:o})}n.mark&&(t.mark=n.mark),n.kb&&a&&(n.tumble===0?this.push(t,s,r,n.kb):this.knock(t,s,r,n.kb,n.tumble??.35,n.launch??1.5)),n.stun&&this.stun(t,n.stun),n.up&&this.lift(t,n.up),n.slow&&(t.slow=Math.max(t.slow,n.slow)),n.bleed&&this.bleed(t,n.bleed)}finish(e,t,n){this.result||(this.result={winner:e,loser:t,kind:n},this.emit("finish",{winner:e,loser:t,kind:n}))}timeUp(){let[e,t]=this.tops,n=Ht(e)>=Ht(t)?e:t;this.finish(n,this.other(n),"time")}step(e){this.time+=e;let[t,n]=this.tops;if(this.updateTop(t,e,n),this.updateTop(n,e,t),this.collide(t,n),this.barriers(t),this.barriers(n),this.walls(t),this.walls(n),this.updateProjectiles(e),this.updateZones(e),!this.result)for(let s of this.tops){if(s.spin>0||s.out)continue;if(s.blade.egg&&!s.eggUsed){this.layEgg(s);continue}s.spin=0;let r=s.lastHit,a=r&&this.time-r.time<.35&&r.dmg>=55;this.finish(this.other(s),s,a?"burst":"spin");break}}layEgg(e){let t=e.blade.egg;e.eggUsed=!0,e.egg=t.dur,e.eggHp=t.hp,e.spin=1,e.cmd=e.dash=e.cast=e.chan=e.charge=null,e.vx=e.vz=0,e.up=0,e.tumble=0,this.emit("egg",{top:e})}updateTop(e,t,n){for(let a of Ct)e.cd[a]=Math.max(0,e.cd[a]-t),e.re[a]=Math.max(0,e.re[a]-t);if(e.tumble=Math.max(0,e.tumble-t),e.launch=Math.max(0,e.launch-t),e.slow=Math.max(0,e.slow-t),e.hitCd=Math.max(0,e.hitCd-t),e.empower=Math.max(0,e.empower-t),e.up=Math.max(0,e.up-t),e.ground=Math.max(0,e.ground-t),e.mark=Math.max(0,e.mark-t),e.scar=Math.max(0,e.scar-t),e.poison=Math.max(0,e.poison-t),e.buff=Math.max(0,e.buff-t),e.shieldT>0&&(e.shieldT-=t,e.shieldT<=0&&(e.shieldT=0,e.shield=0)),e.bleedT>0&&(e.bleedT-=t,e.bleedT<=0&&(e.bleedT=0,e.bleed=0)),e.stackT>0&&(e.stackT-=t,e.stackT<=0&&(e.stackT=0,e.stack=0)),e.guard>0&&(e.guard-=t,e.guard<=0&&(e.guard=0,this.emit("guardEnd",{top:e}))),e.egg>0)e.egg-=t,e.egg<=0&&!this.result&&(e.egg=0,e.spin=e.spinMax*e.blade.egg.back,this.emit("rebirth",{top:e}));else if(!this.result&&e.spin>0){e.spin-=e.blade.decay*t,e.ult=Math.min(100,e.ult+.8*t);let a=e.buff>0&&e.blade.buff;a&&a.regen&&(e.spin=Math.min(e.spinMax,e.spin+a.regen*t))}if(this.result||(e.poison>0&&this.dot(e,Re.poison.dps*t*n.blade.atk/e.blade.def,n),e.bleed>0&&this.dot(e,Ji.dps*e.bleed*t*n.blade.atk/e.blade.def,n)),e.dotT+=t,e.dotT>=.5&&(e.dot>=1&&this.emit("dot",{top:e,dmg:e.dot}),e.dot=0,e.dotT=0),e.dmark>0&&(e.dmark-=t,e.dmark<=0)){e.dmark=0;let a=Re.deathmark;if(!this.result&&!n.out){let o=this.hurt(n,a.pop*e.blade.atk/n.blade.def+e.dacc*a.share,e,"deathmark");this.emit("blast",{top:e,skill:a,x:n.x,z:n.z,r:3,hit:o,target:n})}e.dacc=0}if(e.out){let a=e.out;a.t+=t,a.vy-=26*t,a.y+=a.vy*t,e.x+=e.vx*t,e.z+=e.vz*t;return}if(e.air){let a=e.air;a.t+=t;let o=Math.min(1,a.t/a.T),l=o*o*(3-2*o);e.x=a.sx+(a.tx-a.sx)*l,e.z=a.sz+(a.tz-a.sz)*l,o>=1&&this.land(e,n);return}if(e.cast&&(e.cast.t-=t,e.cast.t<=0)){let a=e.cast;e.cast=null,!this.result&&e.spin>0&&this.execute(e,a)}if((this.result||e.spin<=0)&&(e.tether&&this.emit("tetherEnd",{top:e,broke:!0}),e.orbs&&this.emit("orbsEnd",{top:e}),e.charge=e.tether=e.orbs=e.chan=null,e.toggle=!1),e.toggle){let a=Re.poison;e.spin<=a.cost*3||e.egg>0?e.toggle=!1:(e.spin-=a.cost*t,e.drop-=t,e.drop<=0&&(e.drop=a.every,this.zone(e,a,e.x,e.z,null,!0)))}e.charge&&(e.charge.t+=t,e.charge.t>=e.charge.T&&this.chargeDone(e,n)),e.chan&&this.updateChan(e,n,t),e.orbs&&this.updateOrbs(e,n,t),e.tether&&this.updateTether(e,n,t);let s=e.blink,r=e.dash;Vf(e,t,n),s&&!e.blink&&(s.skill.empower&&(e.empower=s.skill.empower),this.emit("blinkEnd",{top:e})),r&&!e.dash&&this.dashDone(e,r)}land(e,t){let n=e.air,s=n.skill,r=n.tx,a=n.tz;if(e.air=null,e.x=r,e.z=a,e.vx=e.vz=0,s.id==="fling"){let l=this.tops[n.by];e.tumble=Math.max(e.tumble,.3);let c=this.hurt(e,s.dmg*l.blade.atk/e.blade.def,l,"fling");this.own(l,"glue").some(h=>Math.hypot(h.x-r,h.z-a)<h.r)&&this.stun(e,s.stun),l.stats.skillHits++,this.emit("blast",{top:l,skill:s,x:r,z:a,r:2.2,hit:c,target:e});return}e.tumble=.2;let o=0;if(Bt(t)){let l=t.x-r,c=t.z-a,h=Math.hypot(l,c);if(h<s.aoe+t.radius*.5){h<.05?(l=1,c=0):(l/=h,c/=h);let u=h<2?1:1-.45*((h-2)/(s.aoe-1.5)),d=t.guard>0?.4:1;o=this.hurt(t,s.dmg*u*d*e.blade.atk/t.blade.def,e,"meteor"),this.knock(t,l,c,s.kb*u*d,.8*d,2),h<2.6&&(t.x=r+l*2.6,t.z=a+c*2.6),e.stats.skillHits++}}this.emit("meteor",{top:e,x:r,z:a,hit:o,target:o?t:null})}chargeDone(e,t){let n=e.charge.skill;if(n.id==="nova"){this.novaBlast(e,t);return}e.charge=null;let s=0,r=0;if(Bt(t)){let a=Math.hypot(t.x-e.x,t.z-e.z);if(a<n.aoe+t.radius*.5){let o=a>=n.inner,l=t.guard>0?.3:1;s=this.hurt(t,(o?n.dmg:n.weak)*l*e.blade.atk/t.blade.def,e,"decimate"),l===1&&this.affect(e,t,n,0,0),o&&(r=n.heal*(e.spinMax-e.spin),e.spin+=r),e.stats.skillHits++}}this.emit("blast",{top:e,skill:n,x:e.x,z:e.z,r:n.aoe,hit:s,target:s?t:null}),r>=1&&this.emit("heal",{top:e,amount:r})}novaBlast(e,t){let n=e.charge.skill;e.charge=null;let s=0;if(Bt(t)){let r=t.x-e.x,a=t.z-e.z,o=Math.hypot(r,a);if(o<n.aoe+t.radius*.5){o<.05?(r=1,a=0):(r/=o,a/=o);let l=o<3?1:1-.5*((o-3)/(n.aoe-2.5));s=this.hurt(t,n.dmg*l*e.blade.atk/t.blade.def,e,"nova"),this.knock(t,r,a,n.kb*l,.8,2),e.stats.skillHits++}}this.emit("nova",{top:e,x:e.x,z:e.z,hit:s,target:s?t:null})}updateChan(e,t,n){let s=e.chan,r=s.skill;if(s.t+=n,s.t<r.first+s.n*r.every)return;let a=s.n===r.shots-1?Re.curtainlast:Re.curtainshot,o=Math.atan2(s.dz,s.dx);if(Bt(t)){let l=Math.hypot(t.x-e.x,t.z-e.z)/a.speed,c=Math.atan2(t.z+t.vz*l-e.z,t.x+t.vx*l-e.x),h=Math.atan2(Math.sin(c-o),Math.cos(c-o));o+=bi(h,-r.half,r.half)}this.fire(e,a,Math.cos(o),Math.sin(o)),s.n++,s.n>=r.shots&&(e.chan=null,this.emit("chanEnd",{top:e}))}orbPos(e,t){let n=e.orbs,s=n.ang+t/n.skill.count*Math.PI*2;return{x:e.x+Math.cos(s)*n.skill.orbit,z:e.z+Math.sin(s)*n.skill.orbit}}updateOrbs(e,t,n){let s=e.orbs,r=s.skill;if(s.t-=n,s.ang+=4.2*n,s.cd=Math.max(0,s.cd-n),s.cd<=0&&Bt(t))for(let a=0;a<r.count;a++){if(!(s.alive&1<<a))continue;let o=this.orbPos(e,a);if(Math.hypot(t.x-o.x,t.z-o.z)>r.size+t.radius)continue;let l=t.x-e.x,c=t.z-e.z,h=Math.hypot(l,c)||1;l/=h,c/=h;let u=this.hurt(t,r.dmg*e.blade.atk*(t.guard>0?.3:1)/t.blade.def,e,"orb");t.guard<=0&&this.knock(t,l,c,r.kb,.2,1),s.alive&=~(1<<a),s.n--,s.cd=.25,e.stats.skillHits++,this.emit("orbHit",{top:e,target:t,x:o.x,z:o.z,dmg:u});break}(s.t<=0||s.n<=0)&&(e.orbs=null,this.emit("orbsEnd",{top:e}))}updateTether(e,t,n){let s=e.tether,r=s.skill;s.t+=n;let a=Math.hypot(t.x-e.x,t.z-e.z),o=!Bt(t)||a>r.breakRange;if(r.id==="ethereal"){if(!o&&s.t<s.T)return;if(e.tether=null,!o){let c=this.hurt(t,r.pop*e.blade.atk/t.blade.def,e,"ethereal");this.stun(t,r.root),this.emit("strike",{top:t,src:e,skill:r,x:t.x,z:t.z,dmg:c})}this.emit("tetherEnd",{top:e,broke:o});return}if(s.t>=s.T||o){s.acc>.5&&this.emit("drain",{top:e,target:t,dmg:s.acc,heal:s.acc*r.heal}),e.tether=null,this.emit("tetherEnd",{top:e,broke:s.t<s.T});return}let l=this.hurt(t,r.drain*n*e.blade.atk/t.blade.def,e,"drain");e.spin=Math.min(e.spinMax,e.spin+l*r.heal),t.slow=Math.max(t.slow,.15),s.acc+=l,s.tick+=n,s.tick>=.5&&(this.emit("drain",{top:e,target:t,dmg:s.acc,heal:s.acc*r.heal}),s.acc=0,s.tick=0)}updateZones(e){for(let t of this.zones){if(t.dead)continue;t.t+=e;let n=t.owner,s=this.other(n),r=t.skill,a=Bt(s)&&!this.result,o=Math.hypot(s.x-t.x,s.z-t.z);switch(t.kind){case"quake":{if(t.t<t.T)break;t.dead=!0;let l=0;if(a&&o<t.r+s.radius*.5){let c=s.x-t.x,h=s.z-t.z;o<.05?(c=0,h=1):(c/=o,h/=o);let u=s.guard>0?.3:1;l=this.hurt(s,r.dmg*u*n.blade.atk/s.blade.def,n,"quake"),u===1&&this.knock(s,c,h,r.kb,r.stun,0),n.stats.skillHits++}this.emit("quake",{top:n,x:t.x,z:t.z,r:t.r,hit:l,target:l?s:null});break}case"grenade":{if(t.t<t.T)break;t.dead=!0;let l=0;if(a&&o<t.r+s.radius*.5){let c=s.guard>0?.3:1;l=this.hurt(s,(t.c?r.bigDmg:r.dmg)*c*n.blade.atk/s.blade.def,n,"grenade"),c===1&&(t.c||o<r.core?this.stun(s,r.stun):s.slow=Math.max(s.slow,r.slow)),n.stats.skillHits++}for(let c of this.own(n,"turret"))Math.hypot(c.x-t.x,c.z-t.z)<t.r&&(c.a=r.boost);this.emit("blast",{top:n,skill:r,x:t.x,z:t.z,r:t.r,hit:l,target:l?s:null});break}case"sanctuary":if(t.t>=t.T||this.result){this.endZone(t);break}if(!n.out&&!n.air&&n.spin>0&&Math.hypot(n.x-t.x,n.z-t.z)<t.r){let l=Math.min(r.regen*e,n.spinMax-n.spin);n.spin+=l,t.a+=l,t.b+=e,t.b>=1&&(t.a>=1&&this.emit("heal",{top:n,amount:t.a}),t.a=0,t.b=0)}a&&o<t.r&&(s.slow=Math.max(s.slow,.2));break;case"lotus":t.c?t.t-t.a>=r.fuse&&(t.dead=!0,this.burst(n,r,t.x,t.z,t.r)):t.t>=t.T?this.endZone(t):t.t>=r.arm&&a&&o<r.trig+s.radius*.5&&(t.c=1,t.a=t.t,s.slow=Math.max(s.slow,r.slow),this.emit("say",{top:s,text:"TRAP!",tone:"red"}));break;case"blizzard":if(Ir(t),t.t>=t.T||this.result){this.endZone(t);break}a&&o<t.r+s.radius*.3&&(s.slow=Math.max(s.slow,.3),this.dot(s,r.dps*e*n.blade.atk/s.blade.def,n));break;case"poison":if(t.t>=t.T){t.dead=!0;break}a&&o<t.r+s.radius*.3&&(s.poison=r.linger);break;case"glue":if(t.t>=t.T){this.endZone(t);break}a&&o<t.r&&(s.ground=.25,s.slow=Math.max(s.slow,.25));break;case"turret":{if(t.t>=t.T||this.result){this.endZone(t);break}if(a&&o<t.r+s.radius*.6){this.endZone(t),this.emit("blast",{top:s,skill:r,x:t.x,z:t.z,r:1.6,hit:0,target:null});break}if(t.a=Math.max(0,t.a-e),t.b-=e,t.b<=0&&a&&o<r.reach){let l=Re.turretshot,c=o/l.speed,h=s.x+s.vx*c-t.x,u=s.z+s.vz*c-t.z,d=Math.hypot(h,u)||1;this.fire(n,l,h/d,u/d,{x:t.x,z:t.z,dmg:t.c?r.bigDmg:r.dmg}),t.b=r.rate*(t.a>0?.45:1)*(t.c?.7:1)}break}case"arise":{if(t.t>=t.T||this.result){this.endZone(t);break}if(t.c&1){let l=Re.conquer,c=t.dx-t.x,h=t.dz-t.z,u=Math.hypot(c,h),d=l.speed*e;if(u<=d){t.x=t.dx,t.z=t.dz,t.c=0;break}if(t.x+=c/u*d,t.z+=h/u*d,!(t.c&2)&&a&&Math.hypot(s.x-t.x,s.z-t.z)<l.aoe+s.radius*.5){for(let m of this.own(n,"arise"))m.c|=2;let f=this.hurt(s,l.dmg*(s.guard>0?.3:1)*n.blade.atk/s.blade.def,n,"conquer");s.guard<=0&&this.affect(n,s,l,0,0),n.stats.skillHits++,this.emit("strike",{top:s,src:n,skill:l,x:s.x,z:s.z,dmg:f})}break}if(t.b-=e,t.b<=0&&a&&o<r.reach+s.radius*.4&&!n.out&&Math.hypot(n.x-t.x,n.z-t.z)<r.leash){let l=this.hurt(s,r.dmg*(s.guard>0?.3:1)*n.blade.atk/s.blade.def,n,"arise");s.guard<=0&&this.push(s,(s.x-t.x)/(o||1),(s.z-t.z)/(o||1),r.kb),t.b=r.rate,this.emit("strike",{top:s,src:n,skill:r,x:t.x,z:t.z,dmg:l})}break}case"divide":{if(t.t>=t.T||this.result){this.endZone(t);break}let l=si(t);if(!t.c&&l.moving&&a){let c=s.x-l.x,h=s.z-l.z,u=c*l.nx+h*l.nz,d=-c*l.nz+h*l.nx;if(Math.abs(d)<r.wall+s.radius*.5&&u>-1.2&&u<s.radius+.8){t.c=1;let f=s.guard>0?.3:1,m=this.hurt(s,r.dmg*f*n.blade.atk/s.blade.def,n,"divide");f===1&&this.knock(s,l.nx,l.nz,r.kb,.6,2),n.stats.skillHits++,this.emit("strike",{top:s,src:n,skill:r,x:s.x,z:s.z,dmg:m,big:!0})}}break}default:(t.t>=t.T||this.result)&&this.endZone(t)}}this.zones.some(t=>t.dead)&&(this.zones=this.zones.filter(t=>!t.dead))}collide(e,t){if(!Bt(e)||!Bt(t))return;let n=t.x-e.x,s=t.z-e.z,r=Math.hypot(n,s),a=e.radius+t.radius;if(r>=a)return;if((e.dash&&e.dash.skill.through||t.dash&&t.dash.skill.through)&&e.guard<=0&&t.guard<=0){for(let T of[e,t]){let R=T.dash,I=this.other(T);if(!R||!R.skill.through||R.hit||!R.skill.pass||this.result)continue;R.hit=!0;let z=this.hurt(I,R.skill.pass*T.blade.atk/I.blade.def,T,R.skill.id);this.affect(T,I,R.skill,R.dx,R.dz),T.stats.skillHits++,this.emit("strike",{top:I,src:T,skill:R.skill,x:I.x,z:I.z,dmg:z}),R.skill.id==="sweep"&&(T.stack=Math.min(Re.galeq.stacks,T.stack+1),T.stackT=Re.galeq.keep)}return}r>1e-4?(n/=r,s/=r):(n=1,s=0);let o=e.mass+t.mass,l=a-r;e.x-=n*l*(t.mass/o),e.z-=s*l*(t.mass/o),t.x+=n*l*(e.mass/o),t.z+=s*l*(e.mass/o);let c=(e.vx-t.vx)*n+(e.vz-t.vz)*s;if(c<=0)return;let h=!this.result&&e.hitCd<=0&&t.hitCd<=0;if(!h&&!this.result&&(e.dash||t.dash))return;let u=Math.max(0,e.vx*n+e.vz*s),d=Math.max(0,-(t.vx*n+t.vz*s)),f=Ht(e),m=Ht(t),x=2+Math.min(c,24)*1,g=(u+1)/(u+d+2),p=x*(.3+.9*(1-g))*t.blade.atk/e.blade.def,S=x*(.3+.9*g)*e.blade.atk/t.blade.def,A=Math.min(c,24),v="clash",w=null,E=(T,R,I,z)=>{let B=R===t?1:-1;this.knock(R,B*n,B*s,I,z,1.6),T.vx=-B*n*3,T.vz=-B*s*3,this.stopDash(T),w=T},P=(T,R,I,z)=>{let B=I*T.blade.atk/R.blade.def;R===t?(S=S*z+B,p*=.2):(p=p*z+B,S*=.2)},y=!0;if(!h)y=!1;else if(e.guard>0!=t.guard>0){let T=e.guard>0?e:t,R=this.other(T);v="parry",A+=10,E(T,R,11.5,.65),T.guard=0,T.stats.parries++,this.emit("guardEnd",{top:T}),P(T,R,Re.aegis.parryDmg,.5)}else if(!!e.dash!=!!t.dash&&(e.dash||t.dash).skill.dmg){let T=e.dash?e:t,R=this.other(T),I=T.dash.skill;v="dash",A+=14,P(T,R,I.dmg*(I.perBleed?1+I.perBleed*R.bleed:1),I.keep??1),E(T,R,I.kb,.55),T.stats.skillHits++,this.affect(T,R,I,0,0,!1),I.liftUp&&(this.lift(R,I.liftUp),T.shield=I.shield,T.shieldT=I.hold)}else if(e.empower>0!=t.empower>0&&(e.empower>0?e:t).blade.emp){let T=e.empower>0?e:t,R=this.other(T),I=T.blade.emp;v="empower",A+=10,E(T,R,I.kb,.45),T.empower=0,T.stats.skillHits++,P(T,R,I.bonus,1),this.affect(T,R,I,0,0,!1)}else y=!1;if(!y){this.stopDash(e),this.stopDash(t);let T=1.5*c/(1/e.mass+1/t.mass)+2.5+1.5*(f+m),R=T/e.mass*(1+.35*(1-f))*(Rs(e)?.1:1),I=T/t.mass*(1+.35*(1-m))*(Rs(t)?.1:1);e.vx-=n*R,e.vz-=s*R,t.vx+=n*I,t.vz+=s*I;let z=.22*Math.min(c,24);e.vx+=-s*z,e.vz+=n*z,t.vx-=-s*z,t.vz-=n*z,f<.3&&R>12&&(e.launch=Math.max(e.launch,1.2)),m<.3&&I>12&&(t.launch=Math.max(t.launch,1.2))}h&&(e.hitCd=t.hitCd=.12,v==="clash"&&c>9&&(e.tumble=Math.max(e.tumble,.12),t.tumble=Math.max(t.tumble,.12)),e.stats.clashes++,t.stats.clashes++,p=this.hurt(e,p,t,v),S=this.hurt(t,S,e,v),this.emit("clash",{x:(e.x+t.x)/2,z:(e.z+t.z)/2,nx:n,nz:s,power:A,kind:v,src:w,a:e,b:t,dmgA:p,dmgB:S}))}barriers(e){if(!(e.air||e.out||e.blink))for(let t of this.zones){let n=t.skill;if(t.dead||!n.solid||t.kind==="divide"&&t.owner===e)continue;let s=si(t),r=e.x-s.x,a=e.z-s.z,o=r*s.nx+a*s.nz,l=-r*s.nz+a*s.nx,c=Ag+e.radius;if(Math.abs(l)>n.wall+e.radius*.6||Math.abs(o)>=c)continue;let h=s.moving||o>=0?1:-1;e.x+=s.nx*(c*h-o),e.z+=s.nz*(c*h-o);let u=(e.vx*s.nx+e.vz*s.nz)*h;s.moving&&u<n.speed&&!Ki(e)?(e.vx+=s.nx*(n.speed-u),e.vz+=s.nz*(n.speed-u)):u<0&&(e.vx-=1.4*u*h*s.nx,e.vz-=1.4*u*h*s.nz,this.stopDash(e),u<-5&&this.emit("bump",{top:e,x:e.x-s.nx*h*e.radius,z:e.z-s.nz*h*e.radius,nx:s.nx*h,nz:s.nz*h,power:-u}))}}walls(e){if(e.air||e.out)return;let t=Gf(e);if(!t||t.vn<=0)return;if(e.blink){e.blink.t=0;return}if(!this.result&&e.launch>0&&t.vn>ut.ringOutSpeed&&!(e.egg>0)){e.tether&&this.emit("tetherEnd",{top:e,broke:!0}),e.orbs&&this.emit("orbsEnd",{top:e}),e.out={t:0,y:0,vy:7+t.vn*.35},e.cmd=e.dash=e.cast=e.charge=e.tether=e.orbs=e.chan=null,e.guard=0,e.toggle=!1,this.emit("ringout",{top:e,x:e.x,z:e.z,nx:t.nx,nz:t.nz,power:t.vn}),this.finish(this.other(e),e,"over");return}Wf(e,t),this.stopDash(e);let n=0;t.vn>4&&(n=(t.vn-4)*(e.launch>0?2.2:1)/e.blade.def,n=this.hurt(e,n,e.launch>0?this.other(e):null,"wall")),t.vn>2&&this.emit("wall",{top:e,x:e.x+t.nx,z:e.z+t.nz,nx:t.nx,nz:t.nz,power:t.vn,dmg:n,slam:e.launch>0})}shatter(e){e.dead=!0,this.unre(e.owner,"flashfrost"),this.burst(e.owner,Re.shatter,e.x,e.z,Re.shatter.aoe)}stopped(e){for(let t of this.zones){if(t.dead||!(t.kind==="icewall"||t.kind==="windwall"&&t.owner!==e.owner))continue;let n=e.x-t.x,s=e.z-t.z;if(Math.abs(n*t.dx+s*t.dz)<.6&&Math.abs(-n*t.dz+s*t.dx)<t.skill.wall+e.r*.5)return!0}return!1}projHit(e,t){let n=e.owner,s=e.skill,r=1;s.chill&&(t.slow>0||t.tumble>0||t.up>0)&&(r=s.chill),s.exec&&(r*=1+s.exec*(1-Ht(t)));let a=t.scar>0,o=this.hurt(t,e.dmg*r/t.blade.def,n,s.id);if(s.chain&&this.pull(t,n,s.pull),this.affect(n,t,s,e.dx,e.dz),s.id==="galeq"&&(n.stack=Math.min(s.stacks,n.stack+1),n.stackT=s.keep),s.id==="flourish"&&a&&this.stun(t,s.root),s.id==="ethereal"&&(n.tether={t:0,T:s.dur,skill:s,acc:0,tick:0},this.emit("say",{top:t,text:"CHAINED",tone:""})),s.id==="windslash")for(let l of this.projectiles)l!==e&&l.skill===s&&l.owner===n&&(l.dead=!0);n.stats.skillHits++,s.pierce?e.hit=!0:e.dead=!0,this.emit("projHit",{proj:e,top:t,x:e.x,z:e.z,dx:e.dx,dz:e.dz,dmg:o})}updateProjectiles(e){for(let t of this.projectiles){if(t.dead)continue;let n=t.speed*e,s=t.skill;t.x+=t.dx*n,t.z+=t.dz*n,t.left-=n;let r=this.other(t.owner);if(this.stopped(t))t.dead=!0,s.re&&this.unre(t.owner,s.id),this.emit("projEnd",{proj:t,x:t.x,z:t.z});else if(!this.result&&!t.hit&&Bt(r)&&Math.hypot(r.x-t.x,r.z-t.z)<t.r+r.radius){if(r.guard>0){t.owner=r,t.dx=-t.dx,t.dz=-t.dz,t.left=s.range,t.dmg*=1.2,r.stats.parries++,this.emit("reflect",{top:r,proj:t,x:t.x,z:t.z});continue}this.projHit(t,r)}else(t.left<=0||Math.hypot(t.x,t.z)>ut.R+.5)&&(s.id==="flashfrost"?this.shatter(t):(t.dead=!0,this.emit("projEnd",{proj:t,x:t.x,z:t.z})))}this.projectiles.some(t=>t.dead)&&(this.projectiles=this.projectiles.filter(t=>!t.dead))}};var Ig={curtain:7.5,gear:6.5,frost:5.5,sand:5},Ps=class{constructor(e,t,n){this.world=e,this.me=t,this.foe=e.other(t),this.level=n,this.t=.6+e.rng()*.4,this.quick=0,this.dodged=new Set,this.keyOf={};for(let s of Ct)this.keyOf[An(t,s).id]=s}jitter(e,t=1){let n=this.world.rng,s=this.level.aimErr*t;return{x:e.x+(n()*2-1)*s,z:e.z+(n()*2-1)*s}}has(e){let t=this.keyOf[e];return t&&this.world.canCast(this.me,t)}again(e){let t=this.keyOf[e];return!!t&&this.me.re[t]>0}use(e,t=this.me.x,n=this.me.z){return this.world.cast(this.me,this.keyOf[e],t,n)}shoot(e,t=Re[e],n=1){let{me:s,foe:r}=this,a=this.jitter(Xf(s.x,s.z,r,s,t.speed,s.windup[this.keyOf[e]]),n);return this.use(e,a.x,a.z)}escape(e,t,n,s){let{world:r,me:a,level:o}=this,l=a.x-e,c=a.z-t,h=Math.hypot(l,c);if(h>n+1.5||r.rng()>o.dodge+.1)return!1;h<.1&&(l=-a.x||1,c=-a.z);let u=Math.hypot(l,c)||1;if(l/=u,c/=u,s<.3&&this.has("aegis"))return this.use("aegis");if(s<.6&&this.has("phantom"))return this.use("phantom",a.x+l*6,a.z+c*6);for(let d of["blitz","valor","sweep"])if(s<.7&&this.has(d))return this.use(d,a.x+l*9,a.z+c*9);return s<.7&&this.has("distort")&&!this.again("distort")?this.use("distort",a.x+l*8,a.z+c*8):(r.issueMove(a,e+l*(n+4),t+c*(n+4)),!0)}defence(e){let{world:t,me:n,foe:s,level:r}=this,a=t.rng;for(let o of t.projectiles){if(o.owner===n||this.dodged.has(o.id))continue;let l=n.x-o.x,c=n.z-o.z,h=l*o.dx+c*o.dz,u=l*-o.dz+c*o.dx;if(h<0||h>o.left||Math.abs(u)>2.6||(this.dodged.add(o.id),a()>r.dodge))continue;let d=u>=0?1:-1;return h/o.speed<.28&&this.has("aegis")?this.use("aegis"):h>4&&this.has("windwall")?this.use("windwall",o.x,o.z):h/o.speed<.3&&this.has("phantom")?this.use("phantom",n.x-o.dz*d*6,n.z+o.dx*d*6):(t.issueMove(n,n.x-o.dz*d*4.5,n.z+o.dx*d*4.5),!0)}for(let o of t.zones){if(o.owner===n)continue;let l=o.skill;if((o.kind==="quake"||o.kind==="grenade")&&this.escape(o.x,o.z,o.r,o.T-o.t)||o.kind==="lotus"&&o.c&&this.escape(o.x,o.z,o.r,l.fuse-(o.t-o.a))||(o.kind==="blizzard"||o.kind==="glue"||o.kind==="poison")&&Math.hypot(n.x-o.x,n.z-o.z)<o.r+.5&&this.escape(o.x,o.z,o.r,9))return!0;if(o.kind==="divide"&&si(o).moving&&a()<r.dodge){let c=si(o),h=-(n.x-c.x)*c.nz+(n.z-c.z)*c.nx;if(Math.abs(h)<l.wall+1.5){let u=h>=0?1:-1;return t.issueMove(n,n.x-c.nz*u*6,n.z+c.nx*u*6),!0}}}if(s.air&&s.air.skill.aoe&&this.escape(s.air.tx,s.air.tz,s.air.skill.aoe,s.air.T-s.air.t)||s.charge&&this.escape(s.x,s.z,s.charge.skill.aoe,s.charge.T-s.charge.t))return!0;if(s.chan&&a()<r.dodge){let o=(n.x-s.x)*-s.chan.dz+(n.z-s.z)*s.chan.dx>=0?1:-1;return t.issueMove(n,n.x-s.chan.dz*o*5,n.z+s.chan.dx*o*5),!0}if(s.tether&&a()<r.dodge){let o=e||1,l=n.x-(s.x-n.x)/o*9,c=n.z-(s.z-n.z)/o*9;return this.has("blitz")?this.use("blitz",l,c):this.has("phantom")?this.use("phantom",l,c):(t.issueMove(n,l,c),!0)}return this.has("aegis")&&e<7&&a()<r.dodge&&(s.dash||s.empower>0&&e<4)?this.use("aegis"):this.has("aegis")&&s.cast&&s.cast.skill.aim==="dash"&&e<8&&a()<r.dodge*.7?this.use("aegis"):this.has("icewall")&&s.dash&&e>3&&e<9&&a()<r.dodge*.6?this.use("icewall",(n.x+s.x)/2,(n.z+s.z)/2):this.has("valor")&&s.dash&&e<6&&a()<r.dodge*.5?this.use("valor",n.x-(s.x-n.x),n.z-(s.z-n.z)):!1}reflex(e){let{world:t,me:n,foe:s,level:r}=this;if(this.quick-=e,this.quick>0||t.busy(n)||!Bt(s))return!1;this.quick=.08+r.think*.25;let a=Math.hypot(s.x-n.x,s.z-n.z);if(this.again("flashfrost")){let o=t.projectiles.find(l=>l.owner===n&&l.skill.id==="flashfrost");if(o&&Math.hypot(s.x-o.x,s.z-o.z)<Re.shatter.aoe-.6&&t.rng()<r.cast+.3)return this.use("flashfrost")}return this.has("lastbreath")&&t.rng()<r.cast+.3?this.use("lastbreath"):this.has("fling")&&t.rng()<r.cast+.2?this.use("fling"):this.again("brokenwings")&&a<6.5&&this.has("brokenwings")?this.use("brokenwings",s.x,s.z):!1}offence(e){let{world:t,me:n,foe:s,level:r}=this,a=t.rng;if(!Bt(s))return!1;let o=(h=0)=>a()<r.cast+h,l=s.guard>0,c=h=>fo(s,n,h);if(this.has("meteor")&&!l&&e<Re.meteor.range+2&&o(s.tumble>0?.3:0)){let h=this.jitter(c(Re.meteor.air*.85),.8);return this.use("meteor",h.x,h.z)}if(this.has("nova")&&e<Re.nova.aoe-1.6&&o(s.tumble>0?.4:0))return this.use("nova");if(this.has("eclipse")&&e<Re.eclipse.range-2&&o(.1))return this.use("eclipse");if(this.has("deathmark")&&e<Re.deathmark.range-1&&o(.1))return this.use("deathmark");if(this.has("curtaincall")&&e>5&&e<22&&o())return this.use("curtaincall",s.x,s.z);if(this.has("blizzard")&&e<Re.blizzard.range+3&&o()){let h=this.jitter(c(.4),.6);return this.use("blizzard",h.x,h.z)}if(this.has("exile")){if(this.again("exile")){if(e<Re.windslash.range-1&&(Ht(s)<.5||n.re[this.keyOf.exile]<2.5)&&o(.2))return this.shoot("exile",Re.windslash,.6)}else if(e<9&&o())return this.use("exile")}if(this.has("mimic")&&e<11&&o())return this.shoot("mimic",{speed:34},.7);if(this.has("guillotine")&&!l&&e>2.5&&e<Re.guillotine.dist+.5&&o(s.bleed*.08-.1))return this.shoot("guillotine",Re.guillotine,.6);if(this.has("insanity")&&(Ht(n)<.75||e<5)&&o())return this.use("insanity");if(this.has("upgrade")&&e<12&&o())return this.use("upgrade");if(this.has("divide")&&e<6.5&&o(.1))return this.use("divide",s.x,s.z);if(l)return!1;if(this.has("blitz")&&e>3&&e<Re.blitz.dist+1&&o())return this.shoot("blitz",Re.blitz,.6);if(this.has("sweep")&&e>2.5&&e<Re.sweep.dist+1&&o(-.1))return this.use("sweep",s.x,s.z);if(this.has("brokenwings")&&!this.again("brokenwings")&&e>2.5&&e<7&&o())return this.use("brokenwings",s.x,s.z);if(this.has("distort")){if(this.again("distort")){if(o(-.2))return this.use("distort")}else if(e>3&&e<Re.distort.dist+1&&o()){let h=c(.2);return this.use("distort",h.x,h.z)}}if(this.has("shift")&&e>4&&t.own(n,"arise").some(h=>Math.hypot(h.x-s.x,h.z-s.z)<4.5)&&o(-.1))return this.use("shift");for(let h of["sonic","shuriken","fourshot","sigil","frostbite","flashfrost","flourish","ethereal","anchor","galeq"]){if(!this.has(h)||this.again(h))continue;let u=t.aimSkill(n,this.keyOf[h]),d=0;if(!(h==="anchor"&&e<4.5)&&(h==="frostbite"&&(d=s.slow>0||s.tumble>0?.4:-.15),h==="flourish"&&(d=s.scar>0?.3:-.25),h==="fourshot"&&(d=.15),h==="galeq"&&(d=n.stack>=u.stacks||u.up?.4:.15),e<u.range-1&&o(d)))return this.shoot(h,u)}if(this.has("phantom")&&e>3.5&&e<Re.phantom.range+2.5&&o(-.15)){let h=c(.25),u=Math.hypot(h.x-n.x,h.z-n.z)||1;return this.use("phantom",n.x+(h.x-n.x)/u*(u-2.2),n.z+(h.z-n.z)/u*(u-2.2))}for(let h of["quake","grenade"]){let u=Re[h];if(this.has(h)&&e<u.range+1&&o(s.tumble>.3||s.slow>.5?.3:0)){let d=this.jitter(c(u.delay+n.windup[this.keyOf[h]]),.7);return this.use(h,d.x,d.z)}}if(this.has("glue")&&e<Re.glue.range&&o()){let h=c(.3);return this.use("glue",h.x,h.z)}if(this.has("lotus")&&e<12&&o(-.2)){let h=this.jitter(c(.9),.6);return this.use("lotus",h.x,h.z)}for(let h of["flare","rockets","apprehend"]){let u=Re[h];if(!(h==="apprehend"&&e<3.5)&&this.has(h)&&e<u.range-.8&&o(.15)){let d=this.jitter(c(.08+n.windup[this.keyOf[h]]),.5);return this.use(h,d.x,d.z)}}if(this.has("kiburst")&&e<Re.kiburst.aoe-.2&&o(.2))return this.use("kiburst");if(this.has("slash")&&o(.1)){let h=Re.slash.aoe-.3;if(e<h||t.own(n,"shadow").some(u=>Math.hypot(u.x-s.x,u.z-s.z)<h))return this.use("slash")}if(this.has("decimate")&&e>2&&e<Re.decimate.aoe+.4&&o(.1))return this.use("decimate");if(this.has("cripple")&&e<6&&o())return this.use("cripple");if(this.has("satellite")&&e<9&&o())return this.use("satellite");if(this.has("sanctuary")&&Ht(n)<.82&&o(-.1))return this.use("sanctuary");if(this.has("aegis")&&e<3.4&&a()<r.cast*.25)return this.use("aegis");if(this.has("poison")){let h=e<9&&Ht(n)>.3;if(n.toggle!==h&&(!h||o()))return this.use("poison")}if(this.has("shadow")){if(this.again("shadow")){let h=t.own(n,"shadow").find(u=>u.c);if(h&&e>5&&Math.hypot(h.x-s.x,h.z-s.z)<3.5&&o(-.2))return this.use("shadow")}else if(e>3.5&&e<12&&o(-.1)){let h=this.jitter(c(.2),.6);return this.use("shadow",h.x,h.z)}}if(this.has("turret")&&e<13&&o(-.1)){let h=e||1;return this.use("turret",n.x+(s.x-n.x)/h*3+(a()-.5)*3,n.z+(s.z-n.z)/h*3+(a()-.5)*3)}if(this.has("arise")&&e<11&&o()){let h=this.jitter(c(.3),.6);return this.use("arise",h.x,h.z)}if(this.has("conquer")&&e<12&&!t.own(n,"arise").some(h=>Math.hypot(h.x-s.x,h.z-s.z)<Re.arise.reach)&&o()){let h=this.jitter(c(.25),.6);return this.use("conquer",h.x,h.z)}if(this.has("icewall")&&e>4&&e<8&&o(-.35)){let h=e||1;return this.use("icewall",s.x+(s.x-n.x)/h*2,s.z+(s.z-n.z)/h*2)}return this.has("valor")&&e>5&&e<9&&o(-.3)?this.use("valor",s.x,s.z):!1}update(e){let{world:t,me:n,foe:s,level:r}=this;if(t.result||n.out||n.air||n.blink||n.spin<=0||Rs(n)||this.reflex(e)||(this.t-=e,this.t>0))return;this.t=r.think*(.7+t.rng()*.6);let a=t.rng,o=s.x-n.x,l=s.z-n.z,c=Math.hypot(o,l);if(this.defence(c)||this.offence(c)||n.tumble>0||n.dash||n.cast)return;let h=Math.hypot(n.x,n.z);if(n.launch>0&&h>ut.R-4){t.issueMove(n,n.x*.3,n.z*.3);return}if(s.guard>0&&c<6){t.issueMove(n,n.x-o/c*5,n.z-l/c*5);return}let u=t.zones.find(g=>g.owner===n&&g.kind==="sanctuary");if(u&&Ht(n)<.95&&a()<.7){Math.hypot(n.x-u.x,n.z-u.z)>u.r*.6&&t.issueMove(n,u.x,u.z);return}let d=t.zones.find(g=>g.owner===s&&g.kind==="sanctuary");if(d&&Math.hypot(s.x-d.x,s.z-d.z)<d.r&&a()<r.dodge*.6||!Bt(s))return;let f=Ig[n.blade.id];if(f&&c<f&&!(s.egg>0)&&a()<.75){let g=c||1,p=n.x-o/g*5-l/g*3,S=n.z-l/g*5+o/g*3,A=ut.R-3,v=Math.hypot(p,S);v>A&&(p*=A/v,S*=A/v),t.issueMove(n,p,S);return}let m=Ht(n)-Ht(s),x=r.chase+(m<-.1?.15:0)+(n.empower>0||n.orbs?.35:0)+(n.tether?.3:0)+(s.egg>0||s.up>0?.4:0);if(!(f&&a()<.5)&&a()<x){let g=fo(s,n,Math.min(.5,c/20));t.issueMove(n,g.x,g.z)}}};var Rp=0,hu=1,Pp=2;var us=1,Ip=2,ur=3,Ni=0,tn=1,Nt=2,Pn=0,dr=1,Lt=2,uu=3,du=4,Lp=5;var ds=100,kp=101,Dp=102,Np=103,Up=104,zp=200,Op=201,Fp=202,Bp=203,fu=204,pu=205,Hp=206,Vp=207,Gp=208,Wp=209,Xp=210,qp=211,Yp=212,$p=213,Zp=214,Xo=0,qo=1,Yo=2,js=3,$o=4,Zo=5,jo=6,Jo=7,Pl=0,jp=1,Jp=2,Hn=0,Ca=1,Ra=2,Pa=3,fs=4,Ia=5,La=6,ka=7;var mu=300,Ui=301,ps=302,Il=303,Ll=304,Da=306,Ko=1e3,Yn=1001,Qo=1002,jt=1003,Kp=1004;var Na=1005;var en=1006,kl=1007;var zi=1008;var xn=1009,gu=1010,xu=1011,fr=1012,Dl=1013,Vn=1014,In=1015,nn=1016,Nl=1017,Ul=1018,pr=1020,_u=35902,yu=35899,vu=1021,bu=1022,Ln=1023,$n=1026,Oi=1027,zl=1028,Ol=1029,Fi=1030,Fl=1031;var Bl=1033,Ua=33776,za=33777,Oa=33778,Fa=33779,Hl=35840,Vl=35841,Gl=35842,Wl=35843,Xl=36196,ql=37492,Yl=37496,$l=37488,Zl=37489,Ba=37490,jl=37491,Jl=37808,Kl=37809,Ql=37810,ec=37811,tc=37812,nc=37813,ic=37814,sc=37815,rc=37816,ac=37817,oc=37818,lc=37819,cc=37820,hc=37821,uc=36492,dc=36494,fc=36495,pc=36283,mc=36284,Ha=36285,gc=36286;var qr=2300,el=2301,Go=2302,jh=2303,Jh=2400,Kh=2401,Qh=2402;var Qp=3200;var Va=0,em=1,gi="",Gt="srgb",Yr="srgb-linear",$r="linear",dt="srgb";var Wo=7680;var tm=519,nm=512,im=513,sm=514,xc=515,rm=516,am=517,_c=518,om=519,Mu=35044,ms=35048;var Su="300 es",Bn=2e3,Js=2001;function Lg(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function kg(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Zr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function lm(){let i=Zr("canvas");return i.style.display="block",i}var qf={},Ks=null;function jr(...i){let e="THREE."+i.shift();Ks?Ks("log",e,...i):console.log(e,...i)}function cm(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Ye(...i){i=cm(i);let e="THREE."+i.shift();if(Ks)Ks("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function qe(...i){i=cm(i);let e="THREE."+i.shift();if(Ks)Ks("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function ss(...i){let e=i.join(" ");e in qf||(qf[e]=!0,Ye(...i))}function hm(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var um={[Xo]:qo,[Yo]:jo,[$o]:Jo,[js]:Zo,[qo]:Xo,[jo]:Yo,[Jo]:$o,[Zo]:js},Zn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},rn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Mh=Math.PI/180,tl=180/Math.PI;function ui(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(rn[i&255]+rn[i>>8&255]+rn[i>>16&255]+rn[i>>24&255]+"-"+rn[e&255]+rn[e>>8&255]+"-"+rn[e>>16&15|64]+rn[e>>24&255]+"-"+rn[t&63|128]+rn[t>>8&255]+"-"+rn[t>>16&255]+rn[t>>24&255]+rn[n&255]+rn[n>>8&255]+rn[n>>16&255]+rn[n>>24&255]).toLowerCase()}function it(i,e,t){return Math.max(e,Math.min(t,i))}function Dg(i,e){return(i%e+e)%e}function Sh(i,e,t){return(1-t)*i+t*e}function qn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function bt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var Ru=class Ru{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=it(this.x,e.x,t.x),this.y=it(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=it(this.x,e,t),this.y=it(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(it(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(it(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Ru.prototype.isVector2=!0;var se=Ru,jn=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3],d=r[a+0],f=r[a+1],m=r[a+2],x=r[a+3];if(u!==x||l!==d||c!==f||h!==m){let g=l*d+c*f+h*m+u*x;g<0&&(d=-d,f=-f,m=-m,x=-x,g=-g);let p=1-o;if(g<.9995){let S=Math.acos(g),A=Math.sin(S);p=Math.sin(p*S)/A,o=Math.sin(o*S)/A,l=l*p+d*o,c=c*p+f*o,h=h*p+m*o,u=u*p+x*o}else{l=l*p+d*o,c=c*p+f*o,h=h*p+m*o,u=u*p+x*o;let S=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=S,c*=S,h*=S,u*=S}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,a){let o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[a],d=r[a+1],f=r[a+2],m=r[a+3];return e[t]=o*m+h*u+l*f-c*d,e[t+1]=l*m+h*d+c*u-o*f,e[t+2]=c*m+h*f+o*d-l*u,e[t+3]=h*m-o*u-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),u=o(r/2),d=l(n/2),f=l(s/2),m=l(r/2);switch(a){case"XYZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"YXZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"ZXY":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"ZYX":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"YZX":this._x=d*h*u+c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u-d*f*m;break;case"XZY":this._x=d*h*u-c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u+d*f*m;break;default:Ye("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+o+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(a-s)*f}else if(n>o&&n>u){let f=2*Math.sqrt(1+n-o-u);this._w=(h-l)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+c)/f}else if(o>u){let f=2*Math.sqrt(1+o-n-u);this._w=(r-c)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+u-n-o);this._w=(a-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(it(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){let c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Pu=class Pu{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Yf.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Yf.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),h=2*(o*t-r*s),u=2*(r*n-a*t);return this.x=t+l*c+a*u-o*h,this.y=n+l*h+o*c-r*u,this.z=s+l*u+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=it(this.x,e.x,t.x),this.y=it(this.y,e.y,t.y),this.z=it(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=it(this.x,e,t),this.y=it(this.y,e,t),this.z=it(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(it(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Th.copy(this).projectOnVector(e),this.sub(Th)}reflect(e){return this.sub(Th.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(it(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Pu.prototype.isVector3=!0;var L=Pu,Th=new L,Yf=new jn,Iu=class Iu{constructor(e,t,n,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],m=n[8],x=s[0],g=s[3],p=s[6],S=s[1],A=s[4],v=s[7],w=s[2],E=s[5],P=s[8];return r[0]=a*x+o*S+l*w,r[3]=a*g+o*A+l*E,r[6]=a*p+o*v+l*P,r[1]=c*x+h*S+u*w,r[4]=c*g+h*A+u*E,r[7]=c*p+h*v+u*P,r[2]=d*x+f*S+m*w,r[5]=d*g+f*A+m*E,r[8]=d*p+f*v+m*P,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,d=o*l-h*r,f=c*r-a*l,m=t*u+n*d+s*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/m;return e[0]=u*x,e[1]=(s*c-h*n)*x,e[2]=(o*n-s*a)*x,e[3]=d*x,e[4]=(h*t-s*l)*x,e[5]=(s*r-o*t)*x,e[6]=f*x,e[7]=(n*l-c*t)*x,e[8]=(a*t-n*r)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return ss("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Eh.makeScale(e,t)),this}rotate(e){return ss("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Eh.makeRotation(-e)),this}translate(e,t){return ss("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Eh.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Iu.prototype.isMatrix3=!0;var Ke=Iu,Eh=new Ke,$f=new Ke().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Zf=new Ke().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Ng(){let i={enabled:!0,workingColorSpace:Yr,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===dt&&(s.r=di(s.r),s.g=di(s.g),s.b=di(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===dt&&(s.r=Zs(s.r),s.g=Zs(s.g),s.b=Zs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===gi?$r:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return ss("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return ss("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Yr]:{primaries:e,whitePoint:n,transfer:$r,toXYZ:$f,fromXYZ:Zf,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Gt},outputColorSpaceConfig:{drawingBufferColorSpace:Gt}},[Gt]:{primaries:e,whitePoint:n,transfer:dt,toXYZ:$f,fromXYZ:Zf,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Gt}}}),i}var st=Ng();function di(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Zs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Is,nl=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Is===void 0&&(Is=Zr("canvas")),Is.width=e.width,Is.height=e.height;let s=Is.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Is}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Zr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=di(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(di(t[n]/255)*255):t[n]=di(t[n]);return{data:t,width:e.width,height:e.height}}else return Ye("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Ug=0,Qs=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Ug++}),this.uuid=ui(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(wh(s[a].image)):r.push(wh(s[a]))}else r=wh(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function wh(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?nl.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Ye("Texture: Unable to serialize Texture."),{})}var zg=0,Ah=new L,fn=class i extends Zn{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Yn,s=Yn,r=en,a=zi,o=Ln,l=xn,c=i.DEFAULT_ANISOTROPY,h=gi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:zg++}),this.uuid=ui(),this.name="",this.source=new Qs(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new se(0,0),this.repeat=new se(1,1),this.center=new se(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ke,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Ah).x}get height(){return this.source.getSize(Ah).y}get depth(){return this.source.getSize(Ah).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Ye(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ye(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==mu)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ko:e.x=e.x-Math.floor(e.x);break;case Yn:e.x=e.x<0?0:1;break;case Qo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ko:e.y=e.y-Math.floor(e.y);break;case Yn:e.y=e.y<0?0:1;break;case Qo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};fn.DEFAULT_IMAGE=null;fn.DEFAULT_MAPPING=mu;fn.DEFAULT_ANISOTROPY=1;var Lu=class Lu{constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],m=l[9],x=l[2],g=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-x)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+x)<.1&&Math.abs(m+g)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let A=(c+1)/2,v=(f+1)/2,w=(p+1)/2,E=(h+d)/4,P=(u+x)/4,y=(m+g)/4;return A>v&&A>w?A<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(A),s=E/n,r=P/n):v>w?v<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),n=E/s,r=y/s):w<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),n=P/r,s=y/r),this.set(n,s,r,t),this}let S=Math.sqrt((g-m)*(g-m)+(u-x)*(u-x)+(d-h)*(d-h));return Math.abs(S)<.001&&(S=1),this.x=(g-m)/S,this.y=(u-x)/S,this.z=(d-h)/S,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=it(this.x,e.x,t.x),this.y=it(this.y,e.y,t.y),this.z=it(this.z,e.z,t.z),this.w=it(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=it(this.x,e,t),this.y=it(this.y,e,t),this.z=it(this.z,e,t),this.w=it(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(it(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Lu.prototype.isVector4=!0;var Dt=Lu,il=class extends Zn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:en,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Dt(0,0,e,t),this.scissorTest=!1,this.viewport=new Dt(0,0,e,t),this.textures=[];let s={width:e,height:t,depth:n.depth},r=new fn(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:en,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new Qs(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Wt=class extends il{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Jr=class extends fn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=jt,this.minFilter=jt,this.wrapR=Yn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var sl=class extends fn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=jt,this.minFilter=jt,this.wrapR=Yn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var Rl=class Rl{constructor(e,t,n,s,r,a,o,l,c,h,u,d,f,m,x,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,h,u,d,f,m,x,g)}set(e,t,n,s,r,a,o,l,c,h,u,d,f,m,x,g){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=m,p[11]=x,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Rl().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,s=1/Ls.setFromMatrixColumn(e,0).length(),r=1/Ls.setFromMatrixColumn(e,1).length(),a=1/Ls.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let d=a*h,f=a*u,m=o*h,x=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+m*c,t[5]=d-x*c,t[9]=-o*l,t[2]=x-d*c,t[6]=m+f*c,t[10]=a*l}else if(e.order==="YXZ"){let d=l*h,f=l*u,m=c*h,x=c*u;t[0]=d+x*o,t[4]=m*o-f,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=f*o-m,t[6]=x+d*o,t[10]=a*l}else if(e.order==="ZXY"){let d=l*h,f=l*u,m=c*h,x=c*u;t[0]=d-x*o,t[4]=-a*u,t[8]=m+f*o,t[1]=f+m*o,t[5]=a*h,t[9]=x-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let d=a*h,f=a*u,m=o*h,x=o*u;t[0]=l*h,t[4]=m*c-f,t[8]=d*c+x,t[1]=l*u,t[5]=x*c+d,t[9]=f*c-m,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let d=a*l,f=a*c,m=o*l,x=o*c;t[0]=l*h,t[4]=x-d*u,t[8]=m*u+f,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=f*u+m,t[10]=d-x*u}else if(e.order==="XZY"){let d=a*l,f=a*c,m=o*l,x=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+x,t[5]=a*h,t[9]=f*u-m,t[2]=m*u-f,t[6]=o*h,t[10]=x*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Og,e,Fg)}lookAt(e,t,n){let s=this.elements;return vn.subVectors(e,t),vn.lengthSq()===0&&(vn.z=1),vn.normalize(),Mi.crossVectors(n,vn),Mi.lengthSq()===0&&(Math.abs(n.z)===1?vn.x+=1e-4:vn.z+=1e-4,vn.normalize(),Mi.crossVectors(n,vn)),Mi.normalize(),po.crossVectors(vn,Mi),s[0]=Mi.x,s[4]=po.x,s[8]=vn.x,s[1]=Mi.y,s[5]=po.y,s[9]=vn.y,s[2]=Mi.z,s[6]=po.z,s[10]=vn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],m=n[2],x=n[6],g=n[10],p=n[14],S=n[3],A=n[7],v=n[11],w=n[15],E=s[0],P=s[4],y=s[8],T=s[12],R=s[1],I=s[5],z=s[9],B=s[13],D=s[2],H=s[6],X=s[10],F=s[14],J=s[3],q=s[7],Q=s[11],ee=s[15];return r[0]=a*E+o*R+l*D+c*J,r[4]=a*P+o*I+l*H+c*q,r[8]=a*y+o*z+l*X+c*Q,r[12]=a*T+o*B+l*F+c*ee,r[1]=h*E+u*R+d*D+f*J,r[5]=h*P+u*I+d*H+f*q,r[9]=h*y+u*z+d*X+f*Q,r[13]=h*T+u*B+d*F+f*ee,r[2]=m*E+x*R+g*D+p*J,r[6]=m*P+x*I+g*H+p*q,r[10]=m*y+x*z+g*X+p*Q,r[14]=m*T+x*B+g*F+p*ee,r[3]=S*E+A*R+v*D+w*J,r[7]=S*P+A*I+v*H+w*q,r[11]=S*y+A*z+v*X+w*Q,r[15]=S*T+A*B+v*F+w*ee,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],m=e[3],x=e[7],g=e[11],p=e[15],S=l*f-c*d,A=o*f-c*u,v=o*d-l*u,w=a*f-c*h,E=a*d-l*h,P=a*u-o*h;return t*(x*S-g*A+p*v)-n*(m*S-g*w+p*E)+s*(m*A-x*w+p*P)-r*(m*v-x*E+g*P)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(a*h-o*c)-n*(r*h-o*l)+s*(r*c-a*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],m=e[12],x=e[13],g=e[14],p=e[15],S=t*o-n*a,A=t*l-s*a,v=t*c-r*a,w=n*l-s*o,E=n*c-r*o,P=s*c-r*l,y=h*x-u*m,T=h*g-d*m,R=h*p-f*m,I=u*g-d*x,z=u*p-f*x,B=d*p-f*g,D=S*B-A*z+v*I+w*R-E*T+P*y;if(D===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let H=1/D;return e[0]=(o*B-l*z+c*I)*H,e[1]=(s*z-n*B-r*I)*H,e[2]=(x*P-g*E+p*w)*H,e[3]=(d*E-u*P-f*w)*H,e[4]=(l*R-a*B-c*T)*H,e[5]=(t*B-s*R+r*T)*H,e[6]=(g*v-m*P-p*A)*H,e[7]=(h*P-d*v+f*A)*H,e[8]=(a*z-o*R+c*y)*H,e[9]=(n*R-t*z-r*y)*H,e[10]=(m*E-x*v+p*S)*H,e[11]=(u*v-h*E-f*S)*H,e[12]=(o*T-a*I-l*y)*H,e[13]=(t*I-n*T+s*y)*H,e[14]=(x*A-m*w-g*S)*H,e[15]=(h*w-u*A+d*S)*H,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,u=o+o,d=r*c,f=r*h,m=r*u,x=a*h,g=a*u,p=o*u,S=l*c,A=l*h,v=l*u,w=n.x,E=n.y,P=n.z;return s[0]=(1-(x+p))*w,s[1]=(f+v)*w,s[2]=(m-A)*w,s[3]=0,s[4]=(f-v)*E,s[5]=(1-(d+p))*E,s[6]=(g+S)*E,s[7]=0,s[8]=(m+A)*P,s[9]=(g-S)*P,s[10]=(1-(d+x))*P,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=Ls.set(s[0],s[1],s[2]).length(),o=Ls.set(s[4],s[5],s[6]).length(),l=Ls.set(s[8],s[9],s[10]).length();r<0&&(a=-a),Un.copy(this);let c=1/a,h=1/o,u=1/l;return Un.elements[0]*=c,Un.elements[1]*=c,Un.elements[2]*=c,Un.elements[4]*=h,Un.elements[5]*=h,Un.elements[6]*=h,Un.elements[8]*=u,Un.elements[9]*=u,Un.elements[10]*=u,t.setFromRotationMatrix(Un),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,s,r,a,o=Bn,l=!1){let c=this.elements,h=2*r/(t-e),u=2*r/(n-s),d=(t+e)/(t-e),f=(n+s)/(n-s),m,x;if(l)m=r/(a-r),x=a*r/(a-r);else if(o===Bn)m=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===Js)m=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=Bn,l=!1){let c=this.elements,h=2/(t-e),u=2/(n-s),d=-(t+e)/(t-e),f=-(n+s)/(n-s),m,x;if(l)m=1/(a-r),x=a/(a-r);else if(o===Bn)m=-2/(a-r),x=-(a+r)/(a-r);else if(o===Js)m=-1/(a-r),x=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=m,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};Rl.prototype.isMatrix4=!0;var mt=Rl,Ls=new L,Un=new mt,Og=new L(0,0,0),Fg=new L(1,1,1),Mi=new L,po=new L,vn=new L,jf=new mt,Jf=new jn,Jn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(it(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-it(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(it(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-it(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(it(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-it(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Ye("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return jf.makeRotationFromQuaternion(e),this.setFromRotationMatrix(jf,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Jf.setFromEuler(this),this.setFromQuaternion(Jf,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Jn.DEFAULT_ORDER="XYZ";var er=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Bg=0,Kf=new L,ks=new jn,ri=new mt,mo=new L,kr=new L,Hg=new L,Vg=new jn,Qf=new L(1,0,0),ep=new L(0,1,0),tp=new L(0,0,1),np={type:"added"},Gg={type:"removed"},Ds={type:"childadded",child:null},Ch={type:"childremoved",child:null},Ot=class i extends Zn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Bg++}),this.uuid=ui(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new L,t=new Jn,n=new jn,s=new L(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new mt},normalMatrix:{value:new Ke}}),this.matrix=new mt,this.matrixWorld=new mt,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new er,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ks.setFromAxisAngle(e,t),this.quaternion.multiply(ks),this}rotateOnWorldAxis(e,t){return ks.setFromAxisAngle(e,t),this.quaternion.premultiply(ks),this}rotateX(e){return this.rotateOnAxis(Qf,e)}rotateY(e){return this.rotateOnAxis(ep,e)}rotateZ(e){return this.rotateOnAxis(tp,e)}translateOnAxis(e,t){return Kf.copy(e).applyQuaternion(this.quaternion),this.position.add(Kf.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Qf,e)}translateY(e){return this.translateOnAxis(ep,e)}translateZ(e){return this.translateOnAxis(tp,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ri.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?mo.copy(e):mo.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),kr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ri.lookAt(kr,mo,this.up):ri.lookAt(mo,kr,this.up),this.quaternion.setFromRotationMatrix(ri),s&&(ri.extractRotation(s.matrixWorld),ks.setFromRotationMatrix(ri),this.quaternion.premultiply(ks.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(qe("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(np),Ds.child=e,this.dispatchEvent(Ds),Ds.child=null):qe("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Gg),Ch.child=e,this.dispatchEvent(Ch),Ch.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ri.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ri.multiply(e.parent.matrixWorld)),e.applyMatrix4(ri),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(np),Ds.child=e,this.dispatchEvent(Ds),Ds.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(kr,e,Hg),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(kr,Vg,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),f=a(e.animations),m=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),m.length>0&&(n.nodes=m)}return n.object=s,n;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Ot.DEFAULT_UP=new L(0,1,0);Ot.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ot.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var gn=class extends Ot{constructor(){super(),this.isGroup=!0,this.type="Group"}},Wg={type:"move"},tr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new gn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new gn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new gn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let x of e.hand.values()){let g=t.getJointPose(x,n),p=this._getHandJoint(c,x);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,m=.005;c.inputState.pinching&&d>f+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Wg)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new gn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},dm={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Si={h:0,s:0,l:0},go={h:0,s:0,l:0};function Rh(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var we=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Gt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,st.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=st.workingColorSpace){return this.r=e,this.g=t,this.b=n,st.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=st.workingColorSpace){if(e=Dg(e,1),t=it(t,0,1),n=it(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Rh(a,r,e+1/3),this.g=Rh(a,r,e),this.b=Rh(a,r,e-1/3)}return st.colorSpaceToWorking(this,s),this}setStyle(e,t=Gt){function n(r){r!==void 0&&parseFloat(r)<1&&Ye("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ye("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Ye("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Gt){let n=dm[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ye("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=di(e.r),this.g=di(e.g),this.b=di(e.b),this}copyLinearToSRGB(e){return this.r=Zs(e.r),this.g=Zs(e.g),this.b=Zs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Gt){return st.workingToColorSpace(an.copy(this),e),Math.round(it(an.r*255,0,255))*65536+Math.round(it(an.g*255,0,255))*256+Math.round(it(an.b*255,0,255))}getHexString(e=Gt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=st.workingColorSpace){st.workingToColorSpace(an.copy(this),t);let n=an.r,s=an.g,r=an.b,a=Math.max(n,s,r),o=Math.min(n,s,r),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=st.workingColorSpace){return st.workingToColorSpace(an.copy(this),t),e.r=an.r,e.g=an.g,e.b=an.b,e}getStyle(e=Gt){st.workingToColorSpace(an.copy(this),e);let t=an.r,n=an.g,s=an.b;return e!==Gt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Si),this.setHSL(Si.h+e,Si.s+t,Si.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Si),e.getHSL(go);let n=Sh(Si.h,go.h,t),s=Sh(Si.s,go.s,t),r=Sh(Si.l,go.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},an=new we;we.NAMES=dm;var Kr=class i{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new we(e),this.density=t}clone(){return new i(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var rs=class extends Ot{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Jn,this.environmentIntensity=1,this.environmentRotation=new Jn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},zn=new L,ai=new L,Ph=new L,oi=new L,Ns=new L,Us=new L,ip=new L,Ih=new L,Lh=new L,kh=new L,Dh=new Dt,Nh=new Dt,Uh=new Dt,hi=class i{constructor(e=new L,t=new L,n=new L){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),zn.subVectors(e,t),s.cross(zn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){zn.subVectors(s,t),ai.subVectors(n,t),Ph.subVectors(e,t);let a=zn.dot(zn),o=zn.dot(ai),l=zn.dot(Ph),c=ai.dot(ai),h=ai.dot(Ph),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(c*l-o*h)*d,m=(a*h-o*l)*d;return r.set(1-f-m,m,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,oi)===null?!1:oi.x>=0&&oi.y>=0&&oi.x+oi.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,oi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,oi.x),l.addScaledVector(a,oi.y),l.addScaledVector(o,oi.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return Dh.setScalar(0),Nh.setScalar(0),Uh.setScalar(0),Dh.fromBufferAttribute(e,t),Nh.fromBufferAttribute(e,n),Uh.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Dh,r.x),a.addScaledVector(Nh,r.y),a.addScaledVector(Uh,r.z),a}static isFrontFacing(e,t,n,s){return zn.subVectors(n,t),ai.subVectors(e,t),zn.cross(ai).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return zn.subVectors(this.c,this.b),ai.subVectors(this.a,this.b),zn.cross(ai).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,a,o;Ns.subVectors(s,n),Us.subVectors(r,n),Ih.subVectors(e,n);let l=Ns.dot(Ih),c=Us.dot(Ih);if(l<=0&&c<=0)return t.copy(n);Lh.subVectors(e,s);let h=Ns.dot(Lh),u=Us.dot(Lh);if(h>=0&&u<=h)return t.copy(s);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(Ns,a);kh.subVectors(e,r);let f=Ns.dot(kh),m=Us.dot(kh);if(m>=0&&f<=m)return t.copy(r);let x=f*c-l*m;if(x<=0&&c>=0&&m<=0)return o=c/(c-m),t.copy(n).addScaledVector(Us,o);let g=h*m-f*u;if(g<=0&&u-h>=0&&f-m>=0)return ip.subVectors(r,s),o=(u-h)/(u-h+(f-m)),t.copy(s).addScaledVector(ip,o);let p=1/(g+x+d);return a=x*p,o=d*p,t.copy(n).addScaledVector(Ns,a).addScaledVector(Us,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Kn=class{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(On.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(On.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=On.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,On):On.fromBufferAttribute(r,a),On.applyMatrix4(e.matrixWorld),this.expandByPoint(On);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),xo.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),xo.copy(n.boundingBox)),xo.applyMatrix4(e.matrixWorld),this.union(xo)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,On),On.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Dr),_o.subVectors(this.max,Dr),zs.subVectors(e.a,Dr),Os.subVectors(e.b,Dr),Fs.subVectors(e.c,Dr),Ti.subVectors(Os,zs),Ei.subVectors(Fs,Os),Qi.subVectors(zs,Fs);let t=[0,-Ti.z,Ti.y,0,-Ei.z,Ei.y,0,-Qi.z,Qi.y,Ti.z,0,-Ti.x,Ei.z,0,-Ei.x,Qi.z,0,-Qi.x,-Ti.y,Ti.x,0,-Ei.y,Ei.x,0,-Qi.y,Qi.x,0];return!zh(t,zs,Os,Fs,_o)||(t=[1,0,0,0,1,0,0,0,1],!zh(t,zs,Os,Fs,_o))?!1:(yo.crossVectors(Ti,Ei),t=[yo.x,yo.y,yo.z],zh(t,zs,Os,Fs,_o))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,On).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(On).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(li[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),li[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),li[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),li[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),li[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),li[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),li[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),li[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(li),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},li=[new L,new L,new L,new L,new L,new L,new L,new L],On=new L,xo=new Kn,zs=new L,Os=new L,Fs=new L,Ti=new L,Ei=new L,Qi=new L,Dr=new L,_o=new L,yo=new L,es=new L;function zh(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){es.fromArray(i,r);let o=s.x*Math.abs(es.x)+s.y*Math.abs(es.y)+s.z*Math.abs(es.z),l=e.dot(es),c=t.dot(es),h=n.dot(es);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var Vt=new L,vo=new se,Xg=0,Pt=class extends Zn{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Xg++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Mu,this.updateRanges=[],this.gpuType=In,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)vo.fromBufferAttribute(this,t),vo.applyMatrix3(e),this.setXY(t,vo.x,vo.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Vt.fromBufferAttribute(this,t),Vt.applyMatrix3(e),this.setXYZ(t,Vt.x,Vt.y,Vt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Vt.fromBufferAttribute(this,t),Vt.applyMatrix4(e),this.setXYZ(t,Vt.x,Vt.y,Vt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Vt.fromBufferAttribute(this,t),Vt.applyNormalMatrix(e),this.setXYZ(t,Vt.x,Vt.y,Vt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Vt.fromBufferAttribute(this,t),Vt.transformDirection(e),this.setXYZ(t,Vt.x,Vt.y,Vt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=qn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=bt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=qn(t,this.array)),t}setX(e,t){return this.normalized&&(t=bt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=qn(t,this.array)),t}setY(e,t){return this.normalized&&(t=bt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=qn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=bt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=qn(t,this.array)),t}setW(e,t){return this.normalized&&(t=bt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=bt(t,this.array),n=bt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=bt(t,this.array),n=bt(n,this.array),s=bt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=bt(t,this.array),n=bt(n,this.array),s=bt(s,this.array),r=bt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var Qr=class extends Pt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var ea=class extends Pt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var lt=class extends Pt{constructor(e,t,n){super(new Float32Array(e),t,n)}},qg=new Kn,Nr=new L,Oh=new L,Qn=class{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):qg.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Nr.subVectors(e,this.center);let t=Nr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Nr,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Oh.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Nr.copy(e.center).add(Oh)),this.expandByPoint(Nr.copy(e.center).sub(Oh))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Yg=0,Cn=new mt,Fh=new Ot,Bs=new L,bn=new Kn,Ur=new Kn,Zt=new L,Mt=class i extends Zn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Yg++}),this.uuid=ui(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Lg(e)?ea:Qr)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Ke().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Cn.makeRotationFromQuaternion(e),this.applyMatrix4(Cn),this}rotateX(e){return Cn.makeRotationX(e),this.applyMatrix4(Cn),this}rotateY(e){return Cn.makeRotationY(e),this.applyMatrix4(Cn),this}rotateZ(e){return Cn.makeRotationZ(e),this.applyMatrix4(Cn),this}translate(e,t,n){return Cn.makeTranslation(e,t,n),this.applyMatrix4(Cn),this}scale(e,t,n){return Cn.makeScale(e,t,n),this.applyMatrix4(Cn),this}lookAt(e){return Fh.lookAt(e),Fh.updateMatrix(),this.applyMatrix4(Fh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Bs).negate(),this.translate(Bs.x,Bs.y,Bs.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new lt(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Ye("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Kn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){qe("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];bn.setFromBufferAttribute(r),this.morphTargetsRelative?(Zt.addVectors(this.boundingBox.min,bn.min),this.boundingBox.expandByPoint(Zt),Zt.addVectors(this.boundingBox.max,bn.max),this.boundingBox.expandByPoint(Zt)):(this.boundingBox.expandByPoint(bn.min),this.boundingBox.expandByPoint(bn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&qe('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Qn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){qe("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){let n=this.boundingSphere.center;if(bn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];Ur.setFromBufferAttribute(o),this.morphTargetsRelative?(Zt.addVectors(bn.min,Ur.min),bn.expandByPoint(Zt),Zt.addVectors(bn.max,Ur.max),bn.expandByPoint(Zt)):(bn.expandByPoint(Ur.min),bn.expandByPoint(Ur.max))}bn.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)Zt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Zt));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Zt.fromBufferAttribute(o,c),l&&(Bs.fromBufferAttribute(e,c),Zt.add(Bs)),s=Math.max(s,n.distanceToSquared(Zt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&qe('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){qe("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new Pt(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let o=[],l=[];for(let y=0;y<n.count;y++)o[y]=new L,l[y]=new L;let c=new L,h=new L,u=new L,d=new se,f=new se,m=new se,x=new L,g=new L;function p(y,T,R){c.fromBufferAttribute(n,y),h.fromBufferAttribute(n,T),u.fromBufferAttribute(n,R),d.fromBufferAttribute(r,y),f.fromBufferAttribute(r,T),m.fromBufferAttribute(r,R),h.sub(c),u.sub(c),f.sub(d),m.sub(d);let I=1/(f.x*m.y-m.x*f.y);isFinite(I)&&(x.copy(h).multiplyScalar(m.y).addScaledVector(u,-f.y).multiplyScalar(I),g.copy(u).multiplyScalar(f.x).addScaledVector(h,-m.x).multiplyScalar(I),o[y].add(x),o[T].add(x),o[R].add(x),l[y].add(g),l[T].add(g),l[R].add(g))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let y=0,T=S.length;y<T;++y){let R=S[y],I=R.start,z=R.count;for(let B=I,D=I+z;B<D;B+=3)p(e.getX(B+0),e.getX(B+1),e.getX(B+2))}let A=new L,v=new L,w=new L,E=new L;function P(y){w.fromBufferAttribute(s,y),E.copy(w);let T=o[y];A.copy(T),A.sub(w.multiplyScalar(w.dot(T))).normalize(),v.crossVectors(E,T);let I=v.dot(l[y])<0?-1:1;a.setXYZW(y,A.x,A.y,A.z,I)}for(let y=0,T=S.length;y<T;++y){let R=S[y],I=R.start,z=R.count;for(let B=I,D=I+z;B<D;B+=3)P(e.getX(B+0)),P(e.getX(B+1)),P(e.getX(B+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Pt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let s=new L,r=new L,a=new L,o=new L,l=new L,c=new L,h=new L,u=new L;if(e)for(let d=0,f=e.count;d<f;d+=3){let m=e.getX(d+0),x=e.getX(d+1),g=e.getX(d+2);s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,x),a.fromBufferAttribute(t,g),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(n,m),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,g),o.add(h),l.add(h),c.add(h),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Zt.fromBufferAttribute(e,t),Zt.normalize(),e.setXYZ(t,Zt.x,Zt.y,Zt.z)}toNonIndexed(){function e(o,l){let c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h),f=0,m=0;for(let x=0,g=l.length;x<g;x++){o.isInterleavedBufferAttribute?f=l[x]*o.data.stride+o.offset:f=l[x]*h;for(let p=0;p<h;p++)d[m++]=c[f++]}return new Pt(d,h,u)}if(this.index===null)return Ye("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=e(l,n);t.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){let d=c[h],f=e(d,n);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,h=a.length;c<h;c++){let u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},rl=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Mu,this.updateRanges=[],this.version=0,this.uuid=ui()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ui()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ui()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},dn=new L,ta=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)dn.fromBufferAttribute(this,t),dn.applyMatrix4(e),this.setXYZ(t,dn.x,dn.y,dn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)dn.fromBufferAttribute(this,t),dn.applyNormalMatrix(e),this.setXYZ(t,dn.x,dn.y,dn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)dn.fromBufferAttribute(this,t),dn.transformDirection(e),this.setXYZ(t,dn.x,dn.y,dn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=qn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=bt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=bt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=bt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=bt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=bt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=qn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=qn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=qn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=qn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=bt(t,this.array),n=bt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=bt(t,this.array),n=bt(n,this.array),s=bt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=bt(t,this.array),n=bt(n,this.array),s=bt(s,this.array),r=bt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){jr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Pt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){jr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Bh=new L,$g=new L,Zg=new Ke,Fn=class{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=Bh.subVectors(n,t).cross($g.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let s=e.delta(Bh),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Zg.getNormalMatrix(e),s=this.coplanarPoint(Bh).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},jg=0,Rn=class extends Zn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:jg++}),this.uuid=ui(),this.name="",this.type="Material",this.blending=dr,this.side=Ni,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=fu,this.blendDst=pu,this.blendEquation=ds,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new we(0,0,0),this.blendAlpha=0,this.depthFunc=js,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=tm,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Wo,this.stencilZFail=Wo,this.stencilZPass=Wo,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Ye(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ye(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new we().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new Fn().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new se().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new se().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},fi=class extends Rn{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new we(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Hs,zr=new L,Vs=new L,Gs=new L,Ws=new se,Or=new se,fm=new mt,bo=new L,Fr=new L,Mo=new L,sp=new se,Hh=new se,rp=new se,Ai=class extends Ot{constructor(e=new fi){if(super(),this.isSprite=!0,this.type="Sprite",Hs===void 0){Hs=new Mt;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new rl(t,5);Hs.setIndex([0,1,2,0,2,3]),Hs.setAttribute("position",new ta(n,3,0,!1)),Hs.setAttribute("uv",new ta(n,2,3,!1))}this.geometry=Hs,this.material=e,this.center=new se(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&qe('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Vs.setFromMatrixScale(this.matrixWorld),fm.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Gs.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Vs.multiplyScalar(-Gs.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let a=this.center;So(bo.set(-.5,-.5,0),Gs,a,Vs,s,r),So(Fr.set(.5,-.5,0),Gs,a,Vs,s,r),So(Mo.set(.5,.5,0),Gs,a,Vs,s,r),sp.set(0,0),Hh.set(1,0),rp.set(1,1);let o=e.ray.intersectTriangle(bo,Fr,Mo,!1,zr);if(o===null&&(So(Fr.set(-.5,.5,0),Gs,a,Vs,s,r),Hh.set(0,1),o=e.ray.intersectTriangle(bo,Mo,Fr,!1,zr),o===null))return;let l=e.ray.origin.distanceTo(zr);l<e.near||l>e.far||t.push({distance:l,point:zr.clone(),uv:hi.getInterpolation(zr,bo,Fr,Mo,sp,Hh,rp,new se),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function So(i,e,t,n,s,r){Ws.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(Or.x=r*Ws.x-s*Ws.y,Or.y=s*Ws.x+r*Ws.y):Or.copy(Ws),i.copy(e),i.x+=Or.x,i.y+=Or.y,i.applyMatrix4(fm)}var ci=new L,Vh=new L,To=new L,Eo=new L,as=class{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ci)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=ci.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ci.copy(this.origin).addScaledVector(this.direction,t),ci.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Vh.copy(e).add(t).multiplyScalar(.5),To.copy(t).sub(e).normalize(),Eo.copy(this.origin).sub(Vh);let r=e.distanceTo(t)*.5,a=-this.direction.dot(To),o=Eo.dot(this.direction),l=-Eo.dot(To),c=Eo.lengthSq(),h=Math.abs(1-a*a),u,d,f,m;if(h>0)if(u=a*l-o,d=a*o-l,m=r*h,u>=0)if(d>=-m)if(d<=m){let x=1/h;u*=x,d*=x,f=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d<=-m?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=m?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Vh).addScaledVector(To,d),f}intersectSphere(e,t){if(e.radius<0)return null;ci.subVectors(e.center,this.origin);let n=ci.dot(this.direction),s=ci.dot(ci)-n*n,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,ci)!==null}intersectTriangle(e,t,n,s,r){let a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,m=t.x-a.x,x=t.y-a.y,g=t.z-a.z,p=n.x-a.x,S=n.y-a.y,A=n.z-a.z,v=Math.abs(l),w=Math.abs(c),E=Math.abs(h),P,y,T,R,I,z,B,D,H,X,F,J;if(v>=w&&v>=E?(T=l,z=u,H=m,J=p,l>=0?(P=c,y=h,R=d,I=f,B=x,D=g,X=S,F=A):(P=h,y=c,R=f,I=d,B=g,D=x,X=A,F=S)):w>=E?(T=c,z=d,H=x,J=S,c>=0?(P=h,y=l,R=f,I=u,B=g,D=m,X=A,F=p):(P=l,y=h,R=u,I=f,B=m,D=g,X=p,F=A)):(T=h,z=f,H=g,J=A,h>=0?(P=l,y=c,R=u,I=d,B=m,D=x,X=p,F=S):(P=c,y=l,R=d,I=u,B=x,D=m,X=S,F=p)),T===0)return null;let q=P/T,Q=y/T,ee=1/T,ze=R-q*z,Pe=I-Q*z,pt=B-q*H,rt=D-Q*H,ct=X-q*J,j=F-Q*J,ne=ct*rt-j*pt,ve=ze*j-Pe*ct,Ze=pt*Pe-rt*ze;if(s){if(ne<0||ve<0||Ze<0)return null}else if((ne<0||ve<0||Ze<0)&&(ne>0||ve>0||Ze>0))return null;let Ee=ne+ve+Ze;if(Ee===0)return null;let je=ee*(ne*z+ve*H+Ze*J);return(Ee>0?je<0:je>0)?null:this.at(je/Ee,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Tt=class extends Rn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new we(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Jn,this.combine=Pl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},ap=new mt,ts=new as,wo=new Qn,op=new L,Ao=new L,Co=new L,Ro=new L,Gh=new L,Po=new L,lp=new L,Io=new L,$e=class extends Ot{constructor(e=new Mt,t=new Tt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){Po.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=o[l],u=r[l];h!==0&&(Gh.fromBufferAttribute(u,e),a?Po.addScaledVector(Gh,h):Po.addScaledVector(Gh.sub(t),h))}t.add(Po)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),wo.copy(n.boundingSphere),wo.applyMatrix4(r),ts.copy(e.ray).recast(e.near),!(wo.containsPoint(ts.origin)===!1&&(ts.intersectSphere(wo,op)===null||ts.origin.distanceToSquared(op)>(e.far-e.near)**2))&&(ap.copy(r).invert(),ts.copy(e.ray).applyMatrix4(ap),!(n.boundingBox!==null&&ts.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,ts)))}_computeIntersections(e,t,n){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,x=d.length;m<x;m++){let g=d[m],p=a[g.materialIndex],S=Math.max(g.start,f.start),A=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let v=S,w=A;v<w;v+=3){let E=o.getX(v),P=o.getX(v+1),y=o.getX(v+2);s=Lo(this,p,e,n,c,h,u,E,P,y),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,f.start),x=Math.min(o.count,f.start+f.count);for(let g=m,p=x;g<p;g+=3){let S=o.getX(g),A=o.getX(g+1),v=o.getX(g+2);s=Lo(this,a,e,n,c,h,u,S,A,v),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let m=0,x=d.length;m<x;m++){let g=d[m],p=a[g.materialIndex],S=Math.max(g.start,f.start),A=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let v=S,w=A;v<w;v+=3){let E=v,P=v+1,y=v+2;s=Lo(this,p,e,n,c,h,u,E,P,y),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,f.start),x=Math.min(l.count,f.start+f.count);for(let g=m,p=x;g<p;g+=3){let S=g,A=g+1,v=g+2;s=Lo(this,a,e,n,c,h,u,S,A,v),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}};function Jg(i,e,t,n,s,r,a,o){let l;if(e.side===tn?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===Ni,o),l===null)return null;Io.copy(o),Io.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(Io);return c<t.near||c>t.far?null:{distance:c,point:Io.clone(),object:i}}function Lo(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,Ao),i.getVertexPosition(l,Co),i.getVertexPosition(c,Ro);let h=Jg(i,e,t,n,Ao,Co,Ro,lp);if(h){let u=new L;hi.getBarycoord(lp,Ao,Co,Ro,u),s&&(h.uv=hi.getInterpolatedAttribute(s,o,l,c,u,new se)),r&&(h.uv1=hi.getInterpolatedAttribute(r,o,l,c,u,new se)),a&&(h.normal=hi.getInterpolatedAttribute(a,o,l,c,u,new L),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a:o,b:l,c,normal:new L,materialIndex:0};hi.getNormal(Ao,Co,Ro,d.normal),h.face=d,h.barycoord=u}return h}var na=class extends fn{constructor(e=null,t=1,n=1,s,r,a,o,l,c=jt,h=jt,u,d){super(null,a,o,l,c,h,s,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ia=class extends Pt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Xs=new mt,cp=new mt,ko=[],hp=new Kn,Kg=new mt,Br=new $e,Hr=new Qn,sa=class extends $e{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new ia(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Kg)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Kn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Xs),hp.copy(e.boundingBox).applyMatrix4(Xs),this.boundingBox.union(hp)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Qn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Xs),Hr.copy(e.boundingSphere).applyMatrix4(Xs),this.boundingSphere.union(Hr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(Br.geometry=this.geometry,Br.material=this.material,Br.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Hr.copy(this.boundingSphere),Hr.applyMatrix4(n),e.ray.intersectsSphere(Hr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Xs),cp.multiplyMatrices(n,Xs),Br.matrixWorld=cp,Br.raycast(e,ko);for(let a=0,o=ko.length;a<o;a++){let l=ko[a];l.instanceId=r,l.object=this,t.push(l)}ko.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new ia(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new na(new Float32Array(s*this.count),s,this.count,zl,In));let r=this.morphTexture.source.data.data,a=0;for(let c=0;c<n.length;c++)a+=n[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=s*e;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},ns=new Qn,Qg=new se(.5,.5),Do=new L,nr=class{constructor(e=new Fn,t=new Fn,n=new Fn,s=new Fn,r=new Fn,a=new Fn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Bn,n=!1){let s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],f=r[7],m=r[8],x=r[9],g=r[10],p=r[11],S=r[12],A=r[13],v=r[14],w=r[15];if(s[0].setComponents(c-a,f-h,p-m,w-S).normalize(),s[1].setComponents(c+a,f+h,p+m,w+S).normalize(),s[2].setComponents(c+o,f+u,p+x,w+A).normalize(),s[3].setComponents(c-o,f-u,p-x,w-A).normalize(),n)s[4].setComponents(l,d,g,v).normalize(),s[5].setComponents(c-l,f-d,p-g,w-v).normalize();else if(s[4].setComponents(c-l,f-d,p-g,w-v).normalize(),t===Bn)s[5].setComponents(c+l,f+d,p+g,w+v).normalize();else if(t===Js)s[5].setComponents(l,d,g,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ns.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ns.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ns)}intersectsSprite(e){ns.center.set(0,0,0);let t=Qg.distanceTo(e.center);return ns.radius=.7071067811865476+t,ns.applyMatrix4(e.matrixWorld),this.intersectsSphere(ns)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(Do.x=s.normal.x>0?e.max.x:e.min.x,Do.y=s.normal.y>0?e.max.y:e.min.y,Do.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Do)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var ra=class extends Rn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new we(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},al=new L,ol=new L,up=new mt,Vr=new as,No=new Qn,Wh=new L,dp=new L,aa=class extends Ot{constructor(e=new Mt,t=new ra){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)al.fromBufferAttribute(t,s-1),ol.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=al.distanceTo(ol);e.setAttribute("lineDistance",new lt(n,1))}else Ye("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),No.copy(n.boundingSphere),No.applyMatrix4(s),No.radius+=r,e.ray.intersectsSphere(No)===!1)return;up.copy(s).invert(),Vr.copy(e.ray).applyMatrix4(up);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){let f=Math.max(0,a.start),m=Math.min(h.count,a.start+a.count);for(let x=f,g=m-1;x<g;x+=c){let p=h.getX(x),S=h.getX(x+1),A=Uo(this,e,Vr,l,p,S,x);A&&t.push(A)}if(this.isLineLoop){let x=h.getX(m-1),g=h.getX(f),p=Uo(this,e,Vr,l,x,g,m-1);p&&t.push(p)}}else{let f=Math.max(0,a.start),m=Math.min(d.count,a.start+a.count);for(let x=f,g=m-1;x<g;x+=c){let p=Uo(this,e,Vr,l,x,x+1,x);p&&t.push(p)}if(this.isLineLoop){let x=Uo(this,e,Vr,l,m-1,f,m-1);x&&t.push(x)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function Uo(i,e,t,n,s,r,a){let o=i.geometry.attributes.position;if(al.fromBufferAttribute(o,s),ol.fromBufferAttribute(o,r),t.distanceSqToSegment(al,ol,Wh,dp)>n)return;Wh.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(Wh);if(!(c<e.near||c>e.far))return{distance:c,point:dp.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}var ir=class extends Rn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new we(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},fp=new mt,eu=new as,zo=new Qn,Oo=new L,os=class extends Ot{constructor(e=new Mt,t=new ir){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),zo.copy(n.boundingSphere),zo.applyMatrix4(s),zo.radius+=r,e.ray.intersectsSphere(zo)===!1)return;fp.copy(s).invert(),eu.copy(e.ray).applyMatrix4(fp);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,u=n.attributes.position;if(c!==null){let d=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let m=d,x=f;m<x;m++){let g=c.getX(m);Oo.fromBufferAttribute(u,g),pp(Oo,g,l,s,e,t,this)}}else{let d=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let m=d,x=f;m<x;m++)Oo.fromBufferAttribute(u,m),pp(Oo,m,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function pp(i,e,t,n,s,r,a){let o=eu.distanceSqToPoint(i);if(o<t){let l=new L;eu.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}var oa=class extends fn{constructor(e=[],t=Ui,n,s,r,a,o,l,c,h){super(e,t,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},ei=class extends fn{constructor(e,t,n,s,r,a,o,l,c){super(e,t,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Ci=class extends fn{constructor(e,t,n=Vn,s,r,a,o=jt,l=jt,c,h=$n,u=1){if(h!==$n&&h!==Oi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:t,depth:u};super(d,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Qs(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},ll=class extends Ci{constructor(e,t=Vn,n=Ui,s,r,a=jt,o=jt,l,c=$n){let h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,n,s,r,a,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},la=class extends fn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Mn=class i extends Mt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],h=[],u=[],d=0,f=0;m("z","y","x",-1,-1,n,t,e,a,r,0),m("z","y","x",1,-1,n,t,-e,a,r,1),m("x","z","y",1,1,e,n,t,s,a,2),m("x","z","y",1,-1,e,n,-t,s,a,3),m("x","y","z",1,-1,e,t,n,s,r,4),m("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new lt(c,3)),this.setAttribute("normal",new lt(h,3)),this.setAttribute("uv",new lt(u,2));function m(x,g,p,S,A,v,w,E,P,y,T){let R=v/P,I=w/y,z=v/2,B=w/2,D=E/2,H=P+1,X=y+1,F=0,J=0,q=new L;for(let Q=0;Q<X;Q++){let ee=Q*I-B;for(let ze=0;ze<H;ze++){let Pe=ze*R-z;q[x]=Pe*S,q[g]=ee*A,q[p]=D,c.push(q.x,q.y,q.z),q[x]=0,q[g]=0,q[p]=E>0?1:-1,h.push(q.x,q.y,q.z),u.push(ze/P),u.push(1-Q/y),F+=1}}for(let Q=0;Q<y;Q++)for(let ee=0;ee<P;ee++){let ze=d+ee+H*Q,Pe=d+ee+H*(Q+1),pt=d+(ee+1)+H*(Q+1),rt=d+(ee+1)+H*Q;l.push(ze,Pe,rt),l.push(Pe,pt,rt),J+=6}o.addGroup(f,J,T),f+=J,d+=F}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var ca=class i extends Mt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);let r=[],a=[],o=[],l=[],c=new L,h=new se;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){let f=n+u/t*s;c.x=e*Math.cos(f),c.y=e*Math.sin(f),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[d]/e+1)/2,h.y=(a[d+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new lt(a,3)),this.setAttribute("normal",new lt(o,3)),this.setAttribute("uv",new lt(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.segments,e.thetaStart,e.thetaLength)}},Jt=class i extends Mt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],f=[],m=0,x=[],g=n/2,p=0;S(),a===!1&&(e>0&&A(!0),t>0&&A(!1)),this.setIndex(h),this.setAttribute("position",new lt(u,3)),this.setAttribute("normal",new lt(d,3)),this.setAttribute("uv",new lt(f,2));function S(){let v=new L,w=new L,E=0,P=(t-e)/n;for(let y=0;y<=r;y++){let T=[],R=y/r,I=R*(t-e)+e;for(let z=0;z<=s;z++){let B=z/s,D=B*l+o,H=Math.sin(D),X=Math.cos(D);w.x=I*H,w.y=-R*n+g,w.z=I*X,u.push(w.x,w.y,w.z),v.set(H,P,X).normalize(),d.push(v.x,v.y,v.z),f.push(B,1-R),T.push(m++)}x.push(T)}for(let y=0;y<s;y++)for(let T=0;T<r;T++){let R=x[T][y],I=x[T+1][y],z=x[T+1][y+1],B=x[T][y+1];(e>0||T!==0)&&(h.push(R,I,B),E+=3),(t>0||T!==r-1)&&(h.push(I,z,B),E+=3)}c.addGroup(p,E,0),p+=E}function A(v){let w=m,E=new se,P=new L,y=0,T=v===!0?e:t,R=v===!0?1:-1;for(let z=1;z<=s;z++)u.push(0,g*R,0),d.push(0,R,0),f.push(.5,.5),m++;let I=m;for(let z=0;z<=s;z++){let D=z/s*l+o,H=Math.cos(D),X=Math.sin(D);P.x=T*X,P.y=g*R,P.z=T*H,u.push(P.x,P.y,P.z),d.push(0,R,0),E.x=H*.5+.5,E.y=X*.5*R+.5,f.push(E.x,E.y),m++}for(let z=0;z<s;z++){let B=w+z,D=I+z;v===!0?h.push(D,D+1,B):h.push(D+1,D,B),y+=3}c.addGroup(p,y,v===!0?1:2),p+=y}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},ha=class i extends Jt{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}};var Sn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Ye("Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);let h=n[s],d=n[s+1]-h,f=(a-h)/d;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new se:new L);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new L,s=[],r=[],a=[],o=new L,l=new mt;for(let f=0;f<=e;f++){let m=f/e;s[f]=this.getTangentAt(m,new L)}r[0]=new L,a[0]=new L;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();let m=Math.acos(it(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,m))}a[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(it(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let m=1;m<=e;m++)r[m].applyMatrix4(l.makeRotationAxis(s[m],f*m)),a[m].crossVectors(s[m],r[m])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},sr=class extends Sn{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new se){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},cl=class extends sr{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function Tu(){let i=0,e=0,t=0,n=0;function s(r,a,o,l){i=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,u){let d=(a-r)/c-(o-r)/(c+h)+(o-a)/h,f=(o-a)/h-(l-a)/(h+u)+(l-o)/u;d*=h,f*=h,s(a,o,d,f)},calc:function(r){let a=r*r,o=a*r;return i+e*r+t*a+n*o}}}var mp=new L,gp=new L,Xh=new Tu,qh=new Tu,Yh=new Tu,hl=class extends Sn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new L){let n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(gp.subVectors(s[0],s[1]).add(s[0]),c=gp);let u=s[o%r],d=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(mp.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=mp),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,m=Math.pow(c.distanceToSquared(u),f),x=Math.pow(u.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(h),f);x<1e-4&&(x=1),m<1e-4&&(m=x),g<1e-4&&(g=x),Xh.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,m,x,g),qh.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,m,x,g),Yh.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,m,x,g)}else this.curveType==="catmullrom"&&(Xh.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),qh.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),Yh.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(Xh.calc(l),qh.calc(l),Yh.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new L().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function xp(i,e,t,n,s){let r=(n-e)*.5,a=(s-t)*.5,o=i*i,l=i*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*i+t}function ex(i,e){let t=1-i;return t*t*e}function tx(i,e){return 2*(1-i)*i*e}function nx(i,e){return i*i*e}function Wr(i,e,t,n){return ex(i,e)+tx(i,t)+nx(i,n)}function ix(i,e){let t=1-i;return t*t*t*e}function sx(i,e){let t=1-i;return 3*t*t*i*e}function rx(i,e){return 3*(1-i)*i*i*e}function ax(i,e){return i*i*i*e}function Xr(i,e,t,n,s){return ix(i,e)+sx(i,t)+rx(i,n)+ax(i,s)}var ua=class extends Sn{constructor(e=new se,t=new se,n=new se,s=new se){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new se){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Xr(e,s.x,r.x,a.x,o.x),Xr(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},ul=class extends Sn{constructor(e=new L,t=new L,n=new L,s=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new L){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Xr(e,s.x,r.x,a.x,o.x),Xr(e,s.y,r.y,a.y,o.y),Xr(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},da=class extends Sn{constructor(e=new se,t=new se){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new se){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new se){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},dl=class extends Sn{constructor(e=new L,t=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new L){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new L){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},fa=class extends Sn{constructor(e=new se,t=new se,n=new se){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new se){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(Wr(e,s.x,r.x,a.x),Wr(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},fl=class extends Sn{constructor(e=new L,t=new L,n=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new L){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(Wr(e,s.x,r.x,a.x),Wr(e,s.y,r.y,a.y),Wr(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},pa=class extends Sn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new se){let n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(xp(o,l.x,c.x,h.x,u.x),xp(o,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new se().fromArray(s))}return this}},tu=Object.freeze({__proto__:null,ArcCurve:cl,CatmullRomCurve3:hl,CubicBezierCurve:ua,CubicBezierCurve3:ul,EllipseCurve:sr,LineCurve:da,LineCurve3:dl,QuadraticBezierCurve:fa,QuadraticBezierCurve3:fl,SplineCurve:pa}),pl=class extends Sn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new tu[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new tu[s.type]().fromJSON(s))}return this}},ls=class extends pl{constructor(e){super(),this.type="Path",this.currentPoint=new se,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new da(this.currentPoint.clone(),new se(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new fa(this.currentPoint.clone(),new se(e,t),new se(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){let o=new ua(this.currentPoint.clone(),new se(e,t),new se(n,s),new se(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new pa(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,s,r,a,o,l),this}absellipse(e,t,n,s,r,a,o,l){let c=new sr(e,t,n,s,r,a,o,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},rr=class extends ls{constructor(e){super(e),this.uuid=ui(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new ls().fromJSON(s))}return this}};function ox(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=pm(i,0,s,t,!0),a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=dx(i,e,r,t)),i.length>80*t){o=i[0],l=i[1];let h=o,u=l;for(let d=t;d<s;d+=t){let f=i[d],m=i[d+1];f<o&&(o=f),m<l&&(l=m),f>h&&(h=f),m>u&&(u=m)}c=Math.max(h-o,u-l),c=c!==0?32767/c:0}return ma(r,a,t,o,l,c,0),a}function pm(i,e,t,n,s){let r;if(s===Sx(i,e,t,n)>0)for(let a=e;a<t;a+=n)r=_p(a/n|0,i[a],i[a+1],r);else for(let a=t-n;a>=e;a-=n)r=_p(a/n|0,i[a],i[a+1],r);return r&&ar(r,r.next)&&(xa(r),r=r.next),r}function cs(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(ar(t,t.next)||Ut(t.prev,t,t.next)===0)){if(xa(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function ma(i,e,t,n,s,r,a){if(!i)return;!a&&r&&xx(i,n,s,r);let o=i;for(;i.prev!==i.next;){let l=i.prev,c=i.next;if(r?cx(i,n,s,r):lx(i)){e.push(l.i,i.i,c.i),xa(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=hx(cs(i),e),ma(i,e,t,n,s,r,2)):a===2&&ux(i,e,t,n,s,r):ma(cs(i),e,t,n,s,r,1);break}}}function lx(i){let e=i.prev,t=i,n=i.next;if(Ut(e,t,n)>=0)return!1;let s=e.x,r=t.x,a=n.x,o=e.y,l=t.y,c=n.y,h=Math.min(s,r,a),u=Math.min(o,l,c),d=Math.max(s,r,a),f=Math.max(o,l,c),m=n.next;for(;m!==e;){if(m.x>=h&&m.x<=d&&m.y>=u&&m.y<=f&&Gr(s,o,r,l,a,c,m.x,m.y)&&Ut(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function cx(i,e,t,n){let s=i.prev,r=i,a=i.next;if(Ut(s,r,a)>=0)return!1;let o=s.x,l=r.x,c=a.x,h=s.y,u=r.y,d=a.y,f=Math.min(o,l,c),m=Math.min(h,u,d),x=Math.max(o,l,c),g=Math.max(h,u,d),p=nu(f,m,e,t,n),S=nu(x,g,e,t,n),A=i.prevZ,v=i.nextZ;for(;A&&A.z>=p&&v&&v.z<=S;){if(A.x>=f&&A.x<=x&&A.y>=m&&A.y<=g&&A!==s&&A!==a&&Gr(o,h,l,u,c,d,A.x,A.y)&&Ut(A.prev,A,A.next)>=0||(A=A.prevZ,v.x>=f&&v.x<=x&&v.y>=m&&v.y<=g&&v!==s&&v!==a&&Gr(o,h,l,u,c,d,v.x,v.y)&&Ut(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;A&&A.z>=p;){if(A.x>=f&&A.x<=x&&A.y>=m&&A.y<=g&&A!==s&&A!==a&&Gr(o,h,l,u,c,d,A.x,A.y)&&Ut(A.prev,A,A.next)>=0)return!1;A=A.prevZ}for(;v&&v.z<=S;){if(v.x>=f&&v.x<=x&&v.y>=m&&v.y<=g&&v!==s&&v!==a&&Gr(o,h,l,u,c,d,v.x,v.y)&&Ut(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function hx(i,e){let t=i;do{let n=t.prev,s=t.next.next;!ar(n,s)&&gm(n,t,t.next,s)&&ga(n,s)&&ga(s,n)&&(e.push(n.i,t.i,s.i),xa(t),xa(t.next),t=i=s),t=t.next}while(t!==i);return cs(t)}function ux(i,e,t,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&vx(a,o)){let l=xm(a,o);a=cs(a,a.next),l=cs(l,l.next),ma(a,e,t,n,s,r,0),ma(l,e,t,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function dx(i,e,t,n){let s=[];for(let r=0,a=e.length;r<a;r++){let o=e[r]*n,l=r<a-1?e[r+1]*n:i.length,c=pm(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(yx(c))}s.sort(fx);for(let r=0;r<s.length;r++)t=px(s[r],t);return t}function fx(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function px(i,e){let t=mx(i,e);if(!t)return e;let n=xm(t,i);return cs(n,n.next),cs(t,t.next)}function mx(i,e){let t=e,n=i.x,s=i.y,r=-1/0,a;if(ar(i,t))return t;do{if(ar(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,a=t.x<t.next.x?t:t.next,u===n))return a}t=t.next}while(t!==e);if(!a)return null;let o=a,l=a.x,c=a.y,h=1/0;t=a;do{if(n>=t.x&&t.x>=l&&n!==t.x&&mm(s<c?n:r,s,l,c,s<c?r:n,s,t.x,t.y)){let u=Math.abs(s-t.y)/(n-t.x);ga(t,i)&&(u<h||u===h&&(t.x>a.x||t.x===a.x&&gx(a,t)))&&(a=t,h=u)}t=t.next}while(t!==o);return a}function gx(i,e){return Ut(i.prev,i,e.prev)<0&&Ut(e.next,i,i.next)<0}function xx(i,e,t,n){let s=i;do s.z===0&&(s.z=nu(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,_x(s)}function _x(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,t*=2}while(e>1);return i}function nu(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function yx(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function mm(i,e,t,n,s,r,a,o){return(s-a)*(e-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(n-o)}function Gr(i,e,t,n,s,r,a,o){return!(i===a&&e===o)&&mm(i,e,t,n,s,r,a,o)}function vx(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!bx(i,e)&&(ga(i,e)&&ga(e,i)&&Mx(i,e)&&(Ut(i.prev,i,e.prev)||Ut(i,e.prev,e))||ar(i,e)&&Ut(i.prev,i,i.next)>0&&Ut(e.prev,e,e.next)>0)}function Ut(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function ar(i,e){return i.x===e.x&&i.y===e.y}function gm(i,e,t,n){let s=Bo(Ut(i,e,t)),r=Bo(Ut(i,e,n)),a=Bo(Ut(t,n,i)),o=Bo(Ut(t,n,e));return!!(s!==r&&a!==o||s===0&&Fo(i,t,e)||r===0&&Fo(i,n,e)||a===0&&Fo(t,i,n)||o===0&&Fo(t,e,n))}function Fo(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function Bo(i){return i>0?1:i<0?-1:0}function bx(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&gm(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function ga(i,e){return Ut(i.prev,i,i.next)<0?Ut(i,e,i.next)>=0&&Ut(i,i.prev,e)>=0:Ut(i,e,i.prev)<0||Ut(i,i.next,e)<0}function Mx(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function xm(i,e){let t=iu(i.i,i.x,i.y),n=iu(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function _p(i,e,t,n){let s=iu(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function xa(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function iu(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Sx(i,e,t,n){let s=0;for(let r=e,a=t-n;r<t;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}var su=class{static triangulate(e,t,n=2){return ox(e,t,n)}},is=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];yp(e),vp(n,e);let a=e.length;t.forEach(yp);for(let l=0;l<t.length;l++)s.push(a),a+=t[l].length,vp(n,t[l]);let o=su.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}};function yp(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function vp(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var _a=class i extends Mt{constructor(e=new rr([new se(.5,.5),new se(-.5,.5),new se(-.5,-.5),new se(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,s=[],r=[];for(let o=0,l=e.length;o<l;o++){let c=e[o];a(c)}this.setAttribute("position",new lt(s,3)),this.setAttribute("uv",new lt(r,2)),this.computeVertexNormals();function a(o){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,m=t.bevelSize!==void 0?t.bevelSize:f-.1,x=t.bevelOffset!==void 0?t.bevelOffset:0,g=t.bevelSegments!==void 0?t.bevelSegments:3,p=t.extrudePath,S=t.UVGenerator!==void 0?t.UVGenerator:Tx,A,v=!1,w,E,P,y;if(p){A=p.getSpacedPoints(h),v=!0,d=!1;let ie=p.isCatmullRomCurve3?p.closed:!1;w=p.computeFrenetFrames(h,ie),E=new L,P=new L,y=new L}d||(g=0,f=0,m=0,x=0);let T=o.extractPoints(c),R=T.shape,I=T.holes;if(!is.isClockWise(R)){R=R.reverse();for(let ie=0,ae=I.length;ie<ae;ie++){let le=I[ie];is.isClockWise(le)&&(I[ie]=le.reverse())}}function B(ie){let le=10000000000000001e-36,ce=ie[0];for(let fe=1;fe<=ie.length;fe++){let We=fe%ie.length,He=ie[We],Je=He.x-ce.x,Qe=He.y-ce.y,k=Je*Je+Qe*Qe,gt=Math.max(Math.abs(He.x),Math.abs(He.y),Math.abs(ce.x),Math.abs(ce.y)),at=le*gt*gt;if(k<=at){ie.splice(We,1),fe--;continue}ce=He}}B(R),I.forEach(B);let D=I.length,H=R;for(let ie=0;ie<D;ie++){let ae=I[ie];R=R.concat(ae)}function X(ie,ae,le){return ae||qe("ExtrudeGeometry: vec does not exist"),ie.clone().addScaledVector(ae,le)}let F=R.length;function J(ie,ae,le){let ce,fe,We,He=ie.x-ae.x,Je=ie.y-ae.y,Qe=le.x-ie.x,k=le.y-ie.y,gt=He*He+Je*Je,at=He*k-Je*Qe;if(Math.abs(at)>Number.EPSILON){let C=Math.sqrt(gt),_=Math.sqrt(Qe*Qe+k*k),O=ae.x-Je/C,W=ae.y+He/C,$=le.x-k/_,he=le.y+Qe/_,de=(($-O)*k-(he-W)*Qe)/(He*k-Je*Qe);ce=O+He*de-ie.x,fe=W+Je*de-ie.y;let Z=ce*ce+fe*fe;if(Z<=2)return new se(ce,fe);We=Math.sqrt(Z/2)}else{let C=!1;He>Number.EPSILON?Qe>Number.EPSILON&&(C=!0):He<-Number.EPSILON?Qe<-Number.EPSILON&&(C=!0):Math.sign(Je)===Math.sign(k)&&(C=!0),C?(ce=-Je,fe=He,We=Math.sqrt(gt)):(ce=He,fe=Je,We=Math.sqrt(gt/2))}return new se(ce/We,fe/We)}let q=[];for(let ie=0,ae=H.length,le=ae-1,ce=ie+1;ie<ae;ie++,le++,ce++)le===ae&&(le=0),ce===ae&&(ce=0),q[ie]=J(H[ie],H[le],H[ce]);let Q=[],ee,ze=q.concat();for(let ie=0,ae=D;ie<ae;ie++){let le=I[ie];ee=[];for(let ce=0,fe=le.length,We=fe-1,He=ce+1;ce<fe;ce++,We++,He++)We===fe&&(We=0),He===fe&&(He=0),ee[ce]=J(le[ce],le[We],le[He]);Q.push(ee),ze=ze.concat(ee)}let Pe;if(g===0)Pe=is.triangulateShape(H,I);else{let ie=[],ae=[];for(let le=0;le<g;le++){let ce=le/g,fe=f*Math.cos(ce*Math.PI/2),We=m*Math.sin(ce*Math.PI/2)+x;for(let He=0,Je=H.length;He<Je;He++){let Qe=X(H[He],q[He],We);ve(Qe.x,Qe.y,-fe),ce===0&&ie.push(Qe)}for(let He=0,Je=D;He<Je;He++){let Qe=I[He];ee=Q[He];let k=[];for(let gt=0,at=Qe.length;gt<at;gt++){let C=X(Qe[gt],ee[gt],We);ve(C.x,C.y,-fe),ce===0&&k.push(C)}ce===0&&ae.push(k)}}Pe=is.triangulateShape(ie,ae)}let pt=Pe.length,rt=m+x;for(let ie=0;ie<F;ie++){let ae=d?X(R[ie],ze[ie],rt):R[ie];v?(P.copy(w.normals[0]).multiplyScalar(ae.x),E.copy(w.binormals[0]).multiplyScalar(ae.y),y.copy(A[0]).add(P).add(E),ve(y.x,y.y,y.z)):ve(ae.x,ae.y,0)}for(let ie=1;ie<=h;ie++)for(let ae=0;ae<F;ae++){let le=d?X(R[ae],ze[ae],rt):R[ae];v?(P.copy(w.normals[ie]).multiplyScalar(le.x),E.copy(w.binormals[ie]).multiplyScalar(le.y),y.copy(A[ie]).add(P).add(E),ve(y.x,y.y,y.z)):ve(le.x,le.y,u/h*ie)}for(let ie=g-1;ie>=0;ie--){let ae=ie/g,le=f*Math.cos(ae*Math.PI/2),ce=m*Math.sin(ae*Math.PI/2)+x;for(let fe=0,We=H.length;fe<We;fe++){let He=X(H[fe],q[fe],ce);ve(He.x,He.y,u+le)}for(let fe=0,We=I.length;fe<We;fe++){let He=I[fe];ee=Q[fe];for(let Je=0,Qe=He.length;Je<Qe;Je++){let k=X(He[Je],ee[Je],ce);v?ve(k.x,k.y+A[h-1].y,A[h-1].x+le):ve(k.x,k.y,u+le)}}}ct(),j();function ct(){let ie=s.length/3;if(d){let ae=0,le=F*ae;for(let ce=0;ce<pt;ce++){let fe=Pe[ce];Ze(fe[2]+le,fe[1]+le,fe[0]+le)}ae=h+g*2,le=F*ae;for(let ce=0;ce<pt;ce++){let fe=Pe[ce];Ze(fe[0]+le,fe[1]+le,fe[2]+le)}}else{for(let ae=0;ae<pt;ae++){let le=Pe[ae];Ze(le[2],le[1],le[0])}for(let ae=0;ae<pt;ae++){let le=Pe[ae];Ze(le[0]+F*h,le[1]+F*h,le[2]+F*h)}}n.addGroup(ie,s.length/3-ie,0)}function j(){let ie=s.length/3,ae=0;ne(H,ae),ae+=H.length;for(let le=0,ce=I.length;le<ce;le++){let fe=I[le];ne(fe,ae),ae+=fe.length}n.addGroup(ie,s.length/3-ie,1)}function ne(ie,ae){let le=ie.length;for(;--le>=0;){let ce=le,fe=le-1;fe<0&&(fe=ie.length-1);for(let We=0,He=h+g*2;We<He;We++){let Je=F*We,Qe=F*(We+1),k=ae+ce+Je,gt=ae+fe+Je,at=ae+fe+Qe,C=ae+ce+Qe;Ee(k,gt,at,C)}}}function ve(ie,ae,le){l.push(ie),l.push(ae),l.push(le)}function Ze(ie,ae,le){je(ie),je(ae),je(le);let ce=s.length/3,fe=S.generateTopUV(n,s,ce-3,ce-2,ce-1);yt(fe[0]),yt(fe[1]),yt(fe[2])}function Ee(ie,ae,le,ce){je(ie),je(ae),je(ce),je(ae),je(le),je(ce);let fe=s.length/3,We=S.generateSideWallUV(n,s,fe-6,fe-3,fe-2,fe-1);yt(We[0]),yt(We[1]),yt(We[3]),yt(We[1]),yt(We[2]),yt(We[3])}function je(ie){s.push(l[ie*3+0]),s.push(l[ie*3+1]),s.push(l[ie*3+2])}function yt(ie){r.push(ie.x),r.push(ie.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return Ex(t,n,e)}static fromJSON(e,t){let n=[];for(let r=0,a=e.shapes.length;r<a;r++){let o=t[e.shapes[r]];n.push(o)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new tu[s.type]().fromJSON(s)),new i(n,e.options)}},Tx={generateTopUV:function(i,e,t,n,s){let r=e[t*3],a=e[t*3+1],o=e[n*3],l=e[n*3+1],c=e[s*3],h=e[s*3+1];return[new se(r,a),new se(o,l),new se(c,h)]},generateSideWallUV:function(i,e,t,n,s,r){let a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[n*3],h=e[n*3+1],u=e[n*3+2],d=e[s*3],f=e[s*3+1],m=e[s*3+2],x=e[r*3],g=e[r*3+1],p=e[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new se(a,1-l),new se(c,1-u),new se(d,1-m),new se(x,1-p)]:[new se(o,1-l),new se(h,1-u),new se(f,1-m),new se(g,1-p)]}};function Ex(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var ya=class i extends Mt{constructor(e=[new se(0,-.5),new se(.5,0),new se(0,.5)],t=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:s},t=Math.floor(t),s=it(s,0,Math.PI*2);let r=[],a=[],o=[],l=[],c=[],h=1/t,u=new L,d=new se,f=new L,m=new L,x=new L,g=0,p=0;for(let S=0;S<=e.length-1;S++)switch(S){case 0:g=e[S+1].x-e[S].x,p=e[S+1].y-e[S].y,f.x=p*1,f.y=-g,f.z=p*0,x.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case e.length-1:l.push(x.x,x.y,x.z);break;default:g=e[S+1].x-e[S].x,p=e[S+1].y-e[S].y,f.x=p*1,f.y=-g,f.z=p*0,m.copy(f),f.x+=x.x,f.y+=x.y,f.z+=x.z,f.normalize(),l.push(f.x,f.y,f.z),x.copy(m)}for(let S=0;S<=t;S++){let A=n+S*h*s,v=Math.sin(A),w=Math.cos(A);for(let E=0;E<=e.length-1;E++){u.x=e[E].x*v,u.y=e[E].y,u.z=e[E].x*w,a.push(u.x,u.y,u.z),d.x=S/t,d.y=E/(e.length-1),o.push(d.x,d.y);let P=l[3*E+0]*v,y=l[3*E+1],T=l[3*E+0]*w;c.push(P,y,T)}}for(let S=0;S<t;S++)for(let A=0;A<e.length-1;A++){let v=A+S*e.length,w=v,E=v+e.length,P=v+e.length+1,y=v+1;r.push(w,E,y),r.push(P,y,E)}this.setIndex(r),this.setAttribute("position",new lt(a,3)),this.setAttribute("uv",new lt(o,2)),this.setAttribute("normal",new lt(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.points,e.segments,e.phiStart,e.phiLength)}};var pi=class i extends Mt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,u=e/o,d=t/l,f=[],m=[],x=[],g=[];for(let p=0;p<h;p++){let S=p*d-a;for(let A=0;A<c;A++){let v=A*u-r;m.push(v,-S,0),x.push(0,0,1),g.push(A/o),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let S=0;S<o;S++){let A=S+c*p,v=S+c*(p+1),w=S+1+c*(p+1),E=S+1+c*p;f.push(A,v,E),f.push(v,w,E)}this.setIndex(f),this.setAttribute("position",new lt(m,3)),this.setAttribute("normal",new lt(x,3)),this.setAttribute("uv",new lt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},Ri=class i extends Mt{constructor(e=.5,t=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);let o=[],l=[],c=[],h=[],u=e,d=(t-e)/s,f=new L,m=new se;for(let x=0;x<=s;x++){for(let g=0;g<=n;g++){let p=r+g/n*a;f.x=u*Math.cos(p),f.y=u*Math.sin(p),l.push(f.x,f.y,f.z),c.push(0,0,1),m.x=(f.x/t+1)/2,m.y=(f.y/t+1)/2,h.push(m.x,m.y)}u+=d}for(let x=0;x<s;x++){let g=x*(n+1);for(let p=0;p<n;p++){let S=p+g,A=S,v=S+n+1,w=S+n+2,E=S+1;o.push(A,v,E),o.push(v,w,E)}}this.setIndex(o),this.setAttribute("position",new lt(l,3)),this.setAttribute("normal",new lt(c,3)),this.setAttribute("uv",new lt(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}};var Pi=class i extends Mt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),c=0,h=[],u=new L,d=new L,f=[],m=[],x=[],g=[];for(let p=0;p<=n;p++){let S=[],A=p/n,v=a+A*o,w=e*Math.cos(v),E=Math.sqrt(e*e-w*w),P=0;p===0&&a===0?P=.5/t:p===n&&l===Math.PI&&(P=-.5/t);for(let y=0;y<=t;y++){let T=y/t,R=s+T*r;u.x=-E*Math.cos(R),u.y=w,u.z=E*Math.sin(R),m.push(u.x,u.y,u.z),d.copy(u).normalize(),x.push(d.x,d.y,d.z),g.push(T+P,1-A),S.push(c++)}h.push(S)}for(let p=0;p<n;p++)for(let S=0;S<t;S++){let A=h[p][S+1],v=h[p][S],w=h[p+1][S],E=h[p+1][S+1];(p!==0||a>0)&&f.push(A,v,E),(p!==n-1||l<Math.PI)&&f.push(v,w,E)}this.setIndex(f),this.setAttribute("position",new lt(m,3)),this.setAttribute("normal",new lt(x,3)),this.setAttribute("uv",new lt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var hs=class i extends Mt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),s=Math.floor(s);let l=[],c=[],h=[],u=[],d=new L,f=new L,m=new L;for(let x=0;x<=n;x++){let g=a+x/n*o;for(let p=0;p<=s;p++){let S=p/s*r;f.x=(e+t*Math.cos(g))*Math.cos(S),f.y=(e+t*Math.cos(g))*Math.sin(S),f.z=t*Math.sin(g),c.push(f.x,f.y,f.z),d.x=e*Math.cos(S),d.y=e*Math.sin(S),m.subVectors(f,d).normalize(),h.push(m.x,m.y,m.z),u.push(p/s),u.push(x/n)}}for(let x=1;x<=n;x++)for(let g=1;g<=s;g++){let p=(s+1)*x+g-1,S=(s+1)*(x-1)+g-1,A=(s+1)*(x-1)+g,v=(s+1)*x+g;l.push(p,S,v),l.push(S,A,v)}this.setIndex(l),this.setAttribute("position",new lt(c,3)),this.setAttribute("normal",new lt(h,3)),this.setAttribute("uv",new lt(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}};function gs(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];if(bp(s))s.isRenderTargetTexture?(Ye("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(bp(s[0])){let r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function on(i){let e={};for(let t=0;t<i.length;t++){let n=gs(i[t]);for(let s in n)e[s]=n[s]}return e}function bp(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function wx(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Eu(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:st.workingColorSpace}var xi={clone:gs,merge:on},Ax=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Cx=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,It=class extends Rn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ax,this.fragmentShader=Cx,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=gs(e.uniforms),this.uniformsGroups=wx(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new we().setHex(s.value);break;case"v2":this.uniforms[n].value=new se().fromArray(s.value);break;case"v3":this.uniforms[n].value=new L().fromArray(s.value);break;case"v4":this.uniforms[n].value=new Dt().fromArray(s.value);break;case"m3":this.uniforms[n].value=new Ke().fromArray(s.value);break;case"m4":this.uniforms[n].value=new mt().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},or=class extends It{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},pn=class extends Rn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new we(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new we(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Va,this.normalScale=new se(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Jn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},lr=class extends pn{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new se(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return it(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new we(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new we(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new we(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var va=class extends Rn{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new we(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new we(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Va,this.normalScale=new se(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Jn,this.combine=Pl,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},ml=class extends Rn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Qp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},gl=class extends Rn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};var ba=class extends ra{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}};function qs(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function $h(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}var Ii=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},xl=class extends Ii{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Jh,endingEnd:Jh}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Kh:r=e,o=2*t-n;break;case Qh:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Kh:a=e,l=2*n-t;break;case Qh:a=1,l=n+s[1]-s[0];break;default:a=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,m=(n-t)/(s-t),x=m*m,g=x*m,p=-d*g+2*d*x-d*m,S=(1+d)*g+(-1.5-2*d)*x+(-.5+d)*m+1,A=(-1-f)*g+(1.5+f)*x+.5*m,v=f*g-f*x;for(let w=0;w!==o;++w)r[w]=p*a[h+w]+S*a[c+w]+A*a[l+w]+v*a[u+w];return r}},_l=class extends Ii{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(n-t)/(s-t),u=1-h;for(let d=0;d!==o;++d)r[d]=a[c+d]*u+a[l+d]*h;return r}},yl=class extends Ii{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},vl=class extends Ii{interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this.inTangents,u=this.outTangents;if(!h||!u){let m=(n-t)/(s-t),x=1-m;for(let g=0;g!==o;++g)r[g]=a[c+g]*x+a[l+g]*m;return r}let d=o*2,f=e-1;for(let m=0;m!==o;++m){let x=a[c+m],g=a[l+m],p=f*d+m*2,S=u[p],A=u[p+1],v=e*d+m*2,w=h[v],E=h[v+1],P=Px(n,t,S,w,s);r[m]=_m(P,x,A,E,g)}return r}};function _m(i,e,t,n,s){let r=1-i;return r*r*r*e+3*r*r*i*t+3*r*i*i*n+i*i*i*s}function Rx(i,e,t,n,s){let r=1-i;return 3*r*r*(t-e)+6*r*i*(n-t)+3*i*i*(s-n)}function Px(i,e,t,n,s){let r=(i-e)/(s-e);for(let a=0;a<8;a++){let o=_m(r,e,t,n,s)-i;if(Math.abs(o)<1e-10)break;let l=Rx(r,e,t,n,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-o/l))}return r}var Tn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=qs(t,this.TimeBufferType),this.values=qs(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:qs(e.times,Array),values:qs(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s),$h(e.settings)&&(n.settings={inTangents:qs(e.settings.inTangents,Array),outTangents:qs(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new yl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new _l(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new xl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new vl(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case qr:t=this.InterpolantFactoryMethodDiscrete;break;case el:t=this.InterpolantFactoryMethodLinear;break;case Go:t=this.InterpolantFactoryMethodSmooth;break;case jh:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Ye("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return qr;case this.InterpolantFactoryMethodLinear:return el;case this.InterpolantFactoryMethodSmooth:return Go;case this.InterpolantFactoryMethodBezier:return jh}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e;$h(this.settings)&&(Mp(this.settings.inTangents,e),Mp(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(qe("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(qe("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){qe("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){qe("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&kg(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){qe("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Go,r=e.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(s)l=!0;else{let u=o*n,d=u-n,f=u+n;for(let m=0;m!==n;++m){let x=t[u+m];if(x!==t[d+m]||x!==t[f+m]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let u=o*n,d=a*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,$h(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function Mp(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]*=e}Tn.prototype.ValueTypeName="";Tn.prototype.TimeBufferType=Float32Array;Tn.prototype.ValueBufferType=Float32Array;Tn.prototype.DefaultInterpolation=el;var Li=class extends Tn{constructor(e,t,n){super(e,t,n)}};Li.prototype.ValueTypeName="bool";Li.prototype.ValueBufferType=Array;Li.prototype.DefaultInterpolation=qr;Li.prototype.InterpolantFactoryMethodLinear=void 0;Li.prototype.InterpolantFactoryMethodSmooth=void 0;var bl=class extends Tn{constructor(e,t,n,s){super(e,t,n,s)}};bl.prototype.ValueTypeName="color";var Ml=class extends Tn{constructor(e,t,n,s){super(e,t,n,s)}};Ml.prototype.ValueTypeName="number";var Sl=class extends Ii{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(s-t),c=e*o;for(let h=c+o;c!==h;c+=4)jn.slerpFlat(r,0,a,c-o,a,c,l);return r}},Ma=class extends Tn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new Sl(this.times,this.values,this.getValueSize(),e)}};Ma.prototype.ValueTypeName="quaternion";Ma.prototype.InterpolantFactoryMethodSmooth=void 0;var ki=class extends Tn{constructor(e,t,n){super(e,t,n)}};ki.prototype.ValueTypeName="string";ki.prototype.ValueBufferType=Array;ki.prototype.DefaultInterpolation=qr;ki.prototype.InterpolantFactoryMethodLinear=void 0;ki.prototype.InterpolantFactoryMethodSmooth=void 0;var Tl=class extends Tn{constructor(e,t,n,s){super(e,t,n,s)}};Tl.prototype.ValueTypeName="vector";var El=class{constructor(e,t,n){let s=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let f=c[u],m=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},ym=new El,wl=class{constructor(e){this.manager=e!==void 0?e:ym,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};wl.DEFAULT_MATERIAL_NAME="__DEFAULT";var cr=class extends Ot{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new we(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Sa=class extends cr{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ot.DEFAULT_UP),this.updateMatrix(),this.groundColor=new we(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Zh=new mt,Sp=new L,Tp=new L,Ta=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new se(512,512),this.mapType=xn,this.map=null,this.mapPass=null,this.matrix=new mt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new nr,this._frameExtents=new se(1,1),this._viewportCount=1,this._viewports=[new Dt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Sp.setFromMatrixPosition(e.matrixWorld),t.position.copy(Sp),Tp.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Tp),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,s){Zh.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Zh,e.coordinateSystem,e.reversedDepth);let r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;e.coordinateSystem===Js||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Zh)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Ho=new L,Vo=new jn,Xn=new L,Ea=class extends Ot{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new mt,this.projectionMatrix=new mt,this.projectionMatrixInverse=new mt,this.coordinateSystem=Bn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Ho,Vo,Xn),Xn.x===1&&Xn.y===1&&Xn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ho,Vo,Xn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Ho,Vo,Xn),Xn.x===1&&Xn.y===1&&Xn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ho,Vo,Xn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},wi=new L,Ep=new se,wp=new se,Qt=class extends Ea{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=tl*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Mh*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return tl*2*Math.atan(Math.tan(Mh*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){wi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(wi.x,wi.y).multiplyScalar(-e/wi.z),wi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(wi.x,wi.y).multiplyScalar(-e/wi.z)}getViewSize(e,t){return this.getViewBounds(e,Ep,wp),t.subVectors(wp,Ep)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Mh*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}};var ru=class extends Ta{constructor(){super(new Qt(90,1,.5,500)),this.isPointLightShadow=!0}},mi=class extends cr{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new ru}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},Di=class extends Ea{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},au=class extends Ta{constructor(){super(new Di(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},hr=class extends cr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ot.DEFAULT_UP),this.updateMatrix(),this.target=new Ot,this.shadow=new au}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}};var Ys=-90,$s=1,Al=class extends Ot{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Qt(Ys,$s,e,t);s.layers=this.layers,this.add(s);let r=new Qt(Ys,$s,e,t);r.layers=this.layers,this.add(r);let a=new Qt(Ys,$s,e,t);a.layers=this.layers,this.add(a);let o=new Qt(Ys,$s,e,t);o.layers=this.layers,this.add(o);let l=new Qt(Ys,$s,e,t);l.layers=this.layers,this.add(l);let c=new Qt(Ys,$s,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(let c of t)this.remove(c);if(e===Bn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Js)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},Cl=class extends Qt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},wa=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=Ix.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function Ix(){this._document.hidden===!1&&this.reset()}var wu="\\[\\]\\.:\\/",Lx=new RegExp("["+wu+"]","g"),Au="[^"+wu+"]",kx="[^"+wu.replace("\\.","")+"]",Dx=/((?:WC+[\/:])*)/.source.replace("WC",Au),Nx=/(WCOD+)?/.source.replace("WCOD",kx),Ux=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Au),zx=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Au),Ox=new RegExp("^"+Dx+Nx+Ux+zx+"$"),Fx=["material","materials","bones","map"],ou=class{constructor(e,t,n){let s=n||Rt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Rt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Lx,"")}static parseTrackName(e){let t=Ox.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Fx.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let l=n(o.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ye("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){qe("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){qe("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){qe("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){qe("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){qe("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){qe("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){qe("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[s];if(a===void 0){let c=t.nodeName;qe("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){qe("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){qe("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Rt.Composite=ou;Rt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Rt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Rt.prototype.GetterByBindingType=[Rt.prototype._getValue_direct,Rt.prototype._getValue_array,Rt.prototype._getValue_arrayElement,Rt.prototype._getValue_toArray];Rt.prototype.SetterByBindingTypeAndVersioning=[[Rt.prototype._setValue_direct,Rt.prototype._setValue_direct_setNeedsUpdate,Rt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Rt.prototype._setValue_array,Rt.prototype._setValue_array_setNeedsUpdate,Rt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Rt.prototype._setValue_arrayElement,Rt.prototype._setValue_arrayElement_setNeedsUpdate,Rt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Rt.prototype._setValue_fromArray,Rt.prototype._setValue_fromArray_setNeedsUpdate,Rt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var yS=new Float32Array(1);var Ap=new mt,Aa=class{constructor(e,t,n=0,s=1/0){this.ray=new as(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new er,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):qe("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Ap.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Ap),this}intersectObject(e,t=!0,n=[]){return lu(e,this,n,t),n.sort(Cp),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)lu(e[s],this,n,t);return n.sort(Cp),n}};function Cp(i,e){return i.distance-e.distance}function lu(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let a=0,o=r.length;a<o;a++)lu(r[a],e,t,!0)}}var ku=class ku{constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}};ku.prototype.isMatrix2=!0;var cu=ku;function Cu(i,e,t,n){let s=Bx(n);switch(t){case vu:return i*e;case zl:return i*e/s.components*s.byteLength;case Ol:return i*e/s.components*s.byteLength;case Fi:return i*e*2/s.components*s.byteLength;case Fl:return i*e*2/s.components*s.byteLength;case bu:return i*e*3/s.components*s.byteLength;case Ln:return i*e*4/s.components*s.byteLength;case Bl:return i*e*4/s.components*s.byteLength;case Ua:case za:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Oa:case Fa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Vl:case Wl:return Math.max(i,16)*Math.max(e,8)/4;case Hl:case Gl:return Math.max(i,8)*Math.max(e,8)/2;case Xl:case ql:case $l:case Zl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Yl:case Ba:case jl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Jl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Kl:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Ql:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case ec:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case tc:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case nc:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case ic:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case sc:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case rc:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case ac:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case oc:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case lc:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case cc:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case hc:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case uc:case dc:case fc:return Math.ceil(i/4)*Math.ceil(e/4)*16;case pc:case mc:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Ha:case gc:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Bx(i){switch(i){case xn:case gu:return{byteLength:1,components:1};case fr:case xu:case nn:return{byteLength:2,components:1};case Nl:case Ul:return{byteLength:2,components:4};case Vn:case Dl:case In:return{byteLength:4,components:1};case _u:case yu:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Ye("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function Hm(){let i=null,e=!1,t=null,n=null;function s(r,a){n=i.requestAnimationFrame(s),t(r,a)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Vx(i){let e=new WeakMap;function t(o,l){let c=o.array,h=o.usage,u=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){let h=l.array,u=l.updateRanges;if(i.bindBuffer(c,o),u.length===0)i.bufferSubData(c,0,h);else{u.sort((f,m)=>f.start-m.start);let d=0;for(let f=1;f<u.length;f++){let m=u[d],x=u[f];x.start<=m.start+m.count+1?m.count=Math.max(m.count,x.start+x.count-m.start):(++d,u[d]=x)}u.length=d+1;for(let f=0,m=u.length;f<m;f++){let x=u[f];i.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var Gx=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Wx=`#ifdef USE_ALPHAHASH
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
#endif`,Xx=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,qx=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Yx=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,$x=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Zx=`#ifdef USE_AOMAP
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
#endif`,jx=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Jx=`#ifdef USE_BATCHING
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
#endif`,Kx=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Qx=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,e_=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,t_=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,n_=`#ifdef USE_IRIDESCENCE
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
#endif`,i_=`#ifdef USE_BUMPMAP
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
#endif`,s_=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,r_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,a_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,o_=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,l_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,c_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,h_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,u_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,d_=`#define PI 3.141592653589793
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
} // validated`,f_=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,p_=`vec3 transformedNormal = objectNormal;
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
#endif`,m_=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,g_=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,x_=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,__=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,y_="gl_FragColor = linearToOutputTexel( gl_FragColor );",v_=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,b_=`#ifdef USE_ENVMAP
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
#endif`,M_=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,S_=`#ifdef USE_ENVMAP
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
#endif`,T_=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,E_=`#ifdef USE_ENVMAP
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
#endif`,w_=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,A_=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,C_=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,R_=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,P_=`#ifdef USE_GRADIENTMAP
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
}`,I_=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,L_=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,k_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,D_=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,N_=`#ifdef USE_ENVMAP
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
#endif`,U_=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,z_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,O_=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,F_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,B_=`PhysicalMaterial material;
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
#endif`,H_=`uniform sampler2D dfgLUT;
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
}`,V_=`
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
#endif`,G_=`#if defined( RE_IndirectDiffuse )
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
#endif`,W_=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,X_=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,q_=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Y_=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,$_=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Z_=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,j_=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,J_=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,K_=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Q_=`#if defined( USE_POINTS_UV )
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
#endif`,ey=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,ty=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ny=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,iy=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,sy=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ry=`#ifdef USE_MORPHTARGETS
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
#endif`,ay=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,oy=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,ly=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,cy=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,hy=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,uy=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,dy=`#ifdef USE_NORMALMAP
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
#endif`,fy=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,py=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,my=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,gy=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,xy=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,_y=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,yy=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,vy=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,by=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,My=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Sy=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Ty=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Ey=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,wy=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Ay=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Cy=`float getShadowMask() {
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
}`,Ry=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Py=`#ifdef USE_SKINNING
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
#endif`,Iy=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ly=`#ifdef USE_SKINNING
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
#endif`,ky=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Dy=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Ny=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Uy=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,zy=`#ifdef USE_TRANSMISSION
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
#endif`,Oy=`#ifdef USE_TRANSMISSION
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
#endif`,Fy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,By=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Hy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Vy=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Gy=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Wy=`uniform sampler2D t2D;
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
}`,Xy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,qy=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Yy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,$y=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zy=`#include <common>
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
}`,jy=`#if DEPTH_PACKING == 3200
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
}`,Jy=`#define DISTANCE
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
}`,Ky=`#define DISTANCE
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
}`,Qy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ev=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,tv=`uniform float scale;
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
}`,nv=`uniform vec3 diffuse;
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
}`,iv=`#include <common>
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
}`,sv=`uniform vec3 diffuse;
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
}`,rv=`#define LAMBERT
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
}`,av=`#define LAMBERT
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
}`,ov=`#define MATCAP
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
}`,lv=`#define MATCAP
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
}`,cv=`#define NORMAL
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
}`,hv=`#define NORMAL
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
}`,uv=`#define PHONG
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
}`,dv=`#define PHONG
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
}`,fv=`#define STANDARD
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
}`,pv=`#define STANDARD
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
}`,mv=`#define TOON
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
}`,gv=`#define TOON
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
}`,xv=`uniform float size;
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
}`,_v=`uniform vec3 diffuse;
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
}`,yv=`#include <common>
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
}`,vv=`uniform vec3 color;
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
}`,bv=`uniform float rotation;
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
}`,Mv=`uniform vec3 diffuse;
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
}`,nt={alphahash_fragment:Gx,alphahash_pars_fragment:Wx,alphamap_fragment:Xx,alphamap_pars_fragment:qx,alphatest_fragment:Yx,alphatest_pars_fragment:$x,aomap_fragment:Zx,aomap_pars_fragment:jx,batching_pars_vertex:Jx,batching_vertex:Kx,begin_vertex:Qx,beginnormal_vertex:e_,bsdfs:t_,iridescence_fragment:n_,bumpmap_pars_fragment:i_,clipping_planes_fragment:s_,clipping_planes_pars_fragment:r_,clipping_planes_pars_vertex:a_,clipping_planes_vertex:o_,color_fragment:l_,color_pars_fragment:c_,color_pars_vertex:h_,color_vertex:u_,common:d_,cube_uv_reflection_fragment:f_,defaultnormal_vertex:p_,displacementmap_pars_vertex:m_,displacementmap_vertex:g_,emissivemap_fragment:x_,emissivemap_pars_fragment:__,colorspace_fragment:y_,colorspace_pars_fragment:v_,envmap_fragment:b_,envmap_common_pars_fragment:M_,envmap_pars_fragment:S_,envmap_pars_vertex:T_,envmap_physical_pars_fragment:N_,envmap_vertex:E_,fog_vertex:w_,fog_pars_vertex:A_,fog_fragment:C_,fog_pars_fragment:R_,gradientmap_pars_fragment:P_,lightmap_pars_fragment:I_,lights_lambert_fragment:L_,lights_lambert_pars_fragment:k_,lights_pars_begin:D_,lights_toon_fragment:U_,lights_toon_pars_fragment:z_,lights_phong_fragment:O_,lights_phong_pars_fragment:F_,lights_physical_fragment:B_,lights_physical_pars_fragment:H_,lights_fragment_begin:V_,lights_fragment_maps:G_,lights_fragment_end:W_,lightprobes_pars_fragment:X_,logdepthbuf_fragment:q_,logdepthbuf_pars_fragment:Y_,logdepthbuf_pars_vertex:$_,logdepthbuf_vertex:Z_,map_fragment:j_,map_pars_fragment:J_,map_particle_fragment:K_,map_particle_pars_fragment:Q_,metalnessmap_fragment:ey,metalnessmap_pars_fragment:ty,morphinstance_vertex:ny,morphcolor_vertex:iy,morphnormal_vertex:sy,morphtarget_pars_vertex:ry,morphtarget_vertex:ay,normal_fragment_begin:oy,normal_fragment_maps:ly,normal_pars_fragment:cy,normal_pars_vertex:hy,normal_vertex:uy,normalmap_pars_fragment:dy,clearcoat_normal_fragment_begin:fy,clearcoat_normal_fragment_maps:py,clearcoat_pars_fragment:my,iridescence_pars_fragment:gy,opaque_fragment:xy,packing:_y,premultiplied_alpha_fragment:yy,project_vertex:vy,dithering_fragment:by,dithering_pars_fragment:My,roughnessmap_fragment:Sy,roughnessmap_pars_fragment:Ty,shadowmap_pars_fragment:Ey,shadowmap_pars_vertex:wy,shadowmap_vertex:Ay,shadowmask_pars_fragment:Cy,skinbase_vertex:Ry,skinning_pars_vertex:Py,skinning_vertex:Iy,skinnormal_vertex:Ly,specularmap_fragment:ky,specularmap_pars_fragment:Dy,tonemapping_fragment:Ny,tonemapping_pars_fragment:Uy,transmission_fragment:zy,transmission_pars_fragment:Oy,uv_pars_fragment:Fy,uv_pars_vertex:By,uv_vertex:Hy,worldpos_vertex:Vy,background_vert:Gy,background_frag:Wy,backgroundCube_vert:Xy,backgroundCube_frag:qy,cube_vert:Yy,cube_frag:$y,depth_vert:Zy,depth_frag:jy,distance_vert:Jy,distance_frag:Ky,equirect_vert:Qy,equirect_frag:ev,linedashed_vert:tv,linedashed_frag:nv,meshbasic_vert:iv,meshbasic_frag:sv,meshlambert_vert:rv,meshlambert_frag:av,meshmatcap_vert:ov,meshmatcap_frag:lv,meshnormal_vert:cv,meshnormal_frag:hv,meshphong_vert:uv,meshphong_frag:dv,meshphysical_vert:fv,meshphysical_frag:pv,meshtoon_vert:mv,meshtoon_frag:gv,points_vert:xv,points_frag:_v,shadow_vert:yv,shadow_frag:vv,sprite_vert:bv,sprite_frag:Mv},ye={common:{diffuse:{value:new we(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ke}},envmap:{envMap:{value:null},envMapRotation:{value:new Ke},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ke}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ke}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ke},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ke},normalScale:{value:new se(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ke},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ke}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ke}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ke}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new we(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new L},probesMax:{value:new L},probesResolution:{value:new L}},points:{diffuse:{value:new we(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0},uvTransform:{value:new Ke}},sprite:{diffuse:{value:new we(16777215)},opacity:{value:1},center:{value:new se(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}}},ni={basic:{uniforms:on([ye.common,ye.specularmap,ye.envmap,ye.aomap,ye.lightmap,ye.fog]),vertexShader:nt.meshbasic_vert,fragmentShader:nt.meshbasic_frag},lambert:{uniforms:on([ye.common,ye.specularmap,ye.envmap,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.fog,ye.lights,{emissive:{value:new we(0)},envMapIntensity:{value:1}}]),vertexShader:nt.meshlambert_vert,fragmentShader:nt.meshlambert_frag},phong:{uniforms:on([ye.common,ye.specularmap,ye.envmap,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.fog,ye.lights,{emissive:{value:new we(0)},specular:{value:new we(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:nt.meshphong_vert,fragmentShader:nt.meshphong_frag},standard:{uniforms:on([ye.common,ye.envmap,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.roughnessmap,ye.metalnessmap,ye.fog,ye.lights,{emissive:{value:new we(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:nt.meshphysical_vert,fragmentShader:nt.meshphysical_frag},toon:{uniforms:on([ye.common,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.gradientmap,ye.fog,ye.lights,{emissive:{value:new we(0)}}]),vertexShader:nt.meshtoon_vert,fragmentShader:nt.meshtoon_frag},matcap:{uniforms:on([ye.common,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.fog,{matcap:{value:null}}]),vertexShader:nt.meshmatcap_vert,fragmentShader:nt.meshmatcap_frag},points:{uniforms:on([ye.points,ye.fog]),vertexShader:nt.points_vert,fragmentShader:nt.points_frag},dashed:{uniforms:on([ye.common,ye.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:nt.linedashed_vert,fragmentShader:nt.linedashed_frag},depth:{uniforms:on([ye.common,ye.displacementmap]),vertexShader:nt.depth_vert,fragmentShader:nt.depth_frag},normal:{uniforms:on([ye.common,ye.bumpmap,ye.normalmap,ye.displacementmap,{opacity:{value:1}}]),vertexShader:nt.meshnormal_vert,fragmentShader:nt.meshnormal_frag},sprite:{uniforms:on([ye.sprite,ye.fog]),vertexShader:nt.sprite_vert,fragmentShader:nt.sprite_frag},background:{uniforms:{uvTransform:{value:new Ke},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:nt.background_vert,fragmentShader:nt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ke}},vertexShader:nt.backgroundCube_vert,fragmentShader:nt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:nt.cube_vert,fragmentShader:nt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:nt.equirect_vert,fragmentShader:nt.equirect_frag},distance:{uniforms:on([ye.common,ye.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:nt.distance_vert,fragmentShader:nt.distance_frag},shadow:{uniforms:on([ye.lights,ye.fog,{color:{value:new we(0)},opacity:{value:1}}]),vertexShader:nt.shadow_vert,fragmentShader:nt.shadow_frag}};ni.physical={uniforms:on([ni.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ke},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ke},clearcoatNormalScale:{value:new se(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ke},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ke},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ke},sheen:{value:0},sheenColor:{value:new we(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ke},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ke},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ke},transmissionSamplerSize:{value:new se},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ke},attenuationDistance:{value:0},attenuationColor:{value:new we(0)},specularColor:{value:new we(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ke},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ke},anisotropyVector:{value:new se},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ke}}]),vertexShader:nt.meshphysical_vert,fragmentShader:nt.meshphysical_frag};var yc={r:0,b:0,g:0},Sv=new mt,Vm=new Ke;Vm.set(-1,0,0,0,1,0,0,0,1);function Tv(i,e,t,n,s,r){let a=new we(0),o=s===!0?0:1,l,c,h=null,u=0,d=null;function f(S){let A=S.isScene===!0?S.background:null;if(A&&A.isTexture){let v=S.backgroundBlurriness>0;A=e.get(A,v)}return A}function m(S){let A=!1,v=f(S);v===null?g(a,o):v&&v.isColor&&(g(v,1),A=!0);let w=i.xr.getEnvironmentBlendMode();w==="additive"?t.buffers.color.setClear(0,0,0,1,r):w==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||A)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function x(S,A){let v=f(A);v&&(v.isCubeTexture||v.mapping===Da)?(c===void 0&&(c=new $e(new Mn(1,1,1),new It({name:"BackgroundCubeMaterial",uniforms:gs(ni.backgroundCube.uniforms),vertexShader:ni.backgroundCube.vertexShader,fragmentShader:ni.backgroundCube.fragmentShader,side:tn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(w,E,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=v,c.material.uniforms.backgroundBlurriness.value=A.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Sv.makeRotationFromEuler(A.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Vm),c.material.toneMapped=st.getTransfer(v.colorSpace)!==dt,(h!==v||u!==v.version||d!==i.toneMapping)&&(c.material.needsUpdate=!0,h=v,u=v.version,d=i.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new $e(new pi(2,2),new It({name:"BackgroundMaterial",uniforms:gs(ni.background.uniforms),vertexShader:ni.background.vertexShader,fragmentShader:ni.background.fragmentShader,side:Ni,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,l.material.toneMapped=st.getTransfer(v.colorSpace)!==dt,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(h!==v||u!==v.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,h=v,u=v.version,d=i.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function g(S,A){S.getRGB(yc,Eu(i)),t.buffers.color.setClear(yc.r,yc.g,yc.b,A,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(S,A=1){a.set(S),o=A,g(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(S){o=S,g(a,o)},render:m,addToRenderList:x,dispose:p}}function Ev(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null),r=s,a=!1;function o(I,z,B,D,H){let X=!1,F=u(I,D,B,z);r!==F&&(r=F,c(r.object)),X=f(I,D,B,H),X&&m(I,D,B,H),H!==null&&e.update(H,i.ELEMENT_ARRAY_BUFFER),(X||a)&&(a=!1,v(I,z,B,D),H!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function l(){return i.createVertexArray()}function c(I){return i.bindVertexArray(I)}function h(I){return i.deleteVertexArray(I)}function u(I,z,B,D){let H=D.wireframe===!0,X=n[z.id];X===void 0&&(X={},n[z.id]=X);let F=I.isInstancedMesh===!0?I.id:0,J=X[F];J===void 0&&(J={},X[F]=J);let q=J[B.id];q===void 0&&(q={},J[B.id]=q);let Q=q[H];return Q===void 0&&(Q=d(l()),q[H]=Q),Q}function d(I){let z=[],B=[],D=[];for(let H=0;H<t;H++)z[H]=0,B[H]=0,D[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:z,enabledAttributes:B,attributeDivisors:D,object:I,attributes:{},index:null}}function f(I,z,B,D){let H=r.attributes,X=z.attributes,F=0,J=B.getAttributes();for(let q in J)if(J[q].location>=0){let ee=H[q],ze=X[q];if(ze===void 0&&(q==="instanceMatrix"&&I.instanceMatrix&&(ze=I.instanceMatrix),q==="instanceColor"&&I.instanceColor&&(ze=I.instanceColor)),ee===void 0||ee.attribute!==ze||ze&&ee.data!==ze.data)return!0;F++}return r.attributesNum!==F||r.index!==D}function m(I,z,B,D){let H={},X=z.attributes,F=0,J=B.getAttributes();for(let q in J)if(J[q].location>=0){let ee=X[q];ee===void 0&&(q==="instanceMatrix"&&I.instanceMatrix&&(ee=I.instanceMatrix),q==="instanceColor"&&I.instanceColor&&(ee=I.instanceColor));let ze={};ze.attribute=ee,ee&&ee.data&&(ze.data=ee.data),H[q]=ze,F++}r.attributes=H,r.attributesNum=F,r.index=D}function x(){let I=r.newAttributes;for(let z=0,B=I.length;z<B;z++)I[z]=0}function g(I){p(I,0)}function p(I,z){let B=r.newAttributes,D=r.enabledAttributes,H=r.attributeDivisors;B[I]=1,D[I]===0&&(i.enableVertexAttribArray(I),D[I]=1),H[I]!==z&&(i.vertexAttribDivisor(I,z),H[I]=z)}function S(){let I=r.newAttributes,z=r.enabledAttributes;for(let B=0,D=z.length;B<D;B++)z[B]!==I[B]&&(i.disableVertexAttribArray(B),z[B]=0)}function A(I,z,B,D,H,X,F){F===!0?i.vertexAttribIPointer(I,z,B,H,X):i.vertexAttribPointer(I,z,B,D,H,X)}function v(I,z,B,D){x();let H=D.attributes,X=B.getAttributes(),F=z.defaultAttributeValues;for(let J in X){let q=X[J];if(q.location>=0){let Q=H[J];if(Q===void 0&&(J==="instanceMatrix"&&I.instanceMatrix&&(Q=I.instanceMatrix),J==="instanceColor"&&I.instanceColor&&(Q=I.instanceColor)),Q!==void 0){let ee=Q.normalized,ze=Q.itemSize,Pe=e.get(Q);if(Pe===void 0)continue;let pt=Pe.buffer,rt=Pe.type,ct=Pe.bytesPerElement,j=rt===i.INT||rt===i.UNSIGNED_INT||Q.gpuType===Dl;if(Q.isInterleavedBufferAttribute){let ne=Q.data,ve=ne.stride,Ze=Q.offset;if(ne.isInstancedInterleavedBuffer){for(let Ee=0;Ee<q.locationSize;Ee++)p(q.location+Ee,ne.meshPerAttribute);I.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let Ee=0;Ee<q.locationSize;Ee++)g(q.location+Ee);i.bindBuffer(i.ARRAY_BUFFER,pt);for(let Ee=0;Ee<q.locationSize;Ee++)A(q.location+Ee,ze/q.locationSize,rt,ee,ve*ct,(Ze+ze/q.locationSize*Ee)*ct,j)}else{if(Q.isInstancedBufferAttribute){for(let ne=0;ne<q.locationSize;ne++)p(q.location+ne,Q.meshPerAttribute);I.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let ne=0;ne<q.locationSize;ne++)g(q.location+ne);i.bindBuffer(i.ARRAY_BUFFER,pt);for(let ne=0;ne<q.locationSize;ne++)A(q.location+ne,ze/q.locationSize,rt,ee,ze*ct,ze/q.locationSize*ne*ct,j)}}else if(F!==void 0){let ee=F[J];if(ee!==void 0)switch(ee.length){case 2:i.vertexAttrib2fv(q.location,ee);break;case 3:i.vertexAttrib3fv(q.location,ee);break;case 4:i.vertexAttrib4fv(q.location,ee);break;default:i.vertexAttrib1fv(q.location,ee)}}}}S()}function w(){T();for(let I in n){let z=n[I];for(let B in z){let D=z[B];for(let H in D){let X=D[H];for(let F in X)h(X[F].object),delete X[F];delete D[H]}}delete n[I]}}function E(I){if(n[I.id]===void 0)return;let z=n[I.id];for(let B in z){let D=z[B];for(let H in D){let X=D[H];for(let F in X)h(X[F].object),delete X[F];delete D[H]}}delete n[I.id]}function P(I){for(let z in n){let B=n[z];for(let D in B){let H=B[D];if(H[I.id]===void 0)continue;let X=H[I.id];for(let F in X)h(X[F].object),delete X[F];delete H[I.id]}}}function y(I){for(let z in n){let B=n[z],D=I.isInstancedMesh===!0?I.id:0,H=B[D];if(H!==void 0){for(let X in H){let F=H[X];for(let J in F)h(F[J].object),delete F[J];delete H[X]}delete B[D],Object.keys(B).length===0&&delete n[z]}}}function T(){R(),a=!0,r!==s&&(r=s,c(r.object))}function R(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:T,resetDefaultState:R,dispose:w,releaseStatesOfGeometry:E,releaseStatesOfObject:y,releaseStatesOfProgram:P,initAttributes:x,enableAttribute:g,disableUnusedAttributes:S}}function wv(i,e,t){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),t.update(c,n,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let d=0;for(let f=0;f<h;f++)d+=c[f];t.update(d,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function Av(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let P=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(P){return!(P!==Ln&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){let y=P===nn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(P!==xn&&P!==In&&!y&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(P){if(P==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(Ye("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&d===!1&&Ye("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),S=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),A=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),w=i.getParameter(i.MAX_SAMPLES),E=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:m,maxTextureSize:x,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:S,maxVaryings:A,maxFragmentUniforms:v,maxSamples:w,samples:E}}function Cv(i){let e=this,t=null,n=0,s=!1,r=!1,a=new Fn,o=new Ke,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){let m=u.clippingPlanes,x=u.clipIntersection,g=u.clipShadows,p=i.get(u);if(!s||m===null||m.length===0||r&&!g)r?h(null):c();else{let S=r?0:n,A=S*4,v=p.clippingState||null;l.value=v,v=h(m,d,A,f);for(let w=0;w!==A;++w)v[w]=t[w];p.clippingState=v,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,m){let x=u!==null?u.length:0,g=null;if(x!==0){if(g=l.value,m!==!0||g===null){let p=f+x*4,S=d.matrixWorldInverse;o.getNormalMatrix(S),(g===null||g.length<p)&&(g=new Float32Array(p));for(let A=0,v=f;A!==x;++A,v+=4)a.copy(u[A]).applyMatrix4(S,o),a.normal.toArray(g,v),g[v+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,g}}var gr=4,Rv=6,Pv=20,Iv=256,Ga=new Di,vm=new we,Du=null,Nu=0,Uu=0,zu=!1,Lv=new L,xs=new L,_r=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){let{size:a=256,position:o=Lv}=r;Du=this._renderer.getRenderTarget(),Nu=this._renderer.getActiveCubeFace(),Uu=this._renderer.getActiveMipmapLevel(),zu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Sm(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Mm(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Du,Nu,Uu),this._renderer.xr.enabled=zu,e.scissorTest=!1,mr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ui||e.mapping===ps?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Du=this._renderer.getRenderTarget(),Nu=this._renderer.getActiveCubeFace(),Uu=this._renderer.getActiveMipmapLevel(),zu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:en,minFilter:en,generateMipmaps:!1,type:nn,format:Ln,colorSpace:Yr,depthBuffer:!1},s=bm(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=bm(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=kv(r)),this._blurMaterial=Nv(r,e,t),this._ggxMaterial=Dv(r,e,t)}return s}_compileMaterial(e){let t=new $e(new Mt,e);this._renderer.compile(t,Ga)}_sceneToCubeUV(e,t,n,s,r){let l=new Qt(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(vm),u.toneMapping=Hn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new $e(new Mn,new Tt({name:"PMREM.Background",side:tn,depthWrite:!1,depthTest:!1})));let x=this._backgroundBox,g=x.material,p=!1,S=e.background;S?S.isColor&&(g.color.copy(S),e.background=null,p=!0):(g.color.copy(vm),p=!0);for(let A=0;A<6;A++){let v=A%3;v===0?(l.up.set(0,c[A],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[A],r.y,r.z)):v===1?(l.up.set(0,0,c[A]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[A],r.z)):(l.up.set(0,c[A],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[A]));let w=this._cubeSize;mr(s,v*w,A>2?w:0,w,w),u.setRenderTarget(s),p&&u.render(x,l),u.render(e,l)}u.toneMapping=f,u.autoClear=d,e.background=S}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===Ui||e.mapping===ps;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Sm()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Mm());let r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=e;let l=this._cubeSize;mr(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Ga)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){let s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let l=a.uniforms,c=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-h*h),d=c*1.25,f=u*d,{_lodMax:m}=this,x=this._sizeLods[n],g=3*x*(n>m-gr?n-m+gr:0),p=4*(this._cubeSize-x);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=m-t,mr(r,g,p,3*x,2*x),s.setRenderTarget(r),s.render(o,Ga),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=m-n,mr(e,g,p,3*x,2*x),s.setRenderTarget(e),s.render(o,Ga)}_blur(e,t,n,s){let r=this._pingPongRenderTarget,a=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,n,a),this._blurPass(r,e,n,n,a)}_blurPass(e,t,n,s,r){let a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[s];l.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;let h=this._sizeLods[s],u=3*h*(s>this._lodMax-gr?s-this._lodMax+gr:0),d=4*(this._cubeSize-h);mr(t,u,d,3*h,2*h),a.setRenderTarget(t),a.render(l,Ga)}};function kv(i){let e=[],t=[],n=i,s=i-gr+1+Rv;for(let r=0;r<s;r++){let a=Math.pow(2,n);e.push(a);let o=1/(a-2),l=-o,c=1+o,h=[l,l,c,l,c,c,l,l,c,c,l,c],u=6,d=6,f=3,m=new Float32Array(f*d*u),x=new Float32Array(f*d*u);for(let p=0;p<u;p++){let S=p%3*2/3-1,A=p>2?0:-1,v=[S,A,0,S+2/3,A,0,S+2/3,A+1,0,S,A,0,S+2/3,A+1,0,S,A+1,0];m.set(v,f*d*p);for(let w=0;w<d;w++){let E=h[w*2]*2-1,P=h[w*2+1]*2-1;p===0?xs.set(1,P,E):p===1?xs.set(-E,1,-P):p===2?xs.set(-E,P,1):p===3?xs.set(-1,P,-E):p===4?xs.set(-E,-1,P):xs.set(E,P,-1),xs.toArray(x,(p*d+w)*f)}}let g=new Mt;g.setAttribute("position",new Pt(m,f)),g.setAttribute("outputDirection",new Pt(x,f)),t.push(new $e(g,null)),n>gr&&n--}return{lodMeshes:t,sizeLods:e}}function bm(i,e,t){let n=new Wt(i,e,t);return n.texture.mapping=Da,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function mr(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Dv(i,e,t){return new It({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Iv,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Sc(),fragmentShader:`

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
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function Nv(i,e,t){return new It({name:"SphericalGaussianBlur",defines:{SAMPLES:Pv,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Sc(),fragmentShader:`

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
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function Mm(){return new It({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Sc(),fragmentShader:`

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
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function Sm(){return new It({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Sc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function Sc(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var bc=class extends Wt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new oa(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Mn(5,5,5),r=new It({name:"CubemapFromEquirect",uniforms:gs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:tn,blending:Pn});r.uniforms.tEquirect.value=t;let a=new $e(s,r),o=t.minFilter;return t.minFilter===zi&&(t.minFilter=en),new Al(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}};function Uv(i){let e=new WeakMap,t=new WeakMap,n=null;function s(d,f=!1){return d==null?null:f?a(d):r(d)}function r(d){if(d&&d.isTexture){let f=d.mapping;if(f===Il||f===Ll)if(e.has(d)){let m=e.get(d).texture;return o(m,d.mapping)}else{let m=d.image;if(m&&m.height>0){let x=new bc(m.height);return x.fromEquirectangularTexture(i,d),e.set(d,x),d.addEventListener("dispose",c),o(x.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture){let f=d.mapping,m=f===Il||f===Ll,x=f===Ui||f===ps;if(m||x){let g=t.get(d),p=g!==void 0?g.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==p)return n===null&&(n=new _r(i)),g=m?n.fromEquirectangular(d,g):n.fromCubemap(d,g),g.texture.pmremVersion=d.pmremVersion,t.set(d,g),g.texture;if(g!==void 0)return g.texture;{let S=d.image;return m&&S&&S.height>0||x&&S&&l(S)?(n===null&&(n=new _r(i)),g=m?n.fromEquirectangular(d):n.fromCubemap(d),g.texture.pmremVersion=d.pmremVersion,t.set(d,g),d.addEventListener("dispose",h),g.texture):null}}}return d}function o(d,f){return f===Il?d.mapping=Ui:f===Ll&&(d.mapping=ps),d}function l(d){let f=0,m=6;for(let x=0;x<m;x++)d[x]!==void 0&&f++;return f===m}function c(d){let f=d.target;f.removeEventListener("dispose",c);let m=e.get(f);m!==void 0&&(e.delete(f),m.dispose())}function h(d){let f=d.target;f.removeEventListener("dispose",h);let m=t.get(f);m!==void 0&&(t.delete(f),m.dispose())}function u(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:u}}function zv(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&ss("WebGLRenderer: "+n+" extension not supported."),s}}}function Ov(i,e,t,n){let s={},r=new WeakMap;function a(u){let d=u.target;d.index!==null&&e.remove(d.index);for(let m in d.attributes)e.remove(d.attributes[m]);d.removeEventListener("dispose",a),delete s[d.id];let f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,t.memory.geometries++),d}function l(u){let d=u.attributes;for(let f in d)e.update(d[f],i.ARRAY_BUFFER)}function c(u){let d=[],f=u.index,m=u.attributes.position,x=0;if(m===void 0)return;if(f!==null){let S=f.array;x=f.version;for(let A=0,v=S.length;A<v;A+=3){let w=S[A+0],E=S[A+1],P=S[A+2];d.push(w,E,E,P,P,w)}}else{let S=m.array;x=m.version;for(let A=0,v=S.length/3-1;A<v;A+=3){let w=A+0,E=A+1,P=A+2;d.push(w,E,E,P,P,w)}}let g=new(m.count>=65535?ea:Qr)(d,1);g.version=x;let p=r.get(u);p&&e.remove(p),r.set(u,g)}function h(u){let d=r.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function Fv(i,e,t){let n;function s(u){n=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function l(u,d){i.drawElements(n,d,r,u*a),t.update(d,n,1)}function c(u,d,f){f!==0&&(i.drawElementsInstanced(n,d,r,u*a,f),t.update(d,n,f))}function h(u,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,u,0,f);let x=0;for(let g=0;g<f;g++)x+=d[g];t.update(x,n,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function Bv(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:qe("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Hv(i,e,t){let n=new WeakMap,s=new Dt;function r(a,o,l){let c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(o);if(d===void 0||d.count!==u){let T=function(){P.dispose(),n.delete(o),o.removeEventListener("dispose",T)};d!==void 0&&d.texture.dispose();let f=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],S=o.morphAttributes.color||[],A=0;f===!0&&(A=1),m===!0&&(A=2),x===!0&&(A=3);let v=o.attributes.position.count*A,w=1;v>e.maxTextureSize&&(w=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);let E=new Float32Array(v*w*4*u),P=new Jr(E,v,w,u);P.type=In,P.needsUpdate=!0;let y=A*4;for(let R=0;R<u;R++){let I=g[R],z=p[R],B=S[R],D=v*w*4*R;for(let H=0;H<I.count;H++){let X=H*y;f===!0&&(s.fromBufferAttribute(I,H),E[D+X+0]=s.x,E[D+X+1]=s.y,E[D+X+2]=s.z,E[D+X+3]=0),m===!0&&(s.fromBufferAttribute(z,H),E[D+X+4]=s.x,E[D+X+5]=s.y,E[D+X+6]=s.z,E[D+X+7]=0),x===!0&&(s.fromBufferAttribute(B,H),E[D+X+8]=s.x,E[D+X+9]=s.y,E[D+X+10]=s.z,E[D+X+11]=B.itemSize===4?s.w:1)}}d={count:u,texture:P,size:new se(v,w)},n.set(o,d),o.addEventListener("dispose",T)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let f=0;for(let x=0;x<c.length;x++)f+=c[x];let m=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",m),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function Vv(i,e,t,n,s){let r=new WeakMap;function a(c){let h=s.render.frame,u=c.geometry,d=e.get(c,u);if(r.get(d)!==h&&(e.update(d),r.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return d}function o(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}var Gv={[Ca]:"LINEAR_TONE_MAPPING",[Ra]:"REINHARD_TONE_MAPPING",[Pa]:"CINEON_TONE_MAPPING",[fs]:"ACES_FILMIC_TONE_MAPPING",[La]:"AGX_TONE_MAPPING",[ka]:"NEUTRAL_TONE_MAPPING",[Ia]:"CUSTOM_TONE_MAPPING"};function Wv(i,e,t,n,s,r){let a=new Wt(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,c=new Mt;c.setAttribute("position",new lt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new lt([0,2,0,0,2,0],2));let h=new or({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),u=new $e(c,h),d=new Di(-1,1,1,-1,0,1),f=null,m=null,x=!1,g,p=null,S=[],A=!1;this.setSize=function(v,w){a.setSize(v,w),o!==null&&o.setSize(v,w),l!==null&&l.setSize(v,w);for(let E=0;E<S.length;E++){let P=S[E];P.setSize&&P.setSize(v,w)}},this.setEffects=function(v){S=v,A=S.length>0&&S[0].isRenderPass===!0;let w=a.width,E=a.height;S.length>0&&o===null&&(o=new Wt(w,E,{type:nn,depthBuffer:!1,stencilBuffer:!1}),l=new Wt(w,E,{type:nn,depthBuffer:!1,stencilBuffer:!1}));for(let P=0;P<S.length;P++){let y=S[P];y.setSize&&y.setSize(w,E)}},this.begin=function(v,w){if(x||v.toneMapping===Hn&&S.length===0)return!1;if(p=w,w!==null){let E=w.width,P=w.height;(a.width!==E||a.height!==P)&&this.setSize(E,P)}return A===!1&&v.setRenderTarget(a),g=v.toneMapping,v.toneMapping=Hn,!0},this.hasRenderPass=function(){return A},this.end=function(v,w){v.toneMapping=g,x=!0;let E=a,P=o;for(let y=0;y<S.length;y++){let T=S[y];T.enabled!==!1&&(T.render(v,P,E,w),T.needsSwap!==!1&&(E=P,P=P===o?l:o))}if(f!==v.outputColorSpace||m!==v.toneMapping){f=v.outputColorSpace,m=v.toneMapping,h.defines={},st.getTransfer(f)===dt&&(h.defines.SRGB_TRANSFER="");let y=Gv[m];y&&(h.defines[y]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=E.texture,v.setRenderTarget(p),v.render(u,d),p=null,x=!1},this.isCompositing=function(){return x},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}var Gm=new fn,Bu=new Ci(1,1),Wm=new Jr,Xm=new sl,qm=new oa,Tm=[],Em=[],wm=new Float32Array(16),Am=new Float32Array(9),Cm=new Float32Array(4);function yr(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=Tm[s];if(r===void 0&&(r=new Float32Array(s),Tm[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function qt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Yt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Tc(i,e){let t=Em[e];t===void 0&&(t=new Int32Array(e),Em[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Xv(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function qv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(qt(t,e))return;i.uniform2fv(this.addr,e),Yt(t,e)}}function Yv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(qt(t,e))return;i.uniform3fv(this.addr,e),Yt(t,e)}}function $v(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(qt(t,e))return;i.uniform4fv(this.addr,e),Yt(t,e)}}function Zv(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(qt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Yt(t,e)}else{if(qt(t,n))return;Cm.set(n),i.uniformMatrix2fv(this.addr,!1,Cm),Yt(t,n)}}function jv(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(qt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Yt(t,e)}else{if(qt(t,n))return;Am.set(n),i.uniformMatrix3fv(this.addr,!1,Am),Yt(t,n)}}function Jv(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(qt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Yt(t,e)}else{if(qt(t,n))return;wm.set(n),i.uniformMatrix4fv(this.addr,!1,wm),Yt(t,n)}}function Kv(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Qv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(qt(t,e))return;i.uniform2iv(this.addr,e),Yt(t,e)}}function eb(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(qt(t,e))return;i.uniform3iv(this.addr,e),Yt(t,e)}}function tb(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(qt(t,e))return;i.uniform4iv(this.addr,e),Yt(t,e)}}function nb(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function ib(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(qt(t,e))return;i.uniform2uiv(this.addr,e),Yt(t,e)}}function sb(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(qt(t,e))return;i.uniform3uiv(this.addr,e),Yt(t,e)}}function rb(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(qt(t,e))return;i.uniform4uiv(this.addr,e),Yt(t,e)}}function ab(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Bu.compareFunction=t.isReversedDepthBuffer()?_c:xc,r=Bu):r=Gm,t.setTexture2D(e||r,s)}function ob(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Xm,s)}function lb(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||qm,s)}function cb(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Wm,s)}function hb(i){switch(i){case 5126:return Xv;case 35664:return qv;case 35665:return Yv;case 35666:return $v;case 35674:return Zv;case 35675:return jv;case 35676:return Jv;case 5124:case 35670:return Kv;case 35667:case 35671:return Qv;case 35668:case 35672:return eb;case 35669:case 35673:return tb;case 5125:return nb;case 36294:return ib;case 36295:return sb;case 36296:return rb;case 35678:case 36198:case 36298:case 36306:case 35682:return ab;case 35679:case 36299:case 36307:return ob;case 35680:case 36300:case 36308:case 36293:return lb;case 36289:case 36303:case 36311:case 36292:return cb}}function ub(i,e){i.uniform1fv(this.addr,e)}function db(i,e){let t=yr(e,this.size,2);i.uniform2fv(this.addr,t)}function fb(i,e){let t=yr(e,this.size,3);i.uniform3fv(this.addr,t)}function pb(i,e){let t=yr(e,this.size,4);i.uniform4fv(this.addr,t)}function mb(i,e){let t=yr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function gb(i,e){let t=yr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function xb(i,e){let t=yr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function _b(i,e){i.uniform1iv(this.addr,e)}function yb(i,e){i.uniform2iv(this.addr,e)}function vb(i,e){i.uniform3iv(this.addr,e)}function bb(i,e){i.uniform4iv(this.addr,e)}function Mb(i,e){i.uniform1uiv(this.addr,e)}function Sb(i,e){i.uniform2uiv(this.addr,e)}function Tb(i,e){i.uniform3uiv(this.addr,e)}function Eb(i,e){i.uniform4uiv(this.addr,e)}function wb(i,e,t){let n=this.cache,s=e.length,r=Tc(t,s);qt(n,r)||(i.uniform1iv(this.addr,r),Yt(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=Bu:a=Gm;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function Ab(i,e,t){let n=this.cache,s=e.length,r=Tc(t,s);qt(n,r)||(i.uniform1iv(this.addr,r),Yt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Xm,r[a])}function Cb(i,e,t){let n=this.cache,s=e.length,r=Tc(t,s);qt(n,r)||(i.uniform1iv(this.addr,r),Yt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||qm,r[a])}function Rb(i,e,t){let n=this.cache,s=e.length,r=Tc(t,s);qt(n,r)||(i.uniform1iv(this.addr,r),Yt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Wm,r[a])}function Pb(i){switch(i){case 5126:return ub;case 35664:return db;case 35665:return fb;case 35666:return pb;case 35674:return mb;case 35675:return gb;case 35676:return xb;case 5124:case 35670:return _b;case 35667:case 35671:return yb;case 35668:case 35672:return vb;case 35669:case 35673:return bb;case 5125:return Mb;case 36294:return Sb;case 36295:return Tb;case 36296:return Eb;case 35678:case 36198:case 36298:case 36306:case 35682:return wb;case 35679:case 36299:case 36307:return Ab;case 35680:case 36300:case 36308:case 36293:return Cb;case 36289:case 36303:case 36311:case 36292:return Rb}}var Hu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=hb(t.type)}},Vu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Pb(t.type)}},Gu=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],n)}}},Ou=/(\w+)(\])?(\[|\.)?/g;function Rm(i,e){i.seq.push(e),i.map[e.id]=e}function Ib(i,e,t){let n=i.name,s=n.length;for(Ou.lastIndex=0;;){let r=Ou.exec(n),a=Ou.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Rm(t,c===void 0?new Hu(o,i,e):new Vu(o,i,e));break}else{let u=t.map[o];u===void 0&&(u=new Gu(o),Rm(t,u)),t=u}}}var xr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);Ib(o,l,this)}let s=[],r=[];for(let a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&n.push(a)}return n}};function Pm(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var Lb=37297,kb=0;function Db(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}var Im=new Ke;function Nb(i){st._getMatrix(Im,st.workingColorSpace,i);let e=`mat3( ${Im.elements.map(t=>t.toFixed(4))} )`;switch(st.getTransfer(i)){case $r:return[e,"LinearTransferOETF"];case dt:return[e,"sRGBTransferOETF"];default:return Ye("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Lm(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+Db(i.getShaderSource(e),o)}else return r}function Ub(i,e){let t=Nb(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var zb={[Ca]:"Linear",[Ra]:"Reinhard",[Pa]:"Cineon",[fs]:"ACESFilmic",[La]:"AgX",[ka]:"Neutral",[Ia]:"Custom"};function Ob(i,e){let t=zb[e];return t===void 0?(Ye("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var vc=new L;function Fb(){st.getLuminanceCoefficients(vc);let i=vc.x.toFixed(4),e=vc.y.toFixed(4),t=vc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Bb(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Xa).join(`
`)}function Hb(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Vb(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Xa(i){return i!==""}function km(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Dm(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Gb=/^[ \t]*#include +<([\w\d./]+)>/gm;function Wu(i){return i.replace(Gb,Xb)}var Wb=new Map;function Xb(i,e){let t=nt[e];if(t===void 0){let n=Wb.get(e);if(n!==void 0)t=nt[n],Ye('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Wu(t)}var qb=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Nm(i){return i.replace(qb,Yb)}function Yb(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Um(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}var $b={[us]:"SHADOWMAP_TYPE_PCF",[ur]:"SHADOWMAP_TYPE_VSM"};function Zb(i){return $b[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var jb={[Ui]:"ENVMAP_TYPE_CUBE",[ps]:"ENVMAP_TYPE_CUBE",[Da]:"ENVMAP_TYPE_CUBE_UV"};function Jb(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":jb[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var Kb={[ps]:"ENVMAP_MODE_REFRACTION"};function Qb(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":Kb[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var eM={[Pl]:"ENVMAP_BLENDING_MULTIPLY",[jp]:"ENVMAP_BLENDING_MIX",[Jp]:"ENVMAP_BLENDING_ADD"};function tM(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":eM[i.combine]||"ENVMAP_BLENDING_NONE"}function nM(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function iM(i,e,t,n){let s=i.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,l=Zb(t),c=Jb(t),h=Qb(t),u=tM(t),d=nM(t),f=Bb(t),m=Hb(r),x=s.createProgram(),g,p,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Xa).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Xa).join(`
`),p.length>0&&(p+=`
`)):(g=[Um(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Xa).join(`
`),p=[Um(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Hn?"#define TONE_MAPPING":"",t.toneMapping!==Hn?nt.tonemapping_pars_fragment:"",t.toneMapping!==Hn?Ob("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",nt.colorspace_pars_fragment,Ub("linearToOutputTexel",t.outputColorSpace),Fb(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Xa).join(`
`)),a=Wu(a),a=km(a,t),a=Dm(a,t),o=Wu(o),o=km(o,t),o=Dm(o,t),a=Nm(a),o=Nm(o),t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",t.glslVersion===Su?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Su?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let A=S+g+a,v=S+p+o,w=Pm(s,s.VERTEX_SHADER,A),E=Pm(s,s.FRAGMENT_SHADER,v);s.attachShader(x,w),s.attachShader(x,E),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function P(I){if(i.debug.checkShaderErrors){let z=s.getProgramInfoLog(x)||"",B=s.getShaderInfoLog(w)||"",D=s.getShaderInfoLog(E)||"",H=z.trim(),X=B.trim(),F=D.trim(),J=!0,q=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(J=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,w,E);else{let Q=Lm(s,w,"vertex"),ee=Lm(s,E,"fragment");qe("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+H+`
`+Q+`
`+ee)}else H!==""?Ye("WebGLProgram: Program Info Log:",H):(X===""||F==="")&&(q=!1);q&&(I.diagnostics={runnable:J,programLog:H,vertexShader:{log:X,prefix:g},fragmentShader:{log:F,prefix:p}})}s.deleteShader(w),s.deleteShader(E),y=new xr(s,x),T=Vb(s,x)}let y;this.getUniforms=function(){return y===void 0&&P(this),y};let T;this.getAttributes=function(){return T===void 0&&P(this),T};let R=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=s.getProgramParameter(x,Lb)),R},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=kb++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=w,this.fragmentShader=E,this}var sM=0,Xu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new qu(e),t.set(e,n)),n}},qu=class{constructor(e){this.id=sM++,this.code=e,this.usedTimes=0}};function rM(i){return i===Fi||i===Ba||i===Ha}function aM(i,e,t,n,s,r){let a=new er,o=new Xu,l=new Set,c=[],h=new Map,u=n.logarithmicDepthBuffer,d=n.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(y){return l.add(y),y===0?"uv":`uv${y}`}function x(y,T,R,I,z,B){let D=I.fog,H=z.geometry,X=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?I.environment:null,F=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap,J=e.get(y.envMap||X,F),q=J&&J.mapping===Da?J.image.height:null,Q=f[y.type];y.precision!==null&&(d=n.getMaxPrecision(y.precision),d!==y.precision&&Ye("WebGLProgram.getParameters:",y.precision,"not supported, using",d,"instead."));let ee=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,ze=ee!==void 0?ee.length:0,Pe=0;H.morphAttributes.position!==void 0&&(Pe=1),H.morphAttributes.normal!==void 0&&(Pe=2),H.morphAttributes.color!==void 0&&(Pe=3);let pt,rt,ct,j;if(Q){let Et=ni[Q];pt=Et.vertexShader,rt=Et.fragmentShader}else{pt=y.vertexShader,rt=y.fragmentShader;let Et=o.getVertexShaderStage(y),xt=o.getFragmentShaderStage(y);o.update(y,Et,xt),ct=Et.id,j=xt.id}let ne=i.getRenderTarget(),ve=i.state.buffers.depth.getReversed(),Ze=z.isInstancedMesh===!0,Ee=z.isBatchedMesh===!0,je=!!y.map,yt=!!y.matcap,ie=!!J,ae=!!y.aoMap,le=!!y.lightMap,ce=!!y.bumpMap&&y.wireframe===!1,fe=!!y.normalMap,We=!!y.displacementMap,He=!!y.emissiveMap,Je=!!y.metalnessMap,Qe=!!y.roughnessMap,k=y.anisotropy>0,gt=y.clearcoat>0,at=y.dispersion>0,C=y.retroreflectivity>0,_=y.iridescence>0,O=y.sheen>0,W=y.transmission>0,$=k&&!!y.anisotropyMap,he=gt&&!!y.clearcoatMap,de=gt&&!!y.clearcoatNormalMap,Z=gt&&!!y.clearcoatRoughnessMap,te=_&&!!y.iridescenceMap,pe=_&&!!y.iridescenceThicknessMap,Oe=O&&!!y.sheenColorMap,_e=O&&!!y.sheenRoughnessMap,me=!!y.specularMap,Fe=!!y.specularColorMap,Xe=!!y.specularIntensityMap,et=W&&!!y.transmissionMap,U=W&&!!y.thicknessMap,ge=!!y.gradientMap,K=!!y.alphaMap,xe=y.alphaTest>0,Te=!!y.alphaHash,re=!!y.extensions,Be=Hn;y.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(Be=i.toneMapping);let De={shaderID:Q,shaderType:y.type,shaderName:y.name,vertexShader:pt,fragmentShader:rt,defines:y.defines,customVertexShaderID:ct,customFragmentShaderID:j,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:d,batching:Ee,batchingColor:Ee&&z._colorsTexture!==null,instancing:Ze,instancingColor:Ze&&z.instanceColor!==null,instancingMorph:Ze&&z.morphTexture!==null,outputColorSpace:ne===null?i.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:st.workingColorSpace,alphaToCoverage:!!y.alphaToCoverage,map:je,matcap:yt,envMap:ie,envMapMode:ie&&J.mapping,envMapCubeUVHeight:q,aoMap:ae,lightMap:le,bumpMap:ce,normalMap:fe,displacementMap:We,emissiveMap:He,normalMapObjectSpace:fe&&y.normalMapType===em,normalMapTangentSpace:fe&&y.normalMapType===Va,packedNormalMap:fe&&y.normalMapType===Va&&rM(y.normalMap.format),metalnessMap:Je,roughnessMap:Qe,anisotropy:k,anisotropyMap:$,clearcoat:gt,clearcoatMap:he,clearcoatNormalMap:de,clearcoatRoughnessMap:Z,dispersion:at,retroreflection:C,iridescence:_,iridescenceMap:te,iridescenceThicknessMap:pe,sheen:O,sheenColorMap:Oe,sheenRoughnessMap:_e,specularMap:me,specularColorMap:Fe,specularIntensityMap:Xe,transmission:W,transmissionMap:et,thicknessMap:U,gradientMap:ge,opaque:y.transparent===!1&&y.blending===dr&&y.alphaToCoverage===!1,alphaMap:K,alphaTest:xe,alphaHash:Te,combine:y.combine,mapUv:je&&m(y.map.channel),aoMapUv:ae&&m(y.aoMap.channel),lightMapUv:le&&m(y.lightMap.channel),bumpMapUv:ce&&m(y.bumpMap.channel),normalMapUv:fe&&m(y.normalMap.channel),displacementMapUv:We&&m(y.displacementMap.channel),emissiveMapUv:He&&m(y.emissiveMap.channel),metalnessMapUv:Je&&m(y.metalnessMap.channel),roughnessMapUv:Qe&&m(y.roughnessMap.channel),anisotropyMapUv:$&&m(y.anisotropyMap.channel),clearcoatMapUv:he&&m(y.clearcoatMap.channel),clearcoatNormalMapUv:de&&m(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Z&&m(y.clearcoatRoughnessMap.channel),iridescenceMapUv:te&&m(y.iridescenceMap.channel),iridescenceThicknessMapUv:pe&&m(y.iridescenceThicknessMap.channel),sheenColorMapUv:Oe&&m(y.sheenColorMap.channel),sheenRoughnessMapUv:_e&&m(y.sheenRoughnessMap.channel),specularMapUv:me&&m(y.specularMap.channel),specularColorMapUv:Fe&&m(y.specularColorMap.channel),specularIntensityMapUv:Xe&&m(y.specularIntensityMap.channel),transmissionMapUv:et&&m(y.transmissionMap.channel),thicknessMapUv:U&&m(y.thicknessMap.channel),alphaMapUv:K&&m(y.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&(fe||k),vertexNormals:!!H.attributes.normal,vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!H.attributes.uv&&(je||K),fog:!!D,useFog:y.fog===!0,fogExp2:!!D&&D.isFogExp2,flatShading:y.wireframe===!1&&(y.flatShading===!0||H.attributes.normal===void 0&&fe===!1&&(y.isMeshLambertMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isMeshPhysicalMaterial)),sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:ve,skinning:z.isSkinnedMesh===!0,hasPositionAttribute:H.attributes.position!==void 0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:ze,morphTextureStride:Pe,numSunLights:T.sun.length,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numSunLightShadows:T.sunShadowMap.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numLightProbeGrids:B.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:Be,decodeVideoTexture:je&&y.map.isVideoTexture===!0&&st.getTransfer(y.map.colorSpace)===dt,decodeVideoTextureEmissive:He&&y.emissiveMap.isVideoTexture===!0&&st.getTransfer(y.emissiveMap.colorSpace)===dt,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===Nt,flipSided:y.side===tn,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:re&&y.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(re&&y.extensions.multiDraw===!0||Ee)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return De.vertexUv1s=l.has(1),De.vertexUv2s=l.has(2),De.vertexUv3s=l.has(3),l.clear(),De}function g(y){let T=[];if(y.shaderID?T.push(y.shaderID):(T.push(y.customVertexShaderID),T.push(y.customFragmentShaderID)),y.defines!==void 0)for(let R in y.defines)T.push(R),T.push(y.defines[R]);return y.isRawShaderMaterial===!1&&(p(T,y),S(T,y),T.push(i.outputColorSpace)),T.push(y.customProgramCacheKey),T.join()}function p(y,T){y.push(T.precision),y.push(T.outputColorSpace),y.push(T.envMapMode),y.push(T.envMapCubeUVHeight),y.push(T.mapUv),y.push(T.alphaMapUv),y.push(T.lightMapUv),y.push(T.aoMapUv),y.push(T.bumpMapUv),y.push(T.normalMapUv),y.push(T.displacementMapUv),y.push(T.emissiveMapUv),y.push(T.metalnessMapUv),y.push(T.roughnessMapUv),y.push(T.anisotropyMapUv),y.push(T.clearcoatMapUv),y.push(T.clearcoatNormalMapUv),y.push(T.clearcoatRoughnessMapUv),y.push(T.iridescenceMapUv),y.push(T.iridescenceThicknessMapUv),y.push(T.sheenColorMapUv),y.push(T.sheenRoughnessMapUv),y.push(T.specularMapUv),y.push(T.specularColorMapUv),y.push(T.specularIntensityMapUv),y.push(T.transmissionMapUv),y.push(T.thicknessMapUv),y.push(T.combine),y.push(T.fogExp2),y.push(T.sizeAttenuation),y.push(T.morphTargetsCount),y.push(T.morphAttributeCount),y.push(T.numSunLights),y.push(T.numDirLights),y.push(T.numPointLights),y.push(T.numSpotLights),y.push(T.numSpotLightMaps),y.push(T.numHemiLights),y.push(T.numRectAreaLights),y.push(T.numSunLightShadows),y.push(T.numDirLightShadows),y.push(T.numPointLightShadows),y.push(T.numSpotLightShadows),y.push(T.numSpotLightShadowsWithMaps),y.push(T.numLightProbes),y.push(T.shadowMapType),y.push(T.toneMapping),y.push(T.numClippingPlanes),y.push(T.numClipIntersection),y.push(T.depthPacking)}function S(y,T){a.disableAll(),T.instancing&&a.enable(0),T.instancingColor&&a.enable(1),T.instancingMorph&&a.enable(2),T.matcap&&a.enable(3),T.envMap&&a.enable(4),T.normalMapObjectSpace&&a.enable(5),T.normalMapTangentSpace&&a.enable(6),T.clearcoat&&a.enable(7),T.iridescence&&a.enable(8),T.alphaTest&&a.enable(9),T.vertexColors&&a.enable(10),T.vertexAlphas&&a.enable(11),T.vertexUv1s&&a.enable(12),T.vertexUv2s&&a.enable(13),T.vertexUv3s&&a.enable(14),T.vertexTangents&&a.enable(15),T.anisotropy&&a.enable(16),T.alphaHash&&a.enable(17),T.batching&&a.enable(18),T.dispersion&&a.enable(19),T.retroreflection&&a.enable(24),T.batchingColor&&a.enable(20),T.gradientMap&&a.enable(21),T.packedNormalMap&&a.enable(22),T.vertexNormals&&a.enable(23),y.push(a.mask),a.disableAll(),T.fog&&a.enable(0),T.useFog&&a.enable(1),T.flatShading&&a.enable(2),T.logarithmicDepthBuffer&&a.enable(3),T.reversedDepthBuffer&&a.enable(4),T.skinning&&a.enable(5),T.morphTargets&&a.enable(6),T.morphNormals&&a.enable(7),T.morphColors&&a.enable(8),T.premultipliedAlpha&&a.enable(9),T.shadowMapEnabled&&a.enable(10),T.doubleSided&&a.enable(11),T.flipSided&&a.enable(12),T.useDepthPacking&&a.enable(13),T.dithering&&a.enable(14),T.transmission&&a.enable(15),T.sheen&&a.enable(16),T.opaque&&a.enable(17),T.pointsUvs&&a.enable(18),T.decodeVideoTexture&&a.enable(19),T.decodeVideoTextureEmissive&&a.enable(20),T.alphaToCoverage&&a.enable(21),T.numLightProbeGrids>0&&a.enable(22),T.hasPositionAttribute&&a.enable(23),y.push(a.mask)}function A(y){let T=f[y.type],R;if(T){let I=ni[T];R=xi.clone(I.uniforms)}else R=y.uniforms;return R}function v(y,T){let R=h.get(T);return R!==void 0?++R.usedTimes:(R=new iM(i,T,y,s),c.push(R),h.set(T,R)),R}function w(y){if(--y.usedTimes===0){let T=c.indexOf(y);c[T]=c[c.length-1],c.pop(),h.delete(y.cacheKey),y.destroy()}}function E(y){o.remove(y)}function P(){o.dispose()}return{getParameters:x,getProgramCacheKey:g,getUniforms:A,acquireProgram:v,releaseProgram:w,releaseShaderCache:E,programs:c,dispose:P}}function oM(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function lM(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function zm(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Om(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,m,x,g,p){let S=i[e];return S===void 0?(S={id:d.id,object:d,geometry:f,material:m,materialVariant:a(d),groupOrder:x,renderOrder:d.renderOrder,z:g,group:p},i[e]=S):(S.id=d.id,S.object=d,S.geometry=f,S.material=m,S.materialVariant=a(d),S.groupOrder=x,S.renderOrder=d.renderOrder,S.z=g,S.group=p),e++,S}function l(d,f,m,x,g,p,S){S.reversedDepth===!0&&(g=-g);let A=o(d,f,m,x,g,p);m.transmission>0?n.push(A):m.transparent===!0?s.push(A):t.push(A)}function c(d,f,m,x,g,p){let S=o(d,f,m,x,g,p);m.transmission>0?n.unshift(S):m.transparent===!0?s.unshift(S):t.unshift(S)}function h(d,f){t.length>1&&t.sort(d||lM),n.length>1&&n.sort(f||zm),s.length>1&&s.sort(f||zm)}function u(){for(let d=e,f=i.length;d<f;d++){let m=i[d];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:u,sort:h}}function cM(){let i=new WeakMap;function e(n,s){let r=i.get(n),a;return r===void 0?(a=new Om,i.set(n,[a])):s>=r.length?(a=new Om,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function hM(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new L,color:new we};break;case"SpotLight":t={position:new L,direction:new L,color:new we,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new L,color:new we,distance:0,decay:0};break;case"HemisphereLight":t={direction:new L,skyColor:new we,groundColor:new we};break;case"RectAreaLight":t={color:new we,position:new L,halfWidth:new L,halfHeight:new L};break}return i[e.id]=t,t}}}function uM(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new se};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new se};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new se,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var dM=0;function fM(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function pM(i){let e=new hM,t=uM(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new L);let s=new L,r=new mt,a=new mt;function o(c){let h=0,u=0,d=0;for(let z=0;z<9;z++)n.probe[z].set(0,0,0);let f=0,m=0,x=0,g=0,p=0,S=0,A=0,v=0,w=0,E=0,P=0,y=0,T=0,R=0;c.sort(fM);for(let z=0,B=c.length;z<B;z++){let D=c[z],H=D.color,X=D.intensity,F=D.distance,J=null;if(D.shadow&&D.shadow.map&&(D.shadow.map.texture.format===Fi?J=D.shadow.map.texture:J=D.shadow.map.depthTexture||D.shadow.map.texture),D.isAmbientLight)h+=H.r*X,u+=H.g*X,d+=H.b*X;else if(D.isLightProbe){for(let q=0;q<9;q++)n.probe[q].addScaledVector(D.sh.coefficients[q],X);R++}else if(D.isSunLight){let q=e.get(D);if(q.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){let Q=D.shadow,ee=t.get(D);ee.shadowIntensity=Q.intensity,ee.shadowBias=Q.bias,ee.shadowNormalBias=Q.normalBias,ee.shadowRadius=Q.radius,ee.shadowMapSize.copy(Q.mapSize).multiply(Q.getFrameExtents()),n.sunShadow[m]=ee,n.sunShadowMap[m]=J;let ze=Q.getViewportCount();for(let Pe=0;Pe<ze;Pe++)n.sunShadowMatrix[x+Pe]=Q.getMatrix(Pe),n.sunShadowCascade[x+Pe]=Q._cascadeData[Pe];x+=ze,m++}n.sun[f]=q,f++}else if(D.isDirectionalLight){let q=e.get(D);if(q.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){let Q=D.shadow,ee=t.get(D);ee.shadowIntensity=Q.intensity,ee.shadowBias=Q.bias,ee.shadowNormalBias=Q.normalBias,ee.shadowRadius=Q.radius,ee.shadowMapSize=Q.mapSize,n.directionalShadow[g]=ee,n.directionalShadowMap[g]=J,n.directionalShadowMatrix[g]=D.shadow.matrix,w++}n.directional[g]=q,g++}else if(D.isSpotLight){let q=e.get(D);q.position.setFromMatrixPosition(D.matrixWorld),q.color.copy(H).multiplyScalar(X),q.distance=F,q.coneCos=Math.cos(D.angle),q.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),q.decay=D.decay,n.spot[S]=q;let Q=D.shadow;if(D.map&&(n.spotLightMap[y]=D.map,y++,Q.updateMatrices(D),D.castShadow&&T++),n.spotLightMatrix[S]=Q.matrix,D.castShadow){let ee=t.get(D);ee.shadowIntensity=Q.intensity,ee.shadowBias=Q.bias,ee.shadowNormalBias=Q.normalBias,ee.shadowRadius=Q.radius,ee.shadowMapSize=Q.mapSize,n.spotShadow[S]=ee,n.spotShadowMap[S]=J,P++}S++}else if(D.isRectAreaLight){let q=e.get(D);q.color.copy(H).multiplyScalar(X),q.halfWidth.set(D.width*.5,0,0),q.halfHeight.set(0,D.height*.5,0),n.rectArea[A]=q,A++}else if(D.isPointLight){let q=e.get(D);if(q.color.copy(D.color).multiplyScalar(D.intensity),q.distance=D.distance,q.decay=D.decay,D.castShadow){let Q=D.shadow,ee=t.get(D);ee.shadowIntensity=Q.intensity,ee.shadowBias=Q.bias,ee.shadowNormalBias=Q.normalBias,ee.shadowRadius=Q.radius,ee.shadowMapSize=Q.mapSize,ee.shadowCameraNear=Q.camera.near,ee.shadowCameraFar=Q.camera.far,n.pointShadow[p]=ee,n.pointShadowMap[p]=J,n.pointShadowMatrix[p]=D.shadow.matrix,E++}n.point[p]=q,p++}else if(D.isHemisphereLight){let q=e.get(D);q.skyColor.copy(D.color).multiplyScalar(X),q.groundColor.copy(D.groundColor).multiplyScalar(X),n.hemi[v]=q,v++}}A>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ye.LTC_FLOAT_1,n.rectAreaLTC2=ye.LTC_FLOAT_2):(n.rectAreaLTC1=ye.LTC_HALF_1,n.rectAreaLTC2=ye.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let I=n.hash;(I.sunLength!==f||I.directionalLength!==g||I.pointLength!==p||I.spotLength!==S||I.rectAreaLength!==A||I.hemiLength!==v||I.numSunShadows!==m||I.numDirectionalShadows!==w||I.numPointShadows!==E||I.numSpotShadows!==P||I.numSpotMaps!==y||I.numLightProbes!==R)&&(n.sun.length=f,n.directional.length=g,n.spot.length=S,n.rectArea.length=A,n.point.length=p,n.hemi.length=v,n.sunShadow.length=m,n.sunShadowMap.length=m,n.sunShadowMatrix.length=x,n.sunShadowCascade.length=x,n.directionalShadow.length=w,n.directionalShadowMap.length=w,n.directionalShadowMatrix.length=w,n.pointShadow.length=E,n.pointShadowMap.length=E,n.pointShadowMatrix.length=E,n.spotShadow.length=P,n.spotShadowMap.length=P,n.spotLightMatrix.length=P+y-T,n.spotLightMap.length=y,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=R,I.sunLength=f,I.directionalLength=g,I.pointLength=p,I.spotLength=S,I.rectAreaLength=A,I.hemiLength=v,I.numSunShadows=m,I.numDirectionalShadows=w,I.numPointShadows=E,I.numSpotShadows=P,I.numSpotMaps=y,I.numLightProbes=R,n.version=dM++)}function l(c,h){let u=0,d=0,f=0,m=0,x=0,g=0,p=h.matrixWorldInverse;for(let S=0,A=c.length;S<A;S++){let v=c[S];if(v.isSunLight){let w=n.sun[u];w.direction.setFromMatrixPosition(v.matrixWorld),w.direction.transformDirection(p),u++}else if(v.isDirectionalLight){let w=n.directional[d];w.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(p),d++}else if(v.isSpotLight){let w=n.spot[m];w.position.setFromMatrixPosition(v.matrixWorld),w.position.applyMatrix4(p),w.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(p),m++}else if(v.isRectAreaLight){let w=n.rectArea[x];w.position.setFromMatrixPosition(v.matrixWorld),w.position.applyMatrix4(p),a.identity(),r.copy(v.matrixWorld),r.premultiply(p),a.extractRotation(r),w.halfWidth.set(v.width*.5,0,0),w.halfHeight.set(0,v.height*.5,0),w.halfWidth.applyMatrix4(a),w.halfHeight.applyMatrix4(a),x++}else if(v.isPointLight){let w=n.point[f];w.position.setFromMatrixPosition(v.matrixWorld),w.position.applyMatrix4(p),f++}else if(v.isHemisphereLight){let w=n.hemi[g];w.direction.setFromMatrixPosition(v.matrixWorld),w.direction.transformDirection(p),g++}}}return{setup:o,setupView:l,state:n}}function Fm(i){let e=new pM(i),t=[],n=[],s=[];function r(d){u.camera=d,t.length=0,n.length=0,s.length=0}function a(d){t.push(d)}function o(d){n.push(d)}function l(d){s.push(d)}function c(){e.setup(t)}function h(d){e.setupView(t,d)}let u={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:u,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function mM(i){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new Fm(i),e.set(s,[o])):r>=a.length?(o=new Fm(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}var gM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,xM=`uniform sampler2D shadow_pass;
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
}`,_M=[new L(1,0,0),new L(-1,0,0),new L(0,1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1)],yM=[new L(0,-1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1),new L(0,-1,0),new L(0,-1,0)],Bm=new mt,Wa=new L,Fu=new L;function vM(i,e,t){let n=new nr,s=new se,r=new se,a=new Dt,o=new ml,l=new gl,c={},h=t.maxTextureSize,u={[Ni]:tn,[tn]:Ni,[Nt]:Nt},d=new It({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new se},radius:{value:4}},vertexShader:gM,fragmentShader:xM}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let m=new Mt;m.setAttribute("position",new Pt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new $e(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=us;let p=this.type;this.render=function(E,P,y){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||E.length===0)return;this.type===Ip&&(Ye("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=us);let T=i.getRenderTarget(),R=i.getActiveCubeFace(),I=i.getActiveMipmapLevel(),z=i.state;z.setBlending(Pn),z.buffers.depth.getReversed()===!0?z.buffers.color.setClear(0,0,0,0):z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);let B=p!==this.type;B&&P.traverse(function(D){D.material&&(Array.isArray(D.material)?D.material.forEach(H=>H.needsUpdate=!0):D.material.needsUpdate=!0)});for(let D=0,H=E.length;D<H;D++){let X=E[D],F=X.shadow;if(F===void 0){Ye("WebGLShadowMap:",X,"has no shadow.");continue}if(F.autoUpdate===!1&&F.needsUpdate===!1)continue;s.copy(F.mapSize);let J=F.getFrameExtents();s.multiply(J),r.copy(F.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/J.x),s.x=r.x*J.x,F.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/J.y),s.y=r.y*J.y,F.mapSize.y=r.y));let q=i.state.buffers.depth.getReversed();if(F.camera._reversedDepth=q,F.map===null||B===!0){if(F.map!==null&&(F.map.depthTexture!==null&&(F.map.depthTexture.dispose(),F.map.depthTexture=null),F.map.dispose()),this.type===ur){if(X.isPointLight){Ye("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}F.map=new Wt(s.x,s.y,{format:Fi,type:nn,minFilter:en,magFilter:en,generateMipmaps:!1}),F.map.texture.name=X.name+".shadowMap",F.map.depthTexture=new Ci(s.x,s.y,In),F.map.depthTexture.name=X.name+".shadowMapDepth",F.map.depthTexture.format=$n,F.map.depthTexture.compareFunction=null,F.map.depthTexture.minFilter=jt,F.map.depthTexture.magFilter=jt}else X.isPointLight?(F.map=new bc(s.x),F.map.depthTexture=new ll(s.x,Vn)):(F.map=new Wt(s.x,s.y),F.map.depthTexture=new Ci(s.x,s.y,Vn)),F.map.depthTexture.name=X.name+".shadowMap",F.map.depthTexture.format=$n,this.type===us?(F.map.depthTexture.compareFunction=q?_c:xc,F.map.depthTexture.minFilter=en,F.map.depthTexture.magFilter=en):(F.map.depthTexture.compareFunction=null,F.map.depthTexture.minFilter=jt,F.map.depthTexture.magFilter=jt);F.camera.updateProjectionMatrix()}F.map.isWebGLCubeRenderTarget!==!0&&(F.map.width!==s.x||F.map.height!==s.y)&&F.map.setSize(s.x,s.y);let Q=F.map.isWebGLCubeRenderTarget?6:F.getViewportCount();X.isPointLight!==!0&&F.updateMatrices(X,y);for(let ee=0;ee<Q;ee++){let ze=F.getCamera(ee);if(X.isPointLight){let Pe=F.camera,pt=F.matrix,rt=X.distance||Pe.far;rt!==Pe.far&&(Pe.far=rt,Pe.updateProjectionMatrix()),Wa.setFromMatrixPosition(X.matrixWorld),Pe.position.copy(Wa),Fu.copy(Pe.position),Fu.add(_M[ee]),Pe.up.copy(yM[ee]),Pe.lookAt(Fu),Pe.updateMatrixWorld(),pt.makeTranslation(-Wa.x,-Wa.y,-Wa.z),Bm.multiplyMatrices(Pe.projectionMatrix,Pe.matrixWorldInverse),F._frustum.setFromProjectionMatrix(Bm,Pe.coordinateSystem,Pe.reversedDepth)}if(F.map.isWebGLCubeRenderTarget)i.setRenderTarget(F.map,ee),i.clear();else{ee===0&&(i.setRenderTarget(F.map),i.clear());let Pe=F.getViewport(ee);a.set(r.x*Pe.x,r.y*Pe.y,r.x*Pe.z,r.y*Pe.w),z.viewport(a)}n=F.getFrustum(ee),v(P,y,ze,X,this.type)}F.isPointLightShadow!==!0&&this.type===ur&&S(F,y),F.needsUpdate=!1}p=this.type,g.needsUpdate=!1,i.setRenderTarget(T,R,I)};function S(E,P){let y=e.update(x);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,f.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),E.mapPass===null?E.mapPass=new Wt(s.x,s.y,{format:Fi,type:nn}):(E.mapPass.width!==E.map.width||E.mapPass.height!==E.map.height)&&E.mapPass.setSize(E.map.width,E.map.height),d.uniforms.shadow_pass.value=E.map.depthTexture,d.uniforms.resolution.value.set(E.map.width,E.map.height),d.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(P,null,y,d,x,null),f.uniforms.shadow_pass.value=E.mapPass.texture,f.uniforms.resolution.value.set(E.map.width,E.map.height),f.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(P,null,y,f,x,null)}function A(E,P,y,T){let R=null,I=y.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(I!==void 0)R=I;else if(R=y.isPointLight===!0?l:o,i.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){let z=R.uuid,B=P.uuid,D=c[z];D===void 0&&(D={},c[z]=D);let H=D[B];H===void 0&&(H=R.clone(),D[B]=H,P.addEventListener("dispose",w)),R=H}if(R.visible=P.visible,R.wireframe=P.wireframe,T===ur?R.side=P.shadowSide!==null?P.shadowSide:P.side:R.side=P.shadowSide!==null?P.shadowSide:u[P.side],R.alphaMap=P.alphaMap,R.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,R.map=P.map,R.clipShadows=P.clipShadows,R.clippingPlanes=P.clippingPlanes,R.clipIntersection=P.clipIntersection,R.displacementMap=P.displacementMap,R.displacementScale=P.displacementScale,R.displacementBias=P.displacementBias,R.wireframeLinewidth=P.wireframeLinewidth,R.linewidth=P.linewidth,y.isPointLight===!0&&R.isMeshDistanceMaterial===!0){let z=i.properties.get(R);z.light=y}return R}function v(E,P,y,T,R){if(E.visible===!1)return;if(E.layers.test(P.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&R===ur)&&(!E.frustumCulled||E.intersectsFrustum(n))){E.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,E.matrixWorld);let B=e.update(E),D=E.material;if(Array.isArray(D)){let H=B.groups;for(let X=0,F=H.length;X<F;X++){let J=H[X],q=D[J.materialIndex];if(q&&q.visible){let Q=A(E,q,T,R);E.onBeforeShadow(i,E,P,y,B,Q,J),i.renderBufferDirect(y,null,B,Q,E,J),E.onAfterShadow(i,E,P,y,B,Q,J)}}}else if(D.visible){let H=A(E,D,T,R);E.onBeforeShadow(i,E,P,y,B,H,null),i.renderBufferDirect(y,null,B,H,E,null),E.onAfterShadow(i,E,P,y,B,H,null)}}let z=E.children;for(let B=0,D=z.length;B<D;B++)v(z[B],P,y,T,R)}function w(E){E.target.removeEventListener("dispose",w);for(let y in c){let T=c[y],R=E.target.uuid;R in T&&(T[R].dispose(),delete T[R])}}}function bM(i,e){function t(){let U=!1,ge=new Dt,K=null,xe=new Dt(0,0,0,0);return{setMask:function(Te){K!==Te&&!U&&(i.colorMask(Te,Te,Te,Te),K=Te)},setLocked:function(Te){U=Te},setClear:function(Te,re,Be,De,Et){Et===!0&&(Te*=De,re*=De,Be*=De),ge.set(Te,re,Be,De),xe.equals(ge)===!1&&(i.clearColor(Te,re,Be,De),xe.copy(ge))},reset:function(){U=!1,K=null,xe.set(-1,0,0,0)}}}function n(){let U=!1,ge=!1,K=null,xe=null,Te=null;return{setReversed:function(re){if(ge!==re){let Be=e.get("EXT_clip_control");re?Be.clipControlEXT(Be.LOWER_LEFT_EXT,Be.ZERO_TO_ONE_EXT):Be.clipControlEXT(Be.LOWER_LEFT_EXT,Be.NEGATIVE_ONE_TO_ONE_EXT),ge=re;let De=Te;Te=null,this.setClear(De)}},getReversed:function(){return ge},setTest:function(re){re?ne(i.DEPTH_TEST):ve(i.DEPTH_TEST)},setMask:function(re){K!==re&&!U&&(i.depthMask(re),K=re)},setFunc:function(re){if(ge&&(re=um[re]),xe!==re){switch(re){case Xo:i.depthFunc(i.NEVER);break;case qo:i.depthFunc(i.ALWAYS);break;case Yo:i.depthFunc(i.LESS);break;case js:i.depthFunc(i.LEQUAL);break;case $o:i.depthFunc(i.EQUAL);break;case Zo:i.depthFunc(i.GEQUAL);break;case jo:i.depthFunc(i.GREATER);break;case Jo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}xe=re}},setLocked:function(re){U=re},setClear:function(re){Te!==re&&(Te=re,ge&&(re=1-re),i.clearDepth(re))},reset:function(){U=!1,K=null,xe=null,Te=null,ge=!1}}}function s(){let U=!1,ge=null,K=null,xe=null,Te=null,re=null,Be=null,De=null,Et=null;return{setTest:function(xt){U||(xt?ne(i.STENCIL_TEST):ve(i.STENCIL_TEST))},setMask:function(xt){ge!==xt&&!U&&(i.stencilMask(xt),ge=xt)},setFunc:function(xt,Nn,Gn){(K!==xt||xe!==Nn||Te!==Gn)&&(i.stencilFunc(xt,Nn,Gn),K=xt,xe=Nn,Te=Gn)},setOp:function(xt,Nn,Gn){(re!==xt||Be!==Nn||De!==Gn)&&(i.stencilOp(xt,Nn,Gn),re=xt,Be=Nn,De=Gn)},setLocked:function(xt){U=xt},setClear:function(xt){Et!==xt&&(i.clearStencil(xt),Et=xt)},reset:function(){U=!1,ge=null,K=null,xe=null,Te=null,re=null,Be=null,De=null,Et=null}}}let r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap,h={},u={},d={},f=new WeakMap,m=[],x=null,g=!1,p=null,S=null,A=null,v=null,w=null,E=null,P=null,y=new we(0,0,0),T=0,R=!1,I=null,z=null,B=null,D=null,H=null,X=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),F=!1,J=0,q=i.getParameter(i.VERSION);q.indexOf("WebGL")!==-1?(J=parseFloat(/^WebGL (\d)/.exec(q)[1]),F=J>=1):q.indexOf("OpenGL ES")!==-1&&(J=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),F=J>=2);let Q=null,ee={},ze=i.getParameter(i.SCISSOR_BOX),Pe=i.getParameter(i.VIEWPORT),pt=new Dt().fromArray(ze),rt=new Dt().fromArray(Pe);function ct(U,ge,K,xe){let Te=new Uint8Array(4),re=i.createTexture();i.bindTexture(U,re),i.texParameteri(U,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(U,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Be=0;Be<K;Be++)U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY?i.texImage3D(ge,0,i.RGBA,1,1,xe,0,i.RGBA,i.UNSIGNED_BYTE,Te):i.texImage2D(ge+Be,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Te);return re}let j={};j[i.TEXTURE_2D]=ct(i.TEXTURE_2D,i.TEXTURE_2D,1),j[i.TEXTURE_CUBE_MAP]=ct(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),j[i.TEXTURE_2D_ARRAY]=ct(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),j[i.TEXTURE_3D]=ct(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ne(i.DEPTH_TEST),a.setFunc(js),ce(!1),fe(hu),ne(i.CULL_FACE),ae(Pn);function ne(U){h[U]!==!0&&(i.enable(U),h[U]=!0)}function ve(U){h[U]!==!1&&(i.disable(U),h[U]=!1)}function Ze(U,ge){return d[U]!==ge?(i.bindFramebuffer(U,ge),d[U]=ge,U===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=ge),U===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=ge),!0):!1}function Ee(U,ge){let K=m,xe=!1;if(U){K=f.get(ge),K===void 0&&(K=[],f.set(ge,K));let Te=U.textures;if(K.length!==Te.length||K[0]!==i.COLOR_ATTACHMENT0){for(let re=0,Be=Te.length;re<Be;re++)K[re]=i.COLOR_ATTACHMENT0+re;K.length=Te.length,xe=!0}}else K[0]!==i.BACK&&(K[0]=i.BACK,xe=!0);xe&&i.drawBuffers(K)}function je(U){return x!==U?(i.useProgram(U),x=U,!0):!1}let yt={[ds]:i.FUNC_ADD,[kp]:i.FUNC_SUBTRACT,[Dp]:i.FUNC_REVERSE_SUBTRACT};yt[Np]=i.MIN,yt[Up]=i.MAX;let ie={[zp]:i.ZERO,[Op]:i.ONE,[Fp]:i.SRC_COLOR,[fu]:i.SRC_ALPHA,[Xp]:i.SRC_ALPHA_SATURATE,[Gp]:i.DST_COLOR,[Hp]:i.DST_ALPHA,[Bp]:i.ONE_MINUS_SRC_COLOR,[pu]:i.ONE_MINUS_SRC_ALPHA,[Wp]:i.ONE_MINUS_DST_COLOR,[Vp]:i.ONE_MINUS_DST_ALPHA,[qp]:i.CONSTANT_COLOR,[Yp]:i.ONE_MINUS_CONSTANT_COLOR,[$p]:i.CONSTANT_ALPHA,[Zp]:i.ONE_MINUS_CONSTANT_ALPHA};function ae(U,ge,K,xe,Te,re,Be,De,Et,xt){if(U===Pn){g===!0&&(ve(i.BLEND),g=!1);return}if(g===!1&&(ne(i.BLEND),g=!0),U!==Lp){if(U!==p||xt!==R){if((S!==ds||w!==ds)&&(i.blendEquation(i.FUNC_ADD),S=ds,w=ds),xt)switch(U){case dr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Lt:i.blendFunc(i.ONE,i.ONE);break;case uu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case du:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:qe("WebGLState: Invalid blending: ",U);break}else switch(U){case dr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Lt:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case uu:qe("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case du:qe("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:qe("WebGLState: Invalid blending: ",U);break}A=null,v=null,E=null,P=null,y.set(0,0,0),T=0,p=U,R=xt}return}Te=Te||ge,re=re||K,Be=Be||xe,(ge!==S||Te!==w)&&(i.blendEquationSeparate(yt[ge],yt[Te]),S=ge,w=Te),(K!==A||xe!==v||re!==E||Be!==P)&&(i.blendFuncSeparate(ie[K],ie[xe],ie[re],ie[Be]),A=K,v=xe,E=re,P=Be),(De.equals(y)===!1||Et!==T)&&(i.blendColor(De.r,De.g,De.b,Et),y.copy(De),T=Et),p=U,R=!1}function le(U,ge){U.side===Nt?ve(i.CULL_FACE):ne(i.CULL_FACE);let K=U.side===tn;ge&&(K=!K),ce(K),U.blending===dr&&U.transparent===!1?ae(Pn):ae(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),a.setFunc(U.depthFunc),a.setTest(U.depthTest),a.setMask(U.depthWrite),r.setMask(U.colorWrite);let xe=U.stencilWrite;o.setTest(xe),xe&&(o.setMask(U.stencilWriteMask),o.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),o.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),He(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?ne(i.SAMPLE_ALPHA_TO_COVERAGE):ve(i.SAMPLE_ALPHA_TO_COVERAGE)}function ce(U){I!==U&&(U?i.frontFace(i.CW):i.frontFace(i.CCW),I=U)}function fe(U){U!==Rp?(ne(i.CULL_FACE),U!==z&&(U===hu?i.cullFace(i.BACK):U===Pp?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ve(i.CULL_FACE),z=U}function We(U){U!==B&&(F&&i.lineWidth(U),B=U)}function He(U,ge,K){U?(ne(i.POLYGON_OFFSET_FILL),(D!==ge||H!==K)&&(D=ge,H=K,a.getReversed()&&(ge=-ge),i.polygonOffset(ge,K))):ve(i.POLYGON_OFFSET_FILL)}function Je(U){U?ne(i.SCISSOR_TEST):ve(i.SCISSOR_TEST)}function Qe(U){U===void 0&&(U=i.TEXTURE0+X-1),Q!==U&&(i.activeTexture(U),Q=U)}function k(U,ge,K){K===void 0&&(Q===null?K=i.TEXTURE0+X-1:K=Q);let xe=ee[K];xe===void 0&&(xe={type:void 0,texture:void 0},ee[K]=xe),(xe.type!==U||xe.texture!==ge)&&(Q!==K&&(i.activeTexture(K),Q=K),i.bindTexture(U,ge||j[U]),xe.type=U,xe.texture=ge)}function gt(){let U=ee[Q];U!==void 0&&U.type!==void 0&&(i.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function at(){try{i.compressedTexImage2D(...arguments)}catch(U){qe("WebGLState:",U)}}function C(){try{i.compressedTexImage3D(...arguments)}catch(U){qe("WebGLState:",U)}}function _(){try{i.texSubImage2D(...arguments)}catch(U){qe("WebGLState:",U)}}function O(){try{i.texSubImage3D(...arguments)}catch(U){qe("WebGLState:",U)}}function W(){try{i.compressedTexSubImage2D(...arguments)}catch(U){qe("WebGLState:",U)}}function $(){try{i.compressedTexSubImage3D(...arguments)}catch(U){qe("WebGLState:",U)}}function he(){try{i.texStorage2D(...arguments)}catch(U){qe("WebGLState:",U)}}function de(){try{i.texStorage3D(...arguments)}catch(U){qe("WebGLState:",U)}}function Z(){try{i.texImage2D(...arguments)}catch(U){qe("WebGLState:",U)}}function te(){try{i.texImage3D(...arguments)}catch(U){qe("WebGLState:",U)}}function pe(U){return u[U]!==void 0?u[U]:i.getParameter(U)}function Oe(U,ge){u[U]!==ge&&(i.pixelStorei(U,ge),u[U]=ge)}function _e(U){pt.equals(U)===!1&&(i.scissor(U.x,U.y,U.z,U.w),pt.copy(U))}function me(U){rt.equals(U)===!1&&(i.viewport(U.x,U.y,U.z,U.w),rt.copy(U))}function Fe(U,ge){let K=c.get(ge);K===void 0&&(K=new WeakMap,c.set(ge,K));let xe=K.get(U);xe===void 0&&(xe=i.getUniformBlockIndex(ge,U.name),K.set(U,xe))}function Xe(U,ge){let xe=c.get(ge).get(U);l.get(ge)!==xe&&(i.uniformBlockBinding(ge,xe,U.__bindingPointIndex),l.set(ge,xe))}function et(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},u={},Q=null,ee={},d={},f=new WeakMap,m=[],x=null,g=!1,p=null,S=null,A=null,v=null,w=null,E=null,P=null,y=new we(0,0,0),T=0,R=!1,I=null,z=null,B=null,D=null,H=null,pt.set(0,0,i.canvas.width,i.canvas.height),rt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ne,disable:ve,bindFramebuffer:Ze,drawBuffers:Ee,useProgram:je,setBlending:ae,setMaterial:le,setFlipSided:ce,setCullFace:fe,setLineWidth:We,setPolygonOffset:He,setScissorTest:Je,activeTexture:Qe,bindTexture:k,unbindTexture:gt,compressedTexImage2D:at,compressedTexImage3D:C,texImage2D:Z,texImage3D:te,pixelStorei:Oe,getParameter:pe,updateUBOMapping:Fe,uniformBlockBinding:Xe,texStorage2D:he,texStorage3D:de,texSubImage2D:_,texSubImage3D:O,compressedTexSubImage2D:W,compressedTexSubImage3D:$,scissor:_e,viewport:me,reset:et}}function MM(i,e,t,n,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new se,h=new WeakMap,u=new Set,d,f=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(C,_){return m?new OffscreenCanvas(C,_):Zr("canvas")}function g(C,_,O){let W=1,$=at(C);if(($.width>O||$.height>O)&&(W=O/Math.max($.width,$.height)),W<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let he=Math.floor(W*$.width),de=Math.floor(W*$.height);d===void 0&&(d=x(he,de));let Z=_?x(he,de):d;return Z.width=he,Z.height=de,Z.getContext("2d").drawImage(C,0,0,he,de),Ye("WebGLRenderer: Texture has been resized from ("+$.width+"x"+$.height+") to ("+he+"x"+de+")."),Z}else return"data"in C&&Ye("WebGLRenderer: Image in DataTexture is too big ("+$.width+"x"+$.height+")."),C;return C}function p(C){return C.generateMipmaps}function S(C){i.generateMipmap(C)}function A(C){return C.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?i.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(C,_,O,W,$,he=!1){if(C!==null){if(i[C]!==void 0)return i[C];Ye("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let de;W&&(de=e.get("EXT_texture_norm16"),de||Ye("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Z=_;if(_===i.RED&&(O===i.FLOAT&&(Z=i.R32F),O===i.HALF_FLOAT&&(Z=i.R16F),O===i.UNSIGNED_BYTE&&(Z=i.R8),O===i.UNSIGNED_SHORT&&de&&(Z=de.R16_EXT),O===i.SHORT&&de&&(Z=de.R16_SNORM_EXT)),_===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&(Z=i.R8UI),O===i.UNSIGNED_SHORT&&(Z=i.R16UI),O===i.UNSIGNED_INT&&(Z=i.R32UI),O===i.BYTE&&(Z=i.R8I),O===i.SHORT&&(Z=i.R16I),O===i.INT&&(Z=i.R32I)),_===i.RG&&(O===i.FLOAT&&(Z=i.RG32F),O===i.HALF_FLOAT&&(Z=i.RG16F),O===i.UNSIGNED_BYTE&&(Z=i.RG8),O===i.UNSIGNED_SHORT&&de&&(Z=de.RG16_EXT),O===i.SHORT&&de&&(Z=de.RG16_SNORM_EXT)),_===i.RG_INTEGER&&(O===i.UNSIGNED_BYTE&&(Z=i.RG8UI),O===i.UNSIGNED_SHORT&&(Z=i.RG16UI),O===i.UNSIGNED_INT&&(Z=i.RG32UI),O===i.BYTE&&(Z=i.RG8I),O===i.SHORT&&(Z=i.RG16I),O===i.INT&&(Z=i.RG32I)),_===i.RGB_INTEGER&&(O===i.UNSIGNED_BYTE&&(Z=i.RGB8UI),O===i.UNSIGNED_SHORT&&(Z=i.RGB16UI),O===i.UNSIGNED_INT&&(Z=i.RGB32UI),O===i.BYTE&&(Z=i.RGB8I),O===i.SHORT&&(Z=i.RGB16I),O===i.INT&&(Z=i.RGB32I)),_===i.RGBA_INTEGER&&(O===i.UNSIGNED_BYTE&&(Z=i.RGBA8UI),O===i.UNSIGNED_SHORT&&(Z=i.RGBA16UI),O===i.UNSIGNED_INT&&(Z=i.RGBA32UI),O===i.BYTE&&(Z=i.RGBA8I),O===i.SHORT&&(Z=i.RGBA16I),O===i.INT&&(Z=i.RGBA32I)),_===i.RGB&&(O===i.UNSIGNED_SHORT&&de&&(Z=de.RGB16_EXT),O===i.SHORT&&de&&(Z=de.RGB16_SNORM_EXT),O===i.UNSIGNED_INT_5_9_9_9_REV&&(Z=i.RGB9_E5),O===i.UNSIGNED_INT_10F_11F_11F_REV&&(Z=i.R11F_G11F_B10F)),_===i.RGBA){let te=he?$r:st.getTransfer($);O===i.FLOAT&&(Z=i.RGBA32F),O===i.HALF_FLOAT&&(Z=i.RGBA16F),O===i.UNSIGNED_BYTE&&(Z=te===dt?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT&&de&&(Z=de.RGBA16_EXT),O===i.SHORT&&de&&(Z=de.RGBA16_SNORM_EXT),O===i.UNSIGNED_SHORT_4_4_4_4&&(Z=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&(Z=i.RGB5_A1)}return(Z===i.R16F||Z===i.R32F||Z===i.RG16F||Z===i.RG32F||Z===i.RGBA16F||Z===i.RGBA32F)&&e.get("EXT_color_buffer_float"),Z}function w(C,_){let O;return C?_===null||_===Vn||_===pr?O=i.DEPTH24_STENCIL8:_===In?O=i.DEPTH32F_STENCIL8:_===fr&&(O=i.DEPTH24_STENCIL8,Ye("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===Vn||_===pr?O=i.DEPTH_COMPONENT24:_===In?O=i.DEPTH_COMPONENT32F:_===fr&&(O=i.DEPTH_COMPONENT16),O}function E(C,_){return p(C)===!0||C.isFramebufferTexture&&C.minFilter!==jt&&C.minFilter!==en?Math.log2(Math.max(_.width,_.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?_.mipmaps.length:1}function P(C){let _=C.target;_.removeEventListener("dispose",P),T(_),_.isVideoTexture&&h.delete(_),_.isHTMLTexture&&u.delete(_)}function y(C){let _=C.target;_.removeEventListener("dispose",y),I(_)}function T(C){let _=n.get(C);if(_.__webglInit===void 0)return;let O=C.source,W=f.get(O);if(W){let $=W[_.__cacheKey];$.usedTimes--,$.usedTimes===0&&R(C),Object.keys(W).length===0&&f.delete(O)}n.remove(C)}function R(C){let _=n.get(C);i.deleteTexture(_.__webglTexture);let O=C.source,W=f.get(O);delete W[_.__cacheKey],a.memory.textures--}function I(C){let _=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let W=0;W<6;W++){if(Array.isArray(_.__webglFramebuffer[W]))for(let $=0;$<_.__webglFramebuffer[W].length;$++)i.deleteFramebuffer(_.__webglFramebuffer[W][$]);else i.deleteFramebuffer(_.__webglFramebuffer[W]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[W])}else{if(Array.isArray(_.__webglFramebuffer))for(let W=0;W<_.__webglFramebuffer.length;W++)i.deleteFramebuffer(_.__webglFramebuffer[W]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let W=0;W<_.__webglColorRenderbuffer.length;W++)_.__webglColorRenderbuffer[W]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[W]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}let O=C.textures;for(let W=0,$=O.length;W<$;W++){let he=n.get(O[W]);he.__webglTexture&&(i.deleteTexture(he.__webglTexture),a.memory.textures--),n.remove(O[W])}n.remove(C)}let z=0;function B(){z=0}function D(){return z}function H(C){z=C}function X(){let C=z;return C>=s.maxTextures&&Ye("WebGLTextures: Trying to use "+(C+1)+" texture units while this GPU supports only "+s.maxTextures),z+=1,C}function F(C){let _=[];return _.push(C.wrapS),_.push(C.wrapT),_.push(C.wrapR||0),_.push(C.magFilter),_.push(C.minFilter),_.push(C.anisotropy),_.push(C.internalFormat),_.push(C.format),_.push(C.type),_.push(C.generateMipmaps),_.push(C.premultiplyAlpha),_.push(C.flipY),_.push(C.unpackAlignment),_.push(C.colorSpace),_.join()}function J(C,_){let O=n.get(C);if(C.isVideoTexture&&k(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&O.__version!==C.version){let W=C.image;if(W===null)Ye("WebGLRenderer: Texture marked for update but no image data found.");else if(W.complete===!1)Ye("WebGLRenderer: Texture marked for update but image is incomplete");else{ve(O,C,_);return}}else C.isExternalTexture&&(O.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+_)}function q(C,_){let O=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&O.__version!==C.version){ve(O,C,_);return}else C.isExternalTexture&&(O.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+_)}function Q(C,_){let O=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&O.__version!==C.version){ve(O,C,_);return}t.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+_)}function ee(C,_){let O=n.get(C);if(C.isCubeDepthTexture!==!0&&C.version>0&&O.__version!==C.version){Ze(O,C,_);return}t.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+_)}let ze={[Ko]:i.REPEAT,[Yn]:i.CLAMP_TO_EDGE,[Qo]:i.MIRRORED_REPEAT},Pe={[jt]:i.NEAREST,[Kp]:i.NEAREST_MIPMAP_NEAREST,[Na]:i.NEAREST_MIPMAP_LINEAR,[en]:i.LINEAR,[kl]:i.LINEAR_MIPMAP_NEAREST,[zi]:i.LINEAR_MIPMAP_LINEAR},pt={[nm]:i.NEVER,[om]:i.ALWAYS,[im]:i.LESS,[xc]:i.LEQUAL,[sm]:i.EQUAL,[_c]:i.GEQUAL,[rm]:i.GREATER,[am]:i.NOTEQUAL};function rt(C,_){if(_.type===In&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===en||_.magFilter===kl||_.magFilter===Na||_.magFilter===zi||_.minFilter===en||_.minFilter===kl||_.minFilter===Na||_.minFilter===zi)&&Ye("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(C,i.TEXTURE_WRAP_S,ze[_.wrapS]),i.texParameteri(C,i.TEXTURE_WRAP_T,ze[_.wrapT]),(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)&&i.texParameteri(C,i.TEXTURE_WRAP_R,ze[_.wrapR]),i.texParameteri(C,i.TEXTURE_MAG_FILTER,Pe[_.magFilter]),i.texParameteri(C,i.TEXTURE_MIN_FILTER,Pe[_.minFilter]),_.compareFunction&&(i.texParameteri(C,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(C,i.TEXTURE_COMPARE_FUNC,pt[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===jt||_.minFilter!==Na&&_.minFilter!==zi||_.type===In&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){let O=e.get("EXT_texture_filter_anisotropic");i.texParameterf(C,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function ct(C,_){let O=!1;C.__webglInit===void 0&&(C.__webglInit=!0,_.addEventListener("dispose",P));let W=_.source,$=f.get(W);$===void 0&&($={},f.set(W,$));let he=F(_);if(he!==C.__cacheKey){$[he]===void 0&&($[he]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,O=!0),$[he].usedTimes++;let de=$[C.__cacheKey];de!==void 0&&($[C.__cacheKey].usedTimes--,de.usedTimes===0&&R(_)),C.__cacheKey=he,C.__webglTexture=$[he].texture}return O}function j(C,_,O){return Math.floor(Math.floor(C/O)/_)}function ne(C,_,O,W){let he=C.updateRanges;if(he.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,_.width,_.height,O,W,_.data);else{he.sort((Oe,_e)=>Oe.start-_e.start);let de=0;for(let Oe=1;Oe<he.length;Oe++){let _e=he[de],me=he[Oe],Fe=_e.start+_e.count,Xe=j(me.start,_.width,4),et=j(_e.start,_.width,4);me.start<=Fe+1&&Xe===et&&j(me.start+me.count-1,_.width,4)===Xe?_e.count=Math.max(_e.count,me.start+me.count-_e.start):(++de,he[de]=me)}he.length=de+1;let Z=t.getParameter(i.UNPACK_ROW_LENGTH),te=t.getParameter(i.UNPACK_SKIP_PIXELS),pe=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,_.width);for(let Oe=0,_e=he.length;Oe<_e;Oe++){let me=he[Oe],Fe=Math.floor(me.start/4),Xe=Math.ceil(me.count/4),et=Fe%_.width,U=Math.floor(Fe/_.width),ge=Xe,K=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,et),t.pixelStorei(i.UNPACK_SKIP_ROWS,U),t.texSubImage2D(i.TEXTURE_2D,0,et,U,ge,K,O,W,_.data)}C.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,Z),t.pixelStorei(i.UNPACK_SKIP_PIXELS,te),t.pixelStorei(i.UNPACK_SKIP_ROWS,pe)}}function ve(C,_,O){let W=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(W=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(W=i.TEXTURE_3D);let $=ct(C,_),he=_.source;t.bindTexture(W,C.__webglTexture,i.TEXTURE0+O);let de=n.get(he);if(he.version!==de.__version||$===!0){if(t.activeTexture(i.TEXTURE0+O),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){let K=st.getPrimaries(st.workingColorSpace),xe=_.colorSpace===gi?null:st.getPrimaries(_.colorSpace),Te=_.colorSpace===gi||K===xe?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Te)}t.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment);let te=g(_.image,!1,s.maxTextureSize);te=gt(_,te);let pe=r.convert(_.format,_.colorSpace),Oe=r.convert(_.type),_e=v(_.internalFormat,pe,Oe,_.normalized,_.colorSpace,_.isVideoTexture);rt(W,_);let me,Fe=_.mipmaps,Xe=_.isVideoTexture!==!0,et=de.__version===void 0||$===!0,U=he.dataReady,ge=E(_,te);if(_.isDepthTexture)_e=w(_.format===Oi,_.type),et&&(Xe?t.texStorage2D(i.TEXTURE_2D,1,_e,te.width,te.height):t.texImage2D(i.TEXTURE_2D,0,_e,te.width,te.height,0,pe,Oe,null));else if(_.isDataTexture)if(Fe.length>0){Xe&&et&&t.texStorage2D(i.TEXTURE_2D,ge,_e,Fe[0].width,Fe[0].height);for(let K=0,xe=Fe.length;K<xe;K++)me=Fe[K],Xe?U&&t.texSubImage2D(i.TEXTURE_2D,K,0,0,me.width,me.height,pe,Oe,me.data):t.texImage2D(i.TEXTURE_2D,K,_e,me.width,me.height,0,pe,Oe,me.data);_.generateMipmaps=!1}else Xe?(et&&t.texStorage2D(i.TEXTURE_2D,ge,_e,te.width,te.height),U&&ne(_,te,pe,Oe)):t.texImage2D(i.TEXTURE_2D,0,_e,te.width,te.height,0,pe,Oe,te.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){Xe&&et&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ge,_e,Fe[0].width,Fe[0].height,te.depth);for(let K=0,xe=Fe.length;K<xe;K++)if(me=Fe[K],_.format!==Ln)if(pe!==null)if(Xe){if(U)if(_.layerUpdates.size>0){let Te=Cu(me.width,me.height,_.format,_.type);for(let re of _.layerUpdates){let Be=me.data.subarray(re*Te/me.data.BYTES_PER_ELEMENT,(re+1)*Te/me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,re,me.width,me.height,1,pe,Be)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,0,me.width,me.height,te.depth,pe,me.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,K,_e,me.width,me.height,te.depth,0,me.data,0,0);else Ye("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Xe?U&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,0,me.width,me.height,te.depth,pe,Oe,me.data):t.texImage3D(i.TEXTURE_2D_ARRAY,K,_e,me.width,me.height,te.depth,0,pe,Oe,me.data);_.layerUpdates.size>0&&_.clearLayerUpdates()}else{Xe&&et&&t.texStorage2D(i.TEXTURE_2D,ge,_e,Fe[0].width,Fe[0].height);for(let K=0,xe=Fe.length;K<xe;K++)me=Fe[K],_.format!==Ln?pe!==null?Xe?U&&t.compressedTexSubImage2D(i.TEXTURE_2D,K,0,0,me.width,me.height,pe,me.data):t.compressedTexImage2D(i.TEXTURE_2D,K,_e,me.width,me.height,0,me.data):Ye("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Xe?U&&t.texSubImage2D(i.TEXTURE_2D,K,0,0,me.width,me.height,pe,Oe,me.data):t.texImage2D(i.TEXTURE_2D,K,_e,me.width,me.height,0,pe,Oe,me.data)}else if(_.isDataArrayTexture)if(Xe){if(et&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ge,_e,te.width,te.height,te.depth),U)if(_.layerUpdates.size>0){let K=Cu(te.width,te.height,_.format,_.type);for(let xe of _.layerUpdates){let Te=te.data.subarray(xe*K/te.data.BYTES_PER_ELEMENT,(xe+1)*K/te.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,xe,te.width,te.height,1,pe,Oe,Te)}_.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,te.width,te.height,te.depth,pe,Oe,te.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,_e,te.width,te.height,te.depth,0,pe,Oe,te.data);else if(_.isData3DTexture)Xe?(et&&t.texStorage3D(i.TEXTURE_3D,ge,_e,te.width,te.height,te.depth),U&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,te.width,te.height,te.depth,pe,Oe,te.data)):t.texImage3D(i.TEXTURE_3D,0,_e,te.width,te.height,te.depth,0,pe,Oe,te.data);else if(_.isFramebufferTexture){if(et)if(Xe)t.texStorage2D(i.TEXTURE_2D,ge,_e,te.width,te.height);else{let K=te.width,xe=te.height;for(let Te=0;Te<ge;Te++)t.texImage2D(i.TEXTURE_2D,Te,_e,K,xe,0,pe,Oe,null),K>>=1,xe>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in i){let K=i.canvas;if(K.hasAttribute("layoutsubtree")||K.setAttribute("layoutsubtree","true"),te.parentNode!==K){K.appendChild(te),u.add(_),K.onpaint=xe=>{let Te=xe.changedElements;for(let re of u)Te.includes(re.image)&&(re.needsUpdate=!0)},K.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,te);else{let Te=i.RGBA,re=i.RGBA,Be=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,Te,re,Be,te)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Fe.length>0){if(Xe&&et){let K=at(Fe[0]);t.texStorage2D(i.TEXTURE_2D,ge,_e,K.width,K.height)}for(let K=0,xe=Fe.length;K<xe;K++)me=Fe[K],Xe?U&&t.texSubImage2D(i.TEXTURE_2D,K,0,0,pe,Oe,me):t.texImage2D(i.TEXTURE_2D,K,_e,pe,Oe,me);_.generateMipmaps=!1}else if(Xe){if(et){let K=at(te);t.texStorage2D(i.TEXTURE_2D,ge,_e,K.width,K.height)}U&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,pe,Oe,te)}else t.texImage2D(i.TEXTURE_2D,0,_e,pe,Oe,te);p(_)&&S(W),de.__version=he.version,_.onUpdate&&_.onUpdate(_)}C.__version=_.version}function Ze(C,_,O){if(_.image.length!==6)return;let W=ct(C,_),$=_.source;t.bindTexture(i.TEXTURE_CUBE_MAP,C.__webglTexture,i.TEXTURE0+O);let he=n.get($);if($.version!==he.__version||W===!0){t.activeTexture(i.TEXTURE0+O);let de=st.getPrimaries(st.workingColorSpace),Z=_.colorSpace===gi?null:st.getPrimaries(_.colorSpace),te=_.colorSpace===gi||de===Z?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,te);let pe=_.isCompressedTexture||_.image[0].isCompressedTexture,Oe=_.image[0]&&_.image[0].isDataTexture,_e=[];for(let re=0;re<6;re++)!pe&&!Oe?_e[re]=g(_.image[re],!0,s.maxCubemapSize):_e[re]=Oe?_.image[re].image:_.image[re],_e[re]=gt(_,_e[re]);let me=_e[0],Fe=r.convert(_.format,_.colorSpace),Xe=r.convert(_.type),et=v(_.internalFormat,Fe,Xe,_.normalized,_.colorSpace),U=_.isVideoTexture!==!0,ge=he.__version===void 0||W===!0,K=$.dataReady,xe=E(_,me);rt(i.TEXTURE_CUBE_MAP,_);let Te;if(pe){U&&ge&&t.texStorage2D(i.TEXTURE_CUBE_MAP,xe,et,me.width,me.height);for(let re=0;re<6;re++){Te=_e[re].mipmaps;for(let Be=0;Be<Te.length;Be++){let De=Te[Be];_.format!==Ln?Fe!==null?U?K&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Be,0,0,De.width,De.height,Fe,De.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Be,et,De.width,De.height,0,De.data):Ye("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):U?K&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Be,0,0,De.width,De.height,Fe,Xe,De.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Be,et,De.width,De.height,0,Fe,Xe,De.data)}}}else{if(Te=_.mipmaps,U&&ge){Te.length>0&&xe++;let re=at(_e[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,xe,et,re.width,re.height)}for(let re=0;re<6;re++)if(Oe){U?K&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,_e[re].width,_e[re].height,Fe,Xe,_e[re].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,et,_e[re].width,_e[re].height,0,Fe,Xe,_e[re].data);for(let Be=0;Be<Te.length;Be++){let Et=Te[Be].image[re].image;U?K&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Be+1,0,0,Et.width,Et.height,Fe,Xe,Et.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Be+1,et,Et.width,Et.height,0,Fe,Xe,Et.data)}}else{U?K&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,Fe,Xe,_e[re]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,et,Fe,Xe,_e[re]);for(let Be=0;Be<Te.length;Be++){let De=Te[Be];U?K&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Be+1,0,0,Fe,Xe,De.image[re]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Be+1,et,Fe,Xe,De.image[re])}}}p(_)&&S(i.TEXTURE_CUBE_MAP),he.__version=$.version,_.onUpdate&&_.onUpdate(_)}C.__version=_.version}function Ee(C,_,O,W,$,he){let de=r.convert(O.format,O.colorSpace),Z=r.convert(O.type),te=v(O.internalFormat,de,Z,O.normalized,O.colorSpace),pe=n.get(_),Oe=n.get(O);if(Oe.__renderTarget=_,!pe.__hasExternalTextures){let _e=Math.max(1,_.width>>he),me=Math.max(1,_.height>>he);$===i.TEXTURE_3D||$===i.TEXTURE_2D_ARRAY?t.texImage3D($,he,te,_e,me,_.depth,0,de,Z,null):t.texImage2D($,he,te,_e,me,0,de,Z,null)}t.bindFramebuffer(i.FRAMEBUFFER,C),Qe(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,W,$,Oe.__webglTexture,0,Je(_)):($===i.TEXTURE_2D||$>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&$<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,W,$,Oe.__webglTexture,he),t.bindFramebuffer(i.FRAMEBUFFER,null)}function je(C,_,O){if(i.bindRenderbuffer(i.RENDERBUFFER,C),_.depthBuffer){let W=_.depthTexture,$=W&&W.isDepthTexture?W.type:null,he=w(_.stencilBuffer,$),de=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;Qe(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Je(_),he,_.width,_.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,Je(_),he,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,he,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,de,i.RENDERBUFFER,C)}else{let W=_.textures;for(let $=0;$<W.length;$++){let he=W[$],de=r.convert(he.format,he.colorSpace),Z=r.convert(he.type),te=v(he.internalFormat,de,Z,he.normalized,he.colorSpace);Qe(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Je(_),te,_.width,_.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,Je(_),te,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,te,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function yt(C,_,O){let W=_.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,C),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let $=n.get(_.depthTexture);if($.__renderTarget=_,(!$.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),W){if($.__webglInit===void 0&&($.__webglInit=!0,_.depthTexture.addEventListener("dispose",P)),$.__webglTexture===void 0){$.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),rt(i.TEXTURE_CUBE_MAP,_.depthTexture);let pe=r.convert(_.depthTexture.format),Oe=r.convert(_.depthTexture.type),_e;_.depthTexture.format===$n?_e=i.DEPTH_COMPONENT24:_.depthTexture.format===Oi&&(_e=i.DEPTH24_STENCIL8);for(let me=0;me<6;me++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,_e,_.width,_.height,0,pe,Oe,null)}}else J(_.depthTexture,0);let he=$.__webglTexture,de=Je(_),Z=W?i.TEXTURE_CUBE_MAP_POSITIVE_X+O:i.TEXTURE_2D,te=_.depthTexture.format===Oi?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(_.depthTexture.format===$n)Qe(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,te,Z,he,0,de):i.framebufferTexture2D(i.FRAMEBUFFER,te,Z,he,0);else if(_.depthTexture.format===Oi)Qe(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,te,Z,he,0,de):i.framebufferTexture2D(i.FRAMEBUFFER,te,Z,he,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ie(C){let _=n.get(C),O=C.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==C.depthTexture){let W=C.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),W){let $=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,W.removeEventListener("dispose",$)};W.addEventListener("dispose",$),_.__depthDisposeCallback=$}_.__boundDepthTexture=W}if(C.depthTexture&&!_.__autoAllocateDepthBuffer)if(O)for(let W=0;W<6;W++)yt(_.__webglFramebuffer[W],C,W);else{let W=C.texture.mipmaps;W&&W.length>0?yt(_.__webglFramebuffer[0],C,0):yt(_.__webglFramebuffer,C,0)}else if(O){_.__webglDepthbuffer=[];for(let W=0;W<6;W++)if(t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[W]),_.__webglDepthbuffer[W]===void 0)_.__webglDepthbuffer[W]=i.createRenderbuffer(),je(_.__webglDepthbuffer[W],C,!1);else{let $=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,he=_.__webglDepthbuffer[W];i.bindRenderbuffer(i.RENDERBUFFER,he),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,he)}}else{let W=C.texture.mipmaps;if(W&&W.length>0?t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),je(_.__webglDepthbuffer,C,!1);else{let $=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,he=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,he),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,he)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function ae(C,_,O){let W=n.get(C);_!==void 0&&Ee(W.__webglFramebuffer,C,C.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&ie(C)}function le(C){let _=C.texture,O=n.get(C),W=n.get(_);C.addEventListener("dispose",y);let $=C.textures,he=C.isWebGLCubeRenderTarget===!0,de=$.length>1;if(de||(W.__webglTexture===void 0&&(W.__webglTexture=i.createTexture()),W.__version=_.version,a.memory.textures++),he){O.__webglFramebuffer=[];for(let Z=0;Z<6;Z++)if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer[Z]=[];for(let te=0;te<_.mipmaps.length;te++)O.__webglFramebuffer[Z][te]=i.createFramebuffer()}else O.__webglFramebuffer[Z]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer=[];for(let Z=0;Z<_.mipmaps.length;Z++)O.__webglFramebuffer[Z]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(de)for(let Z=0,te=$.length;Z<te;Z++){let pe=n.get($[Z]);pe.__webglTexture===void 0&&(pe.__webglTexture=i.createTexture(),a.memory.textures++)}if(C.samples>0&&Qe(C)===!1){O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let Z=0;Z<$.length;Z++){let te=$[Z];O.__webglColorRenderbuffer[Z]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[Z]);let pe=r.convert(te.format,te.colorSpace),Oe=r.convert(te.type),_e=v(te.internalFormat,pe,Oe,te.normalized,te.colorSpace,C.isXRRenderTarget===!0),me=Je(C);i.renderbufferStorageMultisample(i.RENDERBUFFER,me,_e,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Z,i.RENDERBUFFER,O.__webglColorRenderbuffer[Z])}i.bindRenderbuffer(i.RENDERBUFFER,null),C.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),je(O.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(he){t.bindTexture(i.TEXTURE_CUBE_MAP,W.__webglTexture),rt(i.TEXTURE_CUBE_MAP,_);for(let Z=0;Z<6;Z++)if(_.mipmaps&&_.mipmaps.length>0)for(let te=0;te<_.mipmaps.length;te++)Ee(O.__webglFramebuffer[Z][te],C,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,te);else Ee(O.__webglFramebuffer[Z],C,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0);p(_)&&S(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(de){for(let Z=0,te=$.length;Z<te;Z++){let pe=$[Z],Oe=n.get(pe),_e=i.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(_e=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(_e,Oe.__webglTexture),rt(_e,pe),Ee(O.__webglFramebuffer,C,pe,i.COLOR_ATTACHMENT0+Z,_e,0),p(pe)&&S(_e)}t.unbindTexture()}else{let Z=i.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(Z=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Z,W.__webglTexture),rt(Z,_),_.mipmaps&&_.mipmaps.length>0)for(let te=0;te<_.mipmaps.length;te++)Ee(O.__webglFramebuffer[te],C,_,i.COLOR_ATTACHMENT0,Z,te);else Ee(O.__webglFramebuffer,C,_,i.COLOR_ATTACHMENT0,Z,0);p(_)&&S(Z),t.unbindTexture()}C.depthBuffer&&ie(C)}function ce(C){let _=C.textures;for(let O=0,W=_.length;O<W;O++){let $=_[O];if(p($)){let he=A(C),de=n.get($).__webglTexture;t.bindTexture(he,de),S(he),t.unbindTexture()}}}let fe=[],We=[];function He(C){if(C.samples>0){if(Qe(C)===!1){let _=C.textures,O=C.width,W=C.height,$=i.COLOR_BUFFER_BIT,he=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,de=n.get(C),Z=_.length>1;if(Z)for(let pe=0;pe<_.length;pe++)t.bindFramebuffer(i.FRAMEBUFFER,de.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+pe,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,de.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+pe,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,de.__webglMultisampledFramebuffer);let te=C.texture.mipmaps;te&&te.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,de.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,de.__webglFramebuffer);for(let pe=0;pe<_.length;pe++){if(C.resolveDepthBuffer&&(C.depthBuffer&&($|=i.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&($|=i.STENCIL_BUFFER_BIT)),Z){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,de.__webglColorRenderbuffer[pe]);let Oe=n.get(_[pe]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Oe,0)}i.blitFramebuffer(0,0,O,W,0,0,O,W,$,i.NEAREST),l===!0&&(fe.length=0,We.length=0,fe.push(i.COLOR_ATTACHMENT0+pe),C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&(fe.push(he),We.push(he),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,We)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,fe))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Z)for(let pe=0;pe<_.length;pe++){t.bindFramebuffer(i.FRAMEBUFFER,de.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+pe,i.RENDERBUFFER,de.__webglColorRenderbuffer[pe]);let Oe=n.get(_[pe]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,de.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+pe,i.TEXTURE_2D,Oe,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,de.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&l){let _=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function Je(C){return Math.min(s.maxSamples,C.samples)}function Qe(C){let _=n.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function k(C){let _=a.render.frame;h.get(C)!==_&&(h.set(C,_),C.update())}function gt(C,_){let O=C.colorSpace,W=C.format,$=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||O!==Yr&&O!==gi&&(st.getTransfer(O)===dt?(W!==Ln||$!==xn)&&Ye("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):qe("WebGLTextures: Unsupported texture color space:",O)),_}function at(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=X,this.resetTextureUnits=B,this.getTextureUnits=D,this.setTextureUnits=H,this.setTexture2D=J,this.setTexture2DArray=q,this.setTexture3D=Q,this.setTextureCube=ee,this.rebindTextures=ae,this.setupRenderTarget=le,this.updateRenderTargetMipmap=ce,this.updateMultisampleRenderTarget=He,this.setupDepthRenderbuffer=ie,this.setupFrameBufferTexture=Ee,this.useMultisampledRTT=Qe,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function SM(i,e){function t(n,s=gi){let r,a=st.getTransfer(s);if(n===xn)return i.UNSIGNED_BYTE;if(n===Nl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Ul)return i.UNSIGNED_SHORT_5_5_5_1;if(n===_u)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===yu)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===gu)return i.BYTE;if(n===xu)return i.SHORT;if(n===fr)return i.UNSIGNED_SHORT;if(n===Dl)return i.INT;if(n===Vn)return i.UNSIGNED_INT;if(n===In)return i.FLOAT;if(n===nn)return i.HALF_FLOAT;if(n===vu)return i.ALPHA;if(n===bu)return i.RGB;if(n===Ln)return i.RGBA;if(n===$n)return i.DEPTH_COMPONENT;if(n===Oi)return i.DEPTH_STENCIL;if(n===zl)return i.RED;if(n===Ol)return i.RED_INTEGER;if(n===Fi)return i.RG;if(n===Fl)return i.RG_INTEGER;if(n===Bl)return i.RGBA_INTEGER;if(n===Ua||n===za||n===Oa||n===Fa)if(a===dt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Ua)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===za)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Oa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Fa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Ua)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===za)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Oa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Fa)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Hl||n===Vl||n===Gl||n===Wl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Hl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Vl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Gl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Wl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Xl||n===ql||n===Yl||n===$l||n===Zl||n===Ba||n===jl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Xl||n===ql)return a===dt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Yl)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===$l)return r.COMPRESSED_R11_EAC;if(n===Zl)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Ba)return r.COMPRESSED_RG11_EAC;if(n===jl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Jl||n===Kl||n===Ql||n===ec||n===tc||n===nc||n===ic||n===sc||n===rc||n===ac||n===oc||n===lc||n===cc||n===hc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Jl)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Kl)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ql)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===ec)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===tc)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===nc)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ic)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===sc)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===rc)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ac)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===oc)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===lc)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===cc)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===hc)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===uc||n===dc||n===fc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===uc)return a===dt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===dc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===fc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===pc||n===mc||n===Ha||n===gc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===pc)return r.COMPRESSED_RED_RGTC1_EXT;if(n===mc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ha)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===gc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===pr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var TM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,EM=`
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

}`,Yu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new la(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new It({vertexShader:TM,fragmentShader:EM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new $e(new pi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},$u=class extends Zn{constructor(e,t){super();let n=this,s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,m=null,x=typeof XRWebGLBinding<"u",g=new Yu,p={},S=t.getContextAttributes(),A=null,v=null,w=[],E=[],P=new se,y=null,T=null,R=new Qt;R.viewport=new Dt;let I=new Qt;I.viewport=new Dt;let z=[R,I],B=new Cl,D=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let ne=w[j];return ne===void 0&&(ne=new tr,w[j]=ne),ne.getTargetRaySpace()},this.getControllerGrip=function(j){let ne=w[j];return ne===void 0&&(ne=new tr,w[j]=ne),ne.getGripSpace()},this.getHand=function(j){let ne=w[j];return ne===void 0&&(ne=new tr,w[j]=ne),ne.getHandSpace()};function X(j){let ne=E.indexOf(j.inputSource);if(ne===-1)return;let ve=w[ne];ve!==void 0&&(ve.update(j.inputSource,j.frame,c||a),ve.dispatchEvent({type:j.type,data:j.inputSource}))}function F(){s.removeEventListener("select",X),s.removeEventListener("selectstart",X),s.removeEventListener("selectend",X),s.removeEventListener("squeeze",X),s.removeEventListener("squeezestart",X),s.removeEventListener("squeezeend",X),s.removeEventListener("end",F),s.removeEventListener("inputsourceschange",J);for(let j=0;j<w.length;j++){let ne=E[j];ne!==null&&(E[j]=null,w[j].disconnect(ne))}D=null,H=null,g.reset();for(let j in p)delete p[j];if(e.setRenderTarget(A),f=null,d=null,u=null,s=null,v=null,ct.stop(),n.isPresenting=!1,e.setPixelRatio(y),e.setSize(P.width,P.height,!1),T!==null){let j=T.camera;j.fov=T.fov,j.zoom=T.zoom,j.updateProjectionMatrix(),T=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){r=j,n.isPresenting===!0&&Ye("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){o=j,n.isPresenting===!0&&Ye("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(j){c=j},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(j){if(s=j,s!==null){if(A=e.getRenderTarget(),s.addEventListener("select",X),s.addEventListener("selectstart",X),s.addEventListener("selectend",X),s.addEventListener("squeeze",X),s.addEventListener("squeezestart",X),s.addEventListener("squeezeend",X),s.addEventListener("end",F),s.addEventListener("inputsourceschange",J),S.xrCompatible!==!0&&await t.makeXRCompatible(),y=e.getPixelRatio(),e.getSize(P),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let ve=null,Ze=null,Ee=null;S.depth&&(Ee=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ve=S.stencil?Oi:$n,Ze=S.stencil?pr:Vn);let je={colorFormat:t.RGBA8,depthFormat:Ee,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(je),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),v=new Wt(d.textureWidth,d.textureHeight,{format:Ln,type:xn,depthTexture:new Ci(d.textureWidth,d.textureHeight,Ze,void 0,void 0,void 0,void 0,void 0,void 0,ve),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let ve={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,ve),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new Wt(f.framebufferWidth,f.framebufferHeight,{format:Ln,type:xn,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),ct.setContext(s),ct.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function J(j){for(let ne=0;ne<j.removed.length;ne++){let ve=j.removed[ne],Ze=E.indexOf(ve);Ze>=0&&(E[Ze]=null,w[Ze].disconnect(ve))}for(let ne=0;ne<j.added.length;ne++){let ve=j.added[ne],Ze=E.indexOf(ve);if(Ze===-1){for(let je=0;je<w.length;je++)if(je>=E.length){E.push(ve),Ze=je;break}else if(E[je]===null){E[je]=ve,Ze=je;break}if(Ze===-1)break}let Ee=w[Ze];Ee&&Ee.connect(ve)}}let q=new L,Q=new L;function ee(j,ne,ve){q.setFromMatrixPosition(ne.matrixWorld),Q.setFromMatrixPosition(ve.matrixWorld);let Ze=q.distanceTo(Q),Ee=ne.projectionMatrix.elements,je=ve.projectionMatrix.elements,yt=Ee[14]/(Ee[10]-1),ie=Ee[14]/(Ee[10]+1),ae=(Ee[9]+1)/Ee[5],le=(Ee[9]-1)/Ee[5],ce=(Ee[8]-1)/Ee[0],fe=(je[8]+1)/je[0],We=yt*ce,He=yt*fe,Je=Ze/(-ce+fe),Qe=Je*-ce;if(ne.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(Qe),j.translateZ(Je),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),Ee[10]===-1)j.projectionMatrix.copy(ne.projectionMatrix),j.projectionMatrixInverse.copy(ne.projectionMatrixInverse);else{let k=yt+Je,gt=ie+Je,at=We-Qe,C=He+(Ze-Qe),_=ae*ie/gt*k,O=le*ie/gt*k;j.projectionMatrix.makePerspective(at,C,_,O,k,gt),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function ze(j,ne){ne===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(ne.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(s===null)return;let ne=j.near,ve=j.far;g.texture!==null&&(g.depthNear>0&&(ne=g.depthNear),g.depthFar>0&&(ve=g.depthFar)),B.near=I.near=R.near=ne,B.far=I.far=R.far=ve,(D!==B.near||H!==B.far)&&(s.updateRenderState({depthNear:B.near,depthFar:B.far}),D=B.near,H=B.far),B.layers.mask=j.layers.mask|6,R.layers.mask=B.layers.mask&-5,I.layers.mask=B.layers.mask&-3;let Ze=j.parent,Ee=B.cameras;ze(B,Ze);for(let je=0;je<Ee.length;je++)ze(Ee[je],Ze);Ee.length===2?ee(B,R,I):B.projectionMatrix.copy(R.projectionMatrix),T===null&&j.isPerspectiveCamera&&(T={camera:j,fov:j.fov,zoom:j.zoom}),Pe(j,B,Ze)};function Pe(j,ne,ve){ve===null?j.matrix.copy(ne.matrixWorld):(j.matrix.copy(ve.matrixWorld),j.matrix.invert(),j.matrix.multiply(ne.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(ne.projectionMatrix),j.projectionMatrixInverse.copy(ne.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=tl*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return B},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(j){l=j,d!==null&&(d.fixedFoveation=j),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=j)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(B)},this.getCameraTexture=function(j){return p[j]};let pt=null;function rt(j,ne){if(h=ne.getViewerPose(c||a),m=ne,h!==null){let ve=h.views;f!==null&&(e.setRenderTargetFramebuffer(v,f.framebuffer),e.setRenderTarget(v));let Ze=!1;ve.length!==B.cameras.length&&(B.cameras.length=0,Ze=!0);for(let ie=0;ie<ve.length;ie++){let ae=ve[ie],le=null;if(f!==null)le=f.getViewport(ae);else{let fe=u.getViewSubImage(d,ae);le=fe.viewport,ie===0&&(e.setRenderTargetTextures(v,fe.colorTexture,fe.depthStencilTexture),e.setRenderTarget(v))}let ce=z[ie];ce===void 0&&(ce=new Qt,ce.layers.enable(ie),ce.viewport=new Dt,z[ie]=ce),ce.matrix.fromArray(ae.transform.matrix),ce.matrix.decompose(ce.position,ce.quaternion,ce.scale),ce.projectionMatrix.fromArray(ae.projectionMatrix),ce.projectionMatrixInverse.copy(ce.projectionMatrix).invert(),ce.viewport.set(le.x,le.y,le.width,le.height),ie===0&&(B.matrix.copy(ce.matrix),B.matrix.decompose(B.position,B.quaternion,B.scale)),Ze===!0&&B.cameras.push(ce)}let Ee=s.enabledFeatures;if(Ee&&Ee.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){u=n.getBinding();let ie=u.getDepthInformation(ve[0]);ie&&ie.isValid&&ie.texture&&g.init(ie,s.renderState)}if(Ee&&Ee.includes("camera-access")&&x){e.state.unbindTexture(),u=n.getBinding();for(let ie=0;ie<ve.length;ie++){let ae=ve[ie].camera;if(ae){let le=p[ae];le||(le=new la,p[ae]=le);let ce=u.getCameraImage(ae);le.sourceTexture=ce}}}}for(let ve=0;ve<w.length;ve++){let Ze=E[ve],Ee=w[ve];Ze!==null&&Ee!==void 0&&Ee.update(Ze,ne,c||a)}pt&&pt(j,ne),ne.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ne}),m=null}let ct=new Hm;ct.setAnimationLoop(rt),this.setAnimationLoop=function(j){pt=j},this.dispose=function(){}}},wM=new mt,Ym=new Ke;Ym.set(-1,0,0,0,1,0,0,0,1);function AM(i,e){function t(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,Eu(i)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,S,A,v){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(g,p):p.isMeshLambertMaterial?(r(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(g,p),u(g,p)):p.isMeshPhongMaterial?(r(g,p),h(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(g,p),d(g,p),p.isMeshPhysicalMaterial&&f(g,p,v)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),x(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(a(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?l(g,p,S,A):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,t(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===tn&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,t(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===tn&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,t(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,t(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);let S=e.get(p),A=S.envMap,v=S.envMapRotation;A&&(g.envMap.value=A,g.envMapRotation.value.setFromMatrix4(wM.makeRotationFromEuler(v)).transpose(),A.isCubeTexture&&A.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(Ym),g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,g.aoMapTransform))}function a(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,S,A){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*S,g.scale.value=A*.5,p.map&&(g.map.value=p.map,t(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,S){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===tn&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.retroreflectivity>0&&(g.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=S.texture,g.transmissionSamplerSize.value.set(S.width,S.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function x(g,p){let S=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(S.matrixWorld),g.nearDistance.value=S.shadow.camera.near,g.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function CM(i,e,t,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,w){let E=w.program;n.uniformBlockBinding(v,E)}function c(v,w){let E=s[v.id];E===void 0&&(g(v),E=h(v),s[v.id]=E,v.addEventListener("dispose",S));let P=w.program;n.updateUBOMapping(v,P);let y=e.render.frame;r[v.id]!==y&&(d(v),r[v.id]=y)}function h(v){let w=u();v.__bindingPointIndex=w;let E=i.createBuffer(),P=v.__size,y=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,E),i.bufferData(i.UNIFORM_BUFFER,P,y),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,w,E),E}function u(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return qe("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(v){let w=s[v.id],E=v.uniforms,P=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,w);for(let y=0,T=E.length;y<T;y++){let R=E[y];if(Array.isArray(R))for(let I=0,z=R.length;I<z;I++)f(R[I],y,I,P);else f(R,y,0,P)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(v,w,E,P){if(x(v,w,E,P)===!0){let y=v.__offset,T=v.value;if(Array.isArray(T)){let R=0;for(let I=0;I<T.length;I++){let z=T[I],B=p(z);m(z,v.__data,R),typeof z!="number"&&typeof z!="boolean"&&!z.isMatrix3&&!ArrayBuffer.isView(z)&&(R+=B.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(T,v.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,y,v.__data)}}function m(v,w,E){typeof v=="number"||typeof v=="boolean"?w[0]=v:v.isMatrix3?(w[0]=v.elements[0],w[1]=v.elements[1],w[2]=v.elements[2],w[3]=0,w[4]=v.elements[3],w[5]=v.elements[4],w[6]=v.elements[5],w[7]=0,w[8]=v.elements[6],w[9]=v.elements[7],w[10]=v.elements[8],w[11]=0):ArrayBuffer.isView(v)?w.set(new v.constructor(v.buffer,v.byteOffset,w.length)):v.toArray(w,E)}function x(v,w,E,P){let y=v.value,T=w+"_"+E;if(P[T]===void 0)return typeof y=="number"||typeof y=="boolean"?P[T]=y:ArrayBuffer.isView(y)?P[T]=y.slice():P[T]=y.clone(),!0;{let R=P[T];if(typeof y=="number"||typeof y=="boolean"){if(R!==y)return P[T]=y,!0}else{if(ArrayBuffer.isView(y))return!0;if(R.equals(y)===!1)return R.copy(y),!0}}return!1}function g(v){let w=v.uniforms,E=0,P=16;for(let T=0,R=w.length;T<R;T++){let I=Array.isArray(w[T])?w[T]:[w[T]];for(let z=0,B=I.length;z<B;z++){let D=I[z],H=Array.isArray(D.value)?D.value:[D.value];for(let X=0,F=H.length;X<F;X++){let J=H[X],q=p(J),Q=E%P,ee=Q%q.boundary,ze=Q+ee;E+=ee,ze!==0&&P-ze<q.storage&&(E+=P-ze),D.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),D.__offset=E,E+=q.storage}}}let y=E%P;return y>0&&(E+=P-y),v.__size=E,v.__cache={},this}function p(v){let w={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(w.boundary=4,w.storage=4):v.isVector2?(w.boundary=8,w.storage=8):v.isVector3||v.isColor?(w.boundary=16,w.storage=12):v.isVector4?(w.boundary=16,w.storage=16):v.isMatrix3?(w.boundary=48,w.storage=48):v.isMatrix4?(w.boundary=64,w.storage=64):v.isTexture?Ye("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(w.boundary=16,w.storage=v.byteLength):Ye("WebGLRenderer: Unsupported uniform value type.",v),w}function S(v){let w=v.target;w.removeEventListener("dispose",S);let E=a.indexOf(w.__bindingPointIndex);a.splice(E,1),i.deleteBuffer(s[w.id]),delete s[w.id],delete r[w.id]}function A(){for(let v in s)i.deleteBuffer(s[v]);a=[],s={},r={}}return{bind:l,update:c,dispose:A}}var RM=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),ti=null;function PM(){return ti===null&&(ti=new na(RM,16,16,Fi,nn),ti.name="DFG_LUT",ti.minFilter=en,ti.magFilter=en,ti.wrapS=Yn,ti.wrapT=Yn,ti.generateMipmaps=!1,ti.needsUpdate=!0),ti}var Mc=class{constructor(e={}){let{canvas:t=lm(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=xn}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=a;let x=f,g=new Set([Bl,Fl,Ol]),p=new Set([xn,Vn,fr,pr,Nl,Ul]),S=new Uint32Array(4),A=new Int32Array(4),v=new L,w=null,E=null,P=[],y=[],T=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Hn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let R=this,I=!1,z=null,B=null,D=null,H=null;this._outputColorSpace=Gt;let X=0,F=0,J=null,q=-1,Q=null,ee=new Dt,ze=new Dt,Pe=null,pt=new we(0),rt=0,ct=t.width,j=t.height,ne=1,ve=null,Ze=null,Ee=new Dt(0,0,ct,j),je=new Dt(0,0,ct,j),yt=!1,ie=new nr,ae=!1,le=!1,ce=new mt,fe=new L,We=new Dt,He={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Je=!1;function Qe(){return J===null?ne:1}let k=n;function gt(b,N){return t.getContext(b,N)}let at,C,_,O,W,$,he,de,Z,te,pe,Oe,_e,me,Fe,Xe,et,U,ge,K,xe,Te,re;try{let b={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"186"}`),t.addEventListener("webglcontextlost",Et,!1),t.addEventListener("webglcontextrestored",xt,!1),t.addEventListener("webglcontextcreationerror",Nn,!1),k===null){let N="webgl2";if(k=gt(N,b),k===null)throw gt(N)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Be()}catch(b){throw t.removeEventListener("webglcontextlost",Et,!1),t.removeEventListener("webglcontextrestored",xt,!1),t.removeEventListener("webglcontextcreationerror",Nn,!1),qe("WebGLRenderer: "+b.message),b}function Be(){at=new zv(k),at.init(),xe=new SM(k,at),C=new Av(k,at,e,xe),_=new bM(k,at),C.reversedDepthBuffer&&d&&_.buffers.depth.setReversed(!0),B=k.createFramebuffer(),D=k.createFramebuffer(),H=k.createFramebuffer(),O=new Bv(k),W=new oM,$=new MM(k,at,_,W,C,xe,O),he=new Uv(R),de=new Vx(k),Te=new Ev(k,de),Z=new Ov(k,de,O,Te),te=new Vv(k,Z,de,Te,O),U=new Hv(k,C,$),Fe=new Cv(W),pe=new aM(R,he,at,C,Te,Fe),Oe=new AM(R,W),_e=new cM,me=new mM(at),et=new Tv(R,he,_,te,m,l),Xe=new vM(R,te,C),re=new CM(k,O,C,_),ge=new wv(k,at,O),K=new Fv(k,at,O),O.programs=pe.programs,R.capabilities=C,R.extensions=at,R.properties=W,R.renderLists=_e,R.shadowMap=Xe,R.state=_,R.info=O}x!==xn&&(T=new Wv(x,t.width,t.height,o,s,r));let De=new $u(R,k);this.xr=De,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){let b=at.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){let b=at.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return ne},this.setPixelRatio=function(b){b!==void 0&&(ne=b,this.setSize(ct,j,!1))},this.getSize=function(b){return b.set(ct,j)},this.setSize=function(b,N,Y=!0){if(De.isPresenting){Ye("WebGLRenderer: Can't change size while VR device is presenting.");return}ct=b,j=N,t.width=Math.floor(b*ne),t.height=Math.floor(N*ne),Y===!0&&(t.style.width=b+"px",t.style.height=N+"px"),T!==null&&T.setSize(t.width,t.height),this.setViewport(0,0,b,N)},this.getDrawingBufferSize=function(b){return b.set(ct*ne,j*ne).floor()},this.setDrawingBufferSize=function(b,N,Y){ct=b,j=N,ne=Y,t.width=Math.floor(b*Y),t.height=Math.floor(N*Y),this.setViewport(0,0,b,N)},this.setEffects=function(b){if(x===xn){qe("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let N=0;N<b.length;N++)if(b[N].isOutputPass===!0){Ye("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}T.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy(ee)},this.getViewport=function(b){return b.copy(Ee)},this.setViewport=function(b,N,Y,V){b.isVector4?Ee.set(b.x,b.y,b.z,b.w):Ee.set(b,N,Y,V),_.viewport(ee.copy(Ee).multiplyScalar(ne).round())},this.getScissor=function(b){return b.copy(je)},this.setScissor=function(b,N,Y,V){b.isVector4?je.set(b.x,b.y,b.z,b.w):je.set(b,N,Y,V),_.scissor(ze.copy(je).multiplyScalar(ne).round())},this.getScissorTest=function(){return yt},this.setScissorTest=function(b){_.setScissorTest(yt=b)},this.setOpaqueSort=function(b){ve=b},this.setTransparentSort=function(b){Ze=b},this.getClearColor=function(b){return b.copy(et.getClearColor())},this.setClearColor=function(){et.setClearColor(...arguments)},this.getClearAlpha=function(){return et.getClearAlpha()},this.setClearAlpha=function(){et.setClearAlpha(...arguments)},this.clear=function(b=!0,N=!0,Y=!0){let V=0;if(b){let G=!1;if(J!==null){let Me=J.texture.format;G=g.has(Me)}if(G){let Me=J.texture.type,Ce=p.has(Me),be=et.getClearColor(),Le=et.getClearAlpha(),Ue=be.r,tt=be.g,ot=be.b;Ce?(S[0]=Ue,S[1]=tt,S[2]=ot,S[3]=Le,k.clearBufferuiv(k.COLOR,0,S)):(A[0]=Ue,A[1]=tt,A[2]=ot,A[3]=Le,k.clearBufferiv(k.COLOR,0,A))}else V|=k.COLOR_BUFFER_BIT}N&&(V|=k.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Y&&(V|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V!==0&&k.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(b){b.setRenderer(this),z=b},this.dispose=function(){t.removeEventListener("webglcontextlost",Et,!1),t.removeEventListener("webglcontextrestored",xt,!1),t.removeEventListener("webglcontextcreationerror",Nn,!1),et.dispose(),_e.dispose(),me.dispose(),W.dispose(),he.dispose(),te.dispose(),Te.dispose(),re.dispose(),pe.dispose(),De.dispose(),De.removeEventListener("sessionstart",Rf),De.removeEventListener("sessionend",Pf),$i.stop()};function Et(b){b.preventDefault(),jr("WebGLRenderer: Context Lost."),I=!0}function xt(){jr("WebGLRenderer: Context Restored."),I=!1;let b=O.autoReset,N=Xe.enabled,Y=Xe.autoUpdate,V=Xe.needsUpdate,G=Xe.type;Be(),O.autoReset=b,Xe.enabled=N,Xe.autoUpdate=Y,Xe.needsUpdate=V,Xe.type=G}function Nn(b){qe("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function Gn(b){let N=b.target;N.removeEventListener("dispose",Gn),lg(N)}function lg(b){cg(b),W.remove(b)}function cg(b){let N=W.get(b).programs;N!==void 0&&(N.forEach(function(Y){pe.releaseProgram(Y)}),b.isShaderMaterial&&pe.releaseShaderCache(b))}this.renderBufferDirect=function(b,N,Y,V,G,Me){N===null&&(N=He);let Ce=G.isMesh&&G.matrixWorld.determinantAffine()<0,be=dg(b,N,Y,V,G);_.setMaterial(V,Ce);let Le=Y.index,Ue=1;if(V.wireframe===!0){if(Le=Z.getWireframeAttribute(Y),Le===void 0)return;Ue=2}let tt=Y.drawRange,ot=Y.attributes.position,ke=tt.start*Ue,_t=(tt.start+tt.count)*Ue;Me!==null&&(ke=Math.max(ke,Me.start*Ue),_t=Math.min(_t,(Me.start+Me.count)*Ue)),Le!==null?(ke=Math.max(ke,0),_t=Math.min(_t,Le.count)):ot!=null&&(ke=Math.max(ke,0),_t=Math.min(_t,ot.count));let Ft=_t-ke;if(Ft<0||Ft===1/0)return;Te.setup(G,V,be,Y,Le);let At,St=ge;if(Le!==null&&(At=de.get(Le),St=K,St.setIndex(At)),G.isMesh)V.wireframe===!0?(_.setLineWidth(V.wireframeLinewidth*Qe()),St.setMode(k.LINES)):St.setMode(k.TRIANGLES);else if(G.isLine){let sn=V.linewidth;sn===void 0&&(sn=1),_.setLineWidth(sn*Qe()),G.isLineSegments?St.setMode(k.LINES):G.isLineLoop?St.setMode(k.LINE_LOOP):St.setMode(k.LINE_STRIP)}else G.isPoints?St.setMode(k.POINTS):G.isSprite&&St.setMode(k.TRIANGLES);if(G.isBatchedMesh)if(at.get("WEBGL_multi_draw"))St.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{let sn=G._multiDrawStarts,Ae=G._multiDrawCounts,un=G._multiDrawCount,ht=Le?de.get(Le).bytesPerElement:1,wn=W.get(V).currentProgram.getUniforms();for(let Wn=0;Wn<un;Wn++)wn.setValue(k,"_gl_DrawID",Wn),St.render(sn[Wn]/ht,Ae[Wn])}else if(G.isInstancedMesh)St.renderInstances(ke,Ft,G.count);else if(Y.isInstancedBufferGeometry){let sn=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,Ae=Math.min(Y.instanceCount,sn);St.renderInstances(ke,Ft,Ae)}else St.render(ke,Ft)};function Cf(b,N,Y,V){z!==null&&b.isNodeMaterial&&z.setObject(V,b),ae===!0&&Fe.setState(b,Y,!1),b.transparent===!0&&b.side===Nt&&b.forceSinglePass===!1?(b.side=tn,b.needsUpdate=!0,ho(b,N,V),b.side=Ni,b.needsUpdate=!0,ho(b,N,V),b.side=Nt):ho(b,N,V)}this.compile=function(b,N,Y=null){Y===null&&(Y=b),z!==null&&z.renderStart(b,N,Y),E=me.get(Y),E.init(N),y.push(E),Y.traverseVisible(function(G){G.isLight&&G.layers.test(N.layers)&&(E.pushLight(G),G.castShadow&&E.pushShadow(G))}),b!==Y&&b.traverseVisible(function(G){G.isLight&&G.layers.test(N.layers)&&(E.pushLight(G),G.castShadow&&E.pushShadow(G))}),E.setupLights(),z!==null&&z.updateLights(E.state.lightsArray),le=this.localClippingEnabled,ae=Fe.init(this.clippingPlanes,le),ae===!0&&Fe.setGlobalState(this.clippingPlanes,N),z!==null&&Xe.render(E.state.shadowsArray,Y,N);let V=new Set;return b.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;let Me=G.material;if(Me)if(Array.isArray(Me))for(let Ce=0;Ce<Me.length;Ce++){let be=Me[Ce];Cf(be,Y,N,G),V.add(be)}else Cf(Me,Y,N,G),V.add(Me)}),E=y.pop(),z!==null&&z.renderEnd(),V},this.compileAsync=function(b,N,Y=null){let V=this.compile(b,N,Y);return new Promise(G=>{function Me(){if(V.forEach(function(Ce){let Le=W.get(Ce).currentProgram;(Le===void 0||Le.isReady())&&V.delete(Ce)}),V.size===0){G(b);return}setTimeout(Me,10)}at.get("KHR_parallel_shader_compile")!==null?Me():setTimeout(Me,10)})};let _h=null;function hg(b){_h&&_h(b)}function Rf(){$i.stop()}function Pf(){$i.start()}let $i=new Hm;$i.setAnimationLoop(hg),typeof self<"u"&&$i.setContext(self),this.setAnimationLoop=function(b){_h=b,De.setAnimationLoop(b),b===null?$i.stop():$i.start()},De.addEventListener("sessionstart",Rf),De.addEventListener("sessionend",Pf),this.render=function(b,N){if(N!==void 0&&N.isCamera!==!0){qe("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;z!==null&&z.renderStart(b,N);let Y=De.enabled===!0&&De.isPresenting===!0,V=T!==null&&(J===null||Y)&&T.begin(R,J);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),De.enabled===!0&&De.isPresenting===!0&&(T===null||T.isCompositing()===!1)&&(De.cameraAutoUpdate===!0&&De.updateCamera(N),N=De.getCamera()),b.isScene===!0&&b.onBeforeRender(R,b,N,J),E=me.get(b,y.length),E.init(N),E.state.textureUnits=$.getTextureUnits(),y.push(E),ce.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),ie.setFromProjectionMatrix(ce,Bn,N.reversedDepth),le=this.localClippingEnabled,ae=Fe.init(this.clippingPlanes,le),w=_e.get(b,P.length),w.init(),P.push(w),De.enabled===!0&&De.isPresenting===!0){let Ce=R.xr.getDepthSensingMesh();Ce!==null&&yh(Ce,N,-1/0,R.sortObjects)}yh(b,N,0,R.sortObjects),w.finish(),z!==null&&z.updateLights(E.state.lightsArray),R.sortObjects===!0&&w.sort(ve,Ze),Je=De.enabled===!1||De.isPresenting===!1||De.hasDepthSensing()===!1,Je&&et.addToRenderList(w,b),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ae===!0&&Fe.beginShadows();let G=E.state.shadowsArray;if(Xe.render(G,b,N),ae===!0&&Fe.endShadows(),(V&&T.hasRenderPass())===!1){let Ce=w.opaque,be=w.transmissive;if(E.setupLights(),N.isArrayCamera){let Le=N.cameras;if(be.length>0)for(let Ue=0,tt=Le.length;Ue<tt;Ue++){let ot=Le[Ue];Lf(Ce,be,b,ot)}Je&&et.render(b);for(let Ue=0,tt=Le.length;Ue<tt;Ue++){let ot=Le[Ue];If(w,b,ot,ot.viewport)}}else be.length>0&&Lf(Ce,be,b,N),Je&&et.render(b),If(w,b,N)}J!==null&&F===0&&($.updateMultisampleRenderTarget(J),$.updateRenderTargetMipmap(J)),V&&T.end(R),b.isScene===!0&&b.onAfterRender(R,b,N),Te.resetDefaultState(),q=-1,Q=null,y.pop(),y.length>0?(E=y[y.length-1],$.setTextureUnits(E.state.textureUnits),ae===!0&&Fe.setGlobalState(R.clippingPlanes,E.state.camera)):E=null,P.pop(),P.length>0?w=P[P.length-1]:w=null,z!==null&&z.renderEnd()};function yh(b,N,Y,V){if(b.visible===!1)return;if(b.layers.test(N.layers)){if(b.isGroup)Y=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(N);else if(b.isLightProbeGrid)E.pushLightProbeGrid(b);else if(b.isLight)E.pushLight(b),b.castShadow&&E.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||b.intersectsFrustum(ie)){V&&We.setFromMatrixPosition(b.matrixWorld).applyMatrix4(ce);let Ce=te.update(b),be=b.material;be.visible&&w.push(b,Ce,be,Y,We.z,null,N)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||b.intersectsFrustum(ie))){let Ce=te.update(b),be=b.material;if(V&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),We.copy(b.boundingSphere.center)):(Ce.boundingSphere===null&&Ce.computeBoundingSphere(),We.copy(Ce.boundingSphere.center)),We.applyMatrix4(b.matrixWorld).applyMatrix4(ce)),Array.isArray(be)){let Le=Ce.groups;for(let Ue=0,tt=Le.length;Ue<tt;Ue++){let ot=Le[Ue],ke=be[ot.materialIndex];ke&&ke.visible&&w.push(b,Ce,ke,Y,We.z,ot,N)}}else be.visible&&w.push(b,Ce,be,Y,We.z,null,N)}}let Me=b.children;for(let Ce=0,be=Me.length;Ce<be;Ce++)yh(Me[Ce],N,Y,V)}function If(b,N,Y,V){let{opaque:G,transmissive:Me,transparent:Ce}=b;E.setupLightsView(Y),ae===!0&&Fe.setGlobalState(R.clippingPlanes,Y),V&&_.viewport(ee.copy(V)),G.length>0&&co(G,N,Y),Me.length>0&&co(Me,N,Y),Ce.length>0&&co(Ce,N,Y),_.buffers.depth.setTest(!0),_.buffers.depth.setMask(!0),_.buffers.color.setMask(!0),_.setPolygonOffset(!1)}function Lf(b,N,Y,V){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[V.id]===void 0){let ke=at.has("EXT_color_buffer_half_float")||at.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[V.id]=new Wt(1,1,{generateMipmaps:!0,type:ke?nn:xn,minFilter:zi,samples:Math.max(4,C.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:st.workingColorSpace})}let Me=E.state.transmissionRenderTarget[V.id],Ce=V.viewport||ee;Me.setSize(Ce.z*R.transmissionResolutionScale,Ce.w*R.transmissionResolutionScale);let be=R.getRenderTarget(),Le=R.getActiveCubeFace(),Ue=R.getActiveMipmapLevel();R.setRenderTarget(Me),R.getClearColor(pt),rt=R.getClearAlpha(),rt<1&&R.setClearColor(16777215,.5),R.clear(),Je&&et.render(Y);let tt=R.toneMapping;R.toneMapping=Hn;let ot=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),E.setupLightsView(V),ae===!0&&Fe.setGlobalState(R.clippingPlanes,V),co(b,Y,V),$.updateMultisampleRenderTarget(Me),$.updateRenderTargetMipmap(Me),at.has("WEBGL_multisampled_render_to_texture")===!1){let ke=!1;for(let _t=0,Ft=N.length;_t<Ft;_t++){let At=N[_t],{object:St,geometry:sn,material:Ae,group:un}=At;if(Ae.side===Nt&&St.layers.test(V.layers)){let ht=Ae.side;Ae.side=tn,Ae.needsUpdate=!0,kf(St,Y,V,sn,Ae,un),Ae.side=ht,Ae.needsUpdate=!0,ke=!0}}ke===!0&&($.updateMultisampleRenderTarget(Me),$.updateRenderTargetMipmap(Me))}R.setRenderTarget(be,Le,Ue),R.setClearColor(pt,rt),ot!==void 0&&(V.viewport=ot),R.toneMapping=tt}function co(b,N,Y){let V=N.isScene===!0?N.overrideMaterial:null;for(let G=0,Me=b.length;G<Me;G++){let Ce=b[G],{object:be,geometry:Le,group:Ue}=Ce,tt=Ce.material;tt.allowOverride===!0&&V!==null&&(tt=V),be.layers.test(Y.layers)&&kf(be,N,Y,Le,tt,Ue)}}function kf(b,N,Y,V,G,Me){z!==null&&G.isNodeMaterial&&z.setObject(b,G),b.onBeforeRender(R,N,Y,V,G,Me),b.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),G.onBeforeRender(R,N,Y,V,b,Me),G.transparent===!0&&G.side===Nt&&G.forceSinglePass===!1?(G.side=tn,G.needsUpdate=!0,R.renderBufferDirect(Y,N,V,G,b,Me),G.side=Ni,G.needsUpdate=!0,R.renderBufferDirect(Y,N,V,G,b,Me),G.side=Nt):R.renderBufferDirect(Y,N,V,G,b,Me),b.onAfterRender(R,N,Y,V,G,Me)}function ho(b,N,Y){N.isScene!==!0&&(N=He);let V=W.get(b),G=E.state.lights,Me=E.state.shadowsArray,Ce=G.state.version,be=pe.getParameters(b,G.state,Me,N,Y,E.state.lightProbeGridArray),Le=pe.getProgramCacheKey(be),Ue=V.programs;V.environment=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?N.environment:null,V.fog=N.fog;let tt=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap;V.envMap=he.get(b.envMap||V.environment,tt),V.envMapRotation=V.environment!==null&&b.envMap===null?N.environmentRotation:b.envMapRotation,Ue===void 0&&(b.addEventListener("dispose",Gn),Ue=new Map,V.programs=Ue);let ot=Ue.get(Le);if(ot!==void 0){if(V.currentProgram===ot&&V.lightsStateVersion===Ce)return Nf(b,be),ot}else be.uniforms=pe.getUniforms(b),z!==null&&b.isNodeMaterial&&z.build(b,Y,be),b.onBeforeCompile(be,R),ot=pe.acquireProgram(be,Le),Ue.set(Le,ot),V.uniforms=be.uniforms;let ke=V.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(ke.clippingPlanes=Fe.uniform),Nf(b,be),V.needsLights=pg(b),V.lightsStateVersion=Ce,V.needsLights&&(ke.ambientLightColor.value=G.state.ambient,ke.lightProbe.value=G.state.probe,ke.sunLights.value=G.state.sun,ke.sunLightShadows.value=G.state.sunShadow,ke.directionalLights.value=G.state.directional,ke.directionalLightShadows.value=G.state.directionalShadow,ke.spotLights.value=G.state.spot,ke.spotLightShadows.value=G.state.spotShadow,ke.rectAreaLights.value=G.state.rectArea,ke.ltc_1.value=G.state.rectAreaLTC1,ke.ltc_2.value=G.state.rectAreaLTC2,ke.pointLights.value=G.state.point,ke.pointLightShadows.value=G.state.pointShadow,ke.hemisphereLights.value=G.state.hemi,ke.sunShadowMatrix.value=G.state.sunShadowMatrix,ke.sunShadowCascade.value=G.state.sunShadowCascade,ke.directionalShadowMatrix.value=G.state.directionalShadowMatrix,ke.spotLightMatrix.value=G.state.spotLightMatrix,ke.spotLightMap.value=G.state.spotLightMap,ke.pointShadowMatrix.value=G.state.pointShadowMatrix),V.lightProbeGrid=E.state.lightProbeGridArray.length>0,V.currentProgram=ot,V.uniformsList=null,ot}function Df(b){if(b.uniformsList===null){let N=b.currentProgram.getUniforms();b.uniformsList=xr.seqWithValue(N.seq,b.uniforms)}return b.uniformsList}function Nf(b,N){let Y=W.get(b);Y.outputColorSpace=N.outputColorSpace,Y.batching=N.batching,Y.batchingColor=N.batchingColor,Y.instancing=N.instancing,Y.instancingColor=N.instancingColor,Y.instancingMorph=N.instancingMorph,Y.skinning=N.skinning,Y.morphTargets=N.morphTargets,Y.morphNormals=N.morphNormals,Y.morphColors=N.morphColors,Y.morphTargetsCount=N.morphTargetsCount,Y.numClippingPlanes=N.numClippingPlanes,Y.numIntersection=N.numClipIntersection,Y.vertexAlphas=N.vertexAlphas,Y.vertexTangents=N.vertexTangents,Y.toneMapping=N.toneMapping}function ug(b,N){if(b.length===0)return null;if(b.length===1)return b[0].texture!==null?b[0]:null;v.setFromMatrixPosition(N.matrixWorld);for(let Y=0,V=b.length;Y<V;Y++){let G=b[Y];if(G.texture!==null&&G.boundingBox.containsPoint(v))return G}return null}function dg(b,N,Y,V,G){N.isScene!==!0&&(N=He),$.resetTextureUnits();let Me=N.fog,Ce=V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial?N.environment:null,be=J===null?R.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:st.workingColorSpace,Le=V.isMeshStandardMaterial||V.isMeshLambertMaterial&&!V.envMap||V.isMeshPhongMaterial&&!V.envMap,Ue=he.get(V.envMap||Ce,Le),tt=V.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,ot=!!Y.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),ke=!!Y.morphAttributes.position,_t=!!Y.morphAttributes.normal,Ft=!!Y.morphAttributes.color,At=Hn;V.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(At=R.toneMapping);let St=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,sn=St!==void 0?St.length:0,Ae=W.get(V),un=E.state.lights;if(ae===!0&&(le===!0||b!==Q)){let wt=b===Q&&V.id===q;Fe.setState(V,b,wt)}let ht=!1;V.version===Ae.__version?(Ae.needsLights&&Ae.lightsStateVersion!==un.state.version||Ae.outputColorSpace!==be||G.isBatchedMesh&&Ae.batching===!1||!G.isBatchedMesh&&Ae.batching===!0||G.isBatchedMesh&&Ae.batchingColor===!0&&G._colorsTexture===null||G.isBatchedMesh&&Ae.batchingColor===!1&&G._colorsTexture!==null||G.isInstancedMesh&&Ae.instancing===!1||!G.isInstancedMesh&&Ae.instancing===!0||G.isSkinnedMesh&&Ae.skinning===!1||!G.isSkinnedMesh&&Ae.skinning===!0||G.isInstancedMesh&&Ae.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Ae.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Ae.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Ae.instancingMorph===!1&&G.morphTexture!==null||Ae.envMap!==Ue||V.fog===!0&&Ae.fog!==Me||Ae.numClippingPlanes!==void 0&&(Ae.numClippingPlanes!==Fe.numPlanes||Ae.numIntersection!==Fe.numIntersection)||Ae.vertexAlphas!==tt||Ae.vertexTangents!==ot||Ae.morphTargets!==ke||Ae.morphNormals!==_t||Ae.morphColors!==Ft||Ae.toneMapping!==At||Ae.morphTargetsCount!==sn||!!Ae.lightProbeGrid!=E.state.lightProbeGridArray.length>0)&&(ht=!0):(ht=!0,Ae.__version=V.version);let wn=Ae.currentProgram;ht===!0&&(wn=ho(V,N,G),z&&V.isNodeMaterial&&z.onUpdateProgram(V,wn,Ae));let Wn=!1,_i=!1,ws=!1,vt=wn.getUniforms(),zt=Ae.uniforms;if(_.useProgram(wn.program)&&(Wn=!0,_i=!0,ws=!0),V.id!==q&&(q=V.id,_i=!0),Ae.needsLights){let wt=ug(E.state.lightProbeGridArray,G);Ae.lightProbeGrid!==wt&&(Ae.lightProbeGrid=wt,_i=!0)}if(Wn||Q!==b){_.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),vt.setValue(k,"projectionMatrix",b.projectionMatrix),vt.setValue(k,"viewMatrix",b.matrixWorldInverse);let vi=vt.map.cameraPosition;vi!==void 0&&vi.setValue(k,fe.setFromMatrixPosition(b.matrixWorld)),C.logarithmicDepthBuffer&&vt.setValue(k,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&vt.setValue(k,"isOrthographic",b.isOrthographicCamera===!0),Q!==b&&(Q=b,_i=!0,ws=!0)}if(Ae.needsLights&&(un.state.sunShadowMap.length>0&&vt.setValue(k,"sunShadowMap",un.state.sunShadowMap,$),un.state.directionalShadowMap.length>0&&vt.setValue(k,"directionalShadowMap",un.state.directionalShadowMap,$),un.state.spotShadowMap.length>0&&vt.setValue(k,"spotShadowMap",un.state.spotShadowMap,$),un.state.pointShadowMap.length>0&&vt.setValue(k,"pointShadowMap",un.state.pointShadowMap,$)),G.isSkinnedMesh){vt.setOptional(k,G,"bindMatrix"),vt.setOptional(k,G,"bindMatrixInverse");let wt=G.skeleton;wt&&(wt.boneTexture===null&&wt.computeBoneTexture(),vt.setValue(k,"boneTexture",wt.boneTexture,$))}G.isBatchedMesh&&(vt.setOptional(k,G,"batchingTexture"),vt.setValue(k,"batchingTexture",G._matricesTexture,$),vt.setOptional(k,G,"batchingIdTexture"),vt.setValue(k,"batchingIdTexture",G._indirectTexture,$),vt.setOptional(k,G,"batchingColorTexture"),G._colorsTexture!==null&&vt.setValue(k,"batchingColorTexture",G._colorsTexture,$));let yi=Y.morphAttributes;if((yi.position!==void 0||yi.normal!==void 0||yi.color!==void 0)&&U.update(G,Y,wn),(_i||Ae.receiveShadow!==G.receiveShadow)&&(Ae.receiveShadow=G.receiveShadow,vt.setValue(k,"receiveShadow",G.receiveShadow)),(V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial)&&V.envMap===null&&N.environment!==null&&(zt.envMapIntensity.value=N.environmentIntensity),zt.dfgLUT!==void 0&&(zt.dfgLUT.value=PM()),_i){if(vt.setValue(k,"toneMappingExposure",R.toneMappingExposure),Ae.needsLights&&fg(zt,ws),Me&&V.fog===!0&&Oe.refreshFogUniforms(zt,Me),Oe.refreshMaterialUniforms(zt,V,ne,j,E.state.transmissionRenderTarget[b.id]),Ae.needsLights&&Ae.lightProbeGrid){let wt=Ae.lightProbeGrid;zt.probesSH.value=wt.texture,zt.probesMin.value.copy(wt.boundingBox.min),zt.probesMax.value.copy(wt.boundingBox.max),zt.probesResolution.value.copy(wt.resolution)}xr.upload(k,Df(Ae),zt,$)}if(V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(xr.upload(k,Df(Ae),zt,$),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&vt.setValue(k,"center",G.center),vt.setValue(k,"modelViewMatrix",G.modelViewMatrix),vt.setValue(k,"normalMatrix",G.normalMatrix),vt.setValue(k,"modelMatrix",G.matrixWorld),V.uniformsGroups!==void 0){let wt=V.uniformsGroups;for(let vi=0,As=wt.length;vi<As;vi++){let zf=wt[vi];re.update(zf,wn),re.bind(zf,wn)}}return wn}function fg(b,N){b.ambientLightColor.needsUpdate=N,b.lightProbe.needsUpdate=N,b.sunLights.needsUpdate=N,b.sunLightShadows.needsUpdate=N,b.directionalLights.needsUpdate=N,b.directionalLightShadows.needsUpdate=N,b.pointLights.needsUpdate=N,b.pointLightShadows.needsUpdate=N,b.spotLights.needsUpdate=N,b.spotLightShadows.needsUpdate=N,b.rectAreaLights.needsUpdate=N,b.hemisphereLights.needsUpdate=N}function pg(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return X},this.getActiveMipmapLevel=function(){return F},this.getRenderTarget=function(){return J},this.setRenderTargetTextures=function(b,N,Y){let V=W.get(b);V.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,V.__autoAllocateDepthBuffer===!1&&(V.__useRenderToTexture=!1),W.get(b.texture).__webglTexture=N,W.get(b.depthTexture).__webglTexture=V.__autoAllocateDepthBuffer?void 0:Y,V.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,N){let Y=W.get(b);Y.__webglFramebuffer=N,Y.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(b,N=0,Y=0){J=b,X=N,F=Y;let V=null,G=!1,Me=!1;if(b){let be=W.get(b);if(be.__useDefaultFramebuffer!==void 0){_.bindFramebuffer(k.FRAMEBUFFER,be.__webglFramebuffer),ee.copy(b.viewport),ze.copy(b.scissor),Pe=b.scissorTest,_.viewport(ee),_.scissor(ze),_.setScissorTest(Pe),q=-1;return}else if(be.__webglFramebuffer===void 0)$.setupRenderTarget(b);else if(be.__hasExternalTextures)$.rebindTextures(b,W.get(b.texture).__webglTexture,W.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){let tt=b.depthTexture;if(be.__boundDepthTexture!==tt){if(tt!==null&&W.has(tt)&&(b.width!==tt.image.width||b.height!==tt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");$.setupDepthRenderbuffer(b)}}let Le=b.texture;(Le.isData3DTexture||Le.isDataArrayTexture||Le.isCompressedArrayTexture)&&(Me=!0);let Ue=W.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Ue[N])?V=Ue[N][Y]:V=Ue[N],G=!0):b.samples>0&&$.useMultisampledRTT(b)===!1?V=W.get(b).__webglMultisampledFramebuffer:Array.isArray(Ue)?V=Ue[Y]:V=Ue,ee.copy(b.viewport),ze.copy(b.scissor),Pe=b.scissorTest}else ee.copy(Ee).multiplyScalar(ne).floor(),ze.copy(je).multiplyScalar(ne).floor(),Pe=yt;if(Y!==0&&(V=B),_.bindFramebuffer(k.FRAMEBUFFER,V)&&_.drawBuffers(b,V),_.viewport(ee),_.scissor(ze),_.setScissorTest(Pe),G){let be=W.get(b.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+N,be.__webglTexture,Y)}else if(Me){let be=N;for(let Le=0;Le<b.textures.length;Le++){let Ue=W.get(b.textures[Le]);k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0+Le,Ue.__webglTexture,Y,be)}}else if(b!==null&&Y!==0){let be=W.get(b.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,be.__webglTexture,Y)}q=-1};function Uf(b){let N=W.get(b);return(N.__readFormat!==b.format||N.__readType!==b.type)&&(N.__readFormat=b.format,N.__readType=b.type,N.__formatReadable=C.textureFormatReadable(b.format),N.__typeReadable=C.textureTypeReadable(b.type)),N}this.readRenderTargetPixels=function(b,N,Y,V,G,Me,Ce,be=0){if(!(b&&b.isWebGLRenderTarget)){qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Le=W.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Ce!==void 0&&(Le=Le[Ce]),Le){_.bindFramebuffer(k.FRAMEBUFFER,Le);try{let Ue=b.textures[be],tt=Ue.format,ot=Ue.type;b.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+be);let ke=Uf(Ue);if(ke.__formatReadable===!1){qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(ke.__typeReadable===!1){qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=b.width-V&&Y>=0&&Y<=b.height-G&&k.readPixels(N,Y,V,G,xe.convert(tt),xe.convert(ot),Me)}finally{let Ue=J!==null?W.get(J).__webglFramebuffer:null;_.bindFramebuffer(k.FRAMEBUFFER,Ue)}}},this.readRenderTargetPixelsAsync=async function(b,N,Y,V,G,Me,Ce,be=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Le=W.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Ce!==void 0&&(Le=Le[Ce]),Le)if(N>=0&&N<=b.width-V&&Y>=0&&Y<=b.height-G){_.bindFramebuffer(k.FRAMEBUFFER,Le);let Ue=b.textures[be],tt=Ue.format,ot=Ue.type;b.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+be);let ke=Uf(Ue);if(ke.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(ke.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let _t=k.createBuffer();k.bindBuffer(k.PIXEL_PACK_BUFFER,_t),k.bufferData(k.PIXEL_PACK_BUFFER,Me.byteLength,k.STREAM_READ),k.readPixels(N,Y,V,G,xe.convert(tt),xe.convert(ot),0),k.bindBuffer(k.PIXEL_PACK_BUFFER,null);let Ft=J!==null?W.get(J).__webglFramebuffer:null;_.bindFramebuffer(k.FRAMEBUFFER,Ft);let At=k.fenceSync(k.SYNC_GPU_COMMANDS_COMPLETE,0);return k.flush(),await hm(k,At,4),k.bindBuffer(k.PIXEL_PACK_BUFFER,_t),k.getBufferSubData(k.PIXEL_PACK_BUFFER,0,Me),k.bindBuffer(k.PIXEL_PACK_BUFFER,null),k.deleteBuffer(_t),k.deleteSync(At),Me}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,N=null,Y=0){let V=Math.pow(2,-Y),G=Math.floor(b.image.width*V),Me=Math.floor(b.image.height*V),Ce=N!==null?N.x:0,be=N!==null?N.y:0;$.setTexture2D(b,0),k.copyTexSubImage2D(k.TEXTURE_2D,Y,0,0,Ce,be,G,Me),_.unbindTexture()},this.copyTextureToTexture=function(b,N,Y=null,V=null,G=0,Me=0){let Ce,be,Le,Ue,tt,ot,ke,_t,Ft,At=b.isCompressedTexture?b.mipmaps[Me]:b.image;if(Y!==null)Ce=Y.max.x-Y.min.x,be=Y.max.y-Y.min.y,Le=Y.isBox3?Y.max.z-Y.min.z:1,Ue=Y.min.x,tt=Y.min.y,ot=Y.isBox3?Y.min.z:0;else{let zt=Math.pow(2,-G);Ce=Math.floor(At.width*zt),be=Math.floor(At.height*zt),b.isDataArrayTexture?Le=At.depth:b.isData3DTexture?Le=Math.floor(At.depth*zt):Le=1,Ue=0,tt=0,ot=0}V!==null?(ke=V.x,_t=V.y,Ft=V.z):(ke=0,_t=0,Ft=0);let St=xe.convert(N.format),sn=xe.convert(N.type),Ae;N.isData3DTexture?($.setTexture3D(N,0),Ae=k.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?($.setTexture2DArray(N,0),Ae=k.TEXTURE_2D_ARRAY):($.setTexture2D(N,0),Ae=k.TEXTURE_2D),_.activeTexture(k.TEXTURE0),_.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,N.flipY),_.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),_.pixelStorei(k.UNPACK_ALIGNMENT,N.unpackAlignment);let un=_.getParameter(k.UNPACK_ROW_LENGTH),ht=_.getParameter(k.UNPACK_IMAGE_HEIGHT),wn=_.getParameter(k.UNPACK_SKIP_PIXELS),Wn=_.getParameter(k.UNPACK_SKIP_ROWS),_i=_.getParameter(k.UNPACK_SKIP_IMAGES);_.pixelStorei(k.UNPACK_ROW_LENGTH,At.width),_.pixelStorei(k.UNPACK_IMAGE_HEIGHT,At.height),_.pixelStorei(k.UNPACK_SKIP_PIXELS,Ue),_.pixelStorei(k.UNPACK_SKIP_ROWS,tt),_.pixelStorei(k.UNPACK_SKIP_IMAGES,ot);let ws=b.isDataArrayTexture||b.isData3DTexture,vt=N.isDataArrayTexture||N.isData3DTexture;if(b.isDepthTexture){let zt=W.get(b),yi=W.get(N),wt=W.get(zt.__renderTarget),vi=W.get(yi.__renderTarget);_.bindFramebuffer(k.READ_FRAMEBUFFER,wt.__webglFramebuffer),_.bindFramebuffer(k.DRAW_FRAMEBUFFER,vi.__webglFramebuffer);for(let As=0;As<Le;As++)ws&&(k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,W.get(b).__webglTexture,G,ot+As),k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,W.get(N).__webglTexture,Me,Ft+As)),k.blitFramebuffer(Ue,tt,Ce,be,ke,_t,Ce,be,k.DEPTH_BUFFER_BIT,k.NEAREST);_.bindFramebuffer(k.READ_FRAMEBUFFER,null),_.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else if(G!==0||b.isRenderTargetTexture||W.has(b)){let zt=W.get(b),yi=W.get(N);_.bindFramebuffer(k.READ_FRAMEBUFFER,D),_.bindFramebuffer(k.DRAW_FRAMEBUFFER,H);for(let wt=0;wt<Le;wt++)ws?k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,zt.__webglTexture,G,ot+wt):k.framebufferTexture2D(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,zt.__webglTexture,G),vt?k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,yi.__webglTexture,Me,Ft+wt):k.framebufferTexture2D(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,yi.__webglTexture,Me),G!==0?k.blitFramebuffer(Ue,tt,Ce,be,ke,_t,Ce,be,k.COLOR_BUFFER_BIT,k.NEAREST):vt?k.copyTexSubImage3D(Ae,Me,ke,_t,Ft+wt,Ue,tt,Ce,be):k.copyTexSubImage2D(Ae,Me,ke,_t,Ue,tt,Ce,be);_.bindFramebuffer(k.READ_FRAMEBUFFER,null),_.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else vt?b.isDataTexture||b.isData3DTexture?k.texSubImage3D(Ae,Me,ke,_t,Ft,Ce,be,Le,St,sn,At.data):N.isCompressedArrayTexture?k.compressedTexSubImage3D(Ae,Me,ke,_t,Ft,Ce,be,Le,St,At.data):k.texSubImage3D(Ae,Me,ke,_t,Ft,Ce,be,Le,St,sn,At):b.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,Me,ke,_t,Ce,be,St,sn,At.data):b.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,Me,ke,_t,At.width,At.height,St,At.data):k.texSubImage2D(k.TEXTURE_2D,Me,ke,_t,Ce,be,St,sn,At);_.pixelStorei(k.UNPACK_ROW_LENGTH,un),_.pixelStorei(k.UNPACK_IMAGE_HEIGHT,ht),_.pixelStorei(k.UNPACK_SKIP_PIXELS,wn),_.pixelStorei(k.UNPACK_SKIP_ROWS,Wn),_.pixelStorei(k.UNPACK_SKIP_IMAGES,_i),Me===0&&N.generateMipmaps&&k.generateMipmap(Ae),_.unbindTexture()},this.initRenderTarget=function(b){W.get(b).__webglFramebuffer===void 0&&$.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?$.setTextureCube(b,0):b.isData3DTexture?$.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?$.setTexture2DArray(b,0):$.setTexture2D(b,0),_.unbindTexture()},this.resetState=function(){X=0,F=0,J=null,_.reset(),Te.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Bn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=st._getDrawingBufferColorSpace(e),t.unpackColorSpace=st._getUnpackColorSpace()}};var vr={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};var En=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},IM=new Di(-1,1,1,-1,0,1),Zu=class extends Mt{constructor(){super(),this.setAttribute("position",new lt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new lt([0,2,0,0,2,0],2))}},LM=new Zu,Bi=class{constructor(e){this._mesh=new $e(LM,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,IM)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var wc=class extends En{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof It?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=xi.clone(e.uniforms),this.material=new It({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Bi(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var qa=class extends En{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},Ac=class extends En{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}};var Cc=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new se);this._width=n.width,this._height=n.height,t=new Wt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:nn}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new wc(vr),this.copyPass.material.blending=Pn,this.timer=new wa}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let s=0,r=this.passes.length;s<r;s++){let a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){let o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}qa!==void 0&&(a instanceof qa?n=!0:a instanceof Ac&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new se);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var Rc=class extends En{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new we}render(e,t,n){let s=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}};var $m={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new we(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};var br=class i extends En{constructor(e,t=1,n,s){super(),this.strength=t,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new se(e.x,e.y):new se(256,256),this.clearColor=new we(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Wt(r,a,{type:nn,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){let u=new Wt(r,a,{type:nn,depthBuffer:!1});u.texture.name="UnrealBloomPass.h"+h,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);let d=new Wt(r,a,{type:nn,depthBuffer:!1});d.texture.name="UnrealBloomPass.v"+h,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),r=Math.round(r/2),a=Math.round(a/2)}let o=$m;this.highPassUniforms=xi.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new It({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new se(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=xi.clone(vr.uniforms),this.blendMaterial=new It({uniforms:this.copyUniforms,vertexShader:vr.vertexShader,fragmentShader:vr.fragmentShader,premultipliedAlpha:!0,blending:Lt,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new we,this._oldClearAlpha=1,this._basic=new Tt,this._fsQuad=new Bi(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new se(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();let a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=a}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let a=0;a<e;a++)t.push(.39894*Math.exp(-.5*a*a/(n*n))/n);let s=[],r=[];for(let a=1;a<e;a+=2){let o=t[a],l=a+1<e?t[a+1]:0,c=o+l;s.push((a*o+(a+1)*l)/c),r.push(c)}return new It({defines:{KERNEL_PAIRS:s.length},uniforms:{colorTexture:{value:null},invSize:{value:new se(.5,.5)},direction:{value:new se(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:s},gaussianWeights:{value:r}},vertexShader:`

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

				}`})}_getCompositeMaterial(e){return new It({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

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

				}`})}};br.BlurDirectionX=new se(1,0);br.BlurDirectionY=new se(0,1);var Ya={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};var Pc=class extends En{constructor(){super(),this.isOutputPass=!0,this.uniforms=xi.clone(Ya.uniforms),this.material=new or({name:Ya.name,uniforms:this.uniforms,vertexShader:Ya.vertexShader,fragmentShader:Ya.fragmentShader}),this._fsQuad=new Bi(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},st.getTransfer(this._outputColorSpace)===dt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Ca?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Ra?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Pa?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===fs?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===La?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===ka?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Ia&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var Ic=class extends rs{constructor(){super(),this.name="RoomEnvironment",this.position.y=-3.5;let e=new Mn;e.deleteAttribute("uv");let t=new pn({side:tn}),n=new pn,s=new mi(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);let r=new $e(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let a=new sa(e,n,6),o=new Ot;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);let l=new $e(e,Mr(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);let c=new $e(e,Mr(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);let h=new $e(e,Mr(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);let u=new $e(e,Mr(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);let d=new $e(e,Mr(20));d.position.set(3.235,11.486,-12.541),d.scale.set(2.5,2,.1),this.add(d);let f=new $e(e,Mr(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function Mr(i){return new va({color:0,emissive:16777215,emissiveIntensity:i})}var kn=ut.R+2.2;function Zm(i,e){let t=document.createElement("canvas");t.width=t.height=i;let n=t.getContext("2d"),s=i/(kn*2);n.translate(i/2,i/2),n.scale(s,s),e(n);let r=new ei(t);return r.colorSpace=Gt,r.anisotropy=8,r}function ju(i,e){i.beginPath(),i.arc(0,0,e,0,Math.PI*2)}function kM(i){let e=ut.R;i.fillStyle="#0a0e1c",i.fillRect(-kn,-kn,kn*2,kn*2);let t=i.createRadialGradient(0,0,0,0,0,e);t.addColorStop(0,"#2b3a63"),t.addColorStop(.45,"#1a2442"),t.addColorStop(1,"#0d1326"),i.fillStyle=t,ju(i,e),i.fill();for(let[n,s,r]of[[9.6,12.4,"rgba(120,160,255,0.05)"],[5.8,6.6,"rgba(120,160,255,0.08)"],[0,2.6,"rgba(140,190,255,0.09)"]])i.fillStyle=r,i.beginPath(),i.arc(0,0,s,0,Math.PI*2),i.arc(0,0,n,0,Math.PI*2,!0),i.fill();for(let n=0;n<900;n++){let s=Math.random()*e,r=Math.random()*Math.PI*2,a=.1+Math.random()*.5;i.strokeStyle=`rgba(${Math.random()<.5?"255,255,255":"0,0,0"},${.02+Math.random()*.05})`,i.lineWidth=.02+Math.random()*.03,i.beginPath(),i.arc(0,0,s,r,r+a),i.stroke()}i.strokeStyle="rgba(255,255,255,0.05)",i.lineWidth=.05;for(let n=0;n<24;n++){let s=n/24*Math.PI*2;i.beginPath(),i.moveTo(Math.cos(s)*2.8,Math.sin(s)*2.8),i.lineTo(Math.cos(s)*e,Math.sin(s)*e),i.stroke()}i.fillStyle="#161d33",i.beginPath(),i.arc(0,0,kn,0,Math.PI*2),i.arc(0,0,e,0,Math.PI*2,!0),i.fill()}function DM(i){let e=ut.R;i.fillStyle="#000",i.fillRect(-kn,-kn,kn*2,kn*2),i.lineCap="butt";let t=(n,s,r,a)=>{i.strokeStyle=r,i.lineWidth=s,i.setLineDash(a||[]),ju(i,n),i.stroke(),i.setLineDash([])};t(2.6,.07,"#57d8ff"),t(6.2,.05,"#2f7fd0",[.5,.35]),t(9.6,.07,"#3aa8ff"),t(12.35,.5,"#ff5a2a",[.9,.6]),t(11.95,.05,"#ff9a4a"),i.strokeStyle="#2c8fe0",i.lineWidth=.05;for(let n=0;n<12;n++){let s=n/12*Math.PI*2+Math.PI/12;i.beginPath(),i.moveTo(Math.cos(s)*9.6,Math.sin(s)*9.6),i.lineTo(Math.cos(s)*11.9,Math.sin(s)*11.9),i.stroke()}for(let n=0;n<72;n++){let s=n/72*Math.PI*2,r=n%6===0?5.7:6;i.beginPath(),i.moveTo(Math.cos(s)*r,Math.sin(s)*r),i.lineTo(Math.cos(s)*6.2,Math.sin(s)*6.2),i.stroke()}i.strokeStyle="#7fe4ff",i.lineWidth=.08,i.beginPath();for(let n=0;n<6;n++){let s=n/6*Math.PI*2;i[n?"lineTo":"moveTo"](Math.cos(s)*1.7,Math.sin(s)*1.7)}i.closePath(),i.stroke(),i.beginPath();for(let n=0;n<3;n++){let s=n/3*Math.PI*2-Math.PI/2;i[n?"lineTo":"moveTo"](Math.cos(s)*1.1,Math.sin(s)*1.1)}i.closePath(),i.stroke(),i.fillStyle="#bff2ff",ju(i,.22),i.fill()}function NM(){let i=document.createElement("canvas");i.width=i.height=2048;let e=i.getContext("2d"),t=2048/180;e.fillStyle="#04060d",e.fillRect(0,0,2048,2048),e.translate(1024,1024),e.scale(t,t);let n=e.createRadialGradient(0,0,14,0,0,70);n.addColorStop(0,"rgba(46,104,255,0.55)"),n.addColorStop(.25,"rgba(30,60,170,0.26)"),n.addColorStop(.6,"rgba(20,30,90,0.1)"),n.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=n,e.fillRect(-90,-90,180,180);for(let[r,a,o,l]of[[21.5,.22,.9,null],[24,.08,.5,[1.2,.8]],[31,.12,.45,null],[33,1.2,.07,[4,2]],[42,.1,.3,[.6,2.4]],[54,.14,.22,null],[70,.1,.14,null]])e.strokeStyle=`rgba(90,150,255,${o})`,e.lineWidth=a,e.setLineDash(l||[]),e.beginPath(),e.arc(0,0,r,0,Math.PI*2),e.stroke();e.setLineDash([]);for(let r=0;r<36;r++){let a=r/36*Math.PI*2,o=r%3===0;e.strokeStyle=`rgba(90,150,255,${o?.3:.1})`,e.lineWidth=o?.12:.06,e.beginPath(),e.moveTo(Math.cos(a)*(o?24:31),Math.sin(a)*(o?24:31)),e.lineTo(Math.cos(a)*88,Math.sin(a)*88),e.stroke()}for(let r=0;r<18;r++){let a=r/18*Math.PI*2+.09;e.fillStyle=`rgba(70,130,255,${r%2?.05:.1})`,e.beginPath(),e.arc(0,0,30.4,a,a+.17),e.arc(0,0,25,a+.17,a,!0),e.closePath(),e.fill()}let s=new ei(i);return s.colorSpace=Gt,s.anisotropy=8,s}function jm(i){let e=new Mc({canvas:i,antialias:!0,powerPreference:"high-performance"});e.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),e.shadowMap.enabled=!0,e.shadowMap.type=us,e.toneMapping=fs,e.toneMappingExposure=1;let t=new rs;t.background=new we(263693),t.fog=new Kr(263693,.011);let n=new _r(e);t.environment=n.fromScene(new Ic,.04).texture,t.environmentIntensity=.55;let s=new Qt(40,1,.5,400);t.add(new Sa(10470655,724248,.55));let r=new hr(16777215,1.8);r.position.set(9,26,12),r.castShadow=!0,r.shadow.mapSize.set(2048,2048);let a=r.shadow.camera;a.left=-17,a.right=17,a.top=17,a.bottom=-17,a.near=5,a.far=60,r.shadow.bias=-6e-4,r.shadow.normalBias=.03,t.add(r);let o=new hr(6982911,.9);o.position.set(-14,10,-16),t.add(o);let{R:l,H:c}=ut,h=[];for(let F=0;F<=48;F++){let J=l*F/48;h.push(new se(J,Zi(J)))}h.push(new se(l+.02,c+.15),new se(l+.3,c+1),new se(l+1.25,c+1),new se(l+1.7,c+.35),new se(l+2.1,-2.5));let u=new ya(h,128),d=u.attributes.position,f=u.attributes.uv;for(let F=0;F<d.count;F++)f.setXY(F,d.getX(F)/(kn*2)+.5,.5-d.getZ(F)/(kn*2));let m=new pn({map:Zm(2048,kM),emissiveMap:Zm(2048,DM),emissive:16777215,emissiveIntensity:.85,metalness:.82,roughness:.36,side:Nt}),x=new $e(u,m);x.receiveShadow=!0,t.add(x);let g=new Tt({color:3524863}),p=new $e(new hs(l+.34,.07,10,160),g);p.rotation.x=Math.PI/2,p.position.y=c+1.04,t.add(p);let S=new $e(new hs(l+1.22,.05,8,160),new Tt({color:2245802}));S.rotation.x=Math.PI/2,S.position.y=c+1.03,t.add(S);let A=new $e(new Jt(l+4.5,l+6,1.6,64),new pn({color:790818,metalness:.7,roughness:.5}));A.position.y=-1.7,A.receiveShadow=!0,t.add(A);let v=new $e(new hs(l+4.5,.06,8,128),new Tt({color:1922760}));v.rotation.x=Math.PI/2,v.position.y=-.88,t.add(v);let w=new $e(new pi(180,180),new Tt({map:NM(),fog:!1}));w.rotation.x=-Math.PI/2,w.position.y=-2.5,t.add(w);let E=[],P=new Jt(.15,1.5,46,20,1,!0);P.translate(0,23,0);for(let F=0;F<8;F++){let J=F/8*Math.PI*2+.4,q=new $e(P,new Tt({color:F%2?2780415:9059583,transparent:!0,opacity:.018,blending:Lt,depthWrite:!1,side:Nt,fog:!1}));q.position.set(Math.cos(J)*34,-2.5,Math.sin(J)*34),t.add(q),E.push({m:q,a:J,ph:F*1.7})}let y=1400,T=new Float32Array(y*3),R=new Float32Array(y*3),I=[new we(3837183),new we(16730762),new we(16765562),new we(9109482)];for(let F=0;F<y;F++){let J=Math.random()*Math.PI*2,q=34+Math.random()*46;T[F*3]=Math.cos(J)*q,T[F*3+1]=-1+(q-34)*.55+Math.random()*3,T[F*3+2]=Math.sin(J)*q;let Q=I[Math.random()*I.length|0],ee=.25+Math.random()*.75;R[F*3]=Q.r*ee,R[F*3+1]=Q.g*ee,R[F*3+2]=Q.b*ee}let z=new Mt;z.setAttribute("position",new Pt(T,3)),z.setAttribute("color",new Pt(R,3));let B=new os(z,new ir({size:.55,vertexColors:!0,transparent:!0,blending:Lt,depthWrite:!1,fog:!1}));t.add(B);let D=new Cc(e);D.addPass(new Rc(t,s));let H=new br(new se(1,1),.6,.5,.9);D.addPass(H),D.addPass(new Pc);let X={renderer:e,scene:t,camera:s,composer:D,bloom:H,floorMat:m,rimMat:g,beams:E,crowd:B,key:r,rimColor:new we(3524863),rimPulse:0,rimPulseColor:new we(16777215),width:1,height:1,resize(){let F=window.innerWidth,J=window.innerHeight;X.width=F,X.height=J,e.setSize(F,J,!1),D.setSize(F,J),s.aspect=F/J,s.updateProjectionMatrix()},update(F,J){for(let q of E)q.m.rotation.z=Math.sin(J*.35+q.ph)*.28-Math.cos(q.a)*.45,q.m.rotation.x=Math.cos(J*.3+q.ph)*.28+Math.sin(q.a)*.45;B.rotation.y=J*.01,B.material.opacity=.75+Math.sin(J*7)*.08,X.rimPulse=Math.max(0,X.rimPulse-F*2.2),g.color.copy(X.rimColor).lerp(X.rimPulseColor,Math.min(1,X.rimPulse)),g.color.multiplyScalar(1.1+X.rimPulse*.7),m.emissiveIntensity=.85+X.rimPulse*.25+Math.sin(J*2)*.05},pulseRim(F,J=1){X.rimPulseColor.set(F),X.rimPulse=Math.max(X.rimPulse,J)},render(){D.render()}};return X.resize(),X}function UM(i,e){let t=new rr,n=Math.PI*2/i,s=(a,o,l)=>t[l?"moveTo":"lineTo"](Math.cos(o)*a,Math.sin(o)*a);for(let a=0;a<i;a++){let o=a*n;e==="ATTACK"?(s(.62,o,a===0),s(1.04,o+n*.1),s(1,o+n*.22),s(.84,o+n*.5),s(.7,o+n*.78)):e==="DEFENSE"?(s(.9,o,a===0),s(1,o+n*.12),s(1,o+n*.62),s(.9,o+n*.76),s(.84,o+n*.88)):(s(.74,o,a===0),s(.98,o+n*.16),s(.98,o+n*.5),s(.86,o+n*.74),s(.74,o+n*.86))}t.closePath();let r=new ls;return r.absarc(0,0,.4,0,Math.PI*2,!0),t.holes.push(r),t}function zM(){let i=document.createElement("canvas");i.width=i.height=256;let e=i.getContext("2d");e.translate(128,128);for(let s=0;s<90;s++){let r=84+Math.random()*40,a=Math.random()*Math.PI*2,o=.5+Math.random()*1.6;e.strokeStyle=`rgba(255,255,255,${.05+Math.random()*.22})`,e.lineWidth=1+Math.random()*4,e.beginPath(),e.arc(0,0,r,a,a+o),e.stroke()}let t=e.createRadialGradient(0,0,90,0,0,128);t.addColorStop(0,"rgba(255,255,255,0)"),t.addColorStop(.7,"rgba(255,255,255,0.35)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.beginPath(),e.arc(0,0,128,0,Math.PI*2),e.fill();let n=new ei(i);return n.colorSpace=Gt,n}var Ju=null;function Ku(i,e){let t=new we(i.color),n=new gn,s=new gn;n.add(s);let r=(w,E,P=0,y=s)=>{let T=new $e(w,E);return T.position.y=P,T.castShadow=!0,y.add(T),T},a=new pn({color:12174038,metalness:1,roughness:.2,envMapIntensity:1}),o=new pn({color:1317418,metalness:.9,roughness:.32}),l=new lr({color:t.clone().multiplyScalar(.42),metalness:.5,roughness:.34,clearcoat:.5,clearcoatRoughness:.2,envMapIntensity:.6,emissive:t,emissiveIntensity:.14}),c=new lr({color:t.clone().multiplyScalar(.16),metalness:.7,roughness:.32,clearcoat:.5,clearcoatRoughness:.2,envMapIntensity:.7}),h=new Tt({color:t.clone().lerp(new we(16777215),.2).multiplyScalar(1.2)}),u=r(new ha(.17,.36,16),a,.18);u.rotation.x=Math.PI,r(new Jt(.44,.2,.2,24),o,.44),r(new Jt(.9,.78,.13,64),a,.59),r(new Jt(.8,.8,.05,64),h,.68);let d={depth:.18,bevelEnabled:!0,bevelThickness:.045,bevelSize:.04,bevelSegments:3,curveSegments:24},f=new _a(UM(i.teeth,i.type),d);f.rotateX(-Math.PI/2),r(f,l,.75);let m=r(f,c,.93);m.scale.set(.7,.55,.7),m.rotation.y=Math.PI/i.teeth;let x=Math.PI*2/i.teeth;for(let w=0;w<i.teeth;w++){let E=(w+.3)*x,P=r(new Jt(.065,.065,.06,12),a,1);P.position.x=Math.cos(E)*.86,P.position.z=-Math.sin(E)*.86;let y=r(new Mn(.2,.03,.045),h,.985),T=(w+.52)*x;y.position.x=Math.cos(T)*.8,y.position.z=-Math.sin(T)*.8,y.rotation.y=T,y.castShadow=!1}r(new Jt(.4,.44,.1,40),a,1.07),r(new Jt(.3,.34,.1,6),c,1.14),r(new Jt(.13,.15,.06,20),h,1.2),Ju||(Ju=zM());let g=new Tt({map:Ju,color:t,transparent:!0,opacity:.3,blending:Lt,depthWrite:!1,side:Nt}),p=new $e(new ca(1.12,48),g);p.rotation.x=-Math.PI/2,p.position.y=.9,n.add(p);let S=new $e(new pi(1,1),new Tt({map:e,color:t,transparent:!0,opacity:.5,blending:Lt,depthWrite:!1}));S.rotation.x=-Math.PI/2,S.position.y=.06,S.scale.setScalar(5),S.renderOrder=5,n.add(S);let A=new It({uniforms:{uColor:{value:t.clone().lerp(new we(16777215),.35)},uTime:{value:0},uAlpha:{value:0}},vertexShader:`varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); vP = position; gl_Position = projectionMatrix * mv; }`,fragmentShader:`uniform vec3 uColor; uniform float uTime; uniform float uAlpha; varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main(){ float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
        float band = 0.5 + 0.5 * sin(vP.y * 9.0 - uTime * 9.0);
        float hex = smoothstep(0.86, 1.0, abs(sin(atan(vP.z, vP.x) * 6.0 + vP.y * 3.0)));
        gl_FragColor = vec4(uColor * (f * 1.5 + band * 0.12 + hex * 0.35) * uAlpha, 1.0); }`,blending:Lt,depthWrite:!1,transparent:!0,side:Nt}),v=new $e(new Pi(1.5,32,20),A);return v.position.y=.7,v.visible=!1,n.add(v),s.scale.setScalar(1.25),p.scale.setScalar(1.25),p.position.y=1.12,v.scale.setScalar(1.25),v.position.y=.85,{group:n,spin:s,blur:p,blurMat:g,aura:S,shield:v,shieldMat:A,body:l,color:t,wobble:Math.random()*6,shieldAlpha:0}}function Qu(i){i.group.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()})}var Ve=(i,e)=>Zi(Math.hypot(i,e)),Lc=new we;function e0(){let i=document.createElement("canvas");i.width=i.height=128;let e=i.getContext("2d"),t=e.createRadialGradient(64,64,0,64,64,64);t.addColorStop(0,"rgba(255,255,255,1)"),t.addColorStop(.25,"rgba(255,255,255,0.55)"),t.addColorStop(.6,"rgba(255,255,255,0.12)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.fillRect(0,0,128,128);let n=new ei(i);return n.colorSpace=Gt,n}var Nc=class{constructor(e,t=6e3){this.max=t,this.cursor=0,this.pos=new Float32Array(t*3),this.vel=new Float32Array(t*3),this.base=new Float32Array(t*3),this.col=new Float32Array(t*3),this.size=new Float32Array(t),this.size0=new Float32Array(t),this.life=new Float32Array(t),this.life0=new Float32Array(t),this.grav=new Float32Array(t),this.drag=new Float32Array(t);let n=new Mt;n.setAttribute("position",new Pt(this.pos,3).setUsage(ms)),n.setAttribute("aColor",new Pt(this.col,3).setUsage(ms)),n.setAttribute("aSize",new Pt(this.size,1).setUsage(ms)),this.mat=new It({uniforms:{uScale:{value:600}},vertexShader:`
        attribute float aSize; attribute vec3 aColor; varying vec3 vColor; uniform float uScale;
        void main(){ vColor = aColor; vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * uScale / -mv.z; gl_Position = projectionMatrix * mv; }`,fragmentShader:`
        varying vec3 vColor;
        void main(){ float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.05, d);
          gl_FragColor = vec4(vColor * a * a, 1.0); }`,blending:Lt,depthWrite:!1,transparent:!0}),this.points=new os(n,this.mat),this.points.frustumCulled=!1,this.points.renderOrder=20,e.add(this.points)}emit(e,t,n,s,r,a,o,l,c,h=18,u=1.2){let d=this.cursor;this.cursor=(d+1)%this.max;let f=d*3;this.pos[f]=e,this.pos[f+1]=t,this.pos[f+2]=n,this.vel[f]=s,this.vel[f+1]=r,this.vel[f+2]=a,Lc.set(c),this.base[f]=Lc.r,this.base[f+1]=Lc.g,this.base[f+2]=Lc.b,this.life[d]=this.life0[d]=o,this.size0[d]=l,this.grav[d]=h,this.drag[d]=u}burst(e,t,n,s,r,a,o={}){let{dx:l=0,dy:c=0,dz:h=0,bias:u=0,up:d=.6,life:f=.5,size:m=.22,gravity:x=18,drag:g=1.2,flat:p=!1}=o;for(let S=0;S<s;S++){let A=Math.random()*Math.PI*2,v=p?0:(Math.random()*.9+.05)*d,w=a*(.35+Math.random()*.65),E=Math.cos(v*Math.PI*.5),P=Math.cos(A)*E,y=Math.sin(v*Math.PI*.5),T=Math.sin(A)*E;P=P*(1-u)+l*u,y=y*(1-u)+c*u,T=T*(1-u)+h*u,this.emit(e,t,n,P*w,y*w,T*w,f*(.5+Math.random()*.7),m*(.6+Math.random()*.8),r,x,g)}}update(e){let{pos:t,vel:n,base:s,col:r,size:a,size0:o,life:l,life0:c,grav:h,drag:u,max:d}=this;for(let m=0;m<d;m++){if(l[m]<=0){a[m]!==0&&(a[m]=0);continue}l[m]-=e;let x=m*3;if(l[m]<=0){a[m]=0;continue}let g=Math.exp(-u[m]*e);if(n[x]*=g,n[x+1]=n[x+1]*g-h[m]*e,n[x+2]*=g,t[x]+=n[x]*e,t[x+1]+=n[x+1]*e,t[x+2]+=n[x+2]*e,h[m]>0){let A=Ve(t[x],t[x+2])+.03;t[x+1]<A&&(t[x+1]=A,n[x+1]=Math.abs(n[x+1])*.35)}let p=l[m]/c[m],S=p<.7?p/.7:1;r[x]=s[x]*S,r[x+1]=s[x+1]*S,r[x+2]=s[x+2]*S,a[m]=o[m]*(.4+.6*p)}let f=this.points.geometry;f.attributes.position.needsUpdate=!0,f.attributes.aColor.needsUpdate=!0,f.attributes.aSize.needsUpdate=!0}},Uc=class{constructor(e,t=24){this.items=[];let n=new Ri(.82,1,72);n.rotateX(-Math.PI/2);for(let s=0;s<t;s++){let r=new Tt({color:16777215,transparent:!0,blending:Lt,depthWrite:!1,side:Nt}),a=new $e(n,r);a.visible=!1,a.renderOrder=12,e.add(a),this.items.push({m:a,t:0,T:0,r0:0,r1:0,a:1})}this.i=0}spawn(e,t,n,s,r,a,o,l=1){let c=this.items[this.i];this.i=(this.i+1)%this.items.length,c.t=0,c.T=a,c.r0=s,c.r1=r,c.a=l,c.m.material.color.set(o),c.m.position.set(e,t,n),c.m.visible=!0}update(e){for(let t of this.items){if(!t.m.visible)continue;t.t+=e;let n=t.t/t.T;if(n>=1){t.m.visible=!1;continue}let s=1-(1-n)*(1-n)*(1-n);t.m.scale.setScalar(t.r0+(t.r1-t.r0)*s),t.m.material.opacity=t.a*(1-n)*(1-n)}}},zc=class{constructor(e,t){this.sprites=[];for(let n=0;n<16;n++){let s=new Ai(new fi({map:t,color:16777215,blending:Lt,depthWrite:!1,transparent:!0}));s.visible=!1,s.renderOrder=21,e.add(s),this.sprites.push({s,t:0,T:1,size:1,a:1})}this.lights=[];for(let n=0;n<3;n++){let s=new mi(16777215,0,30,1.6);e.add(s),this.lights.push({l:s,t:0,T:1,p:0})}this.si=0,this.li=0}flash(e,t,n,s,r,a,o=1,l=0){let c=this.sprites[this.si];if(this.si=(this.si+1)%this.sprites.length,c.t=0,c.T=r,c.size=s,c.a=o,c.s.material.color.set(a),c.s.position.set(e,t,n),c.s.visible=!0,l>0){let h=this.lights[this.li];this.li=(this.li+1)%this.lights.length,h.t=0,h.T=r*1.5,h.p=l*.1,h.l.color.set(a),h.l.position.set(e,t+3,n)}}update(e){for(let t of this.sprites){if(!t.s.visible)continue;t.t+=e;let n=t.t/t.T;if(n>=1){t.s.visible=!1;continue}t.s.scale.setScalar(t.size*(.6+.6*n)),t.s.material.opacity=t.a*.7*(1-n)*(1-n)}for(let t of this.lights){if(t.p<=0)continue;t.t+=e;let n=Math.min(1,t.t/t.T);t.l.intensity=t.p*(1-n)*(1-n),n>=1&&(t.p=0)}}},Jm=.7,Oc=class{constructor(e,t,n=64){this.n=n,this.pts=[],this.color=new we(t),this.width=.2,this.boost=0,this.posArr=new Float32Array(n*2*3),this.colArr=new Float32Array(n*2*3);let s=[];for(let a=0;a<n-1;a++){let o=a*2;s.push(o,o+1,o+2,o+1,o+3,o+2)}let r=new Mt;r.setAttribute("position",new Pt(this.posArr,3).setUsage(ms)),r.setAttribute("color",new Pt(this.colArr,3).setUsage(ms)),r.setIndex(s),this.mesh=new $e(r,new Tt({vertexColors:!0,transparent:!0,blending:Lt,depthWrite:!1,side:Nt})),this.mesh.frustumCulled=!1,this.mesh.renderOrder=8,e.add(this.mesh)}reset(){this.pts.length=0,this.rebuild()}push(e,t,n=0){let s=this.pts[0];s&&Math.hypot(s.x-e,s.z-t)>4&&(this.pts.length=0),s&&this.pts.length&&Math.hypot(s.x-e,s.z-t)<.16&&Math.abs(s.lift-n)<.3?(s.x=e,s.z=t,s.lift=n):(this.pts.unshift({x:e,z:t,lift:n,age:0,w:this.width*(1+this.boost*1.6),b:1+this.boost*1.5}),this.pts.length>this.n&&this.pts.pop())}update(e){let t=this.pts;for(let n=1;n<t.length;n++)t[n].age+=e;for(;t.length>1&&t[t.length-1].age>=Jm;)t.pop();this.rebuild()}rebuild(){let{pts:e,n:t,posArr:n,colArr:s,color:r}=this;for(let o=0;o<t;o++){let l=e[Math.min(o,e.length-1)],c=e[Math.min(o+1,e.length-1)]||l,h=o*6;if(!l||o>=e.length){for(let S=0;S<6;S++)s[h+S]=0;if(l)for(let S=0;S<2;S++)n[h+S*3]=l.x,n[h+S*3+1]=0,n[h+S*3+2]=l.z;continue}let u=l.x-c.x,d=l.z-c.z,f=Math.hypot(u,d)||1;u/=f,d/=f;let m=(1-o/t)*Math.max(0,1-l.age/Jm),x=l.w*(.15+.85*m),g=Ve(l.x,l.z)+.07+l.lift;n[h]=l.x-d*x,n[h+1]=g,n[h+2]=l.z+u*x,n[h+3]=l.x+d*x,n[h+4]=g,n[h+5]=l.z-u*x;let p=m*m*.85*l.b;for(let S=0;S<2;S++)s[h+S*3]=r.r*p,s[h+S*3+1]=r.g*p,s[h+S*3+2]=r.b*p}let a=this.mesh.geometry;a.attributes.position.needsUpdate=!0,a.attributes.color.needsUpdate=!0}dispose(e){e.remove(this.mesh),this.mesh.geometry.dispose(),this.mesh.material.dispose()}},kc=20,ed=64,Dc=5,Km=40,td={x:0,z:0};function Qm(i,e){let t=Math.hypot(i,e),n=t>ut.R?ut.R/t:1;return td.x=i*n,td.z=e*n,td}var Fc=class{constructor(e){this.scene=e,this.pools={rect:[],ring:[],path:[]},this.used={rect:0,ring:0,path:0}}begin(){for(let e in this.pools){for(let t=0;t<this.used[e];t++)this.pools[e][t].visible=!1;this.used[e]=0}}get(e){let t=this.pools[e],n=t[this.used[e]++];if(!n){let s=new Mt;if(e==="path")s.setAttribute("position",new Pt(new Float32Array(Km*3),3)),n=new aa(s,new ba({transparent:!0,depthWrite:!1,dashSize:.35,gapSize:.3,blending:Lt}));else{let r=e==="rect"?kc:ed,a=e==="rect"?1:Dc;s.setAttribute("position",new Pt(new Float32Array((r+1)*(a+1)*3),3));let o=[];for(let l=0;l<r;l++)for(let c=0;c<a;c++){let h=l*(a+1)+c,u=h+a+1;o.push(h,u,h+1,u,u+1,h+1)}s.setIndex(o),n=new $e(s,new Tt({transparent:!0,depthWrite:!1,side:Nt,blending:Lt}))}n.frustumCulled=!1,n.renderOrder=6,this.scene.add(n),t.push(n)}return n.visible=!0,n}rect(e,t,n,s,r,a,o,l,c=.08){if(r<=.01)return;let h=this.get("rect"),u=h.geometry.attributes.position.array;for(let d=0;d<=kc;d++){let f=e+n*r*(d/kc),m=t+s*r*(d/kc);for(let x=0;x<2;x++){let g=x?1:-1,p=Qm(f-s*a*g,m+n*a*g),S=(d*2+x)*3;u[S]=p.x,u[S+1]=Ve(p.x,p.z)+c,u[S+2]=p.z}}h.geometry.attributes.position.needsUpdate=!0,h.material.color.set(o),h.material.opacity=l}lane(e,t,n,s,r,a,o,l,c){this.rect(e,t,n,s,r,a,o,l);let h=.06;this.rect(e-s*(a-h),t+n*(a-h),n,s,r,h,o,c,.1),this.rect(e+s*(a-h),t-n*(a-h),n,s,r,h,o,c,.1),this.rect(e+n*r+s*a,t+s*r-n*a,-s,n,a*2,h,o,c,.1)}ring(e,t,n,s,r,a,o=.08,l=0,c=Math.PI*2){if(s<=.01)return;let h=this.get("ring"),u=h.geometry.attributes.position.array;for(let d=0;d<=ed;d++){let f=l+d/ed*(c-l),m=Math.cos(f),x=Math.sin(f);for(let g=0;g<=Dc;g++){let p=n+(s-n)*(g/Dc),S=Qm(e+m*p,t+x*p),A=(d*(Dc+1)+g)*3;u[A]=S.x,u[A+1]=Ve(S.x,S.z)+o,u[A+2]=S.z}}h.geometry.attributes.position.needsUpdate=!0,h.material.color.set(r),h.material.opacity=a}sector(e,t,n,s,r,a,o,l,c){let h=Math.atan2(s,n);this.ring(e,t,0,r,o,l,.08,h-a,h+a),this.ring(e,t,r-.1,r,o,c,.1,h-a,h+a);for(let u of[-1,1])this.rect(e,t,Math.cos(h+a*u),Math.sin(h+a*u),r,.05,o,c,.1)}path(e,t,n){if(e.length<2)return;let s=this.get("path"),r=s.geometry.attributes.position.array;for(let a=0;a<Km;a++){let o=e[Math.min(a,e.length-1)];r[a*3]=o.x,r[a*3+1]=Ve(o.x,o.z)+.12,r[a*3+2]=o.z}s.geometry.attributes.position.needsUpdate=!0,s.computeLineDistances(),s.material.color.set(t),s.material.opacity=n}};var Hi=10479871,Bc=16767050,_s=16773568,ys=9306032,nd=54*Math.PI/180,Sr=(i,e,t)=>i<e?e:i>t?t:i,id=(i,e,t,n)=>{let s=i*t+e*n,r=i*i+e*e-ut.R*ut.R;return r>=0?0:-s+Math.sqrt(s*s-r)},sd=new L,t0={shadow:"clone",arise:"clone",turret:"turret",icewall:"wall",windwall:"wall",divide:"wall"},Hc=10354490,Vc=16724032,Vi=13627391,Gc=class{constructor(e){let t=this.stage=jm(e);this.scene=t.scene,this.camera=t.camera,this.glow=e0(),this.particles=new Nc(this.scene),this.waves=new Uc(this.scene),this.flashes=new zc(this.scene,this.glow),this.ground=new Fc(this.scene),this.tops=[],this.projs=new Map,this.telegraphs=[],this.markers=[],this.scorch=[],this.world=null,this.playerSide=0,this.time=0,this.shake=0,this.punch=0,this.orbit=.6,this.orbiting=!0,this.look=new L(0,.6,.8),this.zoom=1.12,this.focus=null,this.raycaster=new Aa,this.pillars=[];let n=new Jt(1,.55,34,32,1,!0);n.translate(0,17,0);for(let r=0;r<2;r++){let a=new $e(n,new Tt({color:16777215,transparent:!0,opacity:0,blending:Lt,depthWrite:!1,side:Nt,fog:!1}));a.visible=!1,this.scene.add(a),this.pillars.push({m:a,t:0,T:.7})}let s=new Tt({color:16777215,transparent:!0,blending:Lt,depthWrite:!1,side:Nt});this.projGeoFlat=new Ri(.5,1.05,24,1,-1.05,2.1).rotateX(-Math.PI/2),this.projGeoUp=new Ri(.45,.95,24,1,-1.05,2.1),this.projMat=s,this.orbGeo=new Pi(.42,16,12),this.orbMat=new Tt({color:16774084}),this.cones=[],this.objs=new Map,this.spare=[],this.wallGeo=new Mn(1,1,1).translate(0,.5,0),this.turretGeo=[new Jt(.75,.95,.5,8).translate(0,.25,0),new Pi(.5,16,12).translate(0,.95,0),new Mn(1.1,.2,.2).translate(.6,.95,0)],this.turretMat=new pn({color:9081768,metalness:.9,roughness:.35}),window.addEventListener("resize",()=>this.stage.resize())}setMatch(e,t){this.clearObjects();for(let n of this.spare)this.scene.remove(n.group),Qu(n);this.spare=[];for(let n of this.tops)this.scene.remove(n.group,n.light,...n.orbs),n.trail.dispose(this.scene),Qu(n);if(this.tops=[],this.world=e,this.playerSide=t,!!e){for(let n of e.tops){let s=Ku(n.blade,this.glow);s.trail=new Oc(this.scene,n.blade.color),s.light=new mi(n.blade.color,26,13,1.7),s.drop=0,s.dropV=0,s.fall=0,s.hold=!1,s.ox=0,s.oz=0,s.hover=0,s.orbs=[];for(let r=0;r<Re.satellite.count;r++){let a=new gn;a.add(new $e(this.orbGeo,this.orbMat));let o=new Ai(new fi({map:this.glow,color:n.blade.color,blending:Lt,depthWrite:!1,transparent:!0}));o.scale.setScalar(2.6),a.add(o),a.visible=!1,this.scene.add(a),s.orbs.push(a)}this.scene.add(s.group,s.light),this.tops.push(s)}this.clearRound()}}clearRound(){for(let e of this.projs.values())this.scene.remove(e.group);this.projs.clear(),this.telegraphs.length=0,this.markers.length=0,this.scorch.length=0,this.cones.length=0,this.clearObjects(),this.focus=null;for(let e of this.tops)e.trail.reset(),e.fall=0,e.shieldAlpha=0,e.group.visible=!0}launch(e,t=9){let n=this.tops[e];n.drop=t,n.dropV=0}colorOf(e){return e.blade.color}dangerOf(e){return e.side===this.playerSide?Hi:Ff}pick(e,t){let n=this.stage;this.raycaster.setFromCamera(new se(e/n.width*2-1,-(t/n.height)*2+1),this.camera);let s=this.raycaster.ray.origin,r=this.raycaster.ray.direction;if(r.y>-.01)return null;let a=0,o=0,l=0;for(let c=0;c<5;c++){let h=(a-s.y)/r.y;o=s.x+r.x*h,l=s.z+r.z*h,a=Ve(o,l)}return{x:o,z:l,inside:Math.hypot(o,l)<=ut.R}}toScreen(e,t,n){return sd.set(e,t,n).project(this.camera),{x:(sd.x*.5+.5)*this.stage.width,y:(-sd.y*.5+.5)*this.stage.height}}addShake(e){this.shake=Math.min(1.3,this.shake+e)}handle(e){let t=this.particles,n=this.waves,s=this.flashes;switch(e.type){case"clash":{let r=Ve(e.x,e.z)+.85,a=e.power,o=Math.min(150,14+a*4),l=-e.nz,c=e.nx;if(t.burst(e.x,r,e.z,o*.4,_s,9+a*.7,{dx:l,dz:c,bias:.6,up:.7,life:.55,size:.17}),t.burst(e.x,r,e.z,o*.4,_s,9+a*.7,{dx:-l,dz:-c,bias:.6,up:.7,life:.55,size:.17}),t.burst(e.x,r,e.z,o*.2,this.colorOf(e.a),6+a*.4,{up:1,life:.7,size:.2}),t.burst(e.x,r,e.z,o*.2,this.colorOf(e.b),6+a*.4,{up:1,life:.7,size:.2}),n.spawn(e.x,r-.7,e.z,.4,1.8+a*.16,.32,16777215,.8),s.flash(e.x,r,e.z,2.2+a*.16,.18,_s,.8,40+a*7),this.addShake(a*.014),a>16&&(this.punch=Math.max(this.punch,Math.min(1,a/34))),e.kind==="parry")n.spawn(e.x,r-.7,e.z,.5,7,.5,Bc,1),n.spawn(e.x,r-.6,e.z,.3,4,.35,16777215,1),t.burst(e.x,r,e.z,110,Bc,22,{up:.5,life:.7,size:.3,gravity:8}),s.flash(e.x,r,e.z,11,.35,16773296,1,220),this.addShake(.5);else if(e.kind==="dash"||e.kind==="empower"){let h=e.src,u=h===e.a?1:-1;n.spawn(e.x,r-.7,e.z,.5,6,.45,this.colorOf(h),1),t.burst(e.x,r,e.z,120,this.colorOf(h),26,{dx:e.nx*u,dz:e.nz*u,bias:.65,up:.5,life:.6,size:.3,gravity:6}),s.flash(e.x,r,e.z,9,.3,this.colorOf(h),1,180),this.addShake(.45)}break}case"wall":{let r=Ve(e.x,e.z)+.6,a=e.slam?16738874:this.colorOf(e.top);t.burst(e.x,r,e.z,8+e.power*2.5,e.slam?16756858:_s,7+e.power*.6,{dx:-e.nx,dz:-e.nz,bias:.55,up:.8,life:.5}),s.flash(e.x,r,e.z,2+e.power*.2,.2,a,.9,e.slam?120:0),this.stage.pulseRim(a,Math.min(1,.25+e.power/14)),this.addShake(e.power*(e.slam?.03:.012));break}case"bump":{let r=Ve(e.x,e.z)+.7;t.burst(e.x,r,e.z,10+e.power*2,_s,6+e.power*.5,{dx:e.nx,dz:e.nz,bias:.5,up:.8,life:.4}),s.flash(e.x,r,e.z,2+e.power*.15,.18,Vi,.8,0),this.addShake(e.power*.01);break}case"cast":e.windup>0&&this.telegraphs.push({top:e.top,key:e.key,skill:e.skill,t:0,T:e.windup,dx:e.dx,dz:e.dz,ax:e.ax,az:e.az});break;case"blink":{let r=e.top,a=Ve(r.x,r.z),o=this.colorOf(r);n.spawn(r.x,a+.1,r.z,.6,3.2,.3,o,.9),t.burst(r.x,a+.8,r.z,50,o,7,{up:1,life:.5,gravity:-3,drag:2}),t.burst(r.x,a+.8,r.z,20,16777215,4,{up:1,life:.35,gravity:0});break}case"blinkEnd":{let r=e.top,a=Ve(r.x,r.z),o=this.colorOf(r);n.spawn(r.x,a+.1,r.z,3,.8,.25,16777215,.9),t.burst(r.x,a+.8,r.z,40,o,9,{up:.8,life:.4,gravity:2}),s.flash(r.x,a+.8,r.z,5,.2,o,1,70);break}case"zone":{let r=e.zone,a=Ve(r.x,r.z),o=this.colorOf(e.top);r.kind==="sanctuary"?(n.spawn(r.x,a+.1,r.z,.5,r.r,.5,ys,1),n.spawn(r.x,a+.12,r.z,.3,r.r*.6,.4,o,1),t.burst(r.x,a+.3,r.z,80,o,9,{flat:!0,life:.6,gravity:-5,drag:2.5}),s.flash(r.x,a+1,r.z,9,.4,o,.9,120)):r.kind!=="quake"&&r.kind!=="grenade"&&r.kind!=="lotus"&&(n.spawn(r.x,a+.1,r.z,.4,Math.max(2,r.r),.4,o,.9),t.burst(r.x,a+.4,r.z,40,o,8,{up:1,life:.5,gravity:4}),r.skill.ult&&(s.flash(r.x,a+1,r.z,12,.5,o,1,220),this.stage.pulseRim(o,.8),this.addShake(.3)));break}case"zoneEnd":{let r=e.zone;if(t0[r.kind]){let a=si(r),o=Ve(a.x,a.z);t.burst(a.x,o+.8,a.z,36,this.colorOf(r.owner),8,{up:1,life:.5,gravity:6})}break}case"blast":{let r=Ve(e.x,e.z),a=this.colorOf(e.top),o=!!e.skill.ult,l=e.r;n.spawn(e.x,r+.12,e.z,.4,l*1.2,.45,16777215,.9),n.spawn(e.x,r+.14,e.z,.3,l,.4,a,1),t.burst(e.x,r+.4,e.z,o?220:70+l*14,a,10+l*3,{up:.7,life:.6,size:.28,gravity:12}),t.burst(e.x,r+.3,e.z,30+l*8,16777215,8+l*4,{flat:!0,life:.35,gravity:0,drag:3}),s.flash(e.x,r+1,e.z,3+l*2.2,.3,a,1,o?380:90+l*20),this.scorch.push({x:e.x,z:e.z,t:0,T:o?1.8:.8,color:a,r:l}),e.skill.inner&&this.scorch.push({x:e.x,z:e.z,t:0,T:.8,color:16777215,r:e.skill.inner}),o&&(this.stage.pulseRim(a,1),this.punch=1),this.addShake(o?.9:e.hit?.4:.15),e.hit&&!o&&(this.punch=Math.max(this.punch,.5));break}case"strike":{let r=Ve(e.x,e.z)+.9,a=this.colorOf(e.src);t.burst(e.x,r,e.z,e.big?200:70,a,e.big?28:16,{up:.8,life:.5,size:.28,gravity:8}),t.burst(e.x,r,e.z,24,16777215,10,{up:1,life:.35}),n.spawn(e.x,r-.8,e.z,.3,e.big?7:3.2,.35,a,1),s.flash(e.x,r,e.z,e.big?14:5,.25,a,1,e.big?320:90),this.addShake(e.big?.9:.22),e.big&&(this.punch=1,this.stage.pulseRim(a,1));break}case"warp":{let r=e.top,a=this.colorOf(r);for(let[o,l]of[[e.fx,e.fz],[r.x,r.z]]){let c=Ve(o,l);n.spawn(o,c+.1,l,.5,3,.3,a,.9),t.burst(o,c+.8,l,46,Math.random()<.5?a:16777215,8,{up:1,life:.45,gravity:-2,drag:2})}s.flash(r.x,Ve(r.x,r.z)+.8,r.z,6,.22,a,1,90),this.tops[r.side].ox=this.tops[r.side].oz=0,this.tops[r.side].trail.reset();break}case"buff":{let r=e.top,a=Ve(r.x,r.z),o=this.colorOf(r);n.spawn(r.x,a+.1,r.z,e.off?3:.6,e.off?.8:3.4,.4,o,.9),e.off||t.burst(r.x,a+.6,r.z,e.skill.ult?120:40,o,9,{up:1,life:.6,gravity:-5,drag:1.5}),e.skill.ult&&(s.flash(r.x,a+1,r.z,10,.45,o,1,220),this.stage.pulseRim(o,.8),this.addShake(.25));break}case"cone":{let r=e.top,a=this.colorOf(r);this.cones.push({x:r.x,z:r.z,dx:e.dx,dz:e.dz,t:0,T:.35,color:a,skill:e.skill}),e.hit&&this.siphon(e.target,r,24,a),this.addShake(e.hit?.3:.1);break}case"fling":{let r=e.top,a=Ve(r.x,r.z),o=this.colorOf(r);n.spawn(r.x,a+.1,r.z,.6,4,.35,o,1),t.burst(r.x,a+.8,r.z,60,o,14,{up:1,life:.5,gravity:6}),this.addShake(.3);break}case"chan":{let r=e.top,a=Ve(r.x,r.z),o=this.colorOf(r);n.spawn(r.x,a+.1,r.z,6,1,.5,o,.9),s.flash(r.x,a+1,r.z,10,.4,o,1,200),this.stage.pulseRim(o,.8);break}case"egg":case"rebirth":{let r=e.top,a=Ve(r.x,r.z),o=e.type==="rebirth";n.spawn(r.x,a+.1,r.z,o?.6:4,o?6:.8,.6,Vi,1),t.burst(r.x,a+.8,r.z,o?200:90,Vi,o?20:9,{up:1,life:.8,size:.3,gravity:o?8:-3}),s.flash(r.x,a+1,r.z,o?16:8,.5,Vi,1,o?360:160),o&&(this.stage.pulseRim(this.colorOf(r),1),this.addShake(.5));break}case"quake":{let r=Ve(e.x,e.z),a=this.colorOf(e.top);n.spawn(e.x,r+.12,e.z,.5,e.r*1.35,.5,16777215,1),n.spawn(e.x,r+.14,e.z,.3,e.r,.4,a,1),t.burst(e.x,r+.2,e.z,150,a,24,{dy:1,bias:.75,up:1,life:.8,size:.32,gravity:30}),t.burst(e.x,r+.2,e.z,70,14207136,14,{dy:1,bias:.5,up:1,life:.9,size:.26,gravity:24});for(let l=0;l<40;l++){let c=Math.random()*6.283,h=Math.random()*e.r;t.emit(e.x+Math.cos(c)*h,r+.1,e.z+Math.sin(c)*h,0,9+Math.random()*14,0,.5,.3,a,26,.5)}s.flash(e.x,r+1,e.z,e.r*3.2,.3,a,1,200);let o=this.pillars[0].m.visible?this.pillars[1]:this.pillars[0];o.t=0,o.T=.45,o.r=e.r*.8,o.m.scale.y=.22,o.m.visible=!0,o.m.position.set(e.x,r,e.z),o.m.material.color.set(a),this.scorch.push({x:e.x,z:e.z,t:0,T:1.2,color:a,r:e.r}),this.addShake(e.hit?.6:.3),e.hit&&(this.punch=Math.max(this.punch,.7));break}case"charge":{let r=e.top,a=Ve(r.x,r.z),o=this.colorOf(r);n.spawn(r.x,a+.1,r.z,e.skill.aoe,1,e.T,o,.8),s.flash(r.x,a+1,r.z,7,.4,o,1,120),this.addShake(.2);break}case"nova":{let r=Ve(e.x,e.z),a=this.colorOf(e.top),o=Re.nova.aoe;n.spawn(e.x,r+.12,e.z,1,o*1.15,.5,16777215,1),n.spawn(e.x,r+.14,e.z,.6,o,.65,a,1),n.spawn(e.x,r+.16,e.z,.3,o*1.7,.9,a,.5),t.burst(e.x,r+.5,e.z,320,a,42,{flat:!0,life:.55,size:.36,gravity:0,drag:3.2}),t.burst(e.x,r+.5,e.z,180,16777215,26,{up:.6,life:.8,size:.3,gravity:12}),s.flash(e.x,r+1,e.z,28,.5,16777215,1,520),s.flash(e.x,r+1,e.z,18,.8,a,1,0),this.scorch.push({x:e.x,z:e.z,t:0,T:2,color:a,r:o}),this.stage.pulseRim(a,1),this.addShake(1.1),this.punch=1;break}case"flare":{let r=e.top,a=Ve(r.x,r.z)+.8,o=Re.flare,l=Math.atan2(e.dz,e.dx);for(let c=0;c<170;c++){let h=l+(Math.random()*2-1)*o.half,u=(.35+Math.random()*.65)*o.range*3.4,d=Math.random()<.3?16777215:Math.random()<.5?this.colorOf(r):16738858;t.emit(r.x+Math.cos(h)*1.2,a+(Math.random()-.5)*.6,r.z+Math.sin(h)*1.2,Math.cos(h)*u,Math.random()*3,Math.sin(h)*u,.3+Math.random()*.25,.34,d,-3,3.4)}this.cones.push({x:r.x,z:r.z,dx:e.dx,dz:e.dz,t:0,T:.35,color:this.colorOf(r),skill:o}),s.flash(r.x+e.dx*2,a,r.z+e.dz*2,8,.25,16752704,1,140),this.addShake(e.hit?.35:.12),e.hit&&this.siphon(e.target,r,26,ys);break}case"orbs":{let r=e.top,a=Ve(r.x,r.z);n.spawn(r.x,a+.1,r.z,.6,Re.satellite.orbit+.6,.35,this.colorOf(r),1),t.burst(r.x,a+.8,r.z,40,16774084,8,{up:1,life:.5,gravity:0,drag:2});break}case"orbHit":{let r=Ve(e.x,e.z)+.9,a=this.colorOf(e.top);t.burst(e.x,r,e.z,70,a,16,{up:.8,life:.5,size:.26,gravity:8}),t.burst(e.x,r,e.z,24,16777215,9,{up:1,life:.35}),n.spawn(e.x,r-.8,e.z,.3,3,.3,a,1),s.flash(e.x,r,e.z,5,.2,a,1,90),this.addShake(.2);break}case"tether":{let r=e.top,a=Ve(r.x,r.z),o=this.colorOf(r);n.spawn(r.x,a+.1,r.z,.6,5,.5,o,1),n.spawn(e.target.x,Ve(e.target.x,e.target.z)+.1,e.target.z,4,.8,.4,o,1),s.flash(r.x,a+1,r.z,10,.4,o,1,200),this.stage.pulseRim(o,.8),this.addShake(.3);break}case"tetherEnd":{let r=e.top,a=Ve(r.x,r.z);n.spawn(r.x,a+.1,r.z,.6,3.5,.4,e.broke?16777215:ys,.9);break}case"heal":{let r=e.top;t.burst(r.x,Ve(r.x,r.z)+.6,r.z,20,ys,3,{up:1,life:.7,gravity:-6,drag:1});break}case"shoot":{let r=e.proj,a=this.colorOf(e.top),o=Ve(r.x,r.z)+.8;t.burst(r.x,o,r.z,40,a,16,{dx:r.dx,dz:r.dz,bias:.7,up:.4,life:.35,gravity:4}),s.flash(r.x,o,r.z,5,.18,a,1,60),n.spawn(r.x-r.dx*.9,o-.7,r.z-r.dz*.9,.6,2.6,.3,a,.7);break}case"reflect":{let r=this.colorOf(e.top),a=Ve(e.x,e.z)+.8;t.burst(e.x,a,e.z,70,Bc,18,{up:.6,life:.5,gravity:6}),n.spawn(e.x,a-.6,e.z,.4,5,.4,Bc,1),s.flash(e.x,a,e.z,8,.28,16773296,1,160),this.addShake(.3);break}case"projHit":{let r=Ve(e.x,e.z)+.8,a=this.colorOf(e.proj.owner);t.burst(e.x,r,e.z,90,a,22,{dx:e.dx,dz:e.dz,bias:.55,up:.6,life:.55,size:.28,gravity:8}),t.burst(e.x,r,e.z,30,16777215,12,{up:1,life:.4}),n.spawn(e.x,r-.7,e.z,.4,4.5,.4,a,1),s.flash(e.x,r,e.z,7,.25,a,1,150),this.addShake(.32),this.punch=Math.max(this.punch,.5);break}case"projEnd":{t.burst(e.x,Ve(e.x,e.z)+.8,e.z,18,this.colorOf(e.proj.owner),6,{life:.35,gravity:3});break}case"guard":{let r=e.top,a=Ve(r.x,r.z);n.spawn(r.x,a+.1,r.z,.6,3,.35,16777215,.9),t.burst(r.x,a+.8,r.z,40,this.colorOf(r),8,{up:1,life:.5,gravity:-4});break}case"dash":{let r=e.top,a=Ve(r.x,r.z),o=this.colorOf(r);n.spawn(r.x,a+.1,r.z,.6,4,.35,o,1),t.burst(r.x,a+.6,r.z,60,o,18,{dx:-e.dx,dz:-e.dz,bias:.7,up:.4,life:.45,gravity:4}),s.flash(r.x,a+.8,r.z,5,.2,o,1,80),this.telegraphs=this.telegraphs.filter(l=>!(l.top===r&&l.key==="E"));break}case"leap":{let r=e.top,a=Ve(r.x,r.z),o=this.colorOf(r);n.spawn(r.x,a+.1,r.z,.6,6,.5,o,1),n.spawn(r.x,a+.15,r.z,.4,3.5,.35,16777215,1),t.burst(r.x,a+.5,r.z,120,o,14,{up:1,bias:.4,dy:1,life:.8,gravity:2}),s.flash(r.x,a+1,r.z,9,.35,o,1,200),this.addShake(.3),this.telegraphs.push({top:r,key:"R",skill:Re.meteor,t:0,T:e.T,ax:e.tx,az:e.tz});break}case"meteor":{let r=Ve(e.x,e.z),a=this.colorOf(e.top),o=Re.meteor.aoe;n.spawn(e.x,r+.12,e.z,.8,o*1.5,.7,16777215,1),n.spawn(e.x,r+.14,e.z,.5,o*1.15,.55,a,1),n.spawn(e.x,r+.16,e.z,.3,o*2.3,1,16753226,.6),t.burst(e.x,r+.4,e.z,320,a,34,{up:.75,life:.9,size:.34,gravity:14}),t.burst(e.x,r+.4,e.z,160,16767392,22,{up:1,life:1.1,size:.3,gravity:9}),t.burst(e.x,r+.2,e.z,120,16777215,40,{flat:!0,life:.4,size:.3,gravity:0,drag:3}),s.flash(e.x,r+1,e.z,26,.5,16777215,1,520),s.flash(e.x,r+1,e.z,16,.8,a,1,0);let l=this.pillars[0].m.visible?this.pillars[1]:this.pillars[0];l.t=0,l.T=.7,l.r=o*.55,l.m.scale.y=1,l.m.visible=!0,l.m.position.set(e.x,r,e.z),l.m.material.color.set(a),this.scorch.push({x:e.x,z:e.z,t:0,T:2.6,color:a,r:o}),this.stage.pulseRim(a,1),this.addShake(1.1),this.punch=1;break}case"ringout":{let r=Zi(ut.R)+.8,a=e.x+e.nx,o=e.z+e.nz;t.burst(a,r,o,200,16742986,26,{dx:e.nx,dy:.7,dz:e.nz,bias:.5,up:1,life:.9,size:.32,gravity:12}),t.burst(a,r,o,80,16777215,16,{up:1,life:.6}),s.flash(a,r,o,14,.5,16747098,1,400),this.stage.pulseRim(16726826,1.6),this.addShake(.9),this.punch=1;break}case"finish":{let r=e.loser;if(e.kind!=="over"&&e.kind!=="time"){let a=Ve(r.x,r.z)+.8;t.burst(r.x,a,r.z,220,this.colorOf(r),24,{up:1,life:1,size:.32,gravity:10}),t.burst(r.x,a,r.z,90,16777215,30,{flat:!0,life:.5,gravity:0,drag:3}),n.spawn(r.x,a-.7,r.z,.6,9,.8,16777215,1),n.spawn(r.x,a-.65,r.z,.4,5.5,.6,this.colorOf(e.winner),1),s.flash(r.x,a,r.z,18,.6,16777215,1,420),this.addShake(.8)}this.focus={top:r,w:.6,zoom:.78};break}}}syncProjectiles(){let e=new Set;for(let t of this.world.projectiles){e.add(t.id);let n=this.projs.get(t.id);if(!n){let s=new gn,r=this.projMat.clone();s.add(new $e(this.projGeoFlat,r),new $e(this.projGeoUp,r)),t.skill.chain&&(s.children[0].scale.setScalar(.6),s.children[1].scale.setScalar(.6));let a=new Ai(new fi({map:this.glow,blending:Lt,depthWrite:!1,transparent:!0}));a.scale.setScalar(4.5),s.add(a),this.scene.add(s),n={proj:t,group:s,mat:r,sprite:a,side:-1},this.projs.set(t.id,n)}if(n.proj=t,n.side!==t.owner.side){n.side=t.owner.side;let s=this.colorOf(t.owner);n.mat.color.set(s).multiplyScalar(1.5),n.sprite.material.color.set(s)}n.group.rotation.y=Math.atan2(-t.dz,t.dx),n.group.scale.setScalar(Math.max(.6,t.r/.85))}for(let t of[...this.projs.keys()])e.has(t)||this.dropProj(t)}capture(){return this.world.tops.map(e=>({x:e.x,z:e.z}))}absorb(e){this.world.tops.forEach((t,n)=>{let s=this.tops[n],r=e[n].x+s.ox-t.x,a=e[n].z+s.oz-t.z;Math.hypot(r,a)>3.5||t.air||t.out?s.ox=s.oz=0:(s.ox=r,s.oz=a)})}syncObjects(e){let t=new Set;for(let n of this.world.zones){let s=t0[n.kind];if(!s||n.dead)continue;t.add(n.id);let r=this.objs.get(n.id);r||(r=this.makeObject(n,s),this.objs.set(n.id,r));let a=si(n),o=Ve(a.x,a.z),l=this.colorOf(n.owner),c=n.T-n.t,h=c>.8||Math.sin(this.time*34)>-.3;if(r.group.visible=h,r.group.position.set(a.x,o,a.z),s==="clone")r.top.spin.rotation.y-=34*e,r.top.blur.rotation.z+=11*e,r.group.rotation.set(.05*Math.cos(this.time*3+n.id),0,.05*Math.sin(this.time*3+n.id));else if(s==="turret"){let u=this.world.other(n.owner);r.group.rotation.y=Math.atan2(-(u.z-n.z),u.x-n.x),r.group.scale.setScalar(n.c?1.6:1),r.mat.color.set(l).multiplyScalar(n.a>0?2.4+Math.sin(this.time*40):1.4)}else{let u=n.skill;r.group.rotation.y=Math.atan2(a.nx,a.nz),r.group.scale.set(u.wall*2,n.kind==="windwall"?3.2:2.3,n.kind==="windwall"?.25:.7),r.mat.color.set(n.kind==="icewall"?Vi:l),r.mat.opacity=(n.kind==="windwall"?.14:.26)*Math.min(1,n.t/.15)*(.85+.15*Math.sin(this.time*9))}}for(let[n,s]of this.objs)t.has(n)||(this.dropObject(s),this.objs.delete(n))}makeObject(e,t){let n=this.colorOf(e.owner);if(t==="clone"){let a=e.owner.side+e.kind,o=this.spare.findIndex(c=>c.key===a),l=o>=0?this.spare.splice(o,1)[0]:null;return l||(l=Ku(e.owner.blade,this.glow),l.key=a,l.shield.visible=!1,e.kind==="shadow"&&l.group.traverse(c=>{c.material&&c.material.color&&c!==l.aura&&c!==l.blur&&c.material.color.multiplyScalar(.22)}),l.group.scale.setScalar(e.kind==="shadow"?1:.86),l.aura.material.opacity=.35,l.blurMat.opacity=.2,this.scene.add(l.group)),{kind:t,group:l.group,top:l}}let s=new gn;if(t==="turret"){let a=new Tt({color:n});return s.add(new $e(this.turretGeo[0],this.turretMat),new $e(this.turretGeo[1],a),new $e(this.turretGeo[2],this.turretMat)),this.scene.add(s),{kind:t,group:s,mat:a}}let r=new Tt({color:n,transparent:!0,opacity:0,blending:Lt,depthWrite:!1,side:Nt});return s.add(new $e(this.wallGeo,r)),this.scene.add(s),{kind:t,group:s,mat:r}}dropObject(e){if(e.kind==="clone"){e.group.visible=!1,this.spare.push(e.top);return}this.scene.remove(e.group),e.mat.dispose()}clearObjects(){for(let e of this.objs.values())this.dropObject(e);this.objs.clear()}dropProj(e){let t=this.projs.get(e);t&&(this.scene.remove(t.group),t.mat.dispose(),t.sprite.material.dispose(),this.projs.delete(e))}marker(e,t){this.markers.push({x:e,z:t,t:0})}update(e,t,n){this.time+=t;let s=this.ground,r=this.particles,a=this.world;if(s.begin(),a){for(let c of a.tops)this.updateTop(c,this.tops[c.side],e,t);this.syncProjectiles(),this.syncObjects(e);for(let c of this.projs.values()){let h=c.proj,u=Ve(h.x,h.z)+.85;if(c.group.position.set(h.x,u,h.z),h.skill.chain&&this.chain(h.owner.x,h.owner.z,h.x,h.z,this.colorOf(h.owner),1),h.skill.re){let d=Re[h.skill.re].aoe;s.ring(h.x,h.z,d-.1,d,this.dangerOf(h.owner),.55),s.ring(h.x,h.z,0,d,this.dangerOf(h.owner),.06)}if(c.group.children[1].rotation.x+=e*22,e>0)for(let d=0;d<3;d++)r.emit(h.x-h.dx*Math.random()*1.2+(Math.random()-.5)*.9,u+(Math.random()-.5)*.8,h.z-h.dz*Math.random()*1.2+(Math.random()-.5)*.9,-h.dx*4,Math.random()*2,-h.dz*4,.3,.3,this.colorOf(h.owner),0,1)}this.drawTelegraphs(e),this.drawOngoing(e);let l=a.tops[this.playerSide];if(!a.result&&!l.out){if(l.air||s.ring(l.x,l.z,1.55,1.63,16777215,.45),l.cmd){let c=.5+.5*Math.sin(this.time*10);s.ring(l.cmd.x,l.cmd.z,.25+c*.1,.42+c*.1,Hi,.8);let h=l.cmd.x-l.x,u=l.cmd.z-l.z,d=Math.hypot(h,u);d>1.6&&s.rect(l.x+h/d*1.4,l.z+u/d*1.4,h/d,u/d,d-1.8,.035,Hi,.35)}n&&this.drawAim(n,l,a)}}for(let l of this.markers){l.t+=t;let c=l.t/.45;if(c<1){let h=1.5-1.1*c;s.ring(l.x,l.z,h-.12,h,Hi,1-c),s.ring(l.x,l.z,0,.18,16777215,1-c)}}this.markers.length&&this.markers[0].t>.45&&this.markers.shift();for(let l of this.scorch){l.t+=e;let c=l.t/l.T;c<1&&(s.ring(l.x,l.z,0,l.r*(.9+.1*c),16742954,.22*(1-c)*(1-c)),s.ring(l.x,l.z,l.r*.92,l.r,l.color,.6*(1-c)))}this.scorch.length&&this.scorch[0].t>this.scorch[0].T&&this.scorch.shift();for(let l of this.pillars){if(!l.m.visible)continue;l.t+=t;let c=l.t/l.T;if(c>=1){l.m.visible=!1;continue}l.m.material.opacity=.75*(1-c)*(1-c),l.m.scale.x=l.m.scale.z=l.r*(1-.6*c)}let o=Math.max(e,t*.12);r.update(o),this.waves.update(o),this.flashes.update(o),this.stage.update(t,this.time),this.updateCamera(t)}updateTop(e,t,n,s){let r=this.particles,a=Ve(e.x,e.z),o=e.egg>0,l=o?.06:Ht(e),c=this.colorOf(e),h=0;t.hold?t.drop=7+Math.sin(this.time*3+e.side*2)*.18:t.drop>0&&(t.dropV+=60*s,t.drop-=t.dropV*s,t.drop<=0&&(t.drop=0,this.waves.spawn(e.x,a+.1,e.z,.5,4.5,.45,c,1),r.burst(e.x,a+.3,e.z,70,c,13,{up:.6,life:.6}),r.burst(e.x,a+.3,e.z,30,_s,9,{up:.9,life:.5}),this.flashes.flash(e.x,a+.6,e.z,6,.25,c,1,120),this.addShake(.28),this.landed=(this.landed||0)+1)),e.out?h=Zi(ut.R)-a+e.out.y:e.air&&(h=Math.sin(Math.PI*Math.min(1,e.air.t/e.air.T))*e.air.skill.height),t.hover+=((e.up>0?1:0)-t.hover)*Math.min(1,s*16),h+=t.drop+t.hover*(2.1+.25*Math.sin(this.time*11));let u=a+h,d=Math.exp(-s*14);t.ox*=d,t.oz*=d,t.group.position.set(e.x+t.ox,u,e.z+t.oz),t.group.visible=!(e.out&&e.out.t>2.2),t.light.position.set(e.x+t.ox,u+3.2,e.z+t.oz),t.light.intensity=t.group.visible?2+4*l+(e.dash||e.air?8:0):0;let f=e.spin<=0&&!e.out;t.fall=f?Math.min(1,t.fall+s*1.6):0;let m=(5+42*l)*(1-t.fall);t.spin.rotation.y-=e.dir*m*n,t.blur.rotation.z+=11*n,t.blurMat.opacity=(.05+.2*l)*(1-t.fall),t.wobble+=(2.4+7*(1-l))*n;let x=o?0:.03+.4*Math.pow(1-l,2.2)+(e.tumble>0||e.up>0?.14:0);x=x*(1-t.fall)+.62*t.fall,e.out?(t.group.rotation.x+=s*7,t.group.rotation.z+=s*5):t.group.rotation.set(x*Math.cos(t.wobble)+e.vz*.006,0,x*Math.sin(t.wobble)-e.vx*.006),t.group.scale.setScalar(e.air?1+.35*Math.sin(Math.PI*Math.min(1,e.air.t/e.air.T)):o?.8:1),t.spin.visible=t.blur.visible=!e.blink;let g=e.ult>=100&&!this.world.result;t.aura.material.opacity=(.1+.16*l+(g?.22+.14*Math.sin(this.time*9):0))*(1-t.fall),t.aura.visible=h<.5,t.aura.scale.setScalar(g?7.5:5.5),t.body.emissiveIntensity=.14+(g?.25+.15*Math.sin(this.time*9):0)+(e.dash?.8:0)+(e.empower>0?.5+.3*Math.sin(this.time*30):0)+(e.charge||e.chan?1.2:0)+(e.buff>0?.45+.2*Math.sin(this.time*14):0);let p=e.guard>0||o?1:e.shield>0?.5:0;if(t.shieldAlpha+=(p-t.shieldAlpha)*Math.min(1,s*14),t.shield.visible=t.shieldAlpha>.02,t.shield.visible){t.shieldMat.uniforms.uTime.value=this.time;let v=e.guard>0&&e.guard<.35?.5+.5*Math.sin(this.time*50):1;t.shieldMat.uniforms.uAlpha.value=t.shieldAlpha*v,t.shield.rotation.y+=s*2}if(t.trail.boost=e.dash||e.blink?1:e.air?.6:e.empower>0?.5:0,!e.out&&t.drop<=0&&t.trail.push(e.x+t.ox,e.z+t.oz,h),t.trail.update(s),n<=0||e.out)return;let S=Math.hypot(e.vx,e.vz),A=(v,w,E)=>{for(let P=0;P<E;P++)r.emit(e.x+(Math.random()-.5)*1.8,u+.3+Math.random()*1.2,e.z+(Math.random()-.5)*1.8,0,w,0,.5,.2,v,w<0?6:-2,1)};if(e.bleed>0&&Math.random()<.12*e.bleed&&A(Vc,-1,1),e.poison>0&&Math.random()<.5&&A(Hc,1.5,1),e.buff>0&&Math.random()<.5&&A(c,3,1),e.toggle&&Math.random()<.7&&A(Hc,.5,1),e.blink){for(let v=0;v<8;v++)r.emit(e.x+(Math.random()-.5)*1.2,a+.3+Math.random()*1.2,e.z+(Math.random()-.5)*1.2,0,Math.random(),0,.4,.4,Math.random()<.3?16777215:c,0,2);return}if(e.empower>0&&Math.random()<.8){let v=Math.random()*6.283;r.emit(e.x+Math.cos(v)*1.3,a+.4+Math.random()*.9,e.z+Math.sin(v)*1.3,-Math.sin(v)*6,1,Math.cos(v)*6,.25,.26,Math.random()<.5?16777215:c,0,1)}if(e.dash)for(let v=0;v<6;v++)r.emit(e.x+(Math.random()-.5)*1.6,u+.3+Math.random()*.9,e.z+(Math.random()-.5)*1.6,-e.vx*.1,Math.random()*2,-e.vz*.1,.35,.34,c,0,2);else if(e.air)for(let v=0;v<5;v++)r.emit(e.x+(Math.random()-.5)*1.4,u+Math.random(),e.z+(Math.random()-.5)*1.4,(Math.random()-.5)*3,-4,(Math.random()-.5)*3,.5,.36,Math.random()<.5?c:16761466,4,1);else{if(Math.random()<S*.03*(f?0:1)&&r.emit(e.x,a+.08,e.z,-e.vx*.2+(Math.random()-.5)*3,1.5+Math.random()*2.5,-e.vz*.2+(Math.random()-.5)*3,.35,.14,_s,14,1),g&&Math.random()<.5){let v=Math.random()*6.283;r.emit(e.x+Math.cos(v)*1.2,a+.2,e.z+Math.sin(v)*1.2,0,3+Math.random()*3,0,.6,.2,c,-2,.5)}e.slow>0&&Math.random()<.4&&r.emit(e.x+(Math.random()-.5)*1.6,a+1.4,e.z+(Math.random()-.5)*1.6,0,-1.5,0,.5,.2,10138879,0,.5),l<.25&&!f&&Math.random()<.3&&r.emit(e.x+(Math.random()-.5),a+.1,e.z+(Math.random()-.5),(Math.random()-.5)*4,2+Math.random()*2,(Math.random()-.5)*4,.4,.16,16747082,12,1)}}chain(e,t,n,s,r,a){let o=n-e,l=s-t,c=Math.hypot(o,l);c<.5||(this.ground.rect(e,t,o/c,l/c,c,.07,r,.9*a,.85),this.ground.rect(e,t,o/c,l/c,c,.2,r,.22*a,.84))}siphon(e,t,n,s){let r=Ve(e.x,e.z)+.9;for(let a=0;a<n;a++){let o=.3+Math.random()*.3,l=e.x+(Math.random()-.5)*1.6,c=e.z+(Math.random()-.5)*1.6;this.particles.emit(l,r+(Math.random()-.5),c,(t.x-l)/o,(Math.random()-.5)*2,(t.z-c)/o,o,.3,s,0,0)}}drawOngoing(e){let t=this.ground,n=this.particles,s=this.world;for(let r of s.zones){let a=Math.min(1,r.t/r.T);if(!this.drawZone(r,a,e))if(r.kind==="quake"||r.kind==="grenade"){let o=this.dangerOf(r.owner),l=.5+.5*Math.sin(this.time*20);if(t.ring(r.x,r.z,0,r.r,o,.1+.08*l),t.ring(r.x,r.z,0,r.r*a,o,.26),t.ring(r.x,r.z,r.r-.13,r.r,o,.95),e>0&&Math.random()<.6){let c=Math.random()*6.283,h=Math.random()*r.r;n.emit(r.x+Math.cos(c)*h,Ve(r.x,r.z)+.1,r.z+Math.sin(c)*h,0,2+Math.random()*3,0,.3,.16,14207136,10,1)}}else{let o=this.colorOf(r.owner),l=Math.min(1,(r.T-r.t)/.5,r.t/.2),c=.5+.5*Math.sin(this.time*3);if(t.ring(r.x,r.z,0,r.r,o,(.1+.05*c)*l),t.ring(r.x,r.z,0,r.r*.55,ys,.07*l),t.ring(r.x,r.z,r.r-.12,r.r,o,.85*l),t.ring(r.x,r.z,r.r-.42,r.r-.28,16777215,.7*l,.1,-Math.PI/2,-Math.PI/2+Math.PI*2*(1-a)),e>0)for(let h=0;h<2;h++){let u=Math.random()*6.283,d=Math.sqrt(Math.random())*r.r;n.emit(r.x+Math.cos(u)*d,Ve(r.x,r.z)+.1,r.z+Math.sin(u)*d,0,1.5+Math.random()*2.5,0,.9,.16,Math.random()<.5?ys:o,-1,.4)}}}for(let r of s.tops){let a=this.tops[r.side],o=this.colorOf(r),l=Ve(r.x,r.z);if(r.charge){let h=r.charge.skill,u=Math.min(1,r.charge.t/r.charge.T),d=this.dangerOf(r),f=.5+.5*Math.sin(this.time*22),m=h.inner||0;if(t.ring(r.x,r.z,m,h.aoe,d,.08+.07*f),t.ring(r.x,r.z,m,m+(h.aoe-m)*u,d,.22),t.ring(r.x,r.z,h.aoe-.14,h.aoe,d,.95),m&&t.ring(r.x,r.z,m-.08,m,d,.6),e>0)for(let x=0;x<6;x++){let g=Math.random()*6.283,p=3+Math.random()*4,S=.3;n.emit(r.x+Math.cos(g)*p,l+.3+Math.random()*1.5,r.z+Math.sin(g)*p,-Math.cos(g)*p/S,0,-Math.sin(g)*p/S,S,.3,o,0,0)}}for(let h=0;h<a.orbs.length;h++){let u=a.orbs[h];if(u.visible=!!(r.orbs&&r.orbs.alive&1<<h),!u.visible)continue;let d=s.orbPos(r,h),f=Ve(d.x,d.z)+.95;u.position.set(d.x,f,d.z),u.children[1].material.opacity=r.orbs.t<1?.5+.5*Math.sin(this.time*30):1,e>0&&n.emit(d.x,f,d.z,(Math.random()-.5)*2,Math.random()*1.5,(Math.random()-.5)*2,.35,.3,o,0,1)}if(r.tether){let h=s.other(r),u=.5+.5*Math.sin(this.time*26),d=h.x-r.x,f=h.z-r.z,m=Math.hypot(d,f)||1,x=r.tether.skill,g=x.safe??x.range,p=Sr((m-g)/(x.breakRange-g),0,1);t.rect(r.x,r.z,d/m,f/m,m,.12+.08*u,p>.5?16777215:o,.95,.9),t.rect(r.x,r.z,d/m,f/m,m,.5+.2*u,o,.2*(1-p*.7),.88),t.ring(h.x,h.z,1.5,1.7,o,.5+.4*u),e>0&&x.drain&&this.siphon(h,r,2,Math.random()<.5?o:ys),x.drain||t.ring(h.x,h.z,1.8,2,16777215,.8,.1,-Math.PI/2,-Math.PI/2+Math.PI*2*(r.tether.t/r.tether.T))}let c=s.other(r);if(r.chan){let h=r.chan.skill,u=this.dangerOf(r),d=Math.atan2(r.chan.dz,r.chan.dx),f=Sr((r.chan.t-h.first-(r.chan.n-1)*h.every)/h.every,0,1);t.sector(r.x,r.z,r.chan.dx,r.chan.dz,h.range,h.half,u,.07,.6),t.ring(r.x,r.z,0,h.range*f,u,.1,.09,d-h.half,d+h.half)}if(r.dmark>0){let h=.5+.5*Math.sin(this.time*16),u=r.dmark/Re.deathmark.dur;for(let[d,f]of[[.707,.707],[.707,-.707]])t.rect(c.x-d*1.9,c.z-f*1.9,d,f,3.8,.12,Vc,.7+.3*h,.12);t.ring(c.x,c.z,2,2.2,Vc,.9,.1,-Math.PI/2,-Math.PI/2+Math.PI*2*u)}if(c.mark>0&&t.ring(c.x,c.z,1.6,1.85,o,.6+.3*Math.sin(this.time*12)),c.bleed>0)for(let h=0;h<c.bleed;h++){let u=-Math.PI/2+(h-(c.bleed-1)/2)*.42;t.ring(c.x+Math.cos(u)*2.1,c.z+Math.sin(u)*2.1,0,.2,Vc,.95,.12)}r.ret&&r.side===this.playerSide&&(t.ring(r.ret.x,r.ret.z,1.1,1.25,o,.7),t.ring(r.ret.x,r.ret.z,0,1.1,o,.1))}for(let r of this.cones){r.t+=e;let a=r.t/r.T;a<1&&t.sector(r.x,r.z,r.dx,r.dz,r.skill.range,r.skill.half,r.color,.5*(1-a)*(1-a),.9*(1-a))}this.cones.length&&this.cones[0].t>this.cones[0].T&&this.cones.shift()}drawZone(e,t,n){let s=this.ground,r=this.particles,a=e.skill,o=this.colorOf(e.owner),l=this.dangerOf(e.owner),c=e.owner.side===this.playerSide,h=Math.min(1,(e.T-e.t)/.5,e.t/.2),u=Ve(e.x,e.z),d=(m,x,g)=>{let p=Math.random()*6.283,S=Math.sqrt(Math.random())*e.r;r.emit(e.x+Math.cos(p)*S,u+.1,e.z+Math.sin(p)*S,0,x,0,.8,.18,m,g,.5)},f=()=>s.ring(e.x,e.z,e.r-.42,e.r-.28,16777215,.6*h,.1,-Math.PI/2,-Math.PI/2+Math.PI*2*(1-t));switch(e.kind){case"lotus":if(e.c){let m=Math.min(1,(e.t-e.a)/a.fuse),x=.5+.5*Math.sin(this.time*22);s.ring(e.x,e.z,0,e.r,l,.1+.08*x),s.ring(e.x,e.z,0,e.r*m,l,.26),s.ring(e.x,e.z,e.r-.13,e.r,l,.95)}else{let m=(c?.8:.16)*Math.min(1,e.t/a.arm);s.ring(e.x,e.z,a.trig-.1,a.trig,o,m),s.ring(e.x,e.z,0,.35,o,m);for(let x=0;x<4;x++){let g=this.time*.8+x*1.571;s.ring(e.x+Math.cos(g)*.8,e.z+Math.sin(g)*.8,0,.28,o,m*.8)}}return!0;case"blizzard":if(s.ring(e.x,e.z,0,e.r,Vi,(.05+.02*Math.sin(this.time*5))*h),s.ring(e.x,e.z,e.r-.14,e.r,l,.9*h),f(),n>0)for(let m=0;m<5;m++){let x=Math.random()*6.283,g=Math.sqrt(Math.random())*e.r;r.emit(e.x+Math.cos(x)*g,u+2+Math.random()*2.5,e.z+Math.sin(x)*g,5,-5,2,.7,.2,Math.random()<.5?16777215:Vi,0,.2)}return!0;case"poison":return s.ring(e.x,e.z,0,e.r,Hc,.2*Math.min(1,(e.T-e.t)/1.2)),n>0&&Math.random()<.06&&d(Hc,1+Math.random()*2,-1),!0;case"glue":return s.ring(e.x,e.z,0,e.r,16771496,.13*h),s.ring(e.x,e.z,e.r-.14,e.r,l,.85*h),s.ring(e.x,e.z,e.r*.45,e.r*.5,16771496,.3*h),f(),!0;case"turret":return c&&s.ring(e.x,e.z,a.reach-.05,a.reach,o,.12),s.ring(e.x,e.z,1.2,1.35,l,.7),!0;case"arise":{let m=!(e.c&1)&&Math.hypot(e.owner.x-e.x,e.owner.z-e.z)>a.leash;return s.ring(e.x,e.z,a.reach-.1,a.reach,l,m?.2:.7),s.ring(e.x,e.z,0,a.reach,l,m?.02:.06),e.c&1&&s.ring(e.dx,e.dz,.5,.65,l,.8),!0}case"shadow":return s.ring(e.x,e.z,1.3,1.45,o,.5*h),n>0&&Math.random()<.4&&d(3158090,2,-2),!0;case"icewall":case"windwall":case"divide":{let m=si(e);return s.rect(m.x+m.nz*a.wall,m.z-m.nx*a.wall,-m.nz,m.nx,a.wall*2,e.kind==="windwall"?.15:.4,e.kind==="icewall"?Vi:o,.5*h,.1),m.moving&&s.lane(m.x,m.z,m.nx,m.nz,a.travel-Math.min(e.t*a.speed,a.travel),a.wall,l,.08,.7),!0}}return!1}drawTelegraphs(e){let t=this.ground;for(let n of this.telegraphs){n.t+=e;let s=n.top,r=Math.min(1,n.t/n.T),a=this.dangerOf(s),o=n.skill;if(o.aim==="leap"){if(!s.air){n.done=!0;continue}let l=o.aoe,c=.5+.5*Math.sin(this.time*18);t.ring(n.ax,n.az,0,l,a,.1+.08*c),t.ring(n.ax,n.az,0,l*r,a,.22),t.ring(n.ax,n.az,l-.14,l,a,.95),t.ring(n.ax,n.az,1.9,2,a,.5)}else{if(!s.cast||s.cast.key!==n.key){n.done=!0;continue}if(o.aim==="cone")t.sector(s.x,s.z,n.dx,n.dz,o.range,o.half,a,.12,.85),t.ring(s.x,s.z,0,o.range*r,a,.25,.09,Math.atan2(n.dz,n.dx)-o.half,Math.atan2(n.dz,n.dx)+o.half);else if(o.wall&&o.aim!=="line")t.rect(n.ax+n.dz*o.wall,n.az-n.dx*o.wall,-n.dz,n.dx,o.wall*2,.4,a,.7);else if(o.aim==="ground")t.ring(n.ax,n.az,o.aoe-.13,o.aoe,a,.9),t.ring(n.ax,n.az,0,o.aoe,a,.1);else if(o.aim==="line"||o.aim==="dash"){let l=o.aim==="line",c=Math.min(id(s.x,s.z,n.dx,n.dz),l?o.range:Sr(s.cast.dist,o.minDist,o.dist)+1),h=l?o.radius:1.25;t.lane(s.x,s.z,n.dx,n.dz,c,h,a,.1,.8),t.rect(s.x,s.z,n.dx,n.dz,c*r,h,a,.28)}}}this.telegraphs.some(n=>n.done)&&(this.telegraphs=this.telegraphs.filter(n=>!n.done))}drawAim(e,t,n){let s=this.ground,r=e.key,a=n.aimSkill(t,r),o=e.x-t.x,l=e.z-t.z,c=Math.hypot(o,l);c<.01?(o=0,l=-1):(o/=c,l/=c);let h=n.ready(t,r,.25),u=h?Hi:8423584;if(a.aim==="blink"){let d=Math.min(id(t.x,t.z,o,l)-t.radius,Sr(c,2,a.range));s.lane(t.x+o*1.4,t.z+l*1.4,o,l,Math.max(0,d-1.4),.5,u,.1,.6),s.ring(t.x+o*d,t.z+l*d,1.2,1.33,u,.9),s.ring(t.x+o*d,t.z+l*d,0,1.2,u,.12),s.ring(t.x,t.z,a.range-.05,a.range,Hi,.25)}else if(a.aim==="cone")s.sector(t.x,t.z,o,l,a.range,a.half,u,h?.16:.07,h?.9:.4);else if(a.wall&&!a.travel){let d=a.aim==="line"?{x:t.x+o*a.ahead,z:t.z+l*a.ahead}:n.groundTarget(t,a,e.x,e.z);a.aim!=="line"&&s.ring(t.x,t.z,a.range-.06,a.range,Hi,.35),s.rect(d.x+l*a.wall,d.z-o*a.wall,-l,o,a.wall*2,.4,u,h?.8:.35)}else if(a.aim==="line"||a.aim==="dash"){let d=a.aim==="line",f=Math.min(id(t.x,t.z,o,l),d?a.range:Sr(c,a.minDist,a.dist)),m=d?a.radius:1.25;if(s.lane(t.x+o*1.4,t.z+l*1.4,o,l,f-1.4,m,u,h?.16:.07,h?.9:.4),d||s.ring(t.x+o*f,t.z+l*f,1.2,1.33,u,.8),!d&&a.aoe&&s.ring(t.x+o*f,t.z+l*f,a.aoe-.1,a.aoe,u,.5),a.id==="shuriken")for(let x of n.own(t,"shadow"))this.chain(x.x,x.z,e.x,e.z,u,.5)}else if(a.aim==="leap"||a.aim==="ground"){let d=n.groundTarget(t,a,e.x,e.z);if(s.ring(t.x,t.z,a.range-.06,a.range,Hi,.35),s.ring(d.x,d.z,0,a.aoe,u,h?.14:.06),s.ring(d.x,d.z,a.aoe-.12,a.aoe,u,.95),a.aim==="leap"&&s.ring(d.x,d.z,1.9,2,u,.55),a.id==="shadow"||a.id==="conquer")for(let f of n.own(t,a.id==="shadow"?"shadow":"arise"))this.chain(f.x,f.z,d.x,d.z,u,.5)}}updateCamera(e){let t=this.camera,n=this.stage,s=this.world,r=1-Math.exp(-e*3.5),a=0,o=.3,l=1;if(this.orbiting)this.orbit+=e*.12,l=1.12;else{let g=this.playerSide?Math.PI:0;if(this.orbit=g+Math.atan2(Math.sin(this.orbit-g),Math.cos(this.orbit-g))*Math.exp(-e*3),o=this.playerSide?-.3:.3,s){let[p,S]=s.tops,A=p.out?0:p.x,v=p.out?0:p.z,w=S.out?0:S.x,E=S.out?0:S.z;a=(A+w)*.08,o+=(v+E)*.08;let P=this.focus;P&&(a+=(P.top.x-a)*P.w,o+=(Sr(P.top.z,-ut.R,ut.R)-o)*P.w,l=P.zoom)}}this.look.x+=(a-this.look.x)*r,this.look.z+=(o-this.look.z)*r,this.zoom+=(l-this.zoom)*r,this.punch=Math.max(0,this.punch-e*3.2),this.shake*=Math.exp(-e*7.5);let c=Math.tan(t.fov*Math.PI/360),h=ut.R+2.2,d=Math.max(h*Math.sin(nd)*1.26/c,h*1.04/(c*t.aspect))*this.zoom*(1-this.punch*.035),f=Math.sin(nd)*d,m=Math.cos(nd)*d,x=this.shake*.55;t.position.set(this.look.x+Math.sin(this.orbit)*m+(Math.random()-.5)*x,this.look.y+f+(Math.random()-.5)*x,this.look.z+Math.cos(this.orbit)*m+(Math.random()-.5)*x),t.lookAt(this.look),this.particles.mat.uniforms.uScale.value=n.height*n.renderer.getPixelRatio()/(2*c)}render(){this.stage.render()}};var Se=(i,e=document)=>e.querySelector(i),vs=(i,e,t)=>{let n=document.createElement(i);return e&&(n.className=e),t!=null&&(n.innerHTML=t),n},Ge=i=>`<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${i}</svg>`,rd={sonic:Ge('<path d="M31 5a20 20 0 1 0 0 38 15 19 0 0 1 0-38z" fill="currentColor" stroke="none"/><path d="M4 16h9M2 24h9M4 32h9" stroke-width="2.5" opacity=".6"/>'),phantom:Ge('<circle cx="33" cy="24" r="9" fill="currentColor" stroke="none"/><circle cx="20" cy="24" r="9" stroke-width="3" opacity=".6" stroke-dasharray="4 4"/><circle cx="10" cy="24" r="7" stroke-width="2.5" opacity=".3" stroke-dasharray="3 4"/>'),blitz:Ge('<path d="M6 9l15 15L6 39M19 9l15 15-15 15" stroke-width="5"/><path d="M36 14l8 10-8 10" stroke-width="4" opacity=".55"/>'),meteor:Ge('<circle cx="30" cy="31" r="11" fill="currentColor" stroke="none"/><path d="M5 4l15 17M15 3l11 13M3 15l12 12" stroke-width="3.5" opacity=".7"/><path d="M12 44h34" stroke-width="2.5" opacity=".5"/>'),quake:Ge('<path d="M24 4l8 26H16z" fill="currentColor" stroke="none"/><path d="M9 16l5 16H5zM39 14l5 18h-9z" fill="currentColor" stroke="none" opacity=".6"/><path d="M3 38l8-3 6 5 7-5 7 5 6-5 8 3" stroke-width="3.5"/>'),aegis:Ge('<path d="M24 4l17 6v13c0 10-7 17-17 21C14 40 7 33 7 23V10z" stroke-width="3.5"/><path d="M24 12l9 3v8c0 6-4 10-9 12z" fill="currentColor" stroke="none"/>'),anchor:Ge('<path d="M30 6l12 12-8 8-12-12z" fill="currentColor" stroke="none"/><ellipse cx="19" cy="29" rx="6" ry="3.5" transform="rotate(-45 19 29)" stroke-width="3.5"/><ellipse cx="10" cy="38" rx="6" ry="3.5" transform="rotate(-45 10 38)" stroke-width="3.5" opacity=".65"/>'),nova:Ge('<circle cx="24" cy="24" r="7" fill="currentColor" stroke="none"/><circle cx="24" cy="24" r="13" stroke-width="3"/><path d="M24 2v6M24 40v6M2 24h6M40 24h6M8 8l5 5M35 35l5 5M40 8l-5 5M13 35l-5 5" stroke-width="3.5" opacity=".75"/>'),flare:Ge('<path d="M6 24L42 6v36z" fill="currentColor" stroke="none" opacity=".35"/><path d="M6 24L42 6M6 24l36 18" stroke-width="3"/><path d="M18 24c4-4 4 4 8 0s4 4 8 0" stroke-width="3.5"/>'),sanctuary:Ge('<circle cx="24" cy="24" r="19" stroke-width="3" stroke-dasharray="6 5"/><path d="M24 13v22M13 24h22" stroke-width="7"/>'),satellite:Ge('<circle cx="24" cy="24" r="7" stroke-width="3.5"/><circle cx="24" cy="6" r="5" fill="currentColor" stroke="none"/><circle cx="8.5" cy="33" r="5" fill="currentColor" stroke="none"/><circle cx="39.5" cy="33" r="5" fill="currentColor" stroke="none"/>'),eclipse:Ge('<circle cx="29" cy="19" r="13" fill="currentColor" stroke="none"/><circle cx="23" cy="24" r="12" fill="#0a0f1e" stroke="currentColor" stroke-width="2.5"/><path d="M6 42c6-2 8-6 12-9" stroke-width="3.5" opacity=".7"/>'),galeq:Ge('<path d="M4 24h30" stroke-width="5"/><path d="M30 12l14 12-14 12z" fill="currentColor" stroke="none"/><path d="M6 12h14M6 36h14" stroke-width="2.5" opacity=".55"/>'),windwall:Ge('<path d="M10 6c8 6-8 12 0 18s-8 12 0 18M24 6c8 6-8 12 0 18s-8 12 0 18M38 6c8 6-8 12 0 18s-8 12 0 18" stroke-width="4"/>'),sweep:Ge('<circle cx="24" cy="24" r="8" stroke-width="3" stroke-dasharray="4 4" opacity=".6"/><path d="M3 34L45 14" stroke-width="5"/><path d="M36 9l9 5-5 9" stroke-width="4"/>'),lastbreath:Ge('<path d="M24 3l5 15h15l-12 9 5 16-13-10-13 10 5-16L4 18h15z" fill="currentColor" stroke="none"/><path d="M8 44h32" stroke-width="3" opacity=".6"/>'),shuriken:Ge('<path d="M24 3l5 16 16 5-16 5-5 16-5-16-16-5 16-5z" fill="currentColor" stroke="none"/><circle cx="24" cy="24" r="4" fill="#0a0f1e" stroke="none"/>'),shadow:Ge('<circle cx="16" cy="24" r="10" fill="currentColor" stroke="none"/><circle cx="33" cy="24" r="10" stroke-width="3" stroke-dasharray="4 4" opacity=".7"/><path d="M14 40h20" stroke-width="3" opacity=".5"/>'),slash:Ge('<path d="M6 30a18 18 0 0 1 36 0" stroke-width="6"/><path d="M12 38a12 12 0 0 1 24 0" stroke-width="3" opacity=".6"/>'),deathmark:Ge('<path d="M8 8l32 32M40 8L8 40" stroke-width="7"/><circle cx="24" cy="24" r="20" stroke-width="2.5" opacity=".6"/>'),fourshot:Ge('<circle cx="12" cy="12" r="6" fill="currentColor" stroke="none"/><circle cx="36" cy="12" r="6" fill="currentColor" stroke="none"/><circle cx="12" cy="36" r="6" fill="currentColor" stroke="none"/><circle cx="36" cy="36" r="8" fill="currentColor" stroke="none"/><circle cx="36" cy="36" r="11" stroke-width="2" opacity=".7"/>'),flourish:Ge('<path d="M3 24h42" stroke-width="3"/><path d="M34 16l11 8-11 8" stroke-width="4"/><path d="M8 14l6 10-6 10M18 14l6 10-6 10" stroke-width="2.5" opacity=".6"/>'),lotus:Ge('<path d="M24 6c6 8 6 16 0 24-6-8-6-16 0-24z" fill="currentColor" stroke="none"/><path d="M6 20c10 0 16 4 18 12-10 0-16-4-18-12zM42 20c-10 0-16 4-18 12 10 0 16-4 18-12z" fill="currentColor" stroke="none" opacity=".65"/><path d="M8 40h32" stroke-width="3"/>'),curtaincall:Ge('<path d="M4 44L24 4l20 40" stroke-width="3" opacity=".6"/><path d="M24 40V10" stroke-width="5"/><path d="M15 18l9-10 9 10" stroke-width="5"/>'),flashfrost:Ge('<circle cx="28" cy="24" r="11" fill="currentColor" stroke="none"/><path d="M2 24h12M5 14h8M5 34h8" stroke-width="3" opacity=".6"/><path d="M28 8v-5M28 45v-5M44 24h3" stroke-width="3"/>'),icewall:Ge('<path d="M8 40V18l7-10 7 10v22zM26 40V14l7-10 7 10v26z" fill="currentColor" stroke="none"/><path d="M3 43h42" stroke-width="3"/>'),frostbite:Ge('<path d="M24 3v42M6 13l36 22M42 13L6 35" stroke-width="4"/><path d="M18 7l6 6 6-6M18 41l6-6 6 6" stroke-width="3"/>'),blizzard:Ge('<circle cx="24" cy="24" r="20" stroke-width="3" stroke-dasharray="5 5"/><path d="M24 10v28M12 17l24 14M36 17L12 31" stroke-width="4"/>'),brokenwings:Ge('<path d="M4 12l10 12L4 36M18 12l10 12-10 12M32 12l10 12-10 12" stroke-width="5"/>'),kiburst:Ge('<circle cx="24" cy="24" r="6" fill="currentColor" stroke="none"/><path d="M24 3v9M24 36v9M3 24h9M36 24h9M9 9l6 6M33 33l6 6M39 9l-6 6M15 33l-6 6" stroke-width="4"/>'),valor:Ge('<path d="M26 5l15 5v12c0 9-6 15-15 19-9-4-15-10-15-19V10z" stroke-width="3.5"/><path d="M2 20h10M2 28h8" stroke-width="3" opacity=".6"/>'),exile:Ge('<path d="M10 44L30 4l8 6-18 36z" fill="currentColor" stroke="none"/><path d="M26 20l14 4M22 28l12 4" stroke-width="3" stroke="#0a0f1e"/><path d="M6 30l8 4" stroke-width="4"/>'),sigil:Ge('<circle cx="24" cy="24" r="18" stroke-width="3"/><path d="M24 8l14 24H10z" stroke-width="3"/><circle cx="24" cy="24" r="4" fill="currentColor" stroke="none"/>'),distort:Ge('<path d="M6 34c10-26 26-26 36 0" stroke-width="4"/><path d="M36 22l6 12-13 1" stroke-width="4"/><path d="M42 40c-10 6-26 6-36 0" stroke-width="2.5" stroke-dasharray="4 4" opacity=".7"/>'),ethereal:Ge('<ellipse cx="12" cy="24" rx="8" ry="5" stroke-width="4"/><ellipse cx="24" cy="24" rx="8" ry="5" stroke-width="4" opacity=".7"/><ellipse cx="36" cy="24" rx="8" ry="5" stroke-width="4"/>'),mimic:Ge('<path d="M24 5l5 12 13 1-10 9 3 13-11-7-11 7 3-13-10-9 13-1z" stroke-width="3"/><path d="M24 15l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z" fill="currentColor" stroke="none"/>'),decimate:Ge('<circle cx="24" cy="24" r="19" stroke-width="7"/><circle cx="24" cy="24" r="7" stroke-width="2" stroke-dasharray="3 3" opacity=".6"/>'),cripple:Ge('<path d="M30 4L14 26h10l-6 18 18-24H26z" fill="currentColor" stroke="none"/>'),apprehend:Ge('<path d="M44 8L10 24l34 16" stroke-width="3" opacity=".5"/><path d="M40 24H10" stroke-width="5"/><path d="M20 14L8 24l12 10" stroke-width="5"/>'),guillotine:Ge('<path d="M6 4h36v18L6 34z" fill="currentColor" stroke="none"/><path d="M6 4v40M42 4v40" stroke-width="4"/><path d="M4 44h40" stroke-width="3"/>'),poison:Ge('<path d="M4 34c8-10 12 6 20-4s12 6 20-4" stroke-width="6"/><circle cx="12" cy="14" r="4" fill="currentColor" stroke="none"/><circle cx="26" cy="9" r="3" fill="currentColor" stroke="none" opacity=".7"/><circle cx="38" cy="15" r="4" fill="currentColor" stroke="none"/>'),glue:Ge('<path d="M6 30c0-10 8-16 18-16s18 6 18 16-8 10-18 10S6 40 6 30z" fill="currentColor" stroke="none" opacity=".5"/><path d="M14 30c4-4 6 4 10 0s6 4 10 0" stroke-width="4"/>'),fling:Ge('<circle cx="10" cy="36" r="6" fill="currentColor" stroke="none"/><path d="M12 28C14 8 34 8 38 26" stroke-width="4"/><path d="M30 22l8 6 5-9" stroke-width="4"/><circle cx="38" cy="38" r="5" stroke-width="3"/>'),insanity:Ge('<path d="M19 4h10v12l9 18c2 5-1 10-7 10H17c-6 0-9-5-7-10l9-18z" stroke-width="3.5"/><path d="M13 32h22l2 4c1 3-1 5-4 5H15c-3 0-5-2-4-5z" fill="currentColor" stroke="none"/>'),turret:Ge('<path d="M10 44h28l-4-12H14z" fill="currentColor" stroke="none"/><circle cx="24" cy="24" r="9" stroke-width="4"/><path d="M30 20L44 8" stroke-width="6"/>'),rockets:Ge('<path d="M6 40L20 8M16 42l8-34M26 42l2-34M36 42L32 8M44 38L36 8" stroke-width="3.5"/>'),grenade:Ge('<circle cx="22" cy="28" r="14" fill="currentColor" stroke="none"/><path d="M26 14l6-8h8" stroke-width="4"/><path d="M40 4l4 2M42 10l4-2" stroke-width="2.5"/>'),upgrade:Ge('<path d="M24 4l16 16H30v12H18V20H8z" fill="currentColor" stroke="none"/><path d="M12 38h24M16 44h16" stroke-width="4"/>'),conquer:Ge('<circle cx="10" cy="14" r="6" fill="currentColor" stroke="none"/><circle cx="10" cy="34" r="6" fill="currentColor" stroke="none"/><path d="M18 14l20 8M18 34l20-8" stroke-width="4"/><circle cx="40" cy="24" r="5" stroke-width="3"/>'),arise:Ge('<circle cx="24" cy="16" r="9" fill="currentColor" stroke="none"/><path d="M24 26v10" stroke-width="5"/><path d="M4 42c6-6 12-6 20 0s14 6 20 0" stroke-width="4"/>'),shift:Ge('<circle cx="38" cy="24" r="7" stroke-width="3" stroke-dasharray="4 3"/><path d="M4 24h24" stroke-width="5"/><path d="M20 15l10 9-10 9" stroke-width="5"/>'),divide:Ge('<path d="M10 6v36M18 6v36M26 6v36" stroke-width="5"/><path d="M32 24h12M38 17l7 7-7 7" stroke-width="4"/>')},OM={over:["OVER FINISH","\u5834\u5916\u3078\u5439\u304D\u98DB\u3070\u3057\u305F\uFF01"],burst:["BURST FINISH","\u4E00\u6483\u3067\u56DE\u8EE2\u3092\u65AD\u3061\u5207\u3063\u305F\uFF01"],spin:["SPIN FINISH","\u56DE\u8EE2\u304C\u5C3D\u304D\u305F\uFF01"],time:["TIME UP","\u6B8B\u308A\u56DE\u8EE2\u6570\u3067\u5224\u5B9A"]},Wc=class{constructor(e){this.h=e,this.hud=Se("#hud"),this.labels=Se("#labels"),this.announceEl=Se("#announce"),this.cutin=Se("#cutin"),this.vignette=Se("#vignette"),this.flashEl=Se("#flash"),this.blade="azure",this.level=1,this.side=0,this.fighters=[this.buildFighter(0),this.buildFighter(1)],this.skills={},this.buildTitle(),this.tags=[],this.lastTime=-1,Se("#btn-mute").onclick=()=>this.h.mute(),Se("#btn-pause").onclick=()=>this.h.pause(),Se("#btn-resume").onclick=()=>this.h.pause(),Se("#btn-quit").onclick=()=>this.h.quit(),Se("#btn-again").onclick=()=>this.h.again(),Se("#btn-lobby").onclick=()=>this.h.lobby(),Se("#btn-back").onclick=()=>this.h.quit(),Se("#btn-host").onclick=()=>this.h.host(),Se("#lb-leave").onclick=()=>this.h.quit(),Se("#lb-ready").onclick=()=>this.h.ready(),Se("#lb-copy").onclick=()=>this.h.copy(),Se("#lb-url").onclick=n=>n.target.select();let t=Se("#lb-blades");for(let n of Object.values($t)){let s=vs("button","lb-blade",`<i></i><b>${n.en}</b><span>${n.typeJa}</span>`);s.style.setProperty("--c",n.css),s.dataset.id=n.id,s.onclick=()=>this.h.pick(n.id),t.appendChild(s)}document.querySelectorAll("button").forEach(n=>n.addEventListener("mouseenter",()=>this.h.hover()))}buildFighter(e){let t=Se("#f"+e);return t.innerHTML=`
      <div class="f-head"><span class="f-tag"></span><span class="f-name"></span><span class="f-type"></span></div>
      <div class="gauge"><div class="g-ghost"></div><div class="g-fill"></div><div class="g-ticks"></div><span class="g-num"></span></div>
      <div class="f-foot"><div class="pips"></div><div class="f-ult"><i></i><span>ULT</span></div></div>`,{root:t,tag:Se(".f-tag",t),name:Se(".f-name",t),type:Se(".f-type",t),fill:Se(".g-fill",t),ghost:Se(".g-ghost",t),num:Se(".g-num",t),pips:Se(".pips",t),ult:Se(".f-ult i",t),ultBox:Se(".f-ult",t),ghostV:1,shown:1}}buildSkills(e){let t=Se("#skillbar");t.innerHTML="",this.skills={};for(let n of Ct){let s=Pr(e)[Ct.indexOf(n)],r=s.aim==="self"?"\u62BC\u3059\u3068\u5373\u767A\u52D5":"\u9577\u62BC\u3057\u3067\u7167\u6E96 \u2192 \u96E2\u3057\u3066\u767A\u52D5",a=vs("div","skill"+(s.ult?" ult":""));a.innerHTML=`<div class="s-ring"></div><div class="s-icon">${rd[s.id]}</div><div class="s-cd"></div><div class="s-num"></div><div class="s-key">${n}</div><div class="s-badge"></div>
        <div class="s-tip"><b>${s.name}</b><i>${s.en}</i><p>${s.desc}</p><span>${s.ult?"\u30B2\u30FC\u30B8 100%":"\u30AF\u30FC\u30EB\u30C0\u30A6\u30F3 "+ +(s.cd*e.cdMul).toFixed(1)+"\u79D2"}\u3000\uFF0F\u3000${r}</span></div>`,t.appendChild(a),this.skills[n]={root:a,cd:Se(".s-cd",a),num:Se(".s-num",a),ring:Se(".s-ring",a),badge:Se(".s-badge",a),ready:!0,note:""}}}buildTitle(){let e=Se("#blades");this.sheets={};for(let n of Object.values($t)){let s=vs("button","blade");s.style.setProperty("--c",n.css);let r=(a,o)=>`<div class="stat"><span>${a}</span><div>${'<i class="on"></i>'.repeat(o)}${"<i></i>".repeat(5-o)}</div></div>`;s.innerHTML=`<div class="b-disc"><div class="b-disc-in"></div></div><div class="b-type">${n.type}</div><div class="b-en">${n.en}</div><div class="b-name">${n.name}</div>`,this.sheets[n.id]=`<div class="b-stats">${r("\u653B\u6483",n.bars.atk)}${r("\u9632\u5FA1",n.bars.def)}${r("\u6301\u4E45",n.bars.sta)}${r("\u901F\u5EA6",n.bars.spd)}</div><p>${n.desc}</p>`,s.onclick=()=>{this.blade=n.id,this.h.ui(),this.refreshTitle()},s.dataset.id=n.id,e.appendChild(s)}let t=Se("#levels");Cs.forEach((n,s)=>{let r=vs("button","level",`<b>${n.name}</b><span>${n.ja}</span>`);r.onclick=()=>{this.level=s,this.h.ui(),this.refreshTitle()},r.dataset.i=s,t.appendChild(r)}),Se("#btn-start").onclick=()=>this.h.start(this.blade,this.level),this.refreshTitle()}refreshTitle(){document.querySelectorAll(".blade").forEach(t=>t.classList.toggle("on",t.dataset.id===this.blade)),document.querySelectorAll(".level").forEach(t=>t.classList.toggle("on",Number(t.dataset.i)===this.level));let e=$t[this.blade];Se("#how").style.setProperty("--c",e.css),Se("#how-name").textContent=e.name+" \u306E\u30B9\u30AD\u30EB",Se("#sheet").style.setProperty("--c",e.css),Se("#sheet").innerHTML=this.sheets[e.id],Se("#how").innerHTML=Pr(e).map((t,n)=>`<div class="how-row"><kbd>${Ct[n]}</kbd><div class="how-icon">${rd[t.id]}</div><div><b>${t.name}</b><span>${t.desc}</span></div></div>`).join("")}show(e,t){Se("#"+e).classList.toggle("hidden",!t)}setMuted(e){Se("#btn-mute").classList.toggle("off",e),Se("#btn-mute").textContent=e?"\u266A OFF":"\u266A ON"}slot(e){return e.side===this.side?0:1}startMatch(e,t,n,s){this.side=t,this.labels.innerHTML="",this.tags=[];for(let a of e.tops){let o=a.side===t,l=this.fighters[this.slot(a)];l.root.style.setProperty("--c",a.blade.css),l.tag.textContent=o?"YOU":n,l.name.textContent=a.blade.name,l.type.textContent=a.blade.typeJa+(!o&&s?" \uFF0F "+s:""),l.ghostV=l.shown=1;let c=vs("div","tag "+(o?"me":"foe"),`<span>${o?"YOU":n}</span><div><i></i></div>`);c.style.setProperty("--c",a.blade.css),this.labels.appendChild(c),this.tags[a.side]={root:c,fill:Se("i",c)}}let r=e.tops[t];this.buildSkills(r.blade),Se("#skillbar").style.setProperty("--c",r.blade.css),this.setScore([0,0])}setScore(e){this.fighters.forEach((t,n)=>{let s=e[n===0?this.side:1-this.side];t.pips.innerHTML="";for(let r=0;r<ji;r++)t.pips.appendChild(vs("i",r<s?"on":""))})}setNet(e,t){let n=Se("#netstat");n.textContent!==e&&(n.textContent=e),n.classList.toggle("bad",!!t),n.classList.toggle("hidden",!e)}toast(e){let t=Se("#toast");t.textContent=e,t.className="",t.offsetWidth,t.className="show"}setMenuMode(e){Se("#pause-title").textContent=e?"MENU":"PAUSE",Se("#pause-note").textContent=e?"\u30AA\u30F3\u30E9\u30A4\u30F3\u5BFE\u6226\u4E2D\u306F\u4E00\u6642\u505C\u6B62\u3067\u304D\u307E\u305B\u3093\u3002":"",Se("#btn-quit").textContent=e?"\u5BFE\u6226\u3092\u3084\u3081\u308B":"\u30BF\u30A4\u30C8\u30EB\u3078",Se("#btn-again").textContent=e?"\u540C\u3058\u30D6\u30EC\u30FC\u30C9\u3067\u518D\u6226":"\u3082\u3046\u4E00\u5EA6",Se("#btn-lobby").classList.toggle("hidden",!e),Se("#btn-again").parentElement.classList.toggle("three",e),Se("#btn-back").textContent=e?"\u9000\u51FA\u3059\u308B":"\u30D6\u30EC\u30FC\u30C9\u9078\u629E\u3078"}showLobby(e){let t={opening:"\u30EB\u30FC\u30E0\u3092\u6E96\u5099\u3057\u3066\u3044\u307E\u3059\u2026",waiting:"\u76F8\u624B\u306E\u53C2\u52A0\u3092\u5F85\u3063\u3066\u3044\u307E\u3059",connecting:"\u30EB\u30FC\u30E0\u306B\u63A5\u7D9A\u3057\u3066\u3044\u307E\u3059\u2026",connected:e.peer&&e.peer.ready&&e.me.ready?"\u307E\u3082\u306A\u304F\u958B\u59CB\u3057\u307E\u3059":"\u63A5\u7D9A\u3057\u307E\u3057\u305F\u3002\u30D6\u30EC\u30FC\u30C9\u3092\u9078\u3093\u3067\u6E96\u5099OK\u3092\u62BC\u3057\u3066\u304F\u3060\u3055\u3044",failed:e.error||"\u63A5\u7D9A\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F"}[e.status],n=Se("#lb-status");n.textContent=t,n.className="lb-status "+e.status,Se("#lb-invite").classList.toggle("hidden",e.role!=="host"||!e.url),e.url&&Se("#lb-url").value!==e.url&&(Se("#lb-url").value=e.url);let s=(o,l,c)=>{let h=c&&$t[c.blade];o.style.setProperty("--c",h?h.css:"#3a4566"),o.classList.toggle("ready",!!(c&&c.ready)),o.classList.toggle("empty",!c),o.innerHTML=`<span class="lb-who">${l}</span><b>${h?h.en:"\u2014 \u2014 \u2014"}</b><span class="lb-name">${h?h.name+"\uFF08"+h.typeJa+"\uFF09":"\u672A\u63A5\u7D9A"}</span><em>${c?c.ready?"READY":"\u9078\u629E\u4E2D\u2026":""}</em>`};s(Se("#lb-me"),"YOU",e.me),s(Se("#lb-peer"),"RIVAL",e.peer),document.querySelectorAll(".lb-blade").forEach(o=>{o.classList.toggle("on",o.dataset.id===e.me.blade),o.disabled=e.me.ready});let r=Se("#lb-ready");r.disabled=e.status!=="connected",r.textContent=e.me.ready?"\u6E96\u5099\u3092\u53D6\u308A\u6D88\u3059":"\u6E96\u5099OK",r.classList.toggle("armed",e.me.ready);let a=Se("#lb-kit");a.style.setProperty("--c",$t[e.me.blade].css),a.innerHTML=Pr($t[e.me.blade]).map((o,l)=>`<div class="how-row"><kbd>${Ct[l]}</kbd><div class="how-icon">${rd[o.id]}</div><div><b>${o.name}</b><span>${o.desc}</span></div></div>`).join("")}setRound(e){Se("#round").textContent="ROUND "+e}announce(e,t="",n="",s=1.2){let r=this.announceEl;r.className="",r.innerHTML=`<div class="a-main">${e}</div>${t?`<div class="a-sub">${t}</div>`:""}`,r.offsetWidth,r.style.setProperty("--d",s+"s"),r.className="show "+n}finish(e,t){let[n,s]=OM[e];this.announce(n,`${s}\u3000<b>${t?"ROUND GET!":"ROUND LOST\u2026"}</b>`,"finish "+(t?"win":"lose"),2.6)}cutIn(e,t,n){let s=this.cutin;s.className="",s.style.setProperty("--c",t),s.innerHTML=`<div class="ci-bar"></div><div class="ci-text"><span>${n?"ENEMY ULTIMATE":"ULTIMATE"}</span><b>${e.en}</b><i>${e.name}</i></div>`,s.offsetWidth,s.className="show"+(n?" enemy":"")}flash(e="#fff",t=.5){let n=this.flashEl;n.style.background=e,n.style.transition="none",n.style.opacity=t,n.offsetWidth,n.style.transition="opacity .45s ease-out",n.style.opacity=0}pop(e,t,n,s=""){let r=vs("div","pop "+s,n);r.style.left=e+"px",r.style.top=t+"px",r.style.setProperty("--r",(Math.random()*60-30).toFixed(0)+"px"),this.labels.appendChild(r),r.addEventListener("animationend",()=>r.remove())}denied(e){let t=this.skills[e].root;t.classList.remove("denied"),t.offsetWidth,t.classList.add("denied")}castFx(e){let t=this.skills[e].root;t.classList.remove("fired"),t.offsetWidth,t.classList.add("fired")}update(e,t,n,s,r){e.tops.forEach((c,h)=>{let u=this.fighters[this.slot(c)],d=Math.max(0,c.spin/c.spinMax);u.ghostV<d&&(u.ghostV=d),u.ghostV+=(d-u.ghostV)*Math.min(1,r*2.2),u.fill.style.transform=`scaleX(${d})`,u.ghost.style.transform=`scaleX(${u.ghostV})`,u.num.textContent=Math.ceil(Math.max(0,c.spin)*3.6)+" rpm",u.root.classList.toggle("low",d<.25),u.ult.style.transform=`scaleX(${c.ult/100})`,u.ultBox.classList.toggle("ready",c.ult>=100);let f=this.tags[h],m=c.out||e.result;if(f.root.style.opacity=m?0:1,!m){let x=t.tops[h].group.position,g=t.toScreen(x.x,x.y+2.5,x.z);f.root.style.transform=`translate(${g.x.toFixed(1)}px,${g.y.toFixed(1)}px)`,f.fill.style.transform=`scaleX(${d})`}});let a=e.tops[this.side];for(let c of Ct){let h=An(a,c),u=this.skills[c],d=a.cd[c],f=h.cd*a.blade.cdMul,m=!!h.re&&a.re[c]>0,x=!m&&h.ult&&a.ult<100,g=m||d<=0&&!x;u.cd.style.setProperty("--p",x||m?0:Math.min(1,d/f)),u.num.textContent=m?"":x?Math.floor(a.ult)+"%":d>0?d<1?d.toFixed(1):Math.ceil(d):"",u.root.classList.toggle("again",m);let p=this.note(e,a,h,c);p!==u.note&&(u.note=p,u.badge.textContent=p,u.badge.classList.toggle("on",p!=="")),h.ult&&u.ring.style.setProperty("--p",a.ult/100),g!==u.ready&&(u.ready=g,u.root.classList.toggle("wait",!g),g&&(u.root.classList.remove("up"),u.root.offsetWidth,u.root.classList.add("up"))),u.root.classList.toggle("aim",s===c)}let o=Math.max(0,Math.ceil(n));if(o!==this.lastTime){this.lastTime=o;let c=Se("#time");c.textContent=o,c.classList.toggle("hurry",o<=10)}let l=Math.max(0,1-a.spin/a.spinMax/.25);this.vignette.style.opacity=e.result?0:l*.9}note(e,t,n,s){let r=e.other(t);switch(n.id){case"galeq":return t.stack>=n.stacks?"\u7ADC\u5DFB":t.stack?String(t.stack):"";case"fourshot":return String(n.shots-t.stack);case"brokenwings":return t.re[s]>0?String(3-t.stack):"";case"shadow":case"distort":return t.re[s]>0?"\u21A9":"";case"flashfrost":return t.re[s]>0?"\u70B8\u88C2":"";case"exile":return t.re[s]>0?Math.ceil(t.re[s])+"s":"";case"mimic":return Ct[t.last];case"guillotine":return r.bleed?"\u51FA\u8840"+r.bleed:"";case"poison":return t.toggle?"ON":"";case"insanity":case"upgrade":return t.buff>0?Math.ceil(t.buff)+"s":"";case"lotus":case"turret":case"arise":{let a=e.own(t,n.id).length;return a?String(a):""}case"conquer":case"shift":return e.own(t,"arise").length?"":"\u2014"}return""}showResult(e,t,n,s){let r=n.tops[this.side],a=n.tops[1-this.side];t=[t[this.side],t[1-this.side]],Se("#result").classList.toggle("lose",!e),Se("#res-title").textContent=e?"VICTORY":"DEFEAT",Se("#res-sub").textContent=e?"\u898B\u4E8B\u306A\u52DD\u5229\uFF01":"\u3042\u3068\u4E00\u6B69\u2026\u3082\u3046\u4E00\u5EA6\u6311\u6226\u3057\u3088\u3046",Se("#res-score").innerHTML=`<b style="color:${r.blade.css}">${t[0]}</b><span>-</span><b style="color:${a.blade.css}">${t[1]}</b>`;let o=(l,c,h)=>`<tr><td>${c}</td><th>${l}</th><td>${h}</td></tr>`;Se("#res-stats").innerHTML=`<tr class="head"><td style="color:${r.blade.css}">${r.blade.name}</td><th></th><td style="color:${a.blade.css}">${a.blade.name}</td></tr>`+o("\u4E0E\u3048\u305F\u30C0\u30E1\u30FC\u30B8",Math.round(r.stats.dealt),Math.round(a.stats.dealt))+o("\u6700\u5927\u30D2\u30C3\u30C8",Math.round(r.stats.maxHit),Math.round(a.stats.maxHit))+o("\u30B9\u30AD\u30EB\u547D\u4E2D",r.stats.skillHits,a.stats.skillHits)+o("\u30D1\u30EA\u30A3 / \u53CD\u5C04",r.stats.parries,a.stats.parries)+o("\u6FC0\u7A81\u56DE\u6570",r.stats.clashes,a.stats.clashes),Se("#res-finish").textContent=s.join("\u3000/\u3000"),this.show("result",!0)}};var Xc=class{constructor(){this.ctx=null,this.muted=!1,this.musicOn=!1,this.step=0,this.nextTime=0,this.intensity=0}unlock(){if(this.ctx){this.ctx.state==="suspended"&&this.ctx.resume();return}let e=window.AudioContext||window.webkitAudioContext;if(!e)return;let t=this.ctx=new e;this.master=t.createGain(),this.master.gain.value=this.muted?0:.8;let n=t.createDynamicsCompressor();n.threshold.value=-14,n.ratio.value=6,this.master.connect(n).connect(t.destination),this.sfx=t.createGain(),this.sfx.gain.value=.9,this.sfx.connect(this.master),this.music=t.createGain(),this.music.gain.value=.32,this.music.connect(this.master);let s=t.sampleRate;this.noiseBuf=t.createBuffer(1,s,t.sampleRate);let r=this.noiseBuf.getChannelData(0);for(let a=0;a<s;a++)r[a]=Math.random()*2-1}setMuted(e){this.muted=e,this.master&&this.master.gain.setTargetAtTime(e?0:.8,this.ctx.currentTime,.02)}tone(e,t,n,s,r,a=0,o=this.sfx){let l=this.ctx;if(!l)return;let c=l.currentTime+a,h=l.createOscillator(),u=l.createGain();h.type=e,h.frequency.setValueAtTime(t,c),n!==t&&h.frequency.exponentialRampToValueAtTime(Math.max(20,n),c+s),u.gain.setValueAtTime(1e-4,c),u.gain.exponentialRampToValueAtTime(r,c+.006),u.gain.exponentialRampToValueAtTime(1e-4,c+s),h.connect(u).connect(o),h.start(c),h.stop(c+s+.02)}noise(e,t,n,s,r=1,a="bandpass",o=0,l=this.sfx){let c=this.ctx;if(!c)return;let h=c.currentTime+o,u=c.createBufferSource();u.buffer=this.noiseBuf,u.loop=!0;let d=c.createBiquadFilter();d.type=a,d.Q.value=r,d.frequency.setValueAtTime(n,h),s!==n&&d.frequency.exponentialRampToValueAtTime(Math.max(30,s),h+e);let f=c.createGain();f.gain.setValueAtTime(1e-4,h),f.gain.exponentialRampToValueAtTime(t,h+.005),f.gain.exponentialRampToValueAtTime(1e-4,h+e),u.connect(d).connect(f).connect(l),u.start(h,Math.random()),u.stop(h+e+.02)}clash(e){let t=Math.min(1,e/28),n=.12+.4*t,s=1500+Math.random()*900;this.tone("triangle",s,s*.98,.18+.25*t,n*.5),this.tone("square",s*1.51,s*1.5,.09+.1*t,n*.16),this.tone("sine",s*2.76,s*2.7,.25+.3*t,n*.22),this.noise(.07+.08*t,n,5200,2200,.8),t>.5&&this.tone("sine",150,45,.25,n*.9)}wall(e,t){let n=Math.min(1,e/18);this.noise(.12,.1+.25*n,1800,500,1.2),this.tone("triangle",420,180,.14,.1+.2*n),t&&this.tone("sine",120,40,.3,.5)}windup(){this.tone("sawtooth",220,660,.3,.07),this.noise(.3,.05,800,3200,2)}shoot(){this.noise(.28,.3,4200,700,1.4),this.tone("sawtooth",980,240,.22,.14)}projHit(){this.noise(.2,.4,2600,500,.7),this.tone("square",520,110,.2,.2),this.tone("sine",140,50,.25,.5)}guard(){this.tone("sine",520,1040,.25,.22),this.tone("triangle",780,1560,.3,.12,.04)}parry(){this.tone("triangle",2400,2350,.5,.3),this.tone("sine",3600,3500,.6,.2),this.noise(.1,.4,7e3,3e3,.7),this.tone("sine",170,50,.3,.6)}dash(){this.noise(.35,.35,500,5200,.9),this.tone("sawtooth",160,720,.25,.12)}leap(){this.noise(.9,.25,300,4200,1.5),this.tone("sawtooth",110,880,.9,.12),this.tone("sine",220,1760,.9,.1)}meteor(){this.tone("sine",190,28,.9,1),this.tone("triangle",90,30,.7,.6),this.noise(.8,.7,2600,90,.5,"lowpass"),this.noise(.25,.4,6e3,1500,.7)}blink(){this.noise(.22,.25,6e3,900,2),this.tone("sine",1500,500,.2,.14)}quake(){this.tone("sine",130,34,.55,.9),this.noise(.45,.5,1400,120,.6,"lowpass"),this.noise(.15,.3,3e3,900,.8)}flare(){this.noise(.45,.4,900,3600,.7),this.tone("sawtooth",240,90,.4,.12)}heal(){[523,659,784].forEach((e,t)=>this.tone("sine",e,e*1.01,.35,.13,t*.06))}drain(){this.tone("sine",300,620,.22,.12),this.tone("triangle",150,80,.2,.2)}chain(){this.noise(.25,.3,3e3,1500,3),[0,.04,.08,.12].forEach(e=>this.tone("square",1800+e*3e3,1500,.04,.07,e))}ringout(){this.tone("sawtooth",1400,180,.8,.2),this.noise(.7,.4,5e3,400,.8),this.tone("sine",140,40,.5,.7)}ultReady(){[660,880,1320].forEach((e,t)=>this.tone("triangle",e,e,.22,.16,t*.07))}denied(){this.tone("square",150,120,.08,.08)}move(){this.tone("sine",880,1200,.05,.05)}ui(){this.tone("triangle",720,960,.07,.14)}hover(){this.tone("sine",1300,1300,.03,.04)}beep(e){e?(this.tone("square",880,880,.5,.18),this.tone("sawtooth",1320,1320,.55,.12),this.noise(.5,.25,800,6e3,.8)):this.tone("square",440,440,.16,.16)}finish(e){(e?[523,659,784,1047]:[392,330,262,196]).forEach((n,s)=>{this.tone("triangle",n,n,.45,.2,s*.13),this.tone("sawtooth",n/2,n/2,.45,.07,s*.13)})}startMusic(){!this.ctx||this.musicOn||(this.musicOn=!0,this.step=0,this.nextTime=this.ctx.currentTime+.1)}stopMusic(){this.musicOn=!1}update(){let e=this.ctx;if(!e||!this.musicOn)return;let t=60/138/4;for(;this.nextTime<e.currentTime+.15;){let n=this.step%64,s=Math.floor(n/16),r=n%16,a=this.nextTime-e.currentTime,l=[55,55,65.4,49][s],c=this.music,h=this.intensity;r%4===0&&this.tone("sine",150,42,.16,.9,a,c),r%4===2&&this.noise(.03,.12+.1*h,9e3,9e3,1,"highpass",a,c),r%8===4&&this.noise(.11,.35,1900,1100,.8,"bandpass",a,c),(r%2===1||r%8===0)&&this.tone("sawtooth",l,l,t*.9,.22,a,c);let u=[1,1.5,2,2.4,3,2.4,2,1.5];(h>.3||r%2===0)&&this.tone("square",l*4*u[r%8],l*4*u[r%8],t*.8,.035+.035*h,a,c),this.nextTime+=t,this.step++}}};var ad=class{constructor(){this.encoder=new TextEncoder,this._pieces=[],this._parts=[]}append_buffer(e){this.flush(),this._parts.push(e)}append(e){this._pieces.push(e)}flush(){if(this._pieces.length>0){let e=new Uint8Array(this._pieces);this._parts.push(e),this._pieces=[]}}toArrayBuffer(){let e=[];for(let t of this._parts)e.push(t);return FM(e).buffer}};function FM(i){let e=0;for(let s of i)e+=s.byteLength;let t=new Uint8Array(e),n=0;for(let s of i){let r=new Uint8Array(s.buffer,s.byteOffset,s.byteLength);t.set(r,n),n+=s.byteLength}return t}function cd(i){return new od(i).unpack()}function hd(i){let e=new ld,t=e.pack(i);return t instanceof Promise?t.then(()=>e.getBuffer()):e.getBuffer()}var od=class{constructor(e){this.index=0,this.dataBuffer=e,this.dataView=new Uint8Array(this.dataBuffer),this.length=this.dataBuffer.byteLength}unpack(){let e=this.unpack_uint8();if(e<128)return e;if((e^224)<32)return(e^224)-32;let t;if((t=e^160)<=15)return this.unpack_raw(t);if((t=e^176)<=15)return this.unpack_string(t);if((t=e^144)<=15)return this.unpack_array(t);if((t=e^128)<=15)return this.unpack_map(t);switch(e){case 192:return null;case 193:return;case 194:return!1;case 195:return!0;case 202:return this.unpack_float();case 203:return this.unpack_double();case 204:return this.unpack_uint8();case 205:return this.unpack_uint16();case 206:return this.unpack_uint32();case 207:return this.unpack_uint64();case 208:return this.unpack_int8();case 209:return this.unpack_int16();case 210:return this.unpack_int32();case 211:return this.unpack_int64();case 212:return;case 213:return;case 214:return;case 215:return;case 216:return t=this.unpack_uint16(),this.unpack_string(t);case 217:return t=this.unpack_uint32(),this.unpack_string(t);case 218:return t=this.unpack_uint16(),this.unpack_raw(t);case 219:return t=this.unpack_uint32(),this.unpack_raw(t);case 220:return t=this.unpack_uint16(),this.unpack_array(t);case 221:return t=this.unpack_uint32(),this.unpack_array(t);case 222:return t=this.unpack_uint16(),this.unpack_map(t);case 223:return t=this.unpack_uint32(),this.unpack_map(t)}}unpack_uint8(){let e=this.dataView[this.index]&255;return this.index++,e}unpack_uint16(){let e=this.read(2),t=(e[0]&255)*256+(e[1]&255);return this.index+=2,t}unpack_uint32(){let e=this.read(4),t=((e[0]*256+e[1])*256+e[2])*256+e[3];return this.index+=4,t}unpack_uint64(){let e=this.read(8),t=((((((e[0]*256+e[1])*256+e[2])*256+e[3])*256+e[4])*256+e[5])*256+e[6])*256+e[7];return this.index+=8,t}unpack_int8(){let e=this.unpack_uint8();return e<128?e:e-256}unpack_int16(){let e=this.unpack_uint16();return e<32768?e:e-65536}unpack_int32(){let e=this.unpack_uint32();return e<2**31?e:e-2**32}unpack_int64(){let e=this.unpack_uint64();return e<2**63?e:e-2**64}unpack_raw(e){if(this.length<this.index+e)throw new Error(`BinaryPackFailure: index is out of range ${this.index} ${e} ${this.length}`);let t=this.dataBuffer.slice(this.index,this.index+e);return this.index+=e,t}unpack_string(e){let t=this.read(e),n=0,s="",r,a;for(;n<e;)r=t[n],r<160?(a=r,n++):(r^192)<32?(a=(r&31)<<6|t[n+1]&63,n+=2):(r^224)<16?(a=(r&15)<<12|(t[n+1]&63)<<6|t[n+2]&63,n+=3):(a=(r&7)<<18|(t[n+1]&63)<<12|(t[n+2]&63)<<6|t[n+3]&63,n+=4),s+=String.fromCodePoint(a);return this.index+=e,s}unpack_array(e){let t=new Array(e);for(let n=0;n<e;n++)t[n]=this.unpack();return t}unpack_map(e){let t={};for(let n=0;n<e;n++){let s=this.unpack();t[s]=this.unpack()}return t}unpack_float(){let e=this.unpack_uint32(),t=e>>31,n=(e>>23&255)-127,s=e&8388607|8388608;return(t===0?1:-1)*s*2**(n-23)}unpack_double(){let e=this.unpack_uint32(),t=this.unpack_uint32(),n=e>>31,s=(e>>20&2047)-1023,a=(e&1048575|1048576)*2**(s-20)+t*2**(s-52);return(n===0?1:-1)*a}read(e){let t=this.index;if(t+e<=this.length)return this.dataView.subarray(t,t+e);throw new Error("BinaryPackFailure: read index out of range")}},ld=class{getBuffer(){return this._bufferBuilder.toArrayBuffer()}pack(e){if(typeof e=="string")this.pack_string(e);else if(typeof e=="number")Math.floor(e)===e?this.pack_integer(e):this.pack_double(e);else if(typeof e=="boolean")e===!0?this._bufferBuilder.append(195):e===!1&&this._bufferBuilder.append(194);else if(e===void 0)this._bufferBuilder.append(192);else if(typeof e=="object")if(e===null)this._bufferBuilder.append(192);else{let t=e.constructor;if(e instanceof Array){let n=this.pack_array(e);if(n instanceof Promise)return n.then(()=>this._bufferBuilder.flush())}else if(e instanceof ArrayBuffer)this.pack_bin(new Uint8Array(e));else if("BYTES_PER_ELEMENT"in e){let n=e;this.pack_bin(new Uint8Array(n.buffer,n.byteOffset,n.byteLength))}else if(e instanceof Date)this.pack_string(e.toString());else{if(e instanceof Blob)return e.arrayBuffer().then(n=>{this.pack_bin(new Uint8Array(n)),this._bufferBuilder.flush()});if(t==Object||t.toString().startsWith("class")){let n=this.pack_object(e);if(n instanceof Promise)return n.then(()=>this._bufferBuilder.flush())}else throw new Error(`Type "${t.toString()}" not yet supported`)}}else throw new Error(`Type "${typeof e}" not yet supported`);this._bufferBuilder.flush()}pack_bin(e){let t=e.length;if(t<=15)this.pack_uint8(160+t);else if(t<=65535)this._bufferBuilder.append(218),this.pack_uint16(t);else if(t<=4294967295)this._bufferBuilder.append(219),this.pack_uint32(t);else throw new Error("Invalid length");this._bufferBuilder.append_buffer(e)}pack_string(e){let t=this._textEncoder.encode(e),n=t.length;if(n<=15)this.pack_uint8(176+n);else if(n<=65535)this._bufferBuilder.append(216),this.pack_uint16(n);else if(n<=4294967295)this._bufferBuilder.append(217),this.pack_uint32(n);else throw new Error("Invalid length");this._bufferBuilder.append_buffer(t)}pack_array(e){let t=e.length;if(t<=15)this.pack_uint8(144+t);else if(t<=65535)this._bufferBuilder.append(220),this.pack_uint16(t);else if(t<=4294967295)this._bufferBuilder.append(221),this.pack_uint32(t);else throw new Error("Invalid length");let n=s=>{if(s<t){let r=this.pack(e[s]);return r instanceof Promise?r.then(()=>n(s+1)):n(s+1)}};return n(0)}pack_integer(e){if(e>=-32&&e<=127)this._bufferBuilder.append(e&255);else if(e>=0&&e<=255)this._bufferBuilder.append(204),this.pack_uint8(e);else if(e>=-128&&e<=127)this._bufferBuilder.append(208),this.pack_int8(e);else if(e>=0&&e<=65535)this._bufferBuilder.append(205),this.pack_uint16(e);else if(e>=-32768&&e<=32767)this._bufferBuilder.append(209),this.pack_int16(e);else if(e>=0&&e<=4294967295)this._bufferBuilder.append(206),this.pack_uint32(e);else if(e>=-2147483648&&e<=2147483647)this._bufferBuilder.append(210),this.pack_int32(e);else if(e>=-9223372036854776e3&&e<=9223372036854776e3)this._bufferBuilder.append(211),this.pack_int64(e);else if(e>=0&&e<=18446744073709552e3)this._bufferBuilder.append(207),this.pack_uint64(e);else throw new Error("Invalid integer")}pack_double(e){let t=0;e<0&&(t=1,e=-e);let n=Math.floor(Math.log(e)/Math.LN2),s=e/2**n-1,r=Math.floor(s*2**52),a=2**32,o=t<<31|n+1023<<20|r/a&1048575,l=r%a;this._bufferBuilder.append(203),this.pack_int32(o),this.pack_int32(l)}pack_object(e){let t=Object.keys(e),n=t.length;if(n<=15)this.pack_uint8(128+n);else if(n<=65535)this._bufferBuilder.append(222),this.pack_uint16(n);else if(n<=4294967295)this._bufferBuilder.append(223),this.pack_uint32(n);else throw new Error("Invalid length");let s=r=>{if(r<t.length){let a=t[r];if(e.hasOwnProperty(a)){this.pack(a);let o=this.pack(e[a]);if(o instanceof Promise)return o.then(()=>s(r+1))}return s(r+1)}};return s(0)}pack_uint8(e){this._bufferBuilder.append(e)}pack_uint16(e){this._bufferBuilder.append(e>>8),this._bufferBuilder.append(e&255)}pack_uint32(e){let t=e&4294967295;this._bufferBuilder.append((t&4278190080)>>>24),this._bufferBuilder.append((t&16711680)>>>16),this._bufferBuilder.append((t&65280)>>>8),this._bufferBuilder.append(t&255)}pack_uint64(e){let t=e/4294967296,n=e%2**32;this._bufferBuilder.append((t&4278190080)>>>24),this._bufferBuilder.append((t&16711680)>>>16),this._bufferBuilder.append((t&65280)>>>8),this._bufferBuilder.append(t&255),this._bufferBuilder.append((n&4278190080)>>>24),this._bufferBuilder.append((n&16711680)>>>16),this._bufferBuilder.append((n&65280)>>>8),this._bufferBuilder.append(n&255)}pack_int8(e){this._bufferBuilder.append(e&255)}pack_int16(e){this._bufferBuilder.append((e&65280)>>8),this._bufferBuilder.append(e&255)}pack_int32(e){this._bufferBuilder.append(e>>>24&255),this._bufferBuilder.append((e&16711680)>>>16),this._bufferBuilder.append((e&65280)>>>8),this._bufferBuilder.append(e&255)}pack_int64(e){let t=Math.floor(e/4294967296),n=e%2**32;this._bufferBuilder.append((t&4278190080)>>>24),this._bufferBuilder.append((t&16711680)>>>16),this._bufferBuilder.append((t&65280)>>>8),this._bufferBuilder.append(t&255),this._bufferBuilder.append((n&4278190080)>>>24),this._bufferBuilder.append((n&16711680)>>>16),this._bufferBuilder.append((n&65280)>>>8),this._bufferBuilder.append(n&255)}constructor(){this._bufferBuilder=new ad,this._textEncoder=new TextEncoder}};var i0=!0,s0=!0;function Tr(i,e,t){let n=i.match(e);return n&&n.length>=t&&parseFloat(n[t],10)}function ii(i,e,t){if(!i.RTCPeerConnection)return;if(!Object.getOwnPropertyDescriptor(EventTarget.prototype,"addEventListener").writable){$a("Unable to polyfill events");return}let s=i.RTCPeerConnection.prototype,r=s.addEventListener;s.addEventListener=function(o,l){if(o!==e)return r.apply(this,arguments);let c=h=>{let u=t(h);u&&(l.handleEvent?l.handleEvent(u):l(u))};return this._eventMap=this._eventMap||{},this._eventMap[e]||(this._eventMap[e]=new Map),this._eventMap[e].set(l,c),r.apply(this,[o,c])};let a=s.removeEventListener;s.removeEventListener=function(o,l){if(o!==e||!this._eventMap||!this._eventMap[e])return a.apply(this,arguments);if(!this._eventMap[e].has(l))return a.apply(this,arguments);let c=this._eventMap[e].get(l);return this._eventMap[e].delete(l),this._eventMap[e].size===0&&delete this._eventMap[e],Object.keys(this._eventMap).length===0&&delete this._eventMap,a.apply(this,[o,c])},Object.defineProperty(s,"on"+e,{get(){return this["_on"+e]},set(o){this["_on"+e]&&(this.removeEventListener(e,this["_on"+e]),delete this["_on"+e]),o&&this.addEventListener(e,this["_on"+e]=o)},enumerable:!0,configurable:!0})}function r0(i){return typeof i!="boolean"?new Error("Argument type: "+typeof i+". Please use a boolean."):(i0=i,i?"adapter.js logging disabled":"adapter.js logging enabled")}function a0(i){return typeof i!="boolean"?new Error("Argument type: "+typeof i+". Please use a boolean."):(s0=!i,"adapter.js deprecation warnings "+(i?"disabled":"enabled"))}function $a(){if(typeof window=="object"){if(i0)return;typeof console<"u"&&typeof console.log=="function"&&console.log.apply(console,arguments)}}function Er(i,e){s0&&console.warn(i+" is deprecated, please use "+e+" instead.")}function o0(i){let e={browser:null,version:null};if(typeof i>"u"||!i.navigator||!i.navigator.userAgent)return e.browser="Not a browser.",e;let{navigator:t}=i;if(t.userAgentData&&t.userAgentData.brands){let n=t.userAgentData.brands.find(s=>s.brand==="Chromium");if(n){let s=parseInt(n.version,10);if(s>=90)return{browser:"chrome",version:s}}}if(t.mozGetUserMedia)e.browser="firefox",e.version=parseInt(Tr(t.userAgent,/Firefox\/(\d+)\./,1));else if(t.webkitGetUserMedia||i.isSecureContext===!1&&i.webkitRTCPeerConnection)e.browser="chrome",e.version=parseInt(Tr(t.userAgent,/Chrom(e|ium)\/(\d+)\./,2))||null;else if(i.RTCPeerConnection&&t.userAgent.match(/AppleWebKit\/(\d+)\./))e.browser="safari",e.version=parseInt(Tr(t.userAgent,/AppleWebKit\/(\d+)\./,1)),e.supportsUnifiedPlan=i.RTCRtpTransceiver&&"currentDirection"in i.RTCRtpTransceiver.prototype,e._safariVersion=Tr(t.userAgent,/Version\/(\d+(\.?\d+))/,1);else return e.browser="Not a supported browser.",e;return e}function n0(i){return Object.prototype.toString.call(i)==="[object Object]"}function dd(i){return n0(i)?Object.keys(i).reduce(function(e,t){let n=n0(i[t]),s=n?dd(i[t]):i[t],r=n&&!Object.keys(s).length;return s===void 0||r?e:Object.assign(e,{[t]:s})},{}):i}function ud(i,e,t){!e||t.has(e.id)||(t.set(e.id,e),Object.keys(e).forEach(n=>{n.endsWith("Id")?ud(i,i.get(e[n]),t):n.endsWith("Ids")&&e[n].forEach(s=>{ud(i,i.get(s),t)})}))}function fd(i,e,t){let n=t?"outbound-rtp":"inbound-rtp",s=new Map;if(e===null)return s;let r=[];return i.forEach(a=>{a.type==="track"&&a.trackIdentifier===e.id&&r.push(a)}),r.forEach(a=>{i.forEach(o=>{o.type===n&&o.trackId===a.id&&ud(i,o,s)})}),s}var $c={};uo($c,{fixNegotiationNeeded:()=>yd,shimAddTrackRemoveTrack:()=>_d,shimAddTrackRemoveTrackWithNative:()=>c0,shimGetSendersWithDtmf:()=>gd,shimGetUserMedia:()=>qc,shimMediaStream:()=>pd,shimOnTrack:()=>md,shimPeerConnection:()=>Yc,shimSenderReceiverGetStats:()=>xd});var l0=$a;function qc(i,e){if(e.version>=64)return;let t=i&&i.navigator;if(!t.mediaDevices)return;let n=function(o){if(typeof o!="object"||o.mandatory||o.optional)return o;let l={};return Object.keys(o).forEach(c=>{if(c==="require"||c==="advanced"||c==="mediaSource")return;let h=typeof o[c]=="object"?o[c]:{ideal:o[c]};h.exact!==void 0&&typeof h.exact=="number"&&(h.min=h.max=h.exact);let u=function(d,f){return d?d+f.charAt(0).toUpperCase()+f.slice(1):f==="deviceId"?"sourceId":f};if(h.ideal!==void 0){l.optional=l.optional||[];let d={};typeof h.ideal=="number"?(d[u("min",c)]=h.ideal,l.optional.push(d),d={},d[u("max",c)]=h.ideal,l.optional.push(d)):(d[u("",c)]=h.ideal,l.optional.push(d))}h.exact!==void 0&&typeof h.exact!="number"?(l.mandatory=l.mandatory||{},l.mandatory[u("",c)]=h.exact):["min","max"].forEach(d=>{h[d]!==void 0&&(l.mandatory=l.mandatory||{},l.mandatory[u(d,c)]=h[d])})}),o.advanced&&(l.optional=(l.optional||[]).concat(o.advanced)),l},s=function(o,l){if(e.version>=61)return l(o);if(o=JSON.parse(JSON.stringify(o)),o&&typeof o.audio=="object"){let c=function(h,u,d){u in h&&!(d in h)&&(h[d]=h[u],delete h[u])};o=JSON.parse(JSON.stringify(o)),c(o.audio,"autoGainControl","googAutoGainControl"),c(o.audio,"noiseSuppression","googNoiseSuppression"),o.audio=n(o.audio)}if(o&&typeof o.video=="object"){let c=o.video.facingMode;c=c&&(typeof c=="object"?c:{ideal:c});let h=e.version<66;if(c&&(c.exact==="user"||c.exact==="environment"||c.ideal==="user"||c.ideal==="environment")&&!(t.mediaDevices.getSupportedConstraints&&t.mediaDevices.getSupportedConstraints().facingMode&&!h)){delete o.video.facingMode;let u;if(c.exact==="environment"||c.ideal==="environment"?u=["back","rear"]:(c.exact==="user"||c.ideal==="user")&&(u=["front"]),u)return t.mediaDevices.enumerateDevices().then(d=>{d=d.filter(m=>m.kind==="videoinput");let f=d.find(m=>u.some(x=>m.label.toLowerCase().includes(x)));return!f&&d.length&&u.includes("back")&&(f=d[d.length-1]),f&&(o.video.deviceId=c.exact?{exact:f.deviceId}:{ideal:f.deviceId}),o.video=n(o.video),l0("chrome: "+JSON.stringify(o)),l(o)})}o.video=n(o.video)}return l0("chrome: "+JSON.stringify(o)),l(o)},r=function(o){return e.version>=64?o:{name:{PermissionDeniedError:"NotAllowedError",PermissionDismissedError:"NotAllowedError",InvalidStateError:"NotAllowedError",DevicesNotFoundError:"NotFoundError",ConstraintNotSatisfiedError:"OverconstrainedError",TrackStartError:"NotReadableError",MediaDeviceFailedDueToShutdown:"NotAllowedError",MediaDeviceKillSwitchOn:"NotAllowedError",TabCaptureError:"AbortError",ScreenCaptureError:"AbortError",DeviceCaptureError:"AbortError"}[o.name]||o.name,message:o.message,constraint:o.constraint||o.constraintName,toString(){return this.name+(this.message&&": ")+this.message}}},a=function(o,l,c){s(o,h=>{t.webkitGetUserMedia(h,l,u=>{c&&c(r(u))})})};if(t.getUserMedia=a.bind(t),t.mediaDevices.getUserMedia){let o=t.mediaDevices.getUserMedia.bind(t.mediaDevices);t.mediaDevices.getUserMedia=function(l){return s(l,c=>o(c).then(h=>{if(c.audio&&!h.getAudioTracks().length||c.video&&!h.getVideoTracks().length)throw h.getTracks().forEach(u=>{u.stop()}),new DOMException("","NotFoundError");return h},h=>Promise.reject(r(h))))}}}function pd(i){i.MediaStream=i.MediaStream||i.webkitMediaStream}function md(i,e){if(!(e.version>102))if(typeof i=="object"&&i.RTCPeerConnection&&!("ontrack"in i.RTCPeerConnection.prototype)){Object.defineProperty(i.RTCPeerConnection.prototype,"ontrack",{get(){return this._ontrack},set(n){this._ontrack&&this.removeEventListener("track",this._ontrack),this.addEventListener("track",this._ontrack=n)},enumerable:!0,configurable:!0});let t=i.RTCPeerConnection.prototype.setRemoteDescription;i.RTCPeerConnection.prototype.setRemoteDescription=function(){return this._ontrackpoly||(this._ontrackpoly=s=>{s.stream.addEventListener("addtrack",r=>{let a;i.RTCPeerConnection.prototype.getReceivers?a=this.getReceivers().find(l=>l.track&&l.track.id===r.track.id):a={track:r.track};let o=new Event("track");o.track=r.track,o.receiver=a,o.transceiver={receiver:a},o.streams=[s.stream],this.dispatchEvent(o)}),s.stream.getTracks().forEach(r=>{let a;i.RTCPeerConnection.prototype.getReceivers?a=this.getReceivers().find(l=>l.track&&l.track.id===r.id):a={track:r};let o=new Event("track");o.track=r,o.receiver=a,o.transceiver={receiver:a},o.streams=[s.stream],this.dispatchEvent(o)})},this.addEventListener("addstream",this._ontrackpoly)),t.apply(this,arguments)}}else ii(i,"track",t=>(t.transceiver||Object.defineProperty(t,"transceiver",{value:{receiver:t.receiver}}),t))}function gd(i){if(typeof i=="object"&&i.RTCPeerConnection&&!("getSenders"in i.RTCPeerConnection.prototype)&&"createDTMFSender"in i.RTCPeerConnection.prototype){let e=function(s,r){return{track:r,get dtmf(){return this._dtmf===void 0&&(r.kind==="audio"?this._dtmf=s.createDTMFSender(r):this._dtmf=null),this._dtmf},_pc:s}};if(!i.RTCPeerConnection.prototype.getSenders){i.RTCPeerConnection.prototype.getSenders=function(){return this._senders=this._senders||[],this._senders.slice()};let s=i.RTCPeerConnection.prototype.addTrack;i.RTCPeerConnection.prototype.addTrack=function(o,l){let c=s.apply(this,arguments);return c||(c=e(this,o),this._senders.push(c)),c};let r=i.RTCPeerConnection.prototype.removeTrack;i.RTCPeerConnection.prototype.removeTrack=function(o){r.apply(this,arguments);let l=this._senders.indexOf(o);l!==-1&&this._senders.splice(l,1)}}let t=i.RTCPeerConnection.prototype.addStream;i.RTCPeerConnection.prototype.addStream=function(r){this._senders=this._senders||[],t.apply(this,[r]),r.getTracks().forEach(a=>{this._senders.push(e(this,a))})};let n=i.RTCPeerConnection.prototype.removeStream;i.RTCPeerConnection.prototype.removeStream=function(r){this._senders=this._senders||[],n.apply(this,[r]),r.getTracks().forEach(a=>{let o=this._senders.find(l=>l.track===a);o&&this._senders.splice(this._senders.indexOf(o),1)})}}else if(typeof i=="object"&&i.RTCPeerConnection&&"getSenders"in i.RTCPeerConnection.prototype&&"createDTMFSender"in i.RTCPeerConnection.prototype&&i.RTCRtpSender&&!("dtmf"in i.RTCRtpSender.prototype)){let e=i.RTCPeerConnection.prototype.getSenders;i.RTCPeerConnection.prototype.getSenders=function(){let n=e.apply(this,[]);return n.forEach(s=>s._pc=this),n},Object.defineProperty(i.RTCRtpSender.prototype,"dtmf",{get(){return this._dtmf===void 0&&(this.track.kind==="audio"?this._dtmf=this._pc.createDTMFSender(this.track):this._dtmf=null),this._dtmf}})}}function xd(i,e){if(e.version>=67||!(typeof i=="object"&&i.RTCPeerConnection&&i.RTCRtpSender&&i.RTCRtpReceiver))return;if(!("getStats"in i.RTCRtpSender.prototype)){let n=i.RTCPeerConnection.prototype.getSenders;n&&(i.RTCPeerConnection.prototype.getSenders=function(){let a=n.apply(this,[]);return a.forEach(o=>o._pc=this),a});let s=i.RTCPeerConnection.prototype.addTrack;s&&(i.RTCPeerConnection.prototype.addTrack=function(){let a=s.apply(this,arguments);return a._pc=this,a}),i.RTCRtpSender.prototype.getStats=function(){let a=this;return this._pc.getStats().then(o=>fd(o,a.track,!0))}}if(!("getStats"in i.RTCRtpReceiver.prototype)){let n=i.RTCPeerConnection.prototype.getReceivers;n&&(i.RTCPeerConnection.prototype.getReceivers=function(){let r=n.apply(this,[]);return r.forEach(a=>a._pc=this),r}),ii(i,"track",s=>(s.receiver._pc=s.srcElement,s)),i.RTCRtpReceiver.prototype.getStats=function(){let r=this;return this._pc.getStats().then(a=>fd(a,r.track,!1))}}if(!("getStats"in i.RTCRtpSender.prototype&&"getStats"in i.RTCRtpReceiver.prototype))return;let t=i.RTCPeerConnection.prototype.getStats;i.RTCPeerConnection.prototype.getStats=function(){if(arguments.length>0&&arguments[0]instanceof i.MediaStreamTrack){let s=arguments[0],r,a,o;return this.getSenders().forEach(l=>{l.track===s&&(r?o=!0:r=l)}),this.getReceivers().forEach(l=>(l.track===s&&(a?o=!0:a=l),l.track===s)),o||r&&a?Promise.reject(new DOMException("There are more than one sender or receiver for the track.","InvalidAccessError")):r?r.getStats():a?a.getStats():Promise.reject(new DOMException("There is no sender or receiver for the track.","InvalidAccessError"))}return t.apply(this,arguments)}}function c0(i){i.RTCPeerConnection.prototype.getLocalStreams=function(){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},Object.keys(this._shimmedLocalStreams).map(a=>this._shimmedLocalStreams[a][0])};let e=i.RTCPeerConnection.prototype.addTrack;i.RTCPeerConnection.prototype.addTrack=function(a,o){if(!o)return e.apply(this,arguments);this._shimmedLocalStreams=this._shimmedLocalStreams||{};let l=e.apply(this,arguments);return this._shimmedLocalStreams[o.id]?this._shimmedLocalStreams[o.id].indexOf(l)===-1&&this._shimmedLocalStreams[o.id].push(l):this._shimmedLocalStreams[o.id]=[o,l],l};let t=i.RTCPeerConnection.prototype.addStream;i.RTCPeerConnection.prototype.addStream=function(a){this._shimmedLocalStreams=this._shimmedLocalStreams||{},a.getTracks().forEach(c=>{if(this.getSenders().find(u=>u.track===c))throw new DOMException("Track already exists.","InvalidAccessError")});let o=this.getSenders();t.apply(this,arguments);let l=this.getSenders().filter(c=>o.indexOf(c)===-1);this._shimmedLocalStreams[a.id]=[a].concat(l)};let n=i.RTCPeerConnection.prototype.removeStream;i.RTCPeerConnection.prototype.removeStream=function(a){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},delete this._shimmedLocalStreams[a.id],n.apply(this,arguments)};let s=i.RTCPeerConnection.prototype.removeTrack;i.RTCPeerConnection.prototype.removeTrack=function(a){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},a&&Object.keys(this._shimmedLocalStreams).forEach(o=>{let l=this._shimmedLocalStreams[o].indexOf(a);l!==-1&&this._shimmedLocalStreams[o].splice(l,1),this._shimmedLocalStreams[o].length===1&&delete this._shimmedLocalStreams[o]}),s.apply(this,arguments)}}function _d(i,e){if(!i.RTCPeerConnection)return;if(i.RTCPeerConnection.prototype.addTrack&&e.version>=65)return c0(i);let t=i.RTCPeerConnection.prototype.getLocalStreams;i.RTCPeerConnection.prototype.getLocalStreams=function(){let h=t.apply(this);return this._reverseStreams=this._reverseStreams||{},h.map(u=>this._reverseStreams[u.id])};let n=i.RTCPeerConnection.prototype.addStream;i.RTCPeerConnection.prototype.addStream=function(h){if(this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{},h.getTracks().forEach(u=>{if(this.getSenders().find(f=>f.track===u))throw new DOMException("Track already exists.","InvalidAccessError")}),!this._reverseStreams[h.id]){let u=new i.MediaStream(h.getTracks());this._streams[h.id]=u,this._reverseStreams[u.id]=h,h=u}n.apply(this,[h])};let s=i.RTCPeerConnection.prototype.removeStream;i.RTCPeerConnection.prototype.removeStream=function(h){this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{},s.apply(this,[this._streams[h.id]||h]),delete this._reverseStreams[this._streams[h.id]?this._streams[h.id].id:h.id],delete this._streams[h.id]},i.RTCPeerConnection.prototype.addTrack=function(h,u){if(this.signalingState==="closed")throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.","InvalidStateError");let d=[].slice.call(arguments,1);if(d.length!==1||!d[0].getTracks().find(x=>x===h))throw new DOMException("The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.","NotSupportedError");if(this.getSenders().find(x=>x.track===h))throw new DOMException("Track already exists.","InvalidAccessError");this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{};let m=this._streams[u.id];if(m)m.addTrack(h),Promise.resolve().then(()=>{this.dispatchEvent(new Event("negotiationneeded"))});else{let x=new i.MediaStream([h]);this._streams[u.id]=x,this._reverseStreams[x.id]=u,this.addStream(x)}return this.getSenders().find(x=>x.track===h)};function r(c,h){let u=h.sdp;return Object.keys(c._reverseStreams||[]).forEach(d=>{let f=c._reverseStreams[d],m=c._streams[f.id];u=u.replace(new RegExp(m.id,"g"),f.id)}),new RTCSessionDescription({type:h.type,sdp:u})}function a(c,h){let u=h.sdp;return Object.keys(c._reverseStreams||[]).forEach(d=>{let f=c._reverseStreams[d],m=c._streams[f.id];u=u.replace(new RegExp(f.id,"g"),m.id)}),new RTCSessionDescription({type:h.type,sdp:u})}["createOffer","createAnswer"].forEach(function(c){let h=i.RTCPeerConnection.prototype[c],u={[c](){let d=arguments;return arguments.length&&typeof arguments[0]=="function"?h.apply(this,[m=>{let x=r(this,m);d[0].apply(null,[x])},m=>{d[1]&&d[1].apply(null,m)},arguments[2]]):h.apply(this,arguments).then(m=>r(this,m))}};i.RTCPeerConnection.prototype[c]=u[c]});let o=i.RTCPeerConnection.prototype.setLocalDescription;i.RTCPeerConnection.prototype.setLocalDescription=function(){return!arguments.length||!arguments[0].type?o.apply(this,arguments):(arguments[0]=a(this,arguments[0]),o.apply(this,arguments))};let l=Object.getOwnPropertyDescriptor(i.RTCPeerConnection.prototype,"localDescription");Object.defineProperty(i.RTCPeerConnection.prototype,"localDescription",{get(){let c=l.get.apply(this);return c.type===""?c:r(this,c)}}),i.RTCPeerConnection.prototype.removeTrack=function(h){if(this.signalingState==="closed")throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.","InvalidStateError");if(!h._pc)throw new DOMException("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.","TypeError");if(!(h._pc===this))throw new DOMException("Sender was not created by this connection.","InvalidAccessError");this._streams=this._streams||{};let d;Object.keys(this._streams).forEach(f=>{this._streams[f].getTracks().find(x=>h.track===x)&&(d=this._streams[f])}),d&&(d.getTracks().length===1?this.removeStream(this._reverseStreams[d.id]):d.removeTrack(h.track),this.dispatchEvent(new Event("negotiationneeded")))}}function Yc(i,e){!i.RTCPeerConnection&&i.webkitRTCPeerConnection&&(i.RTCPeerConnection=i.webkitRTCPeerConnection),i.RTCPeerConnection&&e.version<53&&["setLocalDescription","setRemoteDescription","addIceCandidate"].forEach(function(t){let n=i.RTCPeerConnection.prototype[t],s={[t](){return arguments[0]=new(t==="addIceCandidate"?i.RTCIceCandidate:i.RTCSessionDescription)(arguments[0]),n.apply(this,arguments)}};i.RTCPeerConnection.prototype[t]=s[t]})}function yd(i,e){e.version>102||ii(i,"negotiationneeded",t=>{let n=t.target;if(!((e.version<72||n.getConfiguration&&n.getConfiguration().sdpSemantics==="plan-b")&&n.signalingState!=="stable"))return t})}var Jc={};uo(Jc,{shimAddTransceiver:()=>wd,shimCreateAnswer:()=>Rd,shimCreateOffer:()=>Cd,shimGetDisplayMedia:()=>h0,shimGetParameters:()=>Ad,shimGetStats:()=>bd,shimGetUserMedia:()=>Zc,shimOnTrack:()=>vd,shimPeerConnection:()=>jc,shimRTCDataChannel:()=>Ed,shimReceiverGetStats:()=>Sd,shimRemoveStream:()=>Td,shimSenderGetStats:()=>Md});function Zc(i,e){let t=i&&i.navigator;if(!t.mediaDevices)return;let n=i&&i.MediaStreamTrack;if(t.getUserMedia=function(s,r,a){Er("navigator.getUserMedia","navigator.mediaDevices.getUserMedia"),t.mediaDevices.getUserMedia(s).then(r,a)},!(e.version>55&&"autoGainControl"in t.mediaDevices.getSupportedConstraints())){let s=function(a,o,l){o in a&&!(l in a)&&(a[l]=a[o],delete a[o])},r=t.mediaDevices.getUserMedia.bind(t.mediaDevices);if(t.mediaDevices.getUserMedia=function(a){return typeof a=="object"&&typeof a.audio=="object"&&(a=JSON.parse(JSON.stringify(a)),s(a.audio,"autoGainControl","mozAutoGainControl"),s(a.audio,"noiseSuppression","mozNoiseSuppression")),r(a)},n&&n.prototype.getSettings){let a=n.prototype.getSettings;n.prototype.getSettings=function(){let o=a.apply(this,arguments);return s(o,"mozAutoGainControl","autoGainControl"),s(o,"mozNoiseSuppression","noiseSuppression"),o}}if(n&&n.prototype.applyConstraints){let a=n.prototype.applyConstraints;n.prototype.applyConstraints=function(o){return this.kind==="audio"&&typeof o=="object"&&(o=JSON.parse(JSON.stringify(o)),s(o,"autoGainControl","mozAutoGainControl"),s(o,"noiseSuppression","mozNoiseSuppression")),a.apply(this,[o])}}}}function h0(i,e){i.navigator.mediaDevices&&(i.navigator.mediaDevices&&"getDisplayMedia"in i.navigator.mediaDevices||(i.navigator.mediaDevices.getDisplayMedia=function(n){if(!(n&&n.video)){let s=new DOMException("getDisplayMedia without video constraints is undefined");return s.name="NotFoundError",s.code=8,Promise.reject(s)}return n.video===!0?n.video={mediaSource:e}:n.video.mediaSource=e,i.navigator.mediaDevices.getUserMedia(n)}))}function vd(i){typeof i=="object"&&i.RTCTrackEvent&&"receiver"in i.RTCTrackEvent.prototype&&!("transceiver"in i.RTCTrackEvent.prototype)&&Object.defineProperty(i.RTCTrackEvent.prototype,"transceiver",{get(){return{receiver:this.receiver}}})}function jc(i,e){typeof i!="object"||!(i.RTCPeerConnection||i.mozRTCPeerConnection)||(!i.RTCPeerConnection&&i.mozRTCPeerConnection&&(i.RTCPeerConnection=i.mozRTCPeerConnection),e.version<53&&["setLocalDescription","setRemoteDescription","addIceCandidate"].forEach(function(t){let n=i.RTCPeerConnection.prototype[t],s={[t](){return arguments[0]=new(t==="addIceCandidate"?i.RTCIceCandidate:i.RTCSessionDescription)(arguments[0]),n.apply(this,arguments)}};i.RTCPeerConnection.prototype[t]=s[t]}))}function bd(i,e){if(typeof i!="object"||!(i.RTCPeerConnection||i.mozRTCPeerConnection)||e.version>=151)return;let t={inboundrtp:"inbound-rtp",outboundrtp:"outbound-rtp",candidatepair:"candidate-pair",localcandidate:"local-candidate",remotecandidate:"remote-candidate"},n=i.RTCPeerConnection.prototype.getStats;i.RTCPeerConnection.prototype.getStats=function(){let[r,a,o]=arguments;return this.signalingState==="closed"?Promise.resolve(new Map):n.apply(this,[r||null]).then(l=>{if(e.version<53&&!a)try{l.forEach(c=>{c.type=t[c.type]||c.type})}catch(c){if(c.name!=="TypeError")throw c;l.forEach((h,u)=>{l.set(u,Object.assign({},h,{type:t[h.type]||h.type}))})}return l}).then(a,o)}}function Md(i){if(!(typeof i=="object"&&i.RTCPeerConnection&&i.RTCRtpSender)||i.RTCRtpSender&&"getStats"in i.RTCRtpSender.prototype)return;let e=i.RTCPeerConnection.prototype.getSenders;e&&(i.RTCPeerConnection.prototype.getSenders=function(){let s=e.apply(this,[]);return s.forEach(r=>r._pc=this),s});let t=i.RTCPeerConnection.prototype.addTrack;t&&(i.RTCPeerConnection.prototype.addTrack=function(){let s=t.apply(this,arguments);return s._pc=this,s}),i.RTCRtpSender.prototype.getStats=function(){return this.track?this._pc.getStats(this.track):Promise.resolve(new Map)}}function Sd(i){if(!(typeof i=="object"&&i.RTCPeerConnection&&i.RTCRtpSender)||i.RTCRtpSender&&"getStats"in i.RTCRtpReceiver.prototype)return;let e=i.RTCPeerConnection.prototype.getReceivers;e&&(i.RTCPeerConnection.prototype.getReceivers=function(){let n=e.apply(this,[]);return n.forEach(s=>s._pc=this),n}),ii(i,"track",t=>(t.receiver._pc=t.srcElement,t)),i.RTCRtpReceiver.prototype.getStats=function(){return this._pc.getStats(this.track)}}function Td(i){!i.RTCPeerConnection||"removeStream"in i.RTCPeerConnection.prototype||(i.RTCPeerConnection.prototype.removeStream=function(t){Er("removeStream","removeTrack"),this.getSenders().forEach(n=>{n.track&&t.getTracks().includes(n.track)&&this.removeTrack(n)})})}function Ed(i){i.DataChannel&&!i.RTCDataChannel&&(i.RTCDataChannel=i.DataChannel)}function wd(i,e){if(!(typeof i=="object"&&i.RTCPeerConnection)||e.version>=110)return;let t=i.RTCPeerConnection.prototype.addTransceiver;t&&(i.RTCPeerConnection.prototype.addTransceiver=function(){this.setParametersPromises=[];let s=arguments[1]&&arguments[1].sendEncodings;s===void 0&&(s=[]),s=[...s];let r=s.length>0;r&&s.forEach(o=>{if("rid"in o&&!/^[a-z0-9]{0,16}$/i.test(o.rid))throw new TypeError("Invalid RID value provided.");if("scaleResolutionDownBy"in o&&!(parseFloat(o.scaleResolutionDownBy)>=1))throw new RangeError("scale_resolution_down_by must be >= 1.0");if("maxFramerate"in o&&!(parseFloat(o.maxFramerate)>=0))throw new RangeError("max_framerate must be >= 0.0")});let a=t.apply(this,arguments);if(r){let{sender:o}=a,l=o.getParameters();(!("encodings"in l)||l.encodings.length===1&&Object.keys(l.encodings[0]).length===0)&&(l.encodings=s,o.sendEncodings=s,this.setParametersPromises.push(o.setParameters(l).then(()=>{delete o.sendEncodings}).catch(()=>{delete o.sendEncodings})))}return a})}function Ad(i,e){if(!(typeof i=="object"&&i.RTCRtpSender)||e.version>=110)return;let t=i.RTCRtpSender.prototype.getParameters;t&&(i.RTCRtpSender.prototype.getParameters=function(){let s=t.apply(this,arguments);return"encodings"in s||(s.encodings=[].concat(this.sendEncodings||[{}])),s})}function Cd(i,e){if(!(typeof i=="object"&&i.RTCPeerConnection)||e.version>=110)return;let t=i.RTCPeerConnection.prototype.createOffer;i.RTCPeerConnection.prototype.createOffer=function(){return this.setParametersPromises&&this.setParametersPromises.length?Promise.all(this.setParametersPromises).then(()=>t.apply(this,arguments)).finally(()=>{this.setParametersPromises=[]}):t.apply(this,arguments)}}function Rd(i,e){if(!(typeof i=="object"&&i.RTCPeerConnection)||e.version>=110)return;let t=i.RTCPeerConnection.prototype.createAnswer;i.RTCPeerConnection.prototype.createAnswer=function(){return this.setParametersPromises&&this.setParametersPromises.length?Promise.all(this.setParametersPromises).then(()=>t.apply(this,arguments)).finally(()=>{this.setParametersPromises=[]}):t.apply(this,arguments)}}var Kc={};uo(Kc,{shimAudioContext:()=>zd,shimCallbacksAPI:()=>Ld,shimConstraints:()=>u0,shimCreateOfferLegacy:()=>Ud,shimGetUserMedia:()=>kd,shimLocalStreamsAPI:()=>Pd,shimRTCIceServerUrls:()=>Dd,shimRemoteStreamsAPI:()=>Id,shimTrackEventTransceiver:()=>Nd});function Pd(i){if(!(typeof i!="object"||!i.RTCPeerConnection)){if("getLocalStreams"in i.RTCPeerConnection.prototype||(i.RTCPeerConnection.prototype.getLocalStreams=function(){return this._localStreams||(this._localStreams=[]),this._localStreams}),!("addStream"in i.RTCPeerConnection.prototype)){let e=i.RTCPeerConnection.prototype.addTrack;i.RTCPeerConnection.prototype.addStream=function(n){this._localStreams||(this._localStreams=[]),this._localStreams.includes(n)||this._localStreams.push(n),n.getAudioTracks().forEach(s=>e.call(this,s,n)),n.getVideoTracks().forEach(s=>e.call(this,s,n))},i.RTCPeerConnection.prototype.addTrack=function(n,...s){return s&&s.forEach(r=>{this._localStreams?this._localStreams.includes(r)||this._localStreams.push(r):this._localStreams=[r]}),e.apply(this,arguments)}}"removeStream"in i.RTCPeerConnection.prototype||(i.RTCPeerConnection.prototype.removeStream=function(t){this._localStreams||(this._localStreams=[]);let n=this._localStreams.indexOf(t);if(n===-1)return;this._localStreams.splice(n,1);let s=t.getTracks();this.getSenders().forEach(r=>{s.includes(r.track)&&this.removeTrack(r)})})}}function Id(i){if(!(typeof i!="object"||!i.RTCPeerConnection)&&("getRemoteStreams"in i.RTCPeerConnection.prototype||(i.RTCPeerConnection.prototype.getRemoteStreams=function(){return this._remoteStreams?this._remoteStreams:[]}),!("onaddstream"in i.RTCPeerConnection.prototype))){Object.defineProperty(i.RTCPeerConnection.prototype,"onaddstream",{get(){return this._onaddstream},set(t){this._onaddstream&&(this.removeEventListener("addstream",this._onaddstream),this.removeEventListener("track",this._onaddstreampoly)),this.addEventListener("addstream",this._onaddstream=t),this.addEventListener("track",this._onaddstreampoly=n=>{n.streams.forEach(s=>{if(this._remoteStreams||(this._remoteStreams=[]),this._remoteStreams.includes(s))return;this._remoteStreams.push(s);let r=new Event("addstream");r.stream=s,this.dispatchEvent(r)})})}});let e=i.RTCPeerConnection.prototype.setRemoteDescription;i.RTCPeerConnection.prototype.setRemoteDescription=function(){let n=this;return this._onaddstreampoly||this.addEventListener("track",this._onaddstreampoly=function(s){s.streams.forEach(r=>{if(n._remoteStreams||(n._remoteStreams=[]),n._remoteStreams.indexOf(r)>=0)return;n._remoteStreams.push(r);let a=new Event("addstream");a.stream=r,n.dispatchEvent(a)})}),e.apply(n,arguments)}}}function Ld(i){if(typeof i!="object"||!i.RTCPeerConnection)return;let e=i.RTCPeerConnection.prototype,t=e.createOffer,n=e.createAnswer,s=e.setLocalDescription,r=e.setRemoteDescription,a=e.addIceCandidate;e.createOffer=function(c,h){let u=arguments.length>=2?arguments[2]:arguments[0],d=t.apply(this,[u]);return h?(d.then(c,h),Promise.resolve()):d},e.createAnswer=function(c,h){let u=arguments.length>=2?arguments[2]:arguments[0],d=n.apply(this,[u]);return h?(d.then(c,h),Promise.resolve()):d};let o=function(l,c,h){let u=s.apply(this,[l]);return h?(u.then(c,h),Promise.resolve()):u};e.setLocalDescription=o,o=function(l,c,h){let u=r.apply(this,[l]);return h?(u.then(c,h),Promise.resolve()):u},e.setRemoteDescription=o,o=function(l,c,h){let u=a.apply(this,[l]);return h?(u.then(c,h),Promise.resolve()):u},e.addIceCandidate=o}function kd(i){let e=i&&i.navigator;if(e.mediaDevices&&e.mediaDevices.getUserMedia){let t=e.mediaDevices,n=t.getUserMedia.bind(t);e.mediaDevices.getUserMedia=s=>n(u0(s))}!e.getUserMedia&&e.mediaDevices&&e.mediaDevices.getUserMedia&&(e.getUserMedia=function(n,s,r){e.mediaDevices.getUserMedia(n).then(s,r)}.bind(e))}function u0(i){return i&&i.video!==void 0?Object.assign({},i,{video:dd(i.video)}):i}function Dd(i){if(!i.RTCPeerConnection)return;let e=i.RTCPeerConnection;i.RTCPeerConnection=function(n,s){if(n&&n.iceServers){let r=[];for(let a=0;a<n.iceServers.length;a++){let o=n.iceServers[a];o.urls===void 0&&o.url?(Er("RTCIceServer.url","RTCIceServer.urls"),o=JSON.parse(JSON.stringify(o)),o.urls=o.url,delete o.url,r.push(o)):r.push(n.iceServers[a])}n.iceServers=r}return new e(n,s)},i.RTCPeerConnection.prototype=e.prototype,"generateCertificate"in e&&Object.defineProperty(i.RTCPeerConnection,"generateCertificate",{get(){return e.generateCertificate}})}function Nd(i){typeof i=="object"&&i.RTCTrackEvent&&"receiver"in i.RTCTrackEvent.prototype&&!("transceiver"in i.RTCTrackEvent.prototype)&&Object.defineProperty(i.RTCTrackEvent.prototype,"transceiver",{get(){return{receiver:this.receiver}}})}function Ud(i){let e=i.RTCPeerConnection.prototype.createOffer;i.RTCPeerConnection.prototype.createOffer=function(n){if(n){typeof n.offerToReceiveAudio<"u"&&(n.offerToReceiveAudio=!!n.offerToReceiveAudio);let s=this.getTransceivers().find(a=>a.receiver.track.kind==="audio");n.offerToReceiveAudio===!1&&s?s.direction==="sendrecv"?s.setDirection?s.setDirection("sendonly"):s.direction="sendonly":s.direction==="recvonly"&&(s.setDirection?s.setDirection("inactive"):s.direction="inactive"):n.offerToReceiveAudio===!0&&!s&&this.addTransceiver("audio",{direction:"recvonly"}),typeof n.offerToReceiveVideo<"u"&&(n.offerToReceiveVideo=!!n.offerToReceiveVideo);let r=this.getTransceivers().find(a=>a.receiver.track.kind==="video");n.offerToReceiveVideo===!1&&r?r.direction==="sendrecv"?r.setDirection?r.setDirection("sendonly"):r.direction="sendonly":r.direction==="recvonly"&&(r.setDirection?r.setDirection("inactive"):r.direction="inactive"):n.offerToReceiveVideo===!0&&!r&&this.addTransceiver("video",{direction:"recvonly"})}return e.apply(this,arguments)}}function zd(i){typeof i!="object"||i.AudioContext||(i.AudioContext=i.webkitAudioContext)}var Bd={};uo(Bd,{removeExtmapAllowMixed:()=>th,shimAddIceCandidateNullOrEmpty:()=>Ka,shimConnectionState:()=>eh,shimMaxMessageSize:()=>ja,shimParameterlessSetLocalDescription:()=>Qa,shimRTCIceCandidate:()=>Za,shimRTCIceCandidateRelayProtocol:()=>Qc,shimSendThrowTypeError:()=>Ja});var wr=Of(Fd());function Za(i){if(!i.RTCIceCandidate||i.RTCIceCandidate&&"foundation"in i.RTCIceCandidate.prototype)return;let e=i.RTCIceCandidate;i.RTCIceCandidate=function(n){if(typeof n=="object"&&n.candidate&&n.candidate.indexOf("a=")===0&&(n=JSON.parse(JSON.stringify(n)),n.candidate=n.candidate.substring(2)),n.candidate&&n.candidate.length){let s=new e(n),r=wr.default.parseCandidate(n.candidate);for(let a in r)a in s||Object.defineProperty(s,a,{value:r[a]});return s.toJSON=function(){return{candidate:s.candidate,sdpMid:s.sdpMid,sdpMLineIndex:s.sdpMLineIndex,usernameFragment:s.usernameFragment}},s}return new e(n)},i.RTCIceCandidate.prototype=e.prototype,ii(i,"icecandidate",t=>(t.candidate&&Object.defineProperty(t,"candidate",{value:new i.RTCIceCandidate(t.candidate),writable:"false"}),t))}function Qc(i){!i.RTCIceCandidate||i.RTCIceCandidate&&"relayProtocol"in i.RTCIceCandidate.prototype||ii(i,"icecandidate",e=>{if(e.candidate){let t=wr.default.parseCandidate(e.candidate.candidate);t.type==="relay"&&(e.candidate.relayProtocol={0:"tls",1:"tcp",2:"udp"}[t.priority>>24])}return e})}function ja(i,e){if(!i.RTCPeerConnection||e.browser==="chrome"&&e.version>102||e.browser==="firefox"&&e.version>=113)return;"sctp"in i.RTCPeerConnection.prototype||Object.defineProperty(i.RTCPeerConnection.prototype,"sctp",{get(){return typeof this._sctp>"u"?null:this._sctp}});let t=function(o){if(!o||!o.sdp)return!1;let l=wr.default.splitSections(o.sdp);return l.shift(),l.some(c=>{let h=wr.default.parseMLine(c);return h&&h.kind==="application"&&h.protocol.indexOf("SCTP")!==-1})},n=function(o){let l=o.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);if(l===null||l.length<2)return-1;let c=parseInt(l[1],10);return c!==c?-1:c},s=function(o){let l=65536;return e.browser==="firefox"&&(e.version<57?o===-1?l=16384:l=2147483637:e.version<60?l=e.version===57?65535:65536:l=2147483637),l},r=function(o,l){let c=65536;e.browser==="firefox"&&e.version===57&&(c=65535);let h=wr.default.matchPrefix(o.sdp,"a=max-message-size:");return h.length>0?c=parseInt(h[0].substring(19),10):e.browser==="firefox"&&l!==-1&&(c=2147483637),c},a=i.RTCPeerConnection.prototype.setRemoteDescription;i.RTCPeerConnection.prototype.setRemoteDescription=function(){if(this._sctp=null,e.browser==="chrome"&&e.version>=76){let{sdpSemantics:l}=this.getConfiguration();l==="plan-b"&&Object.defineProperty(this,"sctp",{get(){return typeof this._sctp>"u"?null:this._sctp},enumerable:!0,configurable:!0})}if(t(arguments[0])){let l=n(arguments[0]),c=s(l),h=r(arguments[0],l),u;c===0&&h===0?u=Number.POSITIVE_INFINITY:c===0||h===0?u=Math.max(c,h):u=Math.min(c,h);let d={};Object.defineProperty(d,"maxMessageSize",{get(){return u}}),this._sctp=d}return a.apply(this,arguments)}}function Ja(i,e){if(!(i.RTCPeerConnection&&"createDataChannel"in i.RTCPeerConnection.prototype)||e.browser==="chrome"&&e.version>=149||e.browser==="firefox"&&e.version>60)return;function t(s,r){let a=s.send;s.send=function(){let l=arguments[0],c=l.length||l.size||l.byteLength;if(s.readyState==="open"&&r.sctp&&c>r.sctp.maxMessageSize)throw new TypeError("Message too large (can send a maximum of "+r.sctp.maxMessageSize+" bytes)");return a.apply(s,arguments)}}let n=i.RTCPeerConnection.prototype.createDataChannel;i.RTCPeerConnection.prototype.createDataChannel=function(){let r=n.apply(this,arguments);return t(r,this),r},ii(i,"datachannel",s=>(t(s.channel,s.target),s))}function eh(i){if(!i.RTCPeerConnection||"connectionState"in i.RTCPeerConnection.prototype)return;let e=i.RTCPeerConnection.prototype;Object.defineProperty(e,"connectionState",{get(){return{completed:"connected",checking:"connecting"}[this.iceConnectionState]||this.iceConnectionState},enumerable:!0,configurable:!0}),Object.defineProperty(e,"onconnectionstatechange",{get(){return this._onconnectionstatechange||null},set(t){this._onconnectionstatechange&&(this.removeEventListener("connectionstatechange",this._onconnectionstatechange),delete this._onconnectionstatechange),t&&this.addEventListener("connectionstatechange",this._onconnectionstatechange=t)},enumerable:!0,configurable:!0}),["setLocalDescription","setRemoteDescription"].forEach(t=>{let n=e[t];e[t]=function(){return this._connectionstatechangepoly||(this._connectionstatechangepoly=s=>{let r=s.target;if(r._lastConnectionState!==r.connectionState){r._lastConnectionState=r.connectionState;let a=new Event("connectionstatechange",s);r.dispatchEvent(a)}return s},this.addEventListener("iceconnectionstatechange",this._connectionstatechangepoly)),n.apply(this,arguments)}})}function th(i,e){if(!i.RTCPeerConnection||e.browser==="chrome"&&e.version>=71||e.browser==="safari"&&e._safariVersion>=13.1)return;let t=i.RTCPeerConnection.prototype.setRemoteDescription;i.RTCPeerConnection.prototype.setRemoteDescription=function(s){if(s&&s.sdp&&s.sdp.indexOf(`
a=extmap-allow-mixed`)!==-1){let r=s.sdp.split(`
`).filter(a=>a.trim()!=="a=extmap-allow-mixed").join(`
`);i.RTCSessionDescription&&s instanceof i.RTCSessionDescription?arguments[0]=new i.RTCSessionDescription({type:s.type,sdp:r}):s.sdp=r}return t.apply(this,arguments)}}function Ka(i,e){if(!(i.RTCPeerConnection&&i.RTCPeerConnection.prototype))return;let t=i.RTCPeerConnection.prototype.addIceCandidate;!t||t.length===0||(i.RTCPeerConnection.prototype.addIceCandidate=function(){return arguments[0]?(e.browser==="chrome"&&e.version<78||e.browser==="firefox"&&e.version<68||e.browser==="safari")&&arguments[0]&&arguments[0].candidate===""?Promise.resolve():t.apply(this,arguments):(arguments[1]&&arguments[1].apply(null),Promise.resolve())})}function Qa(i,e){if(!(i.RTCPeerConnection&&i.RTCPeerConnection.prototype))return;let t=i.RTCPeerConnection.prototype.setLocalDescription;!t||t.length===0||(i.RTCPeerConnection.prototype.setLocalDescription=function(){let s=arguments[0]||{};if(typeof s!="object"||s.type&&s.sdp)return t.apply(this,arguments);if(s={type:s.type,sdp:s.sdp},!s.type)switch(this.signalingState){case"stable":case"have-local-offer":case"have-remote-pranswer":s.type="offer";break;default:s.type="answer";break}return s.sdp||s.type!=="offer"&&s.type!=="answer"?t.apply(this,[s]):(s.type==="offer"?this.createOffer:this.createAnswer).apply(this).then(a=>t.apply(this,[a]))})}var BM=Of(Fd());function d0({window:i}={},e={shimChrome:!0,shimFirefox:!0,shimSafari:!0}){let t=$a,n=o0(i),s={browserDetails:n,commonShim:Bd,extractVersion:Tr,disableLog:r0,disableWarnings:a0,sdp:BM};switch(n.browser){case"chrome":if(!$c||!Yc||!e.shimChrome)return t("Chrome shim is not included in this adapter release."),s;if(n.version===null)return t("Chrome shim can not determine version, not shimming."),s;t("adapter.js shimming chrome."),s.browserShim=$c,Ka(i,n),Qa(i,n),qc(i,n),pd(i,n),Yc(i,n),md(i,n),_d(i,n),gd(i,n),xd(i,n),yd(i,n),Za(i,n),Qc(i,n),eh(i,n),ja(i,n),Ja(i,n),th(i,n);break;case"firefox":if(!Jc||!jc||!e.shimFirefox)return t("Firefox shim is not included in this adapter release."),s;t("adapter.js shimming firefox."),s.browserShim=Jc,Ka(i,n),Qa(i,n),Zc(i,n),jc(i,n),bd(i,n),vd(i,n),Td(i,n),Md(i,n),Sd(i,n),Ed(i,n),wd(i,n),Ad(i,n),Cd(i,n),Rd(i,n),Za(i,n),eh(i,n),ja(i,n),Ja(i,n);break;case"safari":if(!Kc||!e.shimSafari)return t("Safari shim is not included in this adapter release."),s;t("adapter.js shimming safari."),s.browserShim=Kc,Ka(i,n),Qa(i,n),Dd(i,n),Ud(i,n),Ld(i,n),Pd(i,n),Id(i,n),Nd(i,n),kd(i,n),zd(i,n),Za(i,n),Qc(i,n),ja(i,n),Ja(i,n),th(i,n);break;default:t("Unsupported browser!");break}return s}var HM=d0({window:typeof window>"u"?void 0:window}),Hd=HM;function Ss(i,e,t,n){Object.defineProperty(i,e,{get:t,set:n,enumerable:!0,configurable:!0})}var ih=class{constructor(){this.chunkedMTU=16300,this._dataCount=1,this.chunk=e=>{let t=[],n=e.byteLength,s=Math.ceil(n/this.chunkedMTU),r=0,a=0;for(;a<n;){let o=Math.min(n,a+this.chunkedMTU),l=e.slice(a,o),c={__peerData:this._dataCount,n:r,data:l,total:s};t.push(c),a=o,r++}return this._dataCount++,t}}};function VM(i){let e=0;for(let s of i)e+=s.byteLength;let t=new Uint8Array(e),n=0;for(let s of i)t.set(s,n),n+=s.byteLength;return t}var Vd=Hd.default||Hd,eo=new class{isWebRTCSupported(){return typeof RTCPeerConnection<"u"}isBrowserSupported(){let i=this.getBrowser(),e=this.getVersion();return this.supportedBrowsers.includes(i)?i==="chrome"?e>=this.minChromeVersion:i==="firefox"?e>=this.minFirefoxVersion:i==="safari"?!this.isIOS&&e>=this.minSafariVersion:!1:!1}getBrowser(){return Vd.browserDetails.browser}getVersion(){return Vd.browserDetails.version||0}isUnifiedPlanSupported(){let i=this.getBrowser(),e=Vd.browserDetails.version||0;if(i==="chrome"&&e<this.minChromeVersion)return!1;if(i==="firefox"&&e>=this.minFirefoxVersion)return!0;if(!window.RTCRtpTransceiver||!("currentDirection"in RTCRtpTransceiver.prototype))return!1;let t,n=!1;try{t=new RTCPeerConnection,t.addTransceiver("audio"),n=!0}catch{}finally{t&&t.close()}return n}toString(){return`Supports:
    browser:${this.getBrowser()}
    version:${this.getVersion()}
    isIOS:${this.isIOS}
    isWebRTCSupported:${this.isWebRTCSupported()}
    isBrowserSupported:${this.isBrowserSupported()}
    isUnifiedPlanSupported:${this.isUnifiedPlanSupported()}`}constructor(){this.isIOS=typeof navigator<"u"?["iPad","iPhone","iPod"].includes(navigator.platform):!1,this.supportedBrowsers=["firefox","chrome","safari"],this.minFirefoxVersion=59,this.minChromeVersion=72,this.minSafariVersion=605}},GM=i=>!i||/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.test(i),p0=()=>Math.random().toString(36).slice(2),f0={iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:["turn:eu-0.turn.peerjs.com:3478","turn:us-0.turn.peerjs.com:3478"],username:"peerjs",credential:"peerjsp"}],sdpSemantics:"unified-plan"},Gd=class extends ih{noop(){}blobToArrayBuffer(e,t){let n=new FileReader;return n.onload=function(s){s.target&&t(s.target.result)},n.readAsArrayBuffer(e),n}binaryStringToArrayBuffer(e){let t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n)&255;return t.buffer}isSecure(){return location.protocol==="https:"}constructor(...e){super(...e),this.CLOUD_HOST="0.peerjs.com",this.CLOUD_PORT=443,this.chunkedBrowsers={Chrome:1,chrome:1},this.defaultConfig=f0,this.browser=eo.getBrowser(),this.browserVersion=eo.getVersion(),this.pack=hd,this.unpack=cd,this.supports=(function(){let t={browser:eo.isBrowserSupported(),webRTC:eo.isWebRTCSupported(),audioVideo:!1,data:!1,binaryBlob:!1,reliable:!1};if(!t.webRTC)return t;let n;try{n=new RTCPeerConnection(f0),t.audioVideo=!0;let s;try{s=n.createDataChannel("_PEERJSTEST",{ordered:!0}),t.data=!0,t.reliable=!!s.ordered;try{s.binaryType="blob",t.binaryBlob=!eo.isIOS}catch{}}catch{}finally{s&&s.close()}}catch{}finally{n&&n.close()}return t})(),this.validateId=GM,this.randomToken=p0}},_n=new Gd,WM="PeerJS: ";var Wd=class{get logLevel(){return this._logLevel}set logLevel(e){this._logLevel=e}log(...e){this._logLevel>=3&&this._print(3,...e)}warn(...e){this._logLevel>=2&&this._print(2,...e)}error(...e){this._logLevel>=1&&this._print(1,...e)}setLogFunction(e){this._print=e}_print(e,...t){let n=[WM,...t];for(let s in n)n[s]instanceof Error&&(n[s]="("+n[s].name+") "+n[s].message);e>=3?console.log(...n):e>=2?console.warn("WARNING",...n):e>=1&&console.error("ERROR",...n)}constructor(){this._logLevel=0}},Ie=new Wd,tf={},XM=Object.prototype.hasOwnProperty,mn="~";function so(){}Object.create&&(so.prototype=Object.create(null),new so().__proto__||(mn=!1));function qM(i,e,t){this.fn=i,this.context=e,this.once=t||!1}function m0(i,e,t,n,s){if(typeof t!="function")throw new TypeError("The listener must be a function");var r=new qM(t,n||i,s),a=mn?mn+e:e;return i._events[a]?i._events[a].fn?i._events[a]=[i._events[a],r]:i._events[a].push(r):(i._events[a]=r,i._eventsCount++),i}function nh(i,e){--i._eventsCount===0?i._events=new so:delete i._events[e]}function cn(){this._events=new so,this._eventsCount=0}cn.prototype.eventNames=function(){var e=[],t,n;if(this._eventsCount===0)return e;for(n in t=this._events)XM.call(t,n)&&e.push(mn?n.slice(1):n);return Object.getOwnPropertySymbols?e.concat(Object.getOwnPropertySymbols(t)):e};cn.prototype.listeners=function(e){var t=mn?mn+e:e,n=this._events[t];if(!n)return[];if(n.fn)return[n.fn];for(var s=0,r=n.length,a=new Array(r);s<r;s++)a[s]=n[s].fn;return a};cn.prototype.listenerCount=function(e){var t=mn?mn+e:e,n=this._events[t];return n?n.fn?1:n.length:0};cn.prototype.emit=function(e,t,n,s,r,a){var o=mn?mn+e:e;if(!this._events[o])return!1;var l=this._events[o],c=arguments.length,h,u;if(l.fn){switch(l.once&&this.removeListener(e,l.fn,void 0,!0),c){case 1:return l.fn.call(l.context),!0;case 2:return l.fn.call(l.context,t),!0;case 3:return l.fn.call(l.context,t,n),!0;case 4:return l.fn.call(l.context,t,n,s),!0;case 5:return l.fn.call(l.context,t,n,s,r),!0;case 6:return l.fn.call(l.context,t,n,s,r,a),!0}for(u=1,h=new Array(c-1);u<c;u++)h[u-1]=arguments[u];l.fn.apply(l.context,h)}else{var d=l.length,f;for(u=0;u<d;u++)switch(l[u].once&&this.removeListener(e,l[u].fn,void 0,!0),c){case 1:l[u].fn.call(l[u].context);break;case 2:l[u].fn.call(l[u].context,t);break;case 3:l[u].fn.call(l[u].context,t,n);break;case 4:l[u].fn.call(l[u].context,t,n,s);break;default:if(!h)for(f=1,h=new Array(c-1);f<c;f++)h[f-1]=arguments[f];l[u].fn.apply(l[u].context,h)}}return!0};cn.prototype.on=function(e,t,n){return m0(this,e,t,n,!1)};cn.prototype.once=function(e,t,n){return m0(this,e,t,n,!0)};cn.prototype.removeListener=function(e,t,n,s){var r=mn?mn+e:e;if(!this._events[r])return this;if(!t)return nh(this,r),this;var a=this._events[r];if(a.fn)a.fn===t&&(!s||a.once)&&(!n||a.context===n)&&nh(this,r);else{for(var o=0,l=[],c=a.length;o<c;o++)(a[o].fn!==t||s&&!a[o].once||n&&a[o].context!==n)&&l.push(a[o]);l.length?this._events[r]=l.length===1?l[0]:l:nh(this,r)}return this};cn.prototype.removeAllListeners=function(e){var t;return e?(t=mn?mn+e:e,this._events[t]&&nh(this,t)):(this._events=new so,this._eventsCount=0),this};cn.prototype.off=cn.prototype.removeListener;cn.prototype.addListener=cn.prototype.on;cn.prefixed=mn;cn.EventEmitter=cn;tf=cn;var Ts={};Ss(Ts,"ConnectionType",()=>Wi);Ss(Ts,"PeerErrorType",()=>Xt);Ss(Ts,"BaseConnectionErrorType",()=>Xd);Ss(Ts,"DataConnectionErrorType",()=>nf);Ss(Ts,"SerializationType",()=>ch);Ss(Ts,"SocketEventType",()=>Gi);Ss(Ts,"ServerMessageType",()=>ln);var Wi=(function(i){return i.Data="data",i.Media="media",i})({}),Xt=(function(i){return i.BrowserIncompatible="browser-incompatible",i.Disconnected="disconnected",i.InvalidID="invalid-id",i.InvalidKey="invalid-key",i.Network="network",i.PeerUnavailable="peer-unavailable",i.SslUnavailable="ssl-unavailable",i.ServerError="server-error",i.SocketError="socket-error",i.SocketClosed="socket-closed",i.UnavailableID="unavailable-id",i.WebRTC="webrtc",i})({}),Xd=(function(i){return i.NegotiationFailed="negotiation-failed",i.ConnectionClosed="connection-closed",i})({}),nf=(function(i){return i.NotOpenYet="not-open-yet",i.MessageToBig="message-too-big",i})({}),ch=(function(i){return i.Binary="binary",i.BinaryUTF8="binary-utf8",i.JSON="json",i.None="raw",i})({}),Gi=(function(i){return i.Message="message",i.Disconnected="disconnected",i.Error="error",i.Close="close",i})({}),ln=(function(i){return i.Heartbeat="HEARTBEAT",i.Candidate="CANDIDATE",i.Offer="OFFER",i.Answer="ANSWER",i.Open="OPEN",i.Error="ERROR",i.IdTaken="ID-TAKEN",i.InvalidKey="INVALID-KEY",i.Leave="LEAVE",i.Expire="EXPIRE",i})({}),g0="1.5.5",qd=class extends tf.EventEmitter{constructor(e,t,n,s,r,a=5e3){super(),this.pingInterval=a,this._disconnected=!0,this._messagesQueue=[];let o=e?"wss://":"ws://";this._baseUrl=o+t+":"+n+s+"peerjs?key="+r}start(e,t){this._id=e;let n=`${this._baseUrl}&id=${e}&token=${t}`;this._socket||!this._disconnected||(this._socket=new WebSocket(n+"&version="+g0),this._disconnected=!1,this._socket.onmessage=s=>{let r;try{r=JSON.parse(s.data),Ie.log("Server message received:",r)}catch{Ie.log("Invalid server message",s.data);return}this.emit(Gi.Message,r)},this._socket.onclose=s=>{this._disconnected||(Ie.log("Socket closed.",s),this._cleanup(),this._disconnected=!0,this.emit(Gi.Disconnected))},this._socket.onopen=()=>{this._disconnected||(this._sendQueuedMessages(),Ie.log("Socket open"),this._scheduleHeartbeat())})}_scheduleHeartbeat(){this._wsPingTimer=setTimeout(()=>{this._sendHeartbeat()},this.pingInterval)}_sendHeartbeat(){if(!this._wsOpen()){Ie.log("Cannot send heartbeat, because socket closed");return}let e=JSON.stringify({type:ln.Heartbeat});this._socket.send(e),this._scheduleHeartbeat()}_wsOpen(){return!!this._socket&&this._socket.readyState===1}_sendQueuedMessages(){let e=[...this._messagesQueue];this._messagesQueue=[];for(let t of e)this.send(t)}send(e){if(this._disconnected)return;if(!this._id){this._messagesQueue.push(e);return}if(!e.type){this.emit(Gi.Error,"Invalid message");return}if(!this._wsOpen())return;let t=JSON.stringify(e);this._socket.send(t)}close(){this._disconnected||(this._cleanup(),this._disconnected=!0)}_cleanup(){this._socket&&(this._socket.onopen=this._socket.onmessage=this._socket.onclose=null,this._socket.close(),this._socket=void 0),clearTimeout(this._wsPingTimer)}},sh=class{constructor(e){this.connection=e}startConnection(e){let t=this._startPeerConnection();if(this.connection.peerConnection=t,this.connection.type===Wi.Media&&e._stream&&this._addTracksToConnection(e._stream,t),e.originator){let n=this.connection,s={ordered:!!e.reliable},r=t.createDataChannel(n.label,s);n._initializeDataChannel(r),this._makeOffer()}else this.handleSDP("OFFER",e.sdp)}_startPeerConnection(){Ie.log("Creating RTCPeerConnection.");let e=new RTCPeerConnection(this.connection.provider.options.config);return this._setupListeners(e),e}_setupListeners(e){let t=this.connection.peer,n=this.connection.connectionId,s=this.connection.type,r=this.connection.provider;Ie.log("Listening for ICE candidates."),e.onicecandidate=a=>{!a.candidate||!a.candidate.candidate||(Ie.log(`Received ICE candidates for ${t}:`,a.candidate),r.socket.send({type:ln.Candidate,payload:{candidate:a.candidate,type:s,connectionId:n},dst:t}))},e.oniceconnectionstatechange=()=>{switch(e.iceConnectionState){case"failed":Ie.log("iceConnectionState is failed, closing connections to "+t),this.connection.emitError(Xd.NegotiationFailed,"Negotiation of connection to "+t+" failed."),this.connection.close();break;case"closed":Ie.log("iceConnectionState is closed, closing connections to "+t),this.connection.emitError(Xd.ConnectionClosed,"Connection to "+t+" closed."),this.connection.close();break;case"disconnected":Ie.log("iceConnectionState changed to disconnected on the connection with "+t);break;case"completed":e.onicecandidate=()=>{};break}this.connection.emit("iceStateChanged",e.iceConnectionState)},Ie.log("Listening for data channel"),e.ondatachannel=a=>{Ie.log("Received data channel");let o=a.channel;r.getConnection(t,n)._initializeDataChannel(o)},Ie.log("Listening for remote stream"),e.ontrack=a=>{Ie.log("Received remote stream");let o=a.streams[0],l=r.getConnection(t,n);if(l.type===Wi.Media){let c=l;this._addStreamToMediaConnection(o,c)}}}cleanup(){Ie.log("Cleaning up PeerConnection to "+this.connection.peer);let e=this.connection.peerConnection;if(!e)return;this.connection.peerConnection=null,e.onicecandidate=e.oniceconnectionstatechange=e.ondatachannel=e.ontrack=()=>{};let t=e.signalingState!=="closed",n=!1,s=this.connection.dataChannel;s&&(n=!!s.readyState&&s.readyState!=="closed"),(t||n)&&e.close()}async _makeOffer(){let e=this.connection.peerConnection,t=this.connection.provider;try{let n=await e.createOffer(this.connection.options.constraints);Ie.log("Created offer."),this.connection.options.sdpTransform&&typeof this.connection.options.sdpTransform=="function"&&(n.sdp=this.connection.options.sdpTransform(n.sdp)||n.sdp);try{await e.setLocalDescription(n),Ie.log("Set localDescription:",n,`for:${this.connection.peer}`);let s={sdp:n,type:this.connection.type,connectionId:this.connection.connectionId,metadata:this.connection.metadata};if(this.connection.type===Wi.Data){let r=this.connection;s={...s,label:r.label,reliable:r.reliable,serialization:r.serialization}}t.socket.send({type:ln.Offer,payload:s,dst:this.connection.peer})}catch(s){s!="OperationError: Failed to set local offer sdp: Called in wrong state: kHaveRemoteOffer"&&(t.emitError(Xt.WebRTC,s),Ie.log("Failed to setLocalDescription, ",s))}}catch(n){t.emitError(Xt.WebRTC,n),Ie.log("Failed to createOffer, ",n)}}async _makeAnswer(){let e=this.connection.peerConnection,t=this.connection.provider;try{let n=await e.createAnswer();Ie.log("Created answer."),this.connection.options.sdpTransform&&typeof this.connection.options.sdpTransform=="function"&&(n.sdp=this.connection.options.sdpTransform(n.sdp)||n.sdp);try{await e.setLocalDescription(n),Ie.log("Set localDescription:",n,`for:${this.connection.peer}`),t.socket.send({type:ln.Answer,payload:{sdp:n,type:this.connection.type,connectionId:this.connection.connectionId},dst:this.connection.peer})}catch(s){t.emitError(Xt.WebRTC,s),Ie.log("Failed to setLocalDescription, ",s)}}catch(n){t.emitError(Xt.WebRTC,n),Ie.log("Failed to create answer, ",n)}}async handleSDP(e,t){t=new RTCSessionDescription(t);let n=this.connection.peerConnection,s=this.connection.provider;Ie.log("Setting remote description",t);let r=this;try{await n.setRemoteDescription(t),Ie.log(`Set remoteDescription:${e} for:${this.connection.peer}`),e==="OFFER"&&await r._makeAnswer()}catch(a){s.emitError(Xt.WebRTC,a),Ie.log("Failed to setRemoteDescription, ",a)}}async handleCandidate(e){Ie.log("handleCandidate:",e);try{await this.connection.peerConnection.addIceCandidate(e),Ie.log(`Added ICE candidate for:${this.connection.peer}`)}catch(t){this.connection.provider.emitError(Xt.WebRTC,t),Ie.log("Failed to handleCandidate, ",t)}}_addTracksToConnection(e,t){if(Ie.log(`add tracks from stream ${e.id} to peer connection`),!t.addTrack)return Ie.error("Your browser does't support RTCPeerConnection#addTrack. Ignored.");e.getTracks().forEach(n=>{t.addTrack(n,e)})}_addStreamToMediaConnection(e,t){Ie.log(`add stream ${e.id} to media connection ${t.connectionId}`),t.addStream(e)}},rh=class extends tf.EventEmitter{emitError(e,t){Ie.error("Error:",t),this.emit("error",new Yd(`${e}`,t))}},Yd=class extends Error{constructor(e,t){typeof t=="string"?super(t):(super(),Object.assign(this,t)),this.type=e}},ah=class extends rh{get open(){return this._open}constructor(e,t,n){super(),this.peer=e,this.provider=t,this.options=n,this._open=!1,this.metadata=n.metadata}},Jd,no=class no extends ah{get type(){return Wi.Media}get localStream(){return this._localStream}get remoteStream(){return this._remoteStream}constructor(e,t,n){super(e,t,n),this._localStream=this.options._stream,this.connectionId=this.options.connectionId||no.ID_PREFIX+_n.randomToken(),this._negotiator=new sh(this),this._localStream&&this._negotiator.startConnection({_stream:this._localStream,originator:!0})}_initializeDataChannel(e){this.dataChannel=e,this.dataChannel.onopen=()=>{Ie.log(`DC#${this.connectionId} dc connection success`),this.emit("willCloseOnRemote")},this.dataChannel.onclose=()=>{Ie.log(`DC#${this.connectionId} dc closed for:`,this.peer),this.close()}}addStream(e){Ie.log("Receiving stream",e),this._remoteStream=e,super.emit("stream",e)}handleMessage(e){let t=e.type,n=e.payload;switch(e.type){case ln.Answer:this._negotiator.handleSDP(t,n.sdp),this._open=!0;break;case ln.Candidate:this._negotiator.handleCandidate(n.candidate);break;default:Ie.warn(`Unrecognized message type:${t} from peer:${this.peer}`);break}}answer(e,t={}){if(this._localStream){Ie.warn("Local stream already exists on this MediaConnection. Are you answering a call twice?");return}this._localStream=e,t&&t.sdpTransform&&(this.options.sdpTransform=t.sdpTransform),this._negotiator.startConnection({...this.options._payload,_stream:e});let n=this.provider._getMessages(this.connectionId);for(let s of n)this.handleMessage(s);this._open=!0}close(){this._negotiator&&(this._negotiator.cleanup(),this._negotiator=null),this._localStream=null,this._remoteStream=null,this.provider&&(this.provider._removeConnection(this),this.provider=null),this.options&&this.options._stream&&(this.options._stream=null),this.open&&(this._open=!1,super.emit("close"))}};Jd=new WeakMap,Rr(no,Jd,no.ID_PREFIX="mc_");var oh=no,$d=class{constructor(e){this._options=e}_buildRequest(e){let t=this._options.secure?"https":"http",{host:n,port:s,path:r,key:a}=this._options,o=new URL(`${t}://${n}:${s}${r}${a}/${e}`);return o.searchParams.set("ts",`${Date.now()}${Math.random()}`),o.searchParams.set("version",g0),fetch(o.href,{referrerPolicy:this._options.referrerPolicy})}async retrieveId(){try{let e=await this._buildRequest("id");if(e.status!==200)throw new Error(`Error. Status:${e.status}`);return e.text()}catch(e){Ie.error("Error retrieving ID",e);let t="";throw this._options.path==="/"&&this._options.host!==_n.CLOUD_HOST&&(t=" If you passed in a `path` to your self-hosted PeerServer, you'll also need to pass in that same path when creating a new Peer."),new Error("Could not get an ID from the server."+t)}}async listAllPeers(){try{let e=await this._buildRequest("peers");if(e.status!==200){if(e.status===401){let t="";throw this._options.host===_n.CLOUD_HOST?t="It looks like you're using the cloud server. You can email team@peerjs.com to enable peer listing for your API key.":t="You need to enable `allow_discovery` on your self-hosted PeerServer to use this feature.",new Error("It doesn't look like you have permission to list peers IDs. "+t)}throw new Error(`Error. Status:${e.status}`)}return e.json()}catch(e){throw Ie.error("Error retrieving list peers",e),new Error("Could not get list peers from the server."+e)}}},Kd,Qd,Ms=class Ms extends ah{get type(){return Wi.Data}constructor(e,t,n){super(e,t,n),this.connectionId=this.options.connectionId||Ms.ID_PREFIX+p0(),this.label=this.options.label||this.connectionId,this.reliable=!!this.options.reliable,this._negotiator=new sh(this),this._negotiator.startConnection(this.options._payload||{originator:!0,reliable:this.reliable})}_initializeDataChannel(e){this.dataChannel=e,this.dataChannel.onopen=()=>{Ie.log(`DC#${this.connectionId} dc connection success`),this._open=!0,this.emit("open")},this.dataChannel.onmessage=t=>{Ie.log(`DC#${this.connectionId} dc onmessage:`,t.data)},this.dataChannel.onclose=()=>{Ie.log(`DC#${this.connectionId} dc closed for:`,this.peer),this.close()}}close(e){if(e?.flush){this.send({__peerData:{type:"close"}});return}this._negotiator&&(this._negotiator.cleanup(),this._negotiator=null),this.provider&&(this.provider._removeConnection(this),this.provider=null),this.dataChannel&&(this.dataChannel.onopen=null,this.dataChannel.onmessage=null,this.dataChannel.onclose=null,this.dataChannel=null),this.open&&(this._open=!1,super.emit("close"))}send(e,t=!1){if(!this.open){this.emitError(nf.NotOpenYet,"Connection is not open. You should listen for the `open` event before sending messages.");return}return this._send(e,t)}async handleMessage(e){let t=e.payload;switch(e.type){case ln.Answer:await this._negotiator.handleSDP(e.type,t.sdp);break;case ln.Candidate:await this._negotiator.handleCandidate(t.candidate);break;default:Ie.warn("Unrecognized message type:",e.type,"from peer:",this.peer);break}}};Kd=new WeakMap,Qd=new WeakMap,Rr(Ms,Kd,Ms.ID_PREFIX="dc_"),Rr(Ms,Qd,Ms.MAX_BUFFERED_AMOUNT=8388608);var lh=Ms,ro=class extends lh{get bufferSize(){return this._bufferSize}_initializeDataChannel(e){super._initializeDataChannel(e),this.dataChannel.binaryType="arraybuffer",this.dataChannel.addEventListener("message",t=>this._handleDataMessage(t))}_bufferedSend(e){(this._buffering||!this._trySend(e))&&(this._buffer.push(e),this._bufferSize=this._buffer.length)}_trySend(e){if(!this.open)return!1;if(this.dataChannel.bufferedAmount>lh.MAX_BUFFERED_AMOUNT)return this._buffering=!0,setTimeout(()=>{this._buffering=!1,this._tryBuffer()},50),!1;try{this.dataChannel.send(e)}catch(t){return Ie.error(`DC#:${this.connectionId} Error when sending:`,t),this._buffering=!0,this.close(),!1}return!0}_tryBuffer(){if(!this.open||this._buffer.length===0)return;let e=this._buffer[0];this._trySend(e)&&(this._buffer.shift(),this._bufferSize=this._buffer.length,this._tryBuffer())}close(e){if(e?.flush){this.send({__peerData:{type:"close"}});return}this._buffer=[],this._bufferSize=0,super.close()}constructor(...e){super(...e),this._buffer=[],this._bufferSize=0,this._buffering=!1}},to=class extends ro{close(e){super.close(e),this._chunkedData={}}constructor(e,t,n){super(e,t,n),this.chunker=new ih,this.serialization=ch.Binary,this._chunkedData={}}_handleDataMessage({data:e}){let t=cd(e),n=t.__peerData;if(n){if(n.type==="close"){this.close();return}this._handleChunk(t);return}this.emit("data",t)}_handleChunk(e){let t=e.__peerData,n=this._chunkedData[t]||{data:[],count:0,total:e.total};if(n.data[e.n]=new Uint8Array(e.data),n.count++,this._chunkedData[t]=n,n.total===n.count){delete this._chunkedData[t];let s=VM(n.data);this._handleDataMessage({data:s})}}_send(e,t){let n=hd(e);if(n instanceof Promise)return this._send_blob(n);if(!t&&n.byteLength>this.chunker.chunkedMTU){this._sendChunks(n);return}this._bufferedSend(n)}async _send_blob(e){let t=await e;if(t.byteLength>this.chunker.chunkedMTU){this._sendChunks(t);return}this._bufferedSend(t)}_sendChunks(e){let t=this.chunker.chunk(e);Ie.log(`DC#${this.connectionId} Try to send ${t.length} chunks...`);for(let n of t)this.send(n,!0)}},Zd=class extends ro{_handleDataMessage({data:e}){super.emit("data",e)}_send(e,t){this._bufferedSend(e)}constructor(...e){super(...e),this.serialization=ch.None}},jd=class extends ro{_handleDataMessage({data:e}){let t=this.parse(this.decoder.decode(e)),n=t.__peerData;if(n&&n.type==="close"){this.close();return}this.emit("data",t)}_send(e,t){let n=this.encoder.encode(this.stringify(e));if(n.byteLength>=_n.chunkedMTU){this.emitError(nf.MessageToBig,"Message too big for JSON channel");return}this._bufferedSend(n)}constructor(...e){super(...e),this.serialization=ch.JSON,this.encoder=new TextEncoder,this.decoder=new TextDecoder,this.stringify=JSON.stringify,this.parse=JSON.parse}};var ef,io=class io extends rh{get id(){return this._id}get options(){return this._options}get open(){return this._open}get socket(){return this._socket}get connections(){let e=Object.create(null);for(let[t,n]of this._connections)e[t]=n;return e}get destroyed(){return this._destroyed}get disconnected(){return this._disconnected}constructor(e,t){super(),this._serializers={raw:Zd,json:jd,binary:to,"binary-utf8":to,default:to},this._id=null,this._lastServerId=null,this._destroyed=!1,this._disconnected=!1,this._open=!1,this._connections=new Map,this._lostMessages=new Map;let n;if(e&&e.constructor==Object?t=e:e&&(n=e.toString()),t={debug:0,host:_n.CLOUD_HOST,port:_n.CLOUD_PORT,path:"/",key:io.DEFAULT_KEY,token:_n.randomToken(),config:_n.defaultConfig,referrerPolicy:"strict-origin-when-cross-origin",serializers:{},...t},this._options=t,this._serializers={...this._serializers,...this.options.serializers},this._options.host==="/"&&(this._options.host=window.location.hostname),this._options.path&&(this._options.path[0]!=="/"&&(this._options.path="/"+this._options.path),this._options.path[this._options.path.length-1]!=="/"&&(this._options.path+="/")),this._options.secure===void 0&&this._options.host!==_n.CLOUD_HOST?this._options.secure=_n.isSecure():this._options.host==_n.CLOUD_HOST&&(this._options.secure=!0),this._options.logFunction&&Ie.setLogFunction(this._options.logFunction),Ie.logLevel=this._options.debug||0,this._api=new $d(t),this._socket=this._createServerConnection(),!_n.supports.audioVideo&&!_n.supports.data){this._delayedAbort(Xt.BrowserIncompatible,"The current browser does not support WebRTC");return}if(n&&!_n.validateId(n)){this._delayedAbort(Xt.InvalidID,`ID "${n}" is invalid`);return}n?this._initialize(n):this._api.retrieveId().then(s=>this._initialize(s)).catch(s=>this._abort(Xt.ServerError,s))}_createServerConnection(){let e=new qd(this._options.secure,this._options.host,this._options.port,this._options.path,this._options.key,this._options.pingInterval);return e.on(Gi.Message,t=>{this._handleMessage(t)}),e.on(Gi.Error,t=>{this._abort(Xt.SocketError,t)}),e.on(Gi.Disconnected,()=>{this.disconnected||(this.emitError(Xt.Network,"Lost connection to server."),this.disconnect())}),e.on(Gi.Close,()=>{this.disconnected||this._abort(Xt.SocketClosed,"Underlying socket is already closed.")}),e}_initialize(e){this._id=e,this.socket.start(e,this._options.token)}_handleMessage(e){let t=e.type,n=e.payload,s=e.src;switch(t){case ln.Open:this._lastServerId=this.id,this._open=!0,this.emit("open",this.id);break;case ln.Error:this._abort(Xt.ServerError,n.msg);break;case ln.IdTaken:this._abort(Xt.UnavailableID,`ID "${this.id}" is taken`);break;case ln.InvalidKey:this._abort(Xt.InvalidKey,`API KEY "${this._options.key}" is invalid`);break;case ln.Leave:Ie.log(`Received leave message from ${s}`),this._cleanupPeer(s),this._connections.delete(s);break;case ln.Expire:this.emitError(Xt.PeerUnavailable,`Could not connect to peer ${s}`);break;case ln.Offer:{let r=n.connectionId,a=this.getConnection(s,r);if(a&&(a.close(),Ie.warn(`Offer received for existing Connection ID:${r}`)),n.type===Wi.Media){let l=new oh(s,this,{connectionId:r,_payload:n,metadata:n.metadata});a=l,this._addConnection(s,a),this.emit("call",l)}else if(n.type===Wi.Data){let l=new this._serializers[n.serialization](s,this,{connectionId:r,_payload:n,metadata:n.metadata,label:n.label,serialization:n.serialization,reliable:n.reliable});a=l,this._addConnection(s,a),this.emit("connection",l)}else{Ie.warn(`Received malformed connection type:${n.type}`);return}let o=this._getMessages(r);for(let l of o)a.handleMessage(l);break}default:{if(!n){Ie.warn(`You received a malformed message from ${s} of type ${t}`);return}let r=n.connectionId,a=this.getConnection(s,r);a&&a.peerConnection?a.handleMessage(e):r?this._storeMessage(r,e):Ie.warn("You received an unrecognized message:",e);break}}}_storeMessage(e,t){this._lostMessages.has(e)||this._lostMessages.set(e,[]),this._lostMessages.get(e).push(t)}_getMessages(e){let t=this._lostMessages.get(e);return t?(this._lostMessages.delete(e),t):[]}connect(e,t={}){if(t={serialization:"default",...t},this.disconnected){Ie.warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect, or call reconnect on this peer if you believe its ID to still be available."),this.emitError(Xt.Disconnected,"Cannot connect to new Peer after disconnecting from server.");return}let n=new this._serializers[t.serialization](e,this,t);return this._addConnection(e,n),n}call(e,t,n={}){if(this.disconnected){Ie.warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect."),this.emitError(Xt.Disconnected,"Cannot connect to new Peer after disconnecting from server.");return}if(!t){Ie.error("To call a peer, you must provide a stream from your browser's `getUserMedia`.");return}let s=new oh(e,this,{...n,_stream:t});return this._addConnection(e,s),s}_addConnection(e,t){Ie.log(`add connection ${t.type}:${t.connectionId} to peerId:${e}`),this._connections.has(e)||this._connections.set(e,[]),this._connections.get(e).push(t)}_removeConnection(e){let t=this._connections.get(e.peer);if(t){let n=t.indexOf(e);n!==-1&&t.splice(n,1)}this._lostMessages.delete(e.connectionId)}getConnection(e,t){let n=this._connections.get(e);if(!n)return null;for(let s of n)if(s.connectionId===t)return s;return null}_delayedAbort(e,t){setTimeout(()=>{this._abort(e,t)},0)}_abort(e,t){Ie.error("Aborting!"),this.emitError(e,t),this._lastServerId?this.disconnect():this.destroy()}destroy(){this.destroyed||(Ie.log(`Destroy peer with ID:${this.id}`),this.disconnect(),this._cleanup(),this._destroyed=!0,this.emit("close"))}_cleanup(){for(let e of this._connections.keys())this._cleanupPeer(e),this._connections.delete(e);this.socket.removeAllListeners()}_cleanupPeer(e){let t=this._connections.get(e);if(t)for(let n of t)n.close()}disconnect(){if(this.disconnected)return;let e=this.id;Ie.log(`Disconnect peer with ID:${e}`),this._disconnected=!0,this._open=!1,this.socket.close(),this._lastServerId=e,this._id=null,this.emit("disconnected",e)}reconnect(){if(this.disconnected&&!this.destroyed)Ie.log(`Attempting reconnection to server with ID ${this._lastServerId}`),this._disconnected=!1,this._initialize(this._lastServerId);else{if(this.destroyed)throw new Error("This peer cannot reconnect to the server. It has already been destroyed.");if(!this.disconnected&&!this.open)Ie.error("In a hurry? We're still trying to make the initial connection!");else throw new Error(`Peer ${this.id} cannot reconnect because it is not disconnected from the server!`)}}listAllPeers(e=t=>{}){this._api.listAllPeers().then(t=>e(t)).catch(t=>this._abort(Xt.ServerError,t))}};ef=new WeakMap,Rr(io,ef,io.DEFAULT_KEY="peerjs");var ao=io;var lf=4,cf=1,hf=2,uf=3,df=Object.keys(Re),_0=["over","burst","spin","time"],ft=2e3,hh=400,Xi=3e4,y0=1,v0=2,b0=4,M0=8,S0=16,T0=32,E0=64,w0=128,A0=1,C0=2,R0=4,P0=8,I0=16,sf=Math.PI*2,af=255,oo=i=>Re[df[i]],Ar=i=>df.indexOf(i.id),rf=(i,e,t)=>(i=Math.round(i),i<e?e:i>t?t:i),of=class{constructor(e=4096){this.view=new DataView(new ArrayBuffer(e)),this.o=0}u8(e){this.view.setUint8(this.o,rf(e,0,255)),this.o+=1}u16(e){this.view.setUint16(this.o,rf(e,0,65535)),this.o+=2}i16(e){this.view.setInt16(this.o,rf(e,-32768,32767)),this.o+=2}f32(e){this.view.setFloat32(this.o,e),this.o+=4}done(){return this.view.buffer.slice(0,this.o)}},uh=class{constructor(e){this.view=new DataView(e),this.o=0}u8(){let e=this.view.getUint8(this.o);return this.o+=1,e}u16(){let e=this.view.getUint16(this.o);return this.o+=2,e}i16(){let e=this.view.getInt16(this.o);return this.o+=2,e}f32(){let e=this.view.getFloat32(this.o);return this.o+=4,e}};function YM(i,e){i.i16(e.x*ft),i.i16(e.z*ft),i.i16(e.vx*hh),i.i16(e.vz*hh),i.u16(e.spin*50),i.u8(e.ult>=100?af:Math.min(af-1,Math.floor(e.ult*2.5))),i.u8(e.tumble*100),i.u8(e.launch*100),i.u8(e.guard*100),i.u8(e.slow*100),i.u8(e.hitCd*1e3),i.u8(e.empower*50),i.f32(e.phase);for(let t of Ct)i.u16(e.cd[t]*1e3);i.u16(e.projN),i.u16(e.zoneN),i.u8(e.up*100),i.u8(e.ground*100),i.u8(e.mark*50),i.u8(e.scar*80),i.u8(e.poison*100),i.u8(e.bleed|e.last<<4),i.u8(e.bleedT*25),i.u8(e.shield),i.u8(e.shieldT*80),i.u8(e.buff*20),i.u8(e.stack),i.u8(e.stackT*30),i.u8(e.dmark*60),i.u16(e.dacc*50),i.u8(e.egg*60),i.u8(e.eggHp);for(let t of Ct)i.u8(Math.ceil(e.re[t]*20));i.u8((e.toggle?A0:0)|(e.eggUsed?C0:0)|(e.chan?R0:0)|(e.ret?P0:0)|(e.dash&&e.dash.hit?I0:0)),i.u8((e.cmd?y0:0)|(e.dash?v0:0)|(e.blink?b0:0)|(e.air?M0:0)|(e.out?S0:0)|(e.charge?T0:0)|(e.orbs?E0:0)|(e.tether?w0:0)),e.cmd&&(i.i16(e.cmd.x*ft),i.i16(e.cmd.z*ft),i.u8(e.cmd.t*100));for(let t of[e.dash,e.blink])t&&(i.u8(Ar(t.skill)),i.i16(t.dx*Xi),i.i16(t.dz*Xi),i.u8(t.t*250));if(e.air){let t=e.air;i.u8(Ar(t.skill)|t.by<<7),i.u8(t.t*200),i.i16(t.sx*ft),i.i16(t.sz*ft),i.i16(t.tx*ft),i.i16(t.tz*ft)}if(e.out&&(i.u8(e.out.t*50),i.i16(e.out.y*100),i.i16(e.out.vy*100)),e.charge&&(i.u8(Ar(e.charge.skill)),i.u8(e.charge.t*200)),e.orbs){let t=e.orbs;i.u8(t.alive),i.u8(t.t*40),i.u16((t.ang%sf+sf)%sf*1e4),i.u8(t.cd*200)}if(e.tether){let t=e.tether;i.u8(Ar(t.skill)),i.u8(t.t*80),i.u16(t.acc*100),i.u8(t.tick*200)}if(e.chan){let t=e.chan;i.u8(t.t*60),i.u8(t.n),i.i16(t.dx*Xi),i.i16(t.dz*Xi)}e.ret&&(i.i16(e.ret.x*ft),i.i16(e.ret.z*ft))}function ff(i){let e=i.i16()/Xi,t=i.i16()/Xi,n=Math.hypot(e,t)||1;return{dx:e/n,dz:t/n}}function x0(i){let e=oo(i.u8());return{skill:e,...ff(i),speed:e.speed,t:i.u8()/250,hit:!1}}function $M(i,e){e.x=i.i16()/ft,e.z=i.i16()/ft,e.vx=i.i16()/hh,e.vz=i.i16()/hh,e.spin=i.u16()/50;let t=i.u8();e.ult=t===af?100:t/2.5,e.tumble=i.u8()/100,e.launch=i.u8()/100,e.guard=i.u8()/100,e.slow=i.u8()/100,e.hitCd=i.u8()/1e3,e.empower=i.u8()/50,e.phase=i.f32();for(let a of Ct)e.cd[a]=i.u16()/1e3;e.projN=i.u16(),e.zoneN=i.u16(),e.up=i.u8()/100,e.ground=i.u8()/100,e.mark=i.u8()/50,e.scar=i.u8()/80,e.poison=i.u8()/100;let n=i.u8();e.bleed=n&15,e.last=n>>4,e.bleedT=i.u8()/25,e.shield=i.u8(),e.shieldT=i.u8()/80,e.buff=i.u8()/20,e.stack=i.u8(),e.stackT=i.u8()/30,e.dmark=i.u8()/60,e.dacc=i.u16()/50,e.egg=i.u8()/60,e.eggHp=i.u8();for(let a of Ct)e.re[a]=i.u8()/20;let s=i.u8();e.toggle=!!(s&A0),e.eggUsed=!!(s&C0);let r=i.u8();if(e.cast=null,e.cmd=r&y0?{x:i.i16()/ft,z:i.i16()/ft,t:i.u8()/100}:null,e.dash=r&v0?x0(i):null,e.dash&&(e.dash.hit=!!(s&I0)),e.blink=r&b0?x0(i):null,r&M0){let a=i.u8(),o=oo(a&127);e.air={skill:o,by:a>>7,t:i.u8()/200,T:o.air,sx:i.i16()/ft,sz:i.i16()/ft,tx:i.i16()/ft,tz:i.i16()/ft}}else e.air=null;if(e.out=r&S0?{t:i.u8()/50,y:i.i16()/100,vy:i.i16()/100}:null,r&T0){let a=oo(i.u8());e.charge={t:i.u8()/200,T:a.charge,skill:a}}else e.charge=null;if(r&E0){let a=i.u8(),o=0;for(let l=0;l<8;l++)a&1<<l&&o++;e.orbs={alive:a,n:o,t:i.u8()/40,ang:i.u16()/1e4,cd:i.u8()/200,skill:Re.satellite}}else e.orbs=null;if(r&w0){let a=oo(i.u8());e.tether={t:i.u8()/80,T:a.dur,skill:a,acc:i.u16()/100,tick:i.u8()/200}}else e.tether=null;e.chan=s&R0?{t:i.u8()/60,n:i.u8(),...ff(i),skill:Re.curtaincall}:null,e.ret=s&P0?{x:i.i16()/ft,z:i.i16()/ft}:null}function L0(i,e){let t=new of;t.u8(cf),t.u16(e.seq&65535),t.u16(e.ack&65535),t.u16(Math.max(0,e.timeLeft)*100);let n=i.result;t.u8(n?1+n.winner.side+2*_0.indexOf(n.kind):0);for(let s of i.tops)YM(t,s);t.u8(i.projectiles.length);for(let s of i.projectiles)t.u16(s.id),t.u8(s.owner.side|Ar(s.skill)<<1),t.u8(s.hit?1:0),t.i16(s.x*ft),t.i16(s.z*ft),t.i16(s.dx*Xi),t.i16(s.dz*Xi),t.u16(s.left*1e3),t.u16(s.dmg*100);t.u8(i.zones.length);for(let s of i.zones)t.u16(s.id),t.u8(s.owner.side|Ar(s.skill)<<1),t.i16(s.x*ft),t.i16(s.z*ft),t.i16(s.dx*ft),t.i16(s.dz*ft),t.u16(s.t*1e3),t.u16(s.a*100),t.u8(s.b*50),t.u8(s.c);return t.done()}function k0(i){let e=new uh(i);return e.u8(),{seq:e.u16(),ack:e.u16(),timeLeft:e.u16()/100}}function D0(i,e){let t=new uh(e);t.u8();let n={seq:t.u16(),ack:t.u16(),timeLeft:t.u16()/100},s=t.u8();if(s){let c=i.tops[s-1&1];i.result={winner:c,loser:i.other(c),kind:_0[s-1>>1]}}else i.result=null;for(let c of i.tops)$M(t,c);let r=new Map(i.projectiles.map(c=>[c.id,c])),a=t.u8();i.projectiles=[];for(let c=0;c<a;c++){let h=t.u16(),u=t.u8(),d=r.get(h)||{id:h,dead:!1};d.owner=i.tops[u&1],d.skill=oo(u>>1),d.hit=!!t.u8(),d.x=t.i16()/ft,d.z=t.i16()/ft,Object.assign(d,ff(t)),d.left=t.u16()/1e3,d.dmg=t.u16()/100,d.speed=d.skill.speed,d.r=d.skill.radius,d.dead=!1,i.projectiles.push(d)}let o=new Map(i.zones.map(c=>[c.id,c])),l=t.u8();i.zones=[];for(let c=0;c<l;c++){let h=t.u16(),u=t.u8(),d=o.get(h)||{id:h};d.kind=df[u>>1],d.owner=i.tops[u&1],d.dead=!1,d.x=t.i16()/ft,d.z=t.i16()/ft,d.dx=t.i16()/ft,d.dz=t.i16()/ft,d.t=t.u16()/1e3,d.a=t.u16()/100,d.b=t.u8()/50,d.c=t.u8(),i.zones.push(Ir(d))}return n}var Es=i=>Math.round(i*100)/100;function N0(i){let e={};for(let t in i){let n=i[t];n!=null&&(typeof n=="number"?e[t]=Es(n):typeof n!="object"?e[t]=n:"blade"in n?e[t]={$t:n.side}:"aim"in n?e[t]={$s:n.id}:"left"in n?e[t]={$p:[n.id,n.owner.side,n.skill.id,Es(n.x),Es(n.z),Math.round(n.dx*1e3)/1e3,Math.round(n.dz*1e3)/1e3]}:"kind"in n&&"owner"in n&&(e[t]={$z:[n.kind,n.owner.side,Es(n.x),Es(n.z),n.id,Es(n.dx),Es(n.dz),n.c]}))}return e}function U0(i,e){let t={};for(let n in i){let s=i[n];if(s==null||typeof s!="object"){t[n]=s;continue}if("$t"in s)t[n]=e.tops[s.$t&1];else if("$s"in s)t[n]=Re[s.$s];else if("$p"in s){let[r,a,o,l,c,h,u]=s.$p;t[n]=e.projectiles.find(d=>d.id===r)||{id:r,owner:e.tops[a&1],skill:Re[o],x:l,z:c,dx:h,dz:u,left:0}}else if("$z"in s){let[r,a,o,l,c,h,u,d]=s.$z;t[n]=e.zones.find(f=>f.id===c)||Ir({id:c,kind:r,owner:e.tops[a&1],x:o,z:l,dx:h,dz:u,t:0,a:0,b:0,c:d})}}return t}function pf(i,e){let t=new DataView(new ArrayBuffer(9));return t.setUint8(0,i),t.setFloat64(1,e),t.buffer}var dh=i=>new DataView(i).getUint8(0),mf=i=>new DataView(i).getFloat64(1);function z0(i){let e="",t=new Uint8Array(i);for(let n=0;n<t.length;n++)e+=String.fromCharCode(t[n]);return btoa(e)}function O0(i){let e=atob(i),t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n);return t.buffer}var F0="gyroclash-online-2-",B0="ABCDEFGHJKLMNPQRSTUVWXYZ23456789",ZM=77,H0=16*1024,V0=()=>Array.from({length:6},()=>B0[Math.random()*B0.length|0]).join(""),G0=i=>(i||"").toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,6),fh=class{constructor(e){this.h=e,this.peer=null,this.conn=null,this.ch=null,this.role=null,this.code="",this.connected=!1,this.rtt=.08,this.jitter=0,this.rttKnown=!1,this.lastHeard=0,this.pingT=0,this.joinTimer=0,this.sim=null,this.stats={out:0,in:0,bytesOut:0,bytesIn:0,lost:0,rateOut:0,rateIn:0,t:0,lastOut:0,lastIn:0}}host(){this.role="host",this.openRoom(V0())}openRoom(e){this.code=e;let t=this.peer=new ao(F0+e);t.on("open",()=>this.h.status("waiting",e)),t.on("connection",n=>{if(this.conn){n.on("open",()=>{n.send({t:"full"}),setTimeout(()=>n.close(),400)});return}this.attach(n)}),t.on("error",n=>{if(n.type==="unavailable-id"&&!this.conn){t.destroy(),this.openRoom(V0());return}n.type!=="peer-unavailable"&&(this.connected||this.fail(n.type))}),t.on("disconnected",()=>{t.destroyed||setTimeout(()=>{t.destroyed||t.reconnect()},1500)})}join(e){this.role="guest",this.code=e;let t=this.peer=new ao;t.on("open",()=>{this.h.status("connecting",e),this.attach(t.connect(F0+e,{reliable:!0,serialization:"json"})),this.joinTimer=setTimeout(()=>{this.connected||this.fail("timeout")},2e4)}),t.on("error",n=>{this.connected||this.fail(n.type)})}attach(e){this.conn=e,e.on("open",()=>{clearTimeout(this.joinTimer),this.connected=!0,this.lastHeard=performance.now(),this.openStateChannel(e),this.h.open()}),e.on("data",t=>{if(this.lastHeard=performance.now(),!(!t||typeof t!="object")){if(t.t==="b"&&typeof t.d=="string"){try{this.receive(O0(t.d))}catch{}return}this.h.message(t)}}),e.on("close",()=>this.drop("close")),e.on("error",()=>this.drop("error"))}openStateChannel(e){try{let t=e.peerConnection.createDataChannel("gc-state",{negotiated:!0,id:ZM,ordered:!1,maxRetransmits:0});t.binaryType="arraybuffer",t.onmessage=n=>{this.lastHeard=performance.now(),n.data instanceof ArrayBuffer&&this.receive(n.data)},this.ch=t}catch{this.ch=null}}get fast(){return!!(this.ch&&this.ch.readyState==="open")}get congested(){return this.fast&&this.ch.bufferedAmount>H0/4}receive(e){this.stats.in++,this.stats.bytesIn+=e.byteLength;let t=dh(e);if(t===hf){this.sendPacket(pf(uf,mf(e)));return}if(t===uf){let n=Math.max(0,(performance.now()-mf(e))/1e3);this.rttKnown?(this.jitter=this.jitter*.85+Math.abs(n-this.rtt)*.15,this.rtt=this.rtt*.85+n*.15):(this.rtt=n,this.rttKnown=!0);return}this.h.packet(e)}send(e){if(!this.conn||!this.conn.open)return;this.stats.out++;let t=this.conn;this.sim?this.later(!0,()=>{t.open&&t.send(e)}):t.send(e)}simulate(e,t,n){this.sim={lag:e/2,jitter:t,loss:n/100,last:0,queue:[]}}later(e,t){let n=this.sim,s=performance.now()+n.lag+Math.random()*n.jitter;e&&(s=Math.max(s,n.last+.01),n.last=s),n.queue.push({at:s,fn:t})}sendPacket(e){if(!this.connected)return!1;if(this.sim){if(Math.random()<this.sim.loss)return!0;let t=this.ch;this.later(!1,()=>{try{t&&t.readyState==="open"&&t.send(e)}catch{}})}else if(this.fast){if(this.ch.bufferedAmount>H0)return!1;try{this.ch.send(e)}catch{return!1}}else this.send({t:"b",d:z0(e)});return this.stats.out++,this.stats.bytesOut+=e.byteLength,!0}update(e){if(!this.connected)return;let t=performance.now();if(this.sim&&this.sim.queue.length){let s=this.sim.queue.filter(r=>r.at<=t);this.sim.queue=this.sim.queue.filter(r=>r.at>t);for(let r of s)r.fn()}this.pingT-=e,this.pingT<=0&&(this.pingT=this.rttKnown?.5:.15,this.sendPacket(pf(hf,t)));let n=this.stats;n.t+=e,n.t>=1&&(n.rateOut=(n.bytesOut-n.lastOut)/n.t,n.rateIn=(n.bytesIn-n.lastIn)/n.t,n.lastOut=n.bytesOut,n.lastIn=n.bytesIn,n.t=0),t-this.lastHeard>8e3&&this.drop("timeout")}drop(e){let t=this.conn,n=this.ch;if(!t)return;let s=this.connected;this.conn=null,this.ch=null,this.connected=!1,this.rttKnown=!1;try{t.close()}catch{}try{n&&n.close()}catch{}s?this.h.closed(e):this.role==="guest"&&this.fail(e)}fail(e){clearTimeout(this.joinTimer),this.h.status("failed",e)}leave(){clearTimeout(this.joinTimer);let e=this.conn;this.conn=null,this.connected=!1;try{e&&e.send({t:"bye"})}catch{}setTimeout(()=>{try{this.peer&&this.peer.destroy()}catch{}this.peer=null},150),this.ch=null,this.role=null}};var vf="v0.2.0 \xB7 2026-10-11 01:06",qi=1/120,jM=30,JM=15,KM=.25,hn=new URLSearchParams(location.search),bf=document.getElementById("stage"),kt=new Gc(bf),ue=new Xc,M={state:"title",mode:"cpu",side:0,paused:!1,world:null,brain:null,autoBrain:null,score:[0,0],round:0,timeLeft:bh,finishes:[],acc:0,hitstop:0,slow:{s:1,t:0},seq:null,seqT:0,aimKey:null,buffer:null,cursor:{sx:innerWidth/2,sy:innerHeight/2,x:0,z:0},mouseDown:!1,moveRepeat:0,ultWasReady:!1,blade:"azure",level:1,net:null,lobby:{role:null,status:"opening",url:"",error:"",me:{blade:"azure",ready:!1},peer:null},outbox:[],snapT:0,snapSeq:0,tail:0,inSeq:0,ack:0,pending:[],lastSnap:-1,corrections:0,errSum:0,errMax:0,inbox:null,frames:0},Yi=()=>M.mode!=="cpu",Dn=()=>M.world.tops[M.side],Mf=()=>M.world.tops[1-M.side],Ne=new Wc({start:(i,e)=>{ue.unlock(),ue.ui(),mh(i,e)},again:()=>{ue.ui(),Yi()?W0(!0):mh(M.blade,M.level)},lobby:()=>{ue.ui(),W0(!1)},quit:()=>{ue.ui(),Ef(),lo()},pause:()=>gh(),mute:()=>{ue.unlock(),ue.setMuted(!ue.muted),Ne.setMuted(ue.muted)},ui:()=>{ue.unlock(),ue.ui()},hover:()=>ue.hover(),host:()=>{ue.unlock(),ue.ui(),Sf()},ready:()=>{ue.unlock(),ue.ui(),tS(!M.lobby.me.ready)},pick:i=>{ue.unlock(),ue.ui(),M.lobby.me.ready||(M.lobby.me.blade=i,Ne.blade=i,Tf())},copy:()=>nS()});function Cr(i){for(let e of["title","lobby","result","pause"])Ne.show(e,e===i);Ne.show("hud",i==="hud"),document.body.classList.toggle("menu",i!=="hud")}function lo(){M.state="title",M.mode="cpu",M.side=0,M.paused=!1,M.world=null,M.aimKey=null,M.seq=null,kt.setMatch(null,0),kt.orbiting=!0,ue.stopMusic(),Cr("title"),Ne.setMenuMode(!1),Ne.setNet(""),Ne.labels.innerHTML="",Ne.vignette.style.opacity=0}function Y0(i,e,t,n){M.world=i,M.side=e,M.score=[0,0],M.round=0,M.finishes=[],M.paused=!1,kt.setMatch(i,e),kt.orbiting=!1,Cr("hud"),Ne.setMenuMode(Yi()),Ne.startMatch(i,e,t,n),ue.startMusic()}function mh(i,e){M.mode="cpu",M.blade=i,M.level=e;let t=Cs[e],n=Object.keys($t).filter(o=>o!==i),s=hn.get("foe")||n[Math.random()*n.length|0],r=new Lr($t[i],$t[s],(Date.now()&16777215)+1);Y0(r,0,"CPU",t.name);let a=Mf();for(let o of Ct)a.windup[o]=(An(a,o).tele||0)*t.windup;M.brain=new Ps(r,a,t),M.autoBrain=hn.has("auto")?new Ps(r,Dn(),Cs[1]):null,xh(1)}function $0(i){let e=new Lr($t[i[0]],$t[i[1]],1);Y0(e,M.mode==="host"?0:1,"RIVAL",""),M.brain=null,M.outbox.length=0,M.pending.length=0,M.inSeq=0,M.ack=0,M.snapSeq=0,M.lastSnap=-1,M.corrections=0,M.errSum=M.errMax=0,M.inbox=null,M.lobby.me.ready=!1,M.lobby.peer&&(M.lobby.peer.ready=!1),M.autoBrain=hn.has("auto")?new Ps(M.mode==="host"?e:hS(e),Dn(),Cs[1]):null}function xh(i){let e=M.world;M.round=i,e.resetRound(),e.events.length=0,kt.clearRound();for(let o of kt.tops)o.hold=!0,o.drop=7;M.state="countdown",M.timeLeft=bh,M.acc=0,M.hitstop=0,M.slow.t=0,M.aimKey=null,M.buffer=null,M.pending.length=0,M.outbox.length=0,M.lastSnap=-1,M.inbox=null,Ne.setRound(i),Ne.setScore(M.score),M.mode==="host"&&M.net.send({t:"round",n:i,score:M.score});let t=M.score[0]===ji-1&&M.score[1]===ji-1,n=hn.has("quick"),s=n?.1:1.5,r=n?.05:.62,a=()=>{for(let o of kt.tops)o.hold=!1,o.dropV=0};M.seqT=0,M.seq=[{at:.05,run:()=>Ne.announce(t?"FINAL ROUND":"ROUND "+i,`${Dn().blade.en}\u3000vs\u3000${Mf().blade.en}`,"round",1.4)},{at:s,run:()=>{Ne.announce("3","","count",.6),ue.beep()}},{at:s+r,run:()=>{Ne.announce("2","","count",.6),ue.beep()}},{at:s+r*2,run:()=>{Ne.announce("1","","count",.6),ue.beep()}},{at:s+r*3,run:()=>{Ne.announce("GO SPIN!","","go",.9),ue.beep(!0),a()}}],M.mode!=="guest"&&M.seq.push({at:s+r*3+.38,run:Z0})}function Z0(){if(M.state==="countdown"){for(let i of kt.tops)i.hold=!1;M.state="fight",M.snapT=0,ue.clash(18),M.mode==="host"&&M.net.send({t:"go"})}}function QM(i){let e=i.winner.side===M.side;if(M.score[i.winner.side]++,M.finishes.push(`R${M.round} ${e?"WIN":"LOSE"}\uFF08${{over:"\u30AA\u30FC\u30D0\u30FC",burst:"\u30D0\u30FC\u30B9\u30C8",spin:"\u30B9\u30D4\u30F3",time:"\u5224\u5B9A"}[i.kind]}\uFF09`),M.state="finish",M.aimKey=null,M.buffer=null,M.slow={s:.16,t:i.kind==="time"?.3:1.25},M.hitstop=i.kind==="time"?0:.2,M.tail=4,Ne.finish(i.kind,e),Ne.setScore(M.score),Ne.flash("#fff",i.kind==="time"?.2:.7),ue.finish(e),M.seqT=0,M.mode==="guest"){M.seq=null;return}let t=M.score[0]>=ji||M.score[1]>=ji;M.seq=[{at:3.3,run:()=>{if(!t)return xh(M.round+1);M.mode==="host"&&M.net.send({t:"result",score:M.score,stats:M.world.tops.map(n=>n.stats)}),j0()}}]}function j0(){M.state="result",kt.orbiting=!0,ue.stopMusic(),Ne.announceEl.className="",Ne.labels.innerHTML="",Ne.showResult(M.score[M.side]>M.score[1-M.side],M.score,M.world,M.finishes),Cr("result")}function eS(i){return`${location.origin}${location.pathname}?room=${i}`}function J0(){return M.net&&M.net.leave(),M.net=new fh({status:xf,open:sS,message:aS,packet:lS,closed:rS}),hn.has("lag")&&M.net.simulate(Number(hn.get("lag"))||0,Number(hn.get("jitter"))||0,Number(hn.get("loss"))||0),M.net}function K0(i){M.mode=i,M.state="lobby";let e=M.lobby;e.role=i,e.status="opening",e.url="",e.error="",e.peer=null,e.me={blade:Ne.blade,ready:!1},kt.setMatch(null,0),kt.orbiting=!0,Cr("lobby"),Ne.showLobby(e)}function Sf(){K0("host"),J0().host()}function Q0(i){K0("guest"),J0().join(i)}function Tf(){let i=M.lobby;M.net&&M.net.connected&&M.net.send({t:"lobby",blade:i.me.blade,ready:i.me.ready}),eg()}function eg(){let i=M.lobby;if(M.state==="lobby"&&Ne.showLobby(i),M.mode==="host"&&M.state==="lobby"&&i.me.ready&&i.peer&&i.peer.ready){let e=[i.me.blade,i.peer.blade];M.net.send({t:"start",blades:e}),$0(e),xh(1)}}function tS(i){M.lobby.status==="connected"&&(M.lobby.me.ready=i,Tf())}function W0(i){if(!M.net||!M.net.connected){lo();return}M.state="lobby",M.world=null,M.seq=null,kt.setMatch(null,0),kt.orbiting=!0,ue.stopMusic(),Ne.labels.innerHTML="",Ne.vignette.style.opacity=0,Cr("lobby"),M.lobby.me.ready=!!i,Tf()}function Ef(){M.net&&(M.net.leave(),M.net=null),hn.has("room")&&history.replaceState(null,"",location.pathname)}async function nS(){let i=M.lobby.url;if(i)try{await navigator.clipboard.writeText(i),Ne.toast("\u62DB\u5F85URL\u3092\u30B3\u30D4\u30FC\u3057\u307E\u3057\u305F")}catch{document.getElementById("lb-url").select(),Ne.toast("URL\u3092\u9078\u629E\u3057\u307E\u3057\u305F\u3002Ctrl+C \u3067\u30B3\u30D4\u30FC\u3057\u3066\u304F\u3060\u3055\u3044")}}var iS={"peer-unavailable":"\u30EB\u30FC\u30E0\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002URL\u304C\u53E4\u3044\u304B\u3001\u30DB\u30B9\u30C8\u304C\u30EB\u30FC\u30E0\u3092\u9589\u3058\u3066\u3044\u307E\u3059\u3002",timeout:"\u63A5\u7D9A\u304C\u30BF\u30A4\u30E0\u30A2\u30A6\u30C8\u3057\u307E\u3057\u305F\u3002\u30CD\u30C3\u30C8\u30EF\u30FC\u30AF\u74B0\u5883\u306B\u3088\u3063\u3066\u306F\u76F4\u63A5\u63A5\u7D9A\u3067\u304D\u306A\u3044\u5834\u5408\u304C\u3042\u308A\u307E\u3059\u3002",network:"\u4EF2\u4ECB\u30B5\u30FC\u30D0\u30FC\u306B\u63A5\u7D9A\u3067\u304D\u307E\u305B\u3093\u3002\u30A4\u30F3\u30BF\u30FC\u30CD\u30C3\u30C8\u63A5\u7D9A\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002","server-error":"\u4EF2\u4ECB\u30B5\u30FC\u30D0\u30FC\u306B\u63A5\u7D9A\u3067\u304D\u307E\u305B\u3093\u3002\u5C11\u3057\u5F85\u3063\u3066\u304B\u3089\u3082\u3046\u4E00\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002","browser-incompatible":"\u3053\u306E\u30D6\u30E9\u30A6\u30B6\u306F\u30AA\u30F3\u30E9\u30A4\u30F3\u5BFE\u6226\uFF08WebRTC\uFF09\u306B\u5BFE\u5FDC\u3057\u3066\u3044\u307E\u305B\u3093\u3002",full:"\u3053\u306E\u30EB\u30FC\u30E0\u306F\u6E80\u54E1\u3067\u3059\u3002",version:"\u76F8\u624B\u3068\u30B2\u30FC\u30E0\u306E\u30D0\u30FC\u30B8\u30E7\u30F3\u304C\u9055\u3044\u307E\u3059\u3002\u4E21\u65B9\u306E\u30DA\u30FC\u30B8\u3092\u518D\u8AAD\u307F\u8FBC\u307F\u3057\u3066\u304F\u3060\u3055\u3044\u3002"};function xf(i,e){let t=M.lobby;if(i==="failed"){if(t.status="failed",t.error=iS[e]||`\u63A5\u7D9A\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\uFF08${e}\uFF09`,M.state!=="lobby"){Ne.toast(t.error),Ef(),lo();return}}else t.status=i,i==="waiting"&&(t.url=eS(e));M.state==="lobby"&&Ne.showLobby(t)}function sS(){let i=M.lobby;i.status="connected",M.net.send({t:"hello",v:lf,build:vf,blade:i.me.blade,ready:i.me.ready}),M.state==="lobby"&&Ne.showLobby(i)}function rS(i){let e=M.lobby;e.peer=null,e.me.ready=!1,Ne.setNet("");let t=M.state!=="lobby"&&M.state!=="title";M.mode==="host"?(e.status="waiting",M.state="lobby",M.world=null,M.seq=null,M.paused=!1,kt.setMatch(null,0),kt.orbiting=!0,ue.stopMusic(),Ne.labels.innerHTML="",Cr("lobby"),Ne.showLobby(e),Ne.toast(t?"\u76F8\u624B\u3068\u306E\u63A5\u7D9A\u304C\u5207\u308C\u307E\u3057\u305F":"\u76F8\u624B\u304C\u9000\u51FA\u3057\u307E\u3057\u305F")):M.mode==="guest"&&(Ne.toast(i==="timeout"?"\u63A5\u7D9A\u304C\u30BF\u30A4\u30E0\u30A2\u30A6\u30C8\u3057\u307E\u3057\u305F":"\u30DB\u30B9\u30C8\u3068\u306E\u63A5\u7D9A\u304C\u5207\u308C\u307E\u3057\u305F"),Ef(),lo())}var ph=i=>Number.isFinite(i)?Math.max(-50,Math.min(50,i)):0;function aS(i){let e=M.lobby,t=M.world;switch(i.t){case"hello":if(i.v!==lf){xf("failed","version"),M.net.leave();return}typeof i.build=="string"&&i.build!==vf&&Ne.toast(`\u76F8\u624B\u306F\u5225\u306E\u7248\u3067\u3059\uFF08${i.build.slice(0,40)}\uFF09`);case"lobby":if(!$t[i.blade])return;e.peer={blade:i.blade,ready:!!i.ready},M.state==="result"&&Ne.toast(i.ready?"\u76F8\u624B\u304C\u518D\u6226\u3092\u5F85\u3063\u3066\u3044\u307E\u3059":"\u76F8\u624B\u304C\u30ED\u30D3\u30FC\u306B\u623B\u308A\u307E\u3057\u305F"),eg();break;case"full":xf("failed","full");break;case"bye":M.net&&M.net.drop("bye");break;case"start":if(M.mode!=="guest"||!Array.isArray(i.blades)||!$t[i.blades[0]]||!$t[i.blades[1]])return;$0(i.blades);break;case"round":if(M.mode!=="guest"||!t)return;M.score=[i.score[0]|0,i.score[1]|0],xh(i.n|0);break;case"go":M.mode==="guest"&&t&&(M.seq=null,Z0());break;case"ev":if(M.mode!=="guest"||!t||!Array.isArray(i.l))return;for(let n of i.l)oS(U0(n,t));break;case"result":if(M.mode!=="guest"||!t)return;M.score=[i.score[0]|0,i.score[1]|0],i.stats.forEach((n,s)=>Object.assign(t.tops[s].stats,n)),j0();break;case"in":{if(M.mode!=="host"||!t||M.state!=="fight")return;let n=t.tops[1];i.k==="m"?t.issueMove(n,ph(i.x),ph(i.z)):i.k==="c"&&Ct.includes(i.key)&&t.cast(n,i.key,ph(i.x),ph(i.z)),M.ack=i.s|0;break}}}function oS(i){let e=M.world;if(i.type==="ringout"&&i.top&&!i.top.out&&(i.top.out={t:0,y:0,vy:7+(i.power||0)*.35}),i.type==="finish"){if(M.state!=="fight")return;e.result={winner:i.winner,loser:i.loser,kind:i.kind},(i.kind==="spin"||i.kind==="burst")&&(i.loser.spin=0)}rg(i)}function lS(i){if(M.mode!=="guest"||dh(i)!==cf||!M.world||M.state!=="fight")return;let e=k0(i);if(M.lastSnap>=0){let t=e.seq-M.lastSnap&65535;if(t===0||t>32768)return;t>1&&(M.net.stats.lost+=t-1)}M.lastSnap=e.seq,M.inbox={buf:i,head:e,at:performance.now()}}function cS(){let i=M.inbox,e=M.world;if(M.inbox=null,!i||!e||M.state!=="fight")return!1;let t=kt.capture();D0(e,i.buf),M.timeLeft=i.head.timeLeft;let n=i.head.ack;M.pending=M.pending.filter(o=>{let l=o.s-n&65535;return l!==0&&l<32768});let s=Dn();for(let o of M.pending)o.k==="m"?e.issueMove(s,o.x,o.z):e.cast(s,o.key,o.x,o.z);let r=Math.min(KM,M.net.rtt/2+(performance.now()-i.at)/1e3);for(let o=Math.round(r/qi);o>0;o--)e.step(qi);e.events.length=0,M.acc=0,kt.absorb(t);let a=0;return e.tops.forEach((o,l)=>{!o.air&&!o.out&&!o.blink&&(a=Math.max(a,Math.hypot(o.x-t[l].x,o.z-t[l].z)))}),M.corrections++,M.errSum+=a,M.errMax=Math.max(M.errMax,a),!0}function hS(i){return new Proxy(i,{get(e,t){if(t==="cast")return(s,r,a,o)=>ng(r,a,o);if(t==="issueMove")return(s,r,a)=>tg(r,a);let n=e[t];return typeof n=="function"?n.bind(e):n}})}function tg(i,e){let t=M.world,n=Dn();return t.issueMove(n,i,e)?(M.mode==="guest"&&ig({k:"m",x:n.cmd.x,z:n.cmd.z}),!0):!1}function ng(i,e,t){let n=M.world;return n.cast(Dn(),i,e,t)?(M.mode==="guest"&&(n.events.length=0,ig({k:"c",key:i,x:e,z:t})),!0):!1}function ig(i){i.s=M.inSeq=M.inSeq+1&65535,i.x=Math.round(i.x*100)/100,i.z=Math.round(i.z*100)/100,M.pending.push(i),M.pending.length>40&&M.pending.shift(),M.net.send({t:"in",...i})}function wf(){let i=kt.pick(M.cursor.sx,M.cursor.sy);i&&(M.cursor.x=i.x,M.cursor.z=i.z)}function sg(i){if(M.state!=="fight"||M.paused)return;wf();let e=Dn();tg(M.cursor.x,M.cursor.z)&&!i&&(kt.marker(e.cmd.x,e.cmd.z),ue.move())}function Af(i,e,t,n){if(M.state!=="fight"||M.paused)return!1;let s=Dn();if(!ng(i,e,t)){let r=M.world,a=!r.busy(s)&&r.ready(s,i)?r.blocked(s,i):null;return!a&&r.ready(s,i,.25)&&!s.air&&!s.out&&!n?M.buffer={key:i,x:e,z:t,t:.45}:n||(ue.denied(),Ne.denied(i),a&&Kt(s,a,"word dim")),!1}return M.buffer=null,Ne.castFx(i),!0}bf.addEventListener("mousemove",i=>{M.cursor.sx=i.clientX,M.cursor.sy=i.clientY});bf.addEventListener("mousedown",i=>{if(ue.unlock(),M.cursor.sx=i.clientX,M.cursor.sy=i.clientY,i.button===2&&M.aimKey){M.aimKey=null;return}i.button!==0&&i.button!==2||(M.mouseDown=!0,M.moveRepeat=.12,sg(!1))});window.addEventListener("mouseup",()=>{M.mouseDown=!1});window.addEventListener("contextmenu",i=>i.preventDefault());window.addEventListener("keydown",i=>{if(i.repeat||i.target.tagName==="INPUT")return;let e=i.key.toUpperCase();if(e==="ESCAPE"){M.aimKey?M.aimKey=null:gh();return}if(e==="P")return gh();if(e==="M"){ue.unlock(),ue.setMuted(!ue.muted),Ne.setMuted(ue.muted);return}if(M.state!=="fight"||M.paused||!Ct.includes(e))return;ue.unlock();let t=Dn();if(M.world.aimSkill(t,e).aim==="self"){Af(e,t.x,t.z);return}if(!M.world.ready(t,e,.25)||t.air||t.out){ue.denied(),Ne.denied(e);return}M.aimKey=e});window.addEventListener("keyup",i=>{let e=i.key.toUpperCase();e===M.aimKey&&(M.aimKey=null,wf(),Af(e,M.cursor.x,M.cursor.z))});window.addEventListener("blur",()=>{M.aimKey=null,M.mouseDown=!1,M.state==="fight"&&!M.paused&&!Yi()&&!hn.has("auto")&&gh()});function gh(){["countdown","fight","finish"].includes(M.state)&&(M.paused=!M.paused,M.aimKey=null,Ne.show("pause",M.paused),ue.ui())}var X0=()=>M.paused&&!Yi();function Kt(i,e,t){let n=kt.toScreen(i.x,Ve(i.x,i.z)+2.2,i.z);Ne.pop(n.x,n.y,e,t)}function yn(i,e){if(e<1)return;let t=e>=90?"huge":e>=45?"big":"";Kt(i,Math.round(e),`dmg ${i.side===M.side?"taken":"dealt"} ${t}`)}function gf(i,e){e>=1&&Kt(i,"+"+Math.round(e),"heal")}function rg(i){kt.handle(i);let e=t=>t&&t.side===M.side;switch(i.type){case"clash":ue.clash(i.power),yn(i.a,i.dmgA),yn(i.b,i.dmgB),i.kind==="parry"?(ue.parry(),M.hitstop=.17,Kt(i.src,"PARRY!","word gold"),Ne.flash("#ffe9a0",.3)):i.kind==="dash"||i.kind==="empower"?(ue.projHit(),M.hitstop=.14,Kt(i.src===i.a?i.b:i.a,i.kind==="dash"?"DASH HIT!":i.src.blade.emp.id==="phantom"?"PHANTOM STRIKE!":i.src.blade.emp.en+"!","word"),Ne.flash(i.src.blade.css,.22)):i.power>9&&(M.hitstop=Math.max(M.hitstop,Math.min(.1,.015+i.power*.0035)));break;case"wall":ue.wall(i.power,i.slam),yn(i.top,i.dmg),i.slam&&i.dmg>8&&(Kt(i.top,"WALL SLAM","word red"),M.hitstop=Math.max(M.hitstop,.07));break;case"bump":ue.wall(i.power*.6,!1);break;case"cast":i.windup>0&&ue.windup(),i.ult&&Ne.cutIn(i.base,i.top.blade.css,!e(i.top));break;case"blink":ue.blink();break;case"blinkEnd":e(i.top)&&Kt(i.top,"POWER UP","word gold");break;case"zone":{let t=i.zone.kind;t==="sanctuary"?ue.heal():t==="quake"||t==="grenade"?ue.windup():i.zone.skill.ult?ue.leap():ue.guard();break}case"blast":i.skill.ult?(ue.meteor(),Ne.flash("#fff",.4)):ue.quake(),i.hit&&(yn(i.target,i.hit),M.hitstop=i.skill.ult?.18:.1);break;case"strike":ue.projHit(),yn(i.top,i.dmg),M.hitstop=i.big?.18:.07,i.big&&Ne.flash(i.src.blade.css,.3);break;case"say":Kt(i.top,i.text,"word "+(i.tone||""));break;case"dot":yn(i.top,i.dmg);break;case"warp":ue.blink();break;case"buff":i.off?ue.move():ue.guard(),i.skill.ult&&e(i.top)&&Kt(i.top,"POWER UP","word gold");break;case"cone":ue.flare(),i.hit&&(yn(i.target,i.hit),M.hitstop=.07);break;case"fling":ue.dash();break;case"chan":ue.leap(),M.slow={s:.4,t:.25};break;case"egg":ue.guard(),Kt(i.top,"EGG","word gold"),Ne.flash(i.top.blade.css,.3);break;case"rebirth":ue.heal(),Kt(i.top,"REBIRTH!","word gold"),Ne.flash(i.top.blade.css,.4);break;case"quake":ue.quake(),i.hit&&(yn(i.target,i.hit),Kt(i.target,"STUN","word red"),M.hitstop=.12);break;case"charge":i.skill.ult?(ue.leap(),M.slow={s:.4,t:.25}):ue.windup();break;case"nova":ue.meteor(),Ne.flash("#fff",.5),i.hit?(yn(i.target,i.hit),M.hitstop=.2,M.slow={s:.35,t:.45}):Kt(i.top,"MISS","word dim");break;case"flare":ue.flare(),i.hit&&(yn(i.target,i.hit),gf(i.top,i.heal),M.hitstop=.07);break;case"orbs":ue.guard();break;case"orbHit":ue.projHit(),yn(i.target,i.dmg),M.hitstop=.06;break;case"tether":ue.leap(),M.slow={s:.4,t:.25};break;case"drain":ue.drain(),yn(i.target,i.dmg),gf(i.top,i.heal);break;case"tetherEnd":i.broke&&!M.world.result&&Kt(i.top,"BREAK","word dim");break;case"heal":gf(i.top,i.amount);break;case"shoot":i.proj.skill.chain?ue.chain():ue.shoot();break;case"reflect":ue.parry(),Kt(i.top,"REFLECT!","word gold"),M.hitstop=.1;break;case"projHit":ue.projHit(),yn(i.top,i.dmg),i.proj.skill.chain&&Kt(i.top,"HOOKED!","word"),M.hitstop=.09;break;case"guard":ue.guard();break;case"dash":ue.dash();break;case"leap":ue.leap(),M.slow={s:.3,t:.32};break;case"meteor":ue.meteor(),Ne.flash("#fff",.55),i.hit?(yn(i.target,i.hit),M.hitstop=.2,M.slow={s:.35,t:.45}):Kt(i.top,"MISS","word dim");break;case"ringout":ue.ringout();break;case"finish":QM(i);break}}function uS(i){let e=M.net;M.outbox.length&&e.send({t:"ev",l:M.outbox.splice(0)}),(M.state==="fight"||M.state==="finish"&&M.tail>0)&&(M.snapT-=i,!(M.snapT>0)&&(M.snapT+=1/(e.congested?JM:jM),M.snapT<0&&(M.snapT=0),M.state==="finish"&&M.tail--,M.snapSeq=M.snapSeq+1&65535,e.sendPacket(L0(M.world,{seq:M.snapSeq,ack:M.ack,timeLeft:M.timeLeft}))))}function _f(i,e=!0){let t=M.world,n=M.net;n&&n.update(i);let s=0;if(!X0()){if(M.seq){for(M.seqT+=i;M.seq&&M.seq.length&&M.seq[0].at<=M.seqT;)M.seq.shift().run();M.seq&&!M.seq.length&&(M.seq=null)}if(t&&(M.state==="fight"||M.state==="finish")){Yi()&&M.state==="fight"&&(M.hitstop=0,M.slow.t=0);let a=1;for(M.hitstop>0?(M.hitstop-=i,a=0):M.slow.t>0&&(M.slow.t-=i,a=M.slow.s),s=i*a,M.buffer&&(M.buffer.t-=i,(Af(M.buffer.key,M.buffer.x,M.buffer.z,!0)||M.buffer&&M.buffer.t<=0)&&(M.buffer=null)),M.mouseDown&&M.state==="fight"&&!M.paused&&(M.moveRepeat-=i,M.moveRepeat<=0&&(M.moveRepeat=.1,sg(!0))),M.mode==="guest"&&M.inbox&&cS()&&(s=0),M.acc+=s;M.acc>=qi;){if(M.acc-=qi,M.state==="fight"&&(M.brain&&M.brain.update(qi),M.autoBrain&&M.autoBrain.update(qi),M.timeLeft-=qi,M.mode!=="guest"&&M.timeLeft<=0&&!t.result&&t.timeUp()),t.step(qi),t.events.length){let o=t.events.splice(0);if(M.mode!=="guest")for(let l of o)M.mode==="host"&&M.outbox.push(N0(l)),rg(l)}if(M.hitstop>0){M.acc=0;break}}if(M.state==="fight"){let o=Dn().ult>=100;o&&!M.ultWasReady&&(ue.ultReady(),Kt(Dn(),"ULT READY","word gold")),M.ultWasReady=o}}M.mode==="host"&&t&&n&&n.connected&&uS(i)}if(!e)return;M.frames++;let r=null;if(t&&M.state==="fight"&&!M.paused&&(wf(),M.aimKey&&(r={key:M.aimKey,x:M.cursor.x,z:M.cursor.z})),kt.update(s,X0()?0:i,r),t&&["countdown","fight","finish"].includes(M.state)&&(Ne.update(t,kt,M.timeLeft,M.aimKey,i),ue.intensity=1-Math.min(Ht(Dn()),Ht(Mf()))),n&&n.connected&&n.rttKnown){let a=Math.round(n.rtt*1e3);Ne.setNet(`PING ${a}ms${n.fast?"":" \u30FB \u4F4E\u901F\u56DE\u7DDA\u30E2\u30FC\u30C9"}`,a>160||!n.fast)}else Yi()||Ne.setNet("");ue.update(),hn.has("norender")||kt.render()}var yf=performance.now();function ag(i,e){let t=Math.max(0,(i-yf)/1e3);yf=i;let n=Math.min(t,e?Yi()?.25:.05:1);for(;n>.05;)_f(.05,!1),n-=.05;_f(n,e)}function og(i){ag(i,!0),requestAnimationFrame(og)}requestAnimationFrame(og);try{let i="setInterval(() => postMessage(0), 16);",e=new Worker(URL.createObjectURL(new Blob([i],{type:"text/javascript"})));e.onmessage=()=>{document.hidden&&Yi()&&M.net&&M.net.connected&&ag(performance.now(),!1)}}catch{}document.addEventListener("visibilitychange",()=>{document.hidden||(yf=performance.now())});window.addEventListener("pagehide",()=>{M.net&&M.net.leave()});lo();Ne.setMuted(!1);document.getElementById("version").textContent=vf;window.__gc={game:M,view:kt,ui:Ne,audio:ue,frame:_f,startMatch:mh,openRoom:Sf,joinRoom:Q0,BLADES:$t};var q0=G0(hn.get("room"));q0.length===6?Q0(q0):hn.has("host")?Sf():hn.has("demo")&&mh(hn.get("blade")||"azure",Number(hn.get("level")||1));})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
