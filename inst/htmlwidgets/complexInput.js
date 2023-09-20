HTMLWidgets.widget({

  name: 'complexInput',

  type: 'output',

  factory: function(el, width, height) {

    // TODO: define shared variables for this instance
    
    return {

      renderValue: function(x) {
        // Get config + init HTML elements inside the widget tag
        var opts = x.opts;
        // make empty object for holding pickervalues
        //opts.vals = {};
        // append checkbox
        $(el).append(`
            <div class="checkbox">
              <input type="checkbox" id="checkbox1">
              <label for="checkbox1">
                  enable second array of pickers
              </label>
            </div>
        `)
        opts.pickerOpts.forEach(y => appendPicker($(el), y, opts, x));
        //  wrap div around first set of selects
        $(el).find("select").wrapAll("<div id='hello'>");
        // create second group of selects
        opts.pickerOpts2.forEach(y => appendPicker($(el), y, opts, x));
        // wrap residual selects in div
        $(el).find("select").not("#hello > select").wrapAll("<div id='hello2'>");
        // Needs some delay since selectpicker is not available before ...
        // I suspect this is because Shiny now renders dependencies
        // asynchroneously, while before they were all loaded at start.
        setTimeout(function() {
          var $selectEl = $(el).find('select');
          // See https://developer.snapappointments.com/bootstrap-select/ API
          console.log(opts.pickerOpts.val);
          if (opts.vals !== undefined) {
            Object.keys(opts.vals).forEach(elm => {
              $("#" + elm)
                .selectpicker('val', opts.vals[elm])
                .trigger('changed.bs.select');
            });
          } else {
            $selectEl.first().selectpicker("show");
          }
        }, 1000);
        // Each time the picker changes, we update the list of selections
        // We could imagine a better example where we replace it by
        // another selectInput which conditionally depends on the first one.
        // This avoids to end up with 150 inputs on the R side ...
        $('select').on("changed.bs.select", function(e) {
          if (opts.vals === undefined) {opts.vals = {}}
          // Get picker value and append to vals list
          opts.vals[e.target.id] = $(e.target).selectpicker('val');
          // copy e to avoid optimizing out (@david is there a better way?)
          ev = e;
          // get index of target
          ind = $(el).find("select").index($(e.target));
          // show child picker but hide other descendants
          $(el).find("select").each((idx, elm) => {
            if (idx > ind + 1) {
              $(elm).selectpicker("hide");
            } else {
              $(elm).selectpicker("show");
            }
          });
          // Notify R server
          // Save config for bookmarking
          Shiny.setInputValue(x.id + '_config', opts, {priority: 'event'});
        })
        

      },

      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size

      }

    };
  }
});
// custom function to append pickerinput
appendPicker = function(el, pickerOpts, opts, x) {
  el
    .append(`
              <select 
                id="${pickerOpts.id}"
                class="selectpicker" 
                data-shiny-no-bind-input
                multiple="${pickerOpts.multiple}" 
                data-max-options="${pickerOpts.dataMaxOptions}">
                <option data-tokens="ketchup mustard">Hot Dog, Fries and a Soda</option>
                <option data-tokens="mustard">Burger, Shake and a Smile</option>
                <option data-tokens="frosting">Sugar, Spice and all things nice</option>
              </select>
            `);
}