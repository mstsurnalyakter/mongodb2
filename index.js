require('dotenv').config();
const {app,connectDB} = require('./app');
const PORT = process.env.PORT ||8000;

app.listen(PORT,async ()=>{
    console.log(`Server is runnint at http://localhost:${PORT}`);
    await connectDB();
})