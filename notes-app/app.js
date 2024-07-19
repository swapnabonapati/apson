$(document).ready(function () {
  const apiUrl = 'http://localhost:5000/api'
  let token = localStorage.getItem('token')

  // Show/hide login/register forms and notes app based on token
  function toggleAuth() {
    if (token) {
      $('#auth').hide()
      $('#notes-app').show()
      loadNotes()
    } else {
      $('#auth').show()
      $('#notes-app').hide()
    }
  }

  // Login form submission
  $('#login-form').on('submit', function (e) {
    e.preventDefault()
    const email = $('#login-email').val()
    const password = $('#login-password').val()
    $.post(`${apiUrl}/users/login`, {email, password}, function (data) {
      token = data.token
      localStorage.setItem('token', token)
      toggleAuth()
    }).fail(function (xhr) {
      alert(xhr.responseJSON.message)
    })
  })

  // Register form submission
  $('#register-form').on('submit', function (e) {
    e.preventDefault()
    const username = $('#register-username').val()
    const email = $('#register-email').val()
    const password = $('#register-password').val()
    $.post(
      `${apiUrl}/users/register`,
      {username, email, password},
      function () {
        alert('User registered successfully')
      },
    ).fail(function (xhr) {
      alert(xhr.responseJSON.message)
    })
  })

  // Logout button click
  $('#logout').on('click', function () {
    token = null
    localStorage.removeItem('token')
    toggleAuth()
  })

  // Load notes
  function loadNotes() {
    $.ajax({
      url: `${apiUrl}/notes`,
      headers: {Authorization: `Bearer ${token}`},
      success: function (data) {
        $('#notes-list').empty()
        data.forEach(note => {
          $('#notes-list').append(`
                        <div class="note" style="background-color: ${
                          note.color
                        }">
                            <div class="note-header">
                                <h3>${note.title}</h3>
                                <div>
                                    <button class="edit-note" data-id="${
                                      note._id
                                    }">Edit</button>
                                    <button class="archive-note" data-id="${
                                      note._id
                                    }">${
                                      note.isArchived ? 'Unarchive' : 'Archive'
                                    }</button>
                                    <button class="trash-note" data-id="${
                                      note._id
                                    }">Trash</button>
                                </div>
                            </div>
                            <div class="note-body">${note.content}</div>
                        </div>
                    `)
        })
      },
    })
  }

  // New note button click
  $('#new-note').on('click', function () {
    const title = prompt('Enter note title:')
    const content = prompt('Enter note content:')
    const color = prompt('Enter note color (e.g., #ffffff):')
    $.ajax({
      url: `${apiUrl}/notes`,
      method: 'POST',
      headers: {Authorization: `Bearer ${token}`},
      data: {title, content, color},
      success: function () {
        loadNotes()
      },
    })
  })

  // Edit note button click
  $(document).on('click', '.edit-note', function () {
    const id = $(this).data('id')
    const title = prompt('Enter new title:')
    const content = prompt('Enter new content:')
    const color = prompt('Enter new color:')
    $.ajax({
      url: `${apiUrl}/notes/${id}`,
      method: 'PUT',
      headers: {Authorization: `Bearer ${token}`},
      data: {title, content, color},
      success: function () {
        loadNotes()
      },
    })
  })

  // Archive note button click
  $(document).on('click', '.archive-note', function () {
    const id = $(this).data('id')
    $.ajax({
      url: `${apiUrl}/notes/${id}/archive`,
      method: 'PUT',
      headers: {Authorization: `Bearer ${token}`},
      success: function () {
        loadNotes()
      },
    })
  })

  // Trash note button click
  $(document).on('click', '.trash-note', function () {
    const id = $(this).data('id')
    $.ajax({
      url: `${apiUrl}/notes/${id}/trash`,
      method: 'PUT',
      headers: {Authorization: `Bearer ${token}`},
      success: function () {
        loadNotes()
      },
    })
  })

  toggleAuth()
})
