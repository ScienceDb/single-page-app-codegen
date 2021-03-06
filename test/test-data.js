
module.exports.routes =
`
import projectRoutes from './projectRoutes'
import researcherRoutes from './researcherRoutes'
import specieRoutes from './specieRoutes'

let child_paths = []

      child_paths.push(...projectRoutes)
      child_paths.push(...researcherRoutes)
      child_paths.push(...specieRoutes)

export default child_paths
`

module.exports.resquest_index = `
import projectQueries from './project'
import researcherQueries from './researcher'
import specieQueries from './specie'

export default  {
  Project: projectQueries,
  Researcher: researcherQueries,
  Specie: specieQueries,
}

`

module.exports.sideNav =
`
<template>
  <div class="sidenav">
    <a href="/home"> HOME </a>
        <a href='/projects'> projects   </a>
        <a href='/researchers'> researchers   </a>
        <a href='/species'> species   </a>
      </div>
</template>

<script>

export default {
  name: 'side-nav'
}
</script>

<style>
.sidenav {
    text-align: left;
    height: 100%;
    width: 280px;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    background-color: #111;
    overflow-x: hidden;
    padding-top: 20px;
}
.sidenav a {
    padding: 6px 6px 6px 32px;
    text-decoration: none;
    color: #818181;
    display: block;
}
.sidenav a:hover {
    color: #f1f1f1;
}

@media screen and (max-height: 450px) {
  .sidenav {padding-top: 15px;}
  .sidenav a {font-size: 18px;}
}
</style>
`

module.exports.modelsObj =
{ models:
  [ { name: 'project',
      nameLc: 'project',
      namePl: 'projects',
      namePlLc: 'projects',
      nameCp: 'Project'},
    { name: 'researcher',
      nameLc: 'researcher',
      namePl: 'researchers',
      namePlLc: 'researchers',
      nameCp: 'Researcher'},
    { name: 'specie',
      nameLc: 'specie',
      namePl: 'species',
      namePlLc: 'species',
      nameCp: 'Specie'} ] }

module.exports.book_table = `
<template>
  <div class="ui container">
    <filter-bar></filter-bar>
    <div class="inline field pull-left">
      <router-link v-bind:to="'book'"><button class="ui primary button">Add book</button></router-link>
      <button class="ui primary button" @click="downloadExampleCsv">CSV Template Table</button>
      <router-link v-bind:to="'/books/upload_csv'"><button class="ui primary button">CSV Upload</button></router-link>
      <form :action="this.$exportUrl()"> <input type="hidden" name="model" value="Book" /> <button class="ui primary button" type="submit">Download CSV </button></form>
    </div>
    <vuetable ref="vuetable"
      :api-url="this.$baseUrl()"
      :fields="fields"
      :per-page="20"
      :appendParams="moreParams"
      :http-options="{ headers: {Authorization: \`Bearer \${this.$store.getters.authToken}\`} }"
      pagination-path="data.vueTableBook"
      detail-row-component="book-detail-row"
      data-path="data.vueTableBook.data"
      @vuetable:pagination-data="onPaginationData"
      @vuetable:cell-clicked="onCellClicked"
      @vuetable:load-error="onError"
    ></vuetable>
    <div class="vuetable-pagination ui basic segment grid">
      <vuetable-pagination-info ref="paginationInfo"
      ></vuetable-pagination-info>
      <vuetable-pagination ref="pagination"
        @vuetable-pagination:change-page="onChangePage"
      ></vuetable-pagination>
    </div>
  </div>
</template>

<script>
import Vuetable from 'vuetable-2/src/components/Vuetable.vue'
import VuetablePagination from 'vuetable-2/src/components/VuetablePagination.vue'
import VuetablePaginationInfo from 'vuetable-2/src/components/VuetablePaginationInfo.vue'
import BookCustomActions from './BookCustomActions.vue'
import BookDetailRow from './BookDetailRow.vue'
import FilterBar from './FilterBar.vue'

import axios from 'axios'

import Vue from 'vue'
import VueEvents from 'vue-events'
import Queries from '../requests/index'
Vue.use(VueEvents)

Vue.component('book-custom-actions', BookCustomActions)
Vue.component('book-detail-row', BookDetailRow)
Vue.component('filter-bar', FilterBar)

export default {
  components: {
    Vuetable,
    VuetablePagination,
    VuetablePaginationInfo,
    BookDetailRow
  },
  data() {
    return {
      fields: [{
          name: 'id',
          title: 'ID',
          titleClass: 'center aligned',
          dataClass: 'right aligned'
        },
        // For now, we do not render checkboxes, as we yet have to provide
        // functions for selected rows.
        //{
        //  name: '__checkbox',
        //  titleClass: 'center aligned',
        //  dataClass: 'center aligned'
        //},
                  {
            name: 'title',
            sortField: 'title'
          },
                  {
            name: 'genre',
            sortField: 'genre'
          },
                {
          name: '__component:book-custom-actions',
          title: 'Actions',
          titleClass: 'center aligned',
          dataClass: 'center aligned'
        }
      ],
      moreParams: {
        query: Queries.Book.vueTable
      }
    }
  },
  methods: {
    onPaginationData(paginationData) {
      this.$refs.pagination.setPaginationData(paginationData)
      this.$refs.paginationInfo.setPaginationData(paginationData)
    },
    onChangePage(page) {
      this.$refs.vuetable.changePage(page)
    },
    onCellClicked(data, field, event) {
      console.log('cellClicked: ', field.name)
      this.$refs.vuetable.toggleDetailRow(data.id)
    },
    onFilterSet(filterText) {
      this.moreParams [
        'filter'] = filterText.trim()
      Vue.nextTick(() => this.$refs.vuetable.refresh())
    },
    onFilterReset() {
      this.moreParams = {
        query: Queries.Book.vueTable
      }
      Vue.nextTick(() => this.$refs.vuetable.refresh())
    },
    onCsvExport () {
      var t = this;
      var url = this.$baseUrl()() + '/books/example_csv' + '?array=[' + this.$refs.vuetable.selectedTo.join(",") + ']'

      axios.get(url).then(function (response) {

        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        var blob = new Blob([response.data], {type: "octet/stream"});
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'book' + '.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      }).catch(function (error) {
        t.error = error
      })
    },
    downloadExampleCsv: function() {
      Queries.Book.tableTemplate({url: this.$baseUrl()}).then(response =>{
        if(response.data && response.data.data && response.data.data.csvTableTemplateBook){
            let file = response.data.data.csvTableTemplateBook.join('\\n');
            const url = window.URL.createObjectURL(new Blob([file]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'template_book.csv');
            document.body.appendChild(link);
            link.click();
        }else{
            this.$root.$emit('globalError', response)
        }
      }).catch( err =>{
        this.$root.$emit('globalError', err)
        this.$router.push('/')
      })
    },
    onError: function(res) {
      var err = (res && res.response && res.response.data && res.response.data.message ?
        res.response.data.message : res)
      this.$root.$emit('globalError', err)
      this.$router.push('/')
    }
  },
  mounted() {
    this.$events.$on('filter-set', eventData => this.onFilterSet(eventData))
    this.$events.$on('filter-reset', e => this.onFilterReset())
  }
}
</script>

`

