# Big Boulder - Bouldering Fitness Tracking App

A web-based fitness tracking application designed for bouldering enthusiasts. Track your climbing sessions, log your progress, connect with other climbers in the forum, and monitor your fitness improvements over time.

## Features

### User Authentication
- **User Registration**: Create an account with username, email, and password
- **User Login**: Secure login with bcrypt password hashing
- **Session Management**: Persistent user sessions with automatic logout
- **Input Validation**: Email validation and password strength requirements (minimum 8 characters)
- **Duplicate Prevention**: Prevents duplicate usernames and emails
- **Audit Logging**: All login attempts (successful and failed) are logged for security

### Climbing Session Tracking
- **Log Climbs**: Record climbing sessions with climb name and difficulty rating
- **View Sessions**: Browse your climbing history organized by date
- **Progress Monitoring**: Track your fitness improvements and climbing progress over time

### Community Forum
- **Create Posts**: Start discussions about bouldering, training, and fitness
- **Reply System**: Reply to any post, including replies to replies (nested threading)
- **Threaded Conversations**: View posts organized hierarchically by parent-child relationships
- **Post Display**: Left-aligned user info and date, right-aligned content with auto-expanding textareas

### Admin/Audit Features
- **Audit Log**: View all login attempts with timestamps and success/failure status
- **Event Tracking**: Track different types of events (login, incorrect username/email, incorrect password)

## Technology Stack

**Backend:**
- **Node.js** with **Express.js** - Web server and routing
- **EJS** - Server-side templating engine
- **MySQL 2** - Database connection and queries
- **Express-Session** - Session management
- **Bcrypt** - Password hashing and encryption
- **Express-Sanitizer** - Input sanitization for XSS protection
- **Express-Validator** - Input validation
- **Dotenv** - Environment variable configuration

**Frontend:**
- **HTML/EJS** - Page templates
- **CSS** - Modern responsive styling with flexbox layout
- **Vanilla JavaScript** - Auto-expanding textareas and dynamic interactions

**Database:**
- **MySQL 8.0+**

## 📋 Database Schema

### Users Table
```sql
- id: Auto-increment primary key
- username: VARCHAR(50), UNIQUE
- email: VARCHAR(100), UNIQUE
- password_hash: VARCHAR(255)
- created: DATETIME
```

### Climbs Table
```sql
- id: Auto-increment primary key
- user_id: VARCHAR(50), foreign key to users.username
- climb_name: VARCHAR(100)
- difficulty: VARCHAR(10)
- date_climbed: DATETIME
```

### Posts Table
```sql
- id: Auto-increment primary key
- user_id: VARCHAR(50), foreign key to users.username
- title: VARCHAR(150)
- content: TEXT
- created: DATETIME
- parentpost: INT (foreign key to posts.id for nested replies)
```

### Audit Table
```sql
- id: Auto-increment primary key
- datetime: DATETIME
- username: VARCHAR(50)
- success: BOOLEAN
- eventType: VARCHAR(50)
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL 8.0 or higher
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NightFlash96/10_health_33800519.git
   cd 10_health_33800519
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   mysql -u root -p < create_db.sql
   ```
   This will create the database, tables, and a default user (`health_app`).

4. **Optionally load test data**
   ```bash
   mysql -u root -p health < insert_test_data.sql
   ```

5. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```
   PORT=8000
   HEALTH_HOST=localhost
   HEALTH_USER=health_app
   HEALTH_PASSWORD=qwertyuiop
   HEALTH_DATABASE=health
   HEALTH_CONNECTION_LIMIT=10
   ```

6. **Start the server**
   ```bash
   node index.js
   ```

7. **Access the application**
   Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

## Project Structure

