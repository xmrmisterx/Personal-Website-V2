require('dotenv'). config();

module.exports = {
    plugins: [
        new webpack.DefinePlugin({
          'process.env.APP_URL': JSON.stringify(process.env.APP_URL),
        })
    ],
}