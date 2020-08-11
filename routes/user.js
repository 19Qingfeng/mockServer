const router = require('koa-router')()
const Mock = require('mockjs')

router.prefix('/user') //路由路径

//ctx.params 路由传值
//ctx.query  参数传值
//ctx.request.body Post参数

//people
const mockPeople = Mock.mock({
    'peoples|5000': [{
        'id|+1': 1,
        'guid': '@guid',
        'name': '@cname',
        'age': '@integer(20, 50)',
        'birthday': '@date("MM-dd")',
        'address': '@county(true)',
        'email': '@email',
    }]
});
router.get('/people', async (ctx, next) => {
    ctx.body = ctx.query['id'] ? mockPeople['peoples'][ctx.query['id'] - 1] : mockPeople['peoples']
})

router.get('/people/:id', async (ctx, next) => {
    ctx.body = mockPeople['peoples'][ctx.params['id'] - 1]
})

router.post('/people', async (ctx, next) => {
    let postData = ctx.request.body
    let id = postData.id ? postData.id : 1
    ctx.body = mockPeople['peoples'][id - 1]
})

module.exports = router