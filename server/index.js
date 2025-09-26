const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { auth } = require('./middleware/auth');
const { User } = require('./models/User');
const { Board } = require('./models/Board');

const app = express();
const port = 5000;

// MongoDB 연결
mongoose.connect(
  'mongodb+srv://hwkim:IXsWKkc8okubA1mZ@cluster2.k1zt5ei.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2'
).then(() => console.log('✅ MongoDB Connected'))
 .catch(err => console.error('❌ MongoDB Error:', err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());


// ===================================
// 👤 User 관련 API
// ===================================

// 회원가입
app.post('/api/users/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ success: false, err });
  }
});

// 로그인
app.post('/api/users/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    
    if (!user) {
      return res.json({ loginSuccess: false, message: '해당 유저가 없습니다.' });
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      return res.json({ loginSuccess: false, message: '비밀번호가 틀렸습니다.' });
    }

    const tokenUser = await user.genToken();
    res.cookie("x_auth", tokenUser.token)
       .status(200)
       .json({ loginSuccess: true, userId: tokenUser._id });
       
  } catch (err) {
    return res.status(400).json({ loginSuccess: false, message: err.message });
  }
});

// 인증 확인
app.get('/api/users/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role !== 0,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  })
  ;
});

// 로그아웃
app.get('/api/users/logout', auth, async (req, res) => {
  try {
    await User.findOneAndUpdate({ _id: req.user._id }, { token: "" });
    return res.status(200).send({ success: true });
  } catch (err) {
    return res.json({ success: false, err });
  }
});


// ===================================
// 📋 게시판 관련 API
// ===================================

// 글 목록 조회
app.get('/api/boards', async (req, res) => {
  try {
    const boards = await Board.find().sort({ createdAt: -1 });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ error: '서버 오류' });
  }
});

// 글 작성
app.post('/api/boards', auth, async (req, res) => {
  const { title, content } = req.body;
  const userName = req.user.name;

  try {
    const newBoard = new Board({ title, content, writer: userName });
    await newBoard.save();
    res.status(201).json(newBoard);
  } catch (err) {
    res.status(500).json({ error: '생성 실패' });
  }
});


// 글 상세 조회
app.get('/api/boards/:id', async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ error: '글 없음' });

    res.json(board);
  } catch (err) {
    res.status(500).json({ error: '서버 오류' });
  }
});

// 글 삭제
app.delete('/api/boards/:id', auth, async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ error: '글 없음' });

    const isAuthor = board.writer === req.user.name;
    const isAdmin = req.user.role === 1;

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ error: '삭제 권한이 없습니다.' });
    }
    
    await Board.findByIdAndDelete(req.params.id);
    res.json({ message: '삭제 성공' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 글 수정
app.put('/api/boards/:id', auth, async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ error: '글 없음' });

    const isAuthor = board.writer === req.user.name;
    const isAdmin = req.user.role === 1;

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ error: '수정 권한이 없습니다.' });
    }

    const { title, content } = req.body;
    board.title = title;
    board.content = content;

    await board.save();
    res.json(board);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류' });
  }
});



// ===================================
// 서버 실행
// ===================================
app.listen(port, () => {
  console.log(`🚀 Server listening at http://localhost:${port}`);
});
