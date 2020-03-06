export const getState = (req: any, res: any) => {
    console.log('Query : ', req.query)
        if (typeof(req.query.full)!=='undefined') {
            if (global.cachedClient) {
                res.json(global.emberClientStore)
            } else {
                res.send('a full request is only available in cached mode')
            }
        } else if (typeof(req.query.path) !== 'undefined') {
            global.emberClientConnection.updatePath(req.query.path)
            .then((node: any)=>{
                res.json(node)
            })
        }
}