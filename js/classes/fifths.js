class Fifths {
  static circle(index) {
    var uno = "1";
    let notes = "FCGDAEB".split("");
    let res = notes;
    if (index < 0) {
      uno = "-1";
      res = notes.reverse();
    }

    return res.splice(0, Math.abs(index)).map((x) => x + uno);
  }
}

// console.log(Fifths.circle(-3))
// console.log(Fifths.circle(3))