module.exports.DogFormElem = `
<template>
  <div id="dog-form-elemns-div">

  <input type="hidden" v-model="dog.id"/>


    <div id="dog-name-div" class="form-group">
            <label>name</label>

  <input type="text" v-model="dog.name" class="form-control"/>


      <div id="dog-name-err" v-if="validationError('name')" class="alert alert-danger">
        <ul>
          <li v-for="err in validationError('name')">{{err.message}}</li>
        </ul>
      </div>
    </div>


    <div id="dog-breed-div" class="form-group">
            <label>breed</label>

  <input type="text" v-model="dog.breed" class="form-control"/>


      <div id="dog-breed-err" v-if="validationError('breed')" class="alert alert-danger">
        <ul>
          <li v-for="err in validationError('breed')">{{err.message}}</li>
        </ul>
      </div>
    </div>



    <div id="dog-person-div" class="form-group">
      <label>person</label>
      <foreign-key-form-element
        :searchUrl = "this.$baseUrl()"
        v-model:foreignKey="dog.personId"
        label="firstName"
                    subLabel = "lastName"
                        valueKey="id"
        targetModel="Person"
        v-bind:initialInput="personInitialLabel"
        v-bind:query="personQuery"
        queryName ="people"
        >
      </foreign-key-form-element>
    </div>


    <div id="dog-researcher-div" class="form-group">
      <label>researcher</label>
      <foreign-key-form-element
        :searchUrl = "this.$baseUrl()"
        v-model:foreignKey="dog.researcherId"
        label="firstName"
                        valueKey="id"
        targetModel="Researcher"
        v-bind:initialInput="researcherInitialLabel"
        v-bind:query="researcherQuery"
        queryName= "researchers"
        >
      </foreign-key-form-element>
    </div>


  </div>
</template>

<script>
import Vue from 'vue'

import foreignKeyFormElement from './foreignKeyFormElement.vue'

Vue.component('foreign-key-form-element', foreignKeyFormElement)

import inflection from 'inflection'
import axios from 'axios'
import Queries from '../requests/index'

export default {
  props: [ 'dog', 'errors', 'mode' ],
  data(){
    return{
    }
  },
  computed: {

    personQuery : function(){
      return Queries.Person.getAll("firstName", "lastName");
    },
    researcherQuery: function(){
      return Queries.Researcher.getAll("firstName", "");
    },
            personInitialLabel: function () {
      var x = this.dog.person
      if (x !== null && typeof x === 'object' &&
          x['firstName'] !== null &&
          typeof x['firstName'] !== 'undefined') {
        return x['firstName']
      } else {
        return ''
      }
    }
        ,
              researcherInitialLabel: function () {
      var x = this.dog.researcher
      if (x !== null && typeof x === 'object' &&
          x['firstName'] !== null &&
          typeof x['firstName'] !== 'undefined') {
        return x['firstName']
      } else {
        return ''
      }
    }

  },
  methods: {
    validationError(modelField) {
      if (this.errors == null) return false;
      return this.errors.details.filter(function (el) {
        return el.path === modelField
      })
    }
  },
	mounted: function() {
    let el = this;
    $(document).ready(function(){
      $('.datepicker').datepicker({
        format: el.$defaultDateFormat(),
        dateFormat: el.$defaultDateFormat()
      })
    })
	},
  created(){

  }
}
</script>

`
module.exports.DogCreateForm = `
<template>
  <div class="col-xs-5">
    <h4>New dog</h4>
    <div id="dog-div">
      <div v-if="dog" class="content">
        <form id="dog-form" v-on:submit.prevent="onSubmit">

          <dog-form-elemns mode="create" v-bind:errors="errors" v-bind:dog="dog"></dog-form-elemns>

          <button type="submit" class="btn btn-primary">Create</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import DogFormElemns from './DogFormElemns.vue'
import Queries from '../requests/index'

Vue.component('dog-form-elemns', DogFormElemns)

export default {
  data() {
    return {
      loading: false,
      dog: {},
      error: null,
      errors: null,
    }
  },
  methods: {
    onSubmit() {
      var t = this;
      var url = this.$baseUrl()
      this.getAssociationsIds()
      Queries.Dog.create({url:url, variables: t.dog})
      .then(function(response) {
          t.$router.push('/dogs')
      }).catch(function(res) {
        if(res.response && res.response.data && res.response.data.errors && (res.response.data.errors[0].message === "Validation error")){
          t.errors = res.response.data.errors[0];
        }else{
          let msg = res;
          if(res && res.response && res.response.data && res.response.data.message){
             msg =  res.response.data.message
          }
          t.$root.$emit('globalError', msg)
          t.$router.push('/home')
        }
      })
    },

    getOnlyIds(array){
      return array.map((item)=>{ return item.id; });
    },

    getAssociationsIds(){
          }
  }
}
</script>
`
module.exports.DogRequests = `
import requestGraphql from './request'

export default {

  create : function({url, variables, token}){
  let query = \` mutation addDog(
   $name:String  $breed:String    $personId:Int  $researcherId:Int   ){
    addDog(
     name:$name   breed:$breed       personId:$personId  researcherId:$researcherId     ){id  name   breed   }
  }
  \`
  return requestGraphql({url, query, variables, token});
},

readOneDog : function({url, variables, token}){
  let query = \`query readOneDog($id:ID!){
    readOneDog(id:$id){
      id name breed person{firstName lastName} researcher{firstName}
    }
  }

  \`
    return requestGraphql({url, query, variables, token});
  },

  update : function({url, variables, token}){
    let query = \`mutation updateDog($id:ID! $name:String $breed:String $personId:Int $researcherId:Int ){
      updateDog(id:$id name:$name breed:$breed  personId:$personId researcherId:$researcherId){
        id name breed
      }
    }

    \`
      return requestGraphql({url, query, variables, token});
    },

  deleteDog : function({url, variables, token}){
    let query = \`mutation deleteDog($id:ID!){
      deleteDog(id:$id)
    }\`
    return requestGraphql({url, query, variables, token});
  },

  tableTemplate: function({url}){
    let query = \`query {csvTableTemplateDog }\`

    return requestGraphql({url,query});
  },
  //simple queries needed in spa components

  vueTable: \`{vueTableDog{data {id  name breed person{firstName  lastName } researcher{firstName }} total per_page current_page last_page prev_page_url next_page_url from to}}\`,

  getAll: function(label, sublabel){
    return \`query
      dogs($search: searchDogInput $pagination: paginationInput)
     {dogs(search:$search pagination:$pagination){id \${label} \${sublabel} } }\`
  },

  getOne: function(subQuery, label, sublabel){
    return \` query readOneDog($id: ID!, $offset:Int, $limit:Int) {
      readOneDog(id:$id){ \${subQuery}(pagination:{limit: $limit offset:$offset }){ id \${label} \${sublabel} } } }\`
  }
}
`

module.exports.DogEdit = `
<template>
  <div class="col-xs-5">
    <h4>Edit dog</h4>
    <div id="dog-div">
      <div v-if="dog" class="content">
        <form id="dog-form" v-on:submit.prevent="onSubmit">

          <dog-form-elemns mode="edit" v-bind:errors="errors" v-bind:dog="dog"></dog-form-elemns>

          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import DogFormElemns from './DogFormElemns.vue'
import queries from '../requests/dog'
import Queries from '../requests/index'

Vue.component('dog-form-elemns', DogFormElemns)

export default {
  data() {
    return {
      loading: false,
      dog: null,
      error: null,
      errors: null,
    }
  },
  created() {
    this.fetchData()
  },
  watch: {
    '$route': 'fetchData',
  },
  methods: {
    fetchData() {
      var t = this
      t.error = null
      if(this.$route.params.id){
        queries.readOneDog({ url:this.$baseUrl(), variables: {id:this.$route.params.id}})
        .then(function (response) {
            t.dog = response.data.data.readOneDog          }, function (err) {
            t.parent.error = err
          })
      }
    },
    onSubmit() {
      var t = this;
      var url = this.$baseUrl()
      this.getAssociationsIds();
      Queries.Dog.update({url:url, variables:t.dog})
      .then(function (response) {
        t.$router.push('/dogs')
      }).catch( function (res) {
        if(res.response && res.response.data && res.response.data.errors && (res.response.data.errors[0].message === "Validation error")){
          t.errors = res.response.data.errors[0];
        }else{
          let msg = res;
          if(res && res.response && res.response.data && res.response.data.message){
             msg =  res.response.data.message
          }
          t.$root.$emit('globalError', msg)
          t.$router.push('/home')
        }
      })
    },

    getOnlyIds(array){
      return array.map((item)=>{ return item.id; });
    },

    getAssociationsIds(){
    }
  }
}
</script>
`

