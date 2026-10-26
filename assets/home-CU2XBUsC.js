import{D as e,O as t,T as n,d as r,n as i,w as a}from"./index-BTuzQhaB.js";import{n as o,t as s}from"./map-BzyvQn-I.js";function c(c){let l=e.get().last,u=r[0].id;return c.innerHTML=`<div class="wrap">
  <section class="hero" aria-labelledby="hero-title">
    <p class="pill">Free · no sign-up · in plain English</p>
    <h1 id="hero-title" class="display" style="margin-top:14px">Security <br>from <span class="hl">Scratch</span></h1>
    <p class="lede">How to spot phone scams, fake messages and bad links, and how to keep your accounts safe. Short lessons, big text, calm practice.</p>
    <div class="actions"><a class="btn btn-primary" href="#/learn/${l||u}" data-testid="start">${l?`Continue where you left off`:`Start the first lesson`}</a><a class="btn btn-quiet" href="#/practice">Try the practice exercises</a></div>
    <ul class="stats"><li><b>${r.length}</b><span>short lessons</span></li><li><b>${a.length}</b><span>phases</span></li><li><b data-testid="written-count">${n()}</b><span>ready so far</span></li></ul>
  </section>
  <section class="section" aria-labelledby="rules-h"><h2 id="rules-h">If you remember only one thing</h2>
    <ol class="rules" data-testid="golden-rules">
      <li><b>1. Stop.</b>Is someone rushing you, scaring you, or asking you to keep a secret? That is the moment to pause.</li>
      <li><b>2. Hang up.</b>You may end any call or close any message. A real bank or police officer will not mind.</li>
      <li><b>3. Check.</b>Call back on a number you already have: from your card, a letter, or your own contacts.</li>
    </ol>
    <p class="muted-strong" style="margin-top:14px">In danger right now? Call <b>117</b> (police, Switzerland), <b>112</b> (anywhere in Europe) or <b>911</b> (United States).</p>
  </section>
  <section class="section" aria-labelledby="who"><h2 id="who">Who this is for</h2>
    <div class="three">
      <div class="card"><h3>For you</h3><p>No experience needed. Each lesson takes a few minutes. You can make the text bigger, or press “Read this lesson to me”.</p></div>
      <div class="card"><h3>For family helpers</h3><p>Look for the “For family helpers” boxes. They show how to help without taking over, and how to set things up together.</p></div>
      <div class="card"><h3>No tracking</h3><p>Your progress is saved only in this browser. There are no accounts, no adverts and nothing is sent anywhere.</p></div>
    </div>
  </section>
  <section class="section" aria-labelledby="map-h"><h2 id="map-h">The course, phase by phase</h2>${s()}<div style="margin-top:16px">${o()}</div></section>
  <section class="section" aria-labelledby="sib"><h2 id="sib">Sister course</h2><p style="max-width:60ch">Curious how AI voice clones and deepfakes work? <a href="${i(t)}" target="_blank" rel="noopener" data-xlink="ai-safety">AI Safety from Scratch</a> explains it, and the two courses link to each other lesson by lesson.</p></section>
  </div>`,``}export{c as renderHome};