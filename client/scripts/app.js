var $chats;
var $rooms;

var app = {};
app.username;
app.server = 'https://api.parse.com/1/classes/chatterbox';
app.init = function() {
  $chats = $('div#chats');
  $rooms = $('select#roomSelect');
  app.username = window.location.search.split('=')[1];
  $('span.username').on('click', function(event) {
    app.addFriend(event.target.innerText);
  });
  $('form').on('submit', app.handleSubmit);
  app.fetch();
  $('select').on('change', function(event) {
    app.currentRoom = $('select').val();
  });
  $chats.on('click', function(event) {
    var $target = $(event.target);
    if ($target.hasClass('username')) {
      app.addFriend($target.text());
    }
  });
};
app.clearMessages = function() {
  $chats.empty();
};
app.currentRoom = 'All';
app.addMessage = function(message) {
  message.username = _.escape(message.username);
  message.text = _.escape(message.text);
  message.roomname = _.escape(message.roomname);
  if (app.rooms.indexOf(message.roomname) === -1) {
    app.addRoom(message.roomname);
  }
  if (app.currentRoom !== 'All') {
    if (message.roomname === app.currentRoom) {
      app.displayMessage(message);
    }
  } else {
    app.displayMessage(message);
  }
};
app.displayMessage = function(message) {
  var $current = $('<div class="message"><span class="username">' +
    message.username + '</span>: <span class="text">' + message.text + '</span></div>');
  if (app.friends.indexOf(message.username) !== -1) {
    $current.css('font-weight', 'bold');
  }
  $chats.append($current);
};

app.rooms = [];
app.addRoom = function(room) {
  room = _.escape(room);
  if (app.rooms.indexOf(room) === -1) {
    app.rooms.push(room);
    $rooms.append('<option value =' + room + '>' + room + '</option>');
  }
};

app.friends = [];
app.addFriend = function(username) {
  app.friends.push(username);
};

var post = {};
post.url = app.server;
post.type = 'POST';
post.success = function(data) {
  // Do something? Nah.
};
post.contentType = 'application/json';

app.send = function(message) {
  post.data = JSON.stringify(message);
  $.ajax(post);
};

app.get = {};
app.get.url = app.server;
app.get.type = 'GET';
app.get.success = function(data) {
  app.clearMessages();
  data = data.results; // cast object return to an array length 100
  for (var i = 0; i < data.length; i++) {
    app.addMessage(data[i]);
  } // end for (iterate through data array)
};
app.get.contentType = 'application/jsonp';
app.get.data = 'order=-createdAt';

app.fetch = function() {
  $.ajax(app.get);
  setTimeout(app.fetch, 2000);
};

app.handleSubmit = function(event) {
  event.preventDefault(); // prevent the button from reloading the page
  var message = {};
  message.username = app.username;
  message.text = $('#message').val();
  message.roomname = $('select').val();

  app.send(message);
};

$(function() {
  app.init();
});


// GLOBAL

var testMessage = {};
testMessage.username = 'Grover Cleveland';
testMessage.text = 'I\'m not even sure which President I am.';
testMessage.roomname = 'lobby';
