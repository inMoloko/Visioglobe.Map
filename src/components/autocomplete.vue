<script>
  import Vue from 'vue';
  import { mixin as onClickOutside } from 'vue-on-click-outside'
  export default {
    mixins: [onClickOutside],
    data() {
      return {
        open: false,
        current: 0,
        itemSelected: false,
        filter: '',
      }
    },
    model: {
      prop: 'selection',
      event: 'selected'
    },
    props: {
      suggestions: {
        type: Array,
        required: true
      },
      selection: null
    },
    computed: {
      matches() {
        if (!this.filter && this.open) {
          return this.suggestions;
        }
        return this.filter ? this.suggestions.filter((str) => {
          return str.Name.toLocaleLowerCase().indexOf(this.filter.toLocaleLowerCase()) >= 0;
        }) : [];
      },
      openSuggestion() {
        return this.filter !== "" &&
          this.matches.length != 0 &&
          this.open === true;
      }
    },
    created() {
      if (this.selection) {
        this.itemSelected = true;
        this.filter = this.selection.Name;
      }
    },
    methods: {
      enter() {
        this.selection = this.matches[this.current];
        this.$emit('selected', this.selection);
        this.open = false;
        this.itemSelected = true;
        this.filter = this.selection.Name;
      },
      suggestionClick(index) {
        this.selection = this.matches[index];
        this.$emit('selected', this.selection);
        this.open = false;
        this.itemSelected = true;
        this.filter = this.selection.Name;
      },
      up() {
        if (this.current > 0)
          this.current--;
      },
      down() {
        if (this.current < this.matches.length - 1)
          this.current++;
      },
      isActive(index) {
        return index === this.current;
      },
      change() {
        if (this.open == false) {
          this.open = true;
          this.current = 0;
        }
      },
      openList() {
        this.open = true;
      },
      cleanSelectedItem() {
        this.itemSelected = false;
        this.selection = null;
        this.filter = null;
        this.$emit('selected', this.selection);
      },
      inputCleanSelectedItem() {
        this.itemSelected = false;
        this.selection = null;
        this.$emit('selected', this.selection);
      },
      clickOutside() {
        this.open = false;
      }
    }
  }
</script>
<template>
  <div style="position:relative" v-bind:class="{'open':openSuggestion}" v-on-click-outside="clickOutside">
    <input class="input" type="text"
           autofocus
           v-if="!selection"
           v-model="filter"
           @keydown.enter='enter'
           @keydown.down='down'
           @keydown.up='up'
           @click="openList"
           @input='change'
    />
    <input class="input" type="text"
           @input='inputCleanSelectedItem'
           v-if="selection" v-model="filter"/>
    <button class="clean-btn" v-if="selection" type="button" @click="cleanSelectedItem">X</button>
    <ul class="dropdown-menu" style="width:100%" v-if="!selection">
      <li v-for="(suggestion, $index) in matches"
          v-bind:class="{'active': isActive($index)}"
          @click="suggestionClick($index)">
        <span>{{suggestion.Name}}</span>
      </li>
    </ul>
  </div>
</template>
<style>
  .dropdown-menu {
    position: absolute;
    list-style: none;
    z-index: 10;
    background: white;
    max-height: 400px;
    overflow: scroll;
    overflow-x: hidden;
  }

  .input {
    width: 100%;
  }

  .dropdown-menu li {
    padding: 5px;
  }

  .clean-btn {
    position: absolute;
    right: 0;
    top: 0;
    width: 32px;
    height: 32px;
    border: none;
    background-color: transparent;
  }

  .dropdown-menu li:hover, .dropdown-menu li.active {
    background-color: #f1f1f1;
  }
</style>
