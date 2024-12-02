# Threads API 💬📝🗒️

This API was created to fulfill the submission to the dicoding back-end expert. You can create a thread, leave comments on the thread and reply to comments. The service is built following clean architecture standards and 100% test coverage.

## Authors 👨‍💻

- [@Muhammad Ali Akbar](https://github.com/aliakb13)

## Table of Contents 📜

- [Features](#features)
- [Tech Stack](#technologies-used)
- [How to run](#howtorun)

## How to run 🔨

### 1. Clone the repository:

```bash
git clone https://github.com/aliakb13/thread-api.git
```

### 2. Navigate to the project directory:

```bash
cd thread-api
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Set up Environment Variables

Create a .env file in the root directory and add the required environment variables. Or you can just change the .env.example in root folder of the project

### 5. Create config/database on root folder

Make sure you follow this structure and then create something like "test.json". This folder contain configure for testing database. So always make sure you created it on root project.

### 6. Run the application:

```bash
npm run dev
or
npm run start:dev (nodemon)
```

## API Reference

#### Create new thread (Restrictred)

```http
  POST /threads
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get item

```http
  GET /api/items/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### add(num1, num2)

Takes two numbers and returns the sum.
