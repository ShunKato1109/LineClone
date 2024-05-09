const path = require('path');

module.exports = {
    // アプリのエントリーポイント
    entry:'/src/index.js',


    // 出力されるファイルの設定
    output:{
        path:path.resolve(__dirname,'dist'),
        fileName:'bundle.js'
    },

    // モジュール設定
    module:{
        rules:[
            {
                test:/\.js/,
                exclude:/node_modules/,
                use:{
                    loader:'babel-loader',
                    options:{
                        preset:['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            }
        ]
    },

    // 開発サーバーの設定
    devServer:{
        contentBase:path.join(__dirname,'dist'),
        compress:true,
        port:9000
    }

};