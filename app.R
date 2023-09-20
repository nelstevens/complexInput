library(shiny)

ui <- function(req) {
  fluidPage(complexInputOutput("plop"))
}

server <- function(input, output, session) {
  
  # Bookmarking
  observeEvent(input$plop_config, {
    reactiveValuesToList(input)
    session$doBookmark()
  })
  observeEvent(input$plop_config, {
    cat(str(input$plop_config))
  })
  onBookmarked(function(url) {
    # TO DO: encode URL to reduce nchar ...
    updateQueryString(url)
  }) 
  
  # Widget configuration
  vals <- reactiveValues(widget_config = list())
  onRestore(function(state) {
    vals$widget_config <- state$input$plop_config
  })
  
  # Render widget once
  output$plop <- renderComplexInput({
    # Load from empty state
    conf <- if (length(vals$widget_config) == 0) {
      # make list with config for four pickerinputs
      list(
      pickerOpts = purrr::map(1:4, \(x) {
        list(id = paste0("picker-", x),
             multiple = TRUE,
             dataMaxOptions = 2)
      }),
      checkbox = list(
        id = "chkbx"
      ),
      pickerOpts2 = purrr::map(1:4, \(x) {
        list(id = paste0("picker2-", x),
             multiple = TRUE,
             dataMaxOptions = 2)
      })
      )
    } else {
      # Load from bookmarked config
      # Try the below URL to restore a given widget state
      # First choice: http://127.0.0.1:4082/?_inputs_&plop_config=%7B%22pickerOpts%22%3A%7B%22multiple%22%3Atrue%2C%22dataMaxOptions%22%3A2%2C%22val%22%3A%22Hot%20Dog%2C%20Fries%20and%20a%20Soda%22%7D%2C%22textOpts%22%3A%7B%22label%22%3A%22My%20super%20text%20Input%22%2C%22placeholder%22%3A%22my%20custom%20placeholder%22%7D%7D
      # Third choice: http://127.0.0.1:4082/?_inputs_&plop_config=%7B%22pickerOpts%22%3A%7B%22multiple%22%3Atrue%2C%22dataMaxOptions%22%3A2%2C%22val%22%3A%5B%22Sugar%2C%20Spice%20and%20all%20things%20nice%22%5D%7D%2C%22textOpts%22%3A%7B%22label%22%3A%22My%20super%20text%20Input%22%2C%22placeholder%22%3A%22my%20custom%20placeholder%22%7D%7D
       vals$widget_config
    }
    complexInput(
      inputId = "plop",
      pickerOpts = conf
    )
  })
  
}

shinyApp(ui, server, enableBookmarking = "url", options = list("shiny.port" = 4082))