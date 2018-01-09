class Rectangle {
    // constructor
    constructor () {
    
    }
    
    // Getter
    static area () {
        //通过 new this() 来调用类的实例方法,
        let a = new this()
        let newNum = a.calcArea(5)
        console.log('面积 area', newNum)
        console.log('static jisuan', this.jisuan())
        //return this.calcArea()
    }
    
    static jisuan () {
        console.log('静态计算')
        //return this.calcArea()
    }
    
    // Method
    calcArea (num) {
        let sq = num * num
        console.log('实例方法', sq)
        return sq
    }
}

//const square = new Rectangle(10, 10);

//console.log(Rectangle.area());

var path = require('path')

path.resolve(__dirname, '..')

console.log('__dirname', __filename, module.filename)

let testReadFile = function () {
    fs.readFile(avatarFile.path, function (err, data) {
        fs.writeFile(des_file, data, (err) => {
            fs.unlink(avatarFile.path, async function (e) {
                let avatar = des_file.split('/public')[1]
                let doc = await userMongo.update({user_id: user_id}, {avatar: avatar})
                let msg = resMsg({avatar: avatar}, '文件上传成功')
                return msg
            })
        })
    })
}