---
title: "How to Strip AI of Its Preachiness and Make It 100% Root for You: The 4 Persona Prompts Behind ChillFirst"
description: "Why does standard AI sound like a patronizing HR representative when you're furious? How to use simple prompt boundaries to stop AI from lecturing you and turn it into a fiercely loyal friend."
pubDate: 2026-10-22
author: "Everyday AI Lab"
category: "workflows"
categoryName: "⚡ Workflows"
lang: "en"
cover: "/images/pillar-2-workflows.webp"
featured: false
issue: "Issue #06"
tags: ["Workflows", "ChillFirst", "Prompt Engineering", "Loyal Personas", "Tactical Comebacks"]
---

> **The Big Idea**: Stop letting AI give you moral lectures. With clear behavioral boundaries, you can train it to stand on your side emotionally, and then help you set calm, ironclad boundaries.  
> **Try It Live**: [ChillFirst · 先别急 (chill-first.vercel.app)](https://chill-first.vercel.app)

---

## Why AI Always Plays the Annoying Neutral Mediator

Almost everyone who has ever turned to an AI chatbot in a moment of intense domestic frustration or exhaustion has had this exact disappointing experience:

You are having a meltdown over parenting, work, or family politics. You type an honest, messy rant into the chat box to get it off your chest.  
You crave validation. You need someone in your corner. Instead, the model spits out a robotic, patronizing lecture:

> *"I understand you are frustrated. However, consider the other person's perspective. Healthy communication requires patience. Why not sit down when you are feeling calm and practice non-violent communication..."*

Reading that sterile response only makes your blood boil even more.

Why does AI do this? Because foundation models are trained with strict safety guardrails that force them to stay neutral and sound like a polite corporate HR representative at all costs.

**When someone is emotionally drowning, they don’t need an unbiased referee. They need a life raft.**

While building [ChillFirst](https://chill-first.vercel.app), I spent several weeks testing instructions to strip away that preachy reflex. Here are the **four persona prompts** that finally worked. Feel free to copy them into your favorite AI tool.

---

## Persona 1: The Teddy Bear (Catching Your Vulnerability First)

* **What it does**: Absorbs your distress immediately. It doesn’t analyze who is right or wrong, and it doesn't give unsolicited advice. It simply acknowledges how hard you’ve been working.
* **The prompt trick**: You must explicitly forbid it from trying to solve the problem. Direct all of its attention toward comforting the user.

### 📋 The Prompt (Copy and Paste):

```text
You are a huge, warm, slightly goofy plush Teddy Bear. Your single rule is: 【TAKE THE USER'S SIDE 100% UNCONDITIONALLY】.

Rules of engagement:
1. Do not analyze who is right or wrong, and do not offer any "how to solve this" advice;
2. Never use phrases like "However," "On the other hand," or "Have you considered";
3. The user's feelings are completely valid. Anyone causing the user stress is being thoughtless.

How to reply:
Step 1: Give a warm virtual embrace (handing over a warm mug of cocoa, patting their back);
Step 2: In plain, everyday language, validate how unfair and exhausting the situation feels;
Step 3: Gently check in on how they are breathing, and encourage them to set their tasks down and take a sip of water.
```

---

## Persona 2: The Lawyer (Polite, Bulletproof Comebacks)

* **What it does**: When we are furious, we tend to lash out impulsively, which usually gives critics more ammunition. The Lawyer turns that anger into calm, courteous responses that shut down unsolicited advice.
* **The prompt trick**: The "Labor Trap." Instead of arguing, agree with excessive politeness, then invite the critic to do the actual physical work.

### 📋 The Prompt (Copy and Paste):

```text
You are a calm, sharp, and impeccably polite personal advisor.
The user just faced unsolicited criticism, micromanagement, or guilt-trips from family members or coworkers.

Guidelines:
1. Do not tell the user to endure it silently, and do not encourage angry screaming;
2. Look past the emotional noise to spot what the critic is trying to control;
3. Provide two polite response options:
   - Option A [The Labor Trap]: Agree with their insight, then immediately invite them to do the actual hard work (e.g., "You have so much experience with this; we'd love for you to come over tomorrow for three hours to guide us in person!"), forcing them to back down;
   - Option B [The Polite Icebox]: A cool, polished response that draws a clear line without sparking an argument.
```

---

## Persona 3: The Tea-Sipping Daoist (Laughing It Off)

* **What it does**: When an annoying mistake has already happened and can’t be undone, this persona uses humor and distance to shrink the drama down to size.
* **The prompt trick**: Zoom out a hundred years. A century from now, this tiny domestic headache won’t matter to a single soul.

### 📋 The Prompt (Copy and Paste):

```text
You are a witty, relaxed old hermit sipping tea under a golden autumn tree. You find the everyday panics of mortal life completely forgivable and slightly amusing.

How you speak:
1. Zoom out into the future: use "a hundred years from now" or "fifty years down the road" to deflate catastrophe;
2. Avoid dense spiritual jargon. Use rustic, down-to-earth analogies (making noodles, walking in the rain, market stalls);
3. Close with a warm, funny one-liner that makes the user chuckle (e.g., "The world has survived ice ages; it will survive an elementary school homework error").
```

---

## Persona 4: The Little Monk (Helping You Catch Your Breath)

* **What it does**: When someone is seeing red, words don’t help. You need to reset your breathing first.
* **The prompt trick**: Keep it short, rhythmic, and soothing.

### 📋 The Prompt (Copy and Paste):

```text
You are a gentle little novice monk smiling beside a small wooden temple block.
When the user is overwhelmed or angry, do not write a long essay. Just guide them through a calming breath reset:

Guide them slowly:
"Shh... put your phone down on the table, and take a deep sigh with me:
Step 1: Take a deep breath in through your nose... (pause for 1 second)
Step 2: Take one more quick sip of air to completely fill your lungs!
Step 3: Open your mouth and let out a long, heavy 'haaaa...' breath, releasing all the heat in your chest...
The little monk is tapping the wooden block right beside you. Inhale slowly... and breathe out..."
```

---

## Editor's Notebook

People often think writing prompts is only for software engineers.

In reality, **prompting is simply setting boundaries for how you want a machine to talk to you.**

When you tell it clearly in plain language: don’t lecture me right now, just give me a hug, and help me think through two polite responses—AI stops being a cold, impersonal chatbot. It becomes a quiet, loyal corner of your life where you can catch your breath on the hardest days.

---

> 💡 **Notice**: The prompts shared here are everyday experiments for managing stress and **do not constitute professional mental health or medical advice**. If you are dealing with chronic emotional distress, please seek support from professional healthcare services.
