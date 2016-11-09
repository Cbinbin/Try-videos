module.exports = {
	"login_api" : "http://localhost:1103/login",   //登录，登出
	"regphone_api" : "http://localhost:1103/reg/phone",   //注册,查看手机号
	"phone_api" : "http://localhost:1103/reg/phone/:_id",   //删除手机号(_id为手机号id)
	"reguser_api" : "http://localhost:1103/reg/user/:_id",   //注册和删除账号密码(_id为手机号id)
	"image_api" : "http://localhost:1103/users/image/:_id",   //设置，获取，删除头像(_id为手机号id)
	"payword_api" : "http://localhost:1103/users/payword/:_id",   //设置，获取，删除支付密码(_id为手机号id)
	"usersvideo_api" : "http://localhost:1103/users/video/",   //上传视频
	"video_api" : "http://localhost:1103/users/video/:_id",   //获取，删除视频(_id为视频id)
	"detail_api" : "http://localhost:1103/users/video/detail/:_id"   //上传，获取，删除视频详情(_id为视频id)
}