const db = require('../util/database');

module.exports = class Pengguna {
  constructor (nik,username,nama,peran,password,poin_meja){
    this.nik =nik;
    this.username = username;
    this.nama = nama;
    this.peran =peran;
    this.passsword = poin_meja;
  }
  static fetchAll(){
    return db.execute('SELECT * FROM PENGGUNA');
  }
};
