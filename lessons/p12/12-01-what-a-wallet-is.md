---
id: 12-01
minutes: 8
summary: A crypto wallet is an app or small device that lets you see and send crypto. It doesn't hold coins like a purse. It holds the secret key, and the secret phrase is the master key to everything.
highlight: the key, not the coins
---

> **Disclosure:** Francesco Andreoli, who made this course, works at MetaMask. This phase is wallet-neutral: it names no wallet to use and is not an official MetaMask or Consensys product.

:::story Grandpa’s question
Walter is 80 and lives in Aarau. His grandson mentions he “keeps some crypto in a wallet”. Walter asks: “So where is the money? In your phone?”

His grandson explains: the money is recorded on a big shared ledger on the internet. The wallet app is like a key ring. Whoever has the key can move the money. “So the key is everything,” Walter says. Exactly.

*Walter is made up.*
:::end

:::remember
**A wallet is a key ring, not a purse. Whoever has the secret key, or the secret phrase, controls the money.**
:::end

## A wallet, in plain words

ethereum.org, the community website for the Ethereum network, explains that a wallet is an application that gives you control over your account. It shows your balance, lets you send and receive, and lets you sign in to apps. Wallet providers don’t hold your funds; they give you a window to see and manage them, and you can switch wallet apps at any time ([ethereum.org: Wallets](https://ethereum.org/en/wallets/)).

Your account is a pair of keys. One makes your **address**, which you can share, like an email address. The other is the **private key**, which you keep secret because it signs every payment ([ethereum.org](https://ethereum.org/en/wallets/)).

:::figure wallet-plain
A crypto wallet, in plain words.
:::end

## Kinds of wallets

ethereum.org lists hardware wallets (small devices that keep keys offline), mobile apps, browser wallets and browser extensions ([ethereum.org](https://ethereum.org/en/wallets/)). This course doesn’t recommend any particular one.

## What is different from a bank

- **No one can undo a payment.** ethereum.org warns that a transaction sent on Ethereum is irreversible ([ethereum.org: Security](https://ethereum.org/en/security/)).
- **No one can reset your key.** The US Federal Trade Commission notes that if your wallet is lost or stolen, no one can step in to get the money back, and crypto isn’t insured by the government like bank deposits ([FTC: Cryptocurrency and scams](https://consumer.ftc.gov/articles/what-know-about-cryptocurrency-scams)).

That is why the rest of this phase is about one thing: keeping the key safe.

:::exercise Words to know
Match each word to its meaning in your own words: address, private key, secret phrase, wallet app.
:::solution
**Address**: where others send you crypto; you can share it. **Private key**: the secret that signs payments; never share it. **Secret phrase**: 12 or 24 words that can rebuild all your keys; never share it. **Wallet app**: the tool that shows your balance and uses the keys.
:::end

:::helper
If a relative says they have been told to “open a wallet” by someone they met online, stop and talk first. That is often the start of an investment scam (lesson 08.04).
:::end

:::quiz
- q: What does a crypto wallet really hold?
  options: ["Coins, like a purse", "The keys that control the money", "Nothing"]
  answer: 1
  explain: The wallet holds keys. Whoever has them controls the money.
- q: Can a crypto payment be undone like a card payment?
  options: ["Yes, always", "No. Payments can’t be reversed", "Only on Sundays"]
  answer: 1
  explain: ethereum.org says transactions are irreversible.
- q: Which can you share safely?
  options: ["Your address", "Your private key", "Your secret phrase"]
  answer: 0
  explain: The address is like an email address. Keys and phrase stay secret.
:::end

:::xlink
lesson 08-04 | The friendly investment "advisor" and the fake trading app
lesson 12-02 | The secret phrase: 12 or 24 words that are the whole safe
:::end

## Sources

- [ethereum.org: What's an Ethereum wallet?](https://ethereum.org/en/wallets/)
- [ethereum.org: Security and scam prevention](https://ethereum.org/en/security/)
- [FTC: What to know about cryptocurrency and scams](https://consumer.ftc.gov/articles/what-know-about-cryptocurrency-scams)
