// config is an object with envrionemment variables to run the application

module.exports = {
    ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
    URL: process.env.BASE_URL || 'http://localhost:3000',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://discaz:dominici@cluster0-yysnc.gcp.mongodb.net/test?retryWrites=true&w=majority',
    JWT_SECRET: process.env.JWT_SECRET || 'monsecret'
}