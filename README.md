# 🏈 Varsity - University Fan Engagement App

A gamified mobile app that drives student attendance at collegiate sporting events through social predictions, virtual rewards, and community competition.

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## 📱 Features

### 🎯 Social Predictions
- Predict game outcomes using virtual "Varsity Coins"
- Real-time odds display with positive/negative spreads
- Track prediction history and win rates

### 🏟️ Stadium Boost
- **2x-5x multipliers** when physically at the stadium
- Exclusive "Flash Props" unlocked only for attendees
- Incentivizes real attendance over watching from home

### 🏆 Leaderboards
- Weekly and all-time rankings
- Top 3 podium display with medals
- Compete against friends and the whole campus

### 🎁 Rewards Marketplace
- **Digital Rewards**: Avatar customizations, profile badges
- **University Perks**: Priority registration, parking passes
- **Sponsor Deals**: Gift cards, local discounts

### 🎟️ Ticket Exchange
- Peer-to-peer ticket marketplace
- Safe transfers within the student body
- Reduce scalping and empty seats

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- [Expo Go](https://expo.dev/client) app on your phone

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/VarsityApp.git
cd VarsityApp

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Testing on Device

1. Install **Expo Go** on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
2. Scan the QR code in the terminal
3. The app will load on your device!

### Testing on Simulator

```bash
# iOS Simulator (requires Xcode)
npx expo start --ios

# Android Emulator (requires Android Studio)
npx expo start --android

# Web Browser
npx expo start --web
```

## 🗂️ Project Structure

```
VarsityApp/
├── App.tsx                     # App entry point
├── src/
│   ├── theme/                  # Design system (colors, typography)
│   ├── types/                  # TypeScript interfaces
│   ├── store/                  # Zustand state management
│   │   ├── authStore.ts        # User authentication & coins
│   │   ├── predictionStore.ts  # Markets & predictions
│   │   ├── locationStore.ts    # Stadium geofencing
│   │   ├── rewardsStore.ts     # Rewards catalog
│   │   └── ticketsStore.ts     # P2P ticket exchange
│   ├── screens/
│   │   ├── auth/               # Onboarding flow
│   │   │   ├── UniversitySelectScreen.tsx
│   │   │   ├── EmailVerifyScreen.tsx
│   │   │   ├── ProfileSetupScreen.tsx
│   │   │   └── OnboardingScreen.tsx
│   │   └── main/               # Main app screens
│   │       ├── HomeScreen.tsx
│   │       ├── PredictionsScreen.tsx
│   │       ├── LeaderboardScreen.tsx
│   │       ├── RewardsScreen.tsx
│   │       └── TicketsScreen.tsx
│   ├── components/             # Reusable UI components
│   ├── navigation/             # React Navigation setup
│   └── data/                   # Mock data for development
├── assets/                     # Images and icons
└── app.json                    # Expo configuration
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React Native + Expo SDK 54 |
| Language | TypeScript |
| Navigation | React Navigation v6 |
| State Management | Zustand |
| Storage | AsyncStorage |
| Location | expo-location |
| Styling | React Native StyleSheet |

## 🎮 Demo Mode

The app includes demo features for testing:

- **University Selection**: Any university can be selected
- **Email Verification**: Any 6-digit code works
- **Stadium Boost**: Toggle "SIMULATE" on Home screen to test multipliers
- **Mock Data**: Pre-populated games, markets, rewards, and tickets

## 📄 License

MIT License - feel free to use this project for learning or as a starting point for your own app.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Built with ❤️ for college sports fans everywhere
