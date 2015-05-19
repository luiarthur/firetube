//var ref = new Firebase('https://firetube.firebaseio.com/comments');
var ref = new Firebase('https://luiarthur-comments.firebaseio.com/comments');
var myUserID = null;
var myName = null;

//Create an Firebase Simple Login client so we can do Facebook auth
ref.onAuth(function(authData) {
  if (authData) {
    console.log(authData.facebook.id);
    myUserID = authData.facebook.id;
    myName = authData.facebook.displayName;
    $("#loginDiv").text(authData.facebook.displayName);
    var src = "https://graph.facebook.com/"+myUserID+"/picture";
    $("#uimg").attr("src",src);
  }
});

//Create a query for only the last 4 comments
var last4Comments = ref.limit(4);

//Render Comments
last4Comments.on('child_added', function (snapshot) {
  var comment = snapshot.val();
  var newDiv = $("<div/>").addClass("comment").attr("id",snapshot.name()).appendTo("#comments");
  console.log(comment);
  newDiv.html(Mustache.to_html($('#template').html(), comment));
});

//Add New Comments
function onCommentKeyDown(event) {
  if(event.keyCode == 13) {
    if(myUserID == null) {
      alert("You must log in to leave a comment");
    } else {
      ref.push({userid: myUserID, name: myName, body: $("#text").val()});
      $("#text").val("");
    }
    event.preventDefault();
  }
}

//Remove deleted comments
last4Comments.on("child_removed", function(snapshot) {
  $("#" + snapshot.name()).remove();
});

//Handle Login
function onLoginButtonClicked() {
  ref.authWithOAuthPopup('facebook', function(){});
}
