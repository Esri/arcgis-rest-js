Vue.component("api-search", {
  template: `
    <div>
      <form v-on:submit.prevent="onSubmit" class="input-group trailer-half leader-0  ">
        <input ref="input" v-model="searchTerm" v-on:keyup.enter="onSubmit" v-on:keyup.up="onSelectPrevious" v-on:keyup.down="onSelectNext" v-on:keyup="onChange" class="input-group-input" type="text" placeholder="Search the API Reference">
        <span class="input-group-button">
          <button type="submit" class="btn"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" class="svg-icon"><path d="M31.607 27.838l-6.133-6.137a1.336 1.336 0 0 0-1.887 0l-.035.035-2.533-2.533-.014.014c3.652-4.556 3.422-11.195-.803-15.42-4.529-4.527-11.875-4.531-16.404 0-4.531 4.531-4.529 11.875 0 16.406 4.205 4.204 10.811 4.455 15.365.848l.004.003-.033.033 2.541 2.54a1.33 1.33 0 0 0 .025 1.848l6.135 6.133a1.33 1.33 0 0 0 1.887 0l1.885-1.883a1.332 1.332 0 0 0 0-1.887zM17.811 17.809a8.213 8.213 0 0 1-11.619 0 8.217 8.217 0 0 1 0-11.622 8.219 8.219 0 0 1 11.619.004 8.216 8.216 0 0 1 0 11.618z"/></svg></button>
        </span>
      </form>

      <div class="panel" v-show="results.length <= 0 && searchTerm">
        No Results.
      </div>

      <div v-show="results.length <= 0 && !searchTerm">
        <slot></slot>
      </div>

      <ul v-show="results.length > 0" class="list-plain">
        <li v-for="result, index in results" class="api-search-result" v-bind:class="[result.icon, {'is-selected': index === selectedResultIndex}]">
          <a v-bind:href="result.url" class="tsd-kind-icon" v-html="result.title"></a>
        </li>
      </ul>
    </div>
    </div>
  `,
  data: function() {
    return {
      results: [],
      selectedResultIndex: 0,
      searchTerm: ""
    };
  },
  props: ['baseUrl'],
  methods: {
    highlightText: function(text, matches) {
      return matches
        .map(match => {
          let characters = text.split("");

          for (let i = match.indices.length - 1; i >= 0; i--) {
            let start = match.indices[i][0];
            let end = match.indices[i][1] + 1;
            let foundMatch = characters.slice(start, end).join("");
            characters.splice(
              start,
              end - start,
              `<span style="text-decoration: underline; font-weight: 500;">${foundMatch}</span>`
            );
          }

          return characters.join("");
        })
        .join();
    },
    onSubmit: function() {
      if (this.results.length && this.results[this.selectedResultIndex]) {
        window.location.href = this.results[this.selectedResultIndex].url;
      }
    },

    search: function(text) {
      return this.index.search(text).map(result => {
        return {
          title: this.highlightText(result.item.title, result.matches),
          icon: result.item.icon,
          url: this.baseUrl + result.item.url
        };
      });
    },

    onChange: function(e) {
      this.results = this.search(e.target.value);

      if (e.keyCode === 38 || e.keyCode === 40) {
        e.preventDefault();
        e.stopPropagation();
      }
    },

    onSelectNext: function(e) {
      this.selectedResultIndex =
        this.selectedResultIndex === this.results.length - 1
          ? 0
          : this.selectedResultIndex + 1;
      e.preventDefault();
      e.stopPropagation();
    },

    onSelectPrevious: function(e) {
      this.selectedResultIndex =
        this.selectedResultIndex === 0
          ? this.results.length - 1
          : this.selectedResultIndex - 1;

      e.preventDefault();
      e.stopPropagation();
    }
  },
  created: function() {
    this.index = new Fuse(ESRI_REST_API_REF_INDEX, {
      shouldSort: true,
      threshold: 0.25,
      location: 0,
      distance: 200,
      maxPatternLength: 32,
      minMatchCharLength: 2,
      findAllMatches: true,
      includeMatches: true,
      keys: ["title"]
    });
  }
});