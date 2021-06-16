const db = require('../util/database');

module.exports = class Pengguna {
  constructor (nik , username, nama, peran, password, poin_meja){
      this.nik  = nik ;
      this.username  = username ;
      this.name  = nama;
      this.peran  = peran;
      this.password  = password;
      this.poin_meja = poin_meja;
  }

save(){
  console.log("kedua");
  console.log(this.nik, this.username, this.name, this.peran, this.password, this.poin_meja);

  return db.execute('INSERT INTO PENGGUNA ( NIK, USERNAME, NAMA, PERAN, PASSWORD, POIN_MEJA) VALUES (? , ? , ?, ?, ? , ?)',
    [this.nik, this.username, this.name, this.peran, this.password, this.poin_meja]
  );

}

  static fetchAll(){
    return db.execute('SELECT * FROM PENGGUNA');
  }
};
