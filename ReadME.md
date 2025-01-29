Volunteers4Israel

Volunteers4Israel is a web application designed to centralize all volunteer events in Israel during challenging times of war. It aims to connect Israelis, Jews worldwide, and anyone who feels connected to Israel's situation by offering an accessible platform to engage in volunteer activities.

Features

Light and Dark Modes: Seamless switching between light and dark themes for user comfort.

Event Management: Create, update, and delete volunteer events.

Participant Management: Sign up for or withdraw from events.

Event Filtering: Filter events by location, date, and category.

View Modes: Toggle between Card View and List View for event display.

Chronological Display: Events are sorted chronologically with color coding for past, ongoing, and upcoming events.

About Us: Dedicated section to learn more about the platform.

Event Forms: User-friendly forms for event creation and participant registration.

Tech Stack

Frontend: React, Axios

Backend: Node.js, Express

Database: Knex.js (SQL Query Builder)

Installation

Prerequisites

Node.js (v14 or above)

npm

Clone the Repository

git clone https://github.com/your-username/volunteer-connect-israel.git
cd volunteer-connect-israel

Install Dependencies

Backend

cd backend
npm install

Frontend

cd frontend
npm install

Running the Application

Start the Backend

cd backend
npx nodemon server.js

Start the Frontend (on any port except 3000)

cd frontend
npm start

Project Structure

volunteer-connect-israel/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── db/
│   ├── server.js
│   └── knexfile.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   └── public/
├── package.json
└── README.md

API Endpoints

Events

GET /events - Retrieve all events

POST /events - Create a new event

PUT /events/:id - Update an existing event

DELETE /events/:id - Delete an event

Participants

POST /events/:id/register - Register for an event

DELETE /events/:id/unregister - Unregister from an event

Deployment

Configure environment variables for production.

Deploy the backend and frontend on platforms like Heroku, Vercel, or Netlify.

Contributing

Fork the repository.

Create a new branch (git checkout -b feature/YourFeature).

Commit your changes (git commit -m 'Add YourFeature').

Push to the branch (git push origin feature/YourFeature).

Open a Pull Request.

License

This project is licensed under the MIT License.

Acknowledgments

Special thanks to all volunteers and contributors supporting Israel during these challenging times.

Connecting hearts, empowering action.

VolunteerConnect Israel 🇮🇱