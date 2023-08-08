# Income-Expense-Tracker-App

Income-Expense-Tracker project has been made with Express.js and MySQL database. This Web-application contains features like:





- User can Login and Sign-up with token generating using jsonweb token library for the Authentication purpose
- User can add, remove and edit expense/income details of their own only, because of Authentication provided.
- Integrated Razorpay Payment Gateway system to give users, the advantage of Premium features
- Premium-Membership features includes download the pdf of expense/incomes report, added Leaderboard Table to see Balance money of other users


## Tech Stack

**Frontend:** HTML, CSS, Javascript

**Backend:** Node, Express

**Database:** MySQL, AWS RDS

**Libraries:** Bcrypt, Aws-sdk, uuid, http, dotenv

**Cloud System:** EC2 instance, S3-Bucket, Nginx, Jenkins




## To Run Application Locally



```bash
  $ git clone https://github.com/kaayush163/Income-Expense-Tracker-App.git
```
```bash
  $ cd Income-Expense-Tracker-App
```
```bash
  $ npm i
```
```bash
  $ Change Database Username and Password in util/database.js file
```
```bash
  $ npm start
```
