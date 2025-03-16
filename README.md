# Globetrotter 🗺️✨
Welcome to Globetrotter—a quirky, thrilling side project I whipped up with equal parts caffeine, chaos, and love for coding! Built with Next.js on the frontend and my trusty ol’ pal Express.js on the backend, this was a blast to create—despite that nagging "time’s running out" anxiety. Spoiler: I survived (mostly)!

Globetrotter is a trivia adventure with a Game of Thrones twist—think maps of Westeros and Essos as your backdrop while you flex your brainpower. It’s epic, it’s fun, and it’s got a little chaos baked in.

## What’s It About? 🎮
Globetrotter is all about challenging your wits and your friends. The "Challenge a Friend" feature steals the show—personally tested and certified hilarious (bugs included for extra spice). Picture you and your buddy in a trivia showdown where the stakes are bragging rights and the laughs are plentiful.

## Tech Stack ⚙️
- Frontend: Next.js (modern React is life)
- Backend: Express.js (the ol’ reliable)
- Vibes: 100% fun, 10% panic, and a sprinkle of Game of Thrones flair

## Project Structure 🏰
Here’s the lay of the land in this monorepo kingdom (minus the node_modules mess):


```
├── app
│   ├── auth
│   │   └── page.tsx
│   ├── challenge
│   │   └── [id]
│   │       └── page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── backend
│   ├── nodemon.json
│   ├── package.json
│   ├── package-lock.json
│   ├── resources
│   │   └── seedData.json
│   ├── scripts
│   │   └── seedQuestionBank.ts
│   ├── src
│   │   ├── config
│   │   │   └── supabase.ts
│   │   ├── controllers
│   │   │   ├── auth.controller.ts
│   │   │   ├── challenge.controller.ts
│   │   │   └── question.controller.ts
│   │   ├── index.ts
│   │   ├── middlewares
│   │   │   └── auth.middleware.ts
│   │   ├── routes
│   │   │   └── api.ts
│   │   ├── services
│   │   │   └── db.service.ts
│   │   └── types
│   │       └── database.types.ts
│   └── tsconfig.json
├── components
│   ├── auth
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── ChallengeQuizBox.tsx
│   ├── ProtectedRoute.tsx
│   ├── QuizBox.tsx
│   ├── ShareChallengeDialog.tsx
│   ├── TriviaBox.tsx
│   └── ui
│       ├── alert.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── progress.tsx
│       └── tabs.tsx
├── components.json
├── eslint.config.mjs
├── lib
│   └── utils.ts
├── next.config.ts
├── next-env.d.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── images
│   │   ├── aww-hell-nah.png
│   │   ├── background.jpg
│   │   ├── correct.png
│   │   ├── dankmemerthinking.png
│   │   ├── giveup.png
│   │   ├── scroll.png
│   │   └── waiting.png
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── README.md
├── services
│   └── api.service.ts
├── store
│   ├── useAuthStore.ts
│   ├── useChallengeStore.ts
│   └── useGameStore.ts
├── tsconfig.json
├── types
│   ├── auth.ts
│   └── index.ts
└── utils
    └── api.ts

25 directories, 65 files
```

## Features 🌟
**Trivia Time:** - Test your knowledge with fun quizzes.
- Challenge a Friend: Duel your buddies—bugs add extra giggles!
- Game of Thrones Vibes: Maps as backgrounds for that Westerosi feel.
- Bugs: Unintentional comedy gold (fixing… eventually).


## Future Enhancements (If Time Permits ⏳)
If the gods of procrastination spare me, I’d love to add:

- Keploy for Testing: Auto-generated unit tests to keep this ship afloat.
- User Stats Page: A hall of fame to flex how goated I am at my own game. Bow down!

## How to Run It 🚀
```
Clone the repo: git clone <repo-url>
Install deps: npm install (root + backend dirs)
Start the backend: cd backend && npm run dev
Fire up the frontend: cd .. && npm run dev
Hit localhost:3000 and **pray to the Seven it works!**
```
Final Words 🗡️
Globetrotter was a wild ride to build—part passion project, part stress test. I hope you enjoy it as much as I did (bugs and all). Challenge your friends, soak in the Game of Thrones vibes, and let me know if you spot a White Walker in the code!

Winter is coming… but the trivia’s already here. Enjoy! ❄️