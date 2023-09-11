HTMLWidgets.widget({

  name: 'complexInput',

  type: 'output',

  factory: function(el, width, height) {

    // TODO: define shared variables for this instance
    
    return {

      renderValue: function(x) {
        // Get config + init HTML elements inside the widget tag
        var opts = x.opts;
        $(el)
          .append(`
            <select 
              class="selectpicker" 
              data-shiny-no-bind-input
              multiple="${opts.pickerOpts.multiple}" 
              data-max-options="${opts.pickerOpts.dataMaxOptions}">
              <option data-tokens="ketchup mustard">Hot Dog, Fries and a Soda</option>
              <option data-tokens="mustard">Burger, Shake and a Smile</option>
              <option data-tokens="frosting">Sugar, Spice and all things nice</option>
            </select>
          `);
        
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
        
        $(el).append(`
          <div class="form-group shiny-input-container">
            <label class="control-label" id="text-label" for="text">${opts.textOpts.label}</label>
            <input id="text" type="text" class="form-control" value="" data-shiny-no-bind-input placeholder="${opts.textOpts.placeholder}"/>
          </div>
        `);
        
        // Each time the picker changes, we update the textInput container
        // We could imagine a better example where we replace it by
        // another selectInput which conditionally depends on the first one.
        // This avoids to end up with 150 inputs on the R side ...
        $('select').on("changed.bs.select", function(e) {
          // Get picker value
          opts.pickerOpts.val = $(e.target).selectpicker('val');
          // Update UI element
          $(el).find('#text').val(opts.pickerOpts.val);
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