# Life in Weeks

A beautiful web app that visualizes your entire life as a grid of weeks. Each box represents one week of your life. Inspired by Tim Urban's ["Your Life in Weeks"](https://waitbutwhy.com/2014/05/life-weeks.html) from Wait But Why.

![Life in Weeks Preview](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-cyan)

## ✨ Features

- **Three-Person View:** Track your life, your dad's life, and your mom's life
- **Interactive Grid:** Each box = one week. Lived weeks are filled, remaining weeks are outlined
- **Current Week Indicator:** Subtle pulse animation highlights the current week
- **Detailed Stats:** See weeks lived, weeks remaining, percent of life lived, and years remaining
- **Hover Tooltips:** See exact age and year for any week
- **Editable Settings:** Customize names, ages, and life expectancy for each person
- **Time Calculator:** Calculate how many days you have left with your parents
- **Dark/Light Mode:** Automatic theme switching with manual toggle
- **LocalStorage Persistence:** All settings saved locally in your browser
- **Mobile Responsive:** Looks great on all screen sizes
- **Zero Backend:** Completely client-side, no server required

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/life-calendar.git
cd life-calendar

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
life-calendar/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles
├── components/
│   ├── PersonToggle.tsx    # Tab switcher (Me/Dad/Mom)
│   ├── SettingsPanel.tsx   # Editable person details
│   ├── Stats.tsx           # Statistics display
│   ├── LifeGrid.tsx        # Main grid of weeks
│   ├── WeekBox.tsx         # Individual week with tooltip
│   ├── Quote.tsx           # Inspirational text
│   ├── ThemeToggle.tsx     # Dark/light mode switch
│   └── TimeCalculator.tsx  # Parent time calculator
├── lib/
│   ├── types.ts            # TypeScript interfaces
│   ├── calculations.ts     # Week calculations & logic
│   └── storage.ts          # localStorage helpers
└── hooks/
    └── useLocalStorage.ts  # Custom hook for localStorage
```

## 🎯 Default Values

- **Me:** Age 24
- **Dad:** Age 52  
- **Mom:** Age 48
- **Life Expectancy:** 73 years (average Indian life expectancy)

All values can be edited through the settings panel.

## 📊 Calculations

- Each row = 52 weeks = 1 year
- Life expectancy of 73 years = 73 rows = 3,796 total weeks
- Current week calculation based on actual date
- Age labels shown every 5 years on the left

## 🎨 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Deployment:** Vercel (zero-config)
- **Storage:** Browser localStorage (no backend needed)

## 🌐 Deploy on Vercel

The easiest way to deploy this app:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/life-calendar)

Or follow the detailed instructions in [DEPLOYMENT.md](./DEPLOYMENT.md)

### Quick Deploy Steps:

1. Push code to GitHub
2. Import repository on [Vercel](https://vercel.com)
3. Click Deploy
4. Done! Your app is live

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by Tim Urban's [Wait But Why](https://waitbutwhy.com)
- Built with ❤️ using Next.js and Tailwind CSS

## 📧 Contact

For questions or feedback, feel free to reach out or open an issue.

---

**Remember:** Deadlines make you act. Nothing makes you call your parents. Choose this week on purpose.
