// Description:
//   This is a bot for mthor test report
require("babel-core").transform("code", {
  presets: ["es2017"]
});

var match;
var isAndroid;
var isIOS;

module.exports = (robot) => {

  robot.listen(
    (message)=> {
      match = false;
      isAndroid = false;
      isIOS = false;

      let msg_text = message.text;
      console.log(msg_text);
      console.log("room" + message.room);
      if (msg_text == "show iOS report") {
        match = true;
        isIOS = true;
        console.log(message.room);
      } else if (msg_text == "show Android report") {
        match = true;
        isAndroid = true;
        console.log(message.room);
      }

      return match;
    },
    (response)=> {
      var url = "";
      var date, totalNum, passNum, failNum, skipNum;

      if (isIOS) {
        url = "http://localhost:3000/updateReport/ios"
      } else if (isAndroid) {
        url = "http://localhost:3000/updateReport/android"
      }

      console.log(url);

      new Promise(function (resolve, reject) {
        robot.http(url).header('Accept', 'application/json')
          .header('Content-Type', 'application/json')
          .post()((err, res, body) => {
          if (err) {
            console.log("Encountered an error: " + err.toString());
          } else {
            var jsn = JSON.parse(body);
            date = jsn.date;
            totalNum = jsn.total;
            passNum = jsn.pass;
            failNum = jsn.fail;
            skipNum = jsn.skip;
            resolve([date, totalNum, passNum, failNum, skipNum]);
          }
        })
      }).then(function (result) {
          response.reply("test result:\n" + "Total:" + totalNum + ", Pass:" + passNum + ", Failed:" + failNum + ", Skipped:" + skipNum +
            "\n" + "https://docs.google.com/spreadsheets/d/1NGYcuLf88AYvf7HnMklLDq_jx4zYcjjgp4x1w73wYew/edit#gid=0");
        })
    }
  )
}


