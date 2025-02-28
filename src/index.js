
const init = () => {



  //DOM elements
  const header = document.getElementById('header')
  const form = document.getElementById('form')
  const filter = document.getElementById('filter')
  const list = document.getElementById('list')

  //stateful variables

  let inEditMode = false

  let links = []

  let formData = {
    title: "",
    url: "",
    type: "",
    description: "",
    paid: false
  }

  let selectedLink = {
    id: "",
    title: "",
    url: "",
    type: "",
    description: "",
    paid: false
  }

  let filterObj = {
    title: '',
    type: 'all',
    paid: 'all'
  }

  //initial fetch
  fetchLinks()


  //render header





  //render form
  function renderForm() {
    // Select the existing form inside <details>
    const formContainer = document.querySelector("#form");

    // Ensure the form is cleared first
    formContainer.innerHTML = "";

    // Add form elements inside it
    formContainer.innerHTML = `
      <div class="card">
        <label for="inputTitle">Title</label>
        <input type="text" id="inputTitle" class="form-input" name="title" placeholder="Website name goes here...">

        <label for="inputUrl">URL</label>
        <input type="url" id="inputUrl" class="form-input" name="url" placeholder="URL goes here...">

        <label for="inputType">Type</label>
        <select id="inputType" class="form-input" name="type">
          <option value="all" selected disabled>Choose type...</option>
          <option value="code">Code</option>
          <option value="music">Music</option>
        </select>

        <div class="form-checkbox-container">
          <label for="inputPaid">Paid?</label>
          <input type="checkbox" id="inputPaid" class="form-input" name="paid">
        </div>

        <div style="margin-top: 10px;">
          <button type="submit" id="buttonSubmit" class="primary-button">Submit</button>
          <button type="button" id="buttonClear" class="danger-button">Clear Form</button>
        </div>
      </div>
    `;

    // Attach event listeners
    document.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('input', handleFormInput);
    });

    document.getElementById('buttonSubmit').addEventListener('click', handleSubmitClick);
    document.getElementById('buttonClear').addEventListener('click', handleClearClick);
  }


  // form handler fucntions
  function handleFormInput(e) {
    const { name, type, value, checked } = e.target
    formData = {
      ...formData,
      [name]: type !== 'checkbox' ? value : checked
    }
  }

  function handleSubmitClick(e) {
    e.preventDefault()
    let formInput = {}
    if (inEditMode) {
      selectedLink = {
        ...selectedLink,
        title: document.getElementById('inputTitle').value,
        url: document.getElementById('inputUrl').value,
        type: document.getElementById('inputType').value,
        description: document.getElementById('inputDescription').value,
        paid: document.getElementById('inputPaid').checked
      }
      formInput = selectedLink
      handleUpdatedLink(formInput)
    } else {
      formInput = formData
      handleNewLink(formInput)
    }

  }


  function handleClearClick() {
    document.getElementById('buttonSubmit').textContent = "Submit"
    document.getElementById('inputTitle').value = ''
    document.getElementById('inputUrl').value = ''
    document.getElementById('inputType').value = ''
    document.getElementById('inputDescription').value = ''
    document.getElementById('inputPaid').checked = false
  }

  //render filter
  function renderFilter() {
    const filterHtml =
      `<input type='text' id='filterTitle' name='title' class='filter-input' placeholder='Filter by text...' />
     <select id='filterSelectType' name='type' class='filter-select'>
       <option value='all' selected>Show all (types)...</option>
       <option value='code'> Code </option>
        <option value='music'> Music </option>
     </select>
   <select id='filterSelectPaid' name='paid' class='filter-select'>
       <option value='all' selected>Show all (paid)...</option>
       <option value='paid'> Paid </option>
        <option value='free'> Free </option>
     </select>

         <select id='sortSelect' name='sort' class='filter-select'>
       <option value='all' selected disabled>Sort...</option>
       <option value='ascByTitle'> A-Z (title) </option>
         <option value='descByTitle'> Z-A (title) </option>
              <option value='ascByType'> A-Z (type) </option>
        <option value='descByType'> Z-A (type) </option>
          <option value='ascByPaid'> A-Z (paid) </option>
            <option value='descByPaid'> Z-A (paid) </option>
     </select>
          <button type='button' id='filterButtonClear' name='clear' class="filter-button"> Clear All </button>
     `

    filter.innerHTML = filterHtml

    document.getElementById('filterTitle').addEventListener('input', handleFilter)

    document.getElementById('filterSelectType').addEventListener('change', handleFilter)

    document.getElementById('filterSelectPaid').addEventListener('change', handleFilter)

    document.getElementById('filterButtonClear').addEventListener('click', handleFilterClear)

    document.getElementById('sortSelect').addEventListener('change', handleSortSelect)

  }




  //filter by text
  function handleFilter(e) {
    const { name, value } = e.target
    filterObj = {
      ...filterObj,
      [name]: value
    }
    const currentFilter = filterObj
    const filteredList = [...links].filter(link => (
      (link.title.toLowerCase().includes(currentFilter.title.toLowerCase()) ||
        link.description.toLowerCase().includes(currentFilter.title.toLowerCase())
        || currentFilter.title === '') &&
      (link.type === currentFilter.type || currentFilter.type === 'all') &&
      ((link.paid ? 'paid' : 'free') === currentFilter.paid || currentFilter.paid === 'all')
    ))
    renderList(filteredList)
  }



  //clear filter
  function handleFilterClear() {
    document.getElementById('filterTitle').value = "";
    document.getElementById('filterSelectType').value = "all";
    document.getElementById('filterSelectPaid').value = "all";
    document.getElementById('sortSelect').value = 'all'
    filterObj = {
      title: '',
      type: 'all',
      paid: 'all'
    }
    renderList(links)
  }



  //sort by selection
  function handleSortSelect(e) {
    let sortedList = []
    const { value } = e.target
    switch (value) {
      case "ascByTitle":
        sortedList = [...links].sort((a, b) => a.title.localeCompare(b.title))
        break;
      case "descByTitle":
        sortedList = [...links].sort((a, b) => b.title.localeCompare(a.title))
        break;
      case "ascByType":
        sortedList = [...links].sort((a, b) => a.type.localeCompare(b.type))
        break;
      case "descByType":
        sortedList = [...links].sort((a, b) => b.type.localeCompare(a.type))
        break;
      case "ascByPaid":
        sortedList = [...links].sort((a, b) => Number(a.paid) - Number(b.paid))
        break;
      case "descByPaid":
        sortedList = [...links].sort((a, b) => Number(b.paid) - Number(a.paid))
        break;
      default:
        break;
    }
    renderList(sortedList)
  }





  //render list
  function renderList(data) {
    const linkList = data.map(link => (
      `<tr>
       <td>${link.id}</td>
       <td>${link.title}</td>
       <td>${link.type}</td>
       <td>${link.description}</td>
       <td>${link.paid ? "paid" : "free"}</td>
       <td>
         <button type='button' class='list-button' name='view' id=${link.id}>
           View
         </button>
       </td>
       <td>
         <button type='button' class='list-button' name='edit' id=${link.id}>
           Edit
         </button>
       </td>
       <td>
         <button type='button' class='list-button' name='del' id=${link.id}>
           Del
         </button>
         <td>${link.url === "" ? "🚫 URL" : ""}
         ${link.id === "" ? "🚫 ID" : ""}</td>
       </td>
     </tr>`
    ))

    const listHtml =
      `<table>
       <thead>
         <tr>
           <th>ID</th>
           <th>Title</th>
           <th>Type</th>
           <th>Description</th>
           <th>$$</th>
           <th>View</th>
           <th>Edit</th>
           <th>Delete</th>
           <th>⚠</th>
         </tr>
       </thead>
       <tbody>
         ${linkList.join('')}
       </tbody>
     </table>`

    list.innerHTML = listHtml

    document.querySelectorAll('.list-button').forEach(btn => {
      btn.addEventListener('click', handleListButtonClick)
    })




  }

  // list button handler function

  function handleListButtonClick(e) {
    const { id, name } = e.target
    const linkObject = links.find(link => (
      link.id === id
    ))
    switch (name) {
      case 'view':
        onViewClick(linkObject)
        selectedLink = linkObject
        break;
      case 'edit':
        inEditMode = true
        document.getElementById('buttonSubmit').textContent = "Update"
        onEditClick(linkObject)
        selectedLink = linkObject
        break;
      case 'del':
        handleDelete(linkObject)
        break;
      default:
        break;
    }
  }

  // view button click
  function onViewClick(obj) {
    if (obj.url === "") {
      console.error('The URL is empty!')
      return;
    } else {
      window.open(`${obj.url}`, '_blank');
    }
  }

  //edit button click
  function onEditClick(obj) {
    selectedLink = obj
    document.getElementById('inputTitle').value = obj.title;
    document.getElementById('inputUrl').value = obj.url;
    document.getElementById('inputType').value = obj.type;
    document.getElementById('inputDescription').value = obj.description;
    document.getElementById('inputPaid').checked = obj.paid;
  }



  //async fucntions
  //GET

  async function fetchLinks() {
    try {
      const r = await fetch(`http://localhost:3000/links`)
      if (!r.ok) {
        throw new Error('GET: bad request')
      }
      const data = await r.json()
      links = data
      renderList(data)
      renderForm()
      renderFilter()

    } catch (error) { console.error(error) }
  }

  async function handleNewLink(newObj) {
    try {
      const r = await fetch(`http://localhost:3000/links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newObj)
      })
      if (!r.ok) {
        throw new Error('POST: bad request')
      }
      await fetchLinks()
    } catch (error) { console.error(error) }
  }


  async function handleDelete(obj) {
    try {
      const r = await fetch(`http://localhost:3000/links/${obj.id}`, {
        method: 'DELETE'
      })
      if (!r.ok) {
        throw new Error('DELETE: bad request')
      }
      await fetchLinks()
    } catch (error) { console.error(error) }
  }

  async function handleUpdatedLink(updatedObj) {
    try {
      const r = await fetch(`http://localhost:3000/links/${updatedObj.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedObj)
      })
      if (!r.ok) {
        throw new Error('PATCH: bad request')
      }
      await fetchLinks()
    } catch (error) { console.error(error) }
  }



}

window.addEventListener("DOMContentLoaded", init)