```
.
├── index.js                 # Main server file
├── package.json             # Project dependencies
├── create_db.sql            # Database schema
├── insert_test_data.sql     # Sample data
├── .env                     # Environment configuration (create this)
├── middleware/
│   └── redirectlogin.js     # Login redirect middleware
├── routes/
│   ├── main.js              # Authentication and core routes
│   └── climbs.js            # Climbing session routes
├── views/
│   ├── index.ejs            # Home page
│   ├── about.ejs            # About page
│   ├── login.ejs            # Login form
│   ├── register.ejs         # Registration form
│   ├── registered.ejs       # Registration confirmation
│   ├── addclimb.ejs         # Add climb form
│   ├── climbadded.ejs       # Climb added confirmation
│   ├── sessions.ejs         # User climbing sessions
│   ├── createpost.ejs       # Create forum post form
│   ├── replypost.ejs        # Reply to post form
│   ├── forum.ejs            # Forum view with threaded posts
│   ├── auditlog.ejs         # Admin audit log
│   └── partials/
│       └── header.ejs       # Navigation header
├── public/
│   ├── style.css            # Main stylesheet
│   └── images/
│       ├── home2.jpeg       # Home page background
│       └── climb.jpeg       # Climb-related pages background
└── docs/                    # Documentation folder
```

## Security Features

- **Password Hashing**: Bcrypt with salt rounds for secure password storage
- **Input Sanitization**: All user inputs are sanitized to prevent XSS attacks
- **Input Validation**: Email format and password strength validation
- **UNIQUE Constraints**: Database constraints prevent duplicate usernames and emails
- **Session Management**: Secure session handling with automatic expiration
- **SQL Injection Prevention**: Parameterized queries using MySQL2
- **Audit Logging**: All authentication attempts are logged for security monitoring

## Styling

The application features a modern, responsive design with:
- **Sitewide Styling**: Consistent `.site-*` classes for unified look and feel
- **Dark Theme**: Beautiful dark color scheme with accent colors
- **Flexbox Layout**: Responsive design that works on all screen sizes
- **Auto-Expanding Textareas**: Forum post content fields expand as users type
- **Animated Buttons**: Hover effects on call-to-action buttons
- **Forum Styling**: Left-aligned metadata (user/date/time) with right-aligned reply buttons
- **Background Images**: Full-viewport background images with blur effects
- **Rounded Corners**: Modern card-based UI design

## API Routes

### Authentication Routes
- `GET /` - Home page
- `GET /about` - About page
- `GET /login` - Login form
- `POST /loggedin` - Process login (with error rendering)
- `GET /register` - Registration form
- `POST /registered` - Process registration
- `GET /logout` - Logout and destroy session

### Climbing Routes (requires login)
- `GET /climbs/sessions` - View user's climbing sessions
- `GET /climbs/add` - Add climb form
- `POST /climbs/climb_added` - Process new climb entry

### Forum Routes
- `GET /forum` - View all forum posts (threaded)
- `GET /createpost` - Create post form (requires login)
- `POST /posted` - Process new forum post (requires login)
- `GET /replypost/:id` - Reply to post form (requires login)
- `POST /replyposted/:id` - Process post reply (requires login)

### Admin Routes (requires login)
- `GET /audit` - View audit log of login attempts

## Troubleshooting

### Images not displaying
- Ensure images are in `public/images/` directory
- Check that CSS uses relative paths: `url('./images/filename.jpeg')`
- Verify static file serving is configured: `app.use(express.static(path.join(__dirname, 'public')))`

### Database connection errors
- Verify MySQL is running
- Check `.env` file has correct credentials
- Ensure database user `health_app` exists and has proper permissions
- Run `create_db.sql` to create database and tables

### Session issues
- Clear browser cookies and restart the server
- Check session secret in `index.js` if needed
- Verify `express-session` dependency is installed

## Deployment

When deploying to production (e.g., Ubuntu VM):
1. Update `.env` with production database credentials
2. Ensure MySQL user and database are created
3. Update session secret for security
4. Use relative paths for static assets (not absolute `/images/`)
5. Configure reverse proxy (nginx/Apache) if needed
6. Set `NODE_ENV=production` environment variable

## License

ISC License - See package.json for details

## 👤 Author

NightFlash96

## 🔗 Links

- GitHub: https://github.com/NightFlash96/10_health_33800519
- Issues: https://github.com/NightFlash96/10_health_33800519/issues

---

**Happy Climbing!** 🧗‍♂️
