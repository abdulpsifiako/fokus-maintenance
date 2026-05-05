require('@dotenvx/dotenvx').config()
const express = require('express')
const app = express()
const port = process.env.PORT
const routes = require('./routes/index')
const morgan = require('morgan')
const { default: helmet } = require('helmet')
const bodyParser = require('body-parser')
const cors = require('cors')
const conndb = require('./configs/database')

app.use(express.json({ limit: '300mb' }));
app.use(express.urlencoded({ limit: '300mb', extended: true }));
app.use(cors())
app.use(morgan('common'))
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}))
app.use(bodyParser.json())

app.use('/api', routes)

conndb.initialize().then(()=>{
    const server = app.listen(port, ()=>{
        console.log("✅ Database Connected")
        console.log("🚀 Server ready on port", port)
    })

    // ⏱️ Tambahkan ini untuk mencegah timeout Node.js
    server.timeout = 0
    server.keepAliveTimeout = 0
}).catch((error)=>{
    console.log("Error database", error)
})