module.exports.DogCustomActions = `
<template>
  <div class="custom-actions">
    <button v-on:click="detailsToggle()" class="ui basic button"><font-awesome-icon icon="info" /></button>
    <router-link v-bind:to="'dog/' + rowData.id"><button class="ui basic button"><font-awesome-icon icon="edit" /></button></router-link>
    <button v-on:click="confirmDelete()" class="ui basic button"><font-awesome-icon icon="trash" /></button>
  </div>
</template>

<script>
import axios from 'axios'
import queries from '../requests/dog'

export default {
  props: {
    rowData: {
      type: Object,
      required: true
    },
    rowIndex: {
      type: Number
    }
  },
  methods: {
    detailsToggle () {
      this.$parent.toggleDetailRow(this.rowData.id)
    },
    confirmDelete () {
      if (window.confirm("Do you really want to delete Dog of id '" + this.rowData
          .id + "'?")) {
        this.deleteInstance()
      }
    },
    deleteInstance () {
      var t = this;
      queries.deleteDog({url:this.$baseUrl(), variables: {id:this.rowData.id} })
      .then(function (response) {
        window.alert(response.data.data.deleteDog)
        t.$parent.reload()
      }).catch(function (error) {
        t.error = error
      })
    }
  }
}
</script>

<style>
.custom-actions button.ui.button {
  padding: 8px 8px;
}
.custom-actions button.ui.button > i.icon {
  margin: auto !important;
}
</style>
`
module.exports.ProjectForm = `
<template>
  <div id="project-form-elemns-div">

  <input type="hidden" v-model="project.id"/>


    <div id="project-name-div" class="form-group">
            <label>name</label>

  <input type="text" v-model="project.name" class="form-control"/>


      <div id="project-name-err" v-if="validationError('name')" class="alert alert-danger">
      <ul>
        <li v-for="err in validationError('name')"> {{err.message}}</li>
      </ul>
      </div>
    </div>


    <div id="project-description-div" class="form-group">
            <label>description</label>

  <input type="text" v-model="project.description" class="form-control"/>


      <div id="project-description-err" v-if="validationError('description')" class="alert alert-danger">
      <ul>
        <li v-for="err in validationError('description')"> {{err.message}}</li>
      </ul>
      </div>
    </div>



    <div id="project-specie-div" class="form-group">
      <label>specie</label>
      <foreign-key-form-element
        :searchUrl = "this.$baseUrl()"
        v-model:foreignKey="project.specieId"
        label="nombre"
                    subLabel = "nombre_cientifico"
                        valueKey="id"
        targetModel="Specie"
        v-bind:initialInput="specieInitialLabel"
        v-bind:query = "specieQuery"
        queryName = "species"
        >
      </foreign-key-form-element>
    </div>




    <div id="project-researchers-div" class="form-group">
      <label>researchers</label>
      <has-many-form-element
        :searchUrl="this.$baseUrl()"
        :idSelected="project.id"
        :countQuery="project.countFilteredResearchers"
        :mode="mode"
        :addItems.sync="project.addResearchers"
        label="firstName"
                    subLabel ="lastName"
                valueKey="id"
        model="Project"
        targetModel = "Researcher"
        removeName="removeResearchers"
        addName="addResearchers"
        v-bind:queryOne="researchersSubquery"
        queryOneName="readOneProject"
        subQueryName="researchersFilter"
        v-bind:query = "researchersQuery"
        queryName = "researchers"
        >
      </has-many-form-element>
    </div>



  </div>
</template>

<script>
import Vue from 'vue'

import foreignKeyFormElement from './foreignKeyFormElement.vue'

Vue.component('foreign-key-form-element', foreignKeyFormElement)

import hasManyFormElemn from './hasManyFormElemn.vue'

Vue.component('has-many-form-element', hasManyFormElemn)
import inflection from 'inflection'
import axios from 'axios'
import Queries from '../requests/index'

export default {
  props: [ 'project', 'errors', 'mode' ],
  data(){
    return{
    }
  },
  computed: {

    specieQuery: function(){
      return Queries.Specie.getAll("nombre","nombre_cientifico");
    },

    researchersQuery: function(){
      return Queries.Researcher.getAll("firstName","lastName");
    },

    researchersSubquery: function(){
      return Queries.Project.getOne("researchersFilter", "firstName","lastName");
    },

          specieInitialLabel: function () {
      var x = this.project.specie
      if (x !== null && typeof x === 'object' &&
          x['nombre'] !== null &&
          typeof x['nombre'] !== 'undefined') {
        return x['nombre']
      } else {
        return ''
      }
    }
        },
  methods: {
    validationError(modelField) {
      if (this.errors == null) return false;
      return this.errors.details.filter(function (el) {
        return el.path === modelField
      })
    }
  },
	mounted: function() {
    let el = this;
    $(document).ready(function(){
      $('.datepicker').datepicker({
        format: el.$defaultDateFormat(),
        dateFormat: el.$defaultDateFormat()
      })
    })
	},
  created(){
  }
}
</script>

`
module.exports.DogDetailView = `
<template>
  <div @click="onClick">
    <div class="inline field">
      <label>id: </label>
      <span>{{rowData.id}}</span>
    </div>
          <div class="inline field">
        <label>name:</label>
        <span>{{rowData.name}}</span>
      </div>
          <div class="inline field">
        <label>breed:</label>
        <span>{{rowData.breed}}</span>
      </div>


    <div id="dog-person-div">
      <div class="inline field">
        <label>person:</label>
        <span>{{personInitialLabel}}</span>
      </div>
    </div>


    <div id="dog-researcher-div">
      <div class="inline field">
        <label>researcher:</label>
        <span>{{researcherInitialLabel}}</span>
      </div>
    </div>



  </div>
</template>

<script>
import Vue from 'vue'
import scrollListElement from './scrollListElement.vue'
import Queries from '../requests/index'

Vue.component('scroll-list', scrollListElement)

export default {
  props: {
    rowData: {
      type: Object,
      required: true
    },
    rowIndex: {
      type: Number
    }
  },
  computed: {
          personInitialLabel: function () {
      var x = this.rowData.person
      if (x !== null && typeof x === 'object' &&
          x['firstName'] !== null &&
          typeof x['firstName'] !== 'undefined') {
        return x['firstName']
      } else {
        return ''
      }
    }
        ,
              researcherInitialLabel: function () {
      var x = this.rowData.researcher
      if (x !== null && typeof x === 'object' &&
          x['firstName'] !== null &&
          typeof x['firstName'] !== 'undefined') {
        return x['firstName']
      } else {
        return ''
      }
    }
        },
  methods: {
    onClick (event) {
      console.log('my-detail-row: on-click', event.target)
    }
  }
}
</script>
`

