## Installation

1. Clone the repo 
```
git clone https://github.com/yiyi-wang1/codecore_quiz1.git
```

2. install NPM package
```
npm install
```

3. create database 
```
createdb --echo cluckr
```

4. create table and generate test data, run the following
```
knex migrate:latest
knex seed:run
```


5. start the application, run the following, see the web running on http://localhost:3000 on your browser
```
npm start
```