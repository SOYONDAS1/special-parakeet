// ✅ Telegram Real User Detection
let tg = window.Telegram.WebApp;
tg.expand();

let user = tg.initDataUnsafe?.user;
let username = user ? user.first_name : "Guest";
document.getElementById("tgUser").innerText = username;

// ✅ Core Variables
let miningDuration = 5 * 60 * 60 * 1000;
let baseReward = 0.005;

let balance = parseFloat(localStorage.getItem("balance")) || 0;
let miningStart = localStorage.getItem("miningStart");
let vip = localStorage.getItem("vip") === "true";
let compound = localStorage.getItem("compound") === "true";
let lastBonus = localStorage.getItem("dailyBonus");
let referralUsed = localStorage.getItem("refUsed");

let userCode = localStorage.getItem("userCode");
if(!userCode){
    userCode = "BNB" + Math.floor(Math.random()*100000);
    localStorage.setItem("userCode", userCode);
}
document.getElementById("refCode").innerText = userCode;

// ✅ Level System
function getLevel(){
    return Math.floor(balance / 0.05) + 1;
}

// ✅ UI Update
function updateUI(){
    document.getElementById("balance").innerText = balance.toFixed(3)+" BNB";
    document.getElementById("level").innerText = "Level: "+getLevel();
    document.getElementById("compoundStatus").innerText = compound ? "ON":"OFF";
    document.getElementById("vipStatus").innerText = vip ? "VIP ACTIVE (2x)" : "";

    localStorage.setItem("balance", balance);
    localStorage.setItem("vip", vip);
    localStorage.setItem("compound", compound);
}

updateUI();
updateTimer();
updateLeaderboard();

// ✅ Mining
function startMining(){
    if(miningStart) return alert("Already mining");
    miningStart = Date.now();
    localStorage.setItem("miningStart", miningStart);
}

function claimMining(){
    if(!miningStart) return alert("Start first");

    let now = Date.now();
    let diff = now - miningStart;

    if(diff >= miningDuration){

        let reward = baseReward + (getLevel()*0.0005);
        if(vip) reward *= 2;

        balance += reward;

        miningStart = null;
        localStorage.removeItem("miningStart");

        updateUI();
        updateLeaderboard();
        alert("Reward: "+reward.toFixed(4)+" BNB");

        if(compound) startMining();

    } else {
        alert("Not finished");
    }
}

function updateTimer(){
    if(miningStart){
        let remaining = miningDuration - (Date.now()-miningStart);

        if(remaining <= 0){
            document.getElementById("timer").innerText="Ready";
        } else {
            let h=Math.floor(remaining/3600000);
            let m=Math.floor((remaining%3600000)/60000);
            let s=Math.floor((remaining%60000)/1000);
            document.getElementById("timer").innerText=
            String(h).padStart(2,'0')+":"+
            String(m).padStart(2,'0')+":"+
            String(s).padStart(2,'0');
        }
    }
    setTimeout(updateTimer,1000);
}

// ✅ Auto Compound
function toggleCompound(){
    compound=!compound;
    updateUI();
}

// ✅ Daily Bonus
function dailyBonus(){
    let today=new Date().toDateString();
    if(lastBonus===today) return alert("Already claimed");
    balance+=0.002;
    lastBonus=today;
    localStorage.setItem("dailyBonus",today);
    updateUI();
}

// ✅ Referral
function applyReferral(){
    if(referralUsed) return alert("Already used");
    let input=document.getElementById("refInput").value;
    if(input && input!==userCode){
        balance+=0.003;
        referralUsed=true;
        localStorage.setItem("refUsed",true);
        updateUI();
    } else alert("Invalid code");
}

// ✅ VIP
function upgradeVIP(){
    if(vip) return alert("Already VIP");
    if(balance>=0.02){
        balance-=0.02;
        vip=true;
        updateUI();
    } else alert("Not enough balance");
}

// ✅ Withdraw (Fake)
function withdraw(){
    let amt=parseFloat(document.getElementById("withdrawAmount").value);
    if(amt>balance) return alert("Insufficient");
    if(amt<0.01) return alert("Minimum 0.01");
    balance-=amt;
    updateUI();
    alert("Withdraw Request Submitted ✅");
}

// ✅ Leaderboard (Demo)
function updateLeaderboard(){
    let list=document.getElementById("leaderboard");
    list.innerHTML="";

    let players=[
        {name:username,bal:balance},
        {name:"MinerX",bal:0.350},
        {name:"CryptoPro",bal:0.280},
        {name:"BNBKing",bal:0.210}
    ];

    players.sort((a,b)=>b.bal-a.bal);

    players.forEach(p=>{
        let li=document.createElement("li");
        li.innerText=p.name+" - "+p.bal.toFixed(3)+" BNB";
        list.appendChild(li);
    });
}

// ✅ Rewarded Ads
function watchAd(){
    show_11026296().then(()=>{
        balance+=0.001;
        updateUI();
    });
}
