<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <form>
            <div class="form-control">
              <label for="visioglobeID">
                Visioglobe ID
              </label>
              <input id="visioglobeID" type="text" readonly v-model="visioglobeID">
            </div>
            <div class="form-control">
              <label for="organization">
                Организация
              </label>
              <div class="form-control-reset">
                <v-select id="organization" :options="organizations" v-model="organization" label="Name"></v-select>
                <!--<autocomplete id="organization" v-model="organization"-->
                <!--:suggestions="organizations"></autocomplete>-->
                <button type="button" class="reset-btn" @click="reset">X</button>
              </div>
            </div>
            <div class="form-control">
              <label>
                Изображение
              </label>
              <img class="" :src="url" :alt="organization?organization.Name:'Не выбранно'">
            </div>
          </form>
          <div class="modal-footer">
            <button class="modal-default-button modal-default-button_success" @click="ok">
              OK
            </button>
            <button class="modal-default-button"
                    @click="$emit('close')">
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  import Autocomplete from './autocomplete.vue'
  import vSelect from 'vue-select'

  export default {
    data() {
      return {}
    },
    name: 'organization-edit-popup',
    props: ['visioglobeID', 'organization', 'organizations'],
    components: {Autocomplete, vSelect},
    created() {
    },
    computed: {
      url: function () {
        if (this.organization && this.organization.OrganizationImage) {
          const organizationImage = this.organization.OrganizationImage.find(i => i.Type === 'logo');
          if (organizationImage) {
            return `${__API__}/Content/db/Organizations/${this.organization.OrganizationID}_Logo.${organizationImage.Extension}`;
          }
        }
        return `${__API__}/Content/images/mega-logo.jpg`;
      }
    },
    methods: {
      reset() {
        this.organization = null;
      },
      selected(event) {
        this.organization = event;
        console.log(event);
      },
      ok() {
        let self = this;
        this.$emit('ok', {organization: self.organization, visioglobeID: self.visioglobeID})
      }
    }
  }
</script>
<style>
  .v-select span.selected-tag {
    border: none;
    background-color: transparent;
  }

  .v-select div.dropdown-toggle {
    border-radius: 0;
  }

  .modal-default-button {
    color: #333;
    background-color: #fff;
    padding: 6px 12px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    touch-action: manipulation;
    cursor: pointer;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .modal-default-button:first-child {
    margin-right: 20px;
    margin-left: auto;
  }

  .modal-default-button_success {
    color: #fff;
    background-color: #5cb85c;
    border-color: #4cae4c;
  }

  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
  }

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  .modal-container {
    width: 500px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
  }

  .modal-header h3 {
    margin-top: 0;
    color: #42b983;
  }

  .modal-body {
    margin: 20px 0;
  }

  .modal-footer {
    display: flex;
  }

  .modal-footer:after {
    content: '';
    display: table;
    clear: both;
  }

  .form-control {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
  }

  .form-control label {
    max-width: 100%;
    margin-bottom: 5px;
    font-weight: 700;
  }

  .form-control input {
    height: 34px;
    padding: 6px 12px;
    font-size: 14px;
  }

  .form-control img {
    height: 100px;
    width: 100px;
    object-fit: contain;
  }

  .modal-enter {
    opacity: 0;
  }

  .modal-leave-active {
    opacity: 0;
  }

  .form-control-reset {
    display: flex;
    align-items: stretch;
  }

  .form-control-reset .dropdown {
    flex-grow: 1;
  }

  .form-control-reset .dropdown-toggle {
    border-right: none;
  }

  .reset-btn {
    background-color: transparent;
    border: 1px solid rgba(60,60,60,.26);
    color: rgba(60,60,60,.26);
    border-left: none;
    padding: 0 5px;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
</style>
