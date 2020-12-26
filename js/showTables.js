var database = firebase.database();
var SelectedRecord = {};
var data = [];
swal({
  title: "Please Wait",
  text: "Loading  Data......",

  showCancelButton: false,
  showConfirmButton: false,
});
database
  .ref()
  .child("Data")
  .on("value", (snap) => {
    data = [];
    snap.forEach((child) => {
      data.push(child.val());
    });
    console.log(data);
    showTable(data);
  });

//creating the elements that are required
var tablebody = document.getElementById("tableBody");
var tr = document.createElement("tr");
var logo_td = document.createElement("td");
logo_td.classList.add("column1");
var logo_img = document.createElement("img");
logo_img.classList.add("logoImage");
logo_td.appendChild(logo_img);
var name_td = document.createElement("td");
name_td.classList.add("column2");
var date_td = document.createElement("td");
date_td.classList.add("column2");
var url_td = document.createElement("td");
url_td.classList.add("column3");
var author_td = document.createElement("td");
author_td.classList.add("column4");
var problem_td = document.createElement("td");
problem_td.classList.add("column5");
var summary_td = document.createElement("td");
summary_td.classList.add("column6");
var summary_td = document.createElement("td");
summary_td.classList.add("column6");
var action_td = document.createElement("td");
action_td.classList.add("column6");
// var Icon = document.createElement("i");

// Icon.classList.add("icon");
// Icon.classList.add("icon-pencil");
// action_td.appendChild(Icon);
function showTable(data) {
  tablebody.innerHTML = "";
  var MainRosContainer = "";
  for (let i = 0; i < data.length; i++) {
    logo_img.src = data[i].logo;
    name_td.innerHTML = data[i].name;
    date_td.innerText = data[i].date;
    url_td.innerText = data[i].url;
    author_td.innerText = data[i].author;
    problem_td.innerText = data[i].project_name;
    summary_td.innerText = data[i].summary;
    var fun = `"EditModal('${data[i].u_id}')"`;
    var Icon = "<i onclick=" + fun + "class=icon-pencil >" + "</i >";
    action_td.innerHTML = Icon;
    tr.appendChild(logo_td);
    tr.appendChild(name_td);
    tr.appendChild(date_td);
    tr.appendChild(url_td);
    tr.appendChild(author_td);
    tr.appendChild(problem_td);
    tr.appendChild(summary_td);
    tr.appendChild(action_td);
    MainRosContainer = MainRosContainer + tr.outerHTML;
  }
  tablebody.innerHTML = MainRosContainer;
  swal.close();
}

//handle Editmodal
function EditModal(u_id) {
  var Record = {};
  for (let i = 0; i < data.length; i++) {
    if (u_id == data[i].u_id) {
      SelectedRecord = data[i];
      Record = data[i];
      break;
    }
  }
  $("#EditDataModal").modal();
  document.getElementById("editLogoImAGE").src = Record.logo;
  document.getElementById("editname").value = Record.name;
  document.getElementById("editurl").value = Record.url;
  document.getElementById("editauthor").value = Record.author;
  document.getElementById("editproblemtitle").value = Record.project_name;
  document.getElementById("editsummary").value = Record.summary;
}

////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////Hnadling the edit procedure////////////////////////////////////////////

var database = firebase.database();

var storage = firebase.storage();

var storageRef = storage.ref();
var Editlogo = null;
//form element
var form = document.getElementById("editform");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  swal({
    title: "Please Wait",
    text: "Updating your data your Data......",

    showCancelButton: false,
    showConfirmButton: false,
  });
  // File or Blob named mountains.jpg
  var file = Editlogo;

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
        SelectedRecord.logo = downloadURL;
        SelectedRecord.date = curday("/");

        database.ref("Data/" + SelectedRecord.u_id).set(SelectedRecord);
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

//handle image
document.getElementById("editfile").addEventListener("change", (e) => {
  Editlogo = e.target.files[0];
  document.getElementById("editLogoImAGE").src = URL.createObjectURL(
    e.target.files[0]
  );
});

//handle name
document.getElementById("editname").addEventListener("change", (e) => {
  SelectedRecord.name = e.target.value;
});

//handle url
document.getElementById("editurl").addEventListener("change", (e) => {
  SelectedRecord.url = e.target.value;
});

//handle author
document.getElementById("editauthor").addEventListener("change", (e) => {
  SelectedRecord.author = e.target.value;
});

//handle project
document.getElementById("editproblemtitle").addEventListener("change", (e) => {
  SelectedRecord.project_name = e.target.value;
});

//handle summary
document.getElementById("editsummary").addEventListener("change", (e) => {
  SelectedRecord.summary = e.target.value;
});
