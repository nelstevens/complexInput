# complexInput

To run the demo, `devtools::load_all()` and run `./app.R`. Then, paste one of those urls and look at the widget state:

```bash
# First choice: http://127.0.0.1:4082/?_inputs_&plop_config=%7B%22pickerOpts%22%3A%7B%22multiple%22%3Atrue%2C%22dataMaxOptions%22%3A2%2C%22val%22%3A%22Hot%20Dog%2C%20Fries%20and%20a%20Soda%22%7D%2C%22textOpts%22%3A%7B%22label%22%3A%22My%20super%20text%20Input%22%2C%22placeholder%22%3A%22my%20custom%20placeholder%22%7D%7D

# Third choice: http://127.0.0.1:4082/?_inputs_&plop_config=%7B%22pickerOpts%22%3A%7B%22multiple%22%3Atrue%2C%22dataMaxOptions%22%3A2%2C%22val%22%3A%5B%22Sugar%2C%20Spice%20and%20all%20things%20nice%22%5D%7D%2C%22textOpts%22%3A%7B%22label%22%3A%22My%20super%20text%20Input%22%2C%22placeholder%22%3A%22my%20custom%20placeholder%22%7D%7D
```


## Notes

This requires `{shiny}` `1.7.5` since we rely on `data-shiny-no-bind-input` [feature](https://github.com/rstudio/shiny/blob/main/NEWS.md#new-features-and-improvements-1) to prevent Shiny from binding usual input
elements.