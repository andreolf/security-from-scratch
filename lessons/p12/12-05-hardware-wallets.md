---
id: 12-05
minutes: 8
summary: A hardware wallet keeps keys on a small offline device. Buy it only from the maker or an official reseller. If the box contains words already written, or a PIN, don't use it.
highlight: make your own words
---

> **Disclosure:** Francesco Andreoli, who made this course, works at MetaMask. This phase is wallet-neutral: it names no wallet to use and is not an official MetaMask or Consensys product.

:::story The bargain device
Rolf is 68 and lives in Biel. He finds a hardware wallet on a marketplace site for half the price. Inside the box is a neat card: “Your recovery phrase”, with 24 words already printed, and a PIN.

Rolf is about to use it when he remembers: a real device makes your words for you. He sends it back and orders one from the maker’s own website. The new box has only blank cards.

*Rolf is made up.*
:::end

:::remember
**A real hardware wallet makes your words when you set it up. Words or a PIN already in the box mean: don’t use it.**
:::end

## What a hardware wallet is

ethereum.org describes hardware wallets as devices that store private keys offline, which greatly reduces the risk of being hacked, even if someone gets control of your computer ([ethereum.org: Security](https://ethereum.org/en/security/)). You don’t need one to be safe with small amounts; the rules about the secret phrase (lesson 12.02) matter most.

## The pre-filled phrase trap

Some scammers sell devices with the secret words already written on a card. Whoever wrote them has a copy, and can empty the wallet as soon as you put money in.

Hardware wallet makers warn about this. Ledger describes a buyer who lost his coins after buying a second-hand device that the seller had already set up, and says its documentation never includes pre-existing seed words or a PIN: if you receive a device with them, don’t use it as it is ([Ledger](https://www.ledger.com/scam-second-hand-ledger-device)). Trezor says never to buy from an unauthorised third party, to check the package hasn’t been tampered with, and that you create your own wallet backup during setup ([Trezor](https://trezor.io/support/troubleshooting/device-issues/is-my-device-safe-to-use)).

These are two makers’ own pages; this course doesn’t recommend either.

:::figure prefilled-trap
Hardware wallet warning signs.
:::end

## Safe buying and setup

1. **Buy from the maker’s own website** or an official reseller it lists. Not second-hand, not from an unknown marketplace seller.
2. **Check the box** for damage or broken seals.
3. **Set your own PIN.** Never use one that came with it.
4. **Let the device make new words**, and write them on the blank card yourself.
5. **Keep the words on paper**, hidden at home (lesson 12.02).

:::practice scenes scene=hardware

:::helper
If a relative wants a hardware wallet, help them order it from the maker’s own website, typed in yourselves. Let them do the setup and write the words; look away while they do.
:::end

:::quiz
- q: Your new hardware wallet comes with 24 words already printed. What do you do?
  options: ["Use them", "Don’t use the device as it is. Someone else has those words", "Add a few words of your own"]
  answer: 1
  explain: A real device makes your own words at setup.
- q: Where should you buy a hardware wallet?
  options: ["Any cheap marketplace seller", "From the maker or its official resellers", "Second-hand from a stranger"]
  answer: 1
  explain: Makers warn against unknown and second-hand sellers.
- q: Who sets the PIN?
  options: ["You, during setup", "The seller", "The delivery driver"]
  answer: 0
  explain: Never use a PIN someone gave you.
:::end

:::xlink
lesson 12-02 | The secret phrase: 12 or 24 words that are the whole safe
lesson 12-06 | Clicked something bad? What to do
:::end

## Sources

- [ethereum.org: Security and scam prevention](https://ethereum.org/en/security/)
- [Ledger: Scam with a second-hand device](https://www.ledger.com/scam-second-hand-ledger-device)
- [Trezor: Is my device safe to use?](https://trezor.io/support/troubleshooting/device-issues/is-my-device-safe-to-use)
