import mongoose from 'mongoose'

(
  function () {
    mongoose.connect(process.env.CONNECT_DB!)
      .then(() => console.log('BD conectado'))
      .catch(err => console.error('error en la coneccion de la BD. ' + err))
  }  
)()
