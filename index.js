const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');

const config = require('./config/key');
const { User } = require('./models/User');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extend: true}));

// application/json
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
}).then(() => console.log('MongoDB Connected..'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello2'))

app.post('/register', async (req, res) => {
    // 회원가입 시 필요한 정보들을 Client에서 가져오면
    // DB에 넣어줌
    try {
        const user = new User(req.body)
        await user.save()
        return res.status(200).json({ success: true})
    } catch (err) {
        return res.status(400).json({ success: false, err})
    }
})



app.listen(port, () => console.log(`Example ${port}`))
