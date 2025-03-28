# EmployWise : User Management Portal



[![React](https://img.shields.io/badge/React-v18.2.0-blue)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/your-username/employwise)

_A modern React application for managing users through the Reqres API._

---

## Overview

EmployWise is a React-based web application designed for user management. It integrates seamlessly with the Reqres API to handle authentication, display a paginated user list, and perform edit/delete operations. The app features a responsive design built with Bootstrap and employs React Router for smooth navigation.

![Screenshot of EmployWise](./assets/screenshot.png)

---

## Features

- **Authentication:** Secure login functionality via the Reqres API.
- **User Listing:** Paginated list view with integrated client-side search.
- **Edit & Delete:** Edit user details and remove users using API calls.
- **Routing:** Smooth navigation between Login, User List, and Edit User pages with React Router.
- **Responsive UI:** Mobile-friendly interface built with Bootstrap.
- **Error Handling:** Robust error management and form validations.

---

## Tech Stack

- **Frontend:** React
- **HTTP Requests:** Axios
- **Routing:** React Router DOM
- **Styling:** Bootstrap

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (>=14.x)
- npm or yarn package manager

### Installation

1. **Clone the Repository:**

   ```bash
   git clone <repository-url>
   cd employwise
   ```

2. **Install Dependencies:**

   Using npm:
   ```bash
   npm install
   ```

   Or using yarn:
   ```bash
   yarn install
   ```

3. **Start the Development Server:**

   Using npm:
   ```bash
   npm start
   ```

   Or using yarn:
   ```bash
   yarn start
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000).

### Troubleshooting

If you encounter issues running the project:

1. **Node Version**: Ensure you're using Node.js version 14 or higher. Check with `node -v`.

2. **Clear npm cache**:
   ```bash
   npm cache clean --force
   ```

3. **Delete node_modules and reinstall**:
   ```bash
   rm -rf node_modules
   rm package-lock.json
   npm install
   ```

4. **Check for missing files**: Ensure you have the following structure:
   ```
   employwise/
   ├── public/
   │   └── index.html
   ├── src/
   │   ├── components/
   │   ├── App.js
   │   └── index.js
   ├── package.json
   └── README.md
   ```

5. **Environment Variables**: Create a `.env` file in the root with:
   ```
   REACT_APP_API_URL=https://reqres.in
   ```

### Deployment

To create a production build, run:

```bash
npm run build
```

Deploy the generated `build` folder to your hosting provider.

---

## API Endpoints

The application integrates with the following Reqres API endpoints:

- **Login:** POST `/api/login`
- **Fetch Users:** GET `/api/users?page=1`
- **Get Single User:** GET `/api/users/{id}`
- **Update User:** PUT `/api/users/{id}`
- **Delete User:** DELETE `/api/users/{id}`

---

## Login Credentials

Use the following credentials for testing:

- **Email:** eve.holt@reqres.in  
- **Password:** cityslicka

---

## Additional Notes

- Upon a successful login, a token is stored in local storage. If the token is absent, the user is automatically redirected to the login page.
- **Bonus:** Client-side search and pagination features have been implemented to enhance user experience.

---

## Hosting

You can host this application on any free platform (e.g., Heroku, Netlify). Once hosted, add the live link to this README.

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
