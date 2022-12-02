const { Router } = require('express')
const router = Router();

//RUTAS
router.get('/', (req, res) =>{
    res.json({
        message: 'ok'
    })
})

router.post('/', (req, res)=>{
    console.log(req.body);
    res.json({
        message: 'received'
    })
})

module.exports = router;