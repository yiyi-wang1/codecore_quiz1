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

## Page Display
<img width="750" alt="Screen Shot 2022-07-05 at 4 04 39 PM" src="https://user-images.githubusercontent.com/90237052/177431380-cd506fbd-371e-4293-96e6-199b5a454eff.png">

<img width="750" alt="Screen Shot 2022-07-05 at 4 04 59 PM" src="https://user-images.githubusercontent.com/90237052/177431390-857d7369-c93d-45c3-a1de-d23d2e8f6060.png">
