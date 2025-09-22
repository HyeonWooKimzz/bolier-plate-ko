const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://hwkim:IXsWKkc8okubA1mZ@cluster2.k1zt5ei.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2', {
}).then(() => console.log('MongoDB Connected..'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello'))

app.listen(port, () => console.log(`Example ${port}`))
