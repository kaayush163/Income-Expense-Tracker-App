# Income-Expense-Tracker-App

Income-Expense-Tracker project has been made with Express.js and MySQL database. This Web-application contains features like:
 1. User can Login and Sign-up with token generating using jsonweb token library for the Authentication purpose
 2. User can add, remove and edit expense/income details of their own only, because of Authentication provided.
 3. Integrated Razorpay Payment Gateway system to give users, the advantage of Premium features
 4. Premium-Membership features includes download the pdf of expense/incomes report, added Leaderboard Table to see Balance money of other users

Requirements
 1. Node.js and Express.js
 2. MySQL
 3. AWS S3, RDS,EC2 
    
Setup to run the Project on VS Code(Git Bash Terminal)
  1. $ git clone https://github.com/kaayush163/Income-Expense-Tracker-App.git
  2. $ cd Income-Expense-Tracker-App   
  3. $ npm i
  4. $ Change Database Username and Password in util/database.js file
  5. $ npm start   (here The app starts!!!)
