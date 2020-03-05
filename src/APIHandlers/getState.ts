export const getState = (req: any, res: any) => {
    console.log('Query : ', req.query)
        if (typeof(req.query.full)!=='undefined') {
            res.json(global.emberClientStore)
        } else if (typeof(req.query.path) !== 'undefined') {
            global.emberClientConnection.updatePath(req.query.path)
            .then(()=>{
            let pathArray = req.query.path.split('/')
            let test = global.emberClientConnection.getObjectFromArray(global.emberClientStore, pathArray, 0)
            res.json(test)
            })
        }
}