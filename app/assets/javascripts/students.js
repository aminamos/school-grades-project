$(function () {
  console.log('students.js is loaded')
  listenForClick()
  listenForAssignmentDetailsClick()   //student's assignment details

});

function listenForClick() {
  $('button#user-subjects').on('click', function(event) {
    event.preventDefault()
    getUserSubjects()
  })
}

function listenForAssignmentDetailsClick() {
  $('.assignment-data').on('click', function(event) {
    event.preventDefault()
    console.log("in listenForAssignmentDetailsClick")
    getAssignment()
  })
}

function getNewAssignmentForm() {
  console.log("in GetNewAssignmentForm")
  s = event.target.getAttribute('id')
  let newAssignmentForm = Assignment.newAssignmentForm()
  $(`#${s}`).replaceWith(newAssignmentForm)

  $('#new_assignment_form').on("submit", function(e){
    e.preventDefault()
    const data = $(this).serialize()+"&subject_id="+s
    console.log(data)
    var url = '/subjects/' + s + '/assignments'

    $.ajax({
      type: "POST",
      url: url,
      data: data,
      success: function(data) {
        alert("hope it will work")
        // redirect_to user_subject_path(@user, @assignment.subject), notice: "Assignment added."
      },
      error: function(data) {
        alert("something went wrong")      }
    })
  })
}







function getAssignment(){
  console.log("in getAssignment")
  a = event.target.getAttribute('assignid')
  s = event.target.getAttribute('subjectid')

  $.ajax({
    url: 'http://localhost:3000/subjects/' + s + '/assignments/' + a,
    method: 'get',
    dataType: 'json',
    success: function(data){
      console.log("the assignment data is: ", data)
      const newAssignment = new Assignment(data)
      const newAssignmentHtml = newAssignment.assignHTML()
$(`#${a}`).html(newAssignmentHtml)
      event.target.innerHTML = newAssignmentHtml
    }
  })
};

function getUserSubjects(){
  uid = window.location.href.split('/')[4]
  uid = uid.replace(/\D/g,'');

  console.log("in getUserSubjects")

  $.ajax({
    url: 'http://localhost:3000/users/'+ uid + '/subjects',
    method: 'get',
    dataType: 'json',
    success: function(data) {
      console.log("the data is: ", data)
      data.map(subject => {
        const newSubject = new Subject(subject)
        const newSubjectHtml = newSubject.subjectHTML()
        document.getElementById('ajax-subjects').innerHTML += newSubjectHtml
      })
    }
  })
}

class Assignment{
  constructor(obj){
    this.id = obj.id
    this.subject_id = obj.subject_id
    this.assignment_type = obj.assignment_type
    this.name = obj.name
    this.notes = obj.notes
    this.created_at = obj.created_at
    this.updated_at = obj.updated_at
  }
  static newAssignmentForm(){
    return (`
      <br>
		<strong>New assignment form</strong>
			<form id="new_assignment_form">

				<input type='radio' id='HW' name='assignment_type' value='HW' checked >HW</input><br>
				<input type='radio' id='Project' name='assignment_type' value='Project' >Project</input><br>
				<input type='radio' id='Test' name='assignment_type' value='Test' >Test</input><br>
				<input type='radio' id='Quiz' name='assignment_type' value='Quiz' ></input>Quiz<br><br>
        Assignment Details: <br><input type='text' id='name' name='name' ></input><br>
        Assignment Notes: <br><input type='text' id='notes' name="notes" ></input><br><br>

				<input type='submit' id='post-assignment' value='Create Assignment' ><br><br>
			</form>
      		`)
  }
}


Assignment.prototype.assignHTML = function (){
  return (`
    <div class='assignment'>
      <p>
      ${this.name}<br>
			${this.notes}<br>
			${typeof this.description !== "undefined" ?  this.description : ""}
      </p>
		</div>
  `)
}

class Subject {
  constructor(obj){
    this.id = obj.id
    this.name = obj.name
    this.description = obj.description
  }
}

Subject.prototype.subjectHTML = function (){
  console.log("in subject prototype")
  let subjectId = this.id
  return (`
      <h3>${this.name}</h3>
			<p>${this.description}</p>
    <div id='${subjectId}' >
      <input type="button" id="${subjectId}" class='add-assignment' onclick="getNewAssignmentForm()" value="Add Assignment"  />
    </div>
  `)
}
