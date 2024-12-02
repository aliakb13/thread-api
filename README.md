# Threads API 💬📝🗒️

This API was created to fulfill the submission to the dicoding back-end expert. You can create a thread, leave comments on the thread and reply to comments. The service is built following clean architecture standards and 100% test coverage.

## Authors 👨‍💻

- [@Muhammad Ali Akbar](https://github.com/aliakb13)

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

**Note: this configure for testing purpose, always make sure that you create testing db that different from env**

- Create config folder on root folder
- Create database folder on config
- Create **test.json** file

```bash
on test.json:

{
  "user": your testing db user,
  "password": your testing db password,
  "host": your testing db host,
  "port": your testing db port,
  "database": your testing db name
}
```

### 6. Migrate the database:

```bash
npm run migrate up (for real db)
and
npm run migrate:test up (for testing db)
```

### 7. (Optional) Test the service:

```bash
npm run test
or
npm run test:watch (recommended)
```

### 8. Run the application:

```bash
npm run dev
or
npm run start:dev (nodemon)
```

## API Reference

### 1. Thread Endpoint

#### - Create New Thread (Restrictred)

```http
  POST /threads
```

---

#### - Get Detail Thread

```http
  GET /threads/{threadId}
```

| Parameter  | Type     | Description                               |
| :--------- | :------- | :---------------------------------------- |
| `threadId` | `string` | **Required**. thread Id you want to fetch |

---

### 2. Comment Endpoint

#### - Create New Comment (Restrictred)

```http
  POST /threads/{threadId}/comments
```

| Parameter  | Type     | Description                                            |
| :--------- | :------- | :----------------------------------------------------- |
| `threadId` | `string` | **Required**. thread Id you want to insert the comment |

**payload:**

```bash
{
  content:
}
```

---

#### - Delete The Comment (Restricted Only Owner)

```http
DELETE /threads/{threadId}/comments/{commentId}
```

| Parameter   | Type     | Description                                   |
| :---------- | :------- | :-------------------------------------------- |
| `threadId`  | `string` | **Required**. thread id where your comment is |
| `commentId` | `string` | **Required**. comment id you want to delete   |

---

### 3. Reply Endpoint

#### - Create The Reply on Comment (Restrictred)

```http
POST /threads/{threadId}/comments/{commentId}/replies
```

| Parameter   | Type     | Description                                           |
| :---------- | :------- | :---------------------------------------------------- |
| `threadId`  | `string` | **Required**. thread id where your comment is         |
| `commentId` | `string` | **Required**. comment id you want to insert the reply |

**payload:**

```bash
{
  content:
}
```

---

#### - Delete The reply From Comment (Restrictred Only Owner)

```http
DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}
```

| Parameter   | Type     | Description                                           |
| :---------- | :------- | :---------------------------------------------------- |
| `threadId`  | `string` | **Required**. thread id where your comment is         |
| `commentId` | `string` | **Required**. comment id you want to insert the reply |
| `replyId`   | `string` | **Required**. reply id you want to delete             |

---
