# ⏱️ Time Tracker - Advanced Activity Monitoring App

A modern, feature-rich time tracking application built with React, featuring multi-language support, beautiful data visualizations, and persistent session management. Perfect for freelancers, students, and professionals who want to monitor and analyze their daily activities.

## 🌟 Features

### Core Functionality
- **⏰ Precision Timer**: Start/stop timer with millisecond accuracy
- **📝 Session Management**: Save, name, and categorize your work sessions
- **🎨 Color Coding**: Assign custom colors to different activities for easy identification
- **📊 Data Visualization**: Interactive 24-hour activity charts with AM/PM breakdowns
- **💾 Persistent Storage**: All data saved locally in browser storage
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Advanced Features
- **🌍 Multi-language Support**: Full internationalization with English and Persian (Farsi)
- **🔄 RTL/LTR Support**: Automatic text direction switching for Persian language
- **📈 Activity Analytics**: Pie charts showing activity distribution across 24-hour periods
- **🎯 Visual Legends**: Color-coded legends for easy session identification
- **⚡ Real-time Updates**: Live timer display with elapsed time tracking
- **🗑️ Bulk Operations**: Clear all sessions or delete individual ones

## 🚀 Live Demo

[View Live Demo](https://time-tracker-yrk.pages.dev/)

## 📸 Screenshots

### Timer Interface
![Timer Interface](docs/timer-screenshot.png)

### Activity Charts
![Activity Charts](docs/charts-screenshot.png)

### Multi-language Support
![Multi-language](docs/multilang-screenshot.png)

## 🛠️ Technology Stack

### Frontend Framework
- **React 18.2.0** - Modern React with hooks and functional components
- **React Router DOM 6.11.0** - Client-side routing and navigation
- **Vite 6.2.3** - Lightning-fast build tool and development server

### Styling & UI
- **Tailwind CSS 4.0.17** - Utility-first CSS framework
- **Heroicons 2.2.0** - Beautiful SVG icons
- **React Icons 5.5.0** - Popular icon library
- **Vazirmatn Font** - Persian-friendly typography

### Internationalization
- **i18next 24.2.3** - Internationalization framework
- **react-i18next 15.4.1** - React bindings for i18next
- **i18next-browser-languagedetector 8.0.4** - Automatic language detection
- **i18next-http-backend 3.0.2** - Backend translation loading

### Data Visualization
- **Recharts 2.1.11** - Composable charting library for React

### Development Tools
- **TypeScript Config** - Type-safe development experience
- **PostCSS & Autoprefixer** - CSS processing and vendor prefixes

## 📦 Installation

### Prerequisites
- Node.js 16.0 or higher
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/mahdimma/time-tracker.git
   cd time-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
# or
yarn build
```

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

## 🏗️ Project Structure

```
time-tracker/
├── public/                     # Static assets
│   └── locales/               # Translation files
│       ├── en/                # English translations
│       │   └── translation.json
│       └── fa/                # Persian translations
│           └── translation.json
├── src/                       # Source code
│   ├── components/            # Reusable UI components
│   │   ├── Layout.jsx         # Main layout wrapper
│   │   ├── Nav.jsx            # Navigation bar
│   │   ├── MyLanguageSwitcher.jsx # Language toggle
│   │   ├── TimerDisplay.jsx   # Timer visualization
│   │   ├── TimerControls.jsx  # Start/stop controls
│   │   ├── SessionForm.jsx    # Session saving form
│   │   ├── SessionList.jsx    # Sessions history
│   │   └── NotFoundPage.jsx   # 404 error page
│   ├── pages/                 # Main application pages
│   │   ├── TimerPage.jsx      # Timer functionality
│   │   ├── ChartPage.jsx      # Data visualization
│   │   └── NotFoundPage.jsx   # Error handling
│   ├── utils/                 # Utility functions
│   │   ├── helpers.jsx        # Time formatting & ID generation
│   │   └── localStorage.jsx   # Data persistence
│   ├── App.jsx                # Root component
│   ├── i18n.jsx              # Internationalization setup
│   ├── index.jsx             # Application entry point
│   └── index.css             # Global styles
├── index.html                 # HTML template
├── vite.config.ts            # Vite configuration
├── package.json              # Dependencies & scripts
└── README.md                 # This file
```

## 🎯 Usage Guide

### Starting a Session
1. Click the "Start Timer" button on the home page
2. The timer will begin counting and display elapsed time
3. Click "End Timer" when you're finished with your activity

### Saving Sessions
1. After stopping the timer, a form will appear
2. Enter a descriptive name for your session (optional)
3. Choose a color to categorize your activity
4. Click "Save Session" to store the data

### Viewing Analytics
1. Navigate to the "Charts" page using the navigation menu
2. View your activity distribution across 24-hour periods
3. Analyze AM/PM patterns and session durations
4. Use the color-coded legend to identify different activities

### Language Switching
1. Use the language switcher in the navigation bar
2. Choose between English and Persian (فارسی)
3. The interface will automatically adjust text direction and layout

## 🔧 Configuration

### Adding New Languages

1. Create a new translation file in `public/locales/[language-code]/translation.json`
2. Add the language to the switcher in `src/components/MyLanguageSwitcher.jsx`
3. Update the preload array in `src/i18n.jsx`

### Customizing Colors

Default session colors are defined in `src/components/SessionForm.jsx`:
```javascript
const suggestedColors = [
  "#EF4444", // Red
  "#F97316", // Orange
  "#EAB308", // Yellow
  "#22C55E", // Green
  "#3B82F6", // Blue
  "#8B5CF6", // Violet
  "#EC4899", // Pink
];
```

### Storage Configuration

Sessions are stored in browser localStorage. To change storage method, modify the functions in `src/utils/localStorage.jsx`.

## 🌐 Browser Support

- **Chrome** 88+
- **Firefox** 85+
- **Safari** 14+
- **Edge** 88+

## 📱 Mobile Support

The application is fully responsive and optimized for:
- **iOS Safari** 14+
- **Android Chrome** 88+
- **Mobile browsers** with modern JavaScript support

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and structure
- Add translations for new UI text in both English and Persian
- Test responsive design on multiple device sizes
- Ensure RTL layout works correctly for Persian language
- Write meaningful commit messages

## 🐛 Bug Reports & Feature Requests

Please use the [GitHub Issues](https://github.com/mahdimma/time-tracker/issues) page to:
- Report bugs with detailed reproduction steps
- Request new features with clear use cases
- Suggest improvements to existing functionality

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Mahdi MMA** - [GitHub Profile](https://github.com/mahdimma)

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first styling approach
- **i18next** for internationalization capabilities
- **Vazirmatn Font** for beautiful Persian typography
- **Heroicons** for the clean icon set
- **Recharts** for data visualization components

## 📊 Project Stats

- **Lines of Code**: ~2,000+
- **Components**: 12
- **Languages Supported**: 2 (English, Persian)
- **Translation Keys**: 40+
- **Dependencies**: 12 production, 4 development

---

<div align="center">
  <p>Built with ❤️ using React and modern web technologies</p>
  <p>
    <a href="#-time-tracker---advanced-activity-monitoring-app">Back to Top</a>
  </p>
</div>