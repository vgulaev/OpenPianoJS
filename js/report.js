function fillReport() {
  //var body = document.getElementById("body");
  var body = document.getElementById("tBody");
  var d = {};
  for (var i = 0; i < localStorage.length; i++){
    var key = localStorage.key(i);
    var a = "";
    if ("k" == key[key.length - 1]) {
      a = key.substring(key.length - 1);
      key = key.substring(0, key.length - 2);
    } else if ("s" == key[key.length - 1]) {
      a = key.substring(key.length - 2);
      key = key.substring(0, key.length - 3);
    }
    key = key.split("-").map((x) => {return x.length == 1 ? "0"+x : x}).join("-");
    if (d[key] == undefined) {
      d[key] = {};
    }
    d[key][a] = localStorage.getItem(localStorage.key(i));
  }
  function addSubTotalRow(subTotal) {
    var el = document.createElement("div");
    el.classList.add('divTableRow');
    let minute = (subTotal/1000/60 % 60).toFixed(0);
    let hour = subTotal/1000/60/60;
    el.innerHTML = `<div class="divTableCell">Total:</div>
        <div class="divTableCell">${hour.toFixed(0)} h ${minute} m</div>
        <div class="divTableCell"></div>
        <div class="divTableCell"></div>`;
    body.append(el);
  }
  //var dd = Object
  var total_hour = 0;
  var monthTotal = 0;
  var curMonth = undefined;
  Object.keys(d).sort().forEach( function (x) {
    if (curMonth != x.substring(0, 7)){
      if (curMonth != undefined) addSubTotalRow(monthTotal);
      monthTotal = 0;
      curMonth = x.substring(0, 7);
    }

    var el = document.createElement("div");
    el.classList.add('divTableRow');
    let minute = parseInt(d[x]['ms']);
    total_hour += minute;
    monthTotal += minute;
    //el.innerHTML = `<span>${x}==<span><span>${d[x]["k"]}<span>`;
    el.innerHTML = `<div class="divTableCell">${x}</div>
        <div class="divTableCell">${(d[x]['ms']/1000/60).toFixed(0)}</div>
        <div class="divTableCell">${d[x]['k']}</div>
        <div class="divTableCell">${(d[x]['k']/d[x]['ms'] * 1000 * 60).toFixed(1)}</div>`;
    body.append(el);
  })
  addSubTotalRow(monthTotal);
  var el = document.createElement("div");
  el.classList.add('divTableRow');
  minute = (total_hour/1000/60 % 60).toFixed(0);
  total_hour = total_hour/1000/60/60;

  el.innerHTML = `<div class="divTableCell">Total:</div>
      <div class="divTableCell">${total_hour.toFixed(0)} h ${minute} m</div>
      <div class="divTableCell"></div>
      <div class="divTableCell"></div>`;
  body.append(el);
}

window.addEventListener("load", async function( event ) {
  fillReport();
});
