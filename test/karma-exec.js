(function closed() {
  var len = interfs.length;
  var i = -1;
  while (++i < len) {
    var interf = interfs[i];
    var tests = interf.debug ? main : mainCore;
    var lenM = tests.length;
    var j = -1;
    while (++j < lenM) {
      tests[j](interf);
    }
  }
})();
