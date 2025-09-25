const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { auth } = require('./middleware/auth')
const { User } = require('./models/User');

// const config = require('./config/key');
// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// application/jsaon
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://hwkim:IXsWKkc8okubA1mZ@cluster2.k1zt5ei.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2', {
}).then(() => console.log('MongoDB Connected..'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello2'))

app.get('/api/hello', (req, res) => {
  res.send("Hello");
})


app.post('/api/users/register', async (req, res) => {
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

app.post('/api/users/login', async (req, res) => {
    try {
        // 1. 요청된 이메일을 DB에서 찾기
        const user = await User.findOne({ email: req.body.email });
        
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "해당하는 유저가 없습니다."
            });
        }

        // 2. Password가 맞는지 확인
        const isMatch = await user.comparePassword(req.body.password); // 'Password' → 'password' 수정
        
        if (!isMatch) {
            return res.json({ 
                loginSuccess: false, 
                message: "패스워드가 틀렸습니다." 
            });
        }

        // 3. 비밀번호가 같다면 Token 생성
        const tokenUser = await user.genToken();
        
        // 4. 토큰 저장
        res.cookie("x_auth", tokenUser.token)
           .status(200)
           .json({ 
               loginSuccess: true, 
               userId: tokenUser._id 
           });
           
    } catch (err) {
        return res.status(400).json({ 
            loginSuccess: false, 
            message: err.message 
        });
    }
});


app.get('/api/users/auth', auth, (req, res) => {
    // Auth가 True
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth : true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { token: "" }
    );

    return res.status(200).send({ success: true });
  } catch (err) {
    return res.json({ success: false, err });
  }
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))