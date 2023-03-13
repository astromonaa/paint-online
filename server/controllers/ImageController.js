const fs = require('fs')
const path = require('path')

class ImageController {
  saveCanvas(req, res) {
    try {
      const data = req.body.img.replace('data:image/png;base64,', '')
      fs.writeFileSync(path.resolve(__dirname, '../', 'files', `${req.query.id}.jpg`), data, 'base64')
      return res.status(200).json('success')
    }catch(e) {
      console.log(e);
      return res.status(500).json('error')
    }
  }

  getCanvas(req, res) {
    try {
      const file = fs.readFileSync(path.resolve(__dirname, '../', 'files', `${req.query.id}.jpg`))
      const data = `data:image/png;base64,${file.toString('base64')}`
      res.json(data)
    }catch(e) {
      console.log(e);
      return res.status(500).json('error')
    }
  }
}

module.exports = new ImageController()