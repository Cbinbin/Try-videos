# Try-videos
The task is about the operation of the video

补充:
该项目需与 mongodb 连接
>
该项目还未完善,没添加token认证,暂时试用
# 注册
### 先手机号注册
    POST   http://localhost:1103/reg/phone
>
    {
        "phonenumber" : ${phonenumber}    //号码(Number,首位不能为零)
    }
### 接着注册账号密码
    POST   http://localhost:1103/reg/user/:_id    //_id必需为上面注册后返回的id
>
    {
        "username" : ${username},    //账号(String)
        "userpassword" : ${userpassword}    //密码(String)
    }
### 删除账号密码
    DELETE   http://localhost:1103/reg/user/:_id

# 登入登出
### 登录
    POST   http://localhost:1103/login
>
    {
        "username" : ${username},    //账号(String)
        "userpassword" : ${userpassword}    //密码(String)
    }
    >> {"token" = ${token}}    //返回token的值
### 登出
    DELETE   http://localhost:1103/login

# 头像
### 上传图片
    POST   http://localhost:1103/users/image/:id    /_id需为手机注册后返回的id/
    
    //文件将保存在项目public/images中,以url保存入数据库
    //注意 key : {photofile}
### 删除头像
    DELETE   http://localhost:1103/users/image/:id
    
    //删除即连同文件,不可恢复

# 支付密码
### 设置密码
    POST   http://localhost:1103/users/payword/:_id    /_id需为手机注册后返回的id/
>
    {
        "paypassword" : ${paypassword}    //密码(String)
    }
### 删除密码
    DELETE   http://localhost:1103/users/payword/:_id
    
    >> {status: 'delete'}

# 视频
### 上传视频
    POST   http://localhost:1103/users/video    //文件将保存在项目public/videos中,以url保存入数据库
    //注意 key : {videofile} 
### 删除视频
    DELETE   http://localhost:1103/users/video/:_id    /_id为上传视频的id,不是手机id/
    //方式同'头像'一样
    
### 设置视频信息
    POST   http://localhost:1103/users/video/detail/:_id    /_id为上传视频的id,不是手机id/
>
    {
        "uploader" : ${uploader},        //上传者(string)
        "title" : ${title},              //标题(string)
        "introduction" : ${introduction}, //简介(string)
        "price" : ${price},              //价格(Number)
        "paidppnumber" : ${paidppnumber}, //付款人数(Number)
        "concernednumber" : ${concernednumber} //收藏人数(Number)
    }
### 删除信息
    DELETE   http://localhost:1103/users/video/detail/:_id
