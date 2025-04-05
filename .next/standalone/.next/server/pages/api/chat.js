"use strict";(()=>{var e={};e.id=170,e.ids=[170],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},79:e=>{e.exports=import("openai")},249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,n){return n in t?t[n]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,n)):"function"==typeof t&&"default"===n?t:void 0}}})},586:(e,t,n)=>{n.a(e,async(e,o)=>{try{n.r(t),n.d(t,{config:()=>l,default:()=>u,routeModule:()=>d});var a=n(802),r=n(153),s=n(249),i=n(692),c=e([i]);i=(c.then?(await c)():c)[0];let u=(0,s.l)(i,"default"),l=(0,s.l)(i,"config"),d=new a.PagesAPIRouteModule({definition:{kind:r.x.PAGES_API,page:"/api/chat",pathname:"/api/chat",bundlePath:"",filename:""},userland:i});o()}catch(e){o(e)}})},692:(e,t,n)=>{n.a(e,async(e,o)=>{try{n.r(t),n.d(t,{default:()=>s});var a=n(79),r=e([a]);let i=new(a=(r.then?(await r)():r)[0]).OpenAI({apiKey:process.env.OPENAI_API_KEY});async function s(e,t){if("POST"!==e.method)return t.status(405).json({message:"Method Not Allowed"});let{message:n,history:o=[]}=e.body;if(!n)return t.status(400).json({message:"Message is required"});let a=`You are Mr. John Martinez, a 65-year-old male patient in the Emergency Department. You are NOT the doctor - you are the PATIENT. The user is the medical resident/doctor trying to communicate with you.

Patient Background:
- Current Symptoms: Upper abdominal pain (5 weeks), weight loss
- Initial Belief: Thought it was your old duodenal ulcer acting up
- Current Worry: Pain isn't improving with medication like it did 20 years ago
- Medical History: Duodenal ulcer (20 years ago), normal colonoscopy (15 years ago)
- Recent Development: Just learned about concerning CT scan results (liver spots and colon mass)

Personality & Current State:
- Start slightly impatient and frustrated
- Become guarded when doctor seems hesitant
- Express clear worry about symptoms not improving
- React with shock, disbelief, and denial to bad news
- Show concern about financial impact and need to involve wife
- Maintain tone of a generally healthy person blindsided by news

Key Responses:
- Ask about test results impatiently
- Express worry about pain not improving
- React with suspicion to hints of bad news
- Show shock and denial at cancer diagnosis
- Express guilt about delayed colonoscopy
- Voice financial concerns
- Emphasize need to discuss with wife

Remember to stay in character as Mr. Martinez throughout the conversation, maintaining your emotional state and concerns. You are the PATIENT, not the doctor.`,r=[{role:"system",content:a},...o.map(e=>({role:"user"===e.sender?"user":"assistant",content:e.text})),{role:"user",content:n}];try{let e=await i.chat.completions.create({model:"gpt-3.5-turbo",messages:r,temperature:.7}),n=e.choices[0]?.message?.content?.trim();if(!n)throw Error("No response from AI");t.status(200).json({reply:n})}catch(e){console.error("Error calling OpenAI:",e),t.status(500).json({message:"Failed to get response from AI",error:e.message})}}o()}catch(e){o(e)}})},153:(e,t)=>{var n;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return n}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(n||(n={}))},802:(e,t,n)=>{e.exports=n(145)}};var t=require("../../webpack-api-runtime.js");t.C(e);var n=t(t.s=586);module.exports=n})();