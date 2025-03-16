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
.
├── app                  # Frontend magic lives here
│   ├── auth             # Login & auth pages
│   ├── challenge        # Dynamic challenge routes
│   ├── globals.css      # Styles to rule them all
│   └── layout.tsx       # The app’s backbone
├── backend              # Express.js backend goodness
│   ├── src
│   │   ├── controllers  # Logic for auth, challenges, and questions
│   │   ├── routes       # API endpoints
│   │   ├── services     # Database helpers
│   │   └── types        # TypeScript typings
│   ├── resources        # Seed data for trivia
│   └── scripts          # Handy scripts like seeding the question bank
├── components           # Reusable UI bits
│   ├── auth             # Login & Register forms
│   ├── QuizBox.tsx      # Where trivia happens
│   ├── ShareChallengeDialog.tsx  # Challenge your friends!
│   └── ui               # Shiny UI components (buttons, cards, etc.)
├── public               # Static assets
│   ├── images           # Memes + GOT-inspired backgrounds
│   └── globe.svg        # Globetrotting vibes
├── store                # Zustand stores for state management
├── utils                # Helper functions
└── README.md            # You’re here!
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