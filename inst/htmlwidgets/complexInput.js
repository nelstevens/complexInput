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
        opts.vals = {};
        opts.pickerOpts.forEach(y => appendPicker($(el), y, opts, x));
        
        // Needs some delay since selectpicker is not available before ...
        // I suspect this is because Shiny now renders dependencies
        // asynchroneously, while before they were all loaded at start.
        setTimeout(function() {
          var $selectEl = $(el).find('select');
          // See https://developer.snapappointments.com/bootstrap-select/ API
          $selectEl.selectpicker('show');
          console.log(opts.pickerOpts.val);
          if (opts.pickerOpts.val !== undefined) {
            $selectEl
              .selectpicker('val', opts.pickerOpts.val)
              .trigger('changed.bs.select');
          }
        }, 1000);
        // Each time the picker changes, we update the list of selections
        // We could imagine a better example where we replace it by
        // another selectInput which conditionally depends on the first one.
        // This avoids to end up with 150 inputs on the R side ...
        $('select').on("changed.bs.select", function(e) {
          // Get picker value and append to vals list
          opts.vals[e.target.id] = $(e.target).selectpicker('val');
          // show child picker but hide other descendants
          //
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