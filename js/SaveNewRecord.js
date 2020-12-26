// Get a reference to the database service
var database = firebase.database();
// Get a reference to the storage service, which is used to create references in your storage bucket
var storage = firebase.storage();
// Create a storage reference from our storage service
var storageRef = storage.ref();

// Create a child reference
//var imagesRef = storageRef.child('images');
// imagesRef now points to 'images'

// Child references can also take paths delimited by '/'
//var spaceRef = storageRef.child('images/space.jpg');
// spaceRef now points to "images/space.jpg"
// imagesRef still points to "images"

//.ref().child("Data");
// var data=[]
// database.on("value", (snap) => data=snap.val());

var logo = null;
var name = null;
var url = null;
var author = null;
var project_name = null;
var summary = null;
//form element
var form = document.getElementById("addForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  swal({
    title: "Please Wait",
    text: "Uploading your Data......",

    showCancelButton: false,
    showConfirmButton: false,
  });
  // File or Blob named mountains.jpg
  var file = logo;

  // Upload file and metadata to the object 'images/mountains.jpg'
  var uploadTask = storageRef.child("Logos/" + file.name).put(file);

  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(
    firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    function (snapshot) {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log("Upload is paused");
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log("Upload is running");
          break;
      }
    },
    function (error) {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case "storage/unauthorized":
          // User doesn't have permission to access the object
          break;

        case "storage/canceled":
          // User canceled the upload
          break;

        case "storage/unknown":
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    },
    function () {
      // Upload completed successfully, now we can get the download URL
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        console.log("runing");

        var finalData = {
          u_id: create_UUID(),
          logo: downloadURL,
          name: name,
          url: url,
          date: curday("/"),
          author: author,
          project_name: project_name,
          summary: summary,
        };
        database.ref("Data/" + finalData.u_id).set(finalData);
        swal("Success!", "data has been added", "success");
      });
    }
  );
});
//current date
var curday = function (sp) {
  today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //As January is 0.
  var yyyy = today.getFullYear();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  return mm + sp + dd + sp + yyyy;
};
//create a unique i for each record
function create_UUID() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}
//handle image
document.getElementById("file").addEventListener("change", (e) => {
  logo = e.target.files[0];
  console.log(logo);
});

//handle name
document.getElementById("name").addEventListener("change", (e) => {
  name = e.target.value;
});

//handle url
document.getElementById("url").addEventListener("change", (e) => {
  url = e.target.value;
});

//handle author
document.getElementById("author").addEventListener("change", (e) => {
  author = e.target.value;
});

//handle project
document.getElementById("problemtitle").addEventListener("change", (e) => {
  project_name = e.target.value;
});

//handle summary
document.getElementById("summary").addEventListener("change", (e) => {
  summary = e.target.value;
});