module.exports.projectDetailView = `
<template>
  <div @click="onClick">
    <div class="inline field">
      <label>id: </label>
      <span>{{rowData.id}}</span>
    </div>
          <div class="inline field">
        <label>name:</label>
        <span>{{rowData.name}}</span>
      </div>
          <div class="inline field">
        <label>description:</label>
        <span>{{rowData.description}}</span>
      </div>


    <div id="project-specie-div">
      <div class="inline field">
        <label>specie:</label>
        <span>{{specieInitialLabel}}</span>
      </div>
    </div>



    <div id="project-researchers-div" class="row w-100">
      <div class="col">
        <label>researchers:</label>
        <scroll-list class="list-group"
          :url="this.$baseUrl()"
          :idSelected="rowData.id"
          :countQuery="rowData.countFilteredResearchers"
          v-bind:queryOne="researchersSubquery"
          queryOneName="readOneProject"
          subQueryName="researchersFilter"
          label="firstName"
          subLabel="lastName"
        > </scroll-list>
      </div>
    </div>


  </div>
</template>

<script>
import Vue from 'vue'
import scrollListElement from './scrollListElement.vue'
import Queries from '../requests/index'

Vue.component('scroll-list', scrollListElement)

export default {
  props: {
    rowData: {
      type: Object,
      required: true
    },
    rowIndex: {
      type: Number
    }
  },
  computed: {

    researchersSubquery: function(){
      return Queries.Project.getOne("researchersFilter", "firstName", "lastName");
    },

          specieInitialLabel: function () {
      var x = this.rowData.specie
      if (x !== null && typeof x === 'object' &&
          x['nombre'] !== null &&
          typeof x['nombre'] !== 'undefined') {
        return x['nombre']
      } else {
        return ''
      }
    }
        },
  methods: {
    onClick (event) {
      console.log('my-detail-row: on-click', event.target)
    }
  }
}
</script>
`
module.exports.dog_table = `
<template>
  <div class="ui container">
    <filter-bar></filter-bar>
    <div class="inline field pull-left">
      <router-link v-bind:to="'dog'"><button class="ui primary button">Add dog</button></router-link>
      <button class="ui primary button" @click="downloadExampleCsv">CSV Template Table</button>
      <router-link v-bind:to="'/dogs/upload_csv'"><button class="ui primary button">CSV Upload</button></router-link>
      <form :action="this.$exportUrl()"> <input type="hidden" name="model" value="Dog" /> <button class="ui primary button" type="submit">Download CSV </button></form>
    </div>
    <vuetable ref="vuetable"
      :api-url="this.$baseUrl()"
      :fields="fields"
      :per-page="20"
      :appendParams="moreParams"
      :http-options="{ headers: {Authorization: \`Bearer \${this.$store.getters.authToken}\`} }"
      pagination-path="data.vueTableDog"
      detail-row-component="dog-detail-row"
      data-path="data.vueTableDog.data"
      @vuetable:pagination-data="onPaginationData"
      @vuetable:cell-clicked="onCellClicked"
      @vuetable:load-error="onError"
    ></vuetable>
    <div class="vuetable-pagination ui basic segment grid">
      <vuetable-pagination-info ref="paginationInfo"
      ></vuetable-pagination-info>
      <vuetable-pagination ref="pagination"
        @vuetable-pagination:change-page="onChangePage"
      ></vuetable-pagination>
    </div>
  </div>
</template>

<script>
import Vuetable from 'vuetable-2/src/components/Vuetable.vue'
import VuetablePagination from 'vuetable-2/src/components/VuetablePagination.vue'
import VuetablePaginationInfo from 'vuetable-2/src/components/VuetablePaginationInfo.vue'
import DogCustomActions from './DogCustomActions.vue'
import DogDetailRow from './DogDetailRow.vue'
import FilterBar from './FilterBar.vue'

import axios from 'axios'

import Vue from 'vue'
import VueEvents from 'vue-events'
import Queries from '../requests/index'
Vue.use(VueEvents)

Vue.component('dog-custom-actions', DogCustomActions)
Vue.component('dog-detail-row', DogDetailRow)
Vue.component('filter-bar', FilterBar)

export default {
  components: {
    Vuetable,
    VuetablePagination,
    VuetablePaginationInfo,
    DogDetailRow
  },
  data() {
    return {
      fields: [{
          name: 'id',
          title: 'ID',
          titleClass: 'center aligned',
          dataClass: 'right aligned'
        },
        // For now, we do not render checkboxes, as we yet have to provide
        // functions for selected rows.
        //{
        //  name: '__checkbox',
        //  titleClass: 'center aligned',
        //  dataClass: 'center aligned'
        //},
                  {
            name: 'name',
            sortField: 'name'
          },
                  {
            name: 'breed',
            sortField: 'breed'
          },
                {
          name: '__component:dog-custom-actions',
          title: 'Actions',
          titleClass: 'center aligned',
          dataClass: 'center aligned'
        }
      ],
      moreParams: {
        query: Queries.Dog.vueTable
      }
    }
  },
  methods: {
    onPaginationData(paginationData) {
      this.$refs.pagination.setPaginationData(paginationData)
      this.$refs.paginationInfo.setPaginationData(paginationData)
    },
    onChangePage(page) {
      this.$refs.vuetable.changePage(page)
    },
    onCellClicked(data, field, event) {
      console.log('cellClicked: ', field.name)
      this.$refs.vuetable.toggleDetailRow(data.id)
    },
    onFilterSet(filterText) {
      this.moreParams [
        'filter'] = filterText.trim()
      Vue.nextTick(() => this.$refs.vuetable.refresh())
    },
    onFilterReset() {
      this.moreParams = {
        query: Queries.Dog.vueTable
      }
      Vue.nextTick(() => this.$refs.vuetable.refresh())
    },
    onCsvExport () {
      var t = this;
      var url = this.$baseUrl()() + '/dogs/example_csv' + '?array=[' + this.$refs.vuetable.selectedTo.join(",") + ']'

      axios.get(url).then(function (response) {

        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        var blob = new Blob([response.data], {type: "octet/stream"});
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'dog' + '.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      }).catch(function (error) {
        t.error = error
      })
    },
    downloadExampleCsv: function() {
      Queries.Dog.tableTemplate({url: this.$baseUrl()}).then(response =>{
        if(response.data && response.data.data && response.data.data.csvTableTemplateDog){
            let file = response.data.data.csvTableTemplateDog.join('\\n');
            const url = window.URL.createObjectURL(new Blob([file]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'template_dog.csv');
            document.body.appendChild(link);
            link.click();
        }else{
            this.$root.$emit('globalError', response)
        }
      }).catch( err =>{
        this.$root.$emit('globalError', err)
        this.$router.push('/')
      })
    },
    onError: function(res) {
      var err = (res && res.response && res.response.data && res.response.data.message ?
        res.response.data.message : res)
      this.$root.$emit('globalError', err)
      this.$router.push('/')
    }
  },
  mounted() {
    this.$events.$on('filter-set', eventData => this.onFilterSet(eventData))
    this.$events.$on('filter-reset', e => this.onFilterReset())
  }
}
</script>
`
module.exports.BookForm = `
<template>
  <div id="book-form-elemns-div">

  <input type="hidden" v-model="book.id"/>


    <div id="book-title-div" class="form-group">
            <label>title</label>

  <input type="text" v-model="book.title" class="form-control"/>


      <div id="book-title-err" v-if="validationError('title')" class="alert alert-danger">
        <ul>
          <li v-for="err in validationError('title')"> {{err.message}}</li>
        </ul>
      </div>
    </div>


    <div id="book-genre-div" class="form-group">
            <label>genre</label>

  <input type="text" v-model="book.genre" class="form-control"/>


      <div id="book-genre-err" v-if="validationError('genre')" class="alert alert-danger">
        <ul>
          <li v-for="err in validationError('genre')"> {{err.message}}</li>
        </ul>
      </div>
    </div>



    <div id="book-publisher-div" class="form-group">
      <label>publisher</label>
      <foreign-key-form-element
        :searchUrl = "this.$baseUrl()"
        v-model:foreignKey="book.publisherId"
        label="name"
                        valueKey="id"
        targetModel="Publisher"
        v-bind:initialInput="publisherInitialLabel"
        v-bind:query="publisherQuery"
        queryName="publishers">
      </foreign-key-form-element>
    </div>




    <div id="book-people-div" class="form-group">
      <label>people</label>
      <has-many-form-element
        :searchUrl="this.$baseUrl()"
        :idSelected="book.id"
        :countQuery="book.countFilteredPeople"
        :mode="mode"
        :addItems.sync="book.addPeople"
        label="firstName"
                    subLabel ="email"
                valueKey="id"
        model="Book"
        targetModel = "Person"
        removeName="removePeople"
        addName="addPeople"
        v-bind:queryOne = "peopleSubquery"
        queryOneName="readOneBook"
        subQueryName="peopleFilter"
        v-bind:query="peopleQuery"
        queryName ="people"
        >
      </has-many-form-element>
    </div>



  </div>
</template>

<script>
import Vue from 'vue'

import foreignKeyFormElement from './foreignKeyFormElement.vue'

Vue.component('foreign-key-form-element', foreignKeyFormElement)

import hasManyFormElemn from './hasManyFormElemn.vue'

Vue.component('has-many-form-element', hasManyFormElemn)
import inflection from 'inflection'
import axios from 'axios'
import Queries from '../requests/index'

export default {
  props: [ 'book', 'errors', 'mode' ],
  data(){
    return{
    }
  },
  computed: {

    publisherQuery: function(){
      return Queries.Publisher.getAll("name","");
    },

    peopleQuery: function(){
      return Queries.Person.getAll("firstName", "email");
    },

    peopleSubquery: function(){
      return Queries.Book.getOne("peopleFilter", "firstName", "email");
    },

            publisherInitialLabel: function () {
      var x = this.book.publisher
      if (x !== null && typeof x === 'object' &&
          x['name'] !== null &&
          typeof x['name'] !== 'undefined') {
        return x['name']
      } else {
        return ''
      }
    }

  },
  methods: {
    validationError(modelField) {
      if (this.errors == null) return false;
      return this.errors.details.filter(function (el) {
        return el.path === modelField
      })
    }
  },
	mounted: function() {
    let el = this;
    $(document).ready(function(){
      $('.datepicker').datepicker({
        format: el.$defaultDateFormat(),
        dateFormat: el.$defaultDateFormat()
      })
    })
	},
  created(){

  }
}
</script>
`
module.exports.PersonRequests = `
import requestGraphql from './request'

export default {

  create : function({url, variables, token}){
    let query = \` mutation addPerson(
     $firstName:String  $lastName:String  $email:String      $addDogs:[ID] $addBooks:[ID]  ){
      addPerson(
       firstName:$firstName   lastName:$lastName   email:$email           addDogs:$addDogs addBooks:$addBooks    ){id  firstName   lastName   email   }
    }
    \`
    return requestGraphql({url, query, variables, token});
  },

  readOnePerson : function({url, variables, token}){
    let query = \`query readOnePerson($id:ID!){
      readOnePerson(id:$id){id  firstName   lastName   email countFilteredDogs countFilteredBooks   }
    }\`
    return requestGraphql({url, query, variables, token});
  },

  update : function({url, variables, token}){
    let query = \`mutation updatePerson($id:ID!
     $firstName:String  $lastName:String  $email:String $addDogs:[ID] $removeDogs:[ID]  $addBooks:[ID] $removeBooks:[ID] ){
      updatePerson(id:$id
       firstName:$firstName   lastName:$lastName   email:$email  addDogs:$addDogs removeDogs:$removeDogs addBooks:$addBooks removeBooks:$removeBooks    ){id  firstName   lastName   email  }
    }\`

    return requestGraphql({url, query, variables, token});
  },

  deletePerson : function({url, variables, token}){
    let query = \`mutation deletePerson($id:ID!){
      deletePerson(id:$id)
    }\`
    return requestGraphql({url, query, variables, token});
  },

  tableTemplate: function({url}){
    let query = \`query {csvTableTemplatePerson }\`

    return requestGraphql({url,query});
  },
  //simple queries needed in spa components
  vueTable: \`{vueTablePerson{data {id  firstName lastName email countFilteredDogs countFilteredBooks} total per_page current_page last_page prev_page_url next_page_url from to}}\`,

  getAll: function(label, sublabel){
      return \`query
      people($search: searchPersonInput $pagination: paginationInput)
     {people(search:$search pagination:$pagination){id \${label} \${sublabel} } }\`
  },

  getOne: function(subQuery, label, sublabel){
    return \` query readOnePerson($id: ID!, $offset:Int, $limit:Int) {
      readOnePerson(id:$id){ \${subQuery}(pagination:{limit: $limit offset:$offset }){ id \${label} \${sublabel} } } }\`
  }
}
`
module.exports.PersonCreateForm = `
<template>
  <div class="col-xs-5">
    <h4>New person</h4>
    <div id="person-div">
      <div v-if="person" class="content">
        <form id="person-form" v-on:submit.prevent="onSubmit">

          <person-form-elemns mode="create" v-bind:errors="errors" v-bind:person="person"></person-form-elemns>

          <button type="submit" class="btn btn-primary">Create</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import PersonFormElemns from './PersonFormElemns.vue'
import Queries from '../requests/index'

Vue.component('person-form-elemns', PersonFormElemns)

export default {
  data() {
    return {
      loading: false,
      person: {},
      error: null,
      errors: null,
    }
  },
  methods: {
    onSubmit() {
      var t = this;
      var url = this.$baseUrl()
      this.getAssociationsIds()
      Queries.Person.create({url:url, variables: t.person})
      .then(function(response) {
        t.$router.push('/people')
      }).catch(function(res) {
        if(res.response && res.response.data && res.response.data.errors && (res.response.data.errors[0].message === "Validation error")){
          t.errors = res.response.data.errors[0];
        }else{
          let msg = res;
          if(res && res.response && res.response.data && res.response.data.message){
             msg =  res.response.data.message
          }
          t.$root.$emit('globalError', msg)
          t.$router.push('/home')
        }
      })
    },

    getOnlyIds(array){
      return array.map((item)=>{ return item.id; });
    },

    getAssociationsIds(){
              this.person.addDogs = this.getOnlyIds(this.person.addDogs);
              this.person.addBooks = this.getOnlyIds(this.person.addBooks);
          }
  }
}
</script>
`
module.exports.individual_table= `
<template>
  <div class="ui container">
    <filter-bar></filter-bar>
    <div class="inline field pull-left">
      <router-link v-bind:to="'individual'"><button class="ui primary button">Add individual</button></router-link>
      <button class="ui primary button" @click="downloadExampleCsv">CSV Template Table</button>
      <router-link v-bind:to="'/individuals/upload_csv'"><button class="ui primary button">CSV Upload</button></router-link>
      <form :action="this.$exportUrl()"> <input type="hidden" name="model" value="individual" /> <button class="ui primary button" type="submit">Download CSV </button></form>
    </div>
    <vuetable ref="vuetable"
      :api-url="this.$baseUrl()"
      :fields="fields"
      :per-page="20"
      :appendParams="moreParams"
      :http-options="{ headers: {Authorization: \`Bearer \${this.$store.getters.authToken}\`} }"
      pagination-path="data.vueTableIndividual"
      detail-row-component="individual-detail-row"
      data-path="data.vueTableIndividual.data"
      @vuetable:pagination-data="onPaginationData"
      @vuetable:cell-clicked="onCellClicked"
      @vuetable:load-error="onError"
    ></vuetable>
    <div class="vuetable-pagination ui basic segment grid">
      <vuetable-pagination-info ref="paginationInfo"
      ></vuetable-pagination-info>
      <vuetable-pagination ref="pagination"
        @vuetable-pagination:change-page="onChangePage"
      ></vuetable-pagination>
    </div>
  </div>
</template>

<script>
import Vuetable from 'vuetable-2/src/components/Vuetable.vue'
import VuetablePagination from 'vuetable-2/src/components/VuetablePagination.vue'
import VuetablePaginationInfo from 'vuetable-2/src/components/VuetablePaginationInfo.vue'
import individualCustomActions from './individualCustomActions.vue'
import individualDetailRow from './individualDetailRow.vue'
import FilterBar from './FilterBar.vue'

import axios from 'axios'

import Vue from 'vue'
import VueEvents from 'vue-events'
import Queries from '../requests/index'
Vue.use(VueEvents)

Vue.component('individual-custom-actions', individualCustomActions)
Vue.component('individual-detail-row', individualDetailRow)
Vue.component('filter-bar', FilterBar)

export default {
  components: {
    Vuetable,
    VuetablePagination,
    VuetablePaginationInfo,
    individualDetailRow
  },
  data() {
    return {
      fields: [{
          name: 'id',
          title: 'ID',
          titleClass: 'center aligned',
          dataClass: 'right aligned'
        },
        // For now, we do not render checkboxes, as we yet have to provide
        // functions for selected rows.
        //{
        //  name: '__checkbox',
        //  titleClass: 'center aligned',
        //  dataClass: 'center aligned'
        //},
                  {
            name: 'name',
            sortField: 'name'
          },
                {
          name: '__component:individual-custom-actions',
          title: 'Actions',
          titleClass: 'center aligned',
          dataClass: 'center aligned'
        }
      ],
      moreParams: {
        query: Queries.Individual.vueTable
      }
    }
  },
  methods: {
    onPaginationData(paginationData) {
      this.$refs.pagination.setPaginationData(paginationData)
      this.$refs.paginationInfo.setPaginationData(paginationData)
    },
    onChangePage(page) {
      this.$refs.vuetable.changePage(page)
    },
    onCellClicked(data, field, event) {
      console.log('cellClicked: ', field.name)
      this.$refs.vuetable.toggleDetailRow(data.id)
    },
    onFilterSet(filterText) {
      this.moreParams [
        'filter'] = filterText.trim()
      Vue.nextTick(() => this.$refs.vuetable.refresh())
    },
    onFilterReset() {
      this.moreParams = {
        query: Queries.Individual.vueTable
        }
      Vue.nextTick(() => this.$refs.vuetable.refresh())
    },
    onCsvExport () {
      var t = this;
      var url = this.$baseUrl()() + '/individuals/example_csv' + '?array=[' + this.$refs.vuetable.selectedTo.join(",") + ']'

      axios.get(url).then(function (response) {

        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        var blob = new Blob([response.data], {type: "octet/stream"});
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'individual' + '.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      }).catch(function (error) {
        t.error = error
      })
    },
    downloadExampleCsv: function() {
      Queries.Individual.tableTemplate({url: this.$baseUrl()}).then(response =>{
        if(response.data && response.data.data && response.data.data.csvTableTemplateIndividual){
            let file = response.data.data.csvTableTemplateIndividual.join('\\n');
            const url = window.URL.createObjectURL(new Blob([file]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'template_individual.csv');
            document.body.appendChild(link);
            link.click();
        }else{
            this.$root.$emit('globalError', response)
        }
      }).catch( err =>{
        this.$root.$emit('globalError', err)
        this.$router.push('/')
      })
    },
    onError: function(res) {
      var err = (res && res.response && res.response.data && res.response.data.message ?
        res.response.data.message : res)
      this.$root.$emit('globalError', err)
      this.$router.push('/')
    }
  },
  mounted() {
    this.$events.$on('filter-set', eventData => this.onFilterSet(eventData))
    this.$events.$on('filter-reset', e => this.onFilterReset())
  }
}
</script>
`

module.exports.individualDetailView = `
<template>
  <div @click="onClick">
    <div class="inline field">
      <label>id: </label>
      <span>{{rowData.id}}</span>
    </div>
          <div class="inline field">
        <label>name:</label>
        <span>{{rowData.name}}</span>
      </div>

    <div id="individual-transcript_counts-div"  class="row w-100">
      <div class="col">
        <label>transcript_counts:</label>
        <scroll-list class="list-group"
        :url="this.$baseUrl()"
        :idSelected="rowData.id"
        :countQuery="rowData.countFilteredTranscript_counts"
        v-bind:queryOne="transcript_countsSubquery"
        queryOneName="readOneIndividual"
        subQueryName="transcript_countsFilter"
        label="gene"
        subLabel="variable"
        > </scroll-list>
      </div>
    </div>

  </div>
</template>

<script>
import Vue from 'vue'
import scrollListElement from './scrollListElement.vue'
import Queries from '../requests/index'

Vue.component('scroll-list', scrollListElement)

export default {
  props: {
    rowData: {
      type: Object,
      required: true
    },
    rowIndex: {
      type: Number
    }
  },
  computed: {
      transcript_countsSubquery: function(){
        return Queries.Individual.getOne("transcript_countsFilter", "gene", "variable");
      }
    },
  methods: {
    onClick (event) {
      console.log('my-detail-row: on-click', event.target)
    }
  }
}
</script>
`
module.exports.IndividualForm = `
<template>
  <div id="individual-form-elemns-div">

  <input type="hidden" v-model="individual.id"/>


    <div id="individual-name-div" class="form-group">
            <label>name</label>

  <input type="text" v-model="individual.name" class="form-control"/>


      <div id="individual-name-err" v-if="validationError('name')" class="alert alert-danger">
      <ul>
        <li v-for="err in validationError('name')"> {{err.message}}</li>
      </ul>
      </div>
    </div>

    <div id="individual-transcript_counts-div" class="form-group">
      <label>transcript_counts</label>
      <has-many-form-element
        :searchUrl="this.$baseUrl()"
        :idSelected="individual.id"
        :countQuery="individual.countFilteredTranscript_counts"
        :mode="mode"
        :addItems.sync="individual.addTranscript_counts"
        label="gene"
        subLabel ="variable"
        valueKey="id"
        model="Individual"
        targetModel = "Transcript_count"
        removeName="removeTranscript_counts"
        addName="addTranscript_counts"
        v-bind:queryOne = "transcript_countsSubquery"
        queryOneName="readOneIndividual"
        subQueryName="transcript_countsFilter"
        v-bind:query="transcript_countsQuery"
        queryName="transcript_counts"
        >
      </has-many-form-element>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import hasManyFormElemn from './hasManyFormElemn.vue'

Vue.component('has-many-form-element', hasManyFormElemn)
import inflection from 'inflection'
import axios from 'axios'
import Queries from '../requests/index'

export default {
  props: [ 'individual', 'errors', 'mode' ],
  data(){
    return{

    }
  },
  computed: {

    transcript_countsQuery : function(){
        return Queries.Transcript_count.getAll("gene", "variable");
    },

    transcript_countsSubquery : function(){
      return Queries.Individual.getOne("transcript_countsFilter","gene", "variable");
    }
  },
  methods: {
    validationError(modelField) {
      if (this.errors == null) return false;
      return this.errors.details.filter(function (el) {
        return el.path === modelField
      })
    }
  },
	mounted: function() {
    let el = this;
    $(document).ready(function(){
      $('.datepicker').datepicker({
        format: el.$defaultDateFormat(),
        dateFormat: el.$defaultDateFormat()
      })
    })
	},
  created(){
  }
}
</script>
`

module.exports.TranscriptForm =`
<template>
  <div id="transcript_count-form-elemns-div">

  <input type="hidden" v-model="transcript_count.id"/>


    <div id="transcript_count-gene-div" class="form-group">
            <label>gene</label>

  <input type="text" v-model="transcript_count.gene" class="form-control"/>


      <div id="transcript_count-gene-err" v-if="validationError('gene')" class="alert alert-danger">
      <ul>
        <li v-for="err in validationError('gene')"> {{err.message}}</li>
      </ul>
      </div>
    </div>


    <div id="transcript_count-variable-div" class="form-group">
            <label>variable</label>

  <input type="text" v-model="transcript_count.variable" class="form-control"/>


      <div id="transcript_count-variable-err" v-if="validationError('variable')" class="alert alert-danger">
      <ul>
        <li v-for="err in validationError('variable')"> {{err.message}}</li>
      </ul>
      </div>
    </div>


    <div id="transcript_count-count-div" class="form-group">
            <label>count</label>

  <input type="text" v-model="transcript_count.count" class="form-control"/>


      <div id="transcript_count-count-err" v-if="validationError('count')" class="alert alert-danger">
      <ul>
        <li v-for="err in validationError('count')"> {{err.message}}</li>
      </ul>
      </div>
    </div>


    <div id="transcript_count-tissue_or_condition-div" class="form-group">
            <label>tissue_or_condition</label>

  <input type="text" v-model="transcript_count.tissue_or_condition" class="form-control"/>


      <div id="transcript_count-tissue_or_condition-err" v-if="validationError('tissue_or_condition')" class="alert alert-danger">
      <ul>
        <li v-for="err in validationError('tissue_or_condition')"> {{err.message}}</li>
      </ul>
      </div>
    </div>



    <div id="transcript_count-individual-div" class="form-group">
      <label>individual</label>
      <foreign-key-form-element
        :searchUrl = "this.$baseUrl()"
        v-model:foreignKey="transcript_count.individual_id"
        label="name"
                        valueKey="id"
        targetModel = "Individual"
        v-bind:initialInput="individualInitialLabel"
        v-bind:query="individualQuery"
        queryName="individuals"
        >
      </foreign-key-form-element>
    </div>





  </div>
</template>

<script>
import Vue from 'vue'

import foreignKeyFormElement from './foreignKeyFormElement.vue'

Vue.component('foreign-key-form-element', foreignKeyFormElement)

import inflection from 'inflection'
import axios from 'axios'
import Queries from '../requests/index'

export default {
  props: [ 'transcript_count', 'errors', 'mode' ],
  data(){
    return{
    }
  },
  computed: {

    individualQuery: function(){
      return Queries.Individual.getAll("name","");
    },

          individualInitialLabel: function () {
      var x = this.transcript_count.individual
      if (x !== null && typeof x === 'object' &&
          x['name'] !== null &&
          typeof x['name'] !== 'undefined') {
        return x['name']
      } else {
        return ''
      }
    }
        },
  methods: {
    validationError(modelField) {
      if (this.errors == null) return false;
      return this.errors.details.filter(function (el) {
        return el.path === modelField
      })
    }
  },
	mounted: function() {
    let el = this;
    $(document).ready(function(){
      $('.datepicker').datepicker({
        format: el.$defaultDateFormat(),
        dateFormat: el.$defaultDateFormat()
      })
    })
	},
  created(){
  }
}
</script>
`

module.exports.BookRequests = `
import requestGraphql from './request'

export default {

  create : function({url, variables, token}){
  let query = \` mutation addBook(
   $title:String  $genre:String    $publisherId:Int    $addPeople:[ID]  ){
    addBook(
     title:$title   genre:$genre       publisherId:$publisherId      addPeople:$addPeople     ){id  title   genre   }
  }
\`
  return requestGraphql({url, query, variables, token});
},


  readOneBook : function({url, variables, token}){
    let query = \`query readOneBook($id:ID!){
      readOneBook(id:$id){id  title   genre         publisher{ name
         }        countFilteredPeople
    }
  }\`
    return requestGraphql({url, query, variables, token});
  },

  update : function({url, variables, token}){
    let query = \`mutation updateBook($id:ID!
     $title:String  $genre:String      $publisherId:Int      $addPeople:[ID] $removePeople:[ID]     ){
      updateBook(id:$id
       title:$title   genre:$genre         publisherId:$publisherId        addPeople:$addPeople removePeople:$removePeople       ){id  title   genre  }
    }\`

    return requestGraphql({url, query, variables, token});
  },

  deleteBook : function({url, variables, token}){
    let query = \`mutation deleteBook($id:ID!){
      deleteBook(id:$id)
    }\`
    return requestGraphql({url, query, variables, token});
  },

  tableTemplate: function({url}){
    let query = \`query {csvTableTemplateBook }\`

    return requestGraphql({url,query});
  },


  //simple queries needed in spa components

  vueTable : \`{vueTableBook{data {id  title genre publisher{name } countFilteredPeople} total per_page current_page last_page prev_page_url next_page_url from to}}\`,

  getAll: function(label, sublabel){
      return \`query
      books($search: searchBookInput $pagination: paginationInput)
     {books(search:$search pagination:$pagination){id \${label} \${sublabel} } }\`
  },

  getOne: function(subQuery, label, sublabel){
    return \` query readOneBook($id: ID!, $offset:Int, $limit:Int) {
      readOneBook(id:$id){ \${subQuery}(pagination:{limit: $limit offset:$offset }){ id \${label} \${sublabel} } } }\`
  }

}
`

module.exports.BookEdit = `
<template>
  <div class="col-xs-5">
    <h4>Edit book</h4>
    <div id="book-div">
      <div v-if="book" class="content">
        <form id="book-form" v-on:submit.prevent="onSubmit">

          <book-form-elemns mode="edit" v-bind:errors="errors" v-bind:book="book"></book-form-elemns>

          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import BookFormElemns from './BookFormElemns.vue'
import queries from '../requests/book'
import Queries from '../requests/index'

Vue.component('book-form-elemns', BookFormElemns)

export default {
  data() {
    return {
      loading: false,
      book: null,
      error: null,
      errors: null,
    }
  },
  created() {
    this.fetchData()
  },
  watch: {
    '$route': 'fetchData',
  },
  methods: {
    fetchData() {
      var t = this
      t.error = null
      if(this.$route.params.id){
        queries.readOneBook({ url:this.$baseUrl(), variables: {id:this.$route.params.id}})
        .then(function (response) {
            t.book = response.data.data.readOneBook          }, function (err) {
            t.parent.error = err
          })
      }
    },
    onSubmit() {
      var t = this;
      var url = this.$baseUrl()
      this.getAssociationsIds();
      Queries.Book.update({url:url, variables:t.book})
      .then(function (response) {
          t.$router.push('/books')
      }).catch( function (res) {
        if(res.response && res.response.data && res.response.data.errors && (res.response.data.errors[0].message === "Validation error")){
          t.errors = res.response.data.errors[0];
        }else{
          let msg = res;
          if(res && res.response && res.response.data && res.response.data.message){
             msg =  res.response.data.message
          }
          t.$root.$emit('globalError', msg)
          t.$router.push('/home')
        }
      })
    },

    getOnlyIds(array){
      return array.map((item)=>{ return item.id; });
    },

    getAssociationsIds(){
    }
  }
}
</script>
`
module.exports.DogUploadFormCsv = `
<template>
  <div class="col-xs-5 content">
    <ul v-for="record in errors" v-if="errors" class="list-group">
      <li class="list-group-item">
        <div class="alert alert-danger">
          <h4>Errors for dog {{record.record}}</h4>
          <ul>
            <li>{{record.errors.message}}</li>
          </ul>
        </div>
      </li>
    </ul>
    <h4>Upload dogs</h4>
      <form id="dog-form" enctype="multipart/form-data" novalidate v-on:submit.prevent="onSubmit">

        <div class="form-group">
          <input type="file" id="uploadTableFile" ref="uploadTable" class="form-control">
        </div>

        <button type="submit" class="btn btn-primary">Upload</button>
      </form>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'

export default {
  data() {
    return {
      loading: false,
      error: null,
      errors: null,
    }
  },
  methods: {
    onSubmit() {
      var t = this;
      let query = '';

      if (t.$refs.uploadTable.value.indexOf('.xlsx') > 0) {
        var formElm = "xlsx_file"
        query = \`mutation {bulkAddDogXlsx{ id }}\`
      } else {
        var formElm = "csv_file"
        query = \`mutation {bulkAddDogCsv{ id}}\`
      }

      try{
        let formData = new FormData();
        let tableFile = document.querySelector('#uploadTableFile');
        if( (tableFile.files[0].size/ (1024*1024) ) > t.$MAX_UPLOAD_SIZE()){
          throw \`File exceeds limit of \${t.$MAX_UPLOAD_SIZE()} MB\`
        }
        formData.append(formElm, tableFile.files[0]);
        formData.append('query', query)
        axios.post(this.$baseUrl(), formData,  {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/graphql'
          }
        }).then(function(response) {
          t.$router.push('/dogs')
        }).catch(function(res) {
            if (res.response && res.response.data && res.response.data && Array
              .isArray(res.response.data)) {
              t.errors = res.response.data
            } else {
              var err = (res && res.response && res.response.data && res.response
                .data.message ?
                res.response.data.message : res)
              t.$root.$emit('globalError', err)
              t.$router.push('/')
            }
        })
      }catch(err){
        console.log(err)
        t.$root.$emit('globalError', err)
        t.$router.push('/')
      }
    }
  }
}
</script>
`
module.exports.PersonEdit = `
<template>
  <div class="col-xs-5">
    <h4>Edit person</h4>
    <div id="person-div">
      <div v-if="person" class="content">
        <form id="person-form" v-on:submit.prevent="onSubmit">

          <person-form-elemns mode="edit" v-bind:errors="errors" v-bind:person="person"></person-form-elemns>

          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import PersonFormElemns from './PersonFormElemns.vue'
import queries from '../requests/person'
import Queries from '../requests/index'

Vue.component('person-form-elemns', PersonFormElemns)

export default {
  data() {
    return {
      loading: false,
      person: null,
      error: null,
      errors: null,
    }
  },
  created() {
    this.fetchData()
  },
  watch: {
    '$route': 'fetchData',
  },
  methods: {
    fetchData() {
      var t = this
      t.error = null
      if(this.$route.params.id){
        queries.readOnePerson({ url:this.$baseUrl(), variables: {id:this.$route.params.id}})
        .then(function (response) {
            t.person = response.data.data.readOnePerson          }, function (err) {
            t.parent.error = err
          })
      }
    },
    onSubmit() {
      var t = this;
      var url = this.$baseUrl()
      this.getAssociationsIds();
      Queries.Person.update({url:url, variables:t.person})
      .then(function (response) {
        t.$router.push('/people')
      }).catch( function (res) {
        if(res.response && res.response.data && res.response.data.errors && (res.response.data.errors[0].message === "Validation error")){
          t.errors = res.response.data.errors[0];
        }else{
          let msg = res;
          if(res && res.response && res.response.data && res.response.data.message){
             msg =  res.response.data.message
          }
          t.$root.$emit('globalError', msg)
          t.$router.push('/home')
        }
      })
    },

    getOnlyIds(array){
      return array.map((item)=>{ return item.id; });
    },

    getAssociationsIds(){
    }
  }
}
</script>

`

module.exports.PersonForm = `
<template>
  <div id="person-form-elemns-div">

  <input type="hidden" v-model="person.id"/>


    <div id="person-firstName-div" class="form-group">
            <label>firstName</label>

  <input type="text" v-model="person.firstName" class="form-control"/>


      <div id="person-firstName-err" v-if="validationError('firstName')" class="alert alert-danger">
      <ul>
        <li v-for="err in validationError('firstName')"> {{err.message}}</li>
      </ul>
      </div>
    </div>


    <div id="person-lastName-div" class="form-group">
            <label>lastName</label>

  <input type="text" v-model="person.lastName" class="form-control"/>


      <div id="person-lastName-err" v-if="validationError('lastName')" class="alert alert-danger">
      <ul>
        <li v-for="err in validationError('lastName')"> {{err.message}}</li>
      </ul>
      </div>
    </div>


    <div id="person-email-div" class="form-group">
            <label>email</label>

  <input type="text" v-model="person.email" class="form-control"/>


      <div id="person-email-err" v-if="validationError('email')" class="alert alert-danger">
      <ul>
        <li v-for="err in validationError('email')"> {{err.message}}</li>
      </ul>
      </div>
    </div>


    <div id="person-dogs-div" class="form-group">
      <label>dogs</label>
      <has-many-form-element
        :searchUrl="this.$baseUrl()"
        :idSelected="person.id"
        :countQuery="person.countFilteredDogs"
        :mode="mode"
        :addItems.sync="person.addDogs"
        label="name"
                        valueKey="id"
        model="Person"
        targetModel = "Dog"
        removeName="removeDogs"
        addName="addDogs"
        v-bind:queryOne="dogsSubquery"
        queryOneName="readOnePerson"
        subQueryName="dogsFilter"
        v-bind:query="dogsQuery"
        queryName="dogs"
        >
      </has-many-form-element>
    </div>


    <div id="person-books-div" class="form-group">
      <label>books</label>
      <has-many-form-element
        :searchUrl="this.$baseUrl()"
        :idSelected="person.id"
        :countQuery="person.countFilteredBooks"
        :mode="mode"
        :addItems.sync="person.addBooks"
        label="title"
                        valueKey="id"
        model="Person"
        targetModel = "Book"
        removeName="removeBooks"
        addName="addBooks"
        v-bind:queryOne="booksSubquery"
        queryOneName="readOnePerson"
        subQueryName="booksFilter"
        v-bind:query="booksQuery"
        queryName = "books"
        >
      </has-many-form-element>
    </div>



  </div>
</template>

<script>
import Vue from 'vue'


import hasManyFormElemn from './hasManyFormElemn.vue'

Vue.component('has-many-form-element', hasManyFormElemn)
import inflection from 'inflection'
import axios from 'axios'
import Queries from '../requests/index'

export default {
  props: [ 'person', 'errors', 'mode' ],
  data(){
    return{
    }
  },
  computed: {
    dogsQuery : function(){
      return Queries.Dog.getAll("name","");
    },

    dogsSubquery: function(){
      return Queries.Person.getOne("dogsFilter","name", "" );
    },

    booksQuery: function(){
      return Queries.Book.getAll("title","");
    },

    booksSubquery: function(){
      return Queries.Person.getOne("booksFilter", "title","");
    }

  },
  methods: {
    validationError(modelField) {
      if (this.errors == null) return false;
      return this.errors.details.filter(function (el) {
        return el.path === modelField
      })
    }
  },
  mounted: function() {
    let el = this;
    $(document).ready(function(){
      $('.datepicker').datepicker({
        format: el.$defaultDateFormat(),
        dateFormat: el.$defaultDateFormat()
      })
    })
  },
  created(){

  }
}
</script>
`

module.exports.BookCreateForm = `

<template>
  <div class="col-xs-5">
    <h4>New book</h4>
    <div id="book-div">
      <div v-if="book" class="content">
        <form id="book-form" v-on:submit.prevent="onSubmit">

          <book-form-elemns mode="create" v-bind:errors="errors" v-bind:book="book"></book-form-elemns>

          <button type="submit" class="btn btn-primary">Create</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import BookFormElemns from './BookFormElemns.vue'
import Queries from '../requests/index'

Vue.component('book-form-elemns', BookFormElemns)

export default {
  data() {
    return {
      loading: false,
      book: {},
      error: null,
      errors: null,
    }
  },
  methods: {
    onSubmit() {
      var t = this;
      var url = this.$baseUrl()
      this.getAssociationsIds()
      Queries.Book.create({url:url, variables: t.book})
      .then(function(response) {
          t.$router.push('/books')
      }).catch(function(res) {
          if(res.response && res.response.data && res.response.data.errors && (res.response.data.errors[0].message === "Validation error")){
            t.errors = res.response.data.errors[0];
          }else{
            let msg = res;
            if(res && res.response && res.response.data && res.response.data.message){
               msg =  res.response.data.message
            }
            t.$root.$emit('globalError', msg)
            t.$router.push('/home')
          }
      })
    },

    getOnlyIds(array){
      return array.map((item)=>{ return item.id; });
    },

    getAssociationsIds(){
              this.book.addPeople = this.getOnlyIds(this.book.addPeople);
          }
  }
}
</script>

`

