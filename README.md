# LeetGenie - Personalized Coding Practice Platform

A modern, intelligent coding practice platform that provides personalized problem recommendations based on your experience level, goals, and preferences.

## Features

- **Experience Level Dropdown**: Choose from Beginner, Intermediate, Advanced, or Expert
- **Preparation Goals**: Select what you're preparing for (Job Interview, Competitive Programming, etc.)
- **Daily Practice Targets**: Set your daily problem-solving goals
- **Confident Topics**: Multi-select topics you're already comfortable with
- **Programming Languages**: Select your preferred programming languages
- **Personalized Recommendations**: Get problem suggestions based on your profile

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install frontend dependencies:**
   ```bash
   npm install
   ```

2. **Start the frontend server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

### Development Mode

For development with auto-reload:
```bash
npm run dev
```

## Backend Integration

The frontend is designed to work with the existing backend APIs. To connect to your actual backend:

1. Update the API endpoints in `index.html` to point to your backend server
2. Ensure your backend has the following endpoints:
   - `GET /api/user/preferences/:username` - Get user preferences
   - `POST /api/user/preferences/:username` - Update user preferences
   - `GET /api/user/options` - Get available dropdown options

## Project Structure

```
├── index.html          # Main frontend interface
├── server.js           # Express server for serving frontend
├── package.json        # Frontend dependencies
├── README.md          # This file
└── leetcode_backend/  # Backend API (existing)
    ├── src/
    │   ├── api/
    │   │   └── user.js    # User API endpoints
    │   └── model/
    │       └── userModel.js # User data model
```

## Dropdown Features

### Experience Level
- **Beginner**: Just starting with coding
- **Intermediate**: Comfortable with basic concepts
- **Advanced**: Experienced with complex problems
- **Expert**: Master level problem solving

### Preparation Goals
- General Practice
- Job Interview
- Competitive Programming
- System Design
- Data Structures & Algorithms
- Frontend Development
- Backend Development
- Full Stack Development

### Daily Targets
- 1, 2, 3, 5, or 10 problems per day

### Confident Topics
Multi-select from 20+ algorithm topics including:
- Arrays, Strings, Linked Lists
- Trees, Graphs, Dynamic Programming
- Greedy, Backtracking, Binary Search
- And many more...

## Customization

You can easily customize the dropdown options by modifying the `config` object in `index.html`:

```javascript
const config = {
    experienceLevels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    preparationGoals: [...],
    dailyTargets: [1, 2, 3, 5, 10],
    confidentTopics: [...],
    programmingLanguages: [...]
};
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
