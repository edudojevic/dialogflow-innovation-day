const { createApp } = require("./express");

createApp().listen(3000, () => {
  console.log('listening on localhost:3000')
});
