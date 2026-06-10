# Dopado

Dopado is a small gamified todo app built with React Native and Expo.
The app helps users organize daily tasks, complete todos, collect dopamine points and track progress over time.

## Features

* Create todos with title, description, date and category
* Edit existing todos
* Mark todos as completed
* Delete todos with confirmation
* Local SQLite storage
* Daily dopamine progress bar
* Reward animation when completing a todo
* Calendar view with daily task details
* GitHub-style activity heatmap
* Streak statistics with flame indicator
* Light and dark theme
* German and English language support

## Tech Stack

* React Native
* Expo
* TypeScript
* SQLite with `expo-sqlite`
* Custom theme system
* Custom i18n system

## Project Structure

```txt
src/
├─ components/
├─ database/
├─ hooks/
├─ i18n/
├─ screens/
├─ services/
├─ settings/
├─ theme/
└─ types/
```

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npx expo start
```

Start with cleared cache:

```bash
npx expo start -c
```

## App Idea

Dopado combines classic todo management with small motivational feedback elements.
Completed tasks generate dopamine points, fill a daily progress bar and contribute to streaks and activity statistics.

## Status

This project is currently in active development.

