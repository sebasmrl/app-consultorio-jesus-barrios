const fs = require('fs-extra');

const deleteFile = async path => {
  return await fs
    .remove(path)
    .then(() => true)
    .catch(err => {
      console.error(err,"lsllslls");
      return false;
    });
};

module.exports = deleteFile;