module.exports.transcriptCount_table = `
<template>
  <div class="ui container">
    <filter-bar></filter-bar>
    <div class="inline field pull-left">
      <router-link v-bind:to="'transcriptCount'"><button class="ui primary button">Add transcriptCount</button></router-link>
      <button class="ui primary button" @click="downloadExampleCsv">CSV Template Table</button>
      <router-link v-bind:to="'/transcriptCounts/upload_csv'"><button class="ui primary button">CSV Upload</button></router-link>
      <form :action="this.$exportUrl()"> <input type="hidden" name="model" value="transcriptCount" /> <button class="ui primary button" type="submit">Download CSV </button></form>
    </div>
    <vuetable ref="vuetable"
      :api-url="this.$baseUrl()"
      :fields="fields"
      :per-page="20"
      :appendParams="moreParams"
      :http-options="{ headers: {Authorization: \`Bearer \${this.$store.getters.authToken}\`} }"
      pagination-path="data.vueTableTranscriptCount"
      detail-row-component="transcriptCount-detail-row"
      data-path="data.vueTableTranscriptCount.data"
      @vuetable:pagination-data="onPaginationData"
      @vuetable:cell-clicked="onCellClicked"
      @vuetable:load-error="onError"
    ></vuetable>
    <div class="vuetable-pagination ui basic segment grid">
      <vuetable-pagination-info ref="paginationInfo"
      ></vuetable-pagination-info>
      <vuetable-pagination ref="pagination"
        @vuetable-pagination:change-page="onChangePage"
      ></vuetable-pagination>
    </div>
  </div>
</template>

<script>
import Vuetable from 'vuetable-2/src/components/Vuetable.vue'
import VuetablePagination from 'vuetable-2/src/components/VuetablePagination.vue'
import VuetablePaginationInfo from 'vuetable-2/src/components/VuetablePaginationInfo.vue'
import transcriptCountCustomActions from './transcriptCountCustomActions.vue'
import transcriptCountDetailRow from './transcriptCountDetailRow.vue'
import FilterBar from './FilterBar.vue'

import axios from 'axios'

import Vue from 'vue'
import VueEvents from 'vue-events'
import Queries from '../requests/index'
Vue.use(VueEvents)

Vue.component('transcriptCount-custom-actions', transcriptCountCustomActions)
Vue.component('transcriptCount-detail-row', transcriptCountDetailRow)
Vue.component('filter-bar', FilterBar)

export default {
  components: {
    Vuetable,
    VuetablePagination,
    VuetablePaginationInfo,
    transcriptCountDetailRow
  },
  data() {
    return {
      fields: [{
          name: 'id',
          title: 'ID',
          titleClass: 'center aligned',
          dataClass: 'right aligned'
        },
        // For now, we do not render checkboxes, as we yet have to provide
        // functions for selected rows.
        //{
        //  name: '__checkbox',
        //  titleClass: 'center aligned',
        //  dataClass: 'center aligned'
        //},
                  {
            name: 'gene',
            sortField: 'gene'
          },
                  {
            name: 'variable',
            sortField: 'variable'
          },
                  {
            name: 'count',
            sortField: 'count'
          },
                  {
            name: 'tissue_or_condition',
            sortField: 'tissue_or_condition'
          },
                {
          name: '__component:transcriptCount-custom-actions',
          title: 'Actions',
          titleClass: 'center aligned',
          dataClass: 'center aligned'
        }
      ],
      moreParams: {
        query: Queries.TranscriptCount.vueTable
      }
    }
  },
  methods: {
    onPaginationData(paginationData) {
      this.$refs.pagination.setPaginationData(paginationData)
      this.$refs.paginationInfo.setPaginationData(paginationData)
    },
    onChangePage(page) {
      this.$refs.vuetable.changePage(page)
    },
    onCellClicked(data, field, event) {
      console.log('cellClicked: ', field.name)
      this.$refs.vuetable.toggleDetailRow(data.id)
    },
    onFilterSet(filterText) {
      this.moreParams [
        'filter'] = filterText.trim()
      Vue.nextTick(() => this.$refs.vuetable.refresh())
    },
    onFilterReset() {
      this.moreParams = {
        query: Queries.TranscriptCount.vueTable
        }
      Vue.nextTick(() => this.$refs.vuetable.refresh())
    },
    onCsvExport () {
      var t = this;
      var url = this.$baseUrl()() + '/transcriptCounts/example_csv' + '?array=[' + this.$refs.vuetable.selectedTo.join(",") + ']'

      axios.get(url).then(function (response) {

        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        var blob = new Blob([response.data], {type: "octet/stream"});
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'transcriptCount' + '.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      }).catch(function (error) {
        t.error = error
      })
    },
    downloadExampleCsv: function() {
      Queries.TranscriptCount.tableTemplate({url: this.$baseUrl()}).then(response =>{
        if(response.data && response.data.data && response.data.data.csvTableTemplateTranscriptCount){
            let file = response.data.data.csvTableTemplateTranscriptCount.join('\\n');
            const url = window.URL.createObjectURL(new Blob([file]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'template_transcriptCount.csv');
            document.body.appendChild(link);
            link.click();
        }else{
            this.$root.$emit('globalError', response)
        }
      }).catch( err =>{
        this.$root.$emit('globalError', err)
        this.$router.push('/')
      })
    },
    onError: function(res) {
      var err = (res && res.response && res.response.data && res.response.data.message ?
        res.response.data.message : res)
      this.$root.$emit('globalError', err)
      this.$router.push('/')
    }
  },
  mounted() {
    this.$events.$on('filter-set', eventData => this.onFilterSet(eventData))
    this.$events.$on('filter-reset', e => this.onFilterReset())
  }
}
</script>
`

module.exports.personDetailView = `
<template>
  <div @click="onClick">
    <div class="inline field">
      <label>id: </label>
      <span>{{rowData.id}}</span>
    </div>
          <div class="inline field">
        <label>firstName:</label>
        <span>{{rowData.firstName}}</span>
      </div>
          <div class="inline field">
        <label>lastName:</label>
        <span>{{rowData.lastName}}</span>
      </div>
          <div class="inline field">
        <label>email:</label>
        <span>{{rowData.email}}</span>
      </div>

    <div id="person-dogs-div" class="row w-100">
      <div class="col">
        <label>dogs:</label>
        <scroll-list class="list-group"
          :url="this.$baseUrl()"
          :idSelected="rowData.id"
          :countQuery="rowData.countFilteredDogs"
          v-bind:queryOne="dogsSubquery"
          queryOneName="readOnePerson"
          subQueryName="dogsFilter"
          label="name"
          subLabel=""
        > </scroll-list>
      </div>
    </div>

    <div id="person-books-div" class="row w-100">
      <div class="col">
        <label>books:</label>
        <scroll-list class="list-group"
          :url="this.$baseUrl()"
          :idSelected="rowData.id"
          :countQuery="rowData.countFilteredBooks"
          v-bind:queryOne="booksSubquery"
          queryOneName="readOnePerson"
          subQueryName="booksFilter"
          label="title"
          subLabel=""
        > </scroll-list>
      </div>
    </div>

  </div>
</template>

<script>
import Vue from 'vue'
import scrollListElement from './scrollListElement.vue'
import Queries from '../requests/index'

Vue.component('scroll-list', scrollListElement)

export default {
  props: {
    rowData: {
      type: Object,
      required: true
    },
    rowIndex: {
      type: Number
    }
  },
  computed: {

    dogsSubquery: function(){
      return Queries.Person.getOne("dogsFilter","name", "" );
    },

    booksSubquery: function(){
      return Queries.Person.getOne("booksFilter", "title","");
    }

  },
  methods: {
    onClick (event) {
      console.log('my-detail-row: on-click', event.target)
    }
  }
}
</script>

`
module.exports.academicTeamRequests = `

import requestGraphql from './request'

export default {

  create : function({url, variables, token}){
  let query = \` mutation addAcademicTeam(
   $name:String  $department:String  $subject:String      $addMembers:[ID]  ){
    addAcademicTeam(
     name:$name   department:$department   subject:$subject           addMembers:$addMembers     ){id  name   department   subject   }
  }
  \`
  return requestGraphql({url, query, variables, token});
},


  readOneAcademicTeam : function({url, variables, token}){
    let query = \`query readOneAcademicTeam($id:ID!){
      readOneAcademicTeam(id:$id){id  name   department   subject               countFilteredMembers     }
    }\`
    return requestGraphql({url, query, variables, token});
  },

  update : function({url, variables, token}){
    let query = \`mutation updateAcademicTeam($id:ID!
     $name:String  $department:String  $subject:String          $addMembers:[ID] $removeMembers:[ID]     ){
      updateAcademicTeam(id:$id
       name:$name   department:$department   subject:$subject               addMembers:$addMembers removeMembers:$removeMembers       ){id  name   department   subject  }
    }\`

    return requestGraphql({url, query, variables, token});
  },

  deleteAcademicTeam : function({url, variables, token}){
    let query = \`mutation deleteAcademicTeam($id:ID!){
      deleteAcademicTeam(id:$id)
    }\`
    return requestGraphql({url, query, variables, token});
  },

  tableTemplate: function({url}){
    let query = \`query {csvTableTemplateAcademicTeam }\`

    return requestGraphql({url,query});
  },

  //simple queries needed in spa components

  vueTable: \`{vueTableAcademicTeam{data {id  name department subjectcountFilteredMembers} total per_page current_page last_page prev_page_url next_page_url from to}}\`,

  getAll: function(label, sublabel){
    return \`query
    academicTeams($search: searchAcademicTeamInput $pagination: paginationInput)
   {academicTeams(search:$search pagination:$pagination){id \${label} \${sublabel} } }\`
  },

  getOne: function(subQuery,label, sublabel){
    return \`query readOneAcademicTeam($id: ID!, $offset:Int, $limit:Int) {
      readOneAcademicTeam(id:$id){ \${subQuery}(pagination:{limit: $limit offset:$offset }){ id \${label} \${sublabel} } } }\`
  }

}
`

module.exports.routes_book = `
import books from '@/components/books'
import BookCreate from '@/components/BookCreateForm'
import BookEdit from '@/components/BookEditForm'
import BookUploadCsv from '@/components/BookUploadCsvForm'

export default [
  {
    path: '/books',
    name: 'books',
    component: books,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/book/:id',
    name: 'BookEdit',
    component: BookEdit,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/book',
    name: 'BookCreate',
    component: BookCreate,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/books/upload_csv',
    name: 'BookUploadCsv',
    component: BookUploadCsv,
    meta: {
      requiresAuth: true
    }
  }
]
`
