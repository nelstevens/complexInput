#' A selectInput and textInput combined
#'
#' Try to encapsulate 2 Shiny inputs in a single HTML widget
#' which can save its state in the url, through bookmarking
#' 
#' TO DO: find a way to generalise this approach???
#'
#' @import htmlwidgets
#' @import htmltools htmlDependency tagQuery
#' @importFrom jsonlite toJSON
#' @importFrom shinyWidgets pickerInput
#'
#' @export
complexInput <- function(inputId, pickerOpts, width = NULL, height = NULL, elementId = NULL) {
  
  # forward options using x
  x = toJSON(
    list(
      id = inputId,
      opts = pickerOpts
    ), 
    auto_unbox = TRUE, 
    pretty = TRUE
  )
  
  # create widget
  createWidget(
    name = 'complexInput',
    x,
    width = width,
    height = height,
    package = 'complexInput',
    elementId = elementId,
    dependencies = htmlDependency(
      name = "select-picker",
      version = "1.0.0",
      src = c(href = "https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.14/dist"),
      stylesheet = "css/bootstrap-select.min.css",
      script = "js/bootstrap-select.min.js"
    )
  )
}

#' Shiny bindings for complexInput
#'
#' Output and render functions for using complexInput within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a complexInput
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name complexInput-shiny
#'
#' @export
complexInputOutput <- function(outputId, width = '100%', height = '400px'){
  shinyWidgetOutput(outputId, 'complexInput', width, height, package = 'complexInput')
}

#' @rdname complexInput-shiny
#' @export
renderComplexInput <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  shinyRenderWidget(expr, complexInputOutput, env, quoted = TRUE)
}

#' Custom picker input without shiny binding
#'
#' @return An HTML element
#' @export
custom_picker <- function() {
  tagQuery(
    pickerInput(
      "test",
      "Test",
      colnames(iris)
    )
  )$
    find("select")$
    addAttrs("data-shiny-no-bind-input" = NA)$
    allTags()
}

#' Custom text input without shiny binding
#'
#' @return An HTML element
#' @export
custom_text <- function() {
  tagQuery(textInput("text", "Text"))$
    find("input")$
    addAttrs("data-shiny-no-bind-input" = NA)$
    allTags()
}
