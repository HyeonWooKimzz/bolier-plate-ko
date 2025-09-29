const multer = require('multer');
const path = require('path');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { auth } = require('./middleware/auth');
const { User } = require('./models/User');
const { Board } = require('./models/Board');

const app = express();
const port = 5000;

// cors 설정
const cors = require('cors');
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));


// MongoDB 연결
const config = require('./config/key');
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Error:', err));

// ===================================
// 파일 업로드 기능
// ===================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, basename + '-' + Date.now() + ext);
  }
});
const upload = multer({
  storage: storage,
  limits: { filesize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('이미지만 업로드 가능합니다.'))
    }
  }
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// uploads 폴더를 정적 폴더로 지정
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
    res.cookie("x_auth", tokenUser.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false
    })
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
    isAdmin: req.user.role === 1, // boolean, !== 0 이면 True
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
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
app.post('/api/boards', auth, upload.single('file'), async (req, res) => {
  try{
    const { title, content } = req.body;
    const userName = req.user.name;

    let fileInfo = null;
    if (req.file) {
      fileInfo = {
        filename: req.file.filename,
        originalname: req.file.originalname,
        path: req.file.path.replace(/\\/g, "/")
      };
    }

    const newBoard = new Board({
      title,
      content,
      writer: userName,
      file: fileInfo,
    });

    await newBoard.save();
    res.status(201).json(newBoard);
  } catch (err) {
    console.error(err);
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
// 영상 스트리밍
// ===================================
app.get('/api/videos', (req, res) => {
  const dirPath = path.join(__dirname, 'video');

  fs.readdir(dirPath, (err, files) => {
    if (err) return res.status(500).json({ error: '폴더를 읽을 수 없습니다.' });

    // mp4 파일만 필터링
    const videos = files.filter(file => file.endsWith('.mp4'));
    res.json(videos);
  });
});

// 영상 스트리밍
app.get('/api/videos/stream/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'video', req.params.filename);

  fs.stat(filePath, (err, stats) => {
    if (err) return res.status(404).json({ error: '파일 없음' });

    const range = req.headers.range;
    if (!range) return res.status(400).send("Requires Range Header");

    const videoSize = stats.size;
    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);
    const stream = fs.createReadStream(filePath, { start, end });
    stream.pipe(res);
  });
});


// ===================================
// 서버 실행
// ===================================
app.listen(port, () => {
  console.log(`🚀 Server listening at http://localhost:${port}`);
});
