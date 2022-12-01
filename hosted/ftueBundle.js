(()=>{var e={413:e=>{const t=e=>{console.log(e)};e.exports={handleError:t,sendPost:async(e,r,a)=>{const n=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)}),o=await n.json();o.error&&t(o.error),o.redirect&&(window.location=o.redirect),a&&(console.log("calling handler",o),a(o))},sendPut:async(e,r,a)=>{const n=await fetch(e,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)}),o=await n.json();o.error&&t(o.error),o.redirect&&(window.location=o.redirect),a&&(console.log("calling handler"),console.log(o),a(o))},hideError:()=>{}}}},t={};function r(a){var n=t[a];if(void 0!==n)return n.exports;var o=t[a]={exports:{}};return e[a](o,o.exports,r),o.exports}(()=>{const e=r(413),t=t=>{t.preventDefault(),e.hideError();const r=t.target.querySelector("#firstname").value,a=t.target.querySelector("#lastname").value,n=t.target.querySelector("#description").value,o=t.target.querySelector("#_csrf").value,c=t.target.querySelector("#age").value;return a&&r&&c?(e.sendPost(t.target.action,{name:`${r} ${a}`,desc:n,_csrf:o,age:c}),!1):(e.handleError("Missing required fields!"),!1)},a=e=>React.createElement("form",{id:"profileForm",name:"profileForm",onSubmit:t,action:"/makeProfile",method:"POST",className:"profileForm"},React.createElement("h3",null,"Edit Profile Info"),React.createElement("hr",null),React.createElement("input",{id:"firstname",type:"text",name:"fname",placeholder:"First Name"}),React.createElement("input",{id:"lastname",type:"text",name:"lname",placeholder:"Last Name"}),React.createElement("input",{id:"age",type:"number",name:"age",placeholder:"Age",min:18}),React.createElement("label",{htmlFor:"desc"},"Description: "),React.createElement("textarea",{id:"description",type:"text",name:"desc",defaultValue:"Lorem Ipsum",value:e.description}),React.createElement("input",{id:"_csrf",type:"hidden",name:"_csrf",value:e.csrf}),React.createElement("input",{type:"submit"}));window.onload=async()=>{const e=await fetch("/getToken"),t=await e.json();ReactDOM.render(React.createElement(a,{csrf:t.csrfToken}),document.getElementById("info"))}})()})();