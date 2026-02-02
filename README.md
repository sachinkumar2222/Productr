# Productr - E-commerce Product Management System

This is a full-stack MERN application for managing products, featuring authentication, image uploads, and email notifications.

## Project Structure

- **Client**: React.js Frontend (Vite)
- **Server**: Node.js & Express Backend

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas Account (for database)
- Cloudinary Account (for image storage)
- Gmail Account (for email notifications)

## 1. Backend Setup

### Installation

1. Navigate to the `Server` directory:
   ```bash
   cd Server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

Create a `.env` file in the `Server` directory with the following variables:

```env
PORT=5000
DATABASE_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary Configuration
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_api_secret

# Email Configuration (Nodemailer with Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
```

### Running the Server

- To start the server in production mode:
  ```bash
  npm start
  ```
- To start the server in development mode (with nodemon):
  ```bash
  npm run dev
  ```

The server will run on `http://localhost:5000` by default.

## 2. Frontend Setup

### Installation

1. Navigate to the `Client` directory:
   ```bash
   cd Client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

The frontend is currently configured to connect to `http://localhost:5000/api`. If you change the backend port, ensure you update `src/api/apiClient.js`.

### Running the Client

Start the development server:

```bash
npm run dev
```

The application will typically run on `http://localhost:5173` (check the terminal output).

## 3. Usage

1. Start both the Backend and Frontend servers.
2. Open your browser and navigate to the frontend URL.
3. Login using your email to receive an OTP.
4. Verify OTP to access the dashboard.